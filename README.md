<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

# Portfolio

Personal portfolio website built with **React** (Vite), **Three.js**, and **NestJS**. Features a terminal-themed hero with a 3D WebGL scene, scroll-based sections, and a blog.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Three.js |
| Backend | NestJS 11 (static file serving + API) |
| State | Zustand |
| Routing | React Router v7 |
| 3D | React Three Fiber, Drei |
| Build | Vite 8 |

## Getting Started

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Start both (Vite dev server + NestJS)
npm run start:dev
```

The Vite dev server runs on `http://localhost:5173`. The NestJS backend runs on `http://localhost:3000` with API proxied through Vite.

## Build for Production

```bash
# Builds client into server/dist/public
npm run build
```

## Project Structure

```
portfolio/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components (Hero, TerminalWindow, Navbar, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route pages (Home, Blog, ProjectDetail)
│   │   ├── stores/         # Zustand state stores
│   │   └── layouts/        # Layout components
│   └── public/             # Static assets
├── server/                 # NestJS backend
│   └── src/
│       ├── app.module.ts   # Root module (serves static files)
│       ├── app.controller.ts
│       └── app.service.ts
└── package.json            # Root workspace scripts
```
