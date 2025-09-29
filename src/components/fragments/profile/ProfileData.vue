<script setup lang="ts">
import { reactive, watch, ref, computed } from 'vue';
import { checkDataUpdateProfile } from 'src/composables/CheckData';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import imageCompression from 'browser-image-compression';
import { createErrorData } from 'src/composables/CreateNotify';

const emit = defineEmits<{
  updateMode: ['password'];
  'update:open': [void];
}>();

const props = defineProps<{
  type: 'data' | 'password';
}>();

const { user, loadingAuth } = storeToRefs(useAuthStore());

const dataProfile = reactive({
  name: '' as string,
  email: '' as string,
  photoAdd: null as File | null,
  photoDelete: null as number | null,
});
const showMediaUpload = ref<boolean>(false);
const localImage = ref<IImage | null>(user.value?.image ?? null);

const addMediaInList = async (file: File) => {
  try {
    const options = {
      maxSizeMB: 3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    dataProfile.photoAdd = compressedFile;
  } catch (error) {
    createErrorData('Erro ao processar a imagem.');
    console.log('Erro ao fazer a compressão', error);
  }
};
const clearImages = (): void => {
  dataProfile.photoAdd = null;
};

const mountData = () => {
  dataProfile.name = user.value?.name ?? '';
  dataProfile.email = user.value?.email ?? '';
  localImage.value = user.value?.image ?? null;
};

const update = async () => {
  const check = checkDataUpdateProfile(dataProfile);
  if (check.status) {
    const response = await useAuthStore().updateUserData(
      dataProfile.name,
      dataProfile.email,
      dataProfile.photoAdd,
      dataProfile.photoDelete,
    );

    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao fazer atualização');
  }
};
const getImageUrl = (file: File | ICustomFile | IImage | null | undefined): string => {
  if (!file) {
    return '/icons/image-empty.png';
  }

  if ('url' in file && file.url) {
    return file.url;
  }

  if (file instanceof File) {
    return URL.createObjectURL(file);
  }

  if ('img' in file && file.img) {
    return file.img;
  }

  return '/icons/image-empty.png';
};
const handleAvatarClick = () => {
  if (dataProfile.photoAdd) return;

  if (localImage.value) {
    dataProfile.photoDelete = localImage.value.id;
    localImage.value = null;
  } else {
    showMediaUpload.value = true;
  }
};

const getStyleTooltip = computed(() => {
  if (localImage.value || dataProfile.photoAdd) {
    return 'text-red bg-grey-2 text-subtitle2';
  } else {
    return 'text-green bg-grey-2 text-subtitle2';
  }
});

watch(
  () => props.type,
  (type) => {
    if (type === 'data') {
      clearImages();
      mountData();
    }
  },
  { immediate: true },
);
watch(user, (newUser) => {
  localImage.value = newUser?.image ?? null;
});
</script>

<template>
  <section class="q-gutter-y-sm">
    <div class="flex justify-center">
      <q-avatar
        color="grey-4"
        size="200px"
        class="hover avatar-img cursor-pointer"
        @click="handleAvatarClick"
      >
        <img
          :src="getImageUrl(dataProfile.photoAdd || localImage)"
          :class="
            getImageUrl(dataProfile.photoAdd || localImage) === '/icons/image-empty.png'
              ? 'avatar-placeholder'
              : ''
          "
          draggable="false"
        />
        <q-file
          v-model="dataProfile.photoAdd"
          hide-input
          accept="image/*"
          :multiple="false"
          @change="addMediaInList"
          class="transparent-file"
        />
        <q-tooltip :class="getStyleTooltip">
          {{ dataProfile.photoAdd || localImage ? 'Remover foto' : 'Adicionar foto' }}
        </q-tooltip>
      </q-avatar>
    </div>
    <q-input
      label="Nome do usuário"
      v-model="dataProfile.name"
      class="bg-white"
      label-color="black"
      outlined
      dense
    >
      <template v-slot:prepend>
        <q-icon color="black" name="person" />
      </template>
    </q-input>

    <q-input
      label="Email do usuário"
      v-model="dataProfile.email"
      class="bg-white"
      label-color="black"
      outlined
      dense
    >
      <template v-slot:prepend>
        <q-icon color="black" name="mail" />
      </template>
    </q-input>
    <div align="right">
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn
          color="red"
          label="Fechar"
          @click="emit('update:open')"
          size="md"
          flat
          unelevated
          no-caps
        />
        <q-btn
          color="grey-8"
          label="Alterar senha"
          @click="emit('updateMode', 'password')"
          size="md"
          unelevated
          no-caps
        />
        <q-btn
          color="primary"
          label="Salvar"
          @click="update"
          :loading="loadingAuth"
          size="md"
          unelevated
          no-caps
        />
      </div>
    </div>
  </section>
</template>
