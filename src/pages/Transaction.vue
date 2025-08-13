<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { ref } from 'vue';
import Movement from 'src/components/fragments/transaction/Movement.vue';
import Schedule from 'src/components/fragments/transaction/Schedule.vue';

defineOptions({
  name: 'Transaction',
});

const tab = ref<'movement' | 'schedule'>('movement');
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Transações" icon="sync_alt" />
    </section>
    <section class="q-mt-sm">
      <q-tabs
        v-model="tab"
        class="bg-grey-2 text-primary rounded-borders"
        align="left"
        inline-label
        no-caps
      >
        <q-tab
          name="movement"
          :class="tab == 'movement' ? 'text-primary' : 'text-grey'"
          label="Movimentações"
          icon="currency_exchange"
          :disable="false"
        />
        <q-tab
          name="schedule"
          :class="tab == 'schedule' ? 'text-primary' : 'text-grey'"
          icon="today"
          label="Agendamentos"
          :disable="false"
        />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="movement" class="q-px-none">
          <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
            <Movement />
          </q-scroll-area>
        </q-tab-panel>
        <q-tab-panel name="schedule" class="q-px-none">
          <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
            <Schedule />
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </section>
  </main>
</template>
