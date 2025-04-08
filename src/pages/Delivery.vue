<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'Delivery',
});

const daySelected = ref<string>('');
const monthSelected = ref<string>('');
const yearSelected = ref<string>('');

const setStartDate = () => {
  const now = new Date();

  daySelected.value = String(now.getDate()).padStart(2, '0');
  monthSelected.value = String(now.getMonth() + 1).padStart(2, '0');
  yearSelected.value = String(now.getFullYear());
};

const currentMonthDays = computed((): string[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const lastDay = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: lastDay }, (_, i) => String(i + 1).padStart(2, '0'));
});

onMounted(() => {
  setStartDate();
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Delivery" icon="local_shipping" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Nova entrega"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm row justify-between items-center">
        <div class="row justify-between q-gutter-x-sm items-center">
          <span class="text-h6">{{ daySelected }}/{{ monthSelected }}/{{ yearSelected }}</span>
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <div class="row justify-center">
        <div class="row justify-center q-gutter-sm">
          <q-btn
            v-for="(item, index) in currentMonthDays"
            @click="daySelected = item"
            :label="item"
            round
            color="primary"
            unelevated
            :key="index"
            :outline="daySelected != item"
          />
        </div>
      </div>
    </section>
  </main>
</template>
