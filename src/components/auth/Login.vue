<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import { checkDataLogin } from 'src/composables/CheckData';
import TitleAuth from '../shared/TitleAuth.vue';
import SubTitleAuth from '../shared/SubTitleAuth.vue';

defineOptions({
  name: 'Login',
});

const emit = defineEmits<{
  'update:changeRender': [IRenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());

const route = useRoute();
const router = useRouter();

const isPwd = ref<boolean>(true);
const dataLogin = reactive({
  email: '' as string,
  password: '' as string,
});

const clear = (): void => {
  Object.assign(dataLogin, {
    email: '',
    password: '',
  });
};
const changeRender = (render: IRenderAuth): void => {
  emit('update:changeRender', render);
};
const login = async () => {
  const check = checkDataLogin(dataLogin);
  if (check.status) {
    await useAuthStore().doLogin(dataLogin.email, dataLogin.password);
  } else {
    Notify.create({
      message: check.message || 'Erro ao fazer login',
      type: 'negative',
    });
  }
};
const loginWithGoogle = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  window.location.href = `${baseUrl}/auth/google/redirect`;
};

watch(
  () => route.query,
  async (newQuery) => {
    const token = newQuery.token as string | undefined;
    const hasError = 'error' in newQuery;

    if (hasError) {
      Notify.create({
        message: 'Erro ao autenticar com o Google. Tente novamente.',
        type: 'negative',
      });

      await router.replace({ query: {} });
      return;
    }

    if (token) {
      try {
        await useAuthStore().doLogin(null, null, token);
      } finally {
        await router.replace({ query: {} });
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form class="form-auth rounded-borders bg-grey-3 q-pb-sm">
    <TitleAuth />
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <SubTitleAuth title="Login" />
      <q-input
        v-model="dataLogin.email"
        bg-color="white"
        label-color="black"
        outlined
        label="Digite seu e-mail"
        autocomplete="new-email"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="black" size="20px" />
        </template>
      </q-input>
      <div>
        <q-input
          v-model="dataLogin.password"
          bg-color="white"
          label-color="black"
          outlined
          label="Digite sua senha"
          autocomplete="new-password"
          dense
          input-class="text-black"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              @click="isPwd = !isPwd"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="20px"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="key" color="black" size="20px" />
          </template>
        </q-input>
        <div class="row justify-end items-center">
          <span
            @click="changeRender('reset')"
            class="q-mt-sm text-bold cursor-pointer hover color-default"
            >Esqueceu sua senha?</span
          >
        </div>
      </div>
    </div>
    <div class="q-pb-sm q-px-md column justify-end items-center">
      <q-btn
        @click="login"
        color="primary"
        label="Entrar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
        class="full-width"
      />
      <q-btn
        @click="loginWithGoogle"
        outline
        color="grey-8"
        label="Entrar com Google"
        icon="img:https://authjs.dev/img/providers/google.svg"
        no-caps
        class="full-width q-mt-sm"
      />
      <div class="row justify-end items-center">
        <span class="q-mt-sm q-mr-md">Não tem uma conta?</span>
        <span
          @click="changeRender('register')"
          class="q-mt-sm text-bold cursor-pointer hover color-default"
          ><u>Cadastrar-se</u></span
        >
      </div>
    </div>
  </q-form>
</template>
