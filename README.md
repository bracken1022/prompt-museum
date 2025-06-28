# 🎨 Prompt Museum

A modern, glassmorphism-styled web application for discovering, creating, and sharing AI prompts across different AI agents. Built with Next.js and NestJS, featuring a contemporary dark theme with beautiful animations and micro-interactions.

![Prompt Museum Banner](https://img.shields.io/badge/Prompt%20Museum-Modern%20AI%20Prompt%20Library-blueviolet?style=for-the-badge)

## ✨ Features

### 🎯 **Core Functionality**
- **🤖 Multi-AI Agent Support** - Claude, ChatGPT, Gemini, Midjourney, DALL-E, Stable Diffusion
- **📝 Prompt Management** - Create, edit, share, and discover prompts
- **🏷️ Smart Organization** - Category-based filtering and tag system
- **❤️ Community Engagement** - Like and favorite prompts
- **🔍 Advanced Search** - Find prompts by content, tags, or categories
- **👤 User Authentication** - Secure JWT-based auth system

### 🎨 **Modern Design**
- **✨ Glassmorphism UI** - Contemporary transparent design with backdrop blur
- **🌙 Dark Theme** - Beautiful gradient backgrounds with floating animations
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🎭 Micro-interactions** - Smooth hover effects and transitions
- **🎪 Animated Elements** - Floating orbs and dynamic backgrounds

### 🔧 **Technical Features**
- **⚡ Server-Side Rendering** - Next.js 14 with App Router
- **🛡️ Type Safety** - Full TypeScript implementation
- **🗄️ Database Integration** - MySQL with TypeORM
- **🐳 Containerization** - Docker Compose for easy deployment
- **🔐 Secure Authentication** - JWT tokens with proper session management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Docker & Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/prompt-museum.git
cd prompt-museum
```

### 2. Start the Database
```bash
docker-compose up -d
```

### 3. Install Dependencies
```bash
# Backend
cd backend
yarn install

# Frontend  
cd ../frontend
yarn install
```

### 4. Configure Environment Variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=prompt_user
DB_PASSWORD=prompt_password
DB_DATABASE=prompt_museum
JWT_SECRET=your-super-secret-jwt-key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Run the Applications
```bash
# Terminal 1 - Backend
cd backend
yarn start:dev

# Terminal 2 - Frontend  
cd frontend
yarn dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Database Admin**: http://localhost:8080 (phpMyAdmin)

## 📁 Project Structure

```
prompt-museum/
├── 📂 backend/                 # NestJS API Server
│   ├── 📂 src/
│   │   ├── 📂 auth/           # Authentication system
│   │   ├── 📂 entities/       # Database entities
│   │   ├── 📂 prompts/        # Prompt management
│   │   └── 📄 main.ts         # Application entry
│   └── 📄 package.json
├── 📂 frontend/               # Next.js Web App
│   ├── 📂 src/app/
│   │   ├── 📂 components/     # Reusable UI components
│   │   ├── 📂 dashboard/      # Dashboard page
│   │   ├── 📂 prompt/         # Prompt detail pages
│   │   └── 📂 utils/          # Utility functions
│   └── 📄 package.json
├── 📄 docker-compose.yml     # Database containers
├── 📄 init.sql              # Database initialization
└── 📄 README.md             # This file
```

## 🎨 Screenshots

### 🏠 Homepage
Beautiful glassmorphism login interface with animated background elements.

### 📊 Dashboard
Modern dark theme with collapsible sidebar and prompt cards featuring smooth animations.

### 📝 Prompt Detail
Clean, focused view for reading and copying prompts with modern typography.

### ➕ Create Prompt
Intuitive form interface with glassmorphism styling for creating new prompts.

## 🛠️ Technology Stack

### Frontend
- **⚛️ Next.js 14** - React framework with App Router
- **📘 TypeScript** - Type-safe JavaScript
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **✨ Glassmorphism** - Modern UI design pattern

### Backend
- **🏗️ NestJS** - Progressive Node.js framework
- **📊 TypeORM** - Object-Relational Mapping
- **🗄️ MySQL** - Relational database
- **🔐 JWT** - JSON Web Tokens for authentication
- **🛡️ Passport.js** - Authentication middleware

### DevOps
- **🐳 Docker** - Containerization
- **📦 Yarn** - Package management
- **🔧 ESLint** - Code linting
- **💅 Prettier** - Code formatting

## 🎯 Key Pages & Components

### 🏠 **Authentication (`/`)**
- Modern login/register interface
- Animated background with floating orbs
- Form validation and error handling
- Smooth transitions between login/signup modes

### 📊 **Dashboard (`/dashboard`)**
- Collapsible AI agent sidebar
- Glassmorphism prompt cards
- Search and filter functionality
- Responsive grid layout

### 📝 **Prompt Detail (`/prompt/[id]`)**
- Full prompt content display
- Copy-to-clipboard functionality
- Like/unlike interactions
- Usage tips and recommendations

### ➕ **Create Prompt (`/new-prompt`)**
- Multi-step form interface
- Agent and category selection
- Tag management system
- Real-time preview

## 🔥 Modern UI Features

### ✨ Glassmorphism Design
- Transparent backgrounds with backdrop blur
- Subtle border treatments
- Layered depth with proper z-indexing
- Modern color palette with purple/pink gradients

### 🎭 Animations & Interactions
- Smooth hover animations and transitions
- Scale transforms on button interactions
- Color transitions for form focus states
- Floating background elements

### 🌙 Dark Theme
- Dark gradient backgrounds
- High contrast typography
- Purple-tinted secondary text
- Consistent visual hierarchy

## 🔐 Authentication System

- **JWT-based authentication** with secure token storage
- **Password hashing** using bcrypt with salt rounds
- **Protected routes** with authentication guards
- **Session management** with automatic token refresh

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- name (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Prompts Table
```sql
- id (Primary Key)
- title (VARCHAR)
- description (TEXT)
- content (TEXT)
- category (VARCHAR)
- agent (VARCHAR)
- tags (JSON)
- likes_count (INTEGER)
- is_public (BOOLEAN)
- user_id (Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🚀 Deployment

### Using Docker
```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d
```

### Manual Deployment
1. Build the frontend: `cd frontend && yarn build`
2. Build the backend: `cd backend && yarn build`
3. Configure production environment variables
4. Deploy to your preferred hosting platform

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly

## 📝 API Documentation

### Authentication Endpoints
```
POST /auth/register - Register new user
POST /auth/login    - User login
POST /auth/forgot-password - Password reset
```

### Prompt Endpoints
```
GET    /prompts           - List all prompts
GET    /prompts/:id       - Get prompt by ID
POST   /prompts          - Create new prompt
PUT    /prompts/:id      - Update prompt
DELETE /prompts/:id      - Delete prompt
POST   /prompts/:id/like - Toggle like
GET    /prompts/categories - Get all categories
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Ensure Docker is running
docker-compose ps

# Restart database container
docker-compose restart mysql
```

**Frontend Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

**Backend TypeScript Errors**
```bash
# Rebuild the project
yarn build

# Check for missing dependencies
yarn install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Design Inspiration**: Modern glassmorphism trends
- **UI Components**: Tailwind CSS community
- **Icons**: Heroicons and custom SVG illustrations
- **Typography**: Inter font family for optimal readability

## 📬 Contact

**Project Maintainer**: Weibo Wang
- 📧 Email: your.email@example.com
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ using Next.js, NestJS, and modern web technologies

</div>