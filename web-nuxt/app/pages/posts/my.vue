<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Posts
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Manage your published posts
        </p>
      </div>
      <UButton color="primary" @click="navigateTo('/posts/new')">
        Create New Post
      </UButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
    </div>

    <div v-else-if="error" class="py-12 text-center">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <UCard v-else-if="posts.length === 0" class="py-12 text-center">
      <p class="mb-4 text-gray-500 dark:text-gray-400">
        You haven't created any posts yet
      </p>
      <UButton color="primary" @click="navigateTo('/posts/new')">
        Create Your First Post
      </UButton>
    </UCard>

    <div v-else class="space-y-4">
      <UCard
        v-for="post in posts"
        :key="post.id"
        class="transition-shadow hover:shadow-lg"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <NuxtLink :to="`/posts/${post.id}`">
              <h3
                class="hover:text-primary-600 mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >
                {{ post.title }}
              </h3>
            </NuxtLink>
            <p class="mb-2 line-clamp-2 text-gray-600 dark:text-gray-300">
              {{ post.content }}
            </p>
            <div
              class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <span>{{ formatDate(post.createdAt) }}</span>
              <span>❤️ {{ post.likesCount }}</span>
              <UBadge :color="post.isPublished ? 'success' : 'neutral'">
                {{ post.isPublished ? "Published" : "Draft" }}
              </UBadge>
            </div>
          </div>

          <div class="ml-4 flex items-center space-x-2">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              @click="navigateTo(`/posts/${post.id}/edit`)"
            >
              Edit
            </UButton>
            <UButton
              color="warning"
              variant="ghost"
              size="sm"
              @click="handleDelete(post.id)"
            >
              Delete
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: "auth",
});

const trpc = useTrpc();

const posts = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

const fetchPosts = async () => {
  try {
    loading.value = true;
    posts.value = await trpc.posts.myPosts.query({ limit: 100, offset: 0 });
  } catch (err: any) {
    error.value = err.message || "Failed to load posts";
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (postId: string) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await trpc.posts.delete.mutate({ id: postId });
    posts.value = posts.value.filter((p) => p.id !== postId);
  } catch (err: any) {
    error.value = err.message || "Failed to delete post";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  fetchPosts();
});
</script>
