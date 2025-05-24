import React, { useState, useEffect, useRef } from 'react';
import './Portfolio.css';

// Simplified Intersection Observer Hook
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// Simple Fade In Component
const FadeInText = ({ children, delay = 0, className = "" }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.3 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      setTimeout(() => {
        setAnimated(true);
      }, delay);
    }
  }, [isIntersecting, animated, delay]);

  return (
    <div ref={ref} className={`${className} ${animated ? 'fade-in' : 'fade-out'}`}>
      {children}
    </div>
  );
};

// Animated Counter
const StatCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    if (isIntersecting) {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isIntersecting, end, duration]);

  return (
    <div ref={ref} className="stat-number">
      {prefix}{count}{suffix}
    </div>
  );
};

// Skill Card Component - Redesigned without percentages
const SkillCard = ({ skill, delay = 0, category, level }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      setTimeout(() => {
        setAnimated(true);
      }, delay);
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

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.3 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isIntersecting && !animated) {
      setTimeout(() => {
        setAnimated(true);
      }, index * 200);
    }
  }, [isIntersecting, animated, index]);

  return (
    <div 
      ref={ref} 
      className={`project-card ${animated ? 'animate-in' : ''}`}
    >
      <div className="project-header">
        <div>
          <h3 className="project-title">{project.title}</h3>
          {project.featured && <span className="featured-badge">{project.featuredText}</span>}
        </div>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="tech-stack">
        {project.technologies.map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
      
      {project.metrics && (
        <div className="metrics-box">
          <div className="metrics-label">{project.metricsLabel}</div>
          <div className="metrics-value">{project.metrics}</div>
        </div>
      )}
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
      projects: 'Projetos',
      contact: 'Contato'
    },
    
    // Hero Section
    hero: {
      greeting: '',
      title: 'Lead Full Stack Developer & Arquiteto de Soluções Digitais',
      subtitle: 'Desenvolvimento com IA • Automação End-to-End',
      tagline: 'Inovação • Tecnologia • Resultados',
      description: 'Transformo ideias em soluções tecnológicas inovadoras com abordagem AI-Enhanced. Especializado em desenvolvimento full-stack, automação end-to-end e arquitetura de soluções digitais escaláveis.',
      viewProjects: 'Ver Projetos',
      letsChat: 'Vamos Conversar'
    },
    
    // Stats
    stats: [
      { number: 30, suffix: '+', label: 'Projetos Entregues' },
      { number: 4, suffix: '+', label: 'Anos de Experiência' },
      { number: 83, suffix: '%', label: 'Redução em Processos' },
      { number: 99, suffix: '%', label: 'Uptime de Sistemas' }
    ],
    
    // About
    about: {
      title: 'Sobre Mim',
      highlightTitle: 'Transformação Digital com Propósito',
      highlightText: 'Com 4 anos de experiência sólida em tecnologia, especializo-me em criar soluções que realmente fazem a diferença. Minha abordagem combina expertise técnica com visão estratégica para entregar resultados mensuráveis e impacto real.',
      expertiseAreas: [
        {
          title: 'Inteligência Artificial',
          description: 'Desenvolvimento de soluções com Claude, OpenAI e Gemini para automação, análise de dados e processamento de linguagem natural.'
        },
        {
          title: 'Automação de Processos',
          description: 'Criação de workflows automatizados com N8N e Evolution API para otimizar operações e reduzir custos operacionais.'
        },
        {
          title: 'Desenvolvimento Full Stack',
          description: 'Construção de aplicações web completas com Python/Django e Vue.js, focando em performance e experiência do usuário.'
        },
        {
          title: 'Arquitetura de Sistemas',
          description: 'Design de arquiteturas escaláveis com Docker e PostgreSQL para aplicações de alta demanda.'
        }
      ]
    },
    
    // Skills
    skills: {
      title: 'Competências Técnicas',
      list: [
        { skill: 'Python/Django', level: 'Especialista', category: 'Backend' },
        { skill: 'Vue.js/JavaScript', level: 'Avançado', category: 'Frontend' },
        { skill: 'Claude/GPT/Gemini', level: 'Especialista', category: 'IA' },
        { skill: 'N8N/Evolution API', level: 'Especialista', category: 'Automação' },
        { skill: 'PostgreSQL/Supabase', level: 'Avançado', category: 'Database' },
        { skill: 'Docker/Coolify', level: 'Avançado', category: 'DevOps' },
        { skill: 'Figma/LeonardoAI/Ideogram', level: 'Avançado', category: 'Creative' },
        { skill: 'Video/CapCut/Kling AI', level: 'Avançado', category: 'Multimedia' }
      ]
    },
    
    // Projects
    projects: {
      title: 'Projetos em Destaque',
      list: [
        {
          title: 'Salus Water - Ecossistema Digital',
          description: 'Arquitetura completa de soluções digitais para empresa de sistemas de filtração de água situada na Florida USA. Liderança em desenvolvimento full-stack, integração de IA e automação de processos empresariais.',
          technologies: ['Python', 'Django', 'Vue.js', 'AI Integration', 'Docker', 'Infrastructure'],
          metrics: 'Posição atual: Lead Full Stack Developer & Arquiteto de Soluções Digitais',
          metricsLabel: 'Status',
          featured: true,
          featuredText: 'Atual'
        },
        {
          title: 'AutoVideoGen - Sistema de Produção Automatizada',
          description: 'Sistema de IA avançada que automatiza completamente a criação de videoclipes infantis a partir de arquivos de áudio. Pipeline end-to-end com múltiplas APIs de IA para geração de conteúdo visual coerente.',
          technologies: ['Python', 'Streamlit', 'OpenAI GPT-4o', 'Leonardo.AI', 'Kling.AI', 'Groq Whisper', 'FFmpeg'],
          metrics: '70% redução no tempo de processamento, 95% consistência visual, pipeline paralelo',
          metricsLabel: 'Performance',
          featured: true,
          featuredText: 'Inovação'
        },
        {
          title: 'WOA Network - Localização Musical',
          description: 'Plataforma de adaptação cultural e dublagem musical em parceria com engenheiro vencedor do Grammy Latino. Adaptação de 700+ músicas com impacto global massivo.',
          technologies: ['Cultural Adaptation', 'Audio Engineering', 'Content Creation', 'YouTube', 'Music Production'],
          metrics: '60+ milhões de visualizações, 700+ músicas adaptadas, 1.9M views em single',
          metricsLabel: 'Impacto',
          featured: true,
          featuredText: 'Destaque'
        },
        {
          title: 'Allive AI Solutions Platform',
          description: 'Marketplace vertical de IA com deployment automatizado. Agentes especializados com capacidade de engajamento ativo em vendas e sistema de chat em tempo real com parsing de markdown.',
          technologies: ['Python', 'Django', 'OpenAI', 'LangChain', 'PostgreSQL', 'Vue.js', 'Docker'],
          metrics: '60% melhoria na eficiência de deployment, arquitetura de microsserviços escalável',
          metricsLabel: 'Impacto',
          featured: false,
          featuredText: 'Destaque'
        },
        {
          title: 'Sistema de Processamento YouTube com IA',
          description: 'Sistema automatizado de processamento de vídeo usando Moviepy, reduzindo tempo de edição em 83% (de 60 para 10 minutos) para conteúdo de livestreams de 2 horas.',
          technologies: ['Python', 'Moviepy', 'Celery', 'Redis', 'ThreadPoolExecutor', 'OpenAI'],
          metrics: '83% redução no tempo de edição (60→10 min), economia de $2,000+ mensais',
          metricsLabel: 'Impacto',
          featured: true,
          featuredText: 'Destaque'
        },
        {
          title: 'Cactus Bot - Sistema de Monitoramento',
          description: 'Sistema de monitoramento 24/7 com filtragem inteligente e thresholds configuráveis. Infraestrutura tolerante a falhas com logs rotativos.',
          technologies: ['Django', 'Selenium', 'AJAX', 'jQuery', 'Python'],
          metrics: '99.9% uptime, 40% aumento na aquisição de projetos de alto valor',
          metricsLabel: 'Impacto'
        },
        {
          title: 'Enago Bot - Gestão Acadêmica',
          description: 'Sistema automatizado para gestão acadêmica com interface de monitoramento em tempo real e operações thread-safe com zero conflitos.',
          technologies: ['Django', 'PostgreSQL', 'HTML5', 'jQuery', 'Python'],
          metrics: 'Resposta de minutos→segundos, 35% melhoria na captura de assignments',
          metricsLabel: 'Impacto'
        }
      ]
    },
    
    // Contact
    contact: {
      title: 'Vamos Trabalhar Juntos',
      description: 'Pronto para transformar suas ideias em realidade? Entre em contato e vamos discutir como posso ajudar seu projeto a alcançar o próximo nível.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      footer: '© 2025 Luiz Gouveia. Desenvolvido com tecnologia e paixão.',
      whatsappMessage: 'Olá! Gostaria de conversar sobre oportunidades de colaboração.'
    }
  },
  
  en: {
    // Navigation
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    
    // Hero Section
    hero: {
      greeting: '',
      title: 'Lead Full Stack Developer & Digital Solutions Architect',
      subtitle: 'AI-Enhanced Development • End-to-End Automation',
      tagline: 'Innovation • Technology • Results',
      description: 'I transform ideas into innovative technological solutions with AI-Enhanced approach. Specialized in full-stack development, end-to-end automation, and scalable digital solutions architecture.',
      viewProjects: 'View Projects',
      letsChat: 'Let\'s Talk'
    },
    
    // Stats
    stats: [
      { number: 30, suffix: '+', label: 'Projects Delivered' },
      { number: 4, suffix: '+', label: 'Years of Experience' },
      { number: 83, suffix: '%', label: 'Process Reduction' },
      { number: 99, suffix: '%', label: 'System Uptime' }
    ],
    
    // About
    about: {
      title: 'About Me',
      highlightTitle: 'Digital Transformation with Purpose',
      highlightText: 'With 4 years of solid experience in technology, I specialize in creating solutions that truly make a difference. My approach combines technical expertise with strategic vision to deliver measurable results and real impact.',
      expertiseAreas: [
        {
          title: 'Artificial Intelligence',
          description: 'Development of AI solutions using Claude, OpenAI, and Gemini for automation, data analysis, and natural language processing.'
        },
        {
          title: 'Process Automation',
          description: 'Creation of automated workflows with N8N and Evolution API to optimize operations and reduce operational costs.'
        },
        {
          title: 'Full Stack Development',
          description: 'Building complete web applications with Python/Django and Vue.js, focusing on performance and user experience.'
        },
        {
          title: 'Systems Architecture',
          description: 'Design of scalable architectures with Docker and PostgreSQL for high-demand applications.'
        }
      ]
    },
    
    // Skills
    skills: {
      title: 'Technical Competencies',
      list: [
        { skill: 'Python/Django', level: 'Expert', category: 'Backend' },
        { skill: 'Vue.js/JavaScript', level: 'Advanced', category: 'Frontend' },
        { skill: 'Claude/GPT/Gemini', level: 'Expert', category: 'AI' },
        { skill: 'N8N/Evolution API', level: 'Expert', category: 'Automation' },
        { skill: 'PostgreSQL/Supabase', level: 'Advanced', category: 'Database' },
        { skill: 'Docker/Coolify', level: 'Advanced', category: 'DevOps' },
        { skill: 'Figma/LeonardoAI/Ideogram', level: 'Advanced', category: 'Creative' },
        { skill: 'Video/CapCut/Kling AI', level: 'Advanced', category: 'Multimedia' }
      ]
    },
    
    // Projects
    projects: {
      title: 'Featured Projects',
      list: [
        {
          title: 'Salus Water - Digital Ecosystem',
          description: 'Complete digital solutions architecture for water filtration systems company located in Florida USA. Leading full-stack development, AI integration, and enterprise process automation.',
          technologies: ['Python', 'Django', 'Vue.js', 'AI Integration', 'Docker', 'Infrastructure'],
          metrics: 'Current position: Lead Full Stack Developer & Digital Solutions Architect',
          metricsLabel: 'Status',
          featured: true,
          featuredText: 'Current'
        },
        {
          title: 'AutoVideoGen - Automated Production System',
          description: 'Advanced AI system that completely automates the creation of children\'s video clips from audio files. End-to-end pipeline with multiple AI APIs for coherent visual content generation.',
          technologies: ['Python', 'Streamlit', 'OpenAI GPT-4o', 'Leonardo.AI', 'Kling.AI', 'Groq Whisper', 'FFmpeg'],
          metrics: '70% processing time reduction, 95% visual consistency, parallel pipeline',
          metricsLabel: 'Performance',
          featured: true,
          featuredText: 'Innovation'
        },
        {
          title: 'WOA Network - Music Localization',
          description: 'Cultural adaptation and music dubbing platform in partnership with Latin Grammy-winning audio engineer. 700+ songs adapted with massive global impact.',
          technologies: ['Cultural Adaptation', 'Audio Engineering', 'Content Creation', 'YouTube', 'Music Production'],
          metrics: '60+ million views, 700+ songs adapted, 1.9M views on single track',
          metricsLabel: 'Impact',
          featured: true,
          featuredText: 'Featured'
        },
        {
          title: 'Allive AI Solutions Platform',
          description: 'Vertical AI marketplace with automated deployment. Specialized agents with active sales engagement capabilities and real-time chat system with markdown parsing.',
          technologies: ['Python', 'Django', 'OpenAI', 'LangChain', 'PostgreSQL', 'Vue.js', 'Docker'],
          metrics: '60% deployment efficiency improvement, scalable microservices architecture',
          metricsLabel: 'Impact',
          featured: false,
          featuredText: 'Featured'
        },
        {
          title: 'YouTube AI Processing System',
          description: 'Automated video processing system using Moviepy, reducing editing time by 83% (from 60 to 10 minutes) for 2-hour livestream content.',
          technologies: ['Python', 'Moviepy', 'Celery', 'Redis', 'ThreadPoolExecutor', 'OpenAI'],
          metrics: '83% editing time reduction (60→10 min), $2,000+ monthly savings',
          metricsLabel: 'Impact',
          featured: true,
          featuredText: 'Featured'
        },
        {
          title: 'Cactus Bot - Monitoring System',
          description: '24/7 automated monitoring system with intelligent filtering and configurable thresholds. Fault-tolerant infrastructure with rotating logs.',
          technologies: ['Django', 'Selenium', 'AJAX', 'jQuery', 'Python'],
          metrics: '99.9% uptime, 40% increase in high-value project acquisition',
          metricsLabel: 'Impact'
        },
        {
          title: 'Enago Bot - Academic Management',
          description: 'Automated academic management system with real-time monitoring interface and thread-safe operations with zero conflicts.',
          technologies: ['Django', 'PostgreSQL', 'HTML5', 'jQuery', 'Python'],
          metrics: 'Response time: minutes→seconds, 35% improvement in assignment capture',
          metricsLabel: 'Impact'
        }
      ]
    },
    
    // Contact
    contact: {
      title: 'Let\'s Work Together',
      description: 'Ready to transform your ideas into reality? Get in touch and let\'s discuss how I can help your project reach the next level.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      footer: '© 2025 Luiz Gouveia. Built with technology and passion.',
      whatsappMessage: 'Hello! I would like to discuss collaboration opportunities.'
    }
  }
};

