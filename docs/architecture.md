# Arquitectura — Dashboard

## Diagrama general

```
                        ┌─────────────────────────────┐
                        │         jp.com.ar            │
                        │       (Vercel / Next.js)      │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
     ┌────────▼──────┐      ┌──────────▼──────┐      ┌─────────▼──────┐
     │  NextAuth.js  │      │   Vercel KV      │      │  Home Assistant │
     │  Google OAuth │      │  (proyectos,     │      │  REST API       │
     │               │      │   tareas, KPIs)  │      │  (servidor casa)│
     └───────────────┘      └─────────────────┘      └────────────────┘
```

## Flujo de autenticación

1. Usuario accede a `jp.com.ar`
2. NextAuth redirige a Google OAuth si no hay sesión
3. Solo el email `juanpablocapilla@gmail.com` tiene acceso (whitelist en `lib/auth.ts`)
4. Sesión guardada como JWT en cookie httpOnly

## Estructura de rutas

```
/                          → redirect a /dashboard
/login                     → página de login
/dashboard                 → vista general con todos los proyectos
/dashboard/solar           → proyecto Solar & Equipos
/dashboard/cantina         → Cantina Gestión (SaaS)
/dashboard/nimbus          → Nimbus (SaaS)
```

## Modelo de datos (Vercel KV)

Cada proyecto tiene sus datos guardados bajo estas keys Redis:

```
project:solar:meta         → { name, description, status, color }
project:solar:kpis         → { activeProjects, pipeline, quotes, satisfaction }
project:solar:tasks        → [ { id, title, status, priority, dueDate } ]

project:cantina:meta       → { name, description, status, color }
project:cantina:kpis       → { clients, uptime, mrr, errors }
project:cantina:tasks      → [ ... ]

project:nimbus:meta        → { name, description, status, color }
project:nimbus:kpis        → { pilotClients, modules, launchDate }
project:nimbus:tasks       → [ ... ]
```

## Integración Home Assistant

El servidor casero expone la HA REST API en la red local. Desde internet se accede via:

- **Opción A (recomendada)**: Cloudflare Tunnel — no expone puerto en router, SSL automático
- **Opción B**: Port forwarding en router + DuckDNS + SSL Let's Encrypt

El dashboard llama a `/api/homeserver` (Next.js API route) que actúa como proxy autenticado. El `HA_TOKEN` nunca llega al navegador.

Endpoints usados:
- `GET /api/states` → estado de entidades (sensores, switches)
- `GET /api/` → info del servidor HA

## Integración con Nimbus y Cantina

Los SaaS pueden exponer un endpoint de health/status. El dashboard los consulta:

```
GET https://nimbus.com.ar/api/status   → { uptime, activeUsers, version, errors }
GET https://cantina.com.ar/api/status  → { uptime, clients, version, errors }
```

Mientras no existan, los datos se cargan manualmente via Vercel KV.

## Decisiones técnicas

| Decisión | Elegido | Alternativa descartada | Motivo |
|---|---|---|---|
| Framework | Next.js 14 App Router | Remix, Astro | Ecosystem, Vercel native |
| Auth | NextAuth.js v5 | Clerk, Auth0 | Open source, sin costo |
| DB | Vercel KV | Supabase, PlanetScale | Free tier, integración nativa Vercel |
| Deploy | Vercel | Render, Railway | DX, preview deployments, analytics |
| Estilos | Tailwind CSS | CSS Modules, styled-components | Velocidad de desarrollo |

## Seguridad

- Auth requerida en todas las rutas bajo `(dashboard)/`
- Middleware en `middleware.ts` bloquea rutas no autenticadas
- Home Assistant token solo en server-side (env variable)
- Headers de seguridad configurados en `next.config.ts`
- Rate limiting en rutas API (todo implementar con Vercel Edge)
