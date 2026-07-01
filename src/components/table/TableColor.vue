<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import Loading from '../shared/Loading.vue';
import { useColorStore } from 'src/stores/color-store';
import { columnsColor } from 'src/utils/columns';
import { usePermission } from 'src/composables/usePermission.js';

defineOptions({
  name: 'TableColor',
});

const emit = defineEmits<{
  'show:showFormColor': [IColor];
}>();

const { hasPermission } = usePermission();
const { loadingColor, listColor } = storeToRefs(useColorStore());

const showConfirmAction = ref<boolean>(false);
const colorMonitoring = ref<number | null>(null);
const filter = ref<string>('');

const clear = (): void => {
  colorMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useColorStore().deleteColor(colorMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  colorMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (data: IColor) => {
  emit('show:showFormColor', data);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchColors = async (): Promise<void> => {
  await useColorStore().getColors();
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

const columnsFiltered = computed(() => {
  const canSeeActions =
    hasPermission('product-color.update') || hasPermission('product-color.delete');

  if (!canSeeActions) {
    return columnsColor.filter((col) => col.name !== 'action');
  }

  return columnsColor;
});

onMounted(async () => {
  await fetchColors();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingColor"
      :rows="loadingColor ? [] : listColor"
      :columns="columnsFiltered"
      :filter="filter"
      :loading="loadingColor"
      title="Lista de cores"
      row-key="index"
      no-data-label="Nenhuma cor para mostrar"
      virtual-scroll
      :rows-per-page-options="[6]"
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
          <span class="text-body1">Lista de cores</span>
          <q-space />
          <q-input
            v-show="listColor.length > 0"
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
          <q-td key="hex_color_code" :props="props" class="text-left">
            <div class="cursor-pointer" :style="getColorStyle(props.row.hex_color_code)">
              <q-tooltip>{{ props.row.hex_color_code }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.name }}
          </q-td>
          <q-td key="active" :props="props" class="text-left">
            <q-icon
              :name="props.row.active === 1 ? 'check_circle' : 'close'"
              :color="props.row.active === 1 ? 'green' : 'red'"
              size="17px"
            />
          </q-td>
          <q-td
            v-if="hasPermission('product-color.update') || hasPermission('product-color.delete')"
            key="action"
            :props="props"
          >
            <q-btn
              v-if="hasPermission('product-color.update')"
              @click="startEdit(props.row)"
              :disable="colorMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              v-if="hasPermission('product-color.delete')"
              @click="startExclude(props.row.id)"
              :disable="colorMonitoring === props.row.id"
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

    <!-- Modals -->
    <Loading :show="loadingColor" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de cor"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a cor permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
