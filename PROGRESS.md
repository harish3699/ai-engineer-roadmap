# AI Engineer Roadmap — Build Progress

**Last updated:** 2026-05-05  
**Status:** Phase 0 complete — awaiting design direction approval

---

## Architecture snapshot

| Item | Detail |
|---|---|
| Static-site generator | **None** — hand-rolled HTML + React 18 SPA (Babel Standalone, no build step) |
| Entry point | `index.html` → `app.jsx` + `data.js` |
| Routing | **None** — single page, all content rendered in one scroll |
| CSS | Vanilla CSS with CSS custom properties (`styles.css`, ~53 KB) |
| Fonts | Inter Tight, Instrument Serif, JetBrains Mono (Google Fonts) |
| Themes | Light / dark via `[data-theme]` on `<html>`, persisted in `localStorage` |
| Assets | `uploads/balaji-chippada.png` (2.2 MB instructor photo) |
| Existing prose | **Zero** — modules are bullet-point topic lists only |
| Deployed at | https://ch-balaji.github.io/ai-engineer-roadmap/ |

**Critical gap:** No individual module pages exist. The 62 modules are topic bullets inside tab boxes on the landing page. The entire content build must be architected from scratch.

---

## Inventory

### Phase 1 — Python Foundations · Weeks 1–3 · 8 modules

- [ ] **1.1** Core Python · `/modules/1-1-core-python` · 0 words · `empty`
- [ ] **1.2** Object-Oriented Python · `/modules/1-2-oop-python` · 0 words · `empty`
- [ ] **1.3** Data Structures · `/modules/1-3-data-structures` · 0 words · `empty`
- [ ] **1.4** Error & File Handling · `/modules/1-4-error-file-handling` · 0 words · `empty`
- [ ] **1.5** Working with HTTP APIs · `/modules/1-5-http-apis` · 0 words · `empty`
- [ ] **1.6** Database Connectivity · `/modules/1-6-database-connectivity` · 0 words · `empty`
- [ ] **1.7** FastAPI · `/modules/1-7-fastapi` · 0 words · `empty`
- [ ] **1.8** Async Programming · `/modules/1-8-async-programming` · 0 words · `empty`

### Phase 2 — The Mental Model of an LLM · Week 4 · 5 modules

- [ ] **2.1** What an LLM actually is · `/modules/2-1-what-is-an-llm` · 0 words · `empty`
- [ ] **2.2** How an LLM thinks · `/modules/2-2-how-llm-thinks` · 0 words · `empty`
- [ ] **2.3** Reasoning models vs base models · `/modules/2-3-reasoning-vs-base-models` · 0 words · `empty`
- [ ] **2.4** Reading model evals & benchmarks · `/modules/2-4-model-evals-benchmarks` · 0 words · `empty`
- [ ] **2.5** Comparing the major models · `/modules/2-5-comparing-models` · 0 words · `empty`

### Phase 3 — Prompt Engineering & API Access · Weeks 5–7 · 7 modules

- [ ] **3.1** UI vs API — the hinge moment · `/modules/3-1-ui-vs-api` · 0 words · `empty`
- [ ] **3.2** Calling LLMs via API · `/modules/3-2-calling-llms-api` · 0 words · `empty`
- [ ] **3.3** Prompt anatomy · `/modules/3-3-prompt-anatomy` · 0 words · `empty`
- [ ] **3.4** Core techniques · `/modules/3-4-core-techniques` · 0 words · `empty`
- [ ] **3.5** Applied prompt patterns · `/modules/3-5-applied-patterns` · 0 words · `empty`
- [ ] **3.6** Advanced reasoning techniques · `/modules/3-6-advanced-reasoning` · 0 words · `empty`
- [ ] **3.7** Prompt management & cost in production · `/modules/3-7-prompt-management` · 0 words · `empty`

### Phase 4 — RAG + Evaluation · Weeks 8–12 · 9 modules

- [ ] **4.1** Why RAG exists · `/modules/4-1-why-rag-exists` · 0 words · `empty`
- [ ] **4.2** Embeddings · `/modules/4-2-embeddings` · 0 words · `empty`
- [ ] **4.3** Document ingestion pipeline · `/modules/4-3-document-ingestion` · 0 words · `empty`
- [ ] **4.4** Chunking strategies · `/modules/4-4-chunking-strategies` · 0 words · `empty`
- [ ] **4.5** Chunk enrichment · `/modules/4-5-chunk-enrichment` · 0 words · `empty`
- [ ] **4.6** Vector databases · `/modules/4-6-vector-databases` · 0 words · `empty`
- [ ] **4.7** Hybrid retrieval & next-gen retrievers · `/modules/4-7-hybrid-retrieval` · 0 words · `empty`
- [ ] **4.8** Graph-augmented RAG · `/modules/4-8-graph-rag` · 0 words · `empty`
- [ ] **4.9** RAG evaluation · `/modules/4-9-rag-evaluation` · 0 words · `empty`

### Phase 5 — Tools, MCP, and Single Agents · Weeks 13–16 · 8 modules

