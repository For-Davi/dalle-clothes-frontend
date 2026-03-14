<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import InformEmail from '../email/InformEmail.vue';
import ExchangeTaxCoupon from '../taxcoupon/ExchangeTaxCoupon.vue';
import { useExchangeStore } from 'src/stores/exchange-store';
import { exportExchangeService } from 'src/services/exchange-service';
import { checkEmail } from 'src/composables/CheckData';
import { createErrorData, createSuccess } from 'src/composables/CreateNotify';

defineOptions({
  name: 'ExchangeMade',
});

const props = defineProps<{
  data: {
    open: boolean;
    couponData: IExchangeCouponData | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'new-sale': [void];
}>();
const loading = ref<boolean>(false);

const showInformEmail = reactive<{
  open: boolean;
  clientEmail: string | null;
}>({
  open: false,
  clientEmail: null,
});

const changeShowInformEmail = (show: boolean, clientEmail: string | null = null) => {
  Object.assign(showInformEmail, {
    open: show,
    clientEmail: clientEmail,
  });
};

const startExport = async (): Promise<void> => {
  await exportExchangeService(props.data.couponData?.exchange.id ?? 0);
};
const startSendToEmail = async (email: string) => {
  const check = checkEmail(email);
  if (check.status) {
    const response = await useExchangeStore().sendCouponToEmail(
      props.data.couponData?.exchange.id ?? 0,
      email,
    );

    if (response?.status === 200) {
      createSuccess(response.data.message);
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar e-mail');
  }
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page">
      <q-card-section class="q-pa-none">
        <TitlePage title="Troca finalizada" icon="point_of_sale" />
      </q-card-section>
      <q-card-section>
        <div class="flex justify-center">
          <q-icon name="fa-solid fa-check-to-slot" color="green" size="40px" />
        </div>
        <div class="flex justify-center">
          <span class="text-green text-body1 text-bold q-mt-sm">
            Sua troca foi finalizada com sucesso
          </span>
        </div>
        <ExchangeTaxCoupon :couponData="props.data.couponData" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm q-mr-md">
          <q-btn
            color="red"
            label="Fechar"
            flat
            size="md"
            :loading="loading"
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            color="secondary"
            label="Download Cupom"
            @click="startExport()"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Enviar cupom por email"
            @click="changeShowInformEmail(true)"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
  <InformEmail
    :data="showInformEmail"
    @update:open="changeShowInformEmail(false)"
    @send-email="startSendToEmail"
  />
</template>
