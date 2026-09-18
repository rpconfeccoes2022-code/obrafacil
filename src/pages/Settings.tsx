import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-blueprint">
        Configurações
      </h1>

      <div className="card mt-6">
        <p className="text-sm text-ink/60">Nome</p>
        <p className="text-blueprint">{profile?.full_name || '—'}</p>
      </div>
      <div className="card mt-3">
        <p className="text-sm text-ink/60">E-mail</p>
        <p className="text-blueprint">{user?.email}</p>
      </div>
      <div className="card mt-3">
        <p className="text-sm text-ink/60">Função na conta</p>
        <p className="text-blueprint capitalize">{profile?.role}</p>
      </div>

      <button onClick={signOut} className="btn-secondary mt-6">
        Sair da conta
      </button>
    </div>
  )
}
