<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'Exports',
});

const props = defineProps<{
  open: boolean;
  title: string;
  message: string;
  allowExcel: boolean;
  allowPdf: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'choose-format': ['excel' | 'pdf'];
}>();

const chooseFormat = (format: 'excel' | 'pdf'): void => {
  emit('choose-format', format);
  emit('update:open');
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between" style="min-height: min-content">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.title" icon="file_copy" />
      </q-card-section>
      <q-card-section>
        <div>
          <span class="text-red q-px-sm text-body1 text-bold"
            >{{ props.message }}</span
          >
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
          <q-btn
          v-show="props.allowExcel"
            color="green-7"
            label="Excel"
            @click="chooseFormat('excel')"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
          v-show="props.allowPdf"
            color="red-8"
            label="PDF"
            @click="chooseFormat('pdf')"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
