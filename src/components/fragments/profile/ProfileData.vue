<script setup lang="ts">
import { reactive, watch } from 'vue'
import { checkDataUpdateProfile } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useAuthStore } from 'src/stores/auth-store';

const emit = defineEmits<({
  'updateForData:mode': [void];
  'updateForPassword:mode': [void];
  'update:open': [void];
})>()

const props = defineProps<{
  type: 'data' | 'password',
}>()

const dataProfile = reactive({
  name: '' as string,
  email: '' as string
})

const mountData =  () => {
  const user = useAuthStore().user

  if(user) {
    dataProfile.name = user.name
    dataProfile.email = user.email
  }
}

const update = async () => {
  const check = checkDataUpdateProfile(dataProfile)
  if (check.status) {
    await useAuthStore().updateUserData(dataProfile.name, dataProfile.email)
  } else {
    createErrorData(check.message || 'Erro ao fazer atualização')
  }
}

watch(
  () => props.type,
   (type) => {
    if (type === 'data') {
       mountData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="q-gutter-y-sm">
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
          @click="emit('updateForPassword:mode')"
          size="md"
          unelevated
          no-caps
        />
        <q-btn
          color="primary"
          label="Salvar"
          @click="update"
          size="md"
          unelevated
          no-caps
        />
      </div>
    </div>
  </section>
</template>
