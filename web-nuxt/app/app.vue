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
        <UContainer>
          <NuxtPage />
        </UContainer>
      </NuxtLayout>
    </UMain>

    <UFooter title="UI" />
  </UApp>
</template>
