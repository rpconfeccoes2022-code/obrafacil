import { FormEvent, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { maskCurrencyDigits, currencyMaskToNumber, numberToCurrencyMask } from '../../lib/currency'
import { Project, ProjectStatus, PROJECT_STATUS_LABEL } from '../../types/database'

interface Props {
  project: Project | null
  onClose: () => void
  onSaved: () => void
}

export default function ProjectFormModal({ project, onClose, onSaved }: Props) {
  const { profile } = useAuth()
  const [name, setName] = useState(project?.name ?? '')
  const [clientName, setClientName] = useState(project?.client_name ?? '')
  const [clientPhone, setClientPhone] = useState(project?.client_phone ?? '')
  const [address, setAddress] = useState(project?.address ?? '')
  const [startDate, setStartDate] = useState(project?.start_date ?? '')
  const [estimatedEndDate, setEstimatedEndDate] = useState(
    project?.estimated_end_date ?? '',
  )
  const [contractValue, setContractValue] = useState(
    project?.contract_value ? numberToCurrencyMask(project.contract_value) : '',
  )
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? 'planejamento',
  )
  const [notes, setNotes] = useState(project?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      name,
      client_name: clientName || null,
      client_phone: clientPhone || null,
      address: address || null,
      start_date: startDate || null,
      estimated_end_date: estimatedEndDate || null,
      contract_value: contractValue ? currencyMaskToNumber(contractValue) : null,
      status,
      notes: notes || null,
    }

    if (!project && !profile?.tenant_id) {
      setSaving(false)
      setError('Não foi possível identificar sua empresa. Recarregue a página e tente de novo.')
      return
    }

    const result = project
      ? await supabase.from('projects').update(payload).eq('id', project.id)
      : await supabase
          .from('projects')
          .insert({ ...payload, tenant_id: profile!.tenant_id })

    setSaving(false)

    if (result.error) {
      setError('Não foi possível salvar. Tente novamente.')
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-blueprint/40 md:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-blueprint">
          {project ? 'Editar obra' : 'Nova obra'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="field-label">Nome da obra</label>
            <input
              required
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Casa da Maria"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Cliente</label>
              <input
                className="field-input"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Telefone do cliente</label>
              <input
                className="field-input"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Endereço</label>
            <input
              className="field-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Início</label>
              <input
                type="date"
                className="field-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Previsão de término</label>
              <input
                type="date"
                className="field-input"
                value={estimatedEndDate}
                onChange={(e) => setEstimatedEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Valor contratado (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                className="field-input"
                value={contractValue}
                onChange={(e) => setContractValue(maskCurrencyDigits(e.target.value))}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select
                className="field-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                {Object.entries(PROJECT_STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Observações</label>
            <textarea
              className="field-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
