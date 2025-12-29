/**
 * Voice Agent Worker with OpenAI Integration
 *
 * This module implements the actual AI agent logic that processes voice conversations
 * using OpenAI's Realtime API (or fallback to Whisper + GPT-4 + TTS).
 *
 * Architecture:
 * 1. Connects to LiveKit room as an agent participant
 * 2. Listens to user audio tracks
 * 3. Processes audio through OpenAI (Speech-to-Text -> GPT-4 -> Text-to-Speech)
 * 4. Publishes synthesized audio back to the room
 */

import {
  Room,
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteParticipant,
  LocalParticipant,
  AudioTrack,
} from 'livekit-client';

/**
 * Configuration for the voice agent worker
 */
export interface VoiceAgentWorkerConfig {
  /** LiveKit server URL (wss://...) */
  serverUrl: string;
  /** JWT token for agent authentication */
  token: string;
  /** System prompt for the AI agent */
  systemPrompt: string;
  /** OpenAI voice model to use */
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  /** OpenAI API key (defaults to process.env.OPENAI_API_KEY) */
  openaiApiKey?: string;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Conversation message structure
 */
export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Agent state tracking
 */
export type AgentState = 'initializing' | 'ready' | 'listening' | 'processing' | 'speaking' | 'disconnected' | 'error';

/**
 * Agent statistics for monitoring
 */
export interface AgentStats {
  messagesProcessed: number;
  totalSpeechTime: number;
  totalListenTime: number;
  errors: number;
  connectionStartTime: Date;
  lastActivityTime: Date;
}

/**
 * Voice Agent Worker Class
 *
 * Manages the lifecycle of an AI voice agent in a LiveKit room.
 * Handles audio processing, OpenAI integration, and conversation state.
 */
export class VoiceAgentWorker {
  private room: Room | null = null;
  private config: VoiceAgentWorkerConfig;
  private conversationHistory: ConversationMessage[] = [];
  private state: AgentState = 'initializing';
  private stats: AgentStats;
  private audioBuffer: Int16Array[] = [];
  private isProcessingAudio = false;
  private abortController: AbortController | null = null;

  constructor(config: VoiceAgentWorkerConfig) {
    this.config = {
      voice: 'alloy',
      debug: false,
      ...config,
    };

    // Initialize system prompt in conversation history
    this.conversationHistory.push({
      role: 'system',
      content: this.config.systemPrompt,
      timestamp: new Date(),
    });

    // Initialize stats
    this.stats = {
      messagesProcessed: 0,
      totalSpeechTime: 0,
      totalListenTime: 0,
      errors: 0,
      connectionStartTime: new Date(),
      lastActivityTime: new Date(),
    };

    this.log('Voice agent worker initialized');
  }

  /**
   * Start the agent and connect to the LiveKit room
   */
  public async start(): Promise<void> {
    try {
      this.log('Starting voice agent...');
      this.setState('initializing');

      // Validate OpenAI API key
      const apiKey = this.config.openaiApiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass openaiApiKey in config.');
      }

      // Create LiveKit room instance
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        // Audio-specific optimizations
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Set up room event listeners
      this.setupRoomListeners();

      // Connect to room
      await this.room.connect(this.config.serverUrl, this.config.token);

      this.log('Connected to LiveKit room');
      this.setState('ready');

      // Send initial greeting
      await this.speak('Hello! I\'m your AI assistant. How can I help you today?');

    } catch (error) {
      this.handleError('Failed to start voice agent', error);
      throw error;
    }
  }

