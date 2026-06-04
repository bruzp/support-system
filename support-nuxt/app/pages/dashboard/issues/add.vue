<script setup lang="ts">
import type { IssueStorePayload } from '~/types/issues'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
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

const { data: users, status: usersStatus } = useUsers()
const userItems = computed(() =>
  (users.value ?? []).map(u => ({ label: u.name, value: String(u.id) }))
)

const form = reactive<IssueStorePayload>({
  user_id: 0,
  title: '',
  description: '',
  priority: 'low',
  category: 'general',
  status: 'open'
})

const selectedUserId = ref<string>('')
watch(selectedUserId, (val) => { form.user_id = val ? Number(val) : 0 })

async function handleSubmit() {
  isPending.value = true
  error.value = null
  try {
    await createIssue(form)
    router.push('/dashboard/issues')
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Failed to create issue'
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">
      Add Issue
    </h1>

    <form
      class="space-y-4"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        label="User"
        required
      >
        <USelect
          v-model="selectedUserId"
          :items="userItems"
          value-key="value"
          label-key="label"
          :disabled="usersStatus === 'pending'"
          placeholder="Select a user"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Title"
        required
      >
        <UInput
          v-model="form.title"
          placeholder="Brief summary of the issue"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Description"
        required
      >
        <UTextarea
          v-model="form.description"
          placeholder="Describe the issue in detail"
          :rows="4"
          class="w-full"
        />
      </UFormField>

      <div class="grid grid-cols-3 gap-4">
        <UFormField
          label="Priority"
          required
        >
          <USelect
            v-model="form.priority"
            :items="PRIORITY_ITEMS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Category"
          required
        >
          <USelect
            v-model="form.category"
            :items="CATEGORY_ITEMS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Status"
          required
        >
          <USelect
            v-model="form.status"
            :items="STATUS_ITEMS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>
      </div>

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
          Create Issue
        </UButton>
      </div>
    </form>
  </div>
</template>
