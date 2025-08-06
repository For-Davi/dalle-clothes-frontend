<script setup lang="ts">
import { columnsProductVariantEdit } from 'src/utils/columns';
import Empty from '../info/Empty.vue';

defineOptions({
  name: 'TableProductVariantEdit',
});

const props = defineProps<{
  loading: boolean;
}>();
const emit = defineEmits<{
  'show:showVariant': [number];
}>();

const listVariants = defineModel<IVariant[]>('listVariants', { required: true });

const isActive = (active: number): boolean => {
  return active === 1;
};
const getColorStyle = (hexColor: string) => {
  return {
    backgroundColor: hexColor || 'transparent',
    width: '24px',
    height: '24px',
    border: '1px solid #ddd',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
};
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-if="listVariants.length > 0"
      :rows="listVariants"
      :columns="columnsProductVariantEdit"
      :loading="props.loading"
      title="Lista de variantes"
      row-key="index"
      no-data-label="Nenhuma variante para mostrar"
      virtual-scroll
      :rows-per-page-options="[6]"
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
      <template v-slot:top>
        <div class="row justify-between items-center full-width">
          <span class="text-body1">Lista de variantes</span>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="size" :props="props" class="text-left">
            <q-icon
              :name="isActive(props.row.active) ? 'check_circle' : 'close'"
              :color="isActive(props.row.active) ? 'green' : 'red'"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                isActive(props.row.active) ? 'Ativo' : 'Inativo'
              }}</q-tooltip>
            </q-icon>
            {{ props.row.grid_item.size }}
          </q-td>
          <q-td key="sku" :props="props" class="text-left">
            <span v-if="props.row.sku">{{ props.row.sku }}</span>
            <span v-else class="text-red">Sem SKU</span>
          </q-td>
          <q-td key="color" :props="props" class="text-left">
            <div
              v-if="props.row.color"
              class="cursor-pointer"
              :style="getColorStyle(props.row.color.hex_color_code)"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.color.name
              }}</q-tooltip>
            </div>
            <span v-else class="text-red">Sem cor</span>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="emit('show:showVariant', props.row.id)"
              size="sm"
              flat
              round
              color="black"
              icon="near_me"
            >
              <q-tooltip class="bg-grey-2 text-primary text-bold">Navegar</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <Empty v-else message="Sem variantes cadastradas" color="bg-red-3" />
  </section>
</template>
