<script setup lang="ts">
import { computed, reactive } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useExchangeStore } from 'src/stores/exchange-store';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';
import TableExchange from '../table/TableExchange.vue';
import FormExchangePayment from '../form/FormExchangePayment.vue';
import ExchangeDetails from '../details/ExchangeDetails.vue';
import ExchangeMade from '../fragments/exchange/ExchangeMade.vue';

defineOptions({
  name: 'ExchangeManage',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listExchanges, loadingExchanges } = storeToRefs(useExchangeStore());

const showFormPayment = reactive({
  open: false as boolean,
  exchange: null as IExchange | null,
});
const showExchangeDetails = reactive({
  open: false as boolean,
  exchangeID: null as number | null,
});
const showExchangeMade = reactive({
  open: false as boolean,
  couponData: null as IExchangeCouponData | null,
});

const changeShowFormPayment = (open: boolean, exchange: IExchange | null = null) => {
  Object.assign(showFormPayment, {
    open,
    exchange,
  });
};
const changeShowExchangeDetails = (open: boolean, exchangeID: number | null = null) => {
  Object.assign(showExchangeDetails, {
    open,
    exchangeID,
  });
};
const changeShowExchangeMade = (open: boolean, couponData: IExchangeCouponData | null = null) => {
  Object.assign(showExchangeMade, {
    open,
    couponData,
  });
};
const fetchExchanges = async () => {
  await useExchangeStore().getExchanges(props.data.saleID ?? 0);
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      style="min-width: 70vw"
      :class="loadingExchanges ? 'bg-grey-2 sub-page column justify-between' : 'bg-grey-2 sub-page'"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Estornos e Diferenças" icon="fa-solid fa-box" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingExchanges">
          <TableExchange
            :sale-i-d="props.data.saleID"
            v-show="listExchanges.length > 0"
            @show:payment-form="(exchange) => changeShowFormPayment(true, exchange)"
            @show:exchange-details="(exchangeID) => changeShowExchangeDetails(true, exchangeID)"
          />
          <Empty
            v-show="listExchanges.length <= 0 && !loadingExchanges"
            message="Sem estornos e diferenças"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingExchanges" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
  <FormExchangePayment
    :data="showFormPayment"
    @update:open="changeShowFormPayment(false)"
    @new-request="fetchExchanges"
    @show:coupon="(data) => changeShowExchangeMade(true, data)"
  />
  <ExchangeDetails :data="showExchangeDetails" @update:open="changeShowExchangeDetails(false)" />
  <ExchangeMade :data="showExchangeMade" @update:open="changeShowExchangeMade(false)" />
</template>
