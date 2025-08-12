<script setup lang="ts">
import { columnsMedia } from 'src/utils/columns';
import Empty from '../info/Empty.vue';
import { ref } from 'vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';

defineOptions({
  name: 'TableProductMedia',
});

const props = defineProps<{
  loading: boolean;
}>();

const listMedia = defineModel<IMediaItem[]>('listMedia', { required: true });
const listMediaDelete = defineModel<{ id: number }[]>('listMediaDelete', { required: true });

const showConfirmAction = ref<boolean>(false);
const mediaIndexMonitoring = ref<number | null>(null);

const closeConfirmActionOk = () => {
  showConfirmAction.value = false;

  if (mediaIndexMonitoring.value !== null) {
    const mediaItem = listMedia.value[mediaIndexMonitoring.value];
    if (isIImage(mediaItem)) {
      listMediaDelete.value.push({ id: mediaItem.id });
    }

    listMedia.value.splice(mediaIndexMonitoring.value, 1);
    mediaIndexMonitoring.value = null;
  }
};
const isIImage = (item: IMediaItem): item is IImage => {
  return (item as IImage).id !== undefined;
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  mediaIndexMonitoring.value = null;
};
const openConfirmAction = (index: number): void => {
  mediaIndexMonitoring.value = index;
  showConfirmAction.value = true;
};
const startExclude = (index: number) => {
  openConfirmAction(index);
};
const getImageUrl = (file: File | ICustomFile | IImage): string => {
  if ('url' in file && file.url) {
    return file.url;
  }

  if (file instanceof File) {
    return URL.createObjectURL(file);
  }

  return 'img' in file && file.img ? file.img : '';
};
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-if="listMedia.length > 0"
      :rows="listMedia"
      :columns="columnsMedia"
      :loading="props.loading"
      row-key="index"
      no-data-label="Nenhuma imagem para mostrar"
      virtual-scroll
      :rows-per-page-options="[3]"
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
          <q-td key="size" :props="props" class="text-left">
            {{ formatFileSize(props.row.size) }}
          </q-td>
          <q-td key="image" :props="props" class="text-left">
            <q-img :src="getImageUrl(props.row)" style="height: 100%; width: 100px" />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="startExclude(props.rowIndex)"
              :disable="mediaIndexMonitoring === props.rowIndex"
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
    <Empty v-else message="Sem imagens cadastradas" color="bg-red-3" type-img="file" />

    <!-- Modals -->
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de imagem"
      message="Antes de continuar, esteja ciente que esta ação removerá a imagem da lista, sendo ainda necessário 'SALVAR' definitivamente para atualizar a lista. Caso mude de ideia e queira manter as imagens atuais, basta fechar esta janela sem confirmar e ao reabri-la, as imagens originais permanecerão inalteradas. Deseja realmente prosseguir com a exclusão?."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
