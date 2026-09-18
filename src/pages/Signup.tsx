import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signUp({ email, password, fullName, companyName })
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-concrete px-4">
        <div className="w-full max-w-sm border border-blueprint/10 bg-white p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-blueprint">
            Confirme seu e-mail
          </h1>
          <p className="mt-3 text-ink/70">
            Enviamos um link de confirmação para <strong>{email}</strong>.
            Depois de confirmar, é só entrar normalmente.
          </p>
          <Link to="/entrar" className="btn-primary mt-6 inline-flex">
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-concrete px-4 py-10">
      <div className="w-full max-w-sm border border-blueprint/10 bg-white p-8">
        <Link to="/" className="font-display text-xl font-semibold text-blueprint">
          ObraFácil
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-blueprint">
          Criar conta
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="fullName">
              Seu nome
            </label>
            <input
              id="fullName"
              required
              className="field-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="companyName">
              Nome da empresa
            </label>
            <input
              id="companyName"
              required
              className="field-input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
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
              minLength={6}
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-brick">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink/60">
          Já tem conta?{' '}
          <Link to="/entrar" className="font-medium text-blueprint">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
