import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { Project, ProjectStatus, PROJECT_STATUS_LABEL } from '../../types/database'
import ProjectFormModal from './ProjectFormModal'

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'todas'>('todas')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('archived', false)
      .order('created_at', { ascending: false })
    setProjects((data as Project[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleArchive(project: Project) {
    if (!confirm(`Arquivar a obra "${project.name}"? Ela sai da lista, mas os dados continuam guardados.`)) {
      return
    }
    await supabase.from('projects').update({ archived: true }).eq('id', project.id)
    load()
  }

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'todas' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-blueprint">
          Minhas Obras
        </h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="btn-primary !px-4 !py-2 text-sm"
        >
          Nova obra
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input
          className="field-input md:max-w-xs"
          placeholder="Buscar por nome ou cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field-input md:max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'todas')}
        >
          <option value="todas">Todos os status</option>
          {Object.entries(PROJECT_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-ink/60">Carregando…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-8 border border-dashed border-blueprint/20 bg-white p-10 text-center">
          <p className="text-ink/60">Nenhuma obra encontrada.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="card flex flex-wrap items-center justify-between gap-4">
              <Link to={`/app/obras/${p.id}`} className="min-w-[180px] flex-1">
                <p className="font-medium text-blueprint">{p.name}</p>
                <p className="text-sm text-ink/60">
                  {p.client_name || 'Sem cliente'} · {PROJECT_STATUS_LABEL[p.status]}
                </p>
              </Link>
              <div className="w-28">
                <div className="h-1.5 bg-blueprint/10">
                  <div className="h-1.5 bg-amber" style={{ width: `${p.progress_percent}%` }} />
                </div>
                <p className="mt-1 text-right text-xs text-ink/50">{p.progress_percent}%</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => {
                    setEditing(p)
                    setShowForm(true)
                  }}
                  className="text-blueprint hover:text-amber-dark"
                >
                  Editar
                </button>
                <button onClick={() => handleArchive(p)} className="text-ink/50 hover:text-brick">
                  Arquivar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectFormModal
          project={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false)
            load()
          }}
        />
      )}
    </div>
  )
}
