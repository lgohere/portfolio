import React, { useState, useEffect } from 'react';
import { Menu, ExternalLink, X, Mail, Github, Linkedin, Moon, Sun, MessageCircle } from 'lucide-react';

const translations = {
  en: {
    title: "Full Stack Developer",
    description: "Passionate about creating efficient solutions using Python, Javascript and modern web technologies.",
    projects: "Featured Projects",
    repository: "Repo",
    demo: "Demo",
    footer: "All rights reserved.",
    email: "Email",
    whatsapp: "WhatsApp",
    whatsappMessage: "Hello! I'd like to talk about your portfolio.",
    projectTitles: {
      "Freight Quote Automation System": "Freight Quote Automation System",
      "Cactus Bot - Job Acceptance Automation": "Cactus Bot - Job Acceptance Automation",
      "Alan SDR Agent Interactive Documentation": "Alan SDR Agent Interactive Documentation",
      "Enago Bot Control System": "Enago Bot Control System",
      "YouTube Transcription System": "YouTube Transcription System",
      "DMH Localization Website": "DMH Localization Website",
      "Advanced Web Crawler": "Advanced Web Crawler",
      "Leitura da Palavra": "Bible Reading System",
      "MTH Bolos e Salgados": "MTH Cakes & Snacks",
      "Trot Geo Tracking": "Trot Geo Tracking"
    },
    projectDescriptions: {
      "Freight Quote Automation System": "Automated system for monitoring, extracting, and processing freight quote emails using IMAP, Groq API, and external freight calculation APIs.",
      "Cactus Bot - Job Acceptance Automation": "Automated bot for monitoring and accepting jobs on Cactus Global CRM platform with web control interface.",
      "Alan SDR Agent Interactive Documentation": "Interactive and responsive web documentation for the Alan SDR AI agent, featuring chat interface and visual effects.",
      "Enago Bot Control System": "Control system for automated job acceptance on Enago platform with web interface and advanced monitoring.",
      "YouTube Transcription System": "Full-stack application for extracting and processing YouTube video transcriptions.",
      "DMH Localization Website": "Modern single-page institutional website with interactive animations and particle effects.",
      "Advanced Web Crawler": "Sophisticated web crawler with ethical considerations, text processing, and JSONL output format.",
      "Leitura da Palavra": "Biblical search and reading system with API integration.",
      "MTH Bolos e Salgados": "Online ordering system for a bakery with delivery and pickup options.",
      "Trot Geo Tracking": "Open-source project for implementing geospatial data tracking and visualization."
    }
  },
  pt: {
    title: "Desenvolvedor Full Stack",
    description: "Apaixonado por criar soluções eficientes usando Python, Javascript e tecnologias web modernas.",
    projects: "Projetos em Destaque",
    repository: "Repositório",
    demo: "Demonstração",
    footer: "Todos os direitos reservados.",
    email: "E-mail",
    whatsapp: "WhatsApp",
    whatsappMessage: "Olá! Gostaria de conversar sobre seu portfólio.",
    projectTitles: {
      "Freight Quote Automation System": "Sistema de Automação de Cotação de Frete",
      "Cactus Bot - Job Acceptance Automation": "Cactus Bot - Automação de Aceitação de Trabalhos",
      "Alan SDR Agent Interactive Documentation": "Documentação Interativa do Agente Alan SDR",
      "Enago Bot Control System": "Sistema de Controle Bot Enago",
      "YouTube Transcription System": "Sistema de Transcrição do YouTube",
      "DMH Localization Website": "Site DMH Localization",
      "Advanced Web Crawler": "Web Crawler Avançado",
      "Leitura da Palavra": "Leitura da Palavra",
      "MTH Bolos e Salgados": "MTH Bolos e Salgados",
      "Trot Geo Tracking": "Rastreamento Geográfico Trot"
    },
    projectDescriptions: {
      "Freight Quote Automation System": "Sistema automatizado para monitoramento, extração e processamento de e-mails de cotação de frete usando IMAP, API Groq e APIs externas de cálculo.",
      "Cactus Bot - Job Acceptance Automation": "Bot automatizado para monitorar e aceitar trabalhos na plataforma Cactus Global CRM com interface web de controle.",
      "Alan SDR Agent Interactive Documentation": "Documentação web interativa e responsiva para o agente AI Alan SDR, com interface de chat e efeitos visuais.",
      "Enago Bot Control System": "Sistema de controle para aceitação automatizada de trabalhos na plataforma Enago com interface web e monitoramento avançado.",
      "YouTube Transcription System": "Aplicação full-stack para extrair e processar transcrições de vídeos do YouTube.",
      "DMH Localization Website": "Site institucional moderno de página única com animações interativas e efeitos de partículas.",
      "Advanced Web Crawler": "Web crawler sofisticado com considerações éticas, processamento de texto e formato de saída JSONL.",
      "Leitura da Palavra": "Sistema de busca e leitura bíblica com integração de API.",
      "MTH Bolos e Salgados": "Sistema de pedidos online para confeitaria com opções de entrega e retirada.",
      "Trot Geo Tracking": "Projeto open-source para implementação de rastreamento e visualização de dados geoespaciais."
    }
  }
};

const TechStack = ({ technologies }) => (
  <div className="flex flex-wrap gap-2">
    {technologies.map((tech, index) => (
      <span key={index} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
        {tech}
      </span>
    ))}
  </div>
);

