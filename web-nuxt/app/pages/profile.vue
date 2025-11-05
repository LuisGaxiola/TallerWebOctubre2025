<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        My Profile
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Update your personal information
      </p>
    </div>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="flex items-center justify-center">
          <UAvatar
            :src="form.avatarUrl || undefined"
            :alt="user?.username"
            size="xl"
          />
        </div>

        <UFormField label="Username" name="username">
          <UInput :model-value="user?.username" type="text" disabled />
          <template #help> Username cannot be changed </template>
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput :model-value="user?.email" type="email" disabled />
          <template #help> Email cannot be changed </template>
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

        <UFormField label="Bio" name="bio">
          <UTextarea
            v-model="form.bio"
            placeholder="Tell us about yourself..."
            :rows="4"
          />
        </UFormField>

        <UFormField label="Avatar URL" name="avatarUrl">
          <UInput
            v-model="form.avatarUrl"
            type="url"
            placeholder="https://example.com/avatar.jpg"
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

        <UAlert
          v-if="success"
          color="success"
          variant="soft"
          title="Profile updated successfully!"
          :close-button="{ color: 'green', variant: 'link' }"
          @close="success = false"
        />

        <div class="flex items-center justify-end space-x-4">
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            @click="resetForm"
          >
            Reset
          </UButton>
          <UButton type="submit" color="primary" :loading="loading">
            Save Changes
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { user, fetchUser } = useAuth();
const trpc = useTrpc();

const form = reactive({
  firstName: "",
  lastName: "",
  bio: "",
  avatarUrl: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

const initForm = () => {
  if (user.value) {
    form.firstName = user.value.firstName || "";
    form.lastName = user.value.lastName || "";
    form.bio = user.value.bio || "";
    form.avatarUrl = user.value.avatarUrl || "";
  }
};

const resetForm = () => {
  initForm();
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await trpc.users.updateProfile.mutate({
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      bio: form.bio || undefined,
      avatarUrl: form.avatarUrl || undefined,
    });

    await fetchUser();
    success.value = true;
  } catch (err: any) {
    error.value = err.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initForm();
});

watch(user, () => {
  initForm();
});
</script>
