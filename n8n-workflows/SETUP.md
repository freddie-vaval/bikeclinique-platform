# BikeClinique Viral Video Autopilot - Setup Guide

## Workflow Created
Location: `bikeclinique-platform/n8n-workflows/viral-video-autopilot.json`

## What It Does

```
┌─────────────────────────────────────────────────────────────────┐
│                    BIKE_CLINIQUE WORKFLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                               │
│  │  SCHEDULE   │  Mon/Wed/Fri @ 9AM                            │
│  │  TRIGGER    │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐                                               │
│  │   CLAUDE     │  Generates script + thumbnail prompt         │
│  │  (API Call)  │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐                                               │
│  │   NOTION    │  Saves to Content Queue                       │
│  │  (Database) │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │   TIKTOK    │    │   YOUTUBE    │                         │
│  │   (POST)    │    │   (POST)     │                         │
│  └──────────────┘    └──────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Credentials Needed

| Service | How to Get |
|---------|-----------|
| **Claude API** | https://console.anthropic.com/ |
| **TikTok API** | https://developers.tiktok.com/ |
| **YouTube API** | https://console.cloud.google.com/ |
| **Notion** | https://www.notion.so/my-integrations |

## Topics to Generate (Auto-Rotates)

1. "5 bike tricks mechanics hate"
2. "POV: Bike shop day in the life"
3. "What your bike sounds like (and what it means)"
4. "Stop doing this to your bike"
5. "Bike hack that saved me £100"
6. "Before/after: Dirty bike transformation"
7. "How to spot a bad bike shop"
8. "Mobile mechanic vlog"

## Setup Steps

1. Open n8n: http://localhost:5678
2. Import: `bikeclinique-platform/n8n-workflows/viral-video-autopilot.json`
3. Add credentials (API keys)
4. Activate workflow

## Manual Mode (No API Needed)

Want to generate scripts manually without API costs?

```
1. Check this file: docs/video-scripts.md
2. Pick a script
3. Record video in CapCut
4. Post manually to TikTok/YouTube
```

---

# fal.ai Video Generation Workflows

## New Workflows Added (2026-03-12)

### 1. ai-content-generator-fal.json
Full AI content generation pipeline using fal.ai for video.

**Features:**
- Webhook trigger for content requests
- Perplexity for research
- Claude for content generation
- fal.ai HeyGen for video
- Twilio notification when done

**Credentials Needed:**
| Service | How to Get |
|---------|-----------|
| **fal.ai** | https://fal.ai/docs |
| **Perplexity** | https://www.perplexity.io/pro |
| **Claude** | https://console.anthropic.com/ |
| **Twilio** | https://console.twilio.com/ |

### 2. fal-video-generator.json
Simple video generation using fal.ai HeyGen.

**fal.ai Supported Models:**
- `fal-ai/heygen` - AI avatar videos
- `fal-ai/lora` - Custom avatar from image
- `fal-ai/kling` - Video generation
- `fal-ai/flux` - Image generation
- `fal-ai/ideogram` - Text-to-image

## Setup Steps

1. Get fal.ai API key: https://fal.ai/docs
2. Import workflow JSON into n8n
3. Add credentials
4. Activate

## API Usage (fal.ai)

```bash
# Queue a HeyGen video
curl -X POST "https://queue.fal.run/fal-ai/heygen" \
  -H "Authorization: Key $FAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Your script here",
    "subject_type": "avatar"
  }'
```

## Pricing (fal.ai)

- Pay-per-use pricing
- HeyGen video: ~$0.10-0.50/minute
- Image generation: ~$0.004-0.02/image
- Check: https://fal.ai/pricing

---

*Setup: 2026-03-12*
