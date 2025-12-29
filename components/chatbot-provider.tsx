"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

const WELCOME_MESSAGE = "Hey there! 👋 I'm here to help you learn about Tory's services and how we can help your business grow.\n\nTory is a serial entrepreneur with 46+ years of experience who's started over 100 businesses. He's NOT a consultant—he's lived it.\n\nWhat brings you here today?";

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize welcome message only on client to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MESSAGE,
          timestamp: new Date()
        }
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);
  const [isTyping, setIsTyping] = useState(false);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate thinking delay (replace with actual API call later)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Import knowledge base dynamically to avoid circular dependencies
    const { matchIntent, generateResponse } = await import("@/lib/chatbot-knowledge");

    // Generate response based on user message
    const intent = matchIntent(content);
    const responseContent = generateResponse(intent, content);

    // Add assistant response
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: responseContent,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: new Date()
      }
    ]);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        isTyping,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
        clearMessages
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
