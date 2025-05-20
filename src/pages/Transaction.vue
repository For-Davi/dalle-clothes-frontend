<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from '@/types/Quasar';
import { reactive, ref, watch } from 'vue';
defineOptions({
  name: 'Transaction',
});

const showInformationMovement = ref<number>(0);
const showInformationSchedule = ref<number>(0);
const tab = ref<'movement' | 'schedule'>('movement');
// const selectedDate = ref<string>('02/04/2025');
const filterMovement = ref<string>('');
const filterSchedule = ref<string>('');
const columnsMovement = reactive<QuasarTable[]>([
  {
    name: 'date_movement',
    label: 'Data de movimentação',
    field: 'date_movement',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
  },
  {
    name: 'account',
    label: 'Conta',
    field: 'account',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);
const columnsSchedule = reactive<QuasarTable[]>([
  {
    name: 'date_movement',
    label: 'Data de agendamento',
    field: 'date_movement',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
  },
  {
    name: 'account',
    label: 'Conta',
    field: 'account',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);
const rows = reactive([
  {
    date_movement: '16/03/2025',
    value: 'R$ 100,00',
    category: 'Gás de cozinha',
    account: 'Cartão de débito',
    type: 'saída',
  },
  {
    date_movement: '17/03/2025',
    value: 'R$ 80,00',
    category: 'Doação',
    account: 'Cartão de crédito',
    type: 'entrada',
  },
  {
    date_movement: '20/03/2025',
    value: 'R$ 95,00',
    category: 'Doação',
    account: 'Banco do Brasil',
    type: 'entrada',
  },
]);

const setShowInformationMovement = (index: number) => {
  showInformationMovement.value = showInformationMovement.value === index + 1 ? 0 : index + 1;
};
const setShowInformationSchedule = (index: number) => {
  showInformationSchedule.value = showInformationSchedule.value === index + 1 ? 0 : index + 1;
};

watch(tab, () => {
  if (tab.value === 'movement') {
    showInformationSchedule.value = 0;
  } else {
    showInformationMovement.value = 0;
  }
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Transações" icon="sync_alt" />
      <div>
        <div v-if="tab === 'movement'" class="q-px-md">
          <q-btn
            color="white"
            text-color="black"
            label="Exportar"
            icon-right="download"
            no-caps
            class="q-mr-sm"
          />
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
            label="Nova movimentação"
            icon-right="add"
            no-caps
            class="q-mr-sm"
          />
        </div>
        <div v-else class="q-px-md">
          <q-btn
            color="white"
            text-color="black"
            label="Exportar"
            icon-right="download"
            no-caps
            class="q-mr-sm"
          />
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
            label="Novo agendamento"
            icon-right="add"
            no-caps
            class="q-mr-sm"
          />
        </div>
      </div>
    </section>
    <section class="q-mt-sm">
      <q-tabs v-model="tab" class="q-px-md" dense align="left" inline-label :breakpoint="0" no-caps>
        <q-tab
          name="movement"
          :class="tab == 'movement' ? 'text-primary' : 'text-grey'"
          label="Movimentações"
          icon="currency_exchange"
        />
        <q-tab
          name="schedule"
          :class="tab == 'schedule' ? 'text-primary' : 'text-grey'"
          icon="today"
          label="Agendamentos"
        />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="movement">
          <q-banner rounded class="bg-grey-4 q-mb-sm">
            <div class="row q-gutter-x-sm justify-end items-center">
              <q-input
                label="Pesquise"
                outlined
                v-model="filterMovement"
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
                v-model="selectedDate"
                dense
                :options="['02/2025', '03/2025']"
                style="width: 200px"
                class="bg-white rounded-borders"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_month" size="20px" />
                </template>
              </q-select> -->
            </div>
          </q-banner>
          <q-table
            :rows="rows"
            :columns="columnsMovement"
            :filter="filterMovement"
            :loading="false"
            title="Lista de movementações"
            row-key="index"
            no-data-label="Nenhuma movimentação para mostrar"
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
              <q-tr
                :props="props"
                class="cursor-pointer"
                :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
              >
                <q-td
                  key="date_movement"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationMovement(props.rowIndex)"
                >
                  {{ props.row.date_movement }}
                </q-td>
                <q-td
                  key="value"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationMovement(props.rowIndex)"
                >
                  {{ props.row.value }}
                </q-td>
                <q-td
                  key="category"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationMovement(props.rowIndex)"
                >
                  {{ props.row.category }}
                </q-td>
                <q-td
                  key="account"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationMovement(props.rowIndex)"
                >
                  {{ props.row.account }}
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
                  <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
                </q-td>
              </q-tr>
              <q-tr v-show="showInformationMovement == props.rowIndex + 1" :props="props">
                <q-td colspan="100%" class="bg-grey-3">
                  <div class="text-left">
                    Aqui deve mostrar os dados da conta: {{ props.row.name }}
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="schedule">
          <q-banner rounded class="bg-grey-4 q-mb-sm">
            <div class="row q-gutter-x-sm justify-end items-center">
              <q-input
                label="Pesquise"
                outlined
                v-model="filterSchedule"
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
                v-model="selectedDate"
                dense
                :options="['02/2025', '03/2025']"
                style="width: 200px"
                class="bg-white rounded-borders"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_month" size="20px" />
                </template>
              </q-select> -->
            </div>
          </q-banner>
          <q-table
            :rows="rows"
            :columns="columnsSchedule"
            :filter="filterSchedule"
            :loading="false"
            title="Lista de agendamentos"
            row-key="index"
            no-data-label="Nenhum agendamento para mostrar"
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
              <q-tr
                :props="props"
                class="cursor-pointer"
                :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
              >
                <q-td
                  key="date_movement"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationSchedule(props.rowIndex)"
                >
                  {{ props.row.date_movement }}
                </q-td>
                <q-td
                  key="value"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationSchedule(props.rowIndex)"
                >
                  {{ props.row.value }}
                </q-td>
                <q-td
                  key="category"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationSchedule(props.rowIndex)"
                >
                  {{ props.row.category }}
                </q-td>
                <q-td
                  key="account"
                  :props="props"
                  class="text-left"
                  @click="setShowInformationSchedule(props.rowIndex)"
                >
                  {{ props.row.account }}
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn :disable="false" size="sm" flat round color="green" icon="done_all" />
                  <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
                  <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
                </q-td>
              </q-tr>
              <q-tr v-show="showInformationSchedule == props.rowIndex + 1" :props="props">
                <q-td colspan="100%" class="bg-grey-3">
                  <div class="text-left">
                    Aqui deve mostrar os dados da conta: {{ props.row.name }}.
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </section>
  </main>
</template>
