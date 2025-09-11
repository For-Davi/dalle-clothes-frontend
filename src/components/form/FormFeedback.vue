<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import MediaUpload from '../shared/MediaUpload.vue';
import { checkFeedbackData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { storeToRefs } from 'pinia';
import { useFeedbackStore } from 'src/stores/feedback-store';
import Loading from '../shared/Loading.vue';
import imageCompression from 'browser-image-compression';


defineOptions({
  name: 'FormFeedback',
});

const dataFeedback = reactive({
  text: '' as string,
  images: [] as File[],
});

const emit = defineEmits<{
  'update:open': [void];
}>();

const props = defineProps<{
  open: boolean;
}>();

const { loadingFeedback } = storeToRefs(useFeedbackStore());

const addMediaInList = async (file: File) => {
  if (dataFeedback.images.length >= 1) return;
  try {
    const options = {
      maxSizeMB: 3,              
      maxWidthOrHeight: 1920,    
      useWebWorker: true,   
    };
    const compressedFile = await imageCompression(file, options);
    dataFeedback.images = [compressedFile];
  } catch (error) {
    createErrorData('Erro ao processar a imagem.');
    console.log('Erro ao fazer a compressão', error)
  }
};
const clear = (): void => {
  dataFeedback.text = '';
  dataFeedback.images = [];
};
const clearImages = (): void => {
  dataFeedback.images = [];
};

const save = async () => {
  const check = checkFeedbackData(dataFeedback);
  if (check.status) {
    const response = await useFeedbackStore().createFeedback(
      dataFeedback.text,
      dataFeedback.images,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar sugestão');
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Envie sua sugestão" icon="feedback" />
      </q-card-section>
      <Loading :show="loadingFeedback" />
      <q-card-section class="q-pa-sm">
        <div v-show="!loadingFeedback">
          <q-input
            v-model="dataFeedback.text"
            bg-color="white"
            label-color="black"
            outlined
            label="Envie sua sugestão"
            maxlength="10000"
            counter
            input-class="text-black no-resize"
            type="textarea"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
          <MediaUpload
            ref="mediaUploadRef"
            v-model="dataFeedback.images"
            label="Adicione as imagens (5MB max)"
            :multiple="false"
            accept=".jpg, image/*"
            @file:add-image="addMediaInList"
            @clear-images="clearImages"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Fechar" @click="open = false" size="md" flat no-caps />
        <q-btn color="primary" label="Enviar" size="md" @click="save" unelevated no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
