<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import TableReturn from '../table/TableReturn.vue';
import FormReturn from '../form/FormReturn.vue';
import { storeToRefs } from 'pinia';
import { useReturnStore } from 'src/stores/return-store';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';
import ReturnDetails from '../details/ReturnDetails.vue';
import FormReturnEditStatus from '../form/FormReturnEditStatus.vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import ExchangeMade from '../fragments/exchange/ExchangeMade.vue';

defineOptions({
  name: 'ReturnManage',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
    status: string | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listReturns, loadingReturns } = storeToRefs(useReturnStore());

const showFormReturn = reactive({
  open: false as boolean,
  saleID: null as number | null,
  returnID: null as number | null,
});
const showReturnDetails = reactive({
  open: false as boolean,
  returnID: null as number | null,
});
const showEditStatus = reactive({
  open: false as boolean,
  editData: null as IEditReturnData | null,
});
const returnMonitoring = ref<number | null>(null);
const showConfirmAction = ref<boolean>(false);
const showExchangeMade = reactive({
  open: false as boolean,
  couponData: null as IExchangeCouponData | null,
});

const changeShowFormReturn = (
  open: boolean,
  saleID: number | null = null,
  returnID: number | null = null,
) => {
  Object.assign(showFormReturn, {
    open,
    saleID,
    returnID,
  });
};
const changeShowReturnDetails = (open: boolean, returnID: number | null = null): void => {
  Object.assign(showReturnDetails, {
    open,
    returnID,
  });
};
const changeShowEditStatus = (open: boolean, editData: IEditReturnData | null = null): void => {
  Object.assign(showEditStatus, {
    open,
    editData,
  });
};
const startEdit = (id: number, saleID: number, status: string) => {
  changeShowEditStatus(true, { id: id, saleID: saleID, status: status });
};
const clear = (): void => {
  returnMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useReturnStore().deleteReturn(props.data.saleID ?? 0, returnMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  returnMonitoring.value = id;
  showConfirmAction.value = true;
};
const changeShowExchangeMade = (open: boolean, couponData: IExchangeCouponData | null = null) => {
  Object.assign(showExchangeMade, {
    open,
    couponData,
  });
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      style="min-width: 75vw"
      :class="loadingReturns ? 'bg-grey-2 sub-page column justify-between' : 'bg-grey-2 sub-page'"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Devoluções" icon="fa-solid fa-box" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingReturns">
          <TableReturn
            v-show="listReturns.length > 0"
            :sale-i-d="props.data.saleID"
            @open:return-details="(returnID) => changeShowReturnDetails(true, returnID)"
            @open:form-linked-return="
              (saleID, returnID) => changeShowFormReturn(true, saleID, returnID)
            "
            @edit:return="startEdit"
            @exclude:return="openConfirmAction"
          />
          <Empty
            v-show="listReturns.length <= 0 && !loadingReturns"
            message="Sem devoluções"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingReturns" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            :loading="loadingReturns"
            unelevated
            no-caps
            flat
          />
          <q-btn
            @click="changeShowFormReturn(true, props.data.saleID)"
            :loading="loadingReturns"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <!-- Modals -->
      <ConfirmAction
        :open="showConfirmAction"
        label-action="Continuar"
        title="Confirmação de exclusão da venda"
        message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a devolução e registros como trocas, estornos, diferenças, comissões, entregas e movimentações de estoque permanentemente."
        @update:open="closeConfirmAction"
        @update:ok="closeConfirmActionOk"
      />
      <FormReturn
        :data="showFormReturn"
        @update:open="changeShowFormReturn(false)"
        @show:coupon="(coupon) => changeShowExchangeMade(true, coupon)"
      />
      <ReturnDetails :data="showReturnDetails" @update:open="changeShowReturnDetails(false)" />
      <FormReturnEditStatus :data="showEditStatus" @update:open="changeShowEditStatus(false)" />
      <ExchangeMade :data="showExchangeMade" @update:open="changeShowExchangeMade(false)" />
    </q-card>
  </q-dialog>
</template>
