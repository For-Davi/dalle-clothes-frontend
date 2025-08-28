<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from 'src/components/shared/Loading.vue';
import { reactive, watch } from 'vue'
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'SettingSystem'
})

const props = defineProps<{
  tab: string;
}>()

const { loadingSetting, systemSetting } = storeToRefs(useSettingsStore())

const dataSystem = reactive({
  sendNotificationStockCritical: 1 as number
})

const update = async () => {
  await useSettingsStore().updateSystemSetting({
    sendNotificationStockCritical: dataSystem.sendNotificationStockCritical
  })
}
const mountData = () => {
  Object.assign(dataSystem, {
    sendNotificationStockCritical: systemSetting.value.send_notification_stock_critical,
  })
}

watch(
  () => props.tab,
  async (tab) => {
    if (tab === 'system') {
      await useSettingsStore().getSettingSystem();
      mountData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <q-card class="bg-grey-1 column justify-between" bordered flat>
    <q-card-section>
      <TitlePage title="Sistema" icon="construction" />
    </q-card-section>
    <Loading :show="loadingSetting"/>
    <q-card-section v-show="!loadingSetting">
      <q-form class="q-gutter-y-md column">
        <div>
          <q-toggle
          v-model="dataSystem.sendNotificationStockCritical"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          :true-value="1"
          :false-value="0"
          >
            <div class="column">
              <span class="text-bold text-body2">  
                Notificações - Estoque crítico
              </span>
              <span>
                Notificações serão enviadas se o seu produto estiver abaixo do alerta mínimo.
              </span>
            </div>
          </q-toggle>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions align="right" v-show="!loadingSetting">
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn
          @click="update"
          color="primary"
          label="Atualizar"
          size="md"
          unelevated
          no-caps
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