const ProjectCard = ({ title, description, technologies, repoUrl, demoUrl, language }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <TechStack technologies={technologies} />
    <div className="mt-4 flex gap-4">
      {repoUrl && (
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" 
           className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          <Github className="w-4 h-4 mr-1" /> {translations[language].repository}
        </a>
      )}
      {demoUrl && (
        <a href={demoUrl} target="_blank" rel="noopener noreferrer"
           className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          <ExternalLink className="w-4 h-4 mr-1" /> {translations[language].demo}
        </a>
      )}
    </div>
  </div>
);

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [language, setLanguage] = useState('en');

  const getWhatsAppLink = () => {
    const phoneNumber = "5513981942956";
    const message = encodeURIComponent(translations[language].whatsappMessage);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const projects = [
    {
      title: "Freight Quote Automation System",
      description: "Sistema automatizado para monitoramento, extração e processamento de e-mails de cotação de frete usando IMAP, API Groq e APIs externas de cálculo.",
      technologies: ["Python", "IMAP", "Groq API", "API Integration", "Natural Language Processing"],
      repoUrl: "https://github.com/lgohere/agentefrete"
    },
    {
      title: "Cactus Bot - Job Acceptance Automation",
      description: "Bot automatizado para monitorar e aceitar trabalhos na plataforma Cactus Global CRM com interface web de controle.",
      technologies: ["Python", "Django", "Selenium", "Threading", "Web Automation"],
      repoUrl: "https://github.com/lgohere/cactusbot"
    },
    {
      title: "Alan SDR Agent Interactive Documentation",
      description: "Documentação web interativa e responsiva para o agente AI Alan SDR, com interface de chat e efeitos visuais.",
      technologies: ["HTML5", "CSS3", "JavaScript", "CSS Grid", "Flexbox"],
      demoUrl: "https://bit.ly/superagente-desafio",
      repoUrl: "https://github.com/lgohere/desafio-prompt"
    },
    {
      title: "Enago Bot Control System",
      description: "Sistema de controle para aceitação automatizada de trabalhos na plataforma Enago com interface web e monitoramento avançado.",
      technologies: ["Python", "Django", "Selenium", "PostgreSQL", "jQuery"],
      repoUrl: "https://github.com/lgohere/enagobot"
    },
    {
      title: "YouTube Transcription System",
      description: "Aplicação full-stack para extrair e processar transcrições de vídeos do YouTube.",
      technologies: ["Python", "Django", "BeautifulSoup", "youtube-dl", "ThreadPoolExecutor"],
      repoUrl: "https://github.com/lgohere/yt-transcriptor"
    },
    {
      title: "DMH Localization Website",
      description: "Site institucional moderno de página única com animações interativas e efeitos de partículas.",
      technologies: ["HTML5", "Tailwind CSS", "JavaScript", "GSAP", "Particles.js"],
      repoUrl: "https://github.com/lgohere/dmh"
    },
    {
      title: "Advanced Web Crawler",
      description: "Web crawler sofisticado com considerações éticas, processamento de texto e formato de saída JSONL.",
      technologies: ["Python", "BeautifulSoup", "NLTK", "Web Scraping", "Natural Language Processing"],
      repoUrl: "https://github.com/lgohere/crawler"
    },
    {
      title: "Leitura da Palavra",
      description: "Sistema de busca e leitura bíblica com integração de API.",
      technologies: ["Django", "JavaScript", "HTML", "CSS", "fly.io"],
      demoUrl: "https://leituradapalavra.fly.dev",
      repoUrl: "https://github.com/lgohere/leituradapalavra"
    },
    {
      title: "MTH Bolos e Salgados",
      description: "Sistema de pedidos online para confeitaria com opções de entrega e retirada.",
      technologies: ["Vue.js", "JavaScript", "HTML", "CSS"],
      demoUrl: "https://www.mthbolosesalgados.com.br",
      repoUrl: "https://github.com/lgohere/th-webpage"
    },
    {
      title: "Trot Geo Tracking",
      description: "Projeto open-source para implementação de rastreamento e visualização de dados geoespaciais.",
      technologies: ["Vue.js", "JavaScript", "Geospatial APIs"],
      repoUrl: "https://github.com/lgohere/trot-geo-tracking"
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">Luiz Gouveia</span>
            </div>
            
            {/* Desktop navigation com WhatsApp */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={toggleLanguage}
                className="text-2xl hover:opacity-80 transition-opacity"
                aria-label="Toggle language"
              >
                {language === 'en' ? '🇧🇷' : '🇺🇸'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {/* Social Links */}
              <a href="https://github.com/lgohere" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/lgohere" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:lcpgou@gmail.com" 
                 className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
              <a href={getWhatsAppLink()} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleLanguage}
                className="text-2xl hover:opacity-80 transition-opacity mr-4"
              >
                {language === 'en' ? '🇧🇷' : '🇺🇸'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mr-4"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="px-4 py-2 space-y-4">
              <a href="https://github.com/lgohere" target="_blank" rel="noopener noreferrer"
                 className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <Github className="h-5 w-5 mr-2" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/lgohere" target="_blank" rel="noopener noreferrer"
                 className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <Linkedin className="h-5 w-5 mr-2" /> LinkedIn
              </a>
              <a href="mailto:lcpgou@gmail.com" 
                 className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <Mail className="h-5 w-5 mr-2" /> {translations[language].email}
              </a>
              <a href={getWhatsAppLink()}
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" /> {translations[language].whatsapp}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-blue-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {translations[language].title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {translations[language].description}
          </p>
          <div className="flex flex-wrap gap-4">
            <TechStack technologies={[
              "Python", "Django", "JavaScript", "Vue.js", "React",
              "HTML5", "CSS3", "Selenium", "PostgreSQL", "DevOps"
            ]} />
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {translations[language].projects}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard 
                key={index} 
                {...project}
                title={translations[language].projectTitles[project.title]}
                description={translations[language].projectDescriptions[project.title]}
                language={language}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© 2024 Luiz Gouveia. {translations[language].footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;