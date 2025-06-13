<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch } from 'vue';
import FormCategorySupplier from '../form/FormCategorySupplier.vue';
import TableCategorySupplier from '../table/TableCategorySupplier.vue';

defineOptions({
  name: 'DepartmentManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const tab = ref<'list' | 'form'>('list');
const dataEdit = ref<ICategorySupplier | null>(null);
const dataExcludeId = ref<number | null>(null);

const clear = () => {
  dataEdit.value = null;
  dataExcludeId.value = null;
};

const makeForm = (data: ICategorySupplier) => {
  dataEdit.value = data;
  tab.value = 'form';
};
const reset = (): void => {
  clear();
  tab.value = 'list';
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    tab.value = 'list';
    clear();
  }
});
watch(tab, () => {
  if (tab.value === 'list') {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de categorias" icon="group_work" />
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="height: 400px">
          <q-tabs v-model="tab" dense align="left" inline-label :breakpoint="0" no-caps>
            <q-tab
              label="Categorias"
              name="list"
              :class="tab == 'list' ? 'text-primary' : 'text-grey'"
              icon="list"
              @click.prevent.stop
            />
            <q-tab
              label="Formulário"
              name="form"
              :class="tab == 'form' ? 'text-primary' : 'text-grey'"
              icon="assignment"
              @click.prevent.stop
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated class="q-pa-none">
            <q-tab-panel name="list" class="q-px-none q-py-sm border-top-grey-light bg-grey-2">
              <TableCategorySupplier :mode="tab" @show:show-form-category="makeForm" />
            </q-tab-panel>
            <q-tab-panel name="form" class="q-px-none q-py-sm border-top-grey-light bg-grey-2">
              <FormCategorySupplier :mode="tab" :data-edit="dataEdit" @update:back-list="reset" />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
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
            :outline="tab === 'form'"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
