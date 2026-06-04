export type IssueStatus = 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed'
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'
export type IssueCategory
  = | 'bug'
    | 'feature_request'
    | 'infrastructure'
    | 'security'
    | 'billing'
    | 'general'

export type User = {
  id: number
  name: string
}

export type Summary = {
  id: number
  issue_id: number
  summary: string
  suggested_action: string
}

export type Issue = {
  id: number
  user_id: number
  title: string
  description: string
  priority: IssuePriority
  category: IssueCategory
  status: IssueStatus
  is_escalated: boolean
  escalated_at: string | null
  acknowledged_at: string | null
  resolved_at: string | null
  due_at: string | null
  created_at: string
  updated_at: string
  summary?: Summary | null
  user?: User | null
}

export type IssueFilters = {
  page?: number
  status?: IssueStatus | null
  priority?: IssuePriority | null
  category?: IssueCategory | null
}

export type IssueStorePayload = {
  user_id: number
  title: string
  description: string
  priority: IssuePriority
  category: IssueCategory
  status: IssueStatus
}

export type IssueUpdatePayload = {
  title: string
  description: string
  priority: IssuePriority
  category: IssueCategory
  status: IssueStatus
  is_escalated?: boolean
  escalated_at?: string | null
  acknowledged_at?: string | null
  resolved_at?: string | null
  due_at?: string | null
  summary?: string | null
  suggested_action?: string | null
}

export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
}
