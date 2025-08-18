<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { actionsMovement } from 'src/utils/actions';
import CategoryTransactionsManage from 'src/components/manage/CategoryTransactionsManage.vue';
import TableSchedule from 'src/components/table/TableSchedule.vue';
import FormSchedule from 'src/components/form/FormSchedule.vue';
import Description from 'src/components/general/Description.vue';
import { useScheduleStore } from 'src/stores/schedule-store';
import FilterSchedule from 'src/components/filter/FilterSchedule.vue';

defineOptions({
  name: 'Schedule',
});

const showFilterSchedule = ref<boolean>(false);
const showCategoryTransactionManage = ref<boolean>(false);
const showFormSchedule = reactive({
  open: false as boolean,
  scheduleID: null as number | null,
});
const showDescription = reactive({
  open: false as boolean,
  description: null as string | null,
});
const filter = reactive<IFilterSchedule>({
  period: null,
  category: null,
  type: 'all',
});

const changeShowFormSchedule = (open: boolean, scheduleID: number | null = null): void => {
  Object.assign(showFormSchedule, {
    open,
    scheduleID,
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
const startEditSchedule = (id: number): void => {
  changeShowFormSchedule(true, id);
};
const startShowDescription = (description: string): void => {
  changeShowDescription(true, description);
};
const changeShowFilterSchedule = (): void => {
  showFilterSchedule.value = !showFilterSchedule.value;
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
const actionFilter = async (data: 'close' | IFilterSchedule): Promise<void> => {
  changeShowFilterSchedule();

  if (data !== 'close') {
    Object.assign(filter, {
      period: data.period,
      category: data.category,
      type: data.type,
    });
    await useScheduleStore().getSchedules(filter);
  }
};
const newRequest = async (): Promise<void> => {
  if (hasFilter.value) {
    await useScheduleStore().getSchedules(filter);
  }
};

const getTitleTableSchedule = computed((): string => {
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
          @click="changeShowFormSchedule(true)"
          color="white"
          text-color="black"
          label="Novo agendamento"
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
            @click="changeShowFilterSchedule"
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
      <TableSchedule
        :title="getTitleTableSchedule"
        @show:show-form-schedule="startEditSchedule"
        @show:show-description="startShowDescription"
        @new-request="newRequest"
      />
    </section>

    <!-- Modals -->
    <FilterSchedule :open="showFilterSchedule" :filters="filter" @update:open="actionFilter" />
    <FormSchedule
      :data="showFormSchedule"
      @update:open="changeShowFormSchedule(false)"
      @new-request="newRequest"
    />
    <Description :data="showDescription" @update:open="changeShowDescription(false)" />
    <CategoryTransactionsManage
      :open="showCategoryTransactionManage"
      @update:open="changeShowCategoryTransactionManage"
    />
  </main>
</template>
