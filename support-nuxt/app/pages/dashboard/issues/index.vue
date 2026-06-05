<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { IssueFilters, Issue } from '~/types/issues'

definePageMeta({ layout: 'dashboard' })

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: null },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
]

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: null },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
]

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: null },
  { label: 'Bug', value: 'bug' },
  { label: 'Feature Request', value: 'feature_request' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Security', value: 'security' },
  { label: 'Billing', value: 'billing' },
  { label: 'General', value: 'general' }
]

const STATUS_COLOR: Record<string, string> = {
  open: 'info',
  in_progress: 'warning',
  on_hold: 'warning',
  resolved: 'success',
  closed: 'neutral'
}

const PRIORITY_COLOR: Record<string, string> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'error'
}

const filters = ref<IssueFilters>({ page: 1 })
const { data, refresh, status } = useIssues(filters)

const issues = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)
const page = computed({
  get: () => filters.value.page ?? 1,
  set: (val) => { filters.value = { ...filters.value, page: val } }
})

// Delete
const deleteTarget = ref<Issue | null>(null)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

function confirmDelete(issue: Issue) {
  deleteTarget.value = issue
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await deleteIssue(deleteTarget.value.id)
    showDeleteModal.value = false
    refresh()
  } finally {
    isDeleting.value = false
  }
}

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }: any) => h(UBadge, {
      color: PRIORITY_COLOR[row.original.priority],
      variant: 'subtle'
    }, () => row.original.priority)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => h(UBadge, {
      color: STATUS_COLOR[row.original.status],
      variant: 'subtle'
    }, () => row.original.status.replace('_', ' '))
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }: any) => row.original.category.replace('_', ' ')
  },
  {
    accessorKey: 'user',
    header: 'Created By',
    cell: ({ row }: any) => row.original.user?.name ?? ''
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => h('div', { class: 'flex gap-2' }, [
      h(UButton, {
        icon: 'i-lucide-pencil',
        variant: 'ghost',
        color: 'primary',
        size: 'xs',
        to: `/dashboard/issues/edit/${row.original.id}`
      }),
      h(UButton, {
        icon: 'i-lucide-trash',
        variant: 'ghost',
        color: 'error',
        size: 'xs',
        onClick: () => confirmDelete(row.original)
      })
    ])
  }
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">
      Issues
    </h1>

    <!-- Filters -->
    <div class="flex gap-3 mb-4 flex-wrap items-end">
      <USelect
        v-model="filters.status"
        :items="STATUS_OPTIONS"
        value-key="value"
        label-key="label"
        class="flex-1"
        @update:model-value="filters.page = 1"
      />
      <USelect
        v-model="filters.priority"
        :items="PRIORITY_OPTIONS"
        value-key="value"
        label-key="label"
        class="flex-1"
        @update:model-value="filters.page = 1"
      />
      <USelect
        v-model="filters.category"
        :items="CATEGORY_OPTIONS"
        value-key="value"
        label-key="label"
        class="flex-1"
        @update:model-value="filters.page = 1"
      />
      <UButton
        icon="i-lucide-plus"
        to="/dashboard/issues/add"
      >
        Add
      </UButton>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex justify-center py-10"
    >
      <UIcon
        name="i-lucide-loader"
        class="animate-spin text-2xl"
      />
    </div>

    <!-- Error -->
    <p
      v-else-if="status === 'error'"
      class="text-error text-center py-10"
    >
      Failed to load issues.
    </p>

    <!-- Table -->
    <template v-else>
      <UTable
        :data="issues"
        :columns="columns"
      />

      <!-- Pagination -->
      <div
        v-if="meta && meta.last_page > 1"
        class="flex justify-center mt-4"
      >
        <UPagination
          v-model:page="page"
          :total="meta.total"
          :items-per-page="meta.per_page"
        />
      </div>
    </template>

    <!-- Delete Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <UCard>
          <template #header>
            <p class="font-semibold">
              Delete Issue
            </p>
          </template>

          <p>Are you sure you want to delete <strong>{{ deleteTarget?.title }}</strong>?</p>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                variant="ghost"
                color="neutral"
                @click="showDeleteModal = false"
              >
                Cancel
              </UButton>
              <UButton
                color="error"
                :loading="isDeleting"
                @click="handleDelete"
              >
                Delete
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
