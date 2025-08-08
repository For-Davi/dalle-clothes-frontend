<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataCategoryTransaction } from 'src/composables/CheckData';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';

defineOptions({
  name: 'FormTypesAccount',
});

const props = defineProps<{
  data: {
    open: boolean;
    type: ITypesAccount | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCategoryTransaction } = storeToRefs(useCategoryTransactionStore());

const dataType = reactive({
  name: '' as string,
});

const clear = (): void => {
  Object.assign(dataType, {
    name: '',
  });
};
const save = async () => {
  const check = checkDataCategoryTransaction(dataType);
  if (check.status) {
    const response = await useCategoryTransactionStore().createCategoryTransaction(
      dataType.name,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do tipo');
  }
};
const update = async () => {
  const check = checkDataCategoryTransaction(dataType);
  if (check.status) {
    const response = await useCategoryTransactionStore().updateCategoryTransaction(
      typeID.value ?? 0,
      dataType.name,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do tipo');
  }
};
const checkDataEdit = () => {
  if (props.data.type) {
    Object.assign(dataType, {
      name: props.data.type.name,
    });
  }
};

const typeID = computed(() => props.data.type?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 350px"
      :style="loadingCategoryTransaction ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="typeID ? 'Atualização de tipo' : 'Cadastro de tipo'"
          icon="list_alt"
        />
      </q-card-section>
      <Loading :show="loadingCategoryTransaction" />
      <q-card-section class="q-pa-sm" v-show="!loadingCategoryTransaction">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataType.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Tipo de conta"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="credit_card" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingCategoryTransaction">
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
            v-if="!typeID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingCategoryTransaction"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingCategoryTransaction"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
