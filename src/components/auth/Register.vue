<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import type { RenderAuth } from 'src/ts/Auth';
import { createError } from 'src/composables/CreateNotify';
import TitleAuth from '../shared/TitleAuth.vue';
import { checkDataRegister } from 'src/composables/CheckData';

defineOptions({
  name: 'Register',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
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
});

const clear = (): void => {
  Object.assign(dataRegister, {
    name: '',
    email: '',
    nameEnterprise: '',
    password: '',
    confirmPassword: '',
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
    );
  } else {
    createError(check.message);
  }
};

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form class="form-auth rounded-borders bg-grey-3">
    <div class="row justify-center items-center q-pa-md">
      <q-img src="/images/logo.png" spinner-color="white" width="250px" />
    </div>
    <div class="q-px-md">
      <TitleAuth title="Faça seu cadastro" />
    </div>
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <q-input
        v-model="dataRegister.name"
        bg-color="white"
        label-color="black"
        filled
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
        filled
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
        filled
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
        filled
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
        filled
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
    <div class="q-pb-sm q-px-md row justify-end items-center q-gutter-x-sm">
      <q-btn
        color="black"
        label="Esqueceu senha"
        size="md"
        flat
        @click="emit('update:changeRender', 'reset')"
        no-caps
      />
      <q-btn
        @click="emit('update:changeRender', 'login')"
        color="black"
        label="Entrar"
        size="md"
        unelevated
        no-caps
        flat
      />
      <q-btn
        @click="register"
        color="red-6"
        label="Cadastrar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>
