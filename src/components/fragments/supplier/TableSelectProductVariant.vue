<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import SupplierCart from 'src/components/cart/SupplierCart.vue';

defineOptions({
  name: 'TableTag',
});

const props = defineProps<{
  open: boolean;
  loading: boolean;
  list: IProduct[];
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const selected = defineModel<IProduct[]>('selected', { required: true });

const makeList = (list: ISupplierCartProduct[]) => {
  console.log('makeList', list);
  selected.value = list;
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de itens" icon="list_alt" />
      </q-card-section>
      <q-card-section class="q-pa-md">
        selected {{ selected }}
        <SupplierCart @send-cart="makeList" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-md">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            class="q-mr-sm"
            @click="open = false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
