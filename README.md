# Dashboard

Dashboard personal accesible en [jp.com.ar](https://jp.com.ar).

Centraliza el estado de todos mis proyectos y el servidor casero en un solo lugar.

## Proyectos

| Proyecto | Tipo | Estado |
|---|---|---|
| Solar & Equipos | Empresa | Activo |
| Cantina Gestión | SaaS | Beta |
| Nimbus | SaaS | Desarrollo |
| Home Server | Infraestructura | Activo |

## Stack

Next.js 14 · TypeScript · Tailwind CSS · NextAuth.js · Vercel KV

## Setup local

```bash
# Clonar
git clone https://github.com/juanpablocap/dashboard.git
cd jp

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# → Completar valores en .env.local

# Correr en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Deploy

El proyecto se deploya automáticamente en Vercel al hacer push a `main`.

Ver [docs/deployment.md](docs/deployment.md) para configuración inicial.

## Documentación

- [Arquitectura](docs/architecture.md)
- [Deploy en Vercel](docs/deployment.md)
- [Integración Home Assistant](docs/home-assistant.md)
- [Guía para Claude Code](CLAUDE.md)
