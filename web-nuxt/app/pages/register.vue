<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create your account
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="text-primary-600 hover:text-primary-500">
          Sign in
        </NuxtLink>
      </p>
    </div>

    <UCard>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <UFormField label="Username" name="username" required>
          <UInput
            v-model="form.username"
            type="text"
            placeholder="Choose a username"
            required
          />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="First Name" name="firstName">
            <UInput
              v-model="form.firstName"
              type="text"
              placeholder="First name"
            />
          </UFormField>

          <UFormField label="Last Name" name="lastName">
            <UInput
              v-model="form.lastName"
              type="text"
              placeholder="Last name"
            />
          </UFormField>
        </div>

        <UFormField label="Password" name="password" required>
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Choose a password (min. 6 characters)"
            required
          />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword" required>
          <UInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
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
          Create Account
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

const { register, isAuthenticated } = useAuth();

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
});

const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (form.password.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await register({
      username: form.username,
      email: form.email,
      password: form.password,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
    });
    navigateTo("/");
  } catch (err: any) {
    error.value = err.message || "Registration failed";
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
