# agent.md - AI Assistant Guide for Spectrum Game

This document mirrors the intent of `CLAUDE.md`, but adds repo-specific observations from the current codebase so an agent can work from what is actually here.

## Project Overview

Spectrum Game is a small React + TypeScript site that loads compiled ZX Spectrum TAP files into the JSSpeccy browser emulator. Source games live in `/games` as ZX Basic `.bas` files and are compiled into `/public/games`.

The repo is effectively split into two parts:

1. A modern frontend that selects and embeds games.
2. A vendored ZX Basic toolchain used to compile BASIC into TAP files.

## Current Stack

### Frontend
- React 18
- TypeScript 5
- Vite 6 with `@vitejs/plugin-react-swc`
- Chakra UI 2
- Framer Motion 10

### Game Tooling
- Boriel ZX Basic compiler in `libs/zxbasic/`
- JSSpeccy browser emulator in `public/jsspeccy/`

## How The App Works

- [`src/main.tsx`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/src/main.tsx) mounts the React app.
- [`src/App.tsx`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/src/App.tsx) wraps the app in `ChakraProvider`.
- [`src/pages/home/home.tsx`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/src/pages/home/home.tsx) is the main UI. It owns the selected TAP file and renders the dropdown, emulator mount point, and download link.
- [`src/hooks/useLoadJSSpeccy.ts`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/src/hooks/useLoadJSSpeccy.ts) injects `/jsspeccy/jsspeccy.js`, creates the emulator, and calls `openUrl()` when the selected game changes.

There is no router and no multi-page app structure in practice. The user lands on one page, chooses a game, and the emulator swaps tapes.

## Important Paths

```text
games/                 ZX Basic source files
public/games/          Compiled TAP outputs
src/pages/home/        Main site UI
src/hooks/             Emulator loading logic
src/components/        Chakra-based UI pieces
scripts/build.sh       Mac/Linux build entrypoint for TAP generation
scripts/build.bat      Windows build entrypoint
libs/zxbasic/          Vendored compiler
```

## Commands

```bash
# Install dependencies
yarn

# Compile every BASIC game, then start Vite
yarn dev

# Compile all games
yarn build:games

# Compile one specific game
./scripts/build.sh northampton-adventure

# Build the web app only
yarn build:site

# Build games and the web app
yarn build

# Lint the frontend
yarn lint
```

## Current UI Observations

- The dropdown in [`src/pages/home/home.tsx`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/src/pages/home/home.tsx) is the source of truth for which games are visible in the browser.
- `northampton-adventure.tap` is already exposed there.
- The selected game defaults to `helloworld.tap`.
- `DownloadLink` is a very small Chakra `Button` rendered as an anchor.
- `useLoadJSSpeccy` currently logs to the console and appends the emulator script dynamically.

## ZX Basic Observations

- The BASIC files in `/games` are plain source files that the build script compiles one-by-one into TAP.
- [`games/northampton-adventure.bas`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/games/northampton-adventure.bas) is a line-numbered text adventure, not a parser framework. State is stored in globals and navigation is handled through room IDs plus `n/s/e/w` exit variables.
- The file uses `#include <input.bas>` and `INPUT(...)` for command entry.
- Room rendering is done by a dispatcher subroutine around line `1000`, with one block per room and a shared exit-printing subroutine around line `2000`.
- Inventory/state is represented with small `UBYTE` flags such as `hasHotdog`.

When extending text adventures in this repo:

- Keep room text short and manually wrapped for the Spectrum text display.
- Add new room IDs in the room dispatcher and update directional exits carefully.
- Prefer simple state flags over introducing complicated parser logic.
- Rebuild the TAP after editing the `.bas` file so `public/games/*.tap` stays in sync.

## Coding Conventions Seen In This Repo

### React / TypeScript
- Functional components only.
- Small files and simple props interfaces.
- Components under `src/components/` use named exports.
- Pages and the root app still use default exports.
- Formatting is double-quote based and avoids trailing commas.

### ZX Basic
- Keep the existing line-numbered, label-style structure.
- Use `REM` blocks to separate sections.
- Follow the established procedural pattern instead of refactoring into a radically different style.

## Workflow Guidance

### If you change a BASIC game

1. Edit the relevant file in `/games`.
2. Compile the affected game with `./scripts/build.sh <name>`.
3. If the game should be playable from the site, confirm it exists in the dropdown in [`src/pages/home/home.tsx`](/Users/jamesbolton/Documents/GIT/Personal/spectrum-game/src/pages/home/home.tsx).

### If you add a brand new game

1. Create `games/<name>.bas`.
2. Build it to produce `public/games/<name>.tap`.
3. Add it to the dropdown UI.

## Known Constraints

- Python is required for the ZX Basic compiler.
- There is no automated test suite for the BASIC games; compilation is the main safety check.
- The emulator is loaded as a global script rather than an npm package import.
- The README and helper docs are useful, but the source files are the more reliable description of current behavior.
