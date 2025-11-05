<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Or
        <NuxtLink
          to="/register"
          class="text-primary-600 hover:text-primary-500"
        >
          create a new account
        </NuxtLink>
      </p>
    </div>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleLogin">
        <UFormField label="Username" name="username">
          <UInput
            v-model="form.username"
            type="text"
            placeholder="Enter your username"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="warning"
          variant="soft"
          :title="error"
          :close-button="{ color: 'red', variant: 'link' }"
          @close="error = ''"
        />

        <UButton
          type="submit"
          color="primary"
          block
          size="lg"
          :loading="loading"
        >
          Sign In
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: "guest",
});

const { login, isAuthenticated } = useAuth();

const form = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

const toast = useToast();

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    await login(form.username, form.password);
    navigateTo("/");

    const audio = new Audio("/miau.mp3");
    audio
      .play()
      .catch((error) => console.error("Audio playback failed:", error));
    toast.add({ title: "Miau", description: "Welcommm.", duration: 2000 });
  } catch (err: any) {
    error.value = err.message || "Invalid credentials";
  } finally {
    loading.value = false;
  }
};

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo("/");
  }
});
</script>
