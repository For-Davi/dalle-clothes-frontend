<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import TableProductVariant from 'src/components/table/TableProductVariant.vue';
import { useGridStore } from 'src/stores/grid-store';
import { computed, reactive, ref } from 'vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import ConfigVariant from './ConfigVariant.vue';

defineOptions({
  name: 'ProductVariant',
});

const props = defineProps<{
  loading: boolean;
  gridGroupId: number | null;
}>();

const listVariants = defineModel<IVModelProductVariant[]>('listVariants', { required: true });
const gridModel = defineModel<IQuasarSelect<number | null>>('gridModel', { required: true });

const { listGrid } = storeToRefs(useGridStore());

const showConfirmAction = ref<boolean>(false);
const lastGridSelection = ref<IQuasarSelect<number | null> | null>(null);
const showConfigVariant = reactive<{
  open: boolean;
  variants: IProductVariant[];
}>({
  open: false,
  variants: [],
});

const generateVariants = (): void => {
  listVariants.value = [];

  const selectedGrid = listGrid.value.find((item) => item.id === gridModel.value?.value);
  if (!selectedGrid?.items?.length) return;

  const newVariants = selectedGrid.items.map((item) => ({
    price: '0',
    cost: '0',
    stockQuantity: '0',
    minStockAlert: '0',
    sku: '',
    active: 1,
    description: '',
    location: '',
    gridItem: {
      id: item.id,
      size: item.size,
    },
    colors: [],
  }));

  listVariants.value = newVariants;
};
const closeConfirmActionOk = () => {
  listVariants.value = [];
  showConfirmAction.value = false;
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  gridModel.value = {
    label: lastGridSelection.value?.label ?? '',
    value: lastGridSelection.value?.value ?? 0,
  };
};
const openConfirmAction = (): void => {
  showConfirmAction.value = true;
};
const handleGridUpdate = (newVal: IQuasarSelect<number | null>) => {
  if (newVal.value === null) {
    openConfirmAction();
    return;
  }
  lastGridSelection.value = newVal;
};
const changeShowConfigVariant = (show: boolean): void => {
  Object.assign(showConfigVariant, {
    open: show,
    variants: listVariants.value,
  });
};
const makeConfigVariant = (): void => {
  changeShowConfigVariant(!showConfigVariant.open);
};

const listGridSelect = computed((): IQuasarSelect<number | null>[] => {
  const options = listGrid.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return [{ label: 'Nenhuma selecionada', value: null }, ...options];
});
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Variantes" icon="pin" />
    </q-card-section>
    <q-card-section class="q-pa-sm column q-gutter-y-sm" v-show="!props.loading">
      <q-select
        outlined
        v-model="gridModel"
        map-options
        options-dense
        :options="listGridSelect"
        label="Selecione a grade"
        bg-color="white"
        label-color="black"
        dense
        @update:model-value="handleGridUpdate"
      >
        <template v-slot:prepend>
          <q-icon name="pin" color="black" size="20px" />
        </template>
      </q-select>
      <q-btn
        @click="generateVariants"
        :disable="gridModel.value === null"
        color="green-9"
        label="Gerar variantes"
        class="full-width"
        size="md"
        unelevated
        no-caps
      />
      <TableProductVariant
        :loading="loading"
        v-model:listVariants="listVariants"
        @show:show-config-variant="makeConfigVariant"
      />
    </q-card-section>

    <!-- Modals -->
    <ConfigVariant
      :open="showConfigVariant.open"
      v-model:listVariants="showConfigVariant.variants"
      @update:open="makeConfigVariant"
    />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de seleção de grade vazia"
      message="Antes de continuar, esteja ciente que esta ação removerá permanentemente todas as variantes da lista. Caso mude de ideia e queira manter as configurações atuais, basta fechar esta janela sem confirmar e ao reabri-la, as variantes originais permanecerão inalteradas. Deseja realmente prosseguir com a limpeza?."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </q-card>
</template>
