<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import CategorySupplierManage from 'src/components/manage/CategorySupplierManage.vue';
import FormSupplier from 'src/components/form/FormSupplier.vue';
import TableSupplier from 'src/components/table/TableSupplier.vue';
import { useSupplierStore } from 'src/stores/supplier-store';
import FilterSupplier from 'src/components/filter/FilterSupplier.vue';

defineOptions({
  name: 'Supplier',
});

const filterSupplier = ref<string>('');
const showCategorySupplierManage = ref<boolean>(false);
const showFilterSupplier = ref<boolean>(false);
const showFormSupplier = reactive({
  open: false as boolean,
  supplierId: null as number | null,
});
const filter = reactive<IFilterSupplier>({
  name: '',
  email: '',
  cpf: '',
  cnpj: '',
  country: '',
  state: '',
  city: '',
  active: null,
  category: null,
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
const changeShowFilterSupplier = (): void => {
  showFilterSupplier.value = !showFilterSupplier.value;
};
const actionFilter = async (data: 'close' | IFilterSupplier): Promise<void> => {
  changeShowFilterSupplier();

  if (data !== 'close') {
    Object.assign(filter, {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      cnpj: data.cnpj,
      country: data.country,
      state: data.state,
      city: data.city,
      active: data.active,
      category: data.category,
    });
    await useSupplierStore().getSuppliers(filter);
  }
};
const makeEdit = (id: number): void => {
  changeShowFormSupplier(true, id);
};

const hasFilter = computed(() => {
  return (
    filter.name !== '' ||
    filter.email != '' ||
    filter.cpf != '' ||
    filter.cnpj != '' ||
    filter.country != '' ||
    filter.state != '' ||
    filter.city != '' ||
    filter.active !== null ||
    filter.category !== null
  );
});
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
          <q-btn
            @click="changeShowFilterSupplier"
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableSupplier :filter="filterSupplier" @show:show-form-supplier="makeEdit" />
    </section>
    <CategorySupplierManage
      :open="showCategorySupplierManage"
      @update:open="changeShowCategorySupplierManage"
    />
    <FormSupplier :data="showFormSupplier" @update:open="changeShowFormSupplier(false)" />
    <FilterSupplier :open="showFilterSupplier" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
