<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import TableColor from '../table/TableColor.vue';
import FormColor from '../form/FormColor.vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { useColorStore } from 'src/stores/color-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'ColorManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingColor, listColor } = storeToRefs(useColorStore());

const showFormColor = reactive<{
  open: boolean;
  color: IColor | null;
}>({
  open: false,
  color: null,
});

const clear = () => {
  Object.assign(showFormColor, {
    open: false,
    color: null,
  });
};

const startEdit = (data: IColor) => {
  changeShowFormColor(true, data);
};
const changeShowFormColor = (show: boolean, color: IColor | null = null): void => {
  Object.assign(showFormColor, {
    open: show,
    color: color,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de cores" icon="colorize" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingColor">
          <TableColor v-show="listColor.length > 0" @show:show-form-color="startEdit" />
          <Empty v-show="listColor.length <= 0" message="Sem cores cadastradas" color="bg-red-3" />
        </div>
        <Loading v-show="loadingColor" :show="loadingColor" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
          <q-btn
            @click="changeShowFormColor(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormColor :data="showFormColor" @update:open="changeShowFormColor(false)" />
    </q-card>
  </q-dialog>
</template>
