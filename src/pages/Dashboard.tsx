import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Project } from '../types/database'

interface Stats {
  totalObras: number
  emAndamento: number
  concluidas: number
  valorTotalContratado: number
  totalGasto: number
  totalRecebido: number
  progressoMedio: number
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false })

      const list = (projectsData as Project[]) ?? []
      setProjects(list)

      const projectIds = list.map((p) => p.id)
      let totalGasto = 0
      let totalRecebido = 0

      if (projectIds.length > 0) {
        const [{ data: expenses }, { data: income }] = await Promise.all([
          supabase.from('expenses').select('amount').in('project_id', projectIds),
          supabase.from('income').select('amount').in('project_id', projectIds),
        ])
        totalGasto = (expenses ?? []).reduce((sum, e: any) => sum + Number(e.amount), 0)
        totalRecebido = (income ?? []).reduce((sum, i: any) => sum + Number(i.amount), 0)
      }

      const emAndamento = list.filter((p) => p.status === 'em_andamento').length
      const concluidas = list.filter((p) => p.status === 'concluida').length
      const valorTotalContratado = list.reduce(
        (sum, p) => sum + Number(p.contract_value ?? 0),
        0,
      )
      const progressoMedio =
        list.length > 0
          ? list.reduce((sum, p) => sum + Number(p.progress_percent), 0) / list.length
          : 0

      setStats({
        totalObras: list.length,
        emAndamento,
        concluidas,
        valorTotalContratado,
        totalGasto,
        totalRecebido,
        progressoMedio,
      })
      setLoading(false)
    }
    load()
  }, [])

  const formatMoney = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  if (loading) {
    return <p className="text-ink/60">Carregando painel…</p>
  }

  const saldo = (stats?.totalRecebido ?? 0) - (stats?.totalGasto ?? 0)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-blueprint">
          Painel
        </h1>
        <Link to="/app/obras" className="btn-primary !px-4 !py-2 text-sm">
          Nova obra
        </Link>
      </div>

      {stats?.totalObras === 0 ? (
        <div className="mt-8 border border-dashed border-blueprint/20 bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-blueprint">
            Nenhuma obra cadastrada ainda
          </p>
          <p className="mt-2 text-ink/60">
            Cadastre sua primeira obra pra começar a acompanhar o progresso e o financeiro.
          </p>
          <Link to="/app/obras" className="btn-primary mt-5 inline-flex">
            Cadastrar obra
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card label="Obras cadastradas" value={String(stats?.totalObras)} />
            <Card label="Em andamento" value={String(stats?.emAndamento)} />
            <Card label="Concluídas" value={String(stats?.concluidas)} />
            <Card
              label="Progresso médio"
              value={`${(stats?.progressoMedio ?? 0).toFixed(0)}%`}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card label="Valor total das obras" value={formatMoney(stats?.valorTotalContratado ?? 0)} />
            <Card label="Total gasto" value={formatMoney(stats?.totalGasto ?? 0)} accent="brick" />
            <Card label="Saldo" value={formatMoney(saldo)} accent="greenwork" />
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold text-blueprint">
            Suas obras
          </h2>
          <div className="mt-3 space-y-3">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                to={`/app/obras/${p.id}`}
                className="card flex items-center justify-between hover:border-amber"
              >
                <div>
                  <p className="font-medium text-blueprint">{p.name}</p>
                  <p className="text-sm text-ink/60">{p.client_name || 'Sem cliente definido'}</p>
                </div>
                <div className="w-24">
                  <div className="h-1.5 bg-blueprint/10">
                    <div
                      className="h-1.5 bg-amber"
                      style={{ width: `${p.progress_percent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-ink/50">
                    {p.progress_percent}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Card({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: 'brick' | 'greenwork'
}) {
  return (
    <div className="card">
      <p className="text-sm text-ink/60">{label}</p>
      <p
        className={`mt-1 font-display text-2xl font-semibold ${
          accent === 'brick'
            ? 'text-brick'
            : accent === 'greenwork'
            ? 'text-greenwork'
            : 'text-blueprint'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
