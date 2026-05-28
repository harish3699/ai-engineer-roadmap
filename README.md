# AI Engineer Roadmap

> A self-paced, project-driven curriculum to go from Python basics to building production multi-agent AI systems — in 26 weeks.

**Live Site → [ai-engineer-roadmap-pi.vercel.app](https://ai-engineer-roadmap-pi.vercel.app/)**

---

## Overview

This is a complete 26-week AI engineering curriculum built and maintained by **Harish Mondepu** — Salesforce Org Architect at Haiilo and Senior Salesforce Consultant at CGI. It was built out of a personal need: a structured, opinionated path to go from zero AI engineering experience to confidently shipping production-grade agentic systems.

The curriculum is organised into **9 phases** and **62 modules**, each with:

- Concept introductions and analogies before every section
- Code walkthroughs with syntax-highlighted examples
- Self-check questions (collapsible)
- Recording scripts for video production
- A capstone project per phase

---

## Curriculum Structure

| Phase | Topic | Modules |
|-------|-------|---------|
| 1 | Python Foundations | 1.1 – 1.8 |
| 2 | LLM Mental Models | 2.1 – 2.5 |
| 3 | Prompt Engineering | 3.1 – 3.7 |
| 4 | RAG & Evaluation | 4.1 – 4.9 |
| 5 | Tools, MCP & Single Agents | 5.1 – 5.8 |
| 6 | Memory & Context Engineering | 6.1 – 6.7 |
| 7 | Multi-Agent Orchestration | 7.1 – 7.8 |
| 8 | Guardrails & LLMOps | 8.1 – 8.4 |
| 9 | Cloud Infrastructure & Deployment | 9.1 – 9.6 |
| Capstone | AskAnything AI (full app) | 5 modules |

---

## Capstone Project — AskAnything AI

The final capstone builds a full production app from scratch:

- **Stack:** Claude Haiku, ChromaDB, sentence-transformers, Tavily, FastAPI, SSE streaming, Render.com
- **Features:** RAG over a personal knowledge base + live web search + streaming chat UI
- **Modules:** Ingest pipeline → RAG engine → tool layer → agent loop → web app → deploy

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| SPA shell | React 18 + Babel CDN (no build step) |
| Module pages | Standalone HTML with shared `module-styles.css` |
| Theme | Dark / light via `data-theme` + `localStorage` |
| Fonts | Inter Tight, Instrument Serif, JetBrains Mono |
| Animations | Intersection Observer scroll-reveal |
| Hosting | Vercel |

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/harish3699/ai-engineer-roadmap.git
cd ai-engineer-roadmap

# Serve with any static server
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser. No build step required.

---

## Project Structure

```
ai-engineer-roadmap/
├── index.html                        # React SPA entry point
├── app.jsx                           # React component tree
├── data.js                           # 9-phase, 62-module metadata
├── styles.css                        # Root SPA styles
└── design-explorations/
    └── direction-combined/
        ├── module-styles.css         # Shared CSS for all modules
        ├── index.html                # Module 1.1 — Core Python
        ├── module-1-2.html           # Module 1.2 — OOP Python
        ├── module-1-3.html           # ...
        ├── module-9-6.html           # Module 9.6 — Cloud Deployment
        ├── capstone-1.html           # Capstone Part 1
        └── capstone-5.html           # Capstone Part 5
```

---

## About the Author

**Harish Mondepu**
Salesforce Org Architect at [Haiilo](https://haiilo.com) · Senior Salesforce Consultant at CGI
9+ years across Healthcare, SaaS, Manufacturing, Financial Services, and High-Tech

- Portfolio: [portfolio-app-theta-one.vercel.app](https://portfolio-app-theta-one.vercel.app)
- LinkedIn: [linkedin.com/in/harish-m-49950b168](https://linkedin.com/in/harish-m-49950b168)
- GitHub: [github.com/harish3699](https://github.com/harish3699)

---

## Contributing

Issues and PRs are welcome for:

- Fixing typos or broken code examples
- Improving explanations or learning outcomes
- Suggesting new tools, frameworks, or platform updates
- Accessibility and responsiveness improvements

Please open an issue first for significant changes.

---

## License

No license has been added yet. If you want to reuse or adapt this project, please open an issue first.
