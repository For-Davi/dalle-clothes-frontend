<script setup lang="ts">
import { computed, reactive } from 'vue'
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';

defineOptions({
   name: 'FormReceipt'
})

const props = defineProps<{
    open: boolean
}>();

const emit = defineEmits<{
    'update:open':[void]
}>()

const { listTypesReceipt } = storeToRefs(useTypesReceiptStore())

const dataReceipt = reactive({
  identifier: '' as string,
  type:{ label:'Nenhum selecionado', value: null },
  description:'' as string,

})

const optionsCategory = computed((): IQuasarSelect<number | null>[] => {
  return [
    {
      label: 'Nenhum selecionado',
      value: null,
    },
       ...listTypesReceipt.value.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    }),
  ];
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage
          title="Cadastro de recebimento"
          icon="account_balance"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
          v-model="dataReceipt.identifier"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do recebimento (Identificador)"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
          v-model="dataReceipt.type"
            label="Selecione o tipo"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="full-width"
            :options="optionsCategory"
          >
            <template v-slot:prepend>
              <q-icon name="credit_card" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
          v-model="dataReceipt.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição"
            dense
            input-class="text-black"
            type="textarea"
          >
          <template v-slot:prepend>
          <q-icon name="description" color="black" size="20px" />
          </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
