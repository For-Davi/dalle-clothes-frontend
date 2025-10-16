<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormReceipt from 'src/components/form/FormReceipt.vue';
import { ref, reactive, onMounted } from 'vue';
import { useReceiptstore } from 'src/stores/receipt-store';
import TableReceipt from 'src/components/table/TableReceipt.vue';

defineOptions({ name: 'Receipts' });

const filterReceipt = ref('');
const showFormReceipt = reactive<{
  open: boolean;
  receiptID: number | null;
}>({
  open: false,
  receiptID: null,
});

const changeShowFormReceipt = (show: boolean, receiptID: number | null = null): void => {
  Object.assign(showFormReceipt, { open: show, receiptID });
};
const makeEdit = (id: number): void => {
  changeShowFormReceipt(true, id);
};

const fetchReceipts = async (): Promise<void> => {
  await useReceiptstore().getReceipt();
};

onMounted(async () => {
  await fetchReceipts();
});
</script>

<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Recebimentos" icon="account_balance" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Novo recebimento"
          icon-right="add"
          no-caps
          @click="changeShowFormReceipt(true)"
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
      <TableReceipt :filter="filterReceipt" @show:show-form-receipt="makeEdit" />
    </section>

    <!-- Modals -->
    <FormReceipt :data="showFormReceipt" @update:open="changeShowFormReceipt(false)" />
  </main>
</template>
