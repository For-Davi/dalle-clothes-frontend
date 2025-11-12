<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch } from 'vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkEmail } from 'src/composables/CheckData';

defineOptions({
  name: 'InformEmail',
});

const props = defineProps<{
  data: {
    open: boolean;
    clientEmail: string | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'send-email': [string];
}>();

const email = ref<string>('');
const useEmailClient = ref<boolean>(false);

const startToSend = () => {
  const check = checkEmail(email.value)
  if (check.status) {
    open.value = false;
  emit('send-email', email.value);
  clear();
  } else {
    createErrorData(check.message || 'Erro ao enviar e-mail');
  }
};
const clear = () => {
  email.value = '';
  useEmailClient.value = false;
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => useEmailClient.value,
  () => {
    if (useEmailClient.value && props.data.clientEmail) {
      email.value = props.data.clientEmail;
    } else {
      email.value = '';
    }
  },
);
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 column justify-between" style="width: 350px">
      <q-card-section class="q-pa-none">
        <TitlePage title="Informe o email" icon="mail" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="email"
            bg-color="white"
            label-color="black"
            outlined
            label="Email"
            dense
            input-class="text-black"
            class="full-width"
            :readonly="useEmailClient"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-checkbox v-if="props.data.clientEmail !== null" label="Utilizar email do cliente" v-model="useEmailClient"/>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm q-ma-sm">
          <q-btn
            color="red"
            label="Fechar"
            @click="open = false"
            size="md"
            unelevated
            no-caps
            flat
          />
          <q-btn color="primary" label="Enviar" @click="startToSend" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
