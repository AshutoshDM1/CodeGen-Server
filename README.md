# CodeGen Server

![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![node](https://img.shields.io/badge/node->=14.0.0-brightgreen)

CodeGen Server is a powerful AI-powered code generation API that provides endpoints for AI code template generation, refining prompts, chatting with AI assistants, and managing coding projects.

## 🚀 Live Deployments

- **Production API**: [https://codegen-aws.elitedev.tech](https://codegen-aws.elitedev.tech)
- **API Documentation**: [https://codegen-aws.elitedev.tech/api-docs](https://codegen-aws.elitedev.tech/api-docs)

## Frontend Live Project

- **Live Project**: [https://codegen.elitedev.tech](https://codegen.elitedev.tech)

## ✨ Features

- 🤖 **AI Code Generation**: Generate code templates based on prompts
- 💬 **AI Chat**: Interact with AI assistants for coding help
- 📝 **Project Management**: Create and organize coding projects
- 📊 **Message History**: Store and retrieve conversation history
- 🔍 **Code Storage**: Save and retrieve generated code snippets

## 📋 API Endpoints

The API provides the following main endpoint groups:

- `/api/v1/ai`: AI-related endpoints for code generation and chatting
- `/api/v1/message`: Message management endpoints
- `/api/v1/project`: Project management endpoints
- `/api/v1/code`: Code snippet management endpoints

For detailed API documentation, visit the [API docs](https://codegen-aws.elitedev.tech/api-docs).

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Prisma ORM
- **AI Integration**: Google Gemini AI
- **Documentation**: OpenAPI / Swagger

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or higher
- pnpm (or npm/yarn)
- Database (configured via Prisma)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AshutoshDM1/CodeGen-Server.git
   cd CodeGen-Server
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Generate Prisma client:

   ```bash
   pnpx prisma generate
   ```

5. Run database migrations:

   ```bash
   pnpx prisma migrate deploy
   ```

6. Build the application:

   ```bash
   pnpm build
   ```

7. Start the server:
   ```bash
   pnpm start
   ```

For development mode with hot-reloading:

```bash
pnpm dev
```

## 🔧 Configuration

Create a `.env` file with the following variables:

```dotenv
# Server
PORT=4000

# Database
DATABASE_URL="your-database-url"

# AI Configuration
GEMINI_API_KEY="your-gemini-api-key"

# CORS origins (comma-separated)
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

Please make sure to update tests as appropriate and follow the code style of the project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or support, please open an issue on this repository or contact the maintainers directly.

---

Made with ❤️ by the Ashutosh
