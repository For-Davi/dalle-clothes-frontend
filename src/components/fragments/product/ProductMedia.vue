<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import MediaUpload from 'src/components/shared/MediaUpload.vue';
import TableProductMedia from 'src/components/table/TableProductMedia.vue';
import { ref } from 'vue';

defineOptions({
  name: 'ProductMedia',
});

const props = defineProps<{
  loading: boolean;
}>();

const listMedia = defineModel<IMediaItem[]>('listMedia', { required: true });
const list = ref<IMediaItem[]>([]);
const mediaUploadRef = ref<InstanceType<typeof MediaUpload>>();

const clearUploader = () => {
  mediaUploadRef.value?.clearFiles();
};
const addMediaInList = (e: File) => {
  list.value.push(e);
};
const pushMediaInList = () => {
  listMedia.value.push(...list.value);
  list.value = [];
  clearUploader();
};
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Galeria de imagens" icon="pin" />
    </q-card-section>
    <q-card-section class="q-pa-sm column q-gutter-y-sm" v-show="!props.loading">
      <div v-if="listMedia.length < 3">
        <MediaUpload
          ref="mediaUploadRef"
          label="Selecione as imagens (3MB max)"
          accept=".jpg, image/*"
          @file:add-image="addMediaInList"
        />
        <q-btn
          @click="pushMediaInList"
          :disable="list.length <= 0"
          v-if="list.length > 0"
          color="green-9"
          label="Adicionar selecionados"
          class="full-width"
          size="md"
          unelevated
          no-caps
        />
      </div>
      <TableProductMedia :loading="loading" v-model:listMedia="listMedia" />
    </q-card-section>
  </q-card>
</template>
