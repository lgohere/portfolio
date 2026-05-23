import React, { useState, useEffect, useRef } from 'react';
import './Portfolio.css';

// Intersection Observer Hook — reveals once, then stops observing
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -40px 0px', ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
};

// Staggered fade/slide reveal
const FadeInText = ({ children, delay = 0, className = '' }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      const timer = setTimeout(() => setAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, animated, delay]);

  return (
    <div ref={ref} className={`reveal ${animated ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Animated numeric counter
const StatCounter = ({ end, duration = 1400, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (!isIntersecting) return undefined;

    let startTime;
    let animationId;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => animationId && cancelAnimationFrame(animationId);
  }, [isIntersecting, end, duration]);

  return (
    <span ref={ref} className="stat-number">
      {prefix}{count}{suffix}
    </span>
  );
};

// 3D diamond lattice — a 7x7 grid rotated 45° into a diamond that spans
// edge-to-edge, undulating in 3D. Canvas-only, mouse-parallax, depth fog.
const HeroScene = ({ pointer }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // 7x7 diamond lattice — a square grid rotated 45° into a diamond,
    // undulating in 3D, scaled so its points reach edge-to-edge.
    const COLS = 7;
    const ROWS = 7;
    const nodes = [];
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        nodes.push({ u: (i / (COLS - 1)) * 2 - 1, v: (j / (ROWS - 1)) * 2 - 1 });
      }
    }
    const at = (i, j) => j * COLS + i;
    const edges = [];
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        if (i < COLS - 1) edges.push([at(i, j), at(i + 1, j)]);
        if (j < ROWS - 1) edges.push([at(i, j), at(i, j + 1)]);
      }
    }

    const COS45 = Math.SQRT1_2;
    const SIN45 = Math.SQRT1_2;
    const persp = 3.4;
    const proj = new Array(nodes.length);
    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.07;
      p.y += (p.ty - p.y) * 0.07;

      // Rigid diamond, scaled up well beyond the edges. No wave: a constant
      // tilt gives static 3D depth, the cursor adds a subtle parallax only.
      const sx = (width / (2 * Math.SQRT2)) * 1.55;
      const sy = (height / (2 * Math.SQRT2)) * 1.55;

      const tiltX = 0.13 + p.y * 0.14;
      const tiltY = p.x * 0.2;
      const cosTX = Math.cos(tiltX);
      const sinTX = Math.sin(tiltX);
      const cosTY = Math.cos(tiltY);
      const sinTY = Math.sin(tiltY);

      for (let n = 0; n < nodes.length; n++) {
        const nd = nodes[n];
        const u = nd.u * COS45 - nd.v * SIN45;
        const v = nd.u * SIN45 + nd.v * COS45;
        const x1 = u * cosTY;
        const z1 = u * sinTY;
        const y1 = v * cosTX - z1 * sinTX;
        const z2 = v * sinTX + z1 * cosTX;
        const depth = persp / (persp - z2);
        proj[n] = { sx: cx + x1 * sx * depth, sy: cy + y1 * sy * depth, z: z2 };
      }

      // Base lattice — faint, straight gold grid
      ctx.lineWidth = 0.6;
      for (let e = 0; e < edges.length; e++) {
        const a = proj[edges[e][0]];
        const b = proj[edges[e][1]];
        ctx.strokeStyle = 'rgba(201,161,74,0.07)';
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // Cursor constellation — points light up and connect as the cursor passes
      const rect = canvas.getBoundingClientRect();
      const mx = p.cx - rect.left;
      const my = p.cy - rect.top;
      const R = Math.min(width, height) * 0.3;
      const active = [];
      if (p.has && mx > -R && my > -R && mx < width + R && my < height + R) {
        for (let n = 0; n < proj.length; n++) {
          const dx = proj[n].sx - mx;
          const dy = proj[n].sy - my;
          const d = Math.hypot(dx, dy);
          if (d < R) active.push({ n, f: 1 - d / R });
        }
      }

      // Links between nearby active points
      for (let i = 0; i < active.length; i++) {
        const A = proj[active[i].n];
        for (let j = i + 1; j < active.length; j++) {
          const B = proj[active[j].n];
          const dx = A.sx - B.sx;
          const dy = A.sy - B.sy;
          if (dx * dx + dy * dy < R * R) {
            const a = Math.min(active[i].f, active[j].f);
            ctx.strokeStyle = `rgba(235,208,138,${a * 0.55})`;
            ctx.lineWidth = 0.5 + a * 1.2;
            ctx.beginPath();
            ctx.moveTo(A.sx, A.sy);
            ctx.lineTo(B.sx, B.sy);
            ctx.stroke();
          }
        }
      }

      // Threads from the cursor to the points it energises
      for (let i = 0; i < active.length; i++) {
        const A = proj[active[i].n];
        ctx.strokeStyle = `rgba(201,161,74,${active[i].f * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(A.sx, A.sy);
        ctx.stroke();
      }

      // Nodes — faint by default, glowing when energised
      const force = new Array(proj.length).fill(0);
      for (let i = 0; i < active.length; i++) force[active[i].n] = active[i].f;
      for (let n = 0; n < proj.length; n++) {
        const f = force[n];
        if (f > 0) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(235,208,138,${f * 0.12})`;
          ctx.arc(proj[n].sx, proj[n].sy, 6 + f * 13, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(235,208,138,${0.22 + f * 0.7})`;
        ctx.arc(proj[n].sx, proj[n].sy, 1.3 + f * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [pointer]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
};

// Skill card with staggered reveal
const SkillCard = ({ skill, level, category, delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      const timer = setTimeout(() => setAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, animated, delay]);

  return (
    <div ref={ref} className={`skill-card ${animated ? 'animate-in' : ''}`}>
      <span className="skill-category">{category}</span>
      <h4 className="skill-name">{skill}</h4>
      <span className="skill-level">{level}</span>
    </div>
  );
};

// Translation data
const translations = {
  pt: {
    nav: { about: 'Proposta', skills: 'Stack', contact: 'Contato' },

    hero: {
      kicker: 'Luiz Gouveia — AI Solutions Architect',
      title: { lead: 'Seu departamento de TI completo em', emph: 'uma pessoa.' },
      description:
        'Arquiteturas LLM-First, Spec-Driven Development e transformações digitais enterprise.',
      pillars: ['Agentic Systems', 'MCPs', 'RAG / GraphRAG'],
      viewProjects: 'Como posso ajudar',
      letsChat: 'Vamos conversar'
    },

    stats: {
      eyebrow: 'O custo que você substitui',
      list: [
        { number: 490, prefix: '$', suffix: 'k', label: 'Custo anual de 6 especialistas' },
        { number: 155, prefix: '$', suffix: 'k', label: 'Backend + Frontend Dev' },
        { number: 200, prefix: '$', suffix: 'k', label: 'DevOps + AI Engineer' },
        { number: 135, prefix: '$', suffix: 'k', label: 'Designer + Video Editor' }
      ]
    },

    about: {
      eyebrow: 'A proposta',
      title: 'Quanto custa montar um time completo de tecnologia?',
      teamBreakdown: {
        title: 'O que você economiza contratando apenas 1 pessoa',
        positions: [
          { role: 'Backend Developer', salary: '$80k', description: 'APIs, bancos de dados, lógica de negócio' },
          { role: 'Frontend Developer', salary: '$75k', description: 'Interfaces, experiência do usuário' },
          { role: 'DevOps Engineer', salary: '$90k', description: 'Infraestrutura, deploy, monitoramento' },
          { role: 'UI/UX Designer', salary: '$70k', description: 'Design, prototipagem, usabilidade' },
          { role: 'AI Engineer', salary: '$110k', description: 'Inteligência artificial, automação' },
          { role: 'Video Editor', salary: '$65k', description: 'Conteúdo visual, marketing criativo' }
        ],
        totalLabel: 'Total anual',
        total: '$490k'
      },
      expertiseAreas: [
        { title: 'Time-to-Market Acelerado', description: 'Sem meses perdidos contratando, integrando e sincronizando equipes. Resultado desde o primeiro dia.', benefit: '6–12 meses de economia' },
        { title: 'Arquitetura Single-Point', description: 'Sem reuniões intermináveis, conflitos de equipe ou alinhamentos constantes. Foco total no resultado.', benefit: '40% mais produtividade' },
        { title: 'Stack End-to-End Coeso', description: 'Decisões técnicas consistentes, arquitetura coesa, sem retrabalho por falta de comunicação.', benefit: '70% menos bugs' },
        { title: 'KPIs Acionáveis desde a Sprint 1', description: 'Cada linha de código tem propósito. Cada funcionalidade gera valor. Sem desperdício.', benefit: 'Payback em 60 dias' }
      ],
      stackLabel: 'Ferramentas que opero no dia a dia'
    },

    skills: {
      eyebrow: 'Stack',
      title: 'Stack tecnológico especializado',
      list: [
        { skill: 'LangChain / LangGraph / LangSmith', level: 'Especialista', category: 'AI Architecture' },
        { skill: 'Python / Django / FastAPI', level: 'Especialista', category: 'Backend' },
        { skill: 'Next.js / Vue.js / React', level: 'Especialista', category: 'Frontend' },
        { skill: 'Claude Code / Cursor / Codex / MCPs', level: 'Especialista', category: 'AI Engineering' },
        { skill: 'PostgreSQL / Neo4j / Redis', level: 'Avançado', category: 'Database' },
        { skill: 'Docker / Hetzner / Coolify', level: 'Avançado', category: 'Cloud / DevOps' },
        { skill: 'RAG / GraphRAG Systems', level: 'Especialista', category: 'AI Systems' },
        { skill: 'n8n', level: 'Avançado', category: 'Automation' }
      ]
    },

    contact: {
      eyebrow: 'Contato',
      title: 'Vamos conversar',
      description:
        'Pronto para transformar operações manuais em sistemas inteligentes? Conte comigo para ser seu departamento de TI completo e gerar ROI imediato para o seu negócio.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      footer: '© 2025 Luiz Gouveia — AI Solutions Architect & Full-Stack Developer.',
      whatsappMessage: 'Olá! Tenho interesse em conversar sobre a transformação digital do meu negócio.'
    }
  },

  en: {
    nav: { about: 'Proposal', skills: 'Stack', contact: 'Contact' },

    hero: {
      kicker: 'Luiz Gouveia — AI Solutions Architect',
      title: { lead: 'Your entire IT department,', emph: 'in one person.' },
      description:
        'LLM-First architectures, Spec-Driven Development and enterprise digital transformations.',
      pillars: ['Agentic Systems', 'MCPs', 'RAG / GraphRAG'],
      viewProjects: 'How I can help',
      letsChat: "Let's talk"
    },

    stats: {
      eyebrow: 'The cost you replace',
      list: [
        { number: 490, prefix: '$', suffix: 'k', label: 'Annual cost of 6 specialists' },
        { number: 155, prefix: '$', suffix: 'k', label: 'Backend + Frontend Dev' },
        { number: 200, prefix: '$', suffix: 'k', label: 'DevOps + AI Engineer' },
        { number: 135, prefix: '$', suffix: 'k', label: 'Designer + Video Editor' }
      ]
    },

    about: {
      eyebrow: 'The proposal',
      title: 'How much does it cost to build a complete tech team?',
      teamBreakdown: {
        title: 'What you save by hiring just 1 person',
        positions: [
          { role: 'Backend Developer', salary: '$80k', description: 'APIs, databases, business logic' },
          { role: 'Frontend Developer', salary: '$75k', description: 'Interfaces, user experience' },
          { role: 'DevOps Engineer', salary: '$90k', description: 'Infrastructure, deployment, monitoring' },
          { role: 'UI/UX Designer', salary: '$70k', description: 'Design, prototyping, usability' },
          { role: 'AI Engineer', salary: '$110k', description: 'Artificial intelligence, automation' },
          { role: 'Video Editor', salary: '$65k', description: 'Visual content, creative marketing' }
        ],
        totalLabel: 'Annual total',
        total: '$490k'
      },
      expertiseAreas: [
        { title: 'Accelerated Time-to-Market', description: 'No months lost hiring, integrating and synchronizing teams. Results from day one.', benefit: '6–12 months saved' },
        { title: 'Single-Point Architecture', description: 'No endless meetings, team conflicts or constant alignment. Total focus on results.', benefit: '40% more productivity' },
        { title: 'Cohesive End-to-End Stack', description: 'Consistent technical decisions, cohesive architecture, no rework due to miscommunication.', benefit: '70% fewer bugs' },
        { title: 'Actionable KPIs from Sprint 1', description: 'Every line of code has purpose. Every feature generates value. No waste.', benefit: 'Payback in 60 days' }
      ],
      stackLabel: 'Tools I operate day to day'
    },

    skills: {
      eyebrow: 'Stack',
      title: 'Specialized tech stack',
      list: [
        { skill: 'LangChain / LangGraph / LangSmith', level: 'Expert', category: 'AI Architecture' },
        { skill: 'Python / Django / FastAPI', level: 'Expert', category: 'Backend' },
        { skill: 'Next.js / Vue.js / React', level: 'Expert', category: 'Frontend' },
        { skill: 'Claude Code / Cursor / Codex / MCPs', level: 'Expert', category: 'AI Engineering' },
        { skill: 'PostgreSQL / Neo4j / Redis', level: 'Advanced', category: 'Database' },
        { skill: 'Docker / Hetzner / Coolify', level: 'Advanced', category: 'Cloud / DevOps' },
        { skill: 'RAG / GraphRAG Systems', level: 'Expert', category: 'AI Systems' },
        { skill: 'n8n', level: 'Advanced', category: 'Automation' }
      ]
    },

    contact: {
      eyebrow: 'Contact',
      title: "Let's talk",
      description:
        'Ready to transform manual operations into intelligent systems? Let me be your complete IT department and generate immediate ROI for your business.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      footer: '© 2025 Luiz Gouveia — AI Solutions Architect & Full-Stack Developer.',
      whatsappMessage: "Hello! I'm interested in discussing the digital transformation of my business."
    }
  }
};

const getInitialLanguage = () => {
  try {
    const saved = window.localStorage.getItem('lg-lang');
    if (saved === 'pt' || saved === 'en') return saved;
  } catch (e) { /* ignore */ }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }
  return 'pt';
};

const getInitialDarkMode = () => {
  try {
    const saved = window.localStorage.getItem('lg-theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
  } catch (e) { /* ignore */ }
  return true;
};

const WHATSAPP_NUMBER = '5513981942956';

// Main Portfolio Component
const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, cx: -9999, cy: -9999, has: false });

  const t = translations[language];

  const techStack = [
    'LangChain/LangGraph', 'Claude Code', 'OpenAI API', 'Neo4j AuraDB',
    'Python/Django', 'Next.js', 'React', 'Vue.js', 'PostgreSQL', 'Docker',
    'RAG/GraphRAG', 'MCP', 'Hetzner/Coolify', 'Redis',
    'n8n', 'RabbitMQ', 'Leonardo AI', 'Kling AI', 'FastAPI',
    'Supabase', 'TypeScript', 'Tailwind CSS', 'Eleven Labs'
  ];

  useEffect(() => {
    try { window.localStorage.setItem('lg-theme', isDarkMode ? 'dark' : 'light'); } catch (e) { /* ignore */ }
  }, [isDarkMode]);

  useEffect(() => {
    try { window.localStorage.setItem('lg-lang', language); } catch (e) { /* ignore */ }
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, [language]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current.tx = nx;
      pointer.current.ty = ny;
      pointer.current.cx = e.clientX;
      pointer.current.cy = e.clientY;
      pointer.current.has = true;
      if (heroRef.current) {
        heroRef.current.style.setProperty('--mx', nx.toFixed(3));
        heroRef.current.style.setProperty('--my', ny.toFixed(3));
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const toggleTheme = () => setIsDarkMode((v) => !v);
  const toggleLanguage = () => setLanguage((l) => (l === 'pt' ? 'en' : 'pt'));
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const getWhatsAppLink = () =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.contact.whatsappMessage)}`;

  return (
    <div className={`portfolio ${isDarkMode ? '' : 'light'}`}>
      <div className="grain" aria-hidden="true" />

      {/* Header */}
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <nav className="nav nav-desktop">
            <button className="nav-btn" onClick={() => scrollToSection('about')}>{t.nav.about}</button>
            <button className="nav-btn" onClick={() => scrollToSection('skills')}>{t.nav.skills}</button>
            <button className="nav-btn" onClick={() => scrollToSection('contact')}>{t.nav.contact}</button>
            <span className="nav-sep" aria-hidden="true" />
            <button className="nav-toggle" onClick={toggleLanguage} aria-label="Toggle language">
              {language === 'pt' ? 'EN' : 'PT'}
            </button>
            <button className="nav-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀' : '☾'}
            </button>
          </nav>

          <div className="nav nav-mobile">
            <button className="nav-toggle" onClick={toggleLanguage} aria-label="Toggle language">
              {language === 'pt' ? 'EN' : 'PT'}
            </button>
            <button className="nav-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀' : '☾'}
            </button>
            <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <nav className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Menu</span>
            <button className="mobile-menu-close" onClick={toggleMenu}>×</button>
          </div>
          <div className="mobile-menu-items">
            <button className="mobile-menu-item" onClick={() => scrollToSection('about')}>
              <span className="mobile-menu-number">01</span>
              <span className="mobile-menu-text">{t.nav.about}</span>
            </button>
            <button className="mobile-menu-item" onClick={() => scrollToSection('skills')}>
              <span className="mobile-menu-number">02</span>
              <span className="mobile-menu-text">{t.nav.skills}</span>
            </button>
            <button className="mobile-menu-item" onClick={() => scrollToSection('contact')}>
              <span className="mobile-menu-number">03</span>
              <span className="mobile-menu-text">{t.nav.contact}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="hero-glow" aria-hidden="true" />
        <HeroScene pointer={pointer} />
        <div className="hero-frame" aria-hidden="true">
          <span className="hero-frame-tag">FIG. 01 — GOUVEIA / TECH</span>
        </div>
        <div className="container">
          <div className="hero-inner">
            <FadeInText delay={100}>
              <div className="hero-portrait">
                <img src={isDarkMode ? '/favicon.png' : '/favicon-light.png'} alt="Luiz Gouveia" />
              </div>
            </FadeInText>

            <FadeInText delay={250}>
              <span className="hero-kicker">
                <span className="hero-kicker-dot" />{t.hero.kicker}
              </span>
            </FadeInText>

            <FadeInText delay={450}>
              <p className="hero-lead">{t.hero.description}</p>
            </FadeInText>

            <FadeInText delay={750}>
              <ul className="hero-pillars">
                {t.hero.pillars.map((pillar, i) => (
                  <li key={i} className="hero-pillar">{pillar}</li>
                ))}
              </ul>
            </FadeInText>

            <FadeInText delay={900}>
              <div className="hero-actions">
                <a href={getWhatsAppLink()} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  {t.hero.letsChat}
                  <span className="btn-arrow">→</span>
                </a>
                <button className="btn btn-ghost" onClick={() => scrollToSection('about')}>
                  {t.hero.viewProjects}
                </button>
              </div>
            </FadeInText>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <span className="stats-eyebrow">{t.stats.eyebrow}</span>
          <div className="stats-grid">
            {t.stats.list.map((stat, index) => (
              <div key={index} className="stat-item">
                <StatCounter end={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <header className="section-head">
            <span className="section-index">01</span>
            <span className="section-eyebrow">{t.about.eyebrow}</span>
          </header>
          <h2 className="section-title">{t.about.title}</h2>

          <div className="about-content">
            <div className="team-breakdown">
              <h4 className="breakdown-title">{t.about.teamBreakdown.title}</h4>
              <div className="positions-grid">
                {t.about.teamBreakdown.positions.map((position, index) => (
                  <div key={index} className="position-card">
                    <div className="position-header">
                      <h5 className="position-role">{position.role}</h5>
                      <span className="position-salary">{position.salary}</span>
                    </div>
                    <p className="position-description">{position.description}</p>
                  </div>
                ))}
              </div>
              <div className="total-cost">
                <span className="total-label">{t.about.teamBreakdown.totalLabel}</span>
                <span className="total-amount">{t.about.teamBreakdown.total}<span className="total-unit">/ano</span></span>
              </div>
            </div>

            <div className="expertise-areas">
              {t.about.expertiseAreas.map((area, index) => (
                <div key={index} className="expertise-item">
                  <span className="expertise-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="expertise-body">
                    <div className="expertise-header">
                      <h4>{area.title}</h4>
                      <span className="benefit-badge">{area.benefit}</span>
                    </div>
                    <p>{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <span className="stack-label">{t.about.stackLabel}</span>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((tech, index) => (
                <span key={index} className="tech-item">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills" id="skills">
        <div className="container">
          <header className="section-head">
            <span className="section-index">02</span>
            <span className="section-eyebrow">{t.skills.eyebrow}</span>
          </header>
          <h2 className="section-title">{t.skills.title}</h2>
          <div className="skills-grid">
            {t.skills.list.map((skill, index) => (
              <SkillCard
                key={index}
                skill={skill.skill}
                level={skill.level}
                category={skill.category}
                delay={index * 70}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <header className="section-head">
            <span className="section-index">03</span>
            <span className="section-eyebrow">{t.contact.eyebrow}</span>
          </header>
          <div className="contact-content">
            <h2 className="section-title contact-title">{t.contact.title}</h2>
            <p className="contact-description">{t.contact.description}</p>

            <div className="contact-methods">
              <a href={getWhatsAppLink()} className="contact-btn" target="_blank" rel="noopener noreferrer">
                <span className="contact-btn-label">{t.contact.whatsapp}</span>
                <span className="contact-btn-arrow">↗</span>
              </a>
              <a href="mailto:lgou90@gmail.com" className="contact-btn">
                <span className="contact-btn-label">{t.contact.email}</span>
                <span className="contact-btn-arrow">↗</span>
              </a>
              <a href="https://www.linkedin.com/in/lgohere/" className="contact-btn" target="_blank" rel="noopener noreferrer">
                <span className="contact-btn-label">{t.contact.linkedin}</span>
                <span className="contact-btn-arrow">↗</span>
              </a>
            </div>

            <div className="contact-footer">
              <p>{t.contact.footer}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
