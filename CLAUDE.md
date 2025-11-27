# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PixiJS games repository showcasing mini games built with PixiJS and @pixi/react, written in TypeScript. The project uses React 19, Vite, TanStack Router, and TailwindCSS.

## Development Commands

- `npm run dev` - Start development server on port 7232
- `npm run build` - Build for production
- `npm run preview` - Preview production build on port 7232
- `npm run start` - Build and preview (equivalent to build + preview)
- `npm run ladle` - Start Ladle component development environment (opens in Arc browser)

## Architecture

### Core Technologies
- **PixiJS 8.2.6** with **@pixi/react 8.0.3** for 2D graphics and game development
- **React 19** with TypeScript for UI components
- **TanStack Router** for file-based routing with code generation
- **React Query 3.39.3** for data fetching and caching
- **Zustand** for state management
- **Vite** as build tool with PWA support

### Project Structure
- `src/components/` - Reusable React components, including PixiJS game components
- `src/pages/` - Page-level components (Home page renders TestPixijs component)
- `src/routes/` - TanStack Router route definitions with auto-generated route tree
- `src/queries/` - React Query hooks and utilities
- `src/zustand/` - Zustand store definitions
- `.ladle/` - Ladle (Storybook alternative) configuration for component development

### PixiJS Integration
The project uses @pixi/react for declarative PixiJS components. Components extend PixiJS primitives using `extend()` and render using JSX-like syntax (e.g., `<pixiContainer>`, `<pixiGraphics>`).

### Routing
Uses TanStack Router with file-based routing. Routes are defined in `src/routes/` and the route tree is auto-generated in `routeTree.gen.ts`. The root route includes TanStack Router DevTools.

### PWA Configuration
The app is configured as a Progressive Web App with Vite PWA plugin, including service worker registration and caching strategies.

### Development Tools
- **Ladle** for component development (alternative to Storybook)
- **TanStack Router DevTools** for routing debugging
- **Prettier** with TailwindCSS plugin for code formatting

## Adding a New Game

To add a new game to the repository, follow these steps:

### 1. Create Game Component
Create a new game directory in `src/games/[GameName]/`:
```
src/games/[GameName]/
├── index.tsx          # Main game component
├── index.stories.tsx  # Ladle story for component development
└── [other-files].ts   # Game-specific utilities (e.g., calculations, helpers)
```

**Game Component Structure:**
- Import required components: `Button`, `GameHeader`, game-specific zustand store, `useWorldStore`
- Use `HtmlBackground.In` for background styling
- Include `GameHeader` with game title and control buttons
- Handle game states: `idle`, `playing`, `paused`, `gameOver`
- Implement level transitions with `showLevelTransition` state
- Reset world state when game status changes

### 2. Create Zustand Store
Create a zustand store in `src/zustand/[game-name].ts`:
- Define game-specific state interface
- Include common game states: `status`, `level`, `score`, etc.
- Add game-specific state (e.g., `lives`, `targetsHit`, `penguinsThrown`)
- Implement `resetGame()` function to reset to default values
- Use functional updates for state that can be incremented

### 3. Create Route
Create a lazy route in `src/routes/games/[game-name].lazy.tsx`:
- Import the game component and required hooks
- Set the active game in world store using `useWorldStore`
- Use `createLazyFileRoute` with the game path
- Export the route with the component

**Important**: The route must set the active game in the world store:
```tsx
import { createLazyFileRoute } from '@tanstack/react-router';
import TowerDefence from '../../games/TowerDefence';
import { useWorldStore } from '@utils/world';
import { useEffect } from 'react';

const Index = () => {
    const { setActiveGame } = useWorldStore();

    useEffect(() => {
        setActiveGame('game-name'); // Add to world store Game type
    }, []);

    return <TowerDefence />;
};

export const Route = createLazyFileRoute('/games/game-name')({
    component: Index
});
```

### 4. Add Navigation Link
Update `src/pages/Home/index.tsx`:
- Add a new `Button` with `Link` component pointing to the game route
- Follow the existing pattern for consistent styling

### 5. Optional: Create Ladle Story
Include an `index.stories.tsx` file for component development:
- Export default story configuration with title `Games / [GameName]`
- Export `Default` story that renders the game component

### 6. Update World Store Game Type
Add the new game to the `Game` type in `src/utils/world.ts`:
```tsx
export type Game = 'healthy-eater' | 'penguin-thrower' | 'arcade-shooter' | 'tower-defence';
```

### Example Implementation
See `src/games/TowerDefence/` and `src/games/TowerDefence/store.ts` for a complete example following this pattern, including proper route setup with active game management.