import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { PROJECTS } from '@/lib/projects'

const PROJECT_ICONS: Record<string, string> = {
  solar: '☀️',
  cantina: '🍺',
  nimbus: '🏘️',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">JP</span>
            </div>
            <span className="font-semibold text-gray-900">Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>📊</span>
            <span>General</span>
          </Link>

          <div className="pt-3 pb-1">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Proyectos
            </p>
          </div>

          {PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/${project.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span>{PROJECT_ICONS[project.id]}</span>
              <span>{project.name}</span>
            </Link>
          ))}

          <div className="pt-3 pb-1">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Infraestructura
            </p>
          </div>

          <Link
            href="/dashboard/server"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>🖥️</span>
            <span>Servidor</span>
          </Link>
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
              JP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Juan Pablo</p>
            </div>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button
                type="submit"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar sesión"
              >
                ↩
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
