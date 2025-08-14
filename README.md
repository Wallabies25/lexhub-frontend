# LexHUB Frontend

A comprehensive React application for intellectual property law resources, AI assistance, and legal consultation built with modern web technologies.

## 🚀 Tech Stack

### **Core Framework & Language**
- **React 18.3.1** - Modern React library with hooks and concurrent features
- **TypeScript 5.5.3** - Static type checking for enhanced development experience
- **React Router DOM 7.7.1** - Client-side routing for single-page application navigation

### **Build Tool & Development Environment**
- **Vite 5.4.2** - Lightning-fast build tool with Hot Module Replacement (HMR)
- **@vitejs/plugin-react 4.3.1** - Official Vite plugin for React support
- **ES2020** - Modern JavaScript features and syntax

### **Styling & UI Framework**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for rapid UI development
- **PostCSS 8.4.35** - CSS post-processor for advanced styling capabilities
- **Autoprefixer 10.4.18** - Automatically adds vendor prefixes for cross-browser compatibility
- **Lucide React 0.344.0** - Beautiful & consistent icon library with 1000+ icons

### **Code Quality & Linting**
- **ESLint 9.9.1** - Comprehensive JavaScript/TypeScript linter
- **@typescript-eslint/eslint-plugin 8.3.0** - TypeScript-specific ESLint rules
- **@typescript-eslint/parser 8.3.0** - TypeScript parser for ESLint
- **eslint-plugin-react-hooks 5.1.0** - ESLint rules for React Hooks
- **eslint-plugin-react-refresh 0.4.9** - ESLint plugin for React Fast Refresh
- **typescript-eslint 8.3.0** - Unified TypeScript ESLint configuration

### **Type Definitions**
- **@types/react 18.3.3** - TypeScript definitions for React
- **@types/react-dom 18.3.0** - TypeScript definitions for React DOM

### **Application Features**
- **Multilingual Support** - English, Sinhala (සිංහල), and Tamil (தமிழ்) languages
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **IP Law Platform** - Specialized for Sri Lankan intellectual property law
- **AI Assistant Integration** - Chatbot functionality for legal queries
- **Lawyer Consultation** - Professional legal consultation booking
- **Community Forum** - Discussion platform for legal topics
- **Statute Database** - Comprehensive IP law statute search
- **User Dashboards** - Separate interfaces for students and lawyers

## 🛠️ Getting Started

### **Prerequisites**

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SandaruHW/LexHUB.git
   cd LexHUB/lexhub-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### **Development**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

The development server includes:
- 🔥 Hot Module Replacement (HMR)
- 🔧 TypeScript type checking
- 🎯 ESLint integration
- 📱 Mobile-responsive testing

### **Building for Production**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

### **Code Quality**

**Run ESLint to check for code quality issues:**
```bash
npm run lint
```

**TypeScript type checking:**
```bash
npx tsc --noEmit
```

## 📁 Project Structure

```
lexhub-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Chatbot.tsx      # AI chatbot interface
│   │   ├── ChatbotWidget.tsx # Floating chatbot widget
│   │   ├── Dashboard.tsx     # Dashboard layout component
│   │   ├── Header.tsx        # Navigation header with language selector
│   │   ├── LawyerConsultation.tsx # Lawyer consultation booking
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── StatuteSearch.tsx # Statute search functionality
│   ├── contexts/            # React Context providers
│   │   └── LanguageContext.tsx # Multilingual support context
│   ├── pages/               # Application pages
│   │   ├── AboutPage.tsx     # About us page
│   │   ├── AuthPage.tsx      # Authentication page
│   │   ├── ChatbotPage.tsx   # AI assistant page
│   │   ├── ConsultationPage.tsx # Lawyer consultation page
│   │   ├── ForumPage.tsx     # Community forum
│   │   ├── HomePage.tsx      # Landing page
│   │   ├── LawyerDashboard.tsx # Lawyer dashboard
│   │   ├── StatutePage.tsx   # Statute database page
│   │   └── StudentDashboard.tsx # Student dashboard
│   ├── App.tsx              # Main application component with routing
│   ├── index.css            # Global styles and Tailwind imports
│   └── main.tsx             # Application entry point
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts          # Vite build tool configuration
```

## ✨ Features

### **Development Experience**
- ⚡ **Lightning Fast Development** - Vite's HMR for instant updates
- 🎨 **Modern Styling** - Tailwind CSS utility-first approach
- 🔧 **Type Safety** - Full TypeScript integration with strict mode
- 📏 **Code Quality** - ESLint + TypeScript ESLint for consistent code
- 🏗️ **Optimized Builds** - Production-ready builds with code splitting

### **Application Features**
- 🌍 **Multilingual Support** - English, Sinhala, and Tamil language options
- 🤖 **AI Legal Assistant** - Intelligent chatbot for IP law queries
- ⚖️ **Statute Database** - Comprehensive Sri Lankan IP law statutes
- 👥 **Community Forum** - Discussion platform for legal topics
- 👨‍💼 **Lawyer Consultation** - Professional legal consultation booking
- 📚 **Educational Resources** - Resources for students and professionals
- � **Responsive Design** - Mobile-first design for all devices
- 🧭 **Intuitive Navigation** - User-friendly interface with clear routing

### **User Types**
- � **Students** - Educational resources and learning materials
- 👨‍💼 **Lawyers** - Professional tools and consultation management
- 👤 **General Public** - Access to legal information and assistance

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🌐 Environment Configuration

The application uses Vite's environment configuration:

- **Development**: `http://localhost:3000`
- **Build Output**: `dist/` directory
- **TypeScript**: Strict mode enabled
- **ESLint**: React + TypeScript rules

## 🚀 Deployment

The built application can be deployed to any static hosting service:

- **Vercel** (Recommended for Next.js/React apps)
- **Netlify** 
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Firebase Hosting**

Build command: `npm run build`  
Output directory: `dist/`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run linting:** `npm run lint`
5. **Ensure TypeScript compiles:** `npx tsc --noEmit`
6. **Commit your changes:** `git commit -m 'Add amazing feature'`
7. **Push to the branch:** `git push origin feature/amazing-feature`
8. **Submit a pull request**

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Built with ❤️ for Sri Lankan IP Law Community**
