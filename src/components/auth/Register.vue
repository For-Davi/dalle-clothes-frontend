<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import { createError } from 'src/composables/CreateNotify';
import TitleAuth from '../shared/TitleAuth.vue';
import { checkDataRegister } from 'src/composables/CheckData';
import SubTitleAuth from '../shared/SubTitleAuth.vue';

defineOptions({
  name: 'Register',
});

const emit = defineEmits<{
  'update:changeRender': [IRenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());

const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const dataRegister = reactive({
  name: '' as string,
  email: '' as string,
  password: '' as string,
  confirmPassword: '' as string,
  nameEnterprise: '' as string,
  sellerCode: '' as string,
});

const clear = (): void => {
  Object.assign(dataRegister, {
    name: '',
    email: '',
    nameEnterprise: '',
    password: '',
    confirmPassword: '',
    sellerCode: '',
  });
};
const register = async () => {
  const check = checkDataRegister(dataRegister);
  if (check.status) {
    await useAuthStore().doRegister(
      dataRegister.name,
      dataRegister.email,
      dataRegister.password,
      dataRegister.nameEnterprise,
      dataRegister.sellerCode,
    );
  } else {
    createError(check.message);
  }
};

watch(
  () => dataRegister.sellerCode,
  (value: string) => {
    if (value !== null) {
      dataRegister.sellerCode = value.toUpperCase();
    }
  },
);

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form class="form-auth rounded-borders bg-grey-3 q-pb-sm">
    <TitleAuth />
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <SubTitleAuth title="Cadastro" />
      <q-input
        v-model="dataRegister.name"
        bg-color="white"
        label-color="black"
        outlined
        label="Nome de usuário"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="person" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.email"
        bg-color="white"
        label-color="black"
        outlined
        label="Seu e-mail"
        autocomplete="new-email"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.nameEnterprise"
        bg-color="white"
        label-color="black"
        outlined
        label="Nome de sua organização"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="corporate_fare" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.password"
        bg-color="white"
        label-color="black"
        outlined
        label="Sua senha"
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
      <q-input
        v-model="dataRegister.confirmPassword"
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
      <q-input
        v-model="dataRegister.sellerCode"
        bg-color="white"
        label-color="black"
        outlined
        label="Código do vendedor"
        dense
        input-class="text-black"
        maxlength="20"
      >
        <template v-slot:prepend>
          <q-icon name="badge" color="black" size="20px" />
        </template>
      </q-input>
    </div>
    <div class="q-py-sm q-px-md column justify-end items-center">
      <q-btn
        @click="register"
        color="primary"
        label="Cadastrar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
        class="full-width"
      />
      <div class="row justify-end items-center">
        <span class="q-mt-sm q-mr-md">Já tem uma conta?</span>
        <span
          @click="emit('update:changeRender', 'login')"
          class="q-mt-sm text-bold cursor-pointer hover color-default"
          ><u>Entrar</u></span
        >
      </div>
    </div>
  </q-form>
</template>
