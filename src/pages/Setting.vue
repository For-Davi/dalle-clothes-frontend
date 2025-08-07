<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import SettingAppearance from 'src/components/fragments/setting/SettingAppearance.vue';
import SettingSystem from 'src/components/fragments/setting/SettingSystem.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Setting',
});

const tab = ref<ISettingModalTabs>('appearance');
</script>
<template>
  <main class="q-pa-lg">
    <section>
      <TitlePage title="Configurações" icon="settings" />
      <q-tabs v-model="tab" inline-label class="bg-grey-3 text-primary" align="left">
        <q-tab name="appearance" icon="design_services" label="Aparência" no-caps />
        <q-tab name="system" icon="build" label="Sistema" no-caps />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="appearance" class="q-px-none">
          <SettingAppearance :tab="tab" />
        </q-tab-panel>
        <q-tab-panel name="system" class="q-px-none">
          <SettingSystem />
        </q-tab-panel>
      </q-tab-panels>
    </section>
  </main>
</template>
