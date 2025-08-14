<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { actionsMovement } from 'src/utils/actions';
import CategoryTransactionsManage from 'src/components/manage/CategoryTransactionsManage.vue';
import TableMovement from 'src/components/table/TableMovement.vue';
import FormMovement from 'src/components/form/FormMovement.vue';
import Description from 'src/components/general/Description.vue';
import { useMovementStore } from 'src/stores/movement-store';
import FilterMovement from 'src/components/filter/FilterMovement.vue';

defineOptions({
  name: 'Movement',
});

const showFilterMovement = ref<boolean>(false);
const showCategoryTransactionManage = ref<boolean>(false);
const showFormMovement = reactive({
  open: false as boolean,
  movementID: null as number | null,
});
const showDescription = reactive({
  open: false as boolean,
  description: null as string | null,
});
const filter = reactive<IFilterMovement>({
  period: null,
  category: null,
  type: 'all',
});

const changeShowFormMovement = (open: boolean, movementID: number | null = null): void => {
  Object.assign(showFormMovement, {
    open,
    movementID,
  });
};
const changeShowDescription = (open: boolean, description: string | null = null): void => {
  Object.assign(showDescription, {
    open,
    description,
  });
};
const changeShowCategoryTransactionManage = () => {
  showCategoryTransactionManage.value = !showCategoryTransactionManage.value;
};
const startEditMovement = (id: number): void => {
  changeShowFormMovement(true, id);
};
const startShowDescription = (description: string): void => {
  changeShowDescription(true, description);
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
const actionFilter = async (data: 'close' | IFilterMovement): Promise<void> => {
  changeShowFilterMovement();

  if (data !== 'close') {
    Object.assign(filter, {
      period: data.period,
      category: data.category,
      type: data.type,
    });
    await useMovementStore().getMovements(filter);
  }
};

const getTitleTableMovement = computed((): string => {
  if (filter.period === null) {
    const now = new Date();
    return new Intl.DateTimeFormat('pt-BR', {
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    }).format(now);
  } else {
    return filter.period;
  }
});
const hasFilter = computed(() => {
  return filter.period !== null || filter.category !== null || filter.type !== 'all';
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
    <section class="q-mt-md q-px-sm">
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
      <TableMovement
        :title="getTitleTableMovement"
        @show:show-form-movement="startEditMovement"
        @show:show-description="startShowDescription"
      />
    </section>

    <!-- Modals -->
    <FilterMovement :open="showFilterMovement" :filters="filter" @update:open="actionFilter" />
    <FormMovement :data="showFormMovement" @update:open="changeShowFormMovement(false)" />
    <Description :data="showDescription" @update:open="changeShowDescription(false)" />
    <CategoryTransactionsManage
      :open="showCategoryTransactionManage"
      @update:open="changeShowCategoryTransactionManage"
    />
  </main>
</template>
