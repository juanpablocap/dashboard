import { getKpis, getTasks } from '@/lib/kv'
import type { Kpi, Task } from '@/types'

export default async function CantinaPage() {
  let kpis: Kpi[] = [], tasks: Task[] = []
  try {
    kpis = await getKpis('cantina')
    tasks = await getTasks('cantina')
  } catch { /* KV no configurado */ }

  const defaultKpis = kpis.length > 0 ? kpis : [
    { label: 'Clientes activos', value: '—' },
    { label: 'Uptime', value: '—' },
    { label: 'MRR', value: '—' },
    { label: 'Errores (24h)', value: '—' },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold">
          🍺
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cantina Gestión</h1>
          <p className="text-sm text-gray-500">SaaS para bares y restaurantes · <span className="text-yellow-600 font-medium">Beta</span></p>
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
                <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-green-400' : 'bg-red-400'}`} />
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
