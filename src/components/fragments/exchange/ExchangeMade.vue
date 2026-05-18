<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import InformEmail from '../email/InformEmail.vue';
import ExchangeTaxCoupon from '../taxcoupon/ExchangeTaxCoupon.vue';
import { useReturnStore } from 'src/stores/return-store';
import { exportExchangeService } from 'src/services/return-service';
import { checkEmail } from 'src/composables/CheckData';
import { createErrorData, createSuccess } from 'src/composables/CreateNotify';
import { storeToRefs } from 'pinia';
import Loading from 'src/components/shared/Loading.vue';

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
}>();
const loading = ref<boolean>(false);

const { loadingReturn } = storeToRefs(useReturnStore());

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
  await exportExchangeService(props.data.couponData?.return.id ?? 0);
};
const startSendToEmail = async (email: string) => {
  const check = checkEmail(email);
  if (check.status) {
    const response = await useReturnStore().sendCouponToEmail(
      props.data.couponData?.return.id ?? 0,
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
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card :class="loadingReturn ? 'column justify-between sub-page' : 'bg-grey-2 sub-page'">
      <q-card-section class="q-pa-none">
        <TitlePage title="Troca finalizada" icon="point_of_sale" />
      </q-card-section>
      <Loading v-show="loadingReturn" :show="loadingReturn" />
      <q-card-section>
        <div v-if="!loadingReturn">
          <div class="flex justify-center">
            <q-icon name="fa-solid fa-check-to-slot" color="green" size="40px" />
          </div>
          <div class="flex justify-center">
            <span class="text-green text-body1 text-bold q-mt-sm">
              Sua troca foi finalizada com sucesso
            </span>
          </div>
          <ExchangeTaxCoupon :couponData="props.data.couponData" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm q-mr-md">
          <q-btn
            color="red"
            label="Fechar"
            flat
            size="md"
            @click="open = false"
            :loading="loading"
            unelevated
            no-caps
          />
          <q-btn
            color="secondary"
            label="Download Cupom"
            @click="startExport()"
            :loading="loadingReturn"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Enviar cupom por email"
            @click="changeShowInformEmail(true)"
            :loading="loadingReturn"
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
