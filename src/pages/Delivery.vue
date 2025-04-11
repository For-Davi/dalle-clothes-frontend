<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'Delivery',
});

const filterDelivery = ref<string>('');
const daySelected = ref<string>('');
const splitterModel = ref<number>(30);
const events = ref(['2025/04/15', '2025/04/16']);

const setStartDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());

  daySelected.value = `${year}/${month}/${day}`;
};

const dayFormatted = computed((): string => {
  const parts = daySelected.value.split('/');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
});
const hasDelivery = computed((): boolean => {
  return events.value.includes(daySelected.value);
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
          <span class="text-h6">{{ dayFormatted }}</span>
          <div class="row justify-between q-gutter-x-sm items-center">
            <q-input
              label="Pesquise"
              outlined
              v-model="filterDelivery"
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
        </div>
      </q-banner>
      <q-splitter v-model="splitterModel" separator-class="bg-white" class="row justify-center">
        <template v-slot:before>
          <div class="q-pa-sm full-width">
            <q-date
              v-model="daySelected"
              :events="events"
              event-color="orange"
              class="full-width"
            />
          </div>
        </template>

        <template v-slot:after>
          <transition name="fade" mode="out-in">
            <div v-if="hasDelivery" class="q-pa-md">
              <p class="text-h4 q-mb-md">{{ daySelected }}</p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                assumenda consectetur culpa fuga nulla ullam. In, libero.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                assumenda consectetur culpa fuga nulla ullam. In, libero.
              </p>
            </div>
            <div v-else class="column justify-center items-center">
              <p class="text-h6 bg-primary text-white q-px-sm rounded-borders q-mt-sm">
                Sem entregas planejadas
              </p>
              <q-img src="/icons/empty.png" width="150px" class="q-mt-xl" />
            </div>
          </transition>
        </template>
      </q-splitter>
    </section>
  </main>
</template>
