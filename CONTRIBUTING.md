# Contributing to Entropia

Thank you for your interest in contributing to Entropia! We welcome contributions, bug fixes, feature proposals, and documentation improvements.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Olamidepy/entropia.git
   cd entropia
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database Client**:
   ```bash
   npm run prisma:generate
   ```

5. **Start Local Development Server**:
   ```bash
   npm run dev
   ```

## Pull Request Guidelines

- Create a feature branch from `main`: `git checkout -b feature/your-feature-name`.
- Write clean, type-safe TypeScript.
- Ensure all tests pass prior to submitting: `npm run test`.
- Adhere to conventional commit formatting (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Submit your pull request with a descriptive title and detailed summary of changes.
