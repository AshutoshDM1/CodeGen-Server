# Contributing to CodeGen Server

Thank you for considering contributing to CodeGen Server! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, considerate, and collaborative.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:

- Check the existing issues to see if the problem has already been reported
- If you're unable to find an open issue addressing the problem, create a new one
- Include as many details as possible (steps to reproduce, expected behavior, etc.)

### Suggesting Enhancements

Enhancement suggestions are always welcome! When suggesting enhancements:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Explain why this enhancement would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Development Workflow

### Setting Up Development Environment

1. Install dependencies: `pnpm install`
2. Set up environment variables by copying `.env.example` to `.env` and setting appropriate values
3. Generate Prisma client: `pnpx prisma generate`
4. Run migrations: `pnpx prisma migrate dev`

### Code Style

- We use ESLint and Prettier for code formatting
- Run linting: `pnpm lint`
- Run formatting: `pnpm format`

### Branching Strategy

- `main` branch: production-ready code
- `develop` branch: integration branch for features
- Feature branches: named as `feature/your-feature-name`
- Bug fix branches: named as `fix/your-fix-name`

## Documentation

We encourage documentation improvements:

- API documentation is generated using OpenAPI spec
- Update the swagger.yaml file when adding or modifying API endpoints
- Include JSDoc comments for functions and classes

## Releasing

The release process is managed by the maintainers. If you think it's time for a new release, please create an issue.

## Questions?

If you have any questions, feel free to create an issue with the "question" label or contact the maintainers directly.

Thank you for contributing to CodeGen Server! ❤️
