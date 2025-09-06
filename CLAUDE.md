# CLAUDE.md - Portfolio Digital Luiz Gouveia

## Visão Geral do Projeto
Portfolio pessoal de Luiz Gouveia, Lead Full Stack Developer & Arquiteto de Soluções Digitais, desenvolvido como uma Single Page Application (SPA) em React. O projeto apresenta uma interface moderna, responsiva e multilíngue (português/inglês) com tema escuro/claro alternável.

## Arquitetura do Sistema

### Stack Tecnológica Principal
- **Frontend Framework**: React 18.3.1
- **Build Tool**: Create React App 5.0.1
- **Estilização**: CSS vanilla com design system customizado + Tailwind CSS 3.4.14
- **Fonte**: Inter (Google Fonts)
- **Ícones**: Lucide React 0.454.0
- **Animações**: Intersection Observer API customizada
- **Deployment**: GitHub Pages (domínio: luizgouveia.com.br)

### Dependências do Projeto
```json
"dependencies": {
  "lucide-react": "^0.454.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-intersection-observer": "^9.16.0",
  "react-scripts": "5.0.1"
}
```

### Ferramentas de Desenvolvimento
- **CSS Framework**: Tailwind CSS + PostCSS + Autoprefixer
- **Linting**: ESLint (configuração React)
- **Testing**: Jest + React Testing Library
- **Deployment**: gh-pages para GitHub Pages

## Estrutura de Arquivos

```
portfolio/
├── public/                    # Arquivos estáticos
│   ├── favicon.png           # Avatar/logo do usuário
│   ├── index.html            # HTML principal
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # SEO robots
│   └── CNAME                 # Configuração domínio customizado
├── src/
│   ├── components/
│   │   ├── Portfolio.js      # Componente principal (2670+ linhas)
│   │   ├── Portfolio.css     # Estilos customizados (1060+ linhas)
│   │   ├── postcss.config.js # Configuração PostCSS
│   │   └── tailwind.config.js # Configuração Tailwind
│   ├── App.js                # Wrapper principal
│   ├── index.js              # Entry point React
│   ├── index.css             # Base Tailwind imports
│   └── setupTests.js         # Configuração Jest
├── package.json              # Configuração NPM
├── tailwind.config.js        # Configuração Tailwind global
└── postcss.config.js         # Configuração PostCSS global
```

## Componente Principal - Portfolio.js

### Arquitetura de Componentes

#### 1. Custom Hooks
- **useIntersectionObserver**: Hook customizado para animações baseadas na visibilidade
- Implementação simplificada do Intersection Observer API
- Threshold configurável e cleanup automático

#### 2. Componentes de Animação
- **FadeInText**: Componente para animação de fade-in com delay configurável
- **StatCounter**: Contador animado para estatísticas numéricas
- **SkillCard**: Cards de habilidades com animação staggered
- **ProjectCard**: Cards de projetos com hover effects

#### 3. Sistema de Tradução
Implementação de sistema de localização completo com objetos estruturados:
```javascript
const translations = {
  pt: { /* Conteúdo em português */ },
  en: { /* Conteúdo em inglês */ }
}
```

Seções traduzidas:
- Navegação
- Hero Section
- Estatísticas
- Sobre
- Habilidades
- Projetos
- Contato

### Estrutura de Seções

#### 1. Header Fixo
- Logo personalizado
- Navegação com scroll suave
- Toggle de idioma (🇧🇷/🇺🇸)
- Toggle de tema (🌙/☀️)
- Background blur com backdrop-filter

#### 2. Hero Section
- Layout centralizado responsivo
- Avatar/imagem pessoal
- Títulos hierárquicos com animações
- Call-to-action buttons
- Animações sequenciais com delays

#### 3. Stats Section
- Grid responsivo de estatísticas
- Contadores animados com Intersection Observer
- Cards com hover effects
- Métricas de impacto profissional

