<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovementStore } from 'src/stores/movement-store';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataMovement } from 'src/composables/CheckData';

defineOptions({
  name: 'FormMovement',
});

const props = defineProps<{
  data: {
    open: boolean;
    movementID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  newRequest: [void];
}>();

const { loadingMovement } = storeToRefs(useMovementStore());
const { loadingCategoryTransaction, listCategoryTransaction } = storeToRefs(
  useCategoryTransactionStore(),
);

const dataMovement = reactive({
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
  Object.assign(dataMovement, {
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
  const check = checkDataMovement(dataMovement);
  if (check.status) {
    const response = await useMovementStore().createMovement({
      value: parseFloat(dataMovement.value),
      description: dataMovement.description.trim().length > 0 ? dataMovement.description : null,
      type: selectedType.value.value,
      transactionCategoryID: selectedCategory.value?.value ?? null,
      quantity: selectedQuantity.value.value,
      date: dataMovement.date,
    });
    if (response?.status === 201) {
      clear();
      emit('newRequest');
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da movimentação');
  }
};
const update = async () => {
  const check = checkDataMovement(dataMovement);
  if (check.status) {
    const response = await useMovementStore().updateMovement({
      id: movementID.value ?? 0,
      value: parseFloat(dataMovement.value),
      description: dataMovement.description.trim().length > 0 ? dataMovement.description : null,
      type: selectedType.value.value,
      transactionCategoryID: selectedCategory.value?.value ?? null,
      quantity: selectedQuantity.value.value,
      date: dataMovement.date,
    });
    if (response?.status === 200) {
      clear();
      emit('newRequest');
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da movimentação');
  }
};
const checkDataEdit = async () => {
  if (movementID.value) {
    const response = await useMovementStore().showMovement(movementID.value);
    if (response?.status === 200) {
      const movement = response.data.movement;

      Object.assign(dataMovement, {
        value: String(movement.value),
        date: String(movement.date).replace(/-/g, '/'),
        description: movement.description ?? '',
      });

      selectedType.value =
        movement.type === 'entry'
          ? {
              label: 'Entrada 🟩',
              value: 'entry',
            }
          : {
              label: 'Saída 🟥',
              value: 'out',
            };

      selectedCategory.value = movement.transaction_category_id
        ? {
            label: movement.category?.name ?? '',
            value: movement.category?.id ?? null,
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
  return loadingMovement.value || loadingCategoryTransaction.value;
});
const getlabelCategory = computed((): string => {
  return selectedCategory.value !== null ? 'Categoria' : 'Sem categoria definida';
});
const movementID = computed(() => props.data.movementID);
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
          :title="movementID ? 'Atualização de movimentação' : 'Cadastro de movimentação'"
          icon="sync_alt"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading v-show="isLoading" :show="isLoading" />
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
            v-model="dataMovement.value"
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
            v-model="dataMovement.date"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de movimentação"
            dense
            input-class="text-black no-spinners"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-if="!movementID"
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
            v-model="dataMovement.description"
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
            v-if="!movementID"
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
