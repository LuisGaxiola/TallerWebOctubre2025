<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create New Post
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Share your thoughts with the community
      </p>
    </div>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Title" name="title" required>
          <UInput
            v-model="form.title"
            type="text"
            placeholder="Enter post title"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField label="Content" name="content" required>
          <UTextarea
            v-model="form.content"
            placeholder="Write your post content..."
            :rows="10"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField label="Image URL (optional)" name="imageUrl">
          <UInput
            v-model="form.imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="w-full"
          />
        </UFormField>

        <div class="flex items-center space-x-2">
          <UCheckbox v-model="form.isPublished" label="Publish immediately" />
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
            @click="navigateTo('/')"
          >
            Cancel
          </UButton>
          <UButton type="submit" color="primary" :loading="loading">
            Create Post
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

const trpc = useTrpc();

const form = reactive({
  title: "",
  content: "",
  imageUrl: "",
  isPublished: true,
});

const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    const post = await trpc.posts.create.mutate({
      title: form.title,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      isPublished: form.isPublished,
    });

    navigateTo(`/posts/${post.id}`);
  } catch (err: any) {
    error.value = err.message || "Failed to create post";
  } finally {
    loading.value = false;
  }
};
</script>
