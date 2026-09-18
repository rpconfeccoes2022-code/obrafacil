import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError('E-mail ou senha incorretos.')
      return
    }
    navigate('/app')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-concrete px-4">
      <div className="w-full max-w-sm border border-blueprint/10 bg-white p-8">
        <Link to="/" className="font-display text-xl font-semibold text-blueprint">
          ObraFácil
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-blueprint">
          Entrar
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-brick">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink/60">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-blueprint">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
