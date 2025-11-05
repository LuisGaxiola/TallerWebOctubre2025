<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Inserta tu correo electrónico",
    required: true,
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "Insterta tu contraseña",
    required: true,
  },
  {
    name: "remember",
    label: "Recordarme",
    type: "checkbox",
  },
];

const schema = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z
    .string("Se requiere una contraseña")
    .min(8, "Debe ser de al menos 8 caracteres"),
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log("Submitted", payload);
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Login"
      description="Ingresa tus credenciales para continuar."
      :fields="fields"
      @submit="onSubmit"
    />
  </UPageCard>
</template>
