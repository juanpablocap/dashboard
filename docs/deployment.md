# Deploy en Vercel — Dashboard

## Primer deploy

### 1. Crear repo en GitHub

```bash
git init
git add .
git commit -m "feat: initial jp setup"
git remote add origin https://github.com/juanpablocap/dashboard.git
git push -u origin main
```

### 2. Crear proyecto en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar el repo `juanpablocap/dashboard`
3. Framework preset: **Next.js** (detectado automático)
4. No modificar nada más, click en **Deploy**

### 3. Configurar variables de entorno en Vercel

En Vercel → Settings → Environment Variables, agregar:

```
NEXTAUTH_SECRET        → resultado de: openssl rand -base64 32
NEXTAUTH_URL           → https://jp.com.ar
GOOGLE_CLIENT_ID       → desde Google Cloud Console
GOOGLE_CLIENT_SECRET   → desde Google Cloud Console
HA_URL                 → URL pública de Home Assistant (ver docs/home-assistant.md)
HA_TOKEN               → long-lived token de HA
KV_REST_API_URL        → desde Vercel KV (se genera automático)
KV_REST_API_TOKEN      → desde Vercel KV
```

### 4. Crear Vercel KV

1. En Vercel → Storage → Create Database → KV
2. Nombrarla `jp-kv`
3. Conectarla al proyecto — las env vars `KV_*` se agregan automáticamente

### 5. Configurar dominio jp.com.ar

1. En Vercel → Settings → Domains → Add Domain → `jp.com.ar`
2. En tu registrador de dominio (ej: NIC.ar), apuntar DNS:
   - Tipo A: `@` → `76.76.21.21` (Vercel)
   - Tipo CNAME: `www` → `cname.vercel-dns.com`
3. Vercel genera SSL automáticamente (esperar ~2 minutos)

### 6. Configurar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto o usar uno existente
3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
4. Tipo: Web application
5. Authorized redirect URIs:
   - `https://jp.com.ar/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (para dev)
6. Copiar Client ID y Client Secret a las env vars de Vercel

## Deploy continuo

Cada push a `main` dispara un deploy automático en Vercel.

Los PRs crean preview deployments en URLs como `jp-git-feat-algo.vercel.app`.

## Rollback

```bash
# Ver historial de deployments
vercel ls

# Hacer rollback a un deployment anterior
vercel rollback [deployment-url]
```

## Monitoreo

- **Vercel Analytics**: habilitado por defecto, ver en el dashboard de Vercel
- **Vercel Logs**: Vercel → proyecto → Logs (tiempo real)
- **Uptime**: configurar un monitor en Better Uptime o UptimeRobot apuntando a `jp.com.ar`

## Variables de entorno locales

Crear `.env.local` (no commitear, está en `.gitignore`):

```bash
cp .env.example .env.local
```

Para dev local con Vercel KV, usar [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
vercel login
vercel link           # linkear proyecto local con Vercel
vercel env pull       # descargar env vars a .env.local
```
