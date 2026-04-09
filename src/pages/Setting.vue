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
  <main class="setting-page q-pa-lg">
    <TitlePage title="Configurações" icon="settings" class="q-mb-lg" />
    <div class="row q-col-gutter-md items-start">
      <div class="col-auto">
        <q-card flat bordered class="setting-nav">
          <q-tabs
            v-model="tab"
            vertical
            inline-label
            active-color="primary"
            indicator-color="primary"
            class="setting-tabs"
          >
            <q-tab name="appearance" icon="design_services" label="Aparência" no-caps />
            <q-tab name="system" icon="build" label="Sistema" no-caps />
          </q-tabs>
        </q-card>
      </div>
      <div class="col">
        <q-tab-panels v-model="tab" animated class="panels-transparent">
          <q-tab-panel name="appearance" class="q-pa-none">
            <SettingAppearance :tab="tab" />
          </q-tab-panel>
          <q-tab-panel name="system" class="q-pa-none">
            <SettingSystem :tab="tab" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </main>
</template>
<style scoped>
.setting-page {
  background: #f4f6f9;
  min-height: 100vh;
}

.setting-nav {
  border-radius: 12px !important;
  min-width: 190px;
  overflow: hidden;
}

.setting-tabs {
  padding: 8px 0;
}

.panels-transparent {
  background: transparent;
  box-shadow: none;
}
</style>
