<script setup lang="ts">
import { reactive, ref } from 'vue';
import { checkPasswordUpdateProfile } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  'updateMode': ['data'];
  'update:open': [void];
}>();

const dataPassword = reactive({
  actualPassword: '' as string,
  newPassword: '' as string,
  confirmNewPassword: '' as string,
});

const isPwd = ref<boolean>(false);
const isPwd2 = ref<boolean>(false);
const isPwd3 = ref<boolean>(false);

const { loadingAuth } = storeToRefs(useAuthStore());

const update = async () => {
  const check = checkPasswordUpdateProfile(dataPassword);
  if (check.status) {
    const response = await useAuthStore().updateUserPassword(
      dataPassword.actualPassword,
      dataPassword.newPassword,
    );

    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao fazer atualizar senha');
  }
};
</script>

<template>
  <section class="q-gutter-y-sm">
    <q-input
      label="Digite a senha atual"
      :type="isPwd ? 'text' : 'password'"
      v-model="dataPassword.actualPassword"
      class="bg-white"
      label-color="black"
      outlined
      dense
    >
      <template v-slot:prepend>
        <q-icon color="black" name="lock" />
      </template>
      <template v-slot:append>
        <q-icon @click="isPwd = !isPwd" :name="isPwd ? 'visibility' : 'visibility_off'" />
      </template>
    </q-input>
    <q-input
      label="Digite a nova senha"
      :type="isPwd2 ? 'text' : 'password'"
      v-model="dataPassword.newPassword"
      class="bg-white"
      label-color="black"
      outlined
      :readonly="dataPassword.actualPassword.length === 0"
      dense
    >
      <template v-slot:prepend>
        <q-icon color="black" name="lock" />
      </template>
      <template v-slot:append>
        <q-icon @click="isPwd2 = !isPwd2" :name="isPwd2 ? 'visibility' : 'visibility_off'" />
      </template>
    </q-input>
    <q-input
      label="Confirme a nova senha"
      :type="isPwd3 ? 'text' : 'password'"
      v-model="dataPassword.confirmNewPassword"
      class="bg-white"
      label-color="black"
      outlined
      :readonly="dataPassword.actualPassword.length === 0"
      dense
    >
      <template v-slot:prepend>
        <q-icon color="black" name="lock" />
      </template>
      <template v-slot:append>
        <q-icon @click="isPwd3 = !isPwd3" :name="isPwd3 ? 'visibility' : 'visibility_off'" />
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
          label="Alterar dados"
          @click="emit('updateMode', 'data')"
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
