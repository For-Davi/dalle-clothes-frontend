<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/Quasar';
import { reactive, ref } from 'vue';
defineOptions({
  name: 'Supplier',
});

const filterSupplier = ref<string>('');
// const selectedActive = ref<QuasarSelect<number>>({
//   label: 'Todos',
//   value: 2,
// });
const showInformation = ref<number>(0);
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
const columnsSupplier = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
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
    name: 'Raul Bebidas',
    email: 'raul@gmail.com',
    phone: '(85)98180-4849',
    category: 'Bebidas',
    active: 1,
  },
  {
    name: 'Nort comidas',
    email: 'nort@gmail.com',
    phone: '(85)98740-4849',
    category: 'Comidas',
    active: 0,
  },
];

const setShowInformation = (index: number) => {
  showInformation.value = showInformation.value === index + 1 ? 0 : index + 1;
};
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Fornecedores" icon="list_alt" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Categorias"
          icon-right="category"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Compras"
          icon-right="paid"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Novo fornecedor"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterSupplier"
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
        :columns="columnsSupplier"
        :filter="filterSupplier"
        :loading="false"
        title="Lista de fornecedores"
        row-key="index"
        no-data-label="Nenhum fornecedor para mostrar"
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
          <q-tr :props="props" class="cursor-pointer">
            <q-td
              key="name"
              :props="props"
              class="text-left"
              @click="setShowInformation(props.rowIndex)"
            >
              {{ props.row.name }}
            </q-td>
            <q-td
              key="category"
              :props="props"
              class="text-left"
              @click="setShowInformation(props.rowIndex)"
            >
              {{ props.row.category }}
            </q-td>
            <q-td
              key="email"
              :props="props"
              class="text-left"
              @click="setShowInformation(props.rowIndex)"
            >
              {{ props.row.email }}
            </q-td>
            <q-td
              key="phone"
              :props="props"
              class="text-left"
              @click="setShowInformation(props.rowIndex)"
            >
              {{ props.row.phone }}
            </q-td>
            <q-td
              key="active"
              :props="props"
              class="text-left"
              @click="setShowInformation(props.rowIndex)"
            >
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
          <q-tr v-show="showInformation == props.rowIndex + 1" :props="props">
            <q-td colspan="100%" class="bg-grey-3">
              <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </section>
  </main>
</template>
