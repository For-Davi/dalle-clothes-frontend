<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import TypesAccountManage from 'src/components/manage/TypesAccountManage.vue';
import { reactive, ref } from 'vue';
defineOptions({
  name: 'Account',
});

const showTypeAccountManage = ref<boolean>(false)
const filterAccount = ref<string>('');
const columnsAccount = reactive<IQuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'bank',
    label: 'Banco',
    field: 'bank',
    align: 'left',
  },
  {
    name: 'account',
    label: 'Conta',
    field: 'account',
    align: 'left',
  },
  {
    name: 'agency',
    label: 'Agência',
    field: 'agency',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);
const rows = [
  {
    name: 'Caixa',
    type: 'Conta poupança',
    bank: 'Banco do Brasil',
    account: 510654,
    agency: 1941,
    active: 1,
  },
  {
    name: 'Mercado pago',
    type: 'Cartão de crédito',
    bank: null,
    account: null,
    agency: null,
    active: 0,
  },
  {
    name: 'Banco XYZ',
    type: 'Cartão de crédito',
    bank: 'Santander',
    account: 154206,
    agency: 1236,
    active: 1,
  },
];

const changeShowTypeAccountManage = () => {
  showTypeAccountManage.value = !showTypeAccountManage.value
}
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Contas" icon="account_balance" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Nova conta"
          icon-right="add"
          no-caps
        />

        <q-btn
        color="white"
        text-color="black"
        label="Tipos"
        no-caps
        icon-right="credit_card "
         class="q-ml-sm"
         @click="changeShowTypeAccountManage"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterAccount"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
        </div>
      </q-banner>
      <q-table
        :rows="rows"
        :columns="columnsAccount"
        :filter="filterAccount"
        :loading="false"
        title="Lista de contas"
        row-key="index"
        no-data-label="Nenhuma conta para mostrar"
        virtual-scroll
        :rows-per-page-options="[10]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
              <span class="text-body2 text-bold">{{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props" class="text-left">
              {{ props.row.name }}
            </q-td>
            <q-td key="type" :props="props" class="text-left">
              {{ props.row.type }}
            </q-td>
            <q-td key="bank" :props="props" class="text-left">
              {{ props.row.bank }}
            </q-td>
            <q-td key="account" :props="props" class="text-left">
              {{ props.row.account }}
            </q-td>
            <q-td key="agency" :props="props" class="text-left">
              {{ props.row.agency }}
            </q-td>
            <q-td key="active" :props="props" class="text-left">
              <q-icon
                :name="props.row.active === 1 ? 'check_circle' : 'close'"
                :color="props.row.active === 1 ? 'green' : 'red'"
                size="17px"
              />
            </q-td>
            <q-td key="action" :props="props">
              <q-btn :disable="false" size="sm" flat round color="blue" icon="change_circle">
                <q-tooltip>Trocar ativação</q-tooltip>
              </q-btn>
              <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
              <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </section>


    <!-- Modals -->
    <TypesAccountManage :open="showTypeAccountManage" @update:open="changeShowTypeAccountManage"/>
  </main>
</template>
