import { getKpis, getTasks } from '@/lib/kv'
import type { Kpi, Task } from '@/types'

export default async function NimbusPage() {
  let kpis: Kpi[] = [], tasks: Task[] = []
  try {
    kpis = await getKpis('nimbus')
    tasks = await getTasks('nimbus')
  } catch { /* KV no configurado */ }

  const defaultKpis = kpis.length > 0 ? kpis : [
    { label: 'Clientes piloto', value: '—' },
    { label: 'Módulos listos', value: '—' },
    { label: 'Lanzamiento', value: '—' },
    { label: 'Uptime', value: '—' },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
          🏘️
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nimbus</h1>
          <p className="text-sm text-gray-500">
            Gestión de barrios privados ·{' '}
            <span className="text-blue-600 font-medium">En desarrollo</span>
            {' · '}
            <a
              href="https://github.com/juanpablocap/nimbus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
            >
              GitHub ↗
            </a>
          </p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Métricas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {defaultKpis.map((kpi) => (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xl font-semibold text-gray-900">{kpi.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Tareas</h2>
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-50">
          {tasks.length === 0 ? (
            <div className="p-4 text-sm text-gray-400">
              Sin tareas. Los datos se cargan desde Vercel KV.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3">
                <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-green-400' : 'bg-blue-400'}`} />
                <span className="text-sm text-gray-700 flex-1">{task.title}</span>
                <span className="text-xs text-gray-400">{task.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
