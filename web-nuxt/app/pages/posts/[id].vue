<template>
  <div>
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-64 w-full" />
    </div>

    <div v-else-if="error" class="py-12 text-center">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      <UButton class="mt-4" color="neutral" @click="navigateTo('/')">
        Back to Feed
      </UButton>
    </div>

    <div v-else-if="post">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <UAvatar
                :alt="post.author.username"
                :src="post.author.avatarUrl"
                size="md"
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

            <div v-if="canEdit" class="flex items-center space-x-2">
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
                :loading="deleting"
                @click="handleDelete"
              >
                Delete
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ post.title }}
          </h1>

          <img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            :alt="post.title"
            class="max-h-[600px] w-full rounded-lg object-cover"
          />

          <div class="prose dark:prose-invert max-w-none">
            <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {{ post.content }}
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <UButton
              :color="post.isLikedByUser ? 'primary' : 'gray'"
              variant="ghost"
              :disabled="!isAuthenticated"
              @click="toggleLike"
            >
              <template #leading>
                <span class="text-xl">{{
                  post.isLikedByUser ? "❤️" : "🤍"
                }}</span>
              </template>
              {{ post.likesCount }}
              {{ post.likesCount === 1 ? "Like" : "Likes" }}
            </UButton>

            <UButton color="neutral" variant="ghost" @click="navigateTo('/')">
              Back to Feed
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const route = useRoute();
const { user, isAuthenticated, isAdmin } = useAuth();
const trpc = useTrpc();

const post = ref<any>(null);
const loading = ref(true);
const deleting = ref(false);
const error = ref("");

const canEdit = computed(() => {
  if (!user.value || !post.value) return false;
  return user.value.id === post.value.userId || isAdmin.value;
});

const fetchPost = async () => {
  try {
    loading.value = true;
    post.value = await trpc.posts.getById.query({
      id: route.params.id as string,
    });
  } catch (err: any) {
    error.value = err.message || "Failed to load post";
  } finally {
    loading.value = false;
  }
};

const toggleLike = async () => {
  if (!isAuthenticated.value || !post.value) return;

  try {
    const result = await trpc.posts.toggleLike.mutate({
      postId: post.value.id,
    });
    post.value.isLikedByUser = result.liked;
    post.value.likesCount = result.likesCount;
  } catch (err) {
    console.error("Failed to toggle like:", err);
  }
};

const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    deleting.value = true;
    await trpc.posts.delete.mutate({ id: post.value.id });
    navigateTo("/");
  } catch (err: any) {
    error.value = err.message || "Failed to delete post";
  } finally {
    deleting.value = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchPost();
});
</script>
