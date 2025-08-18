<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from 'src/stores/schedule-store';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataSchedule } from 'src/composables/CheckData';

defineOptions({
  name: 'FormSchedule',
});

const props = defineProps<{
  data: {
    open: boolean;
    scheduleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  newRequest: [void];
}>();

const { loadingSchedule } = storeToRefs(useScheduleStore());
const { loadingCategoryTransaction, listCategoryTransaction } = storeToRefs(
  useCategoryTransactionStore(),
);

const dataSchedule = reactive({
  value: '' as string,
  date: '' as string,
  description: '' as string,
});
const selectedCategory = ref<IQuasarSelect<number | null> | null>({
  label: 'Sem categoria',
  value: null,
});
const selectedType = ref<IQuasarSelect<'entry' | 'out'>>({
  label: 'Entrada 🟩',
  value: 'entry',
});
const selectedQuantity = ref<IQuasarSelect<number>>({
  label: 'Mês atual',
  value: 1,
});

const clear = (): void => {
  Object.assign(dataSchedule, {
    value: '',
    date: '',
    description: '',
  });

  selectedCategory.value = {
    label: 'Sem categoria',
    value: null,
  };
  selectedQuantity.value = {
    label: 'Mês atual',
    value: 1,
  };
  selectedType.value = {
    label: 'Entrada 🟩',
    value: 'entry',
  };
};
const save = async () => {
  const check = checkDataSchedule(dataSchedule);
  if (check.status) {
    const response = await useScheduleStore().createSchedule({
      value: parseFloat(dataSchedule.value),
      description: dataSchedule.description.trim().length > 0 ? dataSchedule.description : null,
      type: selectedType.value.value,
      transactionCategoryID: selectedCategory.value?.value ?? null,
      quantity: selectedQuantity.value.value,
      date: dataSchedule.date,
    });
    if (response?.status === 201) {
      clear();
      emit('newRequest');
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do agendamento');
  }
};
const update = async () => {
  const check = checkDataSchedule(dataSchedule);
  if (check.status) {
    const response = await useScheduleStore().updateSchedule({
      id: scheduleID.value ?? 0,
      value: parseFloat(dataSchedule.value),
      description: dataSchedule.description.trim().length > 0 ? dataSchedule.description : null,
      type: selectedType.value.value,
      transactionCategoryID: selectedCategory.value?.value ?? null,
      quantity: selectedQuantity.value.value,
      date: dataSchedule.date,
    });
    if (response?.status === 200) {
      clear();
      emit('newRequest');
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do agendamento');
  }
};
const checkDataEdit = async () => {
  if (scheduleID.value) {
    const response = await useScheduleStore().showSchedule(scheduleID.value);
    if (response?.status === 200) {
      const schedule = response.data.schedule;

      Object.assign(dataSchedule, {
        value: String(schedule.value),
        date: String(schedule.date).replace(/-/g, '/'),
        description: schedule.description ?? '',
      });

      selectedType.value =
        schedule.type === 'entry'
          ? {
              label: 'Entrada 🟩',
              value: 'entry',
            }
          : {
              label: 'Saída 🟥',
              value: 'out',
            };

      selectedCategory.value = schedule.transaction_category_id
        ? {
            label: schedule.category?.name ?? '',
            value: schedule.category?.id ?? null,
          }
        : {
            label: 'Sem categoria',
            value: null,
          };
    }
  }
};
const fetchCategories = async (): Promise<void> => {
  await useCategoryTransactionStore().getCategoriesTransaction();
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const isLoading = computed(() => {
  return loadingSchedule.value || loadingCategoryTransaction.value;
});
const getlabelCategory = computed((): string => {
  return selectedCategory.value !== null ? 'Categoria' : 'Sem categoria definida';
});
const scheduleID = computed(() => props.data.scheduleID);
const optionsType = computed(() => {
  return [
    {
      label: 'Entrada 🟩',
      value: 'entry',
    },
    {
      label: 'Saída 🟥',
      value: 'out',
    },
  ];
});
const optionsQuantity = computed(() => {
  return [
    {
      label: 'Mês atual',
      value: 1,
    },
    {
      label: 'Mês atual + 1',
      value: 2,
    },
    {
      label: 'Mês atual + 2',
      value: 3,
    },
    {
      label: 'Mês atual + 3',
      value: 4,
    },
    {
      label: 'Mês atual + 4',
      value: 5,
    },
    {
      label: 'Mês atual + 5',
      value: 6,
    },
    {
      label: 'Mês atual + 6',
      value: 7,
    },
    {
      label: 'Mês atual + 7',
      value: 8,
    },
    {
      label: 'Mês atual + 8',
      value: 9,
    },
    {
      label: 'Mês atual + 9',
      value: 10,
    },
    {
      label: 'Mês atual + 10',
      value: 11,
    },
    {
      label: 'Mês atual + 11',
      value: 12,
    },
  ];
});
const getOptionsCategories = computed((): IQuasarSelect<number | null>[] => {
  const categories = listCategoryTransaction.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return [{ label: 'Sem categoria', value: null }, ...categories];
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchCategories();
    await checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 form-basic column justify-between"
      style="width: 800px; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="scheduleID ? 'Atualização de agendamento' : 'Cadastro de agendamento'"
          icon="sync_alt"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form class="q-gutter-y-sm column full-width" v-show="!isLoading">
          <q-select
            v-model="selectedType"
            outlined
            bg-color="white"
            label-color="black"
            :options="optionsType"
            label="Selecitone o tipo"
            map-options
            dense
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataSchedule.value"
            bg-color="white"
            label-color="black"
            outlined
            label="R$ Valor"
            dense
            input-class="text-black no-spinners"
            type="text"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSchedule.date"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de agendamento"
            dense
            input-class="text-black no-spinners"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-if="!scheduleID"
            v-model="selectedQuantity"
            outlined
            bg-color="white"
            label-color="black"
            :options="optionsQuantity"
            map-options
            label="Quantidade de lançamentos"
            options-dense
            dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedCategory"
            outlined
            bg-color="white"
            label-color="black"
            :options="getOptionsCategories"
            map-options
            :label="getlabelCategory"
            dense
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataSchedule.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição"
            dense
            input-class="text-black no-resize"
            type="textarea"
            counter
            :maxlength="500"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center full-width">
          <q-btn
            @click="open = false"
            flat
            color="red"
            label="Fechar"
            size="md"
            unelevated
            no-caps
            class="q-mr-sm"
          />
          <q-btn
            v-if="!scheduleID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
