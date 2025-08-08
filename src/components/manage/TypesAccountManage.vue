<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useTypesAccountStore } from 'src/stores/types-account-store';
import FormTypesAccount from '../form/FormTypesAccount.vue';
import TableTypesAccount from '../table/TableTypesAccount.vue';

defineOptions({
  name: 'TypesAccountManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingTypesAccount, listTypesAccount } = storeToRefs(
  useTypesAccountStore(),
);

const showFormTypeAccount = reactive<{
  open: boolean;
  type: ITypesAccount | null;
}>({
  open: false,
  type: null,
});

const clear = () => {
  Object.assign(showFormTypeAccount, {
    open: false,
    type: null,
  });
};
const startEdit = (data: ITypesAccount) => {
  changeShowFormTypeAccount(true, data);
};
const changeShowFormTypeAccount = (
  show: boolean,
  type: ICategoryTransaction | null = null,
): void => {
  Object.assign(showFormTypeAccount, {
    open: show,
    type: type,
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
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Tipos de contas" icon="credit_card" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingTypesAccount">
          <TableTypesAccount
            v-show="listTypesAccount.length > 0"
            @show:show-form-category-transaction="startEdit"
          />
          <Empty
            v-show="listTypesAccount.length <= 0 && !loadingTypesAccount"
            message="Sem tipos cadastrados"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingTypesAccount" />
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
            @click="changeShowFormTypeAccount(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormTypesAccount
        :data="showFormTypeAccount"
        @update:open="changeShowFormTypeAccount(false)"
      />
    </q-card>
  </q-dialog>
</template>
