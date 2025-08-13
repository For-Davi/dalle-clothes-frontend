<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';

defineOptions({
  name: 'Description',
});

const props = defineProps<{
  data: {
    open: boolean;
    description: string | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 column justify-between" style="width: 600px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Descrição" icon="fa-solid fa-file-lines" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-banner dense class="bg-grey-3 q-px-md" rounded>
          <p>{{ props.data.description ?? '' }}</p>
        </q-banner>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
