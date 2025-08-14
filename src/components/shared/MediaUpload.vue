<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { QUploader } from 'quasar';
import { createErrorData } from 'src/composables/CreateNotify';
import { ref } from 'vue';
defineOptions({
  name: 'MediaUpload',
});

const props = withDefaults(
  defineProps<{
    label: string;
    accept: string;
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
  }>(),
  {
    multiple: true,
    maxFiles: 3,
    maxFileSize: 3 * 1024 * 1024, // 3 MB
  },
);
const emit = defineEmits<{
  'file:addImage': [File];
  clearImages: [void];
}>();

const uploaderRef = ref<InstanceType<typeof QUploader>>();

const clearFiles = () => {
  uploaderRef.value?.removeQueuedFiles();
};
const onAddedFiles = (files: readonly File[]): void => {
  files.forEach((file) => emit('file:addImage', file));
};
const onRejected = (): void => {
  createErrorData('Arquivo selecionado não passou nas regras');
};
const removeFileWithEmit = (scope: any, file: File) => {
  scope.removeFile(file);
  emit('clearImages');
};

defineExpose({
  clearFiles,
  uploaderRef,
});
</script>

<template>
  <q-uploader
    ref="uploaderRef"
    @added="onAddedFiles"
    :multiple="props.multiple"
    hide-upload-btn
    class="full-width"
    flat
    :accept="props.accept"
    :max-files="props.maxFiles"
    :max-file-size="props.maxFileSize"
    style="max-height: 400px"
    @rejected="onRejected"
  >
    <template v-slot:header="scope">
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <q-btn
          v-if="scope.queuedFiles.length > 0"
          icon="clear_all"
          @click="scope.removeQueuedFiles"
          round
          dense
          flat
        >
          <q-tooltip>Limpar</q-tooltip>
        </q-btn>
        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
        <div class="col">
          <div class="q-uploader__title">{{ props.label }}</div>
          <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }}</div>
        </div>
        <q-btn
          v-if="scope.canAddFiles"
          type="a"
          icon="add_box"
          @click="scope.pickFiles"
          round
          dense
          flat
        >
          <q-uploader-add-trigger />
          <q-tooltip>Adicionar</q-tooltip>
        </q-btn>
      </div>
    </template>
    <template v-slot:list="scope">
      <q-list separator>
        <q-item v-for="file in scope.files" :key="file.__key">
          <q-item-section>
            <q-item-label class="full-width ellipsis">
              {{ file.name }}
            </q-item-label>
            <q-item-label caption>
              {{ file.__sizeLabel }}
            </q-item-label>
          </q-item-section>

          <q-item-section v-if="file.__img" thumbnail class="gt-xs">
            <img :src="file.__img.src" />
          </q-item-section>

          <q-item-section side>
            <q-btn
              class="gt-xs"
              size="12px"
              flat
              dense
              color="red"
              round
              icon="delete"
              @click="removeFileWithEmit(scope, file)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-uploader>
</template>
