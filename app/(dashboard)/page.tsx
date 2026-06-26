import { PROJECTS, PROJECT_STATUS_LABELS } from '@/lib/projects'
import { getTasks } from '@/lib/kv'
import type { Task } from '@/types'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  beta: 'bg-yellow-100 text-yellow-700',
  development: 'bg-blue-100 text-blue-700',
  paused: 'bg-gray-100 text-gray-600',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
  low: 'bg-blue-400',
}

export default async function DashboardPage() {
  let tasks: Task[] = []
  try {
    tasks = await getTasks()
  } catch {
    // KV no configurado en dev — continuar con lista vacía
  }

  const pendingTasks = tasks.filter((t) => t.status !== 'done').slice(0, 6)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">General</h1>
        <p className="text-sm text-gray-500 mt-0.5">Vista de todos los proyectos</p>
      </div>

      {/* Proyectos */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Proyectos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/${project.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors block"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name[0]}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[project.status]}`}>
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{project.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tareas pendientes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Tareas pendientes</h2>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-gray-400">Sin tareas pendientes</p>
          ) : (
            <ul className="space-y-2">
              {pendingTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`} />
                  <span className="text-sm text-gray-700 flex-1">{task.title}</span>
                  <span className="text-xs text-gray-400">{task.projectId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Servidor casero</h2>
          <ServerStatusWidget />
        </div>
      </section>
    </div>
  )
}

async function ServerStatusWidget() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/homeserver`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) throw new Error()
    const { data } = await res.json()

    return (
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Estado', value: data.online ? 'Online' : 'Offline', ok: data.online },
          { label: 'CPU', value: `${data.cpu}%`, ok: data.cpu < 80 },
          { label: 'RAM', value: `${data.memory}%`, ok: data.memory < 85 },
          { label: 'Storage libre', value: data.diskFree, ok: true },
        ].map(({ label, value, ok }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-2.5">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className={`text-xs mt-0.5 ${ok ? 'text-green-600' : 'text-red-500'}`}>
              {ok ? '● Normal' : '● Atención'}
            </div>
          </div>
        ))}
      </div>
    )
  } catch {
    return (
      <p className="text-sm text-gray-400">
        Servidor no disponible. Configurar HA_URL y HA_TOKEN.
      </p>
    )
  }
}
