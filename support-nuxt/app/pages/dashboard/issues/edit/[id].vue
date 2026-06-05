<script setup lang="ts">
import type { IssueUpdatePayload } from '~/types/issues'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { data: issue, status } = useIssue(id)

const isPending = ref(false)
const error = ref<string | null>(null)

const STATUS_ITEMS = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
]

const PRIORITY_ITEMS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
]

const CATEGORY_ITEMS = [
  { label: 'Bug', value: 'bug' },
  { label: 'Feature Request', value: 'feature_request' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Security', value: 'security' },
  { label: 'Billing', value: 'billing' },
  { label: 'General', value: 'general' }
]

function toDatetimeLocal(val: string | null) {
  if (!val) return null
  return val.slice(0, 16)
}

function toLaravelDate(val: string | null) {
  if (!val) return null
  return val.replace('T', ' ') + ':00'
}

const form = reactive<IssueUpdatePayload>({
  title: '',
  description: '',
  priority: 'low',
  category: 'general',
  status: 'open',
  is_escalated: false,
  escalated_at: null,
  acknowledged_at: null,
  resolved_at: null,
  due_at: null,
  summary: null,
  suggested_action: null
})

watch(issue, (val) => {
  if (!val) return
  Object.assign(form, {
    title: val.title,
    description: val.description,
    priority: val.priority,
    category: val.category,
    status: val.status,
    is_escalated: val.is_escalated,
    escalated_at: toDatetimeLocal(val.escalated_at),
    acknowledged_at: toDatetimeLocal(val.acknowledged_at),
    resolved_at: toDatetimeLocal(val.resolved_at),
    due_at: toDatetimeLocal(val.due_at),
    summary: val.summary?.summary ?? null,
    suggested_action: val.summary?.suggested_action ?? null
  })
}, { immediate: true })

async function handleSubmit() {
  isPending.value = true
  error.value = null
  try {
    await updateIssue(id, {
      ...form,
      escalated_at: toLaravelDate(form.escalated_at),
      acknowledged_at: toLaravelDate(form.acknowledged_at),
      resolved_at: toLaravelDate(form.resolved_at),
      due_at: toLaravelDate(form.due_at)
    })
    router.push('/dashboard/issues')
  } catch (err: any) {
    error.value = err?.data?.message ?? 'Failed to update issue'
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">
      Edit Issue
    </h1>

    <div
      v-if="status === 'pending'"
      class="flex justify-center py-10"
    >
      <UIcon
        name="i-lucide-loader"
        class="animate-spin text-2xl"
      />
    </div>

    <form
      v-else
      class="space-y-4"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        label="Title"
        required
      >
        <UInput
          v-model="form.title"
          placeholder="Brief summary"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Description"
        required
      >
        <UTextarea
          v-model="form.description"
          :rows="4"
          class="w-full"
        />
      </UFormField>

      <div class="grid grid-cols-3 gap-4">
        <UFormField label="Priority">
          <USelect
            v-model="form.priority"
            :items="PRIORITY_ITEMS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Category">
          <USelect
            v-model="form.category"
            :items="CATEGORY_ITEMS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Status">
          <USelect
            v-model="form.status"
            :items="STATUS_ITEMS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField label="Escalated">
        <UCheckbox
          v-model="form.is_escalated"
          label="Mark as escalated"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Escalated At">
          <UInput
            v-model="form.escalated_at"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Acknowledged At">
          <UInput
            v-model="form.acknowledged_at"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Resolved At">
          <UInput
            v-model="form.resolved_at"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Due At">
          <UInput
            v-model="form.due_at"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField label="Summary">
        <UTextarea
          v-model="form.summary"
          placeholder="Short issue summary"
          :rows="3"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Suggested Action">
        <UTextarea
          v-model="form.suggested_action"
          placeholder="Suggested resolution"
          :rows="3"
          class="w-full"
        />
      </UFormField>

      <p
        v-if="error"
        class="text-error text-sm"
      >
        {{ error }}
      </p>

      <div class="flex justify-end">
        <UButton
          type="submit"
          :loading="isPending"
        >
          Update Issue
        </UButton>
      </div>
    </form>
  </div>
</template>
