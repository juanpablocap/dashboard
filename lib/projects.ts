import type { ProjectMeta } from '@/types'

export const PROJECTS: ProjectMeta[] = [
  {
    id: 'solar',
    name: 'Solar & Equipos',
    description: 'Instalación de sistemas solares y venta de equipos',
    status: 'active',
    color: '#f59e0b',
  },
  {
    id: 'cantina',
    name: 'Cantina Gestión',
    description: 'SaaS para bares y restaurantes',
    status: 'beta',
    color: '#ef4444',
    githubUrl: 'https://github.com/juanpablocap/cantina',
  },
  {
    id: 'nimbus',
    name: 'Nimbus',
    description: 'Gestión de barrios privados',
    status: 'development',
    color: '#3b82f6',
    githubUrl: 'https://github.com/juanpablocap/nimbus',
  },
]

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  beta: 'Beta',
  development: 'Desarrollo',
  paused: 'Pausado',
}

export function getProject(id: string): ProjectMeta | undefined {
  return PROJECTS.find((p) => p.id === id)
}
