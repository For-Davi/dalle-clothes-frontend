<script setup lang="ts">
import { columnsProductVariant } from 'src/utils/columns';
import Empty from '../info/Empty.vue';
import { ref } from 'vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';

defineOptions({
  name: 'TableProductVariant',
});

const props = defineProps<{
  loading: boolean;
}>();
const emit = defineEmits<{
  'show:showConfigVariant': [void];
}>();

const listVariants = defineModel<IVModelProductVariant[]>('listVariants', { required: true });

const showConfirmAction = ref<boolean>(false);
const variantIndexMonitoring = ref<number | null>(null);

const isActive = (active: number): boolean => {
  return active === 1;
};
const closeConfirmActionOk = () => {
  showConfirmAction.value = false;

  if (variantIndexMonitoring.value !== null) {
    listVariants.value.splice(variantIndexMonitoring.value, 1);
    variantIndexMonitoring.value = null;
  }
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const openConfirmAction = (id: number): void => {
  variantIndexMonitoring.value = id;
  showConfirmAction.value = true;
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const getTextColors = (colors: number): string => {
  return colors <= 0 ? 'Sem cor' : colors === 1 ? '1 cor' : `${colors} cores`;
};
const showConfigVariant = () => {
  emit('show:showConfigVariant');
};
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-if="listVariants.length > 0"
      :rows="listVariants"
      :columns="columnsProductVariant"
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
          <q-space />
          <q-btn
            @click="showConfigVariant"
            icon="edit_note"
            label="Edição"
            color="secondary"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="size" :props="props" class="text-left">
            {{ props.row.gridItem.size }}
          </q-td>
          <q-td key="colors" :props="props" class="text-left">
            {{ getTextColors(props.row.colors.length) }}
          </q-td>
          <q-td key="active" :props="props" class="text-left">
            <q-icon
              :name="isActive(props.row.active) ? 'check_circle' : 'close'"
              :color="isActive(props.row.active) ? 'green' : 'red'"
              size="17px"
            />
          </q-td>
          <q-td key="action" :props="props">
              <q-btn
              :disable="variantIndexMonitoring === props.rowIndex"
              size="sm"
              flat
              round
              color="black"
              icon="visibility"
            >
              <q-tooltip class="bg-grey-2 text-primary text-bold">Detalhes</q-tooltip>
            </q-btn>
            <q-btn
              @click="startExclude(props.rowIndex)"
              :disable="variantIndexMonitoring === props.rowIndex"
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
    <Empty v-else message="Sem variantes cadastradas" color="bg-red-3" />

    <!-- Modals -->
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de variante"
      message="Antes de continuar, esteja ciente que esta ação removerá a variante da lista, sendo ainda necessário 'SALVAR' definitivamente para atualizar a lista. Caso mude de ideia e queira manter as variantes atuais, basta fechar esta janela sem confirmar e ao reabri-la, as variantes originais permanecerão inalteradas. Deseja realmente prosseguir com a exclusão?."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
