<script setup lang="ts">
import router from 'src/router';

defineOptions({
  name: 'SubscriptionBanner',
});

const props = defineProps<{
  resourceName: string;
}>();

const toSubscription = async () => {
  await router.push({ name: 'subscription' });
};
</script>

<template>
  <q-banner rounded class="bg-amber-1 text-black q-my-md" style="border: 1px solid #ffca28">
    <template v-slot:avatar>
      <q-icon name="workspace_premium" color="amber-9" />
    </template>

    <div class="text-subtitle1 text-weight-bold">Limite de {{ props.resourceName }} atingido</div>
    <div class="text-body2">
      Você alcançou o limite permitido para o seu plano atual. Atualize sua assinatura para
      continuar expandindo seu negócio.
    </div>

    <template v-slot:action>
      <q-btn flat color="primary" label="Ver Planos" icon="rocket_launch" @click="toSubscription" />
    </template>
  </q-banner>
</template>
