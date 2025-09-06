import React, { useState, useEffect, useRef } from 'react';
import './Portfolio.css';

// Fixed Intersection Observer Hook
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Keep observing for counters
        }
      }, 
      {
        threshold: 0.3,
        rootMargin: '20px',
        ...options
      }
    );

    observerRef.current = observer;
    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// Optimized Fade In Component
const FadeInText = ({ children, delay = 0, className = "" }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, animated, delay]);

  return (
    <div ref={ref} className={`${className} ${animated ? 'fade-in' : 'fade-out'}`}>
      {children}
    </div>
  );
};

// Fixed Animated Counter
const StatCounter = ({ end, duration = 1200, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting) {
      let startTime;
      let animationId;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Smooth easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easedProgress * end));
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
      };
      
      animationId = requestAnimationFrame(animate);
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [isIntersecting, end, duration]);

  return (
    <div ref={ref} className="stat-number">
      {prefix}{count}{suffix}
    </div>
  );
};

// Optimized Skill Card Component
const SkillCard = ({ skill, delay = 0, category, level }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, animated, delay]);

  return (
    <div ref={ref} className={`skill-card ${animated ? 'animate-in' : ''}`}>
      <div className="skill-header">
        <h4 className="skill-name">{skill}</h4>
        <span className="skill-level">{level}</span>
      </div>
      <div className="skill-category">{category}</div>
    </div>
  );
};


