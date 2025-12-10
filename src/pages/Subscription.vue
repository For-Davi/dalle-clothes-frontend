<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { computed, onMounted, reactive } from 'vue';
import SubscriptionPayment from 'src/components/subscription/SubscriptionPayment.vue';

defineOptions({
  name: 'Subscription',
});

const { listSubscription } = storeToRefs(useSubscriptionStore());

const showSubscriptionPayment = reactive<{
  open: boolean;
  subscriptionID: number | null;
}>({
  open: false,
  subscriptionID: null,
});
const changeShowSubscriptionPayment = (show: boolean, subscriptionID: number | null = null) => {
  Object.assign(showSubscriptionPayment, {
    open: show,
    subscriptionID: subscriptionID,
  });
};

const getSubscriptions = async () => {
  await useSubscriptionStore().getSubscriptions();
};

const basicSubscriptionId = computed(() => {
  const basic = listSubscription.value.find((basic) => basic.name === 'basic');
  return basic ? basic.id : null;
});
const premiumSubscriptionId = computed(() => {
  const premium = listSubscription.value.find((premium) => premium.name === 'premium');
  return premium ? premium.id : null;
});

onMounted(async () => {
  await getSubscriptions();
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Assinatura" icon="credit_card" />
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm"> teste </q-banner>
      <div class="q-mt-md row justify-center q-gutter-x-lg">
        <q-card class="col-5 bg-grey-1">
          <q-card-section>
            <div class="text-h6">Básico</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list dense padding>
              <q-item>
                <q-item-section> Item </q-item-section>
              </q-item>

              <q-item>
                <q-item-section> Item </q-item-section>
              </q-item>

              <q-item>
                <q-item-section> Item </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              icon-right="paid"
              label="VAMOS INICIAR NO BÁSICO"
              color="green"
              unelevated
              class="full-width"
              @click="changeShowSubscriptionPayment(true, basicSubscriptionId)"
            />
            <q-btn
              icon-right="verified"
              label="QUERO EXPERIMENTAR POR 3 DIAS"
              color="green"
              unelevated
              class="full-width q-mt-sm"
              outline
            />
          </q-card-actions>
        </q-card>
        <q-card class="col-5 bg-grey-1">
          <q-card-section>
            <div class="text-h6">Profissional</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list dense padding>
              <q-item>
                <q-item-section> Item </q-item-section>
              </q-item>

              <q-item>
                <q-item-section> Item </q-item-section>
              </q-item>

              <q-item>
                <q-item-section> Item </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn
              icon-right="paid"
              label="QUERO TODAS AS VANTAGENS"
              color="blue"
              unelevated
              class="full-width"
              @click="changeShowSubscriptionPayment(true, premiumSubscriptionId)"
            />
            <q-btn
              icon-right="verified"
              label="QUERO EXPERIMENTAR POR 3 DIAS"
              color="blue"
              unelevated
              class="full-width q-mt-sm"
              outline
            />
          </q-card-actions>
        </q-card>
      </div>
    </section>
    <!-- Modals -->
    <SubscriptionPayment
      :data="showSubscriptionPayment"
      @update:open="changeShowSubscriptionPayment(false)"
    />
  </main>
</template>
