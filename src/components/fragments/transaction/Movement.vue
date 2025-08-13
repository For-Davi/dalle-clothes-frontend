<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { actionsMovement } from 'src/utils/actions';
import CategoryTransactionsManage from 'src/components/manage/CategoryTransactionsManage.vue';
import TableMovement from 'src/components/table/TableMovement.vue';
import FormMovement from 'src/components/form/FormMovement.vue';

defineOptions({
  name: 'Movement',
});

const showFilterMovement = ref<boolean>(false);
const showCategoryTransactionManage = ref<boolean>(false);
const showFormMovement = reactive({
  open: false as boolean,
  movementID: null as number | null,
});
const filter = reactive<IFilterMovement>({
  startDate: '',
  endDate: '',
  category: null,
});

const changeShowFormMovement = (open: boolean, movementID: number | null = null): void => {
  Object.assign(showFormMovement, {
    open,
    movementID,
  });
};
const changeShowCategoryTransactionManage = () => {
  showCategoryTransactionManage.value = !showCategoryTransactionManage.value;
};
const startEditMovement = (id: number): void => {
  changeShowFormMovement(true, id);
};
const changeShowFilterMovement = (): void => {
  showFilterMovement.value = !showFilterMovement.value;
};
const openAction = (type: IActionMovement): void => {
  switch (type) {
    case 'export':
      console.log('Exportando...');
      break;
    case 'category':
      changeShowCategoryTransactionManage();
      break;
    case 'history':
      console.log('Exibindo histórico...');
      break;
  }
};

const hasFilter = computed(() => {
  return filter.startDate !== '' || filter.endDate != '' || filter.category !== null;
});
</script>
<template>
  <main>
    <section class="row items-center justify-end">
      <div>
        <q-btn
          @click="changeShowFormMovement(true)"
          color="white"
          text-color="black"
          label="Nova movimentação"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
        <q-btn-dropdown class="q-pa-none q-px-md q-mr-sm" label="Ações" no-caps auto-close>
          <q-list dense>
            <q-item
              clickable
              v-ripple
              v-for="(item, index) in actionsMovement"
              :key="index"
              @click="openAction(item.type)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon :name="item.icon" />
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-btn
            @click="changeShowFilterMovement"
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
      <TableMovement @show:show-form-movement="startEditMovement" />
    </section>
    <!-- Modals -->
    <FormMovement :data="showFormMovement" @update:open="changeShowFormMovement(false)" />
    <CategoryTransactionsManage
      :open="showCategoryTransactionManage"
      @update:open="changeShowCategoryTransactionManage"
    />
  </main>
</template>