// Translation data
const translations = {
  pt: {
    // Navigation
    nav: {
      about: 'Sobre',
      skills: 'Skills',
      contact: 'Contato'
    },
    
    // Hero Section
    hero: {
      greeting: '',
      title: 'AI Solutions Architect & Full Stack Developer',
      subtitle: 'Transformo operações manuais em sistemas inteligentes',
      tagline: 'Zero-to-Cloud • 95%+ Precisão • Resultados Mensuráveis',
      description: 'Seu departamento de TI completo em uma pessoa. Especialista em arquiteturas LLM-First e transformações digitais que geram ROI imediato.',
      viewProjects: 'Ver como posso ajudar',
      letsChat: 'Vamos conversar'
    },
    
    // Stats
    stats: [
      { number: 490, suffix: 'k', label: 'Custo Anual: 6 Especialistas' },
      { number: 155, suffix: 'k', label: 'Backend + Frontend Dev' },
      { number: 200, suffix: 'k', label: 'DevOps + AI Engineer' },
      { number: 135, suffix: 'k', label: 'Designer + Video Editor' }
    ],
    
    // About
    about: {
      title: 'Quanto custa montar um time completo de tecnologia?',
      highlightTitle: 'Por que contratar 6 pessoas quando 1 consegue resolver?',
      highlightText: 'Enquanto você gastaria $490k/ano montando um time completo, eu entrego o mesmo resultado por uma fração do custo. Sem contratações demoradas, sem gestão de equipe, sem conflitos internos.',
      teamBreakdown: {
        title: 'O que você economiza contratando apenas 1 pessoa:',
        positions: [
          { role: 'Backend Developer', salary: '$80k', description: 'APIs, bancos de dados, lógica de negócio' },
          { role: 'Frontend Developer', salary: '$75k', description: 'Interfaces, experiência do usuário' },
          { role: 'DevOps Engineer', salary: '$90k', description: 'Infraestrutura, deploy, monitoramento' },
          { role: 'UI/UX Designer', salary: '$70k', description: 'Design, prototipagem, usabilidade' },
          { role: 'AI Engineer', salary: '$110k', description: 'Inteligência artificial, automação' },
          { role: 'Video Editor/Creative', salary: '$65k', description: 'Conteúdo visual, marketing criativo' }
        ],
        total: '$490k/ano'
      },
      expertiseAreas: [
        {
          title: 'Elimino o setup complexo',
          description: 'Sem meses perdidos contratando, integrando e sincronizando equipes. Resultado desde o primeiro dia.',
          benefit: '6-12 meses de economia'
        },
        {
          title: 'Zero overhead de gestão',
          description: 'Sem reuniões intermináveis, conflitos de equipe ou alinhamentos constantes. Foco total no resultado.',
          benefit: '40% mais produtividade'
        },
        {
          title: 'Stack tecnológico unificado',
          description: 'Decisões técnicas consistentes, arquitetura coesa, sem retrabalho por falta de comunicação.',
          benefit: '70% menos bugs'
        },
        {
          title: 'ROI mensurável desde o início',
          description: 'Cada linha de código tem propósito. Cada funcionalidade gera valor. Sem desperdício.',
          benefit: 'Payback em 60 dias'
        }
      ]
    },
    
    // Skills
    skills: {
      title: 'Stack tecnológico especializado',
      list: [
        { skill: 'LangChain/LangGraph/LangSmith', level: 'Especialista', category: 'AI Architecture' },
        { skill: 'Python/Django/FastAPI', level: 'Especialista', category: 'Backend' },
        { skill: 'Next.js/Vue.js/React', level: 'Especialista', category: 'Frontend' },
        { skill: 'Claude Code/MCP', level: 'Especialista', category: 'AI Engineering' },
        { skill: 'PostgreSQL/Neo4j/Redis', level: 'Avançado', category: 'Database' },
        { skill: 'Docker/Hetzner/Coolify', level: 'Avançado', category: 'Cloud/DevOps' },
        { skill: 'RAG/GraphRAG Systems', level: 'Especialista', category: 'AI Systems' },
        { skill: 'n8n/Webhook Architecture', level: 'Avançado', category: 'Automation' }
      ]
    },
    
    
    // Contact
    contact: {
      title: 'Vamos discutir seu projeto',
      description: 'Pronto para transformar operações manuais em sistemas inteligentes? Vamos conversar sobre como posso ser seu departamento de TI completo e gerar ROI imediato para seu negócio.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      footer: '© 2025 Luiz Gouveia. AI Solutions Architect & Full Stack Developer.',
      whatsappMessage: 'Olá! Tenho interesse em conversar sobre transformação digital do meu negócio.'
    }
  },
  
  en: {
    // Navigation
    nav: {
      about: 'About',
      skills: 'Skills',
      contact: 'Contact'
    },
    
    // Hero Section
    hero: {
      greeting: '',
      title: 'AI Solutions Architect & Full Stack Developer',
      subtitle: 'I transform manual operations into intelligent systems',
      tagline: 'Zero-to-Cloud • 95%+ Accuracy • Measurable Results',
      description: 'Your complete IT department in one person. Expert in LLM-First architectures and digital transformations that generate immediate ROI.',
      viewProjects: 'See how I can help',
      letsChat: 'Let\'s talk'
    },
    
    // Stats
    stats: [
      { number: 490, suffix: 'k', label: 'Annual Cost: 6 Specialists' },
      { number: 155, suffix: 'k', label: 'Backend + Frontend Dev' },
      { number: 200, suffix: 'k', label: 'DevOps + AI Engineer' },
      { number: 135, suffix: 'k', label: 'Designer + Video Editor' }
    ],
    
    // About
    about: {
      title: 'How much does it cost to build a complete tech team?',
      highlightTitle: 'Why hire 6 people when 1 can solve it all?',
      highlightText: 'While you would spend $490k/year building a complete team, I deliver the same results for a fraction of the cost. No lengthy hiring processes, no team management, no internal conflicts.',
      teamBreakdown: {
        title: 'What you save by hiring just 1 person:',
        positions: [
          { role: 'Backend Developer', salary: '$80k', description: 'APIs, databases, business logic' },
          { role: 'Frontend Developer', salary: '$75k', description: 'Interfaces, user experience' },
          { role: 'DevOps Engineer', salary: '$90k', description: 'Infrastructure, deployment, monitoring' },
          { role: 'UI/UX Designer', salary: '$70k', description: 'Design, prototyping, usability' },
          { role: 'AI Engineer', salary: '$110k', description: 'Artificial intelligence, automation' },
          { role: 'Video Editor/Creative', salary: '$65k', description: 'Visual content, creative marketing' }
        ],
        total: '$490k/year'
      },
      expertiseAreas: [
        {
          title: 'I eliminate complex setup',
          description: 'No months lost hiring, integrating and synchronizing teams. Results from day one.',
          benefit: '6-12 months savings'
        },
        {
          title: 'Zero management overhead',
          description: 'No endless meetings, team conflicts or constant alignment. Total focus on results.',
          benefit: '40% more productivity'
        },
        {
          title: 'Unified tech stack',
          description: 'Consistent technical decisions, cohesive architecture, no rework due to miscommunication.',
          benefit: '70% fewer bugs'
        },
        {
          title: 'Measurable ROI from the start',
          description: 'Every line of code has purpose. Every feature generates value. No waste.',
          benefit: 'Payback in 60 days'
        }
      ]
    },
    
    // Skills
    skills: {
      title: 'Specialized tech stack',
      list: [
        { skill: 'LangChain/LangGraph/LangSmith', level: 'Expert', category: 'AI Architecture' },
        { skill: 'Python/Django/FastAPI', level: 'Expert', category: 'Backend' },
        { skill: 'Next.js/Vue.js/React', level: 'Expert', category: 'Frontend' },
        { skill: 'Claude Code/MCP', level: 'Expert', category: 'AI Engineering' },
        { skill: 'PostgreSQL/Neo4j/Redis', level: 'Advanced', category: 'Database' },
        { skill: 'Docker/Hetzner/Coolify', level: 'Advanced', category: 'Cloud/DevOps' },
        { skill: 'RAG/GraphRAG Systems', level: 'Expert', category: 'AI Systems' },
        { skill: 'n8n/Webhook Architecture', level: 'Advanced', category: 'Automation' }
      ]
    },
    
    
    // Contact
    contact: {
      title: 'Let\'s discuss your project',
      description: 'Ready to transform manual operations into intelligent systems? Let\'s talk about how I can be your complete IT department and generate immediate ROI for your business.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      footer: '© 2025 Luiz Gouveia. AI Solutions Architect & Full Stack Developer.',
      whatsappMessage: 'Hello! I\'m interested in discussing the digital transformation of my business.'
    }
  }
};

