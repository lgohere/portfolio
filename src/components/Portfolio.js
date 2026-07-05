import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Portfolio.css';

gsap.registerPlugin(ScrollTrigger);

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
// The invisible draftsman — Da Vinci still at the table. Pencil scribbles
// trace the air around the eagle while compass arcs and ruled dimension lines
// construct themselves, linger like graphite, and fade — the same vocabulary
// the board itself uses (flow curves, 130°/32° arcs, 2.1m dimensions). The
// cursor is the master's hand: fresh strokes bloom near it and the work
// quickens as the film builds. Canvas-only.
const HeroScene = ({ pointer, progress }) => {
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

    // Deterministic PRNG — the same hand on every visit
    let seed = 20240613;
    const rnd = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let z = seed;
      z = Math.imul(z ^ (z >>> 15), z | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const TAU = Math.PI * 2;
    const isSmall = window.innerWidth < 720;
    const MAX_STROKES = isSmall ? 7 : 13;

    // Da Vinci's airflow — the field the flow scribbles ride: a steady stream
    // deflected around the eagle's body at centre frame
    const v = { x: 0, y: 0 };
    const field = (x, y) => {
      const u = x / width;
      const w = y / height;
      v.x = 1;
      v.y = Math.sin(u * 5.1 + w * 2.1) * 0.16 + Math.sin(u * 11.3 + w * 3.7) * 0.08;
      const dx = u - 0.5;
      const dy = w - 0.52;
      const bend = Math.exp(-((dx * dx) / 0.1 + (dy * dy) / 0.035));
      v.y += (dy < 0 ? -1 : 1) * bend * 0.85;
      v.x += bend * 0.3;
      return v;
    };

    // The eagle owns the centre of the frame: marks passing over it go almost
    // transparent (per segment), recovering toward the edges
    const centerFade = (x, y) => {
      const dx = x / width - 0.5;
      const dy = y / height - 0.52;
      return 1 - Math.exp(-((dx * dx) / 0.055 + (dy * dy) / 0.085)) * 0.85;
    };

    // Hand wobble: a stable per-stroke random walk pushed perpendicular to
    // the path — drawn once, so the line trembles like graphite, not jitter
    const wobblize = (pts, n, amp) => {
      let wob = 0;
      for (let k = 1; k < n; k++) {
        const ux = pts[k * 2] - pts[(k - 1) * 2];
        const uy = pts[k * 2 + 1] - pts[(k - 1) * 2 + 1];
        const len = Math.hypot(ux, uy) || 1;
        wob = wob * 0.88 + (rnd() - 0.5) * amp;
        pts[k * 2] += (-uy / len) * wob;
        pts[k * 2 + 1] += (ux / len) * wob;
      }
    };

    // Freehand flow scribble following the air
    const flowPaths = (x0, y0) => {
      const n = 16 + Math.floor(rnd() * 18);
      const pts = new Float32Array(n * 2);
      let x = x0;
      let y = y0;
      for (let k = 0; k < n; k++) {
        pts[k * 2] = x;
        pts[k * 2 + 1] = y;
        const f = field(x, y);
        const len = Math.hypot(f.x, f.y) || 1;
        x += (f.x / len) * 9;
        y += (f.y / len) * 9;
      }
      wobblize(pts, n, 1.1);
      return [pts];
    };

    // Compass arc with radial registration ticks at both ends
    const arcPaths = () => {
      const cx0 = width * (0.15 + rnd() * 0.7);
      const cy0 = height * (0.15 + rnd() * 0.7);
      const r = 50 + rnd() * 130;
      const a0 = rnd() * TAU;
      const sweep = 0.5 + rnd() * 1.5;
      const n = Math.max(12, Math.floor((sweep * r) / 8));
      const pts = new Float32Array(n * 2);
      for (let k = 0; k < n; k++) {
        const a = a0 + (k / (n - 1)) * sweep;
        pts[k * 2] = cx0 + Math.cos(a) * r;
        pts[k * 2 + 1] = cy0 + Math.sin(a) * r;
      }
      wobblize(pts, n, 0.7);
      const tick = (a) => {
        const t2 = new Float32Array(4);
        t2[0] = cx0 + Math.cos(a) * (r - 7);
        t2[1] = cy0 + Math.sin(a) * (r - 7);
        t2[2] = cx0 + Math.cos(a) * (r + 7);
        t2[3] = cy0 + Math.sin(a) * (r + 7);
        return t2;
      };
      return [pts, tick(a0), tick(a0 + sweep)];
    };

    // Ruled dimension line with perpendicular end ticks
    const dimPaths = () => {
      const horiz = rnd() > 0.4;
      const len = 90 + rnd() * 150;
      const x0 = width * (0.1 + rnd() * 0.7);
      const y0 = height * (0.12 + rnd() * 0.72);
      const ang = (horiz ? 0 : Math.PI / 2) + (rnd() - 0.5) * 0.06;
      const ux = Math.cos(ang);
      const uy = Math.sin(ang);
      const n = Math.max(10, Math.floor(len / 9));
      const pts = new Float32Array(n * 2);
      for (let k = 0; k < n; k++) {
        pts[k * 2] = x0 + (ux * len * k) / (n - 1);
        pts[k * 2 + 1] = y0 + (uy * len * k) / (n - 1);
      }
      wobblize(pts, n, 0.5);
      const tick = (tx, ty) => {
        const t2 = new Float32Array(4);
        t2[0] = tx + uy * 7;
        t2[1] = ty - ux * 7;
        t2[2] = tx - uy * 7;
        t2[3] = ty + ux * 7;
        return t2;
      };
      return [pts, tick(x0, y0), tick(x0 + ux * len, y0 + uy * len)];
    };

    // A living pool of marks; each draws itself in, lingers, fades away
    const strokes = [];
    const spawn = (now, nearCursor) => {
      const p = pointer.current;
      const roll = rnd();
      let paths;
      let kind;
      if (nearCursor || roll < 0.55) {
        kind = 'flow';
        let x0 = width * (0.05 + rnd() * 0.75);
        let y0 = height * (0.08 + rnd() * 0.84);
        if (nearCursor) {
          const rect = canvas.getBoundingClientRect();
          x0 = p.cx - rect.left + (rnd() - 0.5) * 160;
          y0 = p.cy - rect.top + (rnd() - 0.5) * 160;
        }
        paths = flowPaths(x0, y0);
      } else if (roll < 0.82) {
        kind = 'arc';
        paths = arcPaths();
      } else {
        kind = 'dim';
        paths = dimPaths();
      }
      let total = 0;
      for (let pi = 0; pi < paths.length; pi++) total += paths[pi].length / 2;
      strokes.push({
        paths,
        total,
        kind,
        near: rnd() > 0.45,
        born: now,
        tin: 700 + rnd() * 600,
        hold: (kind === 'flow' ? 1300 : 2600) + rnd() * 1400,
        tout: 1100 + rnd() * 700
      });
    };

    // Reduced motion: etch one static study — the drawing without the hand
    if (reduceMotion) {
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = 'rgba(201,161,74,0.1)';
      for (let sIdx = 0; sIdx < 12; sIdx++) {
        let x = -10;
        let y = ((sIdx + 0.5) / 12) * height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let step = 0; step < 120; step++) {
          const f = field(x, y);
          x += f.x * 14;
          y += f.y * 12;
          ctx.lineTo(x, y);
          if (x > width + 10) break;
        }
        ctx.stroke();
      }
      return () => window.removeEventListener('resize', resize);
    }

    let raf;
    let lastSpawn = 0;

    const draw = (now) => {
      ctx.clearRect(0, 0, width, height);

      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.07;
      p.y += (p.ty - p.y) * 0.07;
      const rect = canvas.getBoundingClientRect();
      const mx = p.cx - rect.left;
      const my = p.cy - rect.top;
      const R = p.has ? Math.min(width, height) * 0.28 : 0;

      // The master works faster as the film builds toward take-off
      const pace = 460 - (progress ? progress.current.p : 0) * 220;
      if (now - lastSpawn > pace && strokes.length < MAX_STROKES) {
        lastSpawn = now;
        spawn(now, p.has && rnd() < 0.4);
      }

      ctx.lineCap = 'round';
      for (let iS = strokes.length - 1; iS >= 0; iS--) {
        const st = strokes[iS];
        const age = now - st.born;
        let alphaK = 1;
        let reveal = st.total;
        if (age < st.tin) {
          const e = age / st.tin;
          reveal = Math.max(2, Math.floor(st.total * (1 - Math.pow(1 - e, 2))));
        } else if (age > st.tin + st.hold) {
          const fo = (age - st.tin - st.hold) / st.tout;
          if (fo >= 1) {
            strokes.splice(iS, 1);
            continue;
          }
          alphaK = 1 - fo;
        }

        const ox = p.x * (st.near ? -12 : -5);
        const oy = p.y * (st.near ? -8 : -4);

        // The work catches the light near the hand
        const main = st.paths[0];
        const mi = Math.floor(main.length / 4) * 2;
        let s = 0;
        if (R > 0) {
          const d = Math.hypot(main[mi] - mx, main[mi + 1] - my);
          if (d < R) s = 1 - d / R;
        }
        const crisp = st.kind !== 'flow';
        const aBase = ((st.near ? 0.3 : 0.18) + (crisp ? 0.08 : 0)) * alphaK * (1 + s * 1.1);
        const wBase = (st.near ? 1.0 : 0.7) * (crisp ? 0.9 : 1);

        let budget = reveal;
        for (let pi = 0; pi < st.paths.length && budget > 1; pi++) {
          const pts = st.paths[pi];
          const nPts = Math.min(pts.length / 2, budget);
          budget -= nPts;
          // main pass + a faint offset ghost — the sketcher's double line
          for (let pass = 0; pass < 2; pass++) {
            const ga = pass === 0 ? aBase : aBase * 0.35;
            const gx = pass === 0 ? 0 : 1.2;
            const gy = pass === 0 ? 0 : -0.8;
            for (let k = 1; k < nPts; k++) {
              const taper = pi === 0 ? Math.sin((Math.PI * k) / (pts.length / 2)) : 1;
              const cf = centerFade(
                (pts[(k - 1) * 2] + pts[k * 2]) / 2,
                (pts[(k - 1) * 2 + 1] + pts[k * 2 + 1]) / 2
              );
              ctx.strokeStyle = `rgba(201,161,74,${ga * cf})`;
              ctx.lineWidth = Math.max(0.35, wBase * (0.45 + taper * 0.75));
              ctx.beginPath();
              ctx.moveTo(pts[(k - 1) * 2] + ox + gx, pts[(k - 1) * 2 + 1] + oy + gy);
              ctx.lineTo(pts[k * 2] + ox + gx, pts[k * 2 + 1] + oy + gy);
              ctx.stroke();
            }
          }
        }

        // The pencil tip — a warm glint riding the line while it draws in
        if (age < st.tin) {
          const hn = Math.min(main.length / 2, reveal) - 1;
          if (hn > 0) {
            const cf = centerFade(main[hn * 2], main[hn * 2 + 1]);
            ctx.beginPath();
            ctx.fillStyle = `rgba(235,208,138,${0.55 * alphaK * cf})`;
            ctx.arc(main[hn * 2] + ox, main[hn * 2 + 1] + oy, 1.4, 0, TAU);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    // Seed the board so it never starts empty
    for (let i = 0; i < 5; i++) spawn(performance.now() - rnd() * 2200, false);

    raf = requestAnimationFrame(draw);

    // Sleep the render loop whenever the hero is off-screen (post-unpin)
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        raf = requestAnimationFrame(draw);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [pointer, progress]);

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

// Scroll-scrubbed hero film. Sources are encoded all-intra (every frame is a
// keyframe) so any currentTime seek decodes instantly; the file is prefetched
// into a blob URL so scrubbing never waits on the network.
const HERO_FILM = {
  mp4: '/media/eagle-scrub-h264.mp4',
  poster: '/media/eagle-poster.jpg',
  fps: 24,
  // The scrub rests on this frame (eagle level, head centered), not the last
  endFrame: 270
};

// Main Portfolio Component
const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const innerRef = useRef(null);
  const readoutRef = useRef(null);
  const cueRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, cx: -9999, cy: -9999, has: false });
  // Shared with HeroScene: the wind in the air rises as the film advances
  const filmProgress = useRef({ p: 0 });

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

  // Header chrome (blur/background) only exists from the 2nd content section
  // down. With the scrub active, a GSAP ScrollTrigger in the film effect flips
  // it; this listener is the reduced-motion fallback.
  useEffect(() => {
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) return undefined;

    const onScroll = () => {
      const about = document.getElementById('about');
      setScrolled(!!about && about.getBoundingClientRect().top < window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Film scrub engine. GSAP ScrollTrigger pins the hero and eases scroll
  // progress into film time (`scrub: 0.8` is the built-in inertia). Frames are
  // painted onto a canvas — a scrubbed <video> element can flash/tear between
  // seeks, a canvas always holds the last decoded frame. Seeks are chained on
  // `seeked` so slow decodes never pile up, and the file is prefetched into a
  // blob so seeking never touches the network. The hero copy enters just
  // before the film's final beat and stays.
  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const inner = innerRef.current;
    if (!hero || !video || !canvas || !inner) return undefined;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined; // CSS keeps the hero static and visible

    const brush = canvas.getContext('2d');
    let disposed = false;
    let objectUrl = null;
    let duration = 0;
    let progress = 0;
    let applied = -1;
    let seekBusy = false;

    // Cover-fit painting with a gentle push-in across the film
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const paint = () => {
      if (!video.videoWidth || !canvas.width) return;
      const zoom = 1.03 + progress * 0.06;
      const scale =
        Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight) * zoom;
      const w = video.videoWidth * scale;
      const h = video.videoHeight * scale;
      brush.drawImage(video, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };
    const sizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      paint();
    };

    // Progress 0-1 maps onto [0, endFrame] — the film rests on its hero frame
    const filmEnd = () =>
      Math.min(HERO_FILM.endFrame / HERO_FILM.fps, Math.max(0, duration - 0.06));

    // Seek chain: one in-flight seek at a time, always re-aimed at the latest
    // target once the previous decode lands.
    const pump = () => {
      if (disposed || !duration) return;
      const t = progress * filmEnd();
      if (!seekBusy && Math.abs(t - applied) > 1 / (HERO_FILM.fps * 2)) {
        seekBusy = true;
        applied = t;
        video.currentTime = t;
      }
    };
    const onSeeked = () => {
      requestAnimationFrame(() => {
        seekBusy = false;
        paint();
        pump();
      });
    };
    const onMeta = () => {
      duration = video.duration || 0;
      pump();
    };
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', paint);
    video.addEventListener('seeked', onSeeked);

    // Prefetch the whole file into a blob so every seek is served from memory
    fetch(HERO_FILM.mp4)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(`${res.status}`))))
      .then((blob) => {
        if (disposed) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
      })
      .catch(() => {
        if (!disposed) video.src = HERO_FILM.mp4;
      });

    // Copy is hidden while the film plays and cascades in near its end — in
    // both directions: scrolling back before the threshold hides it again, so
    // the film always plays clean. The gap between the two thresholds is
    // hysteresis so the copy never flutters at the boundary.
    const REVEAL_IN = 0.92;
    const REVEAL_OUT = 0.88;
    const parts = gsap.utils.toArray(inner.children);
    gsap.set(parts, { autoAlpha: 0, y: 26 });
    let revealed = false;
    const reveal = gsap
      .timeline({ paused: true })
      .to(parts, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' });

    const film = { p: 0 };
    // 280% of scroll plays the film; the extra 80% is a hold where the hero
    // stays pinned with the copy on screen before releasing to the sections.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=360%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });
    tl.to(film, {
      p: 1,
      ease: 'none',
      duration: 2.8,
      onUpdate: () => {
        progress = film.p;
        filmProgress.current.p = film.p;
        pump();
        if (readoutRef.current && duration) {
          const t = progress * filmEnd();
          const frame = String(Math.round(t * HERO_FILM.fps)).padStart(3, '0');
          const total = Math.round(duration * HERO_FILM.fps);
          readoutRef.current.textContent = `FR ${frame}/${total} · T+${t.toFixed(2)}s`;
        }
        if (cueRef.current) {
          cueRef.current.style.opacity = String(Math.max(0, 1 - progress * 14));
        }
        if (!revealed && progress >= REVEAL_IN) {
          revealed = true;
          reveal.timeScale(1).play();
        } else if (revealed && progress < REVEAL_OUT) {
          revealed = false;
          reveal.timeScale(1.6).reverse(); // exits faster than it enters
        }
      },
    });

    // Hold: the hero stays pinned with the copy on screen for the last
    // stretch of the pin before the page releases to the sections.
    tl.to({}, { duration: 0.8 });

    // Header chrome (blur) enters only when the 2nd content section arrives
    const aboutEl = document.getElementById('about');
    const chromeTrigger = aboutEl
      ? ScrollTrigger.create({
          trigger: aboutEl,
          start: 'top 60%',
          onEnter: () => setScrolled(true),
          onLeaveBack: () => setScrolled(false),
        })
      : null;

    window.addEventListener('resize', sizeCanvas);
    sizeCanvas();

    return () => {
      disposed = true;
      if (chromeTrigger) chromeTrigger.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
      reveal.kill();
      window.removeEventListener('resize', sizeCanvas);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', paint);
      video.removeEventListener('seeked', onSeeked);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
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

      {/* Hero — pinned by ScrollTrigger while the eagle film scrubs; the copy
          cascades in just before the final frame and stays */}
      <section className="hero" id="hero" ref={heroRef}>
        <div
          className="hero-video"
          aria-hidden="true"
          style={{ backgroundImage: `url(${HERO_FILM.poster})` }}
        >
          <canvas ref={canvasRef} className="hero-film" />
          <video ref={videoRef} muted playsInline preload="none" tabIndex={-1} />
          <div className="hero-video-scrim" />
        </div>
        <HeroScene pointer={pointer} progress={filmProgress} />
        <div className="hero-frame" aria-hidden="true">
          <span className="hero-frame-tag">FIG. 01 — GOUVEIA / TECH</span>
          <span className="hero-frame-readout" ref={readoutRef}>FR 000/292 · T+0.00s</span>
        </div>
        <div className="container">
          <div className="hero-inner" ref={innerRef}>
            <span className="hero-kicker">
              <span className="hero-kicker-dot" />{t.hero.kicker}
            </span>
            <p className="hero-lead">{t.hero.description}</p>
            <ul className="hero-pillars">
              {t.hero.pillars.map((pillar, i) => (
                <li key={i} className="hero-pillar">{pillar}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <a href={getWhatsAppLink()} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                {t.hero.letsChat}
                <span className="btn-arrow">→</span>
              </a>
              <button className="btn btn-ghost" onClick={() => scrollToSection('about')}>
                {t.hero.viewProjects}
              </button>
            </div>
          </div>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true" ref={cueRef}>
          <span className="hero-scroll-cue-line" />
          <span>SCROLL</span>
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
