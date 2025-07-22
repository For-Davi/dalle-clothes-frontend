<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useTagStore } from 'src/stores/tag-store';

defineOptions({
  name: 'ProductTag',
});

const props = defineProps<{
  loading: boolean;
}>();
const list = defineModel<ITag[]>('listTag', { required: true });

const { listTag } = storeToRefs(useTagStore());
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Seleção de tags" icon="list_alt" />
    </q-card-section>
    <Loading :show="props.loading" />
    <q-card-section class="q-pa-sm" v-show="!props.loading">
      <q-form class="q-gutter-y-sm column">
        <q-select
          v-model="list"
          outlined
          bg-color="white"
          label-color="black"
          multiple
          :options="listTag"
          option-label="name"
          option-value="id"
          label="Tags"
          dense
          options-selected-class="bg-green-1 text-black"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>
