<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Panel
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Manage users and their roles
      </p>
    </div>

    <div v-if="status === 'pending'" class="space-y-4">
      <USkeleton v-for="i in 5" :key="i" class="h-20 w-full" />
    </div>

    <div v-else-if="error" class="py-12 text-center">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <UCard v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                User
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900"
          >
            <tr v-for="usr in users" :key="usr.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <UAvatar :src="usr.avatarUrl" :alt="usr.username" size="sm" />
                  <div class="ml-3">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ usr.firstName || usr.username }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      @{{ usr.username }}
                    </p>
                  </div>
                </div>
              </td>
              <td
                class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
              >
                {{ usr.email }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <USelect
                  v-model="usr.role"
                  :items="roleOptions"
                  size="sm"
                  @change="updateRole(usr.id, usr.role)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="usr.isActive ? 'success' : 'warning'">
                  {{ usr.isActive ? "Active" : "Inactive" }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm whitespace-nowrap">
                <UButton
                  :color="usr.isActive ? 'warning' : 'success'"
                  variant="ghost"
                  size="sm"
                  @click="toggleActive(usr.id)"
                >
                  {{ usr.isActive ? "Deactivate" : "Activate" }}
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: "admin",
});

const trpc = useTrpc();
const toast = useToast();

const {
  data: users,
  error,
  status,
  refresh,
} = useAsyncData("users", () =>
  trpc.users.list.query({ limit: 100, offset: 0 }),
);

const roleOptions = [
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
  { value: "admin", label: "Admin" },
];

const updateRole = async (userId: string, role: string) => {
  try {
    await trpc.users.updateRole.mutate({ userId, role });
    toast.add({ title: "Updated with sucess!", color: "success" });
  } catch (err: any) {
    await refresh();
  }
};

const toggleActive = async (userId: string) => {
  await trpc.users.toggleActive.mutate({ userId });
  const user = users.value.find((u) => u.id === userId);
  if (user) {
    user.isActive = !user.isActive;
  }
  toast.add({ title: "Updated with sucess!", color: "success" });
};
</script>
