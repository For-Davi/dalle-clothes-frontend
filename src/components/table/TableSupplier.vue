<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSupplierStore } from 'src/stores/supplier-store';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { columnsSupplier } from 'src/utils/columns';

defineOptions({
  name: 'TableSupplier',
});

const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);
const emit = defineEmits<{
  'show:showFormSupplier': [number];
}>();

const { loadingSupplier, listSupplier } = storeToRefs(useSupplierStore());

const showConfirmAction = ref<boolean>(false);
const supplierMonitoring = ref<number | null>(null);
const showInformation = ref<number>(0);

const clear = (): void => {
  supplierMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useSupplierStore().deleteSupplier(supplierMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  supplierMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (id: number) => {
  emit('show:showFormSupplier', id);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchSuppliers = async (): Promise<void> => {
  await useSupplierStore().getSuppliers();
};
const setShowInformation = (index: number) => {
  showInformation.value = showInformation.value === index + 1 ? 0 : index + 1;
};

onMounted(async () => {
  await fetchSuppliers();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingSupplier ? [] : listSupplier"
      :columns="columnsSupplier"
      :filter="props.filter"
      :loading="loadingSupplier"
      title="Lista de fornecedores"
      row-key="index"
      no-data-label="Nenhum fornecedor para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
            <span class="text-body2 text-bold">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer">
          <q-td
            key="name"
            :props="props"
            class="text-left"
            @click="setShowInformation(props.rowIndex)"
          >
            {{ props.row.name }}
          </q-td>
          <q-td
            key="category"
            :props="props"
            class="text-left"
            @click="setShowInformation(props.rowIndex)"
          >
            {{ props.row.category }}
          </q-td>
          <q-td
            key="email"
            :props="props"
            class="text-left"
            @click="setShowInformation(props.rowIndex)"
          >
            {{ props.row.email }}
          </q-td>
          <q-td
            key="phone"
            :props="props"
            class="text-left"
            @click="setShowInformation(props.rowIndex)"
          >
            {{ props.row.phone }}
          </q-td>
          <q-td
            key="active"
            :props="props"
            class="text-left"
            @click="setShowInformation(props.rowIndex)"
          >
            <q-icon
              :name="props.row.active === 1 ? 'check_circle' : 'close'"
              :color="props.row.active === 1 ? 'green' : 'red'"
              size="17px"
            />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn :disable="false" size="sm" flat round color="primary" icon="storefront">
              <q-tooltip>Catálogo</q-tooltip>
            </q-btn>
            <q-btn
              @click="startEdit(props.row.id)"
              :disable="supplierMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="supplierMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="red"
              icon="delete"
            />
          </q-td>
        </q-tr>
        <q-tr v-show="showInformation == props.rowIndex + 1" :props="props">
          <q-td colspan="100%" class="bg-grey-3">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de fornecedor"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o fornecedor permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
