<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { computed, onMounted, reactive } from 'vue';
import SubscriptionPayment from 'src/components/subscription/SubscriptionPayment.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { date } from 'quasar';

defineOptions({
  name: 'Subscription',
});

const { listSubscription } = storeToRefs(useSubscriptionStore());
const { user } = storeToRefs(useAuthStore());

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
const showActionPayment = computed(() => {
  return user.value?.role?.permissions?.some((p) => p.slug === 'subscription.payment') ?? false;
});

const hasTestFree = computed(() => user.value?.enterprise?.allow_test_free === 1);

const subscriptionLabel = computed(() => {
  const name = user.value?.enterprise?.subscription?.name;
  const map: Record<string, string> = {
    free: 'Plano Gratuito',
    basic: 'Plano Básico',
    premium: 'Plano Premium',
  };
  return map[name ?? ''] ?? 'Plano Gratuito';
});

const currentPlanName = computed(() => user.value?.enterprise?.subscription?.name ?? 'free');

const expiredDateFormatted = computed(() => {
  const expired = user.value?.enterprise?.expired_date;
  if (!expired || currentPlanName.value === 'free') return null;
  return date.formatDate(expired, 'DD/MM/YYYY');
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
      <!-- Banner período gratuito -->
      <q-banner
        v-if="hasTestFree"
        rounded
        class="bg-teal-1 text-teal-9 q-mb-sm"
        style="border: 1px solid #80cbc4"
      >
        <template #avatar>
          <q-icon name="card_giftcard" color="teal" size="md" />
        </template>
        <div class="text-subtitle1 text-weight-bold">
          🎉 Você tem um período gratuito disponível!
        </div>
        <div class="text-body2 q-mt-xs">
          Experimente qualquer plano por <strong>7 dias sem custo</strong> e descubra tudo o que o
          sistema pode fazer pela sua empresa. Aproveite essa oportunidade para explorar os recursos
          premium antes de decidir.
        </div>
      </q-banner>

      <!-- Banner plano atual -->
      <q-banner rounded class="bg-blue-1 text-blue-9 q-mb-sm" style="border: 1px solid #90caf9">
        <template #avatar>
          <q-icon name="workspace_premium" color="blue" size="md" />
        </template>
        <span class="text-subtitle2">
          Plano atual: <strong>{{ subscriptionLabel }}</strong>
          <span v-if="expiredDateFormatted">
            &mdash; válido até <strong>{{ expiredDateFormatted }}</strong>
          </span>
        </span>
      </q-banner>

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
          <q-card-actions align="right" v-if="showActionPayment">
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
          <q-card-actions v-if="showActionPayment">
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
