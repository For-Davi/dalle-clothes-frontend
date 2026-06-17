<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { computed, reactive } from 'vue';
import SubscriptionPayment from 'src/components/subscription/SubscriptionPayment.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { date } from 'quasar';

const { listSubscription } = storeToRefs(useSubscriptionStore());
const { user } = storeToRefs(useAuthStore());

const plansConfig = {
  basic: {
    title: 'Plano Básico',
    color: 'green-7',
    isBest: false,
    features: [
      { label: 'Clientes', val: '10' },
      { label: 'Usuários / Funcionários', val: '5 / 10' },
      { label: 'Fornecedores', val: '10' },
      { label: 'Departamentos', val: '10' },
      { label: 'Cargos (Roles)', val: '5' },
      { label: 'Produtos', val: '100' },
      { label: 'Grade de Produtos', val: '2' },
      { label: 'Cores / Tags', val: '10 / 10' },
      { label: 'Agendamentos', val: '20' },
      { label: 'Vendas', val: 'Ilimitado' },
      { label: 'Receitas', val: 'Ilimitado' },
      { label: 'Pedidos de Fornecedor', val: 'Bloqueado' },
    ],
  },
  premium: {
    title: 'Plano Profissional',
    color: 'indigo-8',
    isBest: true,
    features: [
      { label: 'Clientes', val: 'Ilimitado' },
      { label: 'Usuários / Funcionários', val: 'Ilimitado' },
      { label: 'Fornecedores', val: 'Ilimitado' },
      { label: 'Departamentos', val: 'Ilimitado' },
      { label: 'Cargos (Roles)', val: 'Ilimitado' },
      { label: 'Produtos', val: '10.000' },
      { label: 'Grade de Produtos', val: 'Ilimitado' },
      { label: 'Cores / Tags', val: 'Ilimitado' },
      { label: 'Agendamentos', val: 'Ilimitado' },
      { label: 'Vendas', val: 'Ilimitado' },
      { label: 'Receitas', val: 'Ilimitado' },
      { label: 'Pedidos de Fornecedor', val: 'Ilimitado' },
    ],
  },
};

const showSubscriptionPayment = reactive<{ open: boolean; subscriptionID: number | null }>({
  open: false,
  subscriptionID: null,
});
const changeShowSubscriptionPayment = (show: boolean, id: number | null = null) => {
  showSubscriptionPayment.open = show;
  showSubscriptionPayment.subscriptionID = id;
};

const basicSubscriptionId = computed(
  () => listSubscription.value.find((s) => s.name === 'basic')?.id || null,
);
const premiumSubscriptionId = computed(
  () => listSubscription.value.find((s) => s.name === 'premium')?.id || null,
);
const showActionPayment = computed(
  () => user.value?.role?.permissions?.some((p) => p.slug === 'subscription.payment') ?? false,
);
const hasTestFree = computed(() => user.value?.enterprise?.allow_test_free === 1);
const subscriptionLabel = computed(() =>
  user.value?.enterprise?.subscription?.name === 'premium' ? 'Premium' : 'Básico',
);
const expiredDateFormatted = computed(() =>
  user.value?.enterprise?.expired_date
    ? date.formatDate(user.value?.enterprise?.expired_date, 'DD/MM/YYYY')
    : null,
);
</script>

<template>
  <main class="q-pa-lg">
    <TitlePage title="Assinatura" icon="credit_card" />

    <div class="q-mt-md">
      <q-banner v-if="hasTestFree" rounded class="bg-teal-1 text-teal-9 q-mb-md shadow-1">
        <template v-slot:avatar><q-icon name="card_giftcard" /></template>
        <strong>Aproveite seu período de teste!</strong> Você tem 7 dias para explorar todos os
        recursos premium.
      </q-banner>

      <q-banner rounded class="bg-blue-1 text-blue-9 shadow-1">
        <template v-slot:avatar><q-icon name="workspace_premium" /></template>
        Você está no <strong>{{ subscriptionLabel }}</strong
        >.
        <span v-if="expiredDateFormatted">Válido até: {{ expiredDateFormatted }}</span>
      </q-banner>
    </div>

    <div class="row q-col-gutter-lg q-mt-sm">
      <div v-for="(config, key) in plansConfig" :key="key" class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section :class="`bg-${config.color} text-white`">
            <div class="text-h5 text-weight-bold text-center">{{ config.title }}</div>
          </q-card-section>

          <q-card-section>
            <q-list separator>
              <q-item v-for="feat in config.features" :key="feat.label">
                <q-item-section class="text-weight-medium">{{ feat.label }}</q-item-section>
                <q-item-section side class="text-weight-bold text-grey-9">{{
                  feat.val
                }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions vertical class="q-pa-md" v-if="showActionPayment">
            <q-btn
              unelevated
              color="primary"
              class="full-width q-mb-sm"
              label="ASSINAR AGORA"
              @click="
                changeShowSubscriptionPayment(
                  true,
                  key === 'basic' ? basicSubscriptionId : premiumSubscriptionId,
                )
              "
            />
            <q-btn outline color="primary" label="TESTAR POR 3 DIAS" class="full-width" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <SubscriptionPayment
      :data="showSubscriptionPayment"
      @update:open="changeShowSubscriptionPayment(false)"
    />
  </main>
</template>
