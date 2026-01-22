<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'ContactHelper',
});

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const open = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

const whatsappNumber = import.meta.env.VITE_WHATSAPP_HELPER;
const emailSupport = import.meta.env.VITE_EMAIL_HELPER;

const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=Olá! Preciso de suporte com o sistema.`;
const emailUrl = `mailto:${emailSupport}?subject=Suporte/Dúvidas - Cliente`;
</script>

<template>
  <q-dialog v-model="open">
    <q-card style="width: 400px; max-width: 90vw; border-radius: 5px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="support_agent" size="md" class="q-mr-sm" />
          Central de Ajuda
        </div>
      </q-card-section>

      <q-card-section class="q-pt-md text-center">
        <p class="text-subtitle1 text-grey-8">
          Olá! Precisa de uma mãozinha? <br />
          Escolha um dos canais abaixo para falar conosco.
        </p>
      </q-card-section>

      <q-card-section class="q-gutter-y-md q-pt-none">
        <q-btn
          :href="whatsappUrl"
          target="_blank"
          class="full-width"
          color="positive"
          rounded
          unelevated
          no-caps
        >
          <div class="row items-center full-width">
            <q-icon name="fa-brands fa-whatsapp" size="sm" class="q-mr-md" />
            <div class="text-left">
              <div class="text-weight-bold">WhatsApp</div>
              <div class="text-caption">Atendimento rápido e humano</div>
            </div>
            <q-space />
            <q-icon name="chevron_right" />
          </div>
        </q-btn>

        <q-btn :href="emailUrl" class="full-width" color="primary" outline rounded no-caps>
          <div class="row items-center full-width">
            <q-icon name="mail_outline" size="sm" class="q-mr-md" />
            <div class="text-left">
              <div class="text-weight-bold">E-mail</div>
              <div class="text-caption">{{ emailSupport }}</div>
            </div>
            <q-space />
            <q-icon name="chevron_right" />
          </div>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-center q-pb-md">
        <span class="text-caption text-grey-6 italic">
          Horário de atendimento: Seg a Sex, das 08h às 18h.
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="open = false" color="red" label="Fechar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.q-btn:hover {
  transform: translateY(-2px);
  transition: transform 0.2s;
}
</style>
