<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataReturnEditStatus } from 'src/composables/CheckData';
import { useReturnStore } from 'src/stores/return-store';

defineOptions({
  name: 'FormReturnEditStatus',
});

const props = defineProps<{
  data: {
    open: boolean;
    editData: IEditReturnData | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingReturn } = storeToRefs(useReturnStore());

const dataStatus = reactive({
  status: '' as string,
});

const update = async () => {
  const check = checkDataReturnEditStatus(dataStatus);
  if (check.status) {
    const response = await useReturnStore().updateReturn(
      returnID.value ?? 0,
      saleID.value ?? 0,
      dataStatus.status,
    );
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da edição da devolução');
  }
};
const checkDataEdit = () => {
  if (props.data.editData) {
    Object.assign(dataStatus, {
      status: props.data.editData.status,
    });
  }
};

const optionsStatus = computed(() => {
  return [
    {
      label: 'Ativa',
      value: 'Ativa',
    },
    {
      label: 'Cancelada',
      value: 'Cancelada',
    },
  ];
});
const returnID = computed(() => props.data.editData?.id);
const saleID = computed(() => props.data.editData?.saleID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    checkDataEdit();
    console.log('props', props.data.editData);
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 350px"
      :style="loadingReturn ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Edição da devolução" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingReturn" />
      <q-card-section class="q-pa-sm" v-show="!loadingReturn">
        <q-form class="q-gutter-y-sm">
          <q-select
            v-model="dataStatus.status"
            :options="optionsStatus"
            label="Selecione o status"
            outlined
            dense
            options-dense
            emit-value
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="flag" color="primary" size="20px" />
            </template>
          </q-select>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingReturn">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingReturn"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
