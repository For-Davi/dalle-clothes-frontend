<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from '@/types/Quasar';
import { reactive, ref } from 'vue';
defineOptions({
  name: 'Client',
});

const filterClient = ref<string>('');
// const selectedActive = ref<QuasarSelect<number>>({
//   label: 'Todos',
//   value: 2,
// });
// const optionsActive = reactive<QuasarSelect<number>[]>([
//   {
//     label: 'Todos',
//     value: 2,
//   },
//   {
//     label: 'Ativos',
//     value: 1,
//   },
//   {
//     label: 'Inativos',
//     value: 0,
//   },
// ]);
const columnsClient = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'total_buy',
    label: 'Total comprado',
    field: 'total_buy',
    align: 'left',
  },
  {
    name: 'date_birthday',
    label: 'Aniversário',
    field: 'date_birthday',
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
    name: 'Joao Duarte',
    email: 'joao@gmail.com',
    phone: '85981405230',
    total_buy: 1200,
    date_birthday: '10/04/2025',
  },
  {
    name: 'Maria Silva',
    email: 'maria@gmail.com',
    phone: '85981402255',
    total_buy: 950,
    date_birthday: '08/05/2025',
  },
  {
    name: 'Marcio Lucas',
    email: 'marcio@gmail.com',
    phone: '85987465698',
    total_buy: 1060,
    date_birthday: '06/04/2025',
  },
  {
    name: 'Sandro Fael',
    email: 'sandro@gmail.com',
    phone: '8596352012',
    total_buy: 160,
    date_birthday: '03/04/2025',
  },
];
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Clientes" icon="groups" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Novo cliente"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row justify-end q-gutter-x-sm items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterClient"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge floating color="red" rounded />
          </q-btn>
          <!-- <q-select
            outlined
            v-model="selectedActive"
            dense
            :options="optionsActive"
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon
                :name="
                  selectedActive.value == 1
                    ? 'check_circle'
                    : selectedActive.value == 2
                      ? 'done_all'
                      : 'close'
                "
                size="20px"
                :color="
                  selectedActive.value == 1 ? 'green' : selectedActive.value == 2 ? 'blue' : 'red'
                "
              />
            </template>
          </q-select> -->
        </div>
      </q-banner>
      <q-table
        :rows="rows"
        :columns="columnsClient"
        :filter="filterClient"
        :loading="false"
        title="Lista de clientes"
        row-key="index"
        no-data-label="Nenhum cliente para mostrar"
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
            <q-td key="email" :props="props" class="text-left">
              {{ props.row.email }}
            </q-td>
            <q-td key="phone" :props="props" class="text-left">
              {{ props.row.phone }}
            </q-td>
            <q-td key="total_buy" :props="props" class="text-left">
              R$ {{ props.row.total_buy }}
            </q-td>
            <q-td key="date_birthday" :props="props" class="text-left">
              {{ props.row.date_birthday }}
            </q-td>
            <q-td key="active" :props="props" class="text-left">
              <q-icon
                :name="props.row.active === 1 ? 'check_circle' : 'close'"
                :color="props.row.active === 1 ? 'green' : 'red'"
                size="17px"
              />
            </q-td>
            <q-td key="action" :props="props">
              <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
              <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </section>
  </main>
</template>
