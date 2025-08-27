<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import TitleAuth from '../shared/TitleAuth.vue';
import { checkDataReset } from 'src/composables/CheckData';
import { createSuccess } from 'src/composables/CreateNotify';
import SubTitleAuth from '../shared/SubTitleAuth.vue';

defineOptions({
  name: 'ResetPassword',
});

const emit = defineEmits<{
  'update:changeRender': [IRenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());

const dataReset = reactive({
  email: '' as string,
  code: '' as string,
  password: '' as string,
  passwordConfirm: '' as string,
});

const clear = (): void => {
  Object.assign(dataReset, {
    email: '',
    code: '',
    password: '',
    passwordConfirm: '',
  });
};
const changeRender = (render: IRenderAuth): void => {
  emit('update:changeRender', render);
};
const sendEmailReset = async () => {
  const verifyData = checkDataReset(dataReset);
  if (!verifyData.status) {
    createSuccess(verifyData.message || 'Erro ao mandar e-mail');
  } else {
    const response = await useAuthStore().doReset(dataReset.email);
    if (response?.status === 200) {
      changeRender('login');
    }
  }
};

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form class="form-auth rounded-borders bg-grey-3 q-pb-sm">
    <TitleAuth />
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <SubTitleAuth title="Reset" />
      <q-input
        v-model="dataReset.email"
        bg-color="white"
        label-color="black"
        outlined
        label="Digite seu e-mail"
        dense
        input-class="text-black"
        autocomplete="new-email"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="black" size="20px" />
        </template>
      </q-input>
    </div>
    <div class="q-py-sm q-px-md column justify-end items-center">
      <q-btn
        @click="sendEmailReset"
        color="primary"
        label="Enviar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
        class="full-width"
      />
      <div class="row justify-end items-center q-gutter-x-sm">
        <span
          @click="changeRender('login')"
          class="q-mt-sm text-bold cursor-pointer hover color-default"
          ><u>Entrar na conta</u></span
        >
        <span class="q-mt-sm">ou</span>
        <span
          @click="changeRender('register')"
          class="q-mt-sm text-bold cursor-pointer hover color-default"
          ><u>Cadastrar-se</u></span
        >
      </div>
    </div>
  </q-form>
</template>
