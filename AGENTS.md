# AGENTS.md

## Project Overview

Full-stack TypeScript application with separate client and server packages (no shared monorepo tooling) for task Management MVP featuring AI-driven task optimization.

- **Client**: React 19 + Vite 7 + TypeScript 5.8 on `http://localhost:5173`
- **Server**: Express 5 + TypeScript + ts-node + nodemon on `http://localhost:3000`
- **Proxy**: Vite proxies `/api/*` to `http://localhost:3000`
- **Config**: OpenCode configuration in `.opencode/opencode.jsonc`

## Workflow Rules

### 1. Plan Before Build
Every feature must be planned and reviewed before implementation. Discuss the approach with the user first. Do not write code until the plan is approved.

### 2. Consult on Ambiguity
When requirements are unclear or multiple valid approaches exist, ask the user for clarification. Do not guess or assume.

### 3. Testing Discipline
- Use **Vitest** for all tests
- Write quality tests that verify real behavior, not implementation details
- **Forbidden**: Creating absurd mocks just to pass tests
- **Forbidden**: Continuing work with failing tests
- All tests must pass before considering a feature complete

## Test-Driven Development (TDD)

When implementing new features or refactoring code, strictly follow the **TDD (Test-Driven Development)** methodology:

1. **Red:** Write the unit or integration test for the required feature first, before writing any implementation code. Ensure the test fails.
2. **Green:** Write the minimum amount of code necessary to make the test pass successfully.
3. **Refactor:** Clean up and optimize both the implementation and test code while keeping all tests passing.

### Agent Guidelines
* **Test-First Approach:** Never add business logic without first writing the tests that validate it.
* **Suite Integrity:** Ensure all existing tests continue to pass after making changes.
* **Living Documentation:** Treat tests as the official technical specification for expected system behavior.

## Conventions

### TypeScript
- Strict mode enabled
- Explicit types for function parameters and return values
- Avoid `any` unless absolutely necessary (with justification)

### Project Structure
- Client code: `client/src/`
- Server code: `server/src/`
- Keep related files close together (colocate components with their logic)

### Code Style
- Functional React components with hooks
- Express routes organized by feature
- Descriptive variable and function names
- Comments for complex logic, not obvious code

### Dependencies
- Client and server have separate `package.json` files
- If you install dependencies, do it in the correct package (client or server)
