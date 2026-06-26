// Proyectos
export type ProjectId = 'solar' | 'cantina' | 'nimbus'

export type ProjectStatus = 'active' | 'beta' | 'development' | 'paused'

export interface ProjectMeta {
  id: ProjectId
  name: string
  description: string
  status: ProjectStatus
  color: string
  url?: string
  githubUrl?: string
}

export interface Kpi {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
}

export interface Task {
  id: string
  title: string
  projectId: ProjectId | 'infra'
  status: 'pending' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
}

// Home Assistant
export interface HaEntity {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
  last_updated: string
}

export interface ServerStatus {
  online: boolean
  cpu: number
  memory: number
  diskFree: string
  haVersion?: string
  uptime?: string
}

// API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
}
