<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import Loading from '../shared/Loading.vue';
import { columnsTypesAccount } from 'src/utils/columns';
import { useTypesAccountStore } from 'src/stores/types-account-store';

defineOptions({
  name: 'TableTypesAccount',
});

const emit = defineEmits<{
  'show:showFormTypeAccount': [ITypesAccount];
}>();

const { loadingTypesAccount, listTypesAccount } = storeToRefs(
  useTypesAccountStore(),
);

const showConfirmAction = ref<boolean>(false);
const typeMonitoring = ref<number | null>(null);
const filter = ref<string>('');

const clear = (): void => {
  typeMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useTypesAccountStore().deleteTypesAccount(typeMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  typeMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (data: ITypesAccount) => {
  emit('show:showFormTypeAccount', data);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchTypes = async (): Promise<void> => {
  await useTypesAccountStore().getTypesAccount();
};

onMounted(async () => {
  await fetchTypes();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingTypesAccount"
      :rows="loadingTypesAccount ? [] : listTypesAccount"
      :columns="columnsTypesAccount"
      :filter="filter"
      :loading="loadingTypesAccount"
      title="Lista de categorias"
      row-key="index"
      no-data-label="Nenhuma categoria para mostrar"
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
          <span class="text-body1">Lista de categorias</span>
          <q-space />
          <q-input
            v-show="listTypesAccount.length > 0"
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
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.name }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              @click="startEdit(props.row)"
              :disable="typeMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="typeMonitoring === props.row.id"
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
    <Loading :show="loadingTypesAccount" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de categoria"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o tipo permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
