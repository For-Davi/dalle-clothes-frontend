<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormReceipt from 'src/components/form/FormReceipt.vue';
import { ref, reactive, onMounted, computed } from 'vue';
import { useReceiptstore } from 'src/stores/receipt-store';
import TableReceipt from 'src/components/table/TableReceipt.vue';
import { storeToRefs } from 'pinia';
import SubscriptionBanner from 'src/components/banner/SubscriptionBanner.vue';
import { checkRegisterLimit } from 'src/composables/Plans';

defineOptions({ name: 'Receipts' });

const { listReceipt } = storeToRefs(useReceiptstore());

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

const planValidation = computed(() => {
  return checkRegisterLimit('receipts', listReceipt.value.length);
});

onMounted(async () => {
  await fetchReceipts();
});
</script>

<template>
  <main class="q-pa-lg">
    <section class="page-header q-mb-xs">
      <TitlePage title="Recebimentos" icon="account_balance" />
      <div class="page-header-actions">
        <q-btn
          v-if="hasPermission('receipt.create') && planValidation.canAdd"
          color="white"
          text-color="black"
          label="Novo recebimento"
          icon-right="add"
          no-caps
          @click="changeShowFormReceipt(true)"
        />
      </div>
    </section>
    <SubscriptionBanner v-if="planValidation.showUpgradeBanner" resource-name="recebimentos" />
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterReceipt"
            dense
            class="search-input bg-white rounded-borders"
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
