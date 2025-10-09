<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch } from 'vue';

defineOptions({
  name: 'ConfirmAction',
});

const props = defineProps<{
  open: boolean;
  title: string;
  labelAction: string;
  message: string;
  checkShow?: boolean;
  checkLabel?: string;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:ok': [number];
}>();

const check = ref(0);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const confirm = () => {
  emit('update:ok', check.value);
};
const close = () => {
  emit('update:open');
};
const clear = (): void => {
  check.value = 0;
};

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
          <q-checkbox
            v-if="props.checkShow"
            v-model="check"
            size="md"
            :true-value="1"
            :false-value="0"
            :label="props.checkLabel || ''"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="close" color="black" flat label="Voltar" size="md" unelevated no-caps />
          <q-btn
            @click="confirm"
            color="red"
            :label="props.labelAction"
            size="md"
            unelevated
            no-caps
            :disable="
              props.title === 'Confirmação de agendamento' ||
              props.title === 'Confirmação de movimentação'
                ? !check
                : false
            "
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
