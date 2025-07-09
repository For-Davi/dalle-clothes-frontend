<script setup lang="ts">
import { columnsMountGrid } from 'src/utils/columns';

defineOptions({
  name: 'TableMountGrid',
});

const props = defineProps<{
  items: IGridItemCreate[];
}>();
const emit = defineEmits<{
  setNewOrder: [itemOrder: number, newPosition: 'up' | 'bellow'];
  deleteItem: [itemOrder: number];
}>();

const isEnd = (order: number): boolean => {
  return order === props.items.length;
};
const isStart = (order: number): boolean => {
  return order === 1;
};
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      :rows="props.items"
      :columns="columnsMountGrid"
      title="Lista de tamanhos"
      row-key="index"
      no-data-label="Nenhum tamanho para mostrar"
      virtual-scroll
      :rows-per-page-options="[5]"
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
          <q-td key="order" :props="props" class="text-left">
            {{ props.row.order }}
          </q-td>
          <q-td key="size" :props="props" class="text-left">
            {{ props.row.size }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              v-show="!isEnd(props.row.order)"
              @click="emit('setNewOrder', props.row.order, 'bellow')"
              size="sm"
              round
              flat
              color="purple"
            >
              <q-icon name="arrow_drop_down" size="30px" />
            </q-btn>
            <q-btn
              v-show="!isStart(props.row.order)"
              @click="emit('setNewOrder', props.row.order, 'up')"
              size="sm"
              flat
              round
              color="green"
            >
              <q-icon name="arrow_drop_up" size="30px" />
            </q-btn>
            <q-btn @click="emit('deleteItem', props.row.order)" size="sm" flat round color="red">
              <q-icon name="delete" size="16px" />
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
