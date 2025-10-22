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