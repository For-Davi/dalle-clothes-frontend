<script setup lang="ts">
import { computed, reactive } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import TableReturn from '../table/TableReturn.vue';
import FormReturn from '../form/FormReturn.vue';
import { storeToRefs } from 'pinia';
import { useReturnStore } from 'src/stores/return-store';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';
import ReturnDetails from '../details/ReturnDetails.vue';
import FormReturnEditStatus from '../form/FormReturnEditStatus.vue';

defineOptions({
  name: 'ReturnManage',
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
const navigateLinkedReturn = (linkedReturnID: number) => {
  changeShowReturnDetails(false);
  changeShowReturnDetails(true, linkedReturnID);
};
const startEdit = (id: number, saleID: number, status: string) => {
  changeShowEditStatus(true, { id: id, saleID: saleID, status: status });
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
      <FormReturn :data="showFormReturn" @update:open="changeShowFormReturn(false)" />
      <ReturnDetails
        :data="showReturnDetails"
        @update:open="changeShowReturnDetails(false)"
        @navegate:linked-return="navigateLinkedReturn"
      />
      <FormReturnEditStatus :data="showEditStatus" @update:open="changeShowEditStatus(false)" />
    </q-card>
  </q-dialog>
</template>