#### 4. About Section
- Apresentação pessoal destacada
- Grid de áreas de expertise
- Tech stack visual com tags interativas
- Hover effects e transições suaves

#### 5. Skills Section
- Cards de habilidades categorizadas
- Sistema de níveis (Expert, Avançado)
- Layout responsivo em grid
- Animações staggered de entrada

#### 6. Projects Section
- Showcase de projetos principais
- Badges de destaque (Atual, Inovação, Featured)
- Métricas de performance/impacto
- Tags de tecnologias utilizadas
- Cards expansivos com hover

#### 7. Contact Section
- Links diretos para comunicação
- WhatsApp, Email, LinkedIn
- Footer com copyright

## Design System - Portfolio.css

### Variáveis CSS Customizadas

#### Paleta de Cores
```css
/* Dark Theme */
--bg-primary: #0a0a0a;
--bg-secondary: #1a1a1a;
--bg-tertiary: #2a2a2a;
--text-primary: #ffffff;
--accent-primary: #3b82f6;

/* Light Theme */
--bg-primary-light: #ffffff;
--text-primary-light: #1e293b;
/* ... */
```

#### Sistema de Espaçamento
```css
--spacing-xs: 0.5rem;    /* 8px */
--spacing-sm: 1rem;      /* 16px */
--spacing-md: 1.5rem;    /* 24px */
--spacing-lg: 2rem;      /* 32px */
--spacing-xl: 3rem;      /* 48px */
--spacing-2xl: 4rem;     /* 64px */
--spacing-3xl: 6rem;     /* 96px */
```

#### Tipografia Responsiva
```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
/* ... até 6xl (60px) */
```

### Breakpoints Responsivos

#### Sistema Mobile-First
- **320px**: Extra Small Mobile
- **480px**: Mobile
- **768px**: Tablet
- **1024px**: Desktop
- **1280px**: Large Desktop
- **1536px**: Extra Large Desktop

#### Adaptações por Breakpoint
- **Mobile (≤480px)**: Header vertical, navegação stacked, hero ajustado
- **Tablet (≤768px)**: Grid simplificado, espaçamento reduzido
- **Desktop (≥1024px)**: Layout completo, múltiplas colunas

### Animações e Transições

#### Sistema de Fade-in
```css
.fade-in {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.8s ease;
}

.fade-out {
  opacity: 0;
  transform: translateY(20px);
}
```

#### Hover Effects Consistentes
- **Cards**: translateY(-5px) + box-shadow elevation
- **Buttons**: translateY(-2px) + color transitions
- **Tech Tags**: background color change + slight lift

### Acessibilidade

#### Recursos Implementados
- **Focus Styles**: Outlines visíveis para navegação por teclado
- **Reduced Motion**: Suporte para `prefers-reduced-motion`
- **High Contrast**: Adaptação para `prefers-contrast: high`
- **Print Styles**: Layout otimizado para impressão

## Funcionalidades Principais

### 1. Sistema de Temas (Dark/Light)
- Toggle persistente durante a sessão
- Transições suaves entre temas
- Variáveis CSS para mudanças automáticas
- Ícones indicativos (🌙/☀️)

### 2. Internacionalização (i18n)
- Suporte completo português/inglês
- Toggle com bandeiras (🇧🇷/🇺🇸)
- Conteúdo estruturado em objetos translation
- Alternância instantânea sem reload

### 3. Navegação Suave
- Scroll behavior suave entre seções
- Header fixo com background blur
- Indicadores visuais de hover
- Links com âncoras para seções

### 4. Animações de Performance
- Intersection Observer para lazy loading
- Animações triggadas apenas quando visíveis
- Contadores numéricos animados
- Stagger effects para cards

### 5. Responsividade Completa
- Design mobile-first
- Breakpoints estratégicos
- Layout flex/grid híbrido
- Imagens e conteúdo adaptativo

