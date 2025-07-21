<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from 'src/components/shared/Loading.vue';
import TableProductVariant from 'src/components/table/TableProductVariant.vue';
import { useGridStore } from 'src/stores/grid-store';
import { computed, reactive, ref } from 'vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import FormVariant from 'src/components/form/FormVariant.vue';

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
const showFormVariant = reactive<{
  open: boolean;
  variant: IProductVariant | null;
}>({
  open: false,
  variant: null,
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
const changeShowFormVariant = (show: boolean, data: IProductVariant | null = null): void => {
  Object.assign(showFormVariant, {
    open: show,
    variant: data,
  });
};
const makeFormVariant = (data: IProductVariant) => {
  changeShowFormVariant(true, data);
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
  <q-card class="bg-grey-2" bordered flat style="max-width: 98vw; min-height: 350px">
    <q-card-section class="q-pa-none">
      <TitlePage title="Variantes" icon="pin" />
    </q-card-section>
    <Loading :show="props.loading" />
    <q-card-section class="q-pa-sm column q-gutter-y-sm" v-show="!props.loading">
      <q-select
        outlined
        v-model="gridModel"
        map-options
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
        :loading="false"
        v-model:listVariants="listVariants"
        @show:show-form-variant="makeFormVariant"
      />
    </q-card-section>

    <!-- Modals -->
    <FormVariant :data="showFormVariant" />
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
