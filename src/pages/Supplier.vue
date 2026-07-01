<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import CategorySupplierManage from 'src/components/manage/CategorySupplierManage.vue';
import FormSupplier from 'src/components/form/FormSupplier.vue';
import TableSupplier from 'src/components/table/TableSupplier.vue';
import { useSupplierStore } from 'src/stores/supplier-store';
import FilterSupplier from 'src/components/filter/FilterSupplier.vue';
import { actionsSupplier } from 'src/utils/actions';
import SupplierOrderManage from 'src/components/manage/SupplierOrderManage.vue';
import { usePermission } from 'src/composables/usePermission';
import { storeToRefs } from 'pinia';
import SubscriptionBanner from 'src/components/banner/SubscriptionBanner.vue';
import { checkRegisterLimit } from 'src/composables/Plans';

defineOptions({
  name: 'Supplier',
});

const { hasPermission } = usePermission();
const { listSupplier } = storeToRefs(useSupplierStore());

const filterSupplier = ref<string>('');
const showCategorySupplierManage = ref<boolean>(false);
const showSupplierOrderManage = ref<boolean>(false);
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
const changeShowSupplierOrderManage = (): void => {
  showSupplierOrderManage.value = !showSupplierOrderManage.value;
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
const openAction = (type: IActionsSupplier): void => {
  switch (type) {
    case 'order':
      changeShowSupplierOrderManage();
      break;
    case 'category':
      changeShowCategorySupplierManage();
      break;
  }
};

const planValidation = computed(() => {
  return checkRegisterLimit('suppliers', listSupplier.value.length);
});
const hasAnyAction = computed(() =>
  actionsSupplier.some((item) => !item.permission || hasPermission(item.permission)),
);
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
    <section class="page-header q-mb-xs">
      <TitlePage title="Fornecedores" icon="list_alt" />
      <div class="page-header-actions">
        <q-btn
          v-if="hasPermission('supplier.create') && planValidation.canAdd"
          @click="changeShowFormSupplier(true)"
          color="white"
          text-color="black"
          label="Novo fornecedor"
          icon-right="add"
          no-caps
        />
        <q-btn-dropdown
          v-if="hasAnyAction"
          class="q-pa-none q-px-md q-mr-sm"
          label="Ações"
          no-caps
          auto-close
        >
          <q-list dense>
            <template v-for="(item, index) in actionsSupplier" :key="index">
              <q-item
                clickable
                v-ripple
                v-if="!item.permission || hasPermission(item.permission)"
                @click="openAction(item.type)"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon :name="item.icon" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
      </div>
    </section>
    <SubscriptionBanner v-if="planValidation.showUpgradeBanner" resource-name="fornecedores" />
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterSupplier"
            dense
            class="search-input bg-white rounded-borders"
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

    <!-- Modals -->
    <SupplierOrderManage
      :open="showSupplierOrderManage"
      @update:open="changeShowSupplierOrderManage"
    />
    <CategorySupplierManage
      :open="showCategorySupplierManage"
      @update:open="changeShowCategorySupplierManage"
    />
    <FormSupplier :data="showFormSupplier" @update:open="changeShowFormSupplier(false)" />
    <FilterSupplier :open="showFilterSupplier" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
