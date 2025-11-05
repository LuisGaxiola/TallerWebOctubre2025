<script setup lang="ts">
const items = ref<string[]>([]);
const value = ref("");
</script>

<template>
  <UHeader toggle-side="left">
    <template #title>
      <div class="flex items-center gap-2">
        <Icon name="lucide-lab:cat-big" class="bg-primary text-4xl" />
        <div class="flex h-6 w-auto">
          <div>EL</div>
          <div class="text-primary">WIWI</div>
        </div>
      </div>
    </template>

    <UInputMenu
      v-model="value"
      icon="i-lucide-search"
      size="md"
      :items="items"
    />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Acceso al sistema">
        <UButton
          color="primary"
          label="Acceder"
          to="/login"
          icon="i-simple-icons-github"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
