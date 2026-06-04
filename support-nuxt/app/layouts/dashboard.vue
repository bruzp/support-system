<script setup lang="ts">
const { logout } = useAuth()
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-56 border-r flex flex-col gap-1 p-4 bg-background self-start sticky top-0 h-screen">

      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-3 py-2 mb-3">
        <div class="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
          <UIcon name="i-lucide-headset" class="text-info text-base" />
        </div>
        <span class="font-medium text-sm">Support System</span>
      </div>

      <!-- Nav label -->
      <p class="text-xs text-dimmed uppercase tracking-wider px-3 mb-1">Menu</p>

      <!-- Nav links -->
      <UButton
        variant="ghost"
        to="/dashboard"
        class="justify-start"
        active-class="bg-info/10 text-info"
      >
        <template #leading>
          <UIcon name="i-lucide-layout-dashboard" />
        </template>
        Dashboard
      </UButton>

      <UButton
        variant="ghost"
        to="/dashboard/issues"
        class="justify-start"
        active-class="bg-info/10 text-info"
      >
        <template #leading>
          <UIcon name="i-lucide-ticket" />
        </template>
        Issues
      </UButton>

      <!-- Bottom section -->
      <div class="mt-auto border-t pt-4 flex flex-col gap-1">
        <div class="flex items-center gap-2.5 px-3 py-2">
          <div class="w-7 h-7 rounded-full bg-elevated flex items-center justify-center text-xs font-medium text-muted">
            BP
          </div>
          <div>
            <p class="text-sm font-medium leading-none">Bruce</p>
            <p class="text-xs text-dimmed mt-0.5">Admin</p>
          </div>
        </div>

        <UButton
          variant="ghost"
          color="error"
          class="justify-start"
          @click="logout"
        >
          <template #leading>
            <UIcon name="i-lucide-log-out" />
          </template>
          Logout
        </UButton>
      </div>
    </aside>

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>