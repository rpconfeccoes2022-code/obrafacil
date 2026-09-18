export type ProjectStatus =
  | 'planejamento'
  | 'em_andamento'
  | 'pausada'
  | 'concluida'
  | 'cancelada'

export interface Project {
  id: string
  tenant_id: string
  name: string
  client_name: string | null
  client_phone: string | null
  address: string | null
  start_date: string | null
  estimated_end_date: string | null
  contract_value: number | null
  notes: string | null
  status: ProjectStatus
  progress_percent: number
  archived: boolean
  created_at: string
  updated_at: string
}

export interface Income {
  id: string
  tenant_id: string
  project_id: string
  entry_date: string
  description: string | null
  amount: number
  payment_method: string | null
  notes: string | null
  created_at: string
}

export interface Expense {
  id: string
  tenant_id: string
  project_id: string
  expense_date: string
  category: string | null
  description: string | null
  amount: number
  payment_method: string | null
  related_employee_id: string | null
  supplier_name: string | null
  notes: string | null
  created_at: string
}

export interface Profile {
  id: string
  tenant_id: string
  full_name: string | null
  role: 'owner' | 'admin' | 'member'
  is_saas_admin: boolean
  created_at: string
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planejamento: 'Planejamento',
  em_andamento: 'Em andamento',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}
