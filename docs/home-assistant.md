# Integración Home Assistant — Dashboard

## Cómo funciona

El dashboard consulta a Home Assistant (corriendo en tu servidor casero) para mostrar el estado del servidor, sensores, y métricas de infraestructura.

La comunicación siempre pasa por la API route `/api/homeserver` en el servidor Next.js. El token de HA **nunca** llega al navegador del cliente.

```
Browser → /api/homeserver (Next.js, server-side) → HA REST API (servidor casa)
```

## Exponer Home Assistant a internet

Para que Vercel pueda consultar tu HA local necesitás exponerlo. Opciones:

### Opción A: Cloudflare Tunnel (recomendada)

No requiere abrir puertos en el router. Gratis.

```bash
# En el servidor casero
# 1. Instalar cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

# 2. Autenticar con tu cuenta Cloudflare
cloudflared tunnel login

# 3. Crear el tunnel
cloudflared tunnel create jp-homeserver

# 4. Configurar
cat > ~/.cloudflared/config.yml << EOF
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: ha.jp.com.ar
    service: http://localhost:8123
  - service: http_status:404
EOF

# 5. Agregar DNS en Cloudflare
cloudflared tunnel route dns jp-homeserver ha.jp.com.ar

# 6. Correr (o configurar como servicio systemd)
cloudflared tunnel run jp-homeserver
```

Resultado: Home Assistant accesible en `https://ha.jp.com.ar`

### Opción B: Port forwarding + DuckDNS

1. En el router, redirigir puerto 8123 a la IP del servidor
2. Crear cuenta en [DuckDNS](https://www.duckdns.org/) → dominio: `jp-ha.duckdns.org`
3. Instalar el addon DuckDNS en HA para actualización automática de IP
4. Configurar SSL con Let's Encrypt (addon de HA)

### Opción C: Tailscale (solo para acceso personal)

Si el dashboard solo lo usás vos y Vercel también puede correr en Tailscale (requiere configuración extra). Más simple para acceso personal pero más complejo para Vercel.

## Crear el token en Home Assistant

1. En HA, ir a tu perfil (clic en tu nombre abajo a la izquierda)
2. Bajar hasta **Long-Lived Access Tokens**
3. Crear token → nombrar "jp-dashboard"
4. Copiar el token (solo se muestra una vez)
5. Guardarlo en Vercel como `HA_TOKEN`

## Variables de entorno necesarias

```
HA_URL=https://ha.jp.com.ar    # URL pública del servidor HA
HA_TOKEN=eyJ...                 # Long-lived access token
```

## Endpoints utilizados

El cliente en `lib/ha-client.ts` usa estos endpoints de la HA REST API:

```
GET  /api/                          → Info del servidor (versión, location)
GET  /api/states                    → Todos los estados de entidades
GET  /api/states/<entity_id>        → Estado de una entidad específica
POST /api/services/<domain>/<service> → Llamar un servicio (ej: encender luz)
```

## Entidades sugeridas para mostrar en el dashboard

Configurar en HA y luego referenciar por `entity_id`:

| Métrica | Entity ID sugerido | Tipo |
|---|---|---|
| CPU del servidor | `sensor.server_cpu_percent` | sensor |
| RAM usada | `sensor.server_memory_percent` | sensor |
| Storage libre | `sensor.server_disk_free` | sensor |
| Temperatura CPU | `sensor.server_cpu_temp` | sensor |
| Estado HA | `binary_sensor.ha_running` | binary_sensor |
| Uptime del servidor | `sensor.server_uptime` | sensor |

Instalar el integration **System Monitor** en HA para obtener métricas del servidor automáticamente:
Settings → Devices & Services → Add Integration → System Monitor

## Solución de problemas

**El dashboard no puede conectar a HA:**
- Verificar que `HA_URL` y `HA_TOKEN` estén bien configurados en Vercel
- Probar la URL directamente: `curl -H "Authorization: Bearer TU_TOKEN" https://ha.jp.com.ar/api/`
- Si usás Cloudflare Tunnel, verificar que el tunnel esté corriendo

**Error 401 Unauthorized:**
- El token expiró o fue revocado → crear uno nuevo en HA

**Error CORS:**
- No debería pasar porque las llamadas son server-side, pero si aparece, verificar que la API route esté bien configurada y no haya llamadas directas desde el cliente
