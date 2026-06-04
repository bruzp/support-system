import { IssueFilters } from '@/hooks/useIssues'
import { create } from 'zustand'

type IssueFiltersStore = {
  filters: IssueFilters
  setFilter: (key: keyof IssueFilters, value: any) => void
  resetFilters: () => void
}

export const useIssueFiltersStore = create<IssueFiltersStore>((set) => ({
  filters: { page: 1 },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, page: 1, [key]: value }
    })),

  resetFilters: () =>
    set({ filters: { page: 1 } })
}))