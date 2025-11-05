<template>
  <div>
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

      <div class="flex items-center">
        <div v-if="isAuthenticated" class="ml-10 flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Feed
          </NuxtLink>
          <NuxtLink
            to="/posts/my"
            class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            My Posts
          </NuxtLink>
          <NuxtLink
            to="/posts/new"
            class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Create Post
          </NuxtLink>
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Admin
          </NuxtLink>
        </div>
      </div>

      <template #right>
        <div class="flex items-center space-x-4">
          <UColorModeButton variant="soft" />

          <UButton
            v-if="isAuthenticated"
            color="neutral"
            variant="ghost"
            @click="goToProfile"
          >
            {{ user?.username }}
          </UButton>

          <UButton
            v-if="isAuthenticated"
            color="warning"
            variant="soft"
            @click="handleLogout"
          >
            Logout
          </UButton>

          <template v-else>
            <NuxtLink to="/login">
              <UButton color="neutral" variant="ghost"> Login </UButton>
            </NuxtLink>
            <NuxtLink to="/register">
              <UButton color="primary"> Register </UButton>
            </NuxtLink>
          </template>
        </div>
      </template>
      <template #body>
        <UNavigationMenu
          :items="
            [
              {
                label: 'Feed',
                to: '/',
                active: $route.path.startsWith('/'),
              },
              isAuthenticated && {
                label: 'My Posts',
                to: '/posts/my',
                active: $route.path.startsWith('/posts/my'),
              },
              isAuthenticated && {
                label: 'Create Post',
                to: '/posts/new',
                active: $route.path.startsWith('/posts/new'),
              },
              isAdmin && {
                label: 'Admin',
                to: '/admin',
                active: $route.path.startsWith('/admin'),
              },
            ].filter((i) => !!i)
          "
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>
    <UMain class="bg-neutral-200 dark:bg-neutral-950">
      <UContainer class="flex flex-col items-center justify-center gap-4 p-4">
        <slot />
      </UContainer>
    </UMain>
    <UFooter> © elwiwi.com 2025 </UFooter>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, isAdmin, logout } = useAuth();

const handleLogout = () => {
  logout();
};

const goToProfile = () => {
  navigateTo("/profile");
};
</script>
