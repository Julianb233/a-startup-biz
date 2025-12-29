# LiveKit Self-Hosted Implementation Guide

Complete guide to running LiveKit voice calls on your own infrastructure for A Startup Biz.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Server Requirements](#2-server-requirements)
3. [LiveKit Server Installation](#3-livekit-server-installation)
4. [SSL/TLS Configuration](#4-ssltls-configuration)
5. [Environment Variables](#5-environment-variables)
6. [TURN Server Setup](#6-turn-server-setup)
7. [Webhook Configuration](#7-webhook-configuration)
8. [AI Voice Agent Setup](#8-ai-voice-agent-setup)
9. [Call Recording Setup](#9-call-recording-setup)
10. [Database Migration](#10-database-migration)
11. [Testing Checklist](#11-testing-checklist)
12. [Production Deployment](#12-production-deployment)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:

- [ ] A Linux server (Ubuntu 22.04 LTS recommended)
- [ ] Domain name with DNS access (e.g., `livekit.astartupbiz.com`)
- [ ] SSL certificate (or ability to use Let's Encrypt)
- [ ] Docker installed (recommended) OR Go 1.21+ for building from source
- [ ] PostgreSQL database (already configured for a-startup-biz)
- [ ] Ports 443, 7880, 7881, 7882/UDP available

---

## 2. Server Requirements

### Minimum Specifications

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Storage | 20 GB | 50+ GB (if recording locally) |
| Network | 100 Mbps | 1 Gbps |
| OS | Ubuntu 20.04+ | Ubuntu 22.04 LTS |

### Required Ports

```bash
# Firewall rules (UFW example)
sudo ufw allow 443/tcp      # HTTPS/WSS signaling
sudo ufw allow 7880/tcp     # HTTP API (optional, if not behind reverse proxy)
sudo ufw allow 7881/tcp     # WebRTC over TCP
sudo ufw allow 7882/udp     # WebRTC over UDP (primary media)
sudo ufw allow 50000:60000/udp  # WebRTC media ports (optional range)
```

---

## 3. LiveKit Server Installation

### Option A: Docker (Recommended)

#### Step 1: Create configuration directory

```bash
sudo mkdir -p /opt/livekit
cd /opt/livekit
```

#### Step 2: Create configuration file

```bash
sudo nano /opt/livekit/livekit.yaml
```

```yaml
# /opt/livekit/livekit.yaml
port: 7880
rtc:
  port_range_start: 50000
  port_range_end: 60000
  tcp_port: 7881
  use_external_ip: true

redis:
  address: localhost:6379  # Optional: for multi-node clusters

keys:
  # Generate with: openssl rand -base64 32
  APIastartupbiz: "YOUR_GENERATED_SECRET_HERE"

webhook:
  urls:
    - "https://astartupbiz.com/api/voice/webhook"
  api_key: "APIastartupbiz"

logging:
  level: info
  json: true

turn:
  enabled: true
  domain: livekit.astartupbiz.com
  tls_port: 5349
  udp_port: 3478
```

#### Step 3: Generate API credentials

```bash
# Generate a secure API secret
openssl rand -base64 32
# Example output: K7xN2mP9qR4sT6uV8wX0yZ3aB5cD7eF9gH1iJ3kL5mN=

# Use this format for keys in livekit.yaml:
# keys:
#   APIastartupbiz: "K7xN2mP9qR4sT6uV8wX0yZ3aB5cD7eF9gH1iJ3kL5mN="
```

#### Step 4: Create Docker Compose file

```bash
sudo nano /opt/livekit/docker-compose.yml
```

```yaml
# /opt/livekit/docker-compose.yml
version: "3.9"

services:
  livekit:
    image: livekit/livekit-server:latest
    container_name: livekit-server
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./livekit.yaml:/livekit.yaml
    command: ["--config", "/livekit.yaml"]
    environment:
      - LIVEKIT_CONFIG=/livekit.yaml

  redis:
    image: redis:7-alpine
    container_name: livekit-redis
    restart: unless-stopped
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

#### Step 5: Start LiveKit

```bash
cd /opt/livekit
sudo docker compose up -d

# Verify it's running
sudo docker compose logs -f livekit
```

---

### Option B: Direct Binary Installation

```bash
# Download latest release
curl -sSL https://get.livekit.io | bash

# Or download specific version
wget https://github.com/livekit/livekit/releases/download/v1.7.0/livekit_1.7.0_linux_amd64.tar.gz
tar -xzf livekit_1.7.0_linux_amd64.tar.gz
sudo mv livekit-server /usr/local/bin/

# Create systemd service
sudo nano /etc/systemd/system/livekit.service
```

```ini
# /etc/systemd/system/livekit.service
[Unit]
Description=LiveKit Server
After=network.target

[Service]
Type=simple
User=livekit
Group=livekit
ExecStart=/usr/local/bin/livekit-server --config /opt/livekit/livekit.yaml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Create user and start service
sudo useradd -r -s /bin/false livekit
sudo systemctl daemon-reload
sudo systemctl enable livekit
sudo systemctl start livekit
```

---

## 4. SSL/TLS Configuration

### Option A: Caddy (Recommended - Auto SSL)

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

```bash
sudo nano /etc/caddy/Caddyfile
```

```caddyfile
# /etc/caddy/Caddyfile
livekit.astartupbiz.com {
    reverse_proxy localhost:7880

    # WebSocket support
    @websockets {
        header Connection *Upgrade*
        header Upgrade websocket
    }
    reverse_proxy @websockets localhost:7880
}
```

```bash
sudo systemctl restart caddy
```

### Option B: Nginx with Let's Encrypt

```bash
# Install Nginx and Certbot
sudo apt install nginx certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d livekit.astartupbiz.com
```

```nginx
# /etc/nginx/sites-available/livekit
server {
    listen 443 ssl http2;
    server_name livekit.astartupbiz.com;

    ssl_certificate /etc/letsencrypt/live/livekit.astartupbiz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/livekit.astartupbiz.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:7880;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/livekit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. Environment Variables

Update your `.env.local` (or Vercel environment variables):

```bash
# ===========================================
# LiveKit Self-Hosted Configuration
# ===========================================

# Your self-hosted LiveKit server
LIVEKIT_HOST=wss://livekit.astartupbiz.com

# API Key (must match livekit.yaml)
LIVEKIT_API_KEY=APIastartupbiz

# API Secret (must match livekit.yaml)
LIVEKIT_API_SECRET=K7xN2mP9qR4sT6uV8wX0yZ3aB5cD7eF9gH1iJ3kL5mN=

# ===========================================
# AI Voice Agent (OpenAI)
# ===========================================

# Required for AI agent to speak
OPENAI_API_KEY=sk-...

# ===========================================
# Call Recording (Optional)
# ===========================================

# Option 1: S3-compatible storage (MinIO, AWS S3, DigitalOcean Spaces)
LIVEKIT_RECORDING_BUCKET=astartupbiz-recordings
LIVEKIT_RECORDING_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# For self-hosted MinIO:
# AWS_ENDPOINT=https://minio.astartupbiz.com

# Option 2: Local file storage (add to livekit.yaml)
# See Section 9 for local storage setup
```

---

## 6. TURN Server Setup

TURN servers are essential for users behind strict NATs/firewalls.

### Built-in TURN (Recommended)

LiveKit includes built-in TURN. Update your `livekit.yaml`:

```yaml
turn:
  enabled: true
  domain: livekit.astartupbiz.com
  tls_port: 5349
  udp_port: 3478
  # Use the same credentials
  external_tls: true
```

Open additional ports:

```bash
sudo ufw allow 3478/udp   # TURN UDP
sudo ufw allow 5349/tcp   # TURN TLS
```

### External TURN (coturn)

For high-traffic deployments:

```bash
sudo apt install coturn
sudo nano /etc/turnserver.conf
```

```ini
# /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
listening-ip=0.0.0.0
external-ip=YOUR_SERVER_PUBLIC_IP
relay-ip=YOUR_SERVER_PUBLIC_IP
min-port=49152
max-port=65535
fingerprint
lt-cred-mech
realm=livekit.astartupbiz.com
user=livekit:your-turn-password
cert=/etc/letsencrypt/live/livekit.astartupbiz.com/fullchain.pem
pkey=/etc/letsencrypt/live/livekit.astartupbiz.com/privkey.pem
```

---

## 7. Webhook Configuration

### Update livekit.yaml

```yaml
webhook:
  urls:
    - "https://astartupbiz.com/api/voice/webhook"
  api_key: "APIastartupbiz"
```

### Verify Webhook Endpoint

The webhook endpoint at `/api/voice/webhook` is already implemented. It handles:

- `room_started` - Create call record, start recording
- `room_finished` - End call record, stop recording
- `participant_joined` - Track participants
- `participant_left` - Update participant status
- `egress_started` - Recording started
- `egress_ended` - Recording complete, save URL

### Test Webhook Connectivity

```bash
# From your LiveKit server, test the webhook
curl -X POST https://astartupbiz.com/api/voice/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test"}'
```

---

## 8. AI Voice Agent Setup

The AI agent requires OpenAI's Realtime API for voice synthesis.

### Step 1: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key with GPT-4 access
3. Add to environment: `OPENAI_API_KEY=sk-...`

### Step 2: Agent Configuration

The agent is configured in `lib/voice-agent.ts`. Customize the system prompt:

```typescript
// lib/voice-agent.ts
function getDefaultSystemPrompt(): string {
  return `You are a helpful AI support assistant for A Startup Biz.
  You help customers with:
  - Business registration questions
  - Service inquiries
  - Appointment scheduling
  - General support

  Be friendly, professional, and concise.`;
}
```

### Step 3: Voice Options

Available OpenAI TTS voices:
- `alloy` (default - neutral)
- `echo` (male)
- `fable` (British)
- `onyx` (deep male)
- `nova` (female)
- `shimmer` (soft female)

Update in `/api/voice/token/route.ts`:

```typescript
const agentSession = await spawnAgent({
  roomName: finalRoomName,
  voice: 'nova', // Change voice here
});
```

---

## 9. Call Recording Setup

### Option A: S3-Compatible Storage (Recommended)

#### AWS S3

```bash
# Create bucket
aws s3 mb s3://astartupbiz-recordings --region us-east-1

# Set CORS policy
aws s3api put-bucket-cors --bucket astartupbiz-recordings --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["https://astartupbiz.com"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }]
}'
```

Environment variables:

```bash
LIVEKIT_RECORDING_BUCKET=astartupbiz-recordings
LIVEKIT_RECORDING_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

#### Self-Hosted MinIO

```bash
# Install MinIO
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -v /opt/minio/data:/data \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=your-secure-password \
  minio/minio server /data --console-address ":9001"

# Create bucket via console at http://your-server:9001
```

Environment for MinIO:

```bash
LIVEKIT_RECORDING_BUCKET=recordings
AWS_ACCESS_KEY_ID=admin
AWS_SECRET_ACCESS_KEY=your-secure-password
AWS_ENDPOINT=http://localhost:9000
```

### Option B: Local File Storage

Update `livekit.yaml` for local egress:

```yaml
egress:
  file_output:
    local: /opt/livekit/recordings
```

**Note:** Local storage requires additional setup for serving files via HTTPS.

---

## 10. Database Migration

Run the voice calls migration on your database:

```bash
# Connect to your Neon PostgreSQL
psql $DATABASE_URL -f scripts/migrations/010_voice_calls.sql
```

Or run manually:

```sql
-- Create voice_calls table
CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name VARCHAR(255) NOT NULL,
  caller_id VARCHAR(255) NOT NULL,
  callee_id VARCHAR(255),
  call_type VARCHAR(50) DEFAULT 'support',
  status VARCHAR(50) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  recording_url TEXT,
  transcript TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create call_participants table
CREATE TABLE IF NOT EXISTS call_participants (
  id SERIAL PRIMARY KEY,
  call_id UUID REFERENCES voice_calls(id) ON DELETE CASCADE,
  user_id VARCHAR(255),
  participant_name VARCHAR(255),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  is_muted BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_voice_calls_room ON voice_calls(room_name);
CREATE INDEX idx_voice_calls_caller ON voice_calls(caller_id);
CREATE INDEX idx_voice_calls_status ON voice_calls(status);
CREATE INDEX idx_voice_calls_created ON voice_calls(created_at DESC);
CREATE INDEX idx_call_participants_call ON call_participants(call_id);
```

---

## 11. Testing Checklist

### Server Health Checks

```bash
# Check LiveKit is running
curl https://livekit.astartupbiz.com/healthcheck

# Check WebSocket connection
wscat -c wss://livekit.astartupbiz.com

# View server logs
sudo docker compose logs -f livekit
```

### Application Testing

- [ ] **Token Generation**: Call `/api/voice/token` returns valid token
  ```bash
  curl -X POST https://astartupbiz.com/api/voice/token \
    -H "Content-Type: application/json" \
    -H "Cookie: your-auth-cookie" \
    -d '{"roomType": "support"}'
  ```

- [ ] **WebRTC Connection**: Floating call button connects successfully
- [ ] **Audio Quality**: Clear two-way audio with no delay
- [ ] **AI Agent**: Agent joins and responds to speech
- [ ] **Webhook Events**: Events logged in server console
- [ ] **Call History**: Calls appear in `/admin/calls`
- [ ] **Recording**: Recordings save and playback works

### Network Testing

```bash
# Test WebRTC connectivity
npx livekit-cli test-egress \
  --url wss://livekit.astartupbiz.com \
  --api-key APIastartupbiz \
  --api-secret YOUR_SECRET
```

---

## 12. Production Deployment

### Pre-Deployment Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured with required ports
- [ ] LiveKit server running as systemd service
- [ ] Redis running (if multi-node)
- [ ] TURN server accessible
- [ ] Database migration applied
- [ ] Environment variables set in Vercel
- [ ] Webhook URL accessible from LiveKit server
- [ ] S3/MinIO bucket created and accessible
- [ ] OpenAI API key with sufficient credits

### Monitoring Setup

```bash
# Add Prometheus metrics endpoint to livekit.yaml
prometheus:
  port: 7889

# Docker healthcheck
docker compose exec livekit livekit-server --version
```

### Backup Strategy

```bash
# Backup livekit.yaml
cp /opt/livekit/livekit.yaml /opt/livekit/livekit.yaml.backup

# Backup recordings (if local)
rsync -av /opt/livekit/recordings/ /backup/recordings/
```

---

## 13. Troubleshooting

### Common Issues

#### "Voice service not configured"

```bash
# Verify environment variables are set
echo $LIVEKIT_HOST
echo $LIVEKIT_API_KEY
echo $LIVEKIT_API_SECRET
```

#### WebSocket connection failed

1. Check SSL certificate is valid
2. Verify port 443 is open
3. Check Nginx/Caddy proxy configuration
4. Test with: `wscat -c wss://livekit.astartupbiz.com`

#### No audio / one-way audio

1. Check TURN server is running
2. Open UDP ports 3478, 50000-60000
3. Verify `use_external_ip: true` in livekit.yaml
4. Check browser microphone permissions

#### AI agent not responding

1. Verify OpenAI API key is valid
2. Check OpenAI account has credits
3. Review agent spawn logs in `/api/voice/agent`

#### Recording not saving

1. Verify S3 credentials are correct
2. Check bucket CORS policy
3. Ensure egress is enabled in LiveKit
4. Check egress logs: `docker compose logs livekit | grep egress`

### Debug Mode

Enable verbose logging:

```yaml
# livekit.yaml
logging:
  level: debug
  json: false
```

### Support Resources

- [LiveKit Documentation](https://docs.livekit.io)
- [LiveKit GitHub Issues](https://github.com/livekit/livekit/issues)
- [LiveKit Discord](https://livekit.io/discord)

---

## Quick Start Summary

```bash
# 1. Server setup
ssh your-server
sudo mkdir -p /opt/livekit && cd /opt/livekit

# 2. Create config (copy from Section 3)
sudo nano livekit.yaml
sudo nano docker-compose.yml

# 3. Generate credentials
openssl rand -base64 32  # Save this as API secret

# 4. Start LiveKit
sudo docker compose up -d

# 5. Setup SSL (Caddy)
sudo apt install caddy
sudo nano /etc/caddy/Caddyfile  # Add reverse proxy
sudo systemctl restart caddy

# 6. Update your app's .env.local
LIVEKIT_HOST=wss://livekit.astartupbiz.com
LIVEKIT_API_KEY=APIastartupbiz
LIVEKIT_API_SECRET=your-generated-secret

# 7. Run database migration
psql $DATABASE_URL -f scripts/migrations/010_voice_calls.sql

# 8. Deploy to Vercel with new env vars
vercel env add LIVEKIT_HOST
vercel env add LIVEKIT_API_KEY
vercel env add LIVEKIT_API_SECRET

# 9. Test!
curl https://livekit.astartupbiz.com/healthcheck
```

---

**Estimated Setup Time:** 1-2 hours

**Monthly Cost Estimate (Self-Hosted):**
- VPS (4GB RAM): ~$20-40/month
- Storage (S3): ~$5-10/month
- OpenAI API: ~$10-50/month (usage-based)
- **Total:** ~$35-100/month vs LiveKit Cloud pay-per-minute
