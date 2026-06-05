<script setup lang="ts">
const { logout } = useAuth()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 border-r p-4 flex flex-col gap-2">
      <p class="font-bold text-lg mb-4">
        Support System
      </p>
      <UButton
        variant="ghost"
        to="/dashboard/issues"
        class="justify-start"
      >
        Issues
      </UButton>
      <div class="mt-auto">
        <UButton
          variant="ghost"
          color="red"
          block
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
