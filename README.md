# The Agent Engineer — 2026 Roadmap

**Live site:** https://ai-engineer-roadmap-pi.vercel.app

A 26-week, 9-phase, 62-module AI engineering curriculum website built by [Harish Mondepu](https://portfolio-app-theta-one.vercel.app). Covers the full journey from Python fundamentals to production multi-agent systems.

---

## What's Inside

| | |
|---|---|
| **Phases** | 9 |
| **Modules** | 62 |
| **Capstone projects** | 3 |
| **Duration** | 26 weeks |

**Phase overview:**
1. Python Foundations (Wks 1–3)
2. LLM Mental Model (Wk 4)
3. Prompt Engineering & API Access (Wks 5–7)
4. RAG + Evaluation (Wks 8–12) — *Capstone 1*
5. Tools, MCP & Single Agents (Wks 13–16)
6. Memory & Context Engineering (Wks 17–19)
7. Multi-Agent Orchestration (Wks 20–22) — *Capstone 2*
8. Guardrails & LLMOps (Wks 23–24)
9. Cloud Infrastructure & Deployment (Wks 25–26) — *Capstone 3*

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18.3.1 + Babel (CDN, no build step) |
| Styles | Custom CSS — dark/light theme via `data-theme` |
| Fonts | Inter Tight · Instrument Serif · JetBrains Mono |
| Data | `data.js` — full curriculum metadata |
| Deployment | Vercel (static) |
| AI Chat | n8n + Groq (Llama 3.3 70B) + ngrok tunnel |

---

## Project Structure

```
ai-engineer-roadmap/
├── index.html                     # Root SPA (React)
├── app.jsx                        # React app — homepage, phase cards, instructor
├── data.js                        # Full curriculum data (all 62 modules)
├── styles.css                     # Global styles + dark/light theme
├── chat-widget.js                 # AI chat widget (auto-injected on every page)
├── create_workflow.py             # Script to create n8n workflow via API
├── design-explorations/
│   └── direction-combined/
│       ├── module-styles.css      # Shared CSS for all module pages
│       ├── index.html             # Module 1.1 — Core Python
│       ├── module-1-2.html        # Module 1.2 — OOP Python + Pydantic
│       └── module-*.html         # All 62 module pages (Phases 1–9)
```

---

## AI Chat Widget

Every page has a floating chat button (bottom-right) powered by an **n8n AI agent** with the full 9-phase curriculum embedded in its system prompt. Visitors can ask which phase to start from, what any module covers, how long the roadmap takes, and more.

### Architecture

```
Visitor browser
    │  POST /webhook/roadmap-chat
    ▼
ngrok tunnel (permanent static domain)
    │  forwards to localhost:5678
    ▼
n8n (Docker) — Webhook node
    │
    ▼
AI Agent node
    ├── Groq Chat Model (Llama 3.3 70B)
    └── Window Buffer Memory (10-turn context)
    │
    ▼
Respond to Webhook  →  { "output": "..." }
```

### Recreating the n8n Workflow

```bash
# 1. Get a free Groq API key at console.groq.com
# 2. Add your n8n API key to create_workflow.py
# 3. Run:
python create_workflow.py

# 4. In n8n UI:
#    - Open the created workflow
#    - Assign your Groq credential to the Groq node
#    - Click Publish
```

---

## Docker Setup

Both services run as Docker containers with `--restart unless-stopped` — they come back automatically after every machine restart, no manual action needed.

```bash
# n8n (automation + AI agent host)
docker run -d --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  --restart unless-stopped \
  docker.n8n.io/n8nio/n8n

# ngrok (permanent public tunnel to n8n)
# Get free static domain at dashboard.ngrok.com/domains
docker run -d --name ngrok-tunnel \
  --restart unless-stopped \
  -e NGROK_AUTHTOKEN=YOUR_NGROK_TOKEN \
  ngrok/ngrok:latest http \
  --url=YOUR_DOMAIN.ngrok-free.dev \
  host.docker.internal:5678
```

> **Why Docker for ngrok?** Running ngrok inside Docker bypasses Windows Defender, which quarantines the Windows ngrok binary. The container approach is reliable across all restarts.

Update the `WEBHOOK` constant in `chat-widget.js` with your own ngrok static domain.

---

## Local Development

No build step — open any HTML file in a browser or serve locally:

```bash
# Serve with any static server
npx serve .

# Deploy to Vercel production
npx vercel --prod --yes
```

---

## Author

**Harish Mondepu** — Salesforce Engineer · AI Enthusiast · Data Driver
9+ years enterprise systems · 16× Salesforce Certified · Google AI Certified · Anthropic AI Certified

- Portfolio: https://portfolio-app-theta-one.vercel.app
