<script setup lang="ts">
import { computed } from 'vue'
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'Inbox',
});

const props = defineProps<{
  open: boolean;
}>()
const emit = defineEmits<{
  'update:open': [void]
}>()

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-drawer
  v-model="open"
  side="right"
  class="bg-grey-2"
  overlay
  :width="500"
  >
  <div class="q-ma-sm">
    <TitlePage
  title="Notificações"
  icon="notifications"
  />
  </div>
  </q-drawer>
</template>
