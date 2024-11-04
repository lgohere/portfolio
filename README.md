# Portfólio - Luiz Gouveia

![GitHub](https://img.shields.io/github/license/lgohere/portfolio)
![React Version](https://img.shields.io/badge/react-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4.0-38B2AC)

Um portfólio moderno e responsivo desenvolvido com React, apresentando modo escuro, suporte multilíngue e design adaptativo.

## 🚀 Tecnologias Utilizadas

### Core
- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Lucide React](https://lucide.dev/) - Biblioteca de ícones

### Funcionalidades Principais
- Sistema de tema escuro/claro com persistência
- Internacionalização (EN/PT-BR)
- Layout responsivo (Mobile First)
- Integração com redes sociais e WhatsApp

### Dependências
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17"
  }
}
```

## 🎯 Funcionalidades

- **Tema Escuro/Claro**
  - Alternância de tema com persistência via localStorage
  - Detecção automática de preferência do sistema

- **Suporte Multilíngue**
  - Inglês (EN)
  - Português (PT-BR)
  - Traduções completas para todos os textos

- **Design Responsivo**
  - Layout Mobile First
  - Menu hamburguer para dispositivos móveis
  - Grid adaptativo para projetos

- **Integração Social**
  - Links para GitHub, LinkedIn
  - Integração com WhatsApp
  - Contato via email

## 💻 Pré-requisitos

- Node.js versão 14.0 ou superior
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lgohere/portfolio.git
```

2. Entre na pasta do projeto:
```bash
cd portfolio
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o projeto:
```bash
npm start
```

## 📁 Estrutura do Projeto

```
portfolio/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Portfolio.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🎨 Personalização

### Temas
O projeto utiliza Tailwind CSS com suporte a tema escuro. Para personalizar as cores:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      // Adicione suas customizações aqui
    }
  }
}
```

### Traduções
As traduções são gerenciadas através do objeto `translations` em `Portfolio.js`:

```javascript
const translations = {
  en: {
    // English translations
  },
  pt: {
    // Portuguese translations
  }
}
```

## 🚀 Deploy

Para fazer deploy com GitHub Pages:

1. Instale gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Adicione ao package.json:
```json
{
  "homepage": "https://lgohere.github.io/portfolio",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Execute o deploy:
```bash
npm run deploy
```

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## 👨‍💻 Autor

**Luiz Gouveia**

- LinkedIn: [@lgohere](https://www.linkedin.com/in/lgohere)
- GitHub: [@lgohere](https://github.com/lgohere)
- WhatsApp: +55 13 981942956

---
⌨️ com ❤️ por [Luiz Gouveia](https://github.com/lgohere)
