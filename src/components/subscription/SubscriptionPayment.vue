<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import SubscriptionStepper from '../stepper/SubscriptionStepper.vue';

defineOptions({
  name: 'SubscriptionPayment',
});

const props = defineProps<{
  data: {
    open: boolean;
    subscriptionID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const close = () => {
  open.value = false;
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 sub-page column justify-between" style="width: 350px">
      <q-card-section class="q-pa-none">
        <TitlePage title="Pagamento da assinatura" icon="attach_money" />
      </q-card-section>
      <q-card-section>
        <SubscriptionStepper :subscriptionID="props.data.subscriptionID!" @update:open="close" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
