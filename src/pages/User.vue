<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import type {  QuasarTable } from 'src/ts/Quasar';
import { reactive, ref } from 'vue';
defineOptions({
  name: 'User',
});

const filterUser = ref<string>('')
const showInformation = ref<number>(0)
const columnsUser = reactive<QuasarTable[]>([
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
    name: 'position',
    label: 'Permissão',
    field: 'position',
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
    name: 'Carlos Davi',
    email: 'carlos@gmail.com',
    position: 'Gerente',
    active: 1
  },
  {
    name: 'Ellen Maria',
    email: 'ellen@gmail.com',
    position: 'Administrador',
    active: 0
  },
]

const setShowInformation = (index: number) => {
  showInformation.value = (showInformation.value === (index + 1)) ? 0 : (index + 1);
};
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Usuários" icon="person"/>
      <div>
        <q-btn 
          color="white" 
          text-color="black" 
          label="Permissões" 
          icon-right="rule" 
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
          label="Novo usuário" 
          icon-right="add" 
          no-caps
          class="q-mr-sm" 
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm">
          <q-input label="Pesquise" outlined v-model="filterUser" dense style="width:200px" class="bg-white rounded-borders">
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black"/>
            </template>
          </q-input>
        </div>
      </q-banner>
      <q-table
        :rows="rows"
        :columns="columnsUser"
        :filter="filterUser"
        :loading="false"
        title="Lista de usuários"
        row-key="index"
        no-data-label="Nenhum usuário para mostrar"
        virtual-scroll
        :rows-per-page-options="[10]"
        
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-h5"
            >
              <span class="text-body2 text-bold">{{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props"  @click="setShowInformation(props.rowIndex)" class="cursor-pointer">
            <q-td key="name" :props="props" class="text-left">
              {{ props.row.name }}
            </q-td>
            <q-td key="email" :props="props" class="text-left">
              {{ props.row.email }}
            </q-td>
            <q-td key="position" :props="props" class="text-left">
              {{ props.row.position }}
            </q-td>
            <q-td key="active" :props="props" class="text-left">
              <q-icon 
                :name="props.row.active === 1 ? 'check_circle':'close'" 
                :color="props.row.active === 1 ? 'green':'red'"
                size="17px"
              />
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                :disable="false"
                size="sm"
                flat
                round
                color="black"
                icon="edit"
              />
              <q-btn
                :disable="false"
                size="sm"
                flat
                round
                color="red"
                icon="delete"
              />
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