- [ ] **5.1** Function calling / tool use · `/modules/5-1-function-calling` · 0 words · `empty`
- [ ] **5.2** Tool design principles · `/modules/5-2-tool-design` · 0 words · `empty`
- [ ] **5.3** MCP — Model Context Protocol · `/modules/5-3-mcp` · 0 words · `empty`
- [ ] **5.4** The ReAct pattern · `/modules/5-4-react-pattern` · 0 words · `empty`
- [ ] **5.5** LangChain agents · `/modules/5-5-langchain-agents` · 0 words · `empty`
- [ ] **5.6** Human in the loop · `/modules/5-6-human-in-the-loop` · 0 words · `empty`
- [ ] **5.7** Tool security · `/modules/5-7-tool-security` · 0 words · `empty`
- [ ] **5.8** Computer use & app SDKs · `/modules/5-8-computer-use` · 0 words · `empty`

### Phase 6 — Memory & Context Engineering · Weeks 17–19 · 7 modules

- [ ] **6.1** The context window as working memory · `/modules/6-1-context-window` · 0 words · `empty`
- [ ] **6.2** Context structure — SYSTEM / CONTEXT / USER · `/modules/6-2-context-structure` · 0 words · `empty`
- [ ] **6.3** Short-term memory — session history · `/modules/6-3-session-memory` · 0 words · `empty`
- [ ] **6.4** Semantic caching · `/modules/6-4-semantic-caching` · 0 words · `empty`
- [ ] **6.5** Episodic memory · `/modules/6-5-episodic-memory` · 0 words · `empty`
- [ ] **6.6** Context compression · `/modules/6-6-context-compression` · 0 words · `empty`
- [ ] **6.7** Long-term memory · `/modules/6-7-long-term-memory` · 0 words · `empty`

### Phase 7 — Multi-Agent Orchestration · Weeks 20–22 · 8 modules

- [ ] **7.1** When to go multi-agent (and when not to) · `/modules/7-1-when-multi-agent` · 0 words · `empty`
- [ ] **7.2** LangGraph fundamentals · `/modules/7-2-langgraph-fundamentals` · 0 words · `empty`
- [ ] **7.3** Common patterns · `/modules/7-3-multi-agent-patterns` · 0 words · `empty`
- [ ] **7.4** Agent-as-tool — the lightweight alternative · `/modules/7-4-agent-as-tool` · 0 words · `empty`
- [ ] **7.5** State management · `/modules/7-5-state-management` · 0 words · `empty`
- [ ] **7.6** A2A — Agent-to-Agent Protocol · `/modules/7-6-a2a-protocol` · 0 words · `empty`
- [ ] **7.7** Frameworks compared · `/modules/7-7-frameworks-compared` · 0 words · `empty`
- [ ] **7.8** Debugging multi-agent systems · `/modules/7-8-debugging` · 0 words · `empty`

### Phase 8 — Guardrails & LLMOps · Weeks 23–24 · 4 modules

- [ ] **8.1** Three-layer guardrail architecture · `/modules/8-1-guardrail-architecture` · 0 words · `empty`
- [ ] **8.2** AWS Bedrock Guardrails · `/modules/8-2-bedrock-guardrails` · 0 words · `empty`
- [ ] **8.3** LLMOps — observability · `/modules/8-3-llmops-observability` · 0 words · `empty`
- [ ] **8.4** LLMOps — evaluation in production · `/modules/8-4-llmops-evaluation` · 0 words · `empty`

### Phase 9 — Cloud Infrastructure & Deployment · Weeks 25–26 · 6 modules

- [ ] **9.1** Storage & data · `/modules/9-1-storage-data` · 0 words · `empty`
- [ ] **9.2** Compute · `/modules/9-2-compute` · 0 words · `empty`
- [ ] **9.3** Networking & access · `/modules/9-3-networking-access` · 0 words · `empty`
- [ ] **9.4** AI-specific services (and other clouds) · `/modules/9-4-ai-services` · 0 words · `empty`
- [ ] **9.5** Deployment & realtime delivery · `/modules/9-5-deployment` · 0 words · `empty`
- [ ] **9.6** Cost & capacity control · `/modules/9-6-cost-control` · 0 words · `empty`

---

### Capstone Projects

- [ ] **Capstone 1** — Distributed Document Ingestion + RAG Pipeline · `/capstones/1-rag-pipeline` · 0 words · `empty`
- [ ] **Capstone 2** — Multi-Agent Natural Language → SQL on E-commerce Data · `/capstones/2-nl-to-sql` · 0 words · `empty`
- [ ] **Capstone 3** — Clinical Trials Knowledge Base · `/capstones/3-clinical-trials` · 0 words · `empty`

---

## Phase gate log

| Phase | Status | Date |
|---|---|---|
| Phase 0 — Discovery | ✅ Complete | 2026-05-05 |
| Phase 1 — Design Direction | ⏳ Awaiting approval | — |
| Phase 2 — Content (modules) | Not started | — |
| Phase 3 — Capstones | Not started | — |
| Phase 4 — Polish & Verify | Not started | — |
