<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import Loading from '../shared/Loading.vue';
import { checkReceiptData } from 'src/composables/CheckData';

defineOptions({
   name: 'FormReceipt'
})

const props = defineProps<{
   data: {
    open: boolean,
    receipt: IReceipt | null
   }
}>();

const emit = defineEmits<{
    'update:open':[void]
}>()

const { listTypesReceipt } = storeToRefs(useTypesReceiptStore())
const { loadingReceipt } = storeToRefs(useReceiptstore())

const dataReceipt = reactive({
  identifier: '' as string,
  type:{ label:'Nenhum selecionado', value: null },
  description:'' as string,
})

const clear = () => {
  dataReceipt.identifier = '';
  dataReceipt.type = { label:'Nenhum selecionado', value: null };
  dataReceipt.description = '';
}
const save = async () => {
  const check = checkReceiptData(dataReceipt)

  if (check.status) {
    const response = await useReceiptstore().createReceipt({
      identifier: dataReceipt.identifier,
      typesID: dataReceipt.type.value,
      description: dataReceipt.description || null
    })

    if(response?.status === 201) {
      emit('update:open')
    }
  }
}
const checkDataEdit = () => {
  if (props.data.receipt) {
    const typeObj = optionsCategory.value.find(
      (item) => item.value === props.data.receipt?.typesID
    ) || { label: 'Nenhum selecionado', value: null };

    Object.assign(dataReceipt, {
      identifier: props.data.receipt.identifier,
      type: typeObj,
      description: props.data.receipt.description || ''
    });
  }
};


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
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open,() => {
 if(open.value) {
  clear()
  checkDataEdit()
 }
 })
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
        <Loading :show="loadingReceipt"/>
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
            counter
            :maxlength="500"
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
            @click="open = false"
            flat
            unelevated
            no-caps
          />
          <q-btn
          v-if="props.data.receipt?.id"
            color="primary"
            label="Salvar"
            @click="save"
            :loading="loadingReceipt"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
          v-else
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
