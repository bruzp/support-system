export const useIssueFiltersStore = defineStore('issueFilters', () => {
  const filters = ref<IssueFilters>({ page: 1 })

  function setFilter(key: keyof IssueFilters, value: any) {
    filters.value = { ...filters.value, page: 1, [key]: value }
  }

  function resetFilters() {
    filters.value = { page: 1 }
  }

  return { filters, setFilter, resetFilters }
})
