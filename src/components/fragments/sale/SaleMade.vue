<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import InformEmail from '../email/InformEmail.vue';
import Loading from 'src/components/shared/Loading.vue';
import TaxCoupon from '../taxcoupon/TaxCoupon.vue';
import { useSaleStore } from 'src/stores/sale-store';
import { storeToRefs } from 'pinia';
import { exportSaleService } from 'src/services/sale-service';
import { checkEmail } from 'src/composables/CheckData';
import { createErrorData, createSuccess } from 'src/composables/CreateNotify';

defineOptions({
  name: 'SaleMade',
});

const { loadingSale } = storeToRefs(useSaleStore());

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
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
const couponData = ref<ICouponData | null>(null);

const changeShowInformEmail = (show: boolean, clientEmail: string | null = null) => {
  Object.assign(showInformEmail, {
    open: show,
    clientEmail: clientEmail,
  });
};
const getSale = async () => {
  const response = await useSaleStore().showSaleCouponData(props.data.saleID ?? 0);

  if (response?.status === 200) {
    couponData.value = response.data.couponData;
  }
};
const startExport = async (): Promise<void> => {
  await exportSaleService(props.data.saleID ?? 0);
  emit('update:open');
};
const startSendToEmail = async (email: string) => {
  const check = checkEmail(email);
  if (check.status) {
    const response = await useSaleStore().sendCouponToEmail(props.data.saleID ?? 0, email);

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

watch(
  () => props.data.open,
  async () => {
    if (props.data.open) {
      await getSale();
    }
  },
);
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card :class="loadingSale ? 'column justify-between' : ''" class="bg-grey-2 sub-page">
      <q-card-section class="q-pa-none">
        <TitlePage title="Venda finalizada" icon="point_of_sale" />
      </q-card-section>
      <Loading v-show="loadingSale" :show="loadingSale" />
      <q-card-section>
        <div v-if="!loadingSale">
          <div class="flex justify-center">
            <q-icon name="fa-solid fa-check-to-slot" color="green" size="40px" />
          </div>
          <div class="flex justify-center">
            <span class="text-green text-body1 text-bold q-mt-sm">
              Sua venda foi finalizada com sucesso
            </span>
          </div>
          <TaxCoupon :couponData="couponData" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm q-mr-md">
          <q-btn
            color="grey"
            label="Nova Venda"
            size="md"
            :loading="loading"
            @click="emit('new-sale')"
            unelevated
            no-caps
          />
          <q-btn
            color="secondary"
            label="Download Cupom"
            :loading="loadingSale"
            @click="startExport()"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Enviar cupom por email"
            :loading="loadingSale"
            @click="changeShowInformEmail(true, couponData?.client?.email)"
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
