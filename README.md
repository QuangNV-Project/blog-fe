# Blog FE - Next.js 16 Application

A modern, production-ready blog application built with Next.js 16 App Router, following best practices and industry standards.

## ✨ Features

- 🚀 **Next.js 16** with App Router
- 💎 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** component library
- 🔄 **TanStack Query** for server state management
- 🐻 **Zustand** for client state management
- 📝 **React Hook Form + Zod** for form handling
- 🌓 **Dark mode** support
- 🐳 **Docker** ready
- 🔧 **ESLint + Prettier** configured
- 🪝 **Husky** git hooks
- 📊 **SonarQube** integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Setup environment:**

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values
```

3. **Run development server:**

```bash
npm run dev
# or
.\run-dev.ps1  # Windows PowerShell
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |

## 📁 Project Structure

```
blog-fe/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home page
│   │   ├── (main)/              # Main layout group
│   │   ├── about/               # About page
│   │   ├── blog/                # Blog pages
│   │   │   ├── page.tsx         # Blog list
│   │   │   └── [id]/            # Dynamic blog post
│   │   └── contact/             # Contact page
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components (Header, Footer)
│   │   └── theme-toggle.tsx     # Theme switcher
│   │
│   ├── api/
│   │   ├── axios/               # Axios config & interceptors
│   │   ├── services/            # API service functions
│   │   └── queries/             # TanStack Query hooks
│   │
│   ├── providers/               # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── stores/                  # Zustand stores
│   ├── lib/                     # Utility functions
│   ├── types/                   # TypeScript type definitions
│   ├── schemas/                 # Zod validation schemas
│   ├── constants/               # App constants
│   ├── config/                  # Configuration
│   ├── utils/                   # Helper functions
│   └── middleware.ts            # Next.js middleware
│
├── public/                      # Static assets
├── .husky/                      # Git hooks
├── .vscode/                     # VS Code settings
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose setup
├── nginx.conf                   # Nginx configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
└── components.json              # shadcn/ui config
```

## 🎨 Tech Stack

### Core
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Static type checking

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **Radix UI** - Unstyled, accessible components
- **class-variance-authority** - Component variants

### Data Management
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client

### Forms
- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Conventional commits

## 🧩 Adding Components

Add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
```

## 🐳 Docker

### Development

```bash
docker-compose up -d
```

### Production Build

```bash
# Build image
docker build -t blog-fe .

# Run container
docker run -p 3000:3000 --env-file .env.local blog-fe
```

## 📝 Code Guidelines

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add blog post page
fix: resolve navigation bug
docs: update README
style: format code
refactor: improve error handling
test: add unit tests
chore: update dependencies
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy automatically

### Self-Hosted

```bash
# Build
npm run build

# Start
npm run start
```

### Docker

```bash
docker build -t blog-fe .
docker push your-registry/blog-fe
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=Blog FE
NODE_ENV=development
```

## 📚 Documentation

- See [SETUP.md](./SETUP.md) for detailed setup guide
- Check component documentation in [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com)

