<script setup lang="ts">
const { login, isPending, error } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

function handleSubmit() {
  login(form.email, form.password)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold text-center">
          Support System Login
        </h1>
      </template>

      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField
          label="Email"
          required
        >
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          required
        >
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Your password"
            class="w-full"
          />
        </UFormField>

        <p
          v-if="error"
          class="text-red-500 text-sm"
        >
          {{ error }}
        </p>

        <UButton
          type="submit"
          block
          :loading="isPending"
        >
          Sign in
        </UButton>
      </form>
    </UCard>
  </div>
</template>
