<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import TableTypesReceipt from '../table/TableTypesReceipt.vue';
import FormTypesReceipt from '../form/FormTypesReceipt.vue';

defineOptions({
  name: 'TypesReceiptsManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingTypesReceipt, listTypesReceipt } = storeToRefs(useTypesReceiptStore());

const showFormTypeReceipt = reactive<{
  open: boolean;
  type: ITypesReceipt | null;
}>({
  open: false,
  type: null,
});

const clear = () => {
  Object.assign(showFormTypeReceipt, {
    open: false,
    type: null,
  });
};
const startEdit = (data: ITypesReceipt) => {
  changeShowFormTypeReceipt(true, data);
};
const changeShowFormTypeReceipt = (
  show: boolean,
  type: ICategoryTransaction | null = null,
): void => {
  Object.assign(showFormTypeReceipt, {
    open: show,
    type: type,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Tipos de recebimentos" icon="credit_card" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingTypesReceipt">
          <TableTypesReceipt
            v-show="listTypesReceipt.length > 0"
            @show:show-form-type-account="startEdit"
          />
          <Empty
            v-show="listTypesReceipt.length <= 0 && !loadingTypesReceipt"
            message="Sem tipos cadastrados"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingTypesReceipt" />
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
          <q-btn
            @click="changeShowFormTypeReceipt(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormTypesReceipt
        :data="showFormTypeReceipt"
        @update:open="changeShowFormTypeReceipt(false)"
      />
    </q-card>
  </q-dialog>
</template>
