<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Edit Post
      </h1>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-64 w-full" />
    </div>

    <UCard v-else-if="post">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Title" name="title" required>
          <UInput
            v-model="form.title"
            type="text"
            placeholder="Enter post title"
            required
          />
        </UFormField>

        <UFormField label="Content" name="content" required>
          <UTextarea
            v-model="form.content"
            placeholder="Write your post content..."
            :rows="10"
            required
          />
        </UFormField>

        <UFormField label="Image URL (optional)" name="imageUrl">
          <UInput
            v-model="form.imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
          />
        </UFormField>

        <div class="flex items-center space-x-2">
          <UCheckbox v-model="form.isPublished" label="Published" />
        </div>

        <UAlert
          v-if="error"
          color="warning"
          variant="soft"
          :title="error"
          :close-button="{ color: 'red', variant: 'link' }"
          @close="error = ''"
        />

        <div class="flex items-center justify-end space-x-4">
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            @click="navigateTo(`/posts/${post.id}`)"
          >
            Cancel
          </UButton>
          <UButton type="submit" color="primary" :loading="saving">
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

const route = useRoute();
const { user, isAdmin } = useAuth();
const trpc = useTrpc();

const post = ref<any>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");

const form = reactive({
  title: "",
  content: "",
  imageUrl: "",
  isPublished: true,
});

const fetchPost = async () => {
  try {
    loading.value = true;
    post.value = await trpc.posts.getById.query({
      id: route.params.id as string,
    });

    // Check permissions
    if (post.value.userId !== user.value?.id && !isAdmin.value) {
      error.value = "You do not have permission to edit this post";
      return;
    }

    // Populate form
    form.title = post.value.title;
    form.content = post.value.content;
    form.imageUrl = post.value.imageUrl || "";
    form.isPublished = post.value.isPublished;
  } catch (err: any) {
    error.value = err.message || "Failed to load post";
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  saving.value = true;
  error.value = "";

  try {
    await trpc.posts.update.mutate({
      id: route.params.id as string,
      title: form.title,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      isPublished: form.isPublished,
    });

    navigateTo(`/posts/${route.params.id}`);
  } catch (err: any) {
    error.value = err.message || "Failed to update post";
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchPost();
});
</script>
