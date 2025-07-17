<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import Loading from '../shared/Loading.vue';
import { columnsTag } from 'src/utils/columns';
import { useTagStore } from 'src/stores/tag-store';

defineOptions({
  name: 'TableTag',
});

const emit = defineEmits<{
  'show:showFormTag': [ITag];
}>();

const { loadingTag, listTag } = storeToRefs(useTagStore());

const showConfirmAction = ref<boolean>(false);
const tagMonitoring = ref<number | null>(null);
const filter = ref<string>('');

const clear = (): void => {
  tagMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useTagStore().deleteTag(tagMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  tagMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (data: ITag) => {
  emit('show:showFormTag', data);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchTags = async (): Promise<void> => {
  await useTagStore().getTags();
};

onMounted(async () => {
  await fetchTags();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingTag"
      :rows="loadingTag ? [] : listTag"
      :columns="columnsTag"
      :filter="filter"
      :loading="loadingTag"
      title="Lista de tags"
      row-key="index"
      no-data-label="Nenhuma tag para mostrar"
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
          <span class="text-body1">Lista de tags</span>
          <q-space />
          <q-input
            v-show="listTag.length > 0"
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
          <q-td key="active" :props="props" class="text-left">
            <q-icon
              :name="props.row.active === 1 ? 'check_circle' : 'close'"
              :color="props.row.active === 1 ? 'green' : 'red'"
              size="17px"
            />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="startEdit(props.row)"
              :disable="tagMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="tagMonitoring === props.row.id"
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
    <Loading :show="loadingTag" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de tag"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a tag permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
