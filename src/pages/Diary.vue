<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { ref } from 'vue';
import DayDiaryCard from 'src/components/card/DayDiaryCard.vue';

defineOptions({
  name: 'Diary',
});

const filterDiary = ref<string>('');

const rows = [
  {
    date: '08/04/2025',
    day: 'Terça-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Maria Lima', 'Camila Nunes', 'Patricia Gomes'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Fabio Mendes', 'Caio Almeida', 'Felipe Moura'],
      },
    ],
  },
  {
    date: '09/04/2025',
    day: 'Quarta-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Leandro Batista', 'Maria Lima', 'Marcelo Farias'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Marina Costa', 'Viviane Rocha', 'Tatiane Braga'],
      },
    ],
  },
  {
    date: '10/04/2025',
    day: 'Quinta-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Fernanda Azevedo', 'Marina Costa', 'Ana Clara'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Viviane Rocha', 'Juliana Silva', 'Ellen Maria'],
      },
    ],
  },
  {
    date: '11/04/2025',
    day: 'Sexta-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Rafael Martins', 'Josue Ferreira', 'Leticia Ramos'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Leandro Batista', 'Bruna Carvalho', 'Gustavo Lima'],
      },
    ],
  },
  {
    date: '12/04/2025',
    day: 'Sábado',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Camila Nunes', 'Wesley Matos'],
      },
    ],
  },
  {
    date: '13/04/2025',
    day: 'Domingo',
    schedule: [
      {
        time: '09:00 - 12:00',
        employees: ['Viviane Rocha'],
      },
    ],
  },
  {
    date: '14/04/2025',
    day: 'Segunda-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Ana Clara', 'Gustavo Lima', 'Fernanda Azevedo'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Marina Costa', 'Caio Almeida', 'Bruno Santiago'],
      },
    ],
  },
  {
    date: '15/04/2025',
    day: 'Terça-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Juliane Prado', 'Bruno Santiago', 'Claudia Ribeiro'],
      },
    ],
  },
  {
    date: '16/04/2025',
    day: 'Quarta-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Caio Almeida', 'Patricia Gomes', 'Lucas Vieira'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['João Pedro', 'Rafael Martins', 'Felipe Moura'],
      },
      {
        time: '22:00 - 23:00',
        employees: ['Patricia Gomes', 'Bruno Santiago'],
      },
    ],
  },
  {
    date: '17/04/2025',
    day: 'Quinta-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: [
          'Gustavo Lima',
          'Patricia Gomes',
          'Bruno Santiago',
          'Fernanda Azevedo',
          'Isabela Dias',
        ],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Roberto Teixeira', 'Fernanda Azevedo', 'Isabela Dias'],
      },
      {
        time: '22:00 - 23:00',
        employees: ['Patricia Gomes', 'Bruno Santiago'],
      },
    ],
  },
  {
    date: '18/04/2025',
    day: 'Sexta-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Rafaela Nunes', 'Gustavo Lima', 'Tatiane Braga'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Felipe Moura', 'Maria Lima', 'Diego Castro', 'Tatiane Braga'],
      },
    ],
  },
  {
    date: '19/04/2025',
    day: 'Sábado',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['João Pedro', 'Bruna Carvalho', 'Fernanda Azevedo', 'Fabio Mendes'],
      },
    ],
  },
  {
    date: '20/04/2025',
    day: 'Domingo',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Ana Clara', 'Juliane Prado', 'Amanda Duarte', 'Bruna Carvalho', 'Maria Lima'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Milena Souza', 'Ellen Maria', 'Vinicius Rocha'],
      },
      {
        time: '22:00 - 23:00',
        employees: ['Ana Clara', 'Juliane Prado', 'Amanda Duarte'],
      },
    ],
  },
  {
    date: '21/04/2025',
    day: 'Segunda-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Bruna Carvalho', 'Maria Lima', 'João Pedro'],
      },
      {
        time: '16:00 - 22:00',
        employees: [
          'Paula Medeiros',
          'Ellen Maria',
          'Vinicius Rocha',
          'Bruna Carvalho',
          'Maria Lima',
          'João Pedro',
        ],
      },
    ],
  },
  {
    date: '22/04/2025',
    day: 'Terça-feira',
    schedule: [
      {
        time: '09:00 - 16:00',
        employees: ['Felipe Moura', 'Milena Souza', 'Diego Castro'],
      },
      {
        time: '16:00 - 22:00',
        employees: ['Maria Lima', 'Leticia Ramos', 'Henrique Tavares'],
      },
    ],
  },
];
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Agenda" icon="calendar_month" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Horários"
          icon-right="alarm"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Nova agenda"
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
            v-model="filterDiary"
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
      <div class="q-mt-sm row wrap items-start q-col-gutter-md">
        <div
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          v-for="(item, index) in rows"
          :key="index"
        >
          <DayDiaryCard :data="item" />
        </div>
      </div>
    </section>
  </main>
</template>
