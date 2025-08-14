<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import TypesReceiptsManage from 'src/components/manage/TypesReceiptsManage.vue';
import FormReceipt from 'src/components/form/FormReceipt.vue';
import Description from 'src/components/general/Description.vue';
import { ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useReceiptstore } from 'src/stores/receipt-store';
import { columnsReceipts } from 'src/utils/columns';

defineOptions({ name: 'Receipts' });

const { listReceipt } = storeToRefs(useReceiptstore());

const showTypeReceiptManage = ref(false);
const filterReceipt = ref('');
const showFormReceipt = reactive<{
  open: boolean;
  receipt: IReceipt | null;
}>({
  open: false,
  receipt: null
});
const showDescription = reactive<{
  open: boolean;
  description: string | null;
}>({
  open: false,
  description: null
});

const changeShowTypeReceiptsManage = () => {
  showTypeReceiptManage.value = !showTypeReceiptManage.value;
};

const changeShowFormReceipt = (
  show: boolean,
  receipt: IReceipt | null = null
) => {
  Object.assign(showFormReceipt, { open: show, receipt });
};

const changeShowDescription = (
  show: boolean,
  receipt: IReceipt | null = null
) => {
  Object.assign(showDescription, {
    open: show,
    description: receipt?.description || null,
  });
};


const startEdit = (data: IReceipt) => {
  changeShowFormReceipt(true, data);
};
</script>

<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Recebimentos" icon="account_balance" />
      <div>
        <q-btn 
          color="white" 
          text-color="black" 
          label="Nova conta" 
          icon-right="add" 
          no-caps 
          @click="changeShowFormReceipt(true)"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Tipos"
          no-caps
          icon-right="credit_card"
          class="q-ml-sm"
          @click="changeShowTypeReceiptsManage"
        />
      </div>
    </section>

    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterReceipt"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
        </div>
      </q-banner>

      <q-table
        :rows="listReceipt"
        :columns="columnsReceipts"
        :filter="filterReceipt"
        title="Lista de contas"
        row-key="index"
        no-data-label="Nenhuma recebimento para mostrar"
        virtual-scroll
        :rows-per-page-options="[10]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
              <span class="text-body2 text-bold">{{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name">{{ props.row.name }}</q-td>
            <q-td key="type">{{ props.row.type }}</q-td>
            <q-td key="bank">{{ props.row.bank }}</q-td>
            <q-td key="account">{{ props.row.account }}</q-td>
            <q-td key="agency">{{ props.row.agency }}</q-td>
            <q-td key="active">
              <q-icon
                :name="props.row.active === 1 ? 'check_circle' : 'close'"
                :color="props.row.active === 1 ? 'green' : 'red'"
                size="17px"
              />
            </q-td>
            <q-td key="action">
              <q-btn @click="changeShowDescription(true, props.row)" size="sm" flat round color="blue" icon="description"/>
              <q-btn @click="startEdit(props.row)" size="sm" flat round color="black" icon="edit" />
              <q-btn size="sm" flat round color="red" icon="delete" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </section>

    <!-- Modals -->
    <TypesReceiptsManage
      :open="showTypeReceiptManage"
      @update:open="changeShowTypeReceiptsManage"
    />
    <FormReceipt
      :data="showFormReceipt"
      @update:open="changeShowFormReceipt(false)"
    />
    <Description
      :data="showDescription"
      @update:open="changeShowDescription(false)"
    />
  </main>
</template>
