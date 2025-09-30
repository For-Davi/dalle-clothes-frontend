<script setup lang="ts">
import { computed, ref } from 'vue';
import { columnsProductSelect } from 'src/utils/columns';
import TitlePage from 'src/components/shared/TitlePage.vue';

defineOptions({
  name: 'TableTag',
});

const props = defineProps<{
  open: boolean;
  loading: boolean;
  list: IProduct[];
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const selected = defineModel<IProduct[]>('selected', { required: true });
const filter = ref<string>('');

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
const isStockCritical = (stock: number | string): boolean => {
  return Number(stock) === 0;
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw;">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de itens" icon="list_alt" />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-table
          :rows="props.loading ? [] : props.list"
          :columns="columnsProductSelect"
          :filter="filter"
          :loading="props.loading"
          title="Lista de produtos"
          row-key="index"
          no-data-label="Nenhum produto para mostrar"
          virtual-scroll
          :rows-per-page-options="[6]"
          style="height: 460px"
          bordered
          flat
          selection="multiple"
          v-model:selected="selected"
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
              <span class="text-body1">Lista de produtos</span>
              <q-space />
              <q-input
                v-show="props.list.length > 0"
                v-model="filter"
                outlined
                dense
                label="Pesquisar"
                :class="!$q.screen.lt.md ? '' : 'q-mt-sm'"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </template>
          <template v-slot:body="props">
             <q-td key="name" :props="props" class="text-left">
            <q-icon
              :name="props.row.variant_active === 1 ? 'check_circle' : 'close'"
              :color="props.row.variant_active === 1 ? 'green' : 'red'"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.variant_active === 1 ? 'Ativo' : 'Inativo'
              }}</q-tooltip>
            </q-icon>
            {{ props.row.name }}
          </q-td>
          <q-td key="sku" :props="props" class="text-left">
            {{ props.row.sku }}
          </q-td>
          <q-td key="code" :props="props" class="text-left">
            {{ props.row.code }}
          </q-td>
          <q-td
            key="stock_quantity"
            :props="props"
            class="text-left"
            :class="isStockCritical(props.row.stock_quantity) ? 'text-red' : ''"
          >
            {{ props.row.stock_quantity }}
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
          </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right" >
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
          />

        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
