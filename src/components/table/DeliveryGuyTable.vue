<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { useDeliveryGuyStore } from 'src/stores/delivery-guy-store';
import { columnsDeliveryGuy } from 'src/utils/columns';

defineOptions({
  name: 'DeliveryGuyTable',
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
  'show:showFormDeliveryGuy': [number];
}>();

const { loadingDeliveryGuy, listDeliveryGuy } = storeToRefs(useDeliveryGuyStore());

const showConfirmAction = ref<boolean>(false);
const deliveryGuyMonitoring = ref<number | null>(null);

const clear = (): void => {
  deliveryGuyMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  console.log('dksajldka', deliveryGuyMonitoring.value);
  await useDeliveryGuyStore().deleteDeliveryGuy(deliveryGuyMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  deliveryGuyMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (id: number) => {
  emit('show:showFormDeliveryGuy', id);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchDeliveryGuys = async (): Promise<void> => {
  await useDeliveryGuyStore().getDeliveryGuys();
};

onMounted(async () => {
  await fetchDeliveryGuys();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingDeliveryGuy ? [] : listDeliveryGuy"
      :columns="columnsDeliveryGuy"
      :filter="props.filter"
      :loading="loadingDeliveryGuy"
      title="Lista de entregadores"
      row-key="index"
      no-data-label="Nenhum entregador para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
      style="height: 460px"
      bordered
      flat
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
            <span class="text-body2 text-bold">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.name }}
          </q-td>
          <q-td key="cpf" :props="props" class="text-left">
            {{ props.row.cpf ?? '-' }}
          </q-td>
          <q-td key="email" :props="props" class="text-left">
            {{ props.row.email ?? '-' }}
          </q-td>
          <q-td key="phone" :props="props" class="text-left">
            {{ props.row.phone ?? '-' }}
          </q-td>
          <q-td key="vehicle" :props="props" class="text-left">
            {{ props.row.vehicle }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="startEdit(props.row.id)"
              :disable="deliveryGuyMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="deliveryGuyMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="red"
              icon="delete"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de entregador"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o entregador permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
