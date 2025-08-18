<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch } from 'vue';

defineOptions({
  name: 'ConfirmDateDifferentSchedule',
});

const props = defineProps<{
  open: boolean;
  title: string;
  message: string;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:dateDefault': [void];
  'update:dateChange': [void];
}>();

const check = ref<boolean>(false);

const confirmDateDefault = () => {
  emit('update:dateDefault');
};
const confirmDateChange = () => {
  emit('update:dateChange');
};
const close = () => {
  emit('update:open');
};
const clear = (): void => {
  check.value = false;
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
    <q-card class="bg-grey-2" style="min-width: 90vw">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.title" icon="warning" />
      </q-card-section>
      <q-card-section>
        <div class="column text-subtitle2">
          <span class="text-red q-px-sm">{{ props.message }}</span>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="close" color="black" flat label="Voltar" size="md" unelevated no-caps />
          <q-btn
            @click="confirmDateChange"
            color="grey"
            label="Data de mês atual"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            @click="confirmDateDefault"
            color="primary"
            label="Data do agendamento"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
