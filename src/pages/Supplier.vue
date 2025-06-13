<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, ref } from 'vue';
import CategorySupplierManage from 'src/components/manage/CategorySupplierManage.vue';
import FormSupplier from 'src/components/form/FormSupplier.vue';
import TableSupplier from 'src/components/table/TableSupplier.vue';

defineOptions({
  name: 'Supplier',
});

const filterSupplier = ref<string>('');
const showCategorySupplierManage = ref<boolean>(false);
const showFormSupplier = reactive({
  open: false as boolean,
  supplierId: null as number | null,
});

const changeShowCategorySupplierManage = (): void => {
  showCategorySupplierManage.value = !showCategorySupplierManage.value;
};
const changeShowFormSupplier = (open: boolean, supplierId: number | null = null): void => {
  Object.assign(showFormSupplier, {
    open,
    supplierId,
  });
};
const makeEdit = (id: number): void => {
  changeShowFormSupplier(true, id)
}
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Fornecedores" icon="list_alt" />
      <div>
        <q-btn
          @click="changeShowCategorySupplierManage"
          color="white"
          text-color="black"
          label="Categorias"
          icon-right="category"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Compras"
          icon-right="paid"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          @click="changeShowFormSupplier(true)"
          color="white"
          text-color="black"
          label="Novo fornecedor"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterSupplier"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableSupplier :filter="filterSupplier" @show:show-form-supplier="makeEdit"/>
    </section>
    <CategorySupplierManage
      :open="showCategorySupplierManage"
      @update:open="changeShowCategorySupplierManage"
    />
    <FormSupplier :data="showFormSupplier" @update:open="changeShowFormSupplier(false)" />
  </main>
</template>
