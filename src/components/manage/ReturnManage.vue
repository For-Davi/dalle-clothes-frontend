<script setup lang="ts">
import { computed, reactive } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import TableReturn from '../table/TableReturn.vue';
import FormReturn from '../form/FormReturn.vue';

defineOptions({
  name: 'ReturnManage',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const showFormReturn = reactive({
  open: false as boolean,
  saleID: null as number | null,
});

const changeShowFormReturn = (open: boolean, saleID: number | null = null) => {
  Object.assign(showFormReturn, {
    open,
    saleID,
  });
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Devoluções" icon="fa-solid fa-box" />
      </q-card-section>
      <q-card-section>
        <TableReturn />
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
            @click="changeShowFormReturn(true, props.data.saleID)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
  <FormReturn :data="showFormReturn" @update:open="changeShowFormReturn(false)" />
</template>
