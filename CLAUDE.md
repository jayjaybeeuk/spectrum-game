# CLAUDE.md - AI Assistant Guide for Spectrum Game

This document provides guidance for AI assistants working with the Spectrum Game codebase.

## Project Overview

Spectrum Game is a web-based collection of ZX Spectrum games written in ZX Basic, compiled to TAP format, and playable in the browser via the JSSpeccy JavaScript emulator. It combines retro computing (ZX Spectrum era) with a modern React + TypeScript frontend.

**Author**: James Bolton
**License**: MIT
**Repository**: github.com/jayjaybeeuk/spectrum-game

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** as build tool (with @vitejs/plugin-react-swc)
- **Chakra UI** for component library
- **Framer Motion** for animations

### Game Compilation
- **ZX Basic** (Boriel's zxbasic) - Python-based compiler for BASIC to machine code
- **JSSpeccy** - JavaScript ZX Spectrum emulator (WASM-based)

## Project Structure

```
spectrum-game/
├── src/                    # React TypeScript frontend
│   ├── components/         # Reusable UI components
│   │   ├── dropdown/       # Game selector dropdown
│   │   └── download-link/  # TAP file download button
│   ├── hooks/              # Custom React hooks
│   │   └── useLoadJSSpeccy.ts  # Emulator loading hook
│   ├── pages/              # Page components
│   │   └── home/           # Main game selection page
│   ├── App.tsx             # Root component with ChakraProvider
│   └── main.tsx            # Entry point
├── games/                  # ZX Basic source files (.bas)
├── public/
│   ├── games/              # Compiled TAP files (output)
│   └── jsspeccy/           # JSSpeccy emulator files
├── scripts/                # Build scripts
│   ├── build.sh            # Mac/Linux game compiler
│   └── build.bat           # Windows game compiler
├── libs/zxbasic/           # ZX Basic compiler
└── game-notes/             # Game development documentation
```

## Development Commands

```bash
# Install dependencies
yarn

# Development (compiles games + starts Vite dev server)
yarn dev

# Build all games only (Mac/Linux)
yarn build:games

# Build specific game (Mac/Linux)
yarn build:games:platformer   # Builds 5-basic-platform-logic.bas

# Build games (Windows)
yarn build:games:win

# Full production build (games + site)
yarn build

# Lint TypeScript/React code
yarn lint

# Preview production build
yarn preview
```

## Code Conventions

### TypeScript/React Patterns

1. **Component Structure**: Components use functional patterns with hooks
   - Named exports preferred: `export { ComponentName };`
   - Each component has its own directory with `index.tsx` re-export

2. **Component Directory Pattern**:
   ```
   components/
   └── component-name/           # kebab-case directory
       ├── component-name.tsx    # kebab-case file, PascalCase export
       └── index.tsx             # Re-exports component
   ```

3. **Index Files**: Used for barrel exports
   - `src/components/index.tsx` exports all components
   - `src/pages/index.tsx` exports all pages

4. **Custom Hooks**: Prefixed with `use`, stored in `src/hooks/`

5. **Type Definitions**: Interfaces for props defined in same file as component

### Formatting Rules (Prettier)

- Double quotes for strings (`"string"`)
- No trailing commas
- Auto line endings

### ESLint Configuration

- Strict TypeScript with type checking
- React Hooks rules enabled
- `JSSpeccy` is a global (declared in .eslintrc)
- Non-null assertions allowed (`@typescript-eslint/no-non-null-assertion: off`)

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled
- No unused locals/parameters
- JSX: react-jsx

## Working with Games

### Adding a New Game

1. Create a `.bas` file in `/games/` directory
2. Run `yarn build:games` to compile to TAP format
3. Add game option to the dropdown in `src/pages/home/home.tsx`:
   ```tsx
   <option value="newgame.tap">Game Name</option>
   ```

### Game Compilation Process

The build script (`scripts/build.sh`) runs:
```bash
./libs/zxbasic/zxbc.py "$file" -o "./public/games/$(basename "$file" .bas).tap" --tap --BASIC --autorun
```

Flags:
- `--tap`: Output TAP format
- `--BASIC`: Include BASIC loader
- `--autorun`: Auto-start when loaded

### Current Games

| File | Description |
|------|-------------|
| helloworld.bas | Simple hello world |
| breakout.bas | Breakout/Brick Breaker game |
| snake.bas | Snake game |
| 5-basic-platform-logic.bas | Platformer game logic |
| 1-4-*.bas | Test/example programs |

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/hooks/useLoadJSSpeccy.ts` | Dynamically loads emulator, handles game switching |
| `src/pages/home/home.tsx` | Main UI with game selector and emulator display |
| `scripts/build.sh` | Compiles .bas files to .tap files |
| `public/jsspeccy/jsspeccy.js` | JSSpeccy emulator entry point |

## Important Notes

1. **No Test Framework**: Currently no automated tests configured
2. **Python Required**: ZX Basic compiler requires Python to run
3. **JSSpeccy Global**: The `JSSpeccy` function is loaded via script tag and available globally
4. **Emulator Settings**: Configured with 2x zoom, autoStart, and autoLoadTapes enabled
5. **Clarity Analytics**: Enabled in production (index.html contains Clarity tag)

## Common Tasks

### Modifying the Emulator Display
Edit `src/hooks/useLoadJSSpeccy.ts` - the JSSpeccy options object controls zoom, sandbox mode, auto-start behavior

### Adding UI Components
1. Create directory in `src/components/` (kebab-case)
2. Create component file and index.tsx
3. Export from `src/components/index.tsx`

### Debugging Game Compilation
Run single game compilation with verbose output:
```bash
./scripts/build.sh game-name  # Without .bas extension
```

## External Resources

- [Boriel's ZX Basic](https://github.com/boriel/zxbasic) - Compiler documentation
- [JSSpeccy](https://github.com/gasman/jsspeccy3) - Emulator documentation
- [Chakra UI](https://chakra-ui.com/docs) - Component library docs