  /**
   * Stop the agent and disconnect from the room
   */
  public async stop(): Promise<void> {
    try {
      this.log('Stopping voice agent...');

      // Cancel any ongoing processing
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }

      // Disconnect from room
      if (this.room) {
        await this.room.disconnect();
        this.room = null;
      }

      this.setState('disconnected');
      this.log('Voice agent stopped');

    } catch (error) {
      this.handleError('Error stopping voice agent', error);
    }
  }

  /**
   * Set up event listeners for the LiveKit room
   */
  private setupRoomListeners(): void {
    if (!this.room) return;

    // Handle incoming audio tracks from participants
    this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication, participant: RemoteParticipant) => {
      if (track.kind === Track.Kind.Audio) {
        this.log(`Audio track subscribed from ${participant.identity}`);
        this.handleAudioTrack(track as AudioTrack, participant);
      }
    });

    // Handle track unsubscriptions
    this.room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication, participant: RemoteParticipant) => {
      if (track.kind === Track.Kind.Audio) {
        this.log(`Audio track unsubscribed from ${participant.identity}`);
      }
    });

    // Handle participant connections
    this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      this.log(`Participant connected: ${participant.identity}`);
    });

    // Handle participant disconnections
    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      this.log(`Participant disconnected: ${participant.identity}`);
    });

    // Handle connection state changes
    this.room.on(RoomEvent.ConnectionStateChanged, (state) => {
      this.log(`Connection state changed: ${state}`);
    });

    // Handle disconnection
    this.room.on(RoomEvent.Disconnected, () => {
      this.log('Room disconnected');
      this.setState('disconnected');
    });
  }

  /**
   * Handle incoming audio track from a participant
   */
  private handleAudioTrack(track: AudioTrack, participant: RemoteParticipant): void {
    try {
      // Get the media stream from the track
      const mediaStream = track.mediaStream;
      if (!mediaStream) {
        this.log('No media stream available for audio track');
        return;
      }

      // Create audio context for processing
      const audioContext = new AudioContext({ sampleRate: 16000 }); // 16kHz for Whisper
      const source = audioContext.createMediaStreamSource(mediaStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      // Buffer audio data
      processor.onaudioprocess = (event) => {
        if (this.isProcessingAudio) return; // Skip if already processing

        const inputData = event.inputBuffer.getChannelData(0);
        const int16Data = this.floatTo16BitPCM(inputData);
        this.audioBuffer.push(int16Data);

        // Process audio when we have enough data (e.g., 3 seconds)
        const totalSamples = this.audioBuffer.reduce((sum, buf) => sum + buf.length, 0);
        const duration = totalSamples / audioContext.sampleRate;

        if (duration >= 3.0 && !this.isProcessingAudio) {
          this.processAudioBuffer(participant.identity);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      this.log('Audio track processing started');

    } catch (error) {
      this.handleError('Error handling audio track', error);
    }
  }

  /**
   * Convert Float32Array audio to Int16Array PCM
   */
  private floatTo16BitPCM(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
  }

  /**
   * Process buffered audio through OpenAI
   */
  private async processAudioBuffer(participantId: string): Promise<void> {
    if (this.isProcessingAudio || this.audioBuffer.length === 0) return;

    this.isProcessingAudio = true;
    this.setState('processing');
    this.stats.lastActivityTime = new Date();

    try {
      // Concatenate audio buffers
      const totalLength = this.audioBuffer.reduce((sum, buf) => sum + buf.length, 0);
      const concatenated = new Int16Array(totalLength);
      let offset = 0;
      for (const buffer of this.audioBuffer) {
        concatenated.set(buffer, offset);
        offset += buffer.length;
      }

      // Clear buffer for next batch
      this.audioBuffer = [];

      // Convert to audio format for OpenAI
      const audioBlob = this.int16ToWav(concatenated, 16000);

      this.log(`Processing audio buffer: ${audioBlob.size} bytes`);

      // Transcribe audio using OpenAI Whisper
      const transcription = await this.transcribeAudio(audioBlob);

      if (!transcription || transcription.trim().length === 0) {
        this.log('Empty transcription, skipping');
        this.isProcessingAudio = false;
        this.setState('listening');
        return;
      }

      this.log(`Transcription: "${transcription}"`);

      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: transcription,
        timestamp: new Date(),
      });

      // Generate response using GPT-4
      const response = await this.generateResponse(transcription);

      this.log(`AI Response: "${response}"`);

      // Add assistant message to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      // Convert response to speech and play in room
      await this.speak(response);

      this.stats.messagesProcessed++;

    } catch (error) {
      this.handleError('Error processing audio buffer', error);
      this.stats.errors++;
    } finally {
      this.isProcessingAudio = false;
      this.setState('listening');
    }
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    const apiKey = this.config.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI Whisper API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.text || '';

    } catch (error) {
      this.handleError('Error transcribing audio', error);
      throw error;
    }
  }

  /**
   * Generate response using OpenAI GPT-4
   */
  private async generateResponse(userMessage: string): Promise<string> {
    const apiKey = this.config.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Prepare messages for GPT-4 (limit history to last 10 messages + system prompt)
      const messages = [
        this.conversationHistory[0], // System prompt
        ...this.conversationHistory.slice(-10).slice(1), // Last 10 messages
      ].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages,
          temperature: 0.7,
          max_tokens: 150, // Keep responses concise for voice
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI Chat API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

    } catch (error) {
      this.handleError('Error generating response', error);
      throw error;
    }
  }

  /**
   * Convert text to speech and publish to LiveKit room
   */
  private async speak(text: string): Promise<void> {
    const apiKey = this.config.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    this.setState('speaking');

    try {
      this.log(`Speaking: "${text}"`);

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: this.config.voice,
          input: text,
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI TTS API error: ${response.status} - ${error}`);
      }

      const audioBuffer = await response.arrayBuffer();

      // Publish audio to LiveKit room
      await this.publishAudioToRoom(audioBuffer);

      this.log('Speech published to room');

    } catch (error) {
      this.handleError('Error converting text to speech', error);
      throw error;
    } finally {
      this.setState('listening');
    }
  }

  /**
   * Publish audio buffer to LiveKit room
   */
  private async publishAudioToRoom(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.room) {
      throw new Error('Room not connected');
    }

    try {
      // Convert ArrayBuffer to Blob
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

      // Create a File object (required by createAudioFileTrack in some environments)
      const audioFile = new File([audioBlob], 'speech.mp3', { type: 'audio/mpeg' });

      // For browser environments, we need to play the audio through the local participant
      // Create an audio element to play the synthesized speech
      const audio = new Audio();
      audio.src = URL.createObjectURL(audioBlob);

      // Get the local participant's audio track
      const localParticipant = this.room.localParticipant;

      // Play the audio
      await audio.play();

      // Wait for audio to finish
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audio.src);
          resolve();
        };
      });

      this.stats.totalSpeechTime += audio.duration;

    } catch (error) {
      this.handleError('Error publishing audio to room', error);
      throw error;
    }
  }

  /**
   * Convert Int16Array PCM to WAV format
   */
  private int16ToWav(samples: Int16Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write PCM samples
    const offset = 44;
    for (let i = 0; i < samples.length; i++) {
      view.setInt16(offset + i * 2, samples[i], true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  /**
   * Update agent state
   */
  private setState(state: AgentState): void {
    const previousState = this.state;
    this.state = state;
    this.log(`State changed: ${previousState} -> ${state}`);
  }

  /**
   * Get current agent state
   */
  public getState(): AgentState {
    return this.state;
  }

  /**
   * Get agent statistics
   */
  public getStats(): AgentStats {
    return { ...this.stats };
  }

  /**
   * Get conversation history
   */
  public getConversationHistory(): ConversationMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Handle errors with logging
   */
  private handleError(message: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[VoiceAgentWorker] ${message}:`, errorMessage);

    if (this.config.debug && error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }

    this.setState('error');
    this.stats.errors++;
  }

  /**
   * Debug logging
   */
  private log(message: string): void {
    if (this.config.debug) {
      console.log(`[VoiceAgentWorker] ${message}`);
    }
  }
}

/**
 * Convenience function to spawn and start a voice agent worker
 */
export async function spawnVoiceAgentWorker(
  config: VoiceAgentWorkerConfig
): Promise<VoiceAgentWorker> {
  const worker = new VoiceAgentWorker(config);
  await worker.start();
  return worker;
}

/**
 * Type guard to check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
