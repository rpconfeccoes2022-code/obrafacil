import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const NAV_ITEMS = [
  { to: '/app', label: 'Painel', icon: '▦', end: true },
  { to: '/app/obras', label: 'Obras', icon: '⌂' },
  { to: '/app/configuracoes', label: 'Config.', icon: '⚙' },
]

export default function AppLayout() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-concrete">
      {/* Sidebar desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col md:border-r md:border-blueprint/10 md:bg-white">
        <div className="px-6 py-6">
          <span className="font-display text-xl font-semibold text-blueprint">
            ObraFácil
          </span>
        </div>
        <nav className="flex-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blueprint text-white'
                    : 'text-blueprint hover:bg-blueprint-50'
                }`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-blueprint/10 px-6 py-4">
          <p className="truncate text-sm font-medium text-blueprint">
            {profile?.full_name || 'Minha conta'}
          </p>
          <button
            onClick={signOut}
            className="mt-1 text-sm text-ink/60 hover:text-brick"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Header mobile */}
      <header className="flex items-center justify-between border-b border-blueprint/10 bg-white px-4 py-3 md:hidden">
        <span className="font-display text-lg font-semibold text-blueprint">
          ObraFácil
        </span>
        <button onClick={signOut} className="text-sm text-ink/60">
          Sair
        </button>
      </header>

      <main className="pb-20 md:ml-60 md:pb-6">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <Outlet />
        </div>
      </main>

      {/* Menu inferior mobile */}
      <nav className="fixed inset-x-0 bottom-0 flex border-t border-blueprint/10 bg-white md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                isActive ? 'text-amber-dark' : 'text-blueprint/60'
              }`
            }
          >
            <span className="text-lg" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
