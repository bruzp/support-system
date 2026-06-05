import type {
  Issue,
  IssueFilters,
  IssueStorePayload,
  IssueUpdatePayload,
  PaginatedResponse
} from '~/types/issues'

export function useIssues(filters: Ref<IssueFilters>) {
  const api = useApi()

  return useAsyncData(
    () => `issues-${JSON.stringify(filters.value)}`,
    () => {
      const params = Object.fromEntries(
        Object.entries(filters.value).filter(([, v]) => v != null)
      )
      return api<PaginatedResponse<Issue>>('/issues', { params })
    },
    { watch: [filters], server: false }
  )
}

export function useIssue(id: number) {
  const api = useApi()

  return useAsyncData(`issue-${id}`, () =>
    api<Issue>(`/issues/${id}`),
  { server: false })
}

export async function createIssue(payload: IssueStorePayload) {
  const api = useApi()
  return api<Issue>('/issues', {
    method: 'POST',
    body: payload
  })
}

export async function updateIssue(id: number, payload: IssueUpdatePayload) {
  const api = useApi()
  return api<Issue>(`/issues/${id}`, {
    method: 'PUT',
    body: payload
  })
}

export async function deleteIssue(id: number) {
  const api = useApi()
  return api(`/issues/${id}`, { method: 'DELETE' })
}
