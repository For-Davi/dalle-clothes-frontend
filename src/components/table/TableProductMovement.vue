<script setup lang="ts">
import { useProductStore } from 'src/stores/product-store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { columnsProductMovement } from 'src/utils/columns';
import { ref } from 'vue';

defineOptions({
  name: 'TableProductMovement',
});

const props = defineProps<{
  productVariantID: number | null;
}>();
const emit = defineEmits<{
  'show:movementProductDetails': [number];
}>();

const { loadingProductMovement, listProductMovement } = storeToRefs(useProductStore());

const filter = ref<string>('');

const startShowProductMovement = (id: number) => {
  emit('show:movementProductDetails', id);
};
const fetchProductsMovement = async () => {
  await useProductStore().getProductMovement(props.productVariantID ?? 0);
};

onMounted(async () => {
  await fetchProductsMovement();
});
</script>

<template>
  <section>
    <q-table
      :rows="loadingProductMovement ? [] : listProductMovement"
      :columns="columnsProductMovement"
      :loading="loadingProductMovement"
      :pagination="{ sortBy: 'created_at', descending: true }"
      :filter="filter"
      row-key="index"
      no-data-label="Nenhuma movimentação de produto para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
      dense
      title="Lista de movimentações de produto"
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
      <template v-slot:top>
        <div class="row justify-between items-center full-width">
          <span class="text-body1">Lista movimentações do produto</span>
          <q-space />
          <q-input
            v-show="listProductMovement.length > 0"
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
        <q-tr :props="props">
          <q-td key="reason" :props="props" class="text-left">
            {{ props.row.reason }}
          </q-td>
          <q-td key="status" :props="props" class="text-left">
            <q-icon
              :name="props.row.status === 'Ativa' ? 'check_circle' : 'close'"
              :color="props.row.status === 'Ativa' ? 'green' : 'red'"
              class="cursor-pointer q-px-xs"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.status === 'Ativa' ? 'Ativa' : 'Cancelada'
              }}</q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="type" :props="props" class="text-left">
            <span :class="props.row.type === 'Entrada' ? 'text-positive' : 'text-negative'">
              {{ props.row.type }}
            </span>
          </q-td>
          <q-td key="document_number" :props="props" class="text-left">
            {{ props.row.document_number ?? '-' }}
          </q-td>
          <q-td key="lot_number" :props="props" class="text-left">
            {{ props.row.lot_number ?? '-' }}
          </q-td>
          <q-td key="created_by_name" :props="props" class="text-left">
            {{ props.row.created_by_name }}
          </q-td>
          <q-td key="updated_by_name" :props="props" class="text-left">
            {{ props.row.updated_by_name ?? '-' }}
          </q-td>
          <q-td key="created_at" :props="props" class="text-left">
            {{ props.row.created_at }}
          </q-td>
          <q-td key="updated_at" :props="props" class="text-left">
            {{ props.row.updated_at === props.row.created_at ? '-' : props.row.updated_at }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              @click="startShowProductMovement(props.row.id)"
              size="sm"
              flat
              round
              color="primary"
              icon="visibility"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
