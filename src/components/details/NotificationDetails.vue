<script setup lang="ts">
import { computed, watch } from 'vue'

defineOptions({
    name:'NotificationDetails'
})

const props = defineProps<{
    data: {
        open: boolean;
        notification: INotification;
    }
}>()
const emit = defineEmits<{
    'update:open': [void]
}>()

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open,() => {
    if(open.value === true) {
        console.log('read', props.data.notification.read = 1)
    }
})
</script>

<template>
    <q-dialog v-model="open">
        <q-card>
            <q-card-section>

            </q-card-section>
        </q-card>
    </q-dialog>
</template>