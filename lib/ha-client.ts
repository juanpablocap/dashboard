import type { HaEntity, ServerStatus } from '@/types'

const HA_URL = process.env.HA_URL
const HA_TOKEN = process.env.HA_TOKEN

if (!HA_URL || !HA_TOKEN) {
  console.warn('[ha-client] HA_URL o HA_TOKEN no configurados')
}

async function haFetch<T>(path: string): Promise<T> {
  if (!HA_URL || !HA_TOKEN) {
    throw new Error('Home Assistant no configurado')
  }

  const res = await fetch(`${HA_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 30 }, // cache 30s
  })

  if (!res.ok) {
    throw new Error(`HA API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getHaState(entityId: string): Promise<HaEntity> {
  return haFetch<HaEntity>(`/api/states/${entityId}`)
}

export async function getAllStates(): Promise<HaEntity[]> {
  return haFetch<HaEntity[]>('/api/states')
}

export async function getServerStatus(): Promise<ServerStatus> {
  try {
    const [cpu, memory, disk] = await Promise.all([
      getHaState('sensor.server_cpu_percent').catch(() => null),
      getHaState('sensor.server_memory_percent').catch(() => null),
      getHaState('sensor.server_disk_free').catch(() => null),
    ])

    return {
      online: true,
      cpu: cpu ? parseFloat(cpu.state) : 0,
      memory: memory ? parseFloat(memory.state) : 0,
      diskFree: disk ? `${disk.state} ${disk.attributes.unit_of_measurement ?? 'GB'}` : 'N/A',
    }
  } catch {
    return {
      online: false,
      cpu: 0,
      memory: 0,
      diskFree: 'N/A',
    }
  }
}
