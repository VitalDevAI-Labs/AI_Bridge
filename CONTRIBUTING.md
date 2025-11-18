# Contributing to LLM Chat Links

Thank you for your interest in contributing to LLM Chat Links! This document provides guidelines and information for contributors.

## Development Setup

1. **Environment Setup**
   - Install Node.js (v16 or higher)
   - Install npm
   - Set up a Supabase account and project

2. **Local Development**
   ```bash
   npm install
   npm run dev
   ```

3. **Environment Variables**
   Create a `.env.local` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Project Architecture

### Frontend Architecture
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Main page components in `src/pages/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Types**: TypeScript types in `src/types/`
- **Config**: Constants and configurations in `src/config/`

### Data Flow
1. Data is stored in Supabase
2. TanStack Query manages data fetching and caching
3. React components consume the data through custom hooks

### Key Components
- `LlmLinksPage`: Main page component
- `LlmLinkCard`: Displays individual link information
- `NewLinkForm`: Form for adding new links
- `useLlmLinks`: Hook for data operations

## Testing

- Run tests: `npm test`
- Update snapshots: `npm test -- -u`
- Coverage report: `npm test -- --coverage`

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run linting and tests
6. Submit PR with description of changes

## Best Practices

1. **Component Design**
   - Keep components focused and single-responsibility
   - Use TypeScript interfaces for props
   - Implement error boundaries where needed

2. **State Management**
   - Use TanStack Query for server state
   - Use React state for UI state
   - Implement proper loading and error states

3. **Performance**
   - Implement proper memoization
   - Optimize re-renders
   - Use proper key props in lists

4. **Accessibility**
   - Follow WCAG guidelines
   - Use semantic HTML
   - Implement keyboard navigation

## Common Tasks

### Adding a New Feature
1. Create new component(s) if needed
2. Update types if needed
3. Add new hooks if needed
4. Update tests
5. Update documentation

### Modifying Database Schema
1. Update Supabase schema
2. Update TypeScript types
3. Update affected components
4. Update documentation

## Need Help?

- Check existing issues
- Create a new issue
- Reach out to maintainers