// Main Portfolio Component
const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('pt');

  const t = translations[language];

  const techStack = [
    'Python', 'Django', 'Vue.js', 'JavaScript', 'PostgreSQL',
    'Docker', 'N8N', 'Evolution API', 'OpenAI', 'LangChain',
    'Supabase', 'Redis', 'RabbitMQ', 'Coolify', 'Cloudflare',
    'ElevenLabs', 'Groq', 'Midjourney', 'CapCut', 'GIMP',
    'Cursor', 'Figma', 'GSAP', 'Tailwind CSS', 'Selenium',
    'Celery', 'ThreadPoolExecutor', 'Hetzner', 'AWS S3', 'Kling AI',
    'MCP', 'A2A', 'Claude 4', 'Gemini'
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
            <button className="nav-btn" onClick={() => scrollToSection('projects')}>
              {t.nav.projects}
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
                  <a href="#projects" className="btn btn-primary">
                    {t.hero.viewProjects}
                  </a>
                  <a href={getWhatsAppLink()} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
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
            
            <div className="expertise-areas">
              {t.about.expertiseAreas.map((area, index) => (
                <div key={index} className="expertise-item">
                  <h4>{area.title}</h4>
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

      {/* Projects Section */}
      <section className="projects" id="projects">
        <div className="container">
          <h2 className="section-title">{t.projects.title}</h2>
          <div className="projects-grid">
            {t.projects.list.map((project, index) => (
              <ProjectCard 
                key={index}
                project={project}
                index={index}
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
              <a href="mailto:lcpgou@gmail.com" className="contact-btn">
                {t.contact.email}
              </a>
              <a href="https://linkedin.com/in/luizgouveia" className="contact-btn" target="_blank" rel="noopener noreferrer">
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