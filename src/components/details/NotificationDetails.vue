<script setup lang="ts">
import { computed, watch } from 'vue';
import { useNotificationStore } from 'src/stores/notification-store';

defineOptions({
  name: 'NotificationDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    notification: INotification | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value === true && props.data.notification) {
    await useNotificationStore().updateRead(props.data.notification.id);
  }
});
</script>

<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card>
      <q-card-section class="q-pa-md">
        <span class="text-h5 text-bold">{{ props.data.notification?.title }}</span>
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <span>
          {{ props.data.notification?.message }}
        </span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="open = false" label="Fechar" no-caps color="red" unelevated size="md" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
