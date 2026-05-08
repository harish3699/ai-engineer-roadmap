const { useState, useEffect, useRef } = React;

function moduleUrl(n) {
  if (n === '1.1') return 'design-explorations/direction-combined/index.html';
  return `design-explorations/direction-combined/module-${n.replace('.', '-')}.html`;
}

function PhaseTabBox({ phase }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = phase.sections[activeTab];
  return (
    <div className="tabbox">
      <div className="tabbox__tabs" role="tablist">
        {phase.sections.map((s, i) => (
          <button key={i} role="tab" aria-selected={i === activeTab}
            className={`tabbox__tab ${i === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}>
            <span className="tabbox__tab-num">{s.n}</span>
            <span className="tabbox__tab-title">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="tabbox__panel" role="tabpanel">
        <div className="tabbox__panel-content" key={activeTab}>
          <div className="tabbox__panel-num">Module {section.n}</div>
          <h3 className="tabbox__panel-title">{section.title}</h3>
          <ul className="tabbox__items">
            {section.items.map((item, ii) => (
              <li key={ii} className="tabbox__item">
                <span className="tabbox__item-marker">{String(ii + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a className="tabbox__open-btn" data-color={phase.color} href={moduleUrl(section.n)}>
            Open module {section.n}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

const isMac = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');

function CommandPalette({ open, onClose, onJumpPhase, onJumpCapstone }) {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const items = React.useMemo(() => {
    const out = [];
    window.ROADMAP.forEach((phase, pi) => {
      out.push({
        kind: 'phase',
        label: phase.title,
        sub: `Phase ${String(phase.id).padStart(2, '0')} · ${phase.weeks}`,
        haystack: `${phase.title} ${phase.short} ${phase.summary}`.toLowerCase(),
        action: () => onJumpPhase(pi)
      });
      phase.sections.forEach((s) => {
        out.push({
          kind: 'module',
          label: s.title,
          sub: `Module ${s.n} · ${phase.title}`,
          haystack: `${s.title} ${s.n} ${(s.items || []).join(' ')}`.toLowerCase(),
          action: () => onJumpPhase(pi)
        });
      });
    });
    window.CAPSTONES.forEach((c, ci) => {
      out.push({
        kind: 'capstone',
        label: c.title,
        sub: `Capstone ${c.n} · ${c.domain}`,
        haystack: `${c.title} ${c.domain} ${(c.build || []).join(' ')}`.toLowerCase(),
        action: () => onJumpCapstone(ci)
      });
    });
    return out;
  }, []);

  const q = query.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!q) return items.slice(0, 30);
    const tokens = q.split(/\s+/).filter(Boolean);
    return items
      .map(item => {
        const allMatch = tokens.every(t => item.haystack.includes(t));
        if (!allMatch) return null;
        let score = 0;
        if (item.label.toLowerCase().includes(q)) score += 50;
        if (item.label.toLowerCase().startsWith(q)) score += 30;
        if (item.kind === 'phase') score += 5;
        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(x => x.item);
  }, [q, items]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlight(0);
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => { setHighlight(0); }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight(h => Math.min(results.length - 1, h + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight(h => Math.max(0, h - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[highlight];
        if (r) { r.action(); onClose(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, highlight, onClose]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${highlight}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  if (!open) return null;
  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search modules" onClick={onClose}>
      <div className="cmdk__panel" onClick={e => e.stopPropagation()}>
        <div className="cmdk__input-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="cmdk__input"
            type="text"
            placeholder="Search phases, modules, capstones…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search"
            aria-controls="cmdk-list"
            aria-activedescendant={results[highlight] ? `cmdk-item-${highlight}` : undefined} />
          <kbd className="cmdk__esc">esc</kbd>
        </div>
        <div className="cmdk__list" ref={listRef} id="cmdk-list" role="listbox">
          {results.length === 0 ? (
            <div className="cmdk__empty">No matches for "{query}"</div>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                id={`cmdk-item-${i}`}
                data-idx={i}
                role="option"
                aria-selected={i === highlight}
                className={`cmdk__item ${i === highlight ? 'is-active' : ''}`}
                onMouseMove={() => setHighlight(i)}
                onClick={() => { r.action(); onClose(); }}>
                <span className={`cmdk__kind cmdk__kind--${r.kind}`}>{r.kind}</span>
                <span className="cmdk__label">{r.label}</span>
                <span className="cmdk__sub">{r.sub}</span>
              </button>
            ))
          )}
        </div>
        <div className="cmdk__hint">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> jump</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [dockVisible, setDockVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('roadmap-theme');
    if (stored) return stored;
    if (document.documentElement.dataset.theme) return document.documentElement.dataset.theme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const phaseRefs = useRef([]);
  const capstoneRefs = useRef([]);
  const agendaRef = useRef(null);
  const dockNodeRefs = useRef([]);
  const progressFillRef = useRef(null);
  const progressDotRef = useRef(null);
  const scrollFrame = useRef(null);
  const lastActiveIdx = useRef(-1);
  const lastDockVisible = useRef(false);
  const phaseMetrics = useRef([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('roadmap-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      } else if (e.key === '/' && !searchOpen) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  useEffect(() => {
    const recomputeMetrics = () => {
      phaseMetrics.current = phaseRefs.current.filter(Boolean).map(el => {
        const pt = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
        return { el, paddingTop: pt };
      });
    };

    const update = () => {
      scrollFrame.current = null;
      const scrollTop = window.scrollY;
      const winH = window.innerHeight;
      const metrics = phaseMetrics.current;
      if (!metrics.length) return;

      const firstPhaseTop = metrics[0].el.getBoundingClientRect().top + scrollTop;
      const visible = scrollTop > firstPhaseTop - winH * 0.15;
      if (visible !== lastDockVisible.current) {
        lastDockVisible.current = visible;
        setDockVisible(visible);
      }

      const navOffset = window.innerWidth <= 700 ? 24 : 56;
      const firstTop = metrics[0].el.getBoundingClientRect().top + scrollTop + metrics[0].paddingTop - navOffset;
      const lastM = metrics[metrics.length - 1];
      const lastTop = lastM.el.getBoundingClientRect().top + scrollTop + lastM.paddingTop - navOffset;
      const phaseRange = lastTop - firstTop;
      const phaseProgress = phaseRange <= 0 ? 0 : (scrollTop - firstTop) / phaseRange;
      const pct = Math.min(1, Math.max(0, phaseProgress)) * 100;
      if (progressFillRef.current) progressFillRef.current.style.width = pct + '%';
      if (progressDotRef.current) progressDotRef.current.style.left = pct + '%';

      const probeLine = window.innerWidth <= 700 ? 96 : 160;
      let active = 0;
      for (let i = 0; i < metrics.length; i++) {
        const rect = metrics[i].el.getBoundingClientRect();
        if (rect.top + metrics[i].paddingTop <= probeLine) active = i;
      }
      if (active !== lastActiveIdx.current) {
        lastActiveIdx.current = active;
        dockNodeRefs.current.forEach((node, i) => {
          if (!node) return;
          const isActive = i === active;
          node.classList.toggle('active', isActive);
          node.classList.toggle('passed', i < active);
          if (isActive) node.setAttribute('aria-current', 'true');
          else node.removeAttribute('aria-current');
        });
      }
    };

    const onScroll = () => {
      if (scrollFrame.current != null) return;
      scrollFrame.current = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      recomputeMetrics();
      onScroll();
    };

    recomputeMetrics();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (scrollFrame.current != null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToElement = (el, mobileOffset = 24, desktopOffset = 72, includePadding = false) => {
    if (!el) return;
    const navOffset = window.innerWidth <= 700 ? mobileOffset : desktopOffset;
    const pt = includePadding
      ? parseFloat(window.getComputedStyle(el).paddingTop) || 0
      : 0;
    const top = el.getBoundingClientRect().top + window.scrollY + pt - navOffset;
    const prefersReduced = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 700;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReduced || isMobile ? 'auto' : 'smooth'
    });
  };

  const scrollToPhase = (i) => {
    const el = phaseRefs.current[i];
    if (!el) return;
    scrollToElement(el, 24, 56, true);
  };
  const scrollToCapstone = (i) => scrollToElement(capstoneRefs.current[i], 24, 72, false);
  const scrollToAgenda = () => scrollToElement(agendaRef.current, 24, 72, false);

  const totalSections = window.ROADMAP.reduce((a, p) => a + p.sections.length, 0);

  const capstoneTiles = window.CAPSTONES.map((c, i) => ({
    n: c.n,
    title: c.title.split(/[—:]|on /)[0].trim(),
    domain: c.domain,
    color: ['pink', 'mustard', 'teal-deep'][i]
  }));

  return (
    <React.Fragment>
      <nav className="nav" aria-label="Primary">
        <div className="nav__brand">
          <span className="nav__brand-mark" aria-hidden="true">A</span>
          <span><b>Agent Engineer</b> · by Harish Mondepu</span>
        </div>
        <div className="nav__right">
          <div className="nav__meta" aria-hidden="true">
            <span><b>26</b> weeks</span>
            <span><b>9</b> phases</span>
            <span><b>3</b> capstones</span>
          </div>
          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search (Cmd+K)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search</span>
            <kbd>{isMac ? '⌘' : 'Ctrl'}K</kbd>
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}>
            <span className="theme-toggle__track">
              <span className="theme-toggle__thumb" aria-hidden="true">
                {theme === 'light' ? '☀' : '☾'}
              </span>
            </span>
          </button>
        </div>
      </nav>

      <main id="main">
      {/* HERO */}
      <header className="hero" data-screen-label="01 Hero">
        <div className="hero__grid-bg" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__left">
            <div className="hero__eyebrow">
              <span className="hero__eyebrow-tag">agent-engineer</span>
              <span className="hero__eyebrow-sep" aria-hidden="true" />
              2026 · 26 Weeks · 9 Phases
            </div>
            <h1 className="hero__title">
              Build AI systems<br />
              that actually <em>ship.</em>
            </h1>
            <p className="hero__sub">
              The complete engineering path from Python fundamentals to production
              multi-agent systems. Every module built from real deployments —
              <em> no theory padding, no slides-only content.</em>
            </p>
            <div className="hero__actions">
              <button className="hero__cta hero__cta--primary" type="button" onClick={scrollToAgenda}>
                Explore the roadmap
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="hero__cta hero__cta--ghost" type="button" onClick={() => setSearchOpen(true)}>
                Browse modules
              </button>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-num">{window.ROADMAP.length}</div>
                <div className="hero__stat-label">Phases</div>
              </div>
              <div className="hero__stat-sep" aria-hidden="true" />
              <div className="hero__stat">
                <div className="hero__stat-num">{totalSections}</div>
                <div className="hero__stat-label">Modules</div>
              </div>
              <div className="hero__stat-sep" aria-hidden="true" />
              <div className="hero__stat">
                <div className="hero__stat-num">26</div>
                <div className="hero__stat-label">Weeks</div>
              </div>
              <div className="hero__stat-sep" aria-hidden="true" />
              <div className="hero__stat">
                <div className="hero__stat-num">{window.CAPSTONES.length}</div>
                <div className="hero__stat-label">Capstones</div>
              </div>
            </div>
          </div>
          <div className="hero__right" aria-hidden="true">
            <div className="hero__phase-grid">
              {window.ROADMAP.map((p) => (
                <div key={p.id} className="hero__phase-chip" data-color={p.color}>
                  <span className="hero__phase-chip-num">{String(p.id).padStart(2, '0')}</span>
                  <span className="hero__phase-chip-name">{p.short}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* AGENDA — 9 phase tiles */}
      <section className="agenda reveal" ref={agendaRef} data-screen-label="02 Agenda">
        <div className="agenda__head">
          <h2 className="agenda__title">What we'll <em>cover.</em></h2>
          <div className="agenda__sub">
            Every module grounded in real deployments — not slides, not theory.
          </div>
        </div>
        <div className="agenda__grid agenda__grid--phases">
          {window.ROADMAP.map((p) => (
            <button key={p.id}
              type="button"
              className="agenda__tile"
              data-color={p.color}
              aria-label={`Jump to phase ${String(p.id).padStart(2, '0')}: ${p.title}`}
              onClick={() => scrollToPhase(p.id - 1)}>
              <div className="agenda__tile-glow" />
              <div className="agenda__tile-num">{String(p.id).padStart(2, '0')}</div>
              <div className="agenda__tile-title">{p.short}</div>
              <div className="agenda__tile-weeks">{p.weeks}</div>
              <div className="agenda__tile-arrow">→</div>
            </button>
          ))}
        </div>

        {/* Projects in their own row */}
        <div className="agenda__projects-head">
          <span className="agenda__projects-label">◆ Capstone Projects</span>
          <span className="agenda__projects-line" />
        </div>
        <div className="agenda__grid agenda__grid--projects">
          {capstoneTiles.map((c) => (
            <button key={`cap-${c.n}`}
              type="button"
              className="agenda__tile is-capstone"
              data-color={c.color}
              aria-label={`Jump to capstone project ${c.n}: ${c.title}`}
              onClick={() => scrollToCapstone(c.n - 1)}>
              <div className="agenda__tile-glow" />
              <div className="agenda__tile-cap-label">Project {c.n}</div>
              <div className="agenda__tile-title">{c.title}</div>
              <div className="agenda__tile-domain">{c.domain}</div>
              <div className="agenda__tile-arrow">→</div>
            </button>
          ))}
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="instructor reveal" data-screen-label="03 Instructor">
        <div className="instructor__card">
          <div className="instructor__photo">
            <img src="https://portfolio-app-theta-one.vercel.app/harish-profile.jpg" alt="Harish Mondepu" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div className="instructor__body">
            <div className="instructor__label">Your Instructor</div>
            <h3 className="instructor__name">Harish Mondepu</h3>
            <div className="instructor__role">Salesforce Engineer · AI Enthusiast · Data Driver</div>
            <p className="instructor__bio">
              I spent <span>9+ years building production enterprise systems</span> across healthcare, SaaS,
              manufacturing, and financial services before making the move into AI engineering. I hold
              <span> 16 Salesforce certifications</span>, a Google AI certification, and an Anthropic AI certification —
              and I built this roadmap because the one I needed didn't exist. Every module
              is exactly what I had to figure out the hard way, laid out clearly so you don't have to.
              If you're an engineer who wants to ship AI systems that actually work in production,
              this is where you start.
            </p>
            <div className="instructor__chips">
              <span className="instructor__chip">9+ Yrs Engineering</span>
              <span className="instructor__chip">16× Salesforce Certified</span>
              <span className="instructor__chip">LangGraph</span>
              <span className="instructor__chip">Agentic AI</span>
              <span className="instructor__chip">Production RAG</span>
              <span className="instructor__chip">LLMOps</span>
            </div>
          </div>
          <div className="instructor__cta">
            <div className="instructor__connect-label">Connect with me</div>
            <div className="instructor__socials">
              <a className="instructor__social" href="https://www.linkedin.com/in/harish-mondepu/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Harish Mondepu on LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.7 9.2H3.2v11.3h3.5V9.2ZM4.9 3.5C3.8 3.5 3 4.3 3 5.4s.8 1.9 1.9 1.9 1.9-.8 1.9-1.9-.8-1.9-1.9-1.9Zm15.6 10.6c0-3.3-1.8-5.2-4.4-5.2-1.8 0-2.8 1-3.2 1.7V9.2H9.5v11.3H13v-6.1c0-1.6.8-2.5 2-2.5s1.9.8 1.9 2.5v6.1h3.6v-6.4Z" />
                </svg>
              </a>
              <a className="instructor__social" href="https://portfolio-app-theta-one.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Harish Mondepu's Portfolio">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
              <a className="instructor__social" href="https://github.com/harishmondepu-haiilo" target="_blank" rel="noopener noreferrer" aria-label="Harish Mondepu on GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DOCK */}
      <div className={`dock ${dockVisible ? 'visible' : ''}`}>
        {window.ROADMAP.map((p, i) => (
          <button key={p.id}
            type="button"
            aria-label={`Jump to phase ${String(p.id).padStart(2, '0')}: ${p.title}`}
            ref={el => dockNodeRefs.current[i] = el}
            className="dock__node"
            data-color={p.color}
            onClick={() => scrollToPhase(i)}>
            {String(p.id).padStart(2, '0')}
            <span className="dock__node-tooltip">{p.short}</span>
          </button>
        ))}
        <div className="dock__progress">
          <div className="dock__progress-fill" ref={progressFillRef} />
          <div className="dock__progress-dot" ref={progressDotRef} />
        </div>
      </div>

      {/* PHASES */}
      <section className="phases">
        {window.ROADMAP.map((phase, i) => (
          <article key={phase.id} className="phase"
            ref={el => phaseRefs.current[i] = el}
            data-screen-label={`${String(phase.id).padStart(2, '0')} ${phase.title}`}>
            <div className="phase__index">
              <span className="phase__num-prefix" data-color={phase.color}>Phase {String(phase.id).padStart(2, '0')}</span>
              <span className="phase__num">{String(phase.id).padStart(2, '0')}</span>
              <div className="phase__num-bar" data-color={phase.color} />
              <div className="phase__weeks-block" data-color={phase.color}>
                <div className="phase__weeks-label">Time frame</div>
                <div className="phase__weeks">{phase.weeks}</div>
                <div className="phase__weeks-detail">{phase.weeksDetail}</div>
                <div className="phase__diff">
                  <span>Difficulty</span>
                  <span className="phase__diff-score">{phase.difficulty}/5</span>
                  <span className="phase__diff-dots" aria-label={`Difficulty ${phase.difficulty} out of 5`}>
                    {[1,2,3,4,5].map(d => (
                      <span key={d} className={`phase__diff-dot ${d <= phase.difficulty ? 'on' : ''}`} />
                    ))}
                  </span>
                </div>
                {phase.difficultyNote && (
                  <div className="phase__diff-note">{phase.difficultyNote}</div>
                )}
              </div>
              {phase.capstone && (
                <div className="phase__capstone-pill">Capstone {phase.capstone}</div>
              )}
            </div>
            <div className="phase__body">
              <h2 className="phase__title">
                <span className="phase__title-accent" data-color={phase.color} />
                {phase.title}
              </h2>
              <p className="phase__summary">{phase.summary}</p>
              <PhaseTabBox phase={phase} />
              <div className="phase__endstate reveal">
                <div className="phase__endstate-label">End state</div>
                <div className="phase__endstate-text">{phase.endState}</div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* CAPSTONES */}
      <section className="capstones reveal" data-screen-label="Capstones">
        <div className="capstones__eyebrow">Three Capstone Projects</div>
        <h2 className="capstones__title">Theory bound to <em>production reality.</em></h2>
        <p className="capstones__intro">
          Each capstone lands at the end of a phase cluster. They aren't toys — they're the proof
          that the curriculum stuck.
        </p>
        <div className="capstone-grid">
          {window.CAPSTONES.map((c, i) => (
            <article key={c.n}
              className="capstone reveal"
              ref={el => capstoneRefs.current[i] = el}>
              <div className="capstone__left">
                <div className="capstone__num">CAPSTONE {String(c.n).padStart(2, '0')}</div>
                <div className="capstone__title">{c.title}</div>
                <div className="capstone__phase">{c.phase}</div>
                <div className="capstone__domain">{c.domain}</div>
                <div className="capstone__stack">
                  {c.stack.map((s, i) => (
                    <span key={i} className="capstone__stack-pill">{s}</span>
                  ))}
                </div>
              </div>
              <div className="capstone__build">
                <div className="capstone__build-label">What you build</div>
                {c.build.map((b, i) => (
                  <div key={i} className="capstone__build-item">
                    <span className="capstone__build-num">{String(i + 1).padStart(2, '0')}</span>
                    <span>{b}</span>
                  </div>
                ))}
                <div className="capstone__proves">
                  <span className="capstone__proves-label">Proves</span>
                  {c.proves}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* OUT OF SCOPE */}
      <section className="outscope reveal" data-screen-label="Out of scope">
        <div className="outscope__head">
          <div className="outscope__eyebrow">◇ Out of scope (and why)</div>
          <h2 className="outscope__title">What this roadmap <em>doesn't</em> cover.</h2>
          <p className="outscope__intro">
            Every roadmap is as much about what's left out as what's in. These topics are real and useful —
            they're just not on the critical path to becoming a shipping AI engineer in 2026.
          </p>
        </div>
        <div className="outscope__grid">
          {window.OUT_OF_SCOPE.map((o, i) => (
            <article key={i} className="outscope__card">
              <div className="outscope__card-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="outscope__card-title">{o.title}</h3>
              <p className="outscope__card-why">{o.why}</p>
              <div className="outscope__card-pointer">
                <span className="outscope__card-pointer-label">Where to look</span>
                <span>{o.pointer}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHERE TO GO FROM HERE */}
      <section className="next reveal" data-screen-label="Where to go from here">
        <div className="next__head">
          <div className="next__eyebrow">→ After the roadmap</div>
          <h2 className="next__title">Where to go <em>from here.</em></h2>
          <p className="next__intro">
            You finished the curriculum and built three production systems. Now turn that work into interviews,
            offers, and the next thing you ship.
          </p>
        </div>
        <div className="next__grid">
          {window.NEXT_STEPS.map((n, i) => (
            <article key={i} className="next__card">
              <div className="next__card-label">{n.label}</div>
              <h3 className="next__card-title">{n.title}</h3>
              <p className="next__card-body">{n.body}</p>
            </article>
          ))}
        </div>
      </section>

      </main>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJumpPhase={scrollToPhase}
        onJumpCapstone={scrollToCapstone} />

      <footer className="footer reveal">
        <h2 className="footer__title">
          The journey ends where the <em>real work</em> begins.
        </h2>
        <div className="footer__meta">26 weeks · 9 phases · {totalSections} modules · 3 capstones · one engineer</div>
      </footer>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
