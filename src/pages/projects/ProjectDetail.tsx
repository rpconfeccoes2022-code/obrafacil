import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { Expense, Income, Project, PROJECT_STATUS_LABEL } from '../../types/database'

type Tab = 'visao_geral' | 'financeiro' | 'progresso' | 'materiais' | 'equipe' | 'documentos'

const TABS: { id: Tab; label: string }[] = [
  { id: 'visao_geral', label: 'Visão geral' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'progresso', label: 'Progresso' },
  { id: 'materiais', label: 'Materiais' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'documentos', label: 'Documentos' },
]

const formatMoney = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [tab, setTab] = useState<Tab>('visao_geral')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!id) return
    setLoading(true)
    const [{ data: p }, { data: inc }, { data: exp }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('income').select('*').eq('project_id', id).order('entry_date', { ascending: false }),
      supabase.from('expenses').select('*').eq('project_id', id).order('expense_date', { ascending: false }),
    ])
    setProject(p as Project)
    setIncome((inc as Income[]) ?? [])
    setExpenses((exp as Expense[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading) return <p className="text-ink/60">Carregando…</p>
  if (!project) return <p className="text-ink/60">Obra não encontrada.</p>

  const totalIncome = income.reduce((s, i) => s + Number(i.amount), 0)
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div>
      <Link to="/app/obras" className="text-sm text-blueprint/60 hover:text-blueprint">
        ← Minhas Obras
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-blueprint">
            {project.name}
          </h1>
          <p className="text-ink/60">
            {project.client_name || 'Sem cliente'} · {PROJECT_STATUS_LABEL[project.status]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-ink/60">Valor da obra</p>
          <p className="font-display text-xl font-semibold text-blueprint">
            {formatMoney(Number(project.contract_value ?? 0))}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 w-full bg-blueprint/10">
        <div className="h-2 bg-amber" style={{ width: `${project.progress_percent}%` }} />
      </div>
      <p className="mt-1 text-sm text-ink/60">{project.progress_percent}% concluída</p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-blueprint/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${
              tab === t.id
                ? 'border-amber text-blueprint'
                : 'border-transparent text-ink/50 hover:text-blueprint'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'visao_geral' && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card">
              <p className="text-sm text-ink/60">Total recebido</p>
              <p className="mt-1 font-display text-xl font-semibold text-greenwork">
                {formatMoney(totalIncome)}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-ink/60">Total gasto</p>
              <p className="mt-1 font-display text-xl font-semibold text-brick">
                {formatMoney(totalExpenses)}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-ink/60">Saldo</p>
              <p className="mt-1 font-display text-xl font-semibold text-blueprint">
                {formatMoney(totalIncome - totalExpenses)}
              </p>
            </div>
            {project.address && (
              <div className="card md:col-span-3">
                <p className="text-sm text-ink/60">Endereço</p>
                <p className="mt-1 text-blueprint">{project.address}</p>
              </div>
            )}
            {project.notes && (
              <div className="card md:col-span-3">
                <p className="text-sm text-ink/60">Observações</p>
                <p className="mt-1 text-blueprint">{project.notes}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'financeiro' && (
          <FinanceiroTab
            projectId={project.id}
            income={income}
            expenses={expenses}
            onChanged={load}
          />
        )}

        {tab === 'progresso' && (
          <div className="card">
            <p className="text-ink/60">
              Etapas da obra (fundação, alvenaria, acabamento…) entram na próxima
              leva — a tabela <code>project_stages</code> já está pronta no banco.
            </p>
          </div>
        )}

        {(tab === 'materiais' || tab === 'equipe' || tab === 'documentos') && (
          <div className="card">
            <p className="text-ink/60">
              Este módulo ainda não foi construído na interface — mas a tabela
              já existe no banco e o acesso já está protegido por tenant.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function FinanceiroTab({
  projectId,
  income,
  expenses,
  onChanged,
}: {
  projectId: string
  income: Income[]
  expenses: Expense[]
  onChanged: () => void
}) {
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-blueprint">Entradas</h3>
          <button onClick={() => setShowIncomeForm(true)} className="btn-secondary !px-3 !py-1.5 text-sm">
            + Entrada
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {income.length === 0 && <p className="text-sm text-ink/50">Nenhuma entrada lançada.</p>}
          {income.map((i) => (
            <div key={i.id} className="flex items-center justify-between border border-blueprint/10 bg-white px-4 py-2.5 text-sm">
              <div>
                <p className="text-blueprint">{i.description || 'Entrada'}</p>
                <p className="text-ink/50">{new Date(i.entry_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <p className="font-medium text-greenwork">{formatMoney(Number(i.amount))}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-blueprint">Despesas</h3>
          <button onClick={() => setShowExpenseForm(true)} className="btn-secondary !px-3 !py-1.5 text-sm">
            + Despesa
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {expenses.length === 0 && <p className="text-sm text-ink/50">Nenhuma despesa lançada.</p>}
          {expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between border border-blueprint/10 bg-white px-4 py-2.5 text-sm">
              <div>
                <p className="text-blueprint">{e.description || e.category || 'Despesa'}</p>
                <p className="text-ink/50">{new Date(e.expense_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <p className="font-medium text-brick">{formatMoney(Number(e.amount))}</p>
            </div>
          ))}
        </div>
      </div>

      {showIncomeForm && (
        <QuickEntryModal
          title="Nova entrada"
          projectId={projectId}
          table="income"
          dateField="entry_date"
          onClose={() => setShowIncomeForm(false)}
          onSaved={() => {
            setShowIncomeForm(false)
            onChanged()
          }}
        />
      )}
      {showExpenseForm && (
        <QuickEntryModal
          title="Nova despesa"
          projectId={projectId}
          table="expenses"
          dateField="expense_date"
          hasCategory
          onClose={() => setShowExpenseForm(false)}
          onSaved={() => {
            setShowExpenseForm(false)
            onChanged()
          }}
        />
      )}
    </div>
  )
}

function QuickEntryModal({
  title,
  projectId,
  table,
  dateField,
  hasCategory,
  onClose,
  onSaved,
}: {
  title: string
  projectId: string
  table: 'income' | 'expenses'
  dateField: 'entry_date' | 'expense_date'
  hasCategory?: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const { profile } = useAuth()
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [paymentMethod, setPaymentMethod] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!profile?.tenant_id) {
      setSaving(false)
      setError('Não foi possível identificar sua empresa. Recarregue a página e tente de novo.')
      return
    }

    const payload: Record<string, unknown> = {
      project_id: projectId,
      tenant_id: profile.tenant_id,
      description: description || null,
      amount: Number(amount),
      payment_method: paymentMethod || null,
      [dateField]: date,
    }
    if (hasCategory) payload.category = category || null

    const { error } = await supabase.from(table).insert(payload)
    setSaving(false)
    if (error) {
      setError('Não foi possível salvar.')
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-blueprint/40 md:items-center">
      <div className="w-full max-w-md bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-blueprint">{title}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="field-label">Descrição</label>
            <input className="field-input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {hasCategory && (
            <div>
              <label className="field-label">Categoria</label>
              <input
                className="field-input"
                placeholder="Cimento, transporte, mão de obra…"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                className="field-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Data</label>
              <input
                type="date"
                required
                className="field-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Forma de pagamento</label>
            <input
              className="field-input"
              placeholder="Pix, dinheiro, cartão…"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-brick">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
