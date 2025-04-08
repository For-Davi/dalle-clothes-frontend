<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/Quasar';
import { reactive, ref } from 'vue';
defineOptions({
  name: 'Employee',
});

const tab = ref<'employee' | 'delivery'>('employee');
const filterSupplier = ref<string>('');
const filterMotocyclist = ref<string>('');
const columnsSupplier = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'department',
    label: 'Departamento',
    field: 'department',
    align: 'left',
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
  },
  {
    name: 'date_birthday',
    label: 'Data de nascimento',
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
    name: 'Maria Assunção',
    department: 'Juridico',
    date_birthday: '02/04/2025',
    position: 'Advogado',
  },
  {
    name: 'Leo Pereira',
    department: 'Limpeza',
    date_birthday: '03/04/2025',
    position: 'Assistente de limpeza',
  },
];
const columnsMotocyclist = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'delivery',
    label: 'Entregas do mês',
    field: 'delivery',
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
const rowsMotocyclist = [
  {
    name: 'Carlos Davi',
    phone: '(85)98175-9726',
    delivery: 65,
    active: 1,
  },
  {
    name: 'Ellen Maria',
    phone: 'ellen@gmail.com',
    delivery: 15,
    active: 0,
  },
];
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Funcionários" icon="badge" />
      <div v-if="tab == 'employee'">
        <q-btn
          color="white"
          text-color="black"
          label="Cargos"
          icon-right="supervisor_account"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Departamentos"
          icon-right="group_work"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Novo funcionário"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
      <div v-else>
        <q-btn
          color="white"
          text-color="black"
          label="Novo entregador"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-tabs v-model="tab" dense align="left" :breakpoint="0" inline-label no-caps>
        <q-tab
          name="employee"
          icon="groups_3"
          label="Funcionários"
          :class="tab == 'employee' ? 'text-primary' : 'text-grey'"
        />
        <q-tab
          name="delivery"
          icon="directions_bike"
          label="Entregadores"
          :class="tab == 'delivery' ? 'text-primary' : 'text-grey'"
        />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="employee">
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
            </div>
          </q-banner>
          <q-table
            class="q-mt-sm"
            :rows="rows"
            :columns="columnsSupplier"
            :filter="filterSupplier"
            :loading="false"
            title="Lista de funcionários"
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
                <q-td key="name" :props="props" class="text-left">
                  {{ props.row.name }}
                </q-td>
                <q-td key="department" :props="props" class="text-left">
                  {{ props.row.department }}
                </q-td>
                <q-td key="position" :props="props" class="text-left">
                  {{ props.row.position }}
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
                  <q-btn :disable="false" size="sm" flat round color="blue" icon="visibility" />
                  <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
                  <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="delivery">
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
            </div>
          </q-banner>
          <q-table
            class="q-mt-sm"
            :rows="rowsMotocyclist"
            :columns="columnsMotocyclist"
            :filter="filterMotocyclist"
            :loading="false"
            title="Lista de motociclistas"
            row-key="index"
            no-data-label="Nenhum motociclista para mostrar"
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
                <q-td key="phone" :props="props" class="text-left">
                  {{ props.row.phone }}
                </q-td>
                <q-td key="delivery" :props="props" class="text-left">
                  {{ props.row.delivery }}
                </q-td>
                <q-td key="active" :props="props" class="text-left">
                  <q-icon
                    :name="props.row.active === 1 ? 'check_circle' : 'close'"
                    :color="props.row.active === 1 ? 'green' : 'red'"
                    size="17px"
                  />
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn :disable="false" size="sm" flat round color="blue" icon="visibility" />
                  <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
                  <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </section>
  </main>
</template>
