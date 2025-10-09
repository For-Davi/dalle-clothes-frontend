<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import PaymentStepper from 'src/components/stepper/PaymentStepper.vue';

defineOptions({
  name: 'Payment',
});
</script>
<template>
  <main class="q-pa-lg">
    <section>
      <TitlePage title="Caixa" icon="point_of_sale" />
    </section>
    <PaymentStepper />
  </main>
</template>
