<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Feed</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Latest posts from the community
      </p>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-48 w-full" />
    </div>

    <div v-else-if="error" class="py-12 text-center">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <div v-else-if="posts.length === 0" class="py-12 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        No posts yet. Be the first to create one!
      </p>
      <NuxtLink v-if="isAuthenticated" to="/posts/new">
        <UButton class="mt-4" color="primary"> Create Post </UButton>
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <UCard
        v-for="post in posts"
        :key="post.id"
        class="transition-shadow hover:shadow-lg"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <UAvatar
                :alt="post.author.username"
                :src="post.author.avatarUrl"
                size="sm"
              />
              <div>
                <NuxtLink :to="`/users/${post.author.id}`">
                  <p
                    class="hover:text-primary-600 font-semibold text-gray-900 dark:text-white"
                  >
                    {{ post.author.firstName || post.author.username }}
                  </p>
                </NuxtLink>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(post.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </template>

        <div>
          <NuxtLink :to="`/posts/${post.id}`">
            <h3
              class="hover:text-primary-600 mb-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              {{ post.title }}
            </h3>
          </NuxtLink>
          <p class="line-clamp-3 text-gray-600 dark:text-gray-300">
            {{ post.content }}
          </p>
          <img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            :alt="post.title"
            class="mt-4 max-h-96 w-full rounded-lg object-cover"
          />
        </div>

        <template #footer>
          <div class="flex items-center space-x-4">
            <UButton
              :color="post.isLikedByUser ? 'primary' : 'neutral'"
              variant="ghost"
              size="sm"
              :disabled="!isAuthenticated"
              @click="toggleLike(post.id)"
            >
              <template #leading>
                <span class="text-lg">{{
                  post.isLikedByUser ? "❤️" : "🤍"
                }}</span>
              </template>
              {{ post.likesCount }}
              {{ post.likesCount === 1 ? "Like" : "Likes" }}
            </UButton>

            <NuxtLink :to="`/posts/${post.id}`">
              <UButton color="neutral" variant="ghost" size="sm">
                View Post
              </UButton>
            </NuxtLink>
          </div>
        </template>
      </UCard>

      <div class="mt-8 flex justify-center">
        <UButton
          v-if="hasMore"
          :loading="loadingMore"
          color="neutral"
          variant="outline"
          @click="loadMore"
        >
          Load More
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { isAuthenticated } = useAuth();
const trpc = useTrpc();

const posts = ref<any[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref("");
const offset = ref(0);
const limit = 10;
const hasMore = ref(true);

const fetchPosts = async (append = false) => {
  try {
    if (append) {
      loadingMore.value = true;
    } else {
      loading.value = true;
    }

    const result = await trpc.posts.list.query({
      limit,
      offset: offset.value,
    });

    if (append) {
      posts.value = [...posts.value, ...result];
    } else {
      posts.value = result;
    }

    hasMore.value = result.length === limit;
  } catch (err: any) {
    error.value = err.message || "Failed to load posts";
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  offset.value += limit;
  fetchPosts(true);
};

const toggleLike = async (postId: string) => {
  if (!isAuthenticated.value) return;

  try {
    const result = await trpc.posts.toggleLike.mutate({ postId });

    const post = posts.value.find((p) => p.id === postId);
    if (post) {
      post.isLikedByUser = result.liked;
      post.likesCount = result.likesCount;
    }
  } catch (err) {
    console.error("Failed to toggle like:", err);
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
