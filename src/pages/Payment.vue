<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import PaymentStepper from 'src/components/stepper/PaymentStepper.vue';
import { storeToRefs } from 'pinia';
import SubscriptionBanner from 'src/components/banner/SubscriptionBanner.vue';
import { checkRegisterLimit } from 'src/composables/Plans';
import { useSaleStore } from 'src/stores/sale-store';
import { computed } from 'vue';

defineOptions({
  name: 'Payment',
});

const { listSale } = storeToRefs(useSaleStore());

const planValidation = computed(() => {
  return checkRegisterLimit('sales', listSale.value.length);
});
</script>
<template>
  <main class="q-pa-lg">
    <section>
      <TitlePage title="Caixa" icon="point_of_sale" />
    </section>
    <SubscriptionBanner v-if="planValidation.showUpgradeBanner" resource-name="vendas" />
    <PaymentStepper />
  </main>
</template>