// Main Portfolio Component
const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('pt');

  const t = translations[language];

  const techStack = [
    'LangChain/LangGraph', 'Claude Code', 'GPT-4o/GPT-5', 'Neo4j AuraDB',
    'Python/Django', 'Next.js/Vue.js', 'PostgreSQL', 'Docker',
    'RAG/GraphRAG', 'MCP', 'Hetzner/Coolify', 'Redis',
    'n8n Workflows', 'Leonardo AI', 'Kling AI', 'FastAPI',
    'Supabase', 'Webhook Architecture', 'TypeScript', 'Tailwind CSS'
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getWhatsAppLink = () => {
    return `https://wa.me/5513981942956`;
  };

  return (
    <div className={`portfolio ${isDarkMode ? '' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">Luiz Gouveia</div>
          <nav className="nav">
            <button className="nav-btn" onClick={() => scrollToSection('about')}>
              {t.nav.about}
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('skills')}>
              {t.nav.skills}
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('contact')}>
              {t.nav.contact}
            </button>
            <button className="nav-btn" onClick={toggleLanguage}>
              {language === 'pt' ? '🇺🇸' : '🇧🇷'}
            </button>
            <button className="nav-btn" onClick={toggleTheme}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content-full">
            <div className="hero-text-center">

              
              <div className="hero-titles">
                <FadeInText delay={200}>
                  <div className="hero-avatar">
                    <img src="/favicon.png" alt="Luiz Gouveia" className="hero-image" />
                  </div>
                </FadeInText>
                <FadeInText delay={400}>
                  <h1 className="hero-title">
                    {t.hero.title}
                  </h1>
                </FadeInText>
                <FadeInText delay={600}>
                  <h2 className="hero-subtitle">
                    {t.hero.subtitle}
                  </h2>
                </FadeInText>
                <FadeInText delay={800}>
                  <p className="hero-tagline">
                    {t.hero.tagline}
                  </p>
                </FadeInText>
              </div>
              
              <FadeInText delay={1000}>
                <p className="hero-description">
                  {t.hero.description}
                </p>
              </FadeInText>
              
              <FadeInText delay={1200}>
                <div className="hero-actions">
                  <a href={getWhatsAppLink()} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    {t.hero.letsChat}
                  </a>
                </div>
              </FadeInText>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {t.stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <StatCounter 
                  end={stat.number} 
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <h2 className="section-title">{t.about.title}</h2>
          <div className="about-content">
            <div className="about-highlight">
              <h3>{t.about.highlightTitle}</h3>
              <p>{t.about.highlightText}</p>
            </div>
            
            {/* Team Cost Breakdown */}
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
                <span className="total-label">Total anual:</span>
                <span className="total-amount">{t.about.teamBreakdown.total}</span>
              </div>
            </div>
            
            <div className="expertise-areas">
              {t.about.expertiseAreas.map((area, index) => (
                <div key={index} className="expertise-item">
                  <div className="expertise-header">
                    <h4>{area.title}</h4>
                    <span className="benefit-badge">{area.benefit}</span>
                  </div>
                  <p>{area.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="tech-stack-simple">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-item-name">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills" id="skills">
        <div className="container">
          <h2 className="section-title">{t.skills.title}</h2>
          <div className="skills-grid">
            {t.skills.list.map((skill, index) => (
              <SkillCard 
                key={index}
                skill={skill.skill}
                level={skill.level}
                category={skill.category}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-content">
            <h2 className="section-title">{t.contact.title}</h2>
            <p className="contact-description">
              {t.contact.description}
            </p>
            
            <div className="contact-methods">
              <a href={getWhatsAppLink()} className="contact-btn" target="_blank" rel="noopener noreferrer">
                {t.contact.whatsapp}
              </a>
              <a href="mailto:Lcpgou@gmail.com" className="contact-btn">
                {t.contact.email}
              </a>
              <a href="https://www.linkedin.com/in/lgohere/" className="contact-btn" target="_blank" rel="noopener noreferrer">
                {t.contact.linkedin}
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