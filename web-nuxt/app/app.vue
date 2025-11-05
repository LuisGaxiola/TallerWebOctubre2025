<script setup lang="ts">
import { es } from "@nuxt/ui/locale";

import * as z from "zod";
import { es as zEs } from "zod/locales";

z.config(zEs());
</script>

<template>
  <UApp :locale="es">
    <MyHeader />

    <UMain class="bg-neutral-200 dark:bg-neutral-950">
      <NuxtLayout>
        <UContainer class="flex flex-col items-center justify-center gap-4 p-4">
          <NuxtPage />
        </UContainer>
      </NuxtLayout>
    </UMain>

    <UFooter> © elwiwi.com 2025 </UFooter>
  </UApp>
</template>
