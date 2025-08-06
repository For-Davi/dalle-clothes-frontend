<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import TableProductVariantEdit from 'src/components/table/TableProductVariantEdit.vue';

defineOptions({
  name: 'ProductVariantEdit',
});

const props = defineProps<{
  loading: boolean;
}>();
const emit = defineEmits<{
  'show:showFormVariant': [number];
}>();

const listVariants = defineModel<IVariant[]>('listVariants', { required: true });
const gridModel = defineModel<IQuasarSelect<number | null>>('gridModel', { required: true });

const makeShowVariant = (id: number): void => {
  emit('show:showFormVariant', id);
};
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Variantes" icon="pin" />
    </q-card-section>
    <q-card-section class="q-pa-sm column q-gutter-y-sm" v-show="!props.loading">
      <q-select
        outlined
        v-model="gridModel"
        disable
        map-options
        options-dense
        :options="[]"
        label="Grade selecionada"
        bg-color="white"
        label-color="black"
        dense
      >
        <template v-slot:prepend>
          <q-icon name="pin" color="black" size="20px" />
        </template>
      </q-select>
      <TableProductVariantEdit
        :loading="loading"
        v-model:listVariants="listVariants"
        @show:show-variant="makeShowVariant"
      />
    </q-card-section>
  </q-card>
</template>
