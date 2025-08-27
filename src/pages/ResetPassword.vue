<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import SubTitleAuth from 'src/components/shared/SubTitleAuth.vue';
import TitleAuth from 'src/components/shared/TitleAuth.vue';
import router from 'src/router';
import { createError } from 'src/composables/CreateNotify';
import { checkDataPassword } from 'src/composables/CheckData';

defineOptions({
  name: 'ResetPassword',
});

const props = defineProps<{
  token: string;
}>();

const { loadingAuth } = storeToRefs(useAuthStore());

const isPwd1 = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const dataLogin = reactive({
  newPassword: '' as string,
  confirmPassword: '' as string,
});

const clear = (): void => {
  Object.assign(dataLogin, {
    newPassword: '',
    confirmPassword: '',
  });
  isPwd1.value = true;
  isPwd2.value = true;
};
const goLogin = async (): Promise<void> => {
  await router.push({ name: 'auth' });
};
const save = async () => {
  const check = checkDataPassword(dataLogin);
  if (check.status) {
    await useAuthStore().setNewPassword(dataLogin.newPassword, props.token);
  } else {
    createError(check.message);
  }
};

onMounted(() => {
  clear();
});
</script>

<template>
  <section class="container-view row justify-center items-center background-auth">
    <q-form class="form-auth rounded-borders bg-grey-3 q-pb-sm">
      <TitleAuth />
      <div class="q-pb-sm q-px-md q-gutter-y-sm">
        <SubTitleAuth title="Nova senha" />
        <div class="q-gutter-y-sm">
          <q-input
            v-model="dataLogin.newPassword"
            bg-color="white"
            label-color="black"
            outlined
            label="Nova senha"
            autocomplete="new-password"
            dense
            input-class="text-black"
            :type="isPwd1 ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                @click="isPwd1 = !isPwd1"
                :name="isPwd1 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="key" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataLogin.confirmPassword"
            bg-color="white"
            label-color="black"
            outlined
            label="Confirme sua senha"
            autocomplete="new-password"
            dense
            input-class="text-black"
            :type="isPwd2 ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                @click="isPwd2 = !isPwd2"
                :name="isPwd2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="key" color="black" size="20px" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="q-pb-sm q-px-md column justify-end items-center">
        <q-btn
          @click="save"
          color="primary"
          label="Salvar"
          size="md"
          :loading="loadingAuth"
          unelevated
          no-caps
          class="full-width"
        />
        <div class="row justify-end items-center">
          <span class="q-mt-sm q-mr-md">Já tem uma conta?</span>
          <span @click="goLogin" class="q-mt-sm text-bold cursor-pointer hover color-default"
            ><u>Entrar</u></span
          >
        </div>
      </div>
    </q-form>
  </section>
</template>
