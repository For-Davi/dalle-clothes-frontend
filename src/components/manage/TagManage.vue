<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import FormTag from '../form/FormTag.vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useTagStore } from 'src/stores/tag-store';
import TableTag from '../table/TableTag.vue';

defineOptions({
  name: 'TagManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingTag, listTag } = storeToRefs(useTagStore());

const showFormTag = reactive<{
  open: boolean;
  tag: ITag | null;
}>({
  open: false,
  tag: null,
});

const clear = () => {
  Object.assign(showFormTag, {
    open: false,
    tag: null,
  });
};

const startEdit = (data: ITag) => {
  changeShowFormTag(true, data);
};
const changeShowFormTag = (show: boolean, tag: ITag | null = null): void => {
  Object.assign(showFormTag, {
    open: show,
    tag: tag,
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
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de tags" icon="tag" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingTag">
          <TableTag v-show="listTag.length > 0" @show:show-form-tag="startEdit" />
          <Empty v-show="listTag.length <= 0" message="Sem tags cadastradas" color="bg-red-3" />
        </div>
        <Loading v-show="loadingTag" :show="loadingTag" />
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
            v-if="hasPermission('product-tag.create')"
            @click="changeShowFormTag(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormTag :data="showFormTag" @update:open="changeShowFormTag(false)" />
    </q-card>
  </q-dialog>
</template>
