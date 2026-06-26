# Dashboard — CLAUDE.md

Este es el proyecto **jp**, el dashboard personal de JP accesible en [jp.com.ar](https://jp.com.ar).

## Qué es este proyecto

Panel centralizado para gestionar todos los proyectos y el servidor casero de JP:

- **Solar & Equipos** — empresa de instalación de sistemas solares y venta de equipos
- **Cantina Gestión** — SaaS para bares y restaurantes (en beta)
- **Nimbus** — SaaS para gestión de barrios privados (en desarrollo, repo: `juanpablocap/nimbus`)
- **Home Server** — servidor casero con Home Assistant y file server

## Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Auth**: NextAuth.js v5 (Google + credenciales)
- **DB**: Vercel KV (Redis) para KPIs y tareas
- **Deploy**: Vercel (dominio jp.com.ar)
- **Home Assistant**: integración via REST API con long-lived access token

## Estructura del proyecto

```
jp/
├── app/
│   ├── (auth)/login/         # Página de login
│   ├── (dashboard)/          # Layout protegido con auth
│   │   ├── layout.tsx        # Sidebar + topbar
│   │   ├── page.tsx          # Vista general / home
│   │   ├── solar/            # Proyecto Solar
│   │   ├── cantina/          # Cantina Gestión
│   │   └── nimbus/           # Nimbus
│   ├── api/
│   │   ├── auth/             # NextAuth handlers
│   │   ├── projects/         # CRUD de KPIs y tareas
│   │   └── homeserver/       # Proxy a Home Assistant API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes base (Button, Card, Badge...)
│   ├── ProjectCard.tsx       # Tarjeta resumen de proyecto
│   ├── TaskList.tsx          # Lista de tareas cross-proyecto
│   ├── KpiGrid.tsx           # Grid de métricas
│   └── HomeServerWidget.tsx  # Widget estado servidor
├── lib/
│   ├── auth.ts               # Config NextAuth
│   ├── ha-client.ts          # Cliente Home Assistant
│   ├── kv.ts                 # Helpers Vercel KV
│   └── projects.ts           # Tipos y datos de proyectos
├── types/
│   └── index.ts              # Tipos globales
└── docs/                     # Documentación técnica
```

## Variables de entorno

Ver `.env.example`. Las críticas son:

```
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # https://jp.com.ar en prod, http://localhost:3000 en dev
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
HA_URL=                   # URL de Home Assistant (ej: http://192.168.1.x:8123)
HA_TOKEN=                 # Long-lived access token de Home Assistant
KV_REST_API_URL=          # Vercel KV
KV_REST_API_TOKEN=
```

## Comandos frecuentes

```bash
npm run dev          # Servidor de desarrollo en localhost:3000
npm run build        # Build de producción
npm run lint         # ESLint
npm run type-check   # TypeScript sin emitir
```

## Convenciones

- Componentes: PascalCase, un componente por archivo
- Rutas API: kebab-case en la URL, camelCase en las funciones
- Los datos de cada proyecto viven en Vercel KV bajo la key `project:{id}:{tipo}`
- La integración con Home Assistant siempre va por el proxy `/api/homeserver` (nunca exponer el token al cliente)
- Auth: solo el email `juanpablocapilla@gmail.com` tiene acceso (ver `lib/auth.ts`)

## Proyectos relacionados

- **Nimbus**: `github.com/juanpablocap/nimbus` — SaaS barrios privados. El dashboard puede mostrar su estado via API.
- **Cantina Gestión**: repo separado (agregar URL cuando esté disponible)

## Notas de arquitectura

Ver `docs/architecture.md` para el diagrama completo y decisiones técnicas.
Ver `docs/deployment.md` para pasos de deploy en Vercel.
Ver `docs/home-assistant.md` para configurar la integración con el servidor casero.
