<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { useClientStore } from 'src/stores/client-store';
import { columnsClient } from 'src/utils/columns';
import { formatToReal } from 'src/composables/Money';
import { formatToBrazilianDate } from 'src/composables/FormatData';

defineOptions({
  name: 'TableClient',
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
  'show:showFormClient': [number];
}>();

const { loadingClient, listClient } = storeToRefs(useClientStore());

const showConfirmAction = ref<boolean>(false);
const clientMonitoring = ref<number | null>(null);

const clear = (): void => {
  clientMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useClientStore().deleteClient(clientMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  clientMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (id: number) => {
  emit('show:showFormClient', id);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchClients = async (): Promise<void> => {
  await useClientStore().getClients();
};

onMounted(async () => {
  await fetchClients();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingClient ? [] : listClient"
      :columns="columnsClient"
      :filter="props.filter"
      :loading="loadingClient"
      title="Lista de clientes"
      row-key="index"
      no-data-label="Nenhum cliente para mostrar"
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
        <q-tr :props="props">
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props" class="text-left">
            {{ props.row.email }}
          </q-td>
          <q-td key="phone" :props="props" class="text-left">
            {{ props.row.phone }}
          </q-td>
          <q-td key="date_birthday" :props="props" class="text-left">
            {{ props.row.date_birthday }}
          </q-td>
          <q-td key="credit" :props="props" class="text-left">
            {{ formatToReal(props.row.credits) }}
          </q-td>
          <q-td key="credit_expires_at" :props="props" class="text-left">
            {{
              props.row.credit_expires_at ? formatToBrazilianDate(props.row.credit_expires_at) : '-'
            }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="startEdit(props.row.id)"
              :disable="clientMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="clientMonitoring === props.row.id"
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
      title="Confirmação de exclusão de cliente"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o cliente permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
