<script setup lang="ts">
import { es } from "@nuxt/ui/locale";

import * as z from "zod";
import { es as zEs } from "zod/locales";

z.config(zEs());

const { fetchUser } = useAuth();
const token = useCookie("auth_token");

// Fetch user on app mount if token exists
onMounted(async () => {
  if (token.value) {
    await fetchUser();
  }
});
</script>

<template>
  <UApp :locale="es">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
