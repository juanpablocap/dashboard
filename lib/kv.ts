import { kv } from '@vercel/kv'
import type { Task, Kpi, ProjectId } from '@/types'

// KPIs
export async function getKpis(projectId: ProjectId): Promise<Kpi[]> {
  const data = await kv.get<Kpi[]>(`project:${projectId}:kpis`)
  return data ?? []
}

export async function setKpis(projectId: ProjectId, kpis: Kpi[]): Promise<void> {
  await kv.set(`project:${projectId}:kpis`, kpis)
}

// Tareas
export async function getTasks(projectId?: ProjectId | 'infra'): Promise<Task[]> {
  if (projectId) {
    const data = await kv.get<Task[]>(`project:${projectId}:tasks`)
    return data ?? []
  }

  // Todas las tareas de todos los proyectos
  const keys = ['solar', 'cantina', 'nimbus', 'infra'] as const
  const results = await Promise.all(
    keys.map((k) => kv.get<Task[]>(`project:${k}:tasks`).then((d) => d ?? []))
  )
  return results.flat()
}

export async function setTasks(projectId: ProjectId | 'infra', tasks: Task[]): Promise<void> {
  await kv.set(`project:${projectId}:tasks`, tasks)
}

export async function addTask(task: Task): Promise<void> {
  const tasks = await getTasks(task.projectId)
  await setTasks(task.projectId, [...tasks, task])
}

export async function updateTask(taskId: string, projectId: ProjectId | 'infra', updates: Partial<Task>): Promise<void> {
  const tasks = await getTasks(projectId)
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
  await setTasks(projectId, updated)
}