## Conteúdo e Dados

### Projetos Destacados
1. **Salus Water** - Posição atual como Lead Full Stack Developer
2. **AutoVideoGen** - Sistema de IA para produção automatizada
3. **WOA Network** - Localização musical com impacto global
4. **Allive AI Solutions** - Marketplace vertical de IA
5. **YouTube AI Processing** - Sistema de processamento automatizado
6. **Cactus Bot** - Sistema de monitoramento 24/7
7. **Enago Bot** - Gestão acadêmica automatizada

### Stack Tecnológico Apresentado
- **Backend**: Python, Django
- **Frontend**: Vue.js, JavaScript
- **IA**: Claude, GPT, Gemini
- **Automação**: N8N, Evolution API
- **Database**: PostgreSQL, Supabase
- **DevOps**: Docker, Coolify
- **Creative**: Figma, Leonardo AI, Ideogram
- **Multimedia**: CapCut, Kling AI

### Métricas de Performance
- 30+ Projetos Entregues
- 4+ Anos de Experiência
- 83% Redução em Processos
- 99% Uptime de Sistemas

## Scripts de Build e Deploy

### Comandos Disponíveis
```bash
# Desenvolvimento
npm start              # Servidor local porta 3000

# Build e Deploy
npm run build          # Build otimizado para produção
npm run predeploy      # Pre-build automático
npm run deploy         # Deploy para GitHub Pages

# Testing
npm test               # Jest test runner
npm run eject          # Eject Create React App (irreversível)
```

### Configuração de Deploy
- **Target**: GitHub Pages
- **Branch**: gh-pages (automático)
- **Domain**: luizgouveia.com.br
- **HTTPS**: Habilitado via GitHub Pages
- **CDN**: GitHub CDN global

## SEO e Performance

### Meta Tags Otimizadas
```html
<meta name="description" content="Luiz Gouveia - Lead Full Stack Developer & Digital Solutions Architect especializado em AI-Enhanced Development, Automação End-to-End e Arquitetura de Soluções Digitais" />
<meta name="theme-color" content="#000000" />
```

### Otimizações de Performance
- **Fonts**: Google Fonts com preconnect
- **Images**: Favicon.png otimizado
- **CSS**: Tailwind purged + custom CSS minificado
- **JS**: React production build com code splitting
- **Caching**: Service Worker via CRA

### Estrutura PWA
- **Manifest**: Configurado para instalação
- **Service Worker**: Cache automático via CRA
- **Icons**: Apple touch icon configurado
- **Offline**: Suporte básico para funcionamento offline

## Comandos de Desenvolvimento

### Setup Inicial
```bash
npm install            # Instalar dependências
npm start              # Iniciar servidor de desenvolvimento
```

### Build de Produção
```bash
npm run build          # Gerar build otimizado
npm run deploy         # Deploy para GitHub Pages
```

### Estrutura de CSS
- **Base**: Tailwind utilities
- **Components**: Custom CSS no Portfolio.css
- **Theme**: CSS variables para dark/light mode
- **Responsive**: Mobile-first breakpoints

## Manutenção e Updates

### Estrutura para Atualizações
1. **Conteúdo**: Editar arrays de projetos/skills no Portfolio.js
2. **Styling**: Modificar variáveis CSS ou classes no Portfolio.css
3. **Funcionalidades**: Adicionar novos componentes ou hooks
4. **Deploy**: Executar `npm run deploy` após mudanças

### Boas Práticas Implementadas
- Componentização clara e reutilizável
- CSS bem estruturado com naming consistente
- Sistema de tradução escalável
- Performance otimizada com lazy loading
- Acessibilidade considerada desde o design
- Mobile-first approach
- SEO-friendly structure

Este portfolio representa uma implementação moderna de Single Page Application com foco em performance, acessibilidade e experiência do usuário, desenvolvido com as melhores práticas de desenvolvimento frontend.