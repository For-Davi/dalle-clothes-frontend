<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from 'src/components/shared/Loading.vue';
import { reactive, watch } from 'vue';
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'SettingSystem',
});

const props = defineProps<{
  tab: string;
}>();

const { loadingSetting, systemSetting } = storeToRefs(useSettingsStore());

const dataSystem = reactive({
  sendNotificationStockCritical: 1 as number,
  hasCreditExpiredData: 1 as number,
  quantityCreditExpireDays: 3 as number,
});

const update = async () => {
  await useSettingsStore().updateSystemSetting(dataSystem);
};
const mountData = () => {
  Object.assign(dataSystem, {
    sendNotificationStockCritical: systemSetting.value.send_notification_stock_critical,
    hasCreditExpiredData: systemSetting.value.has_credit_expired_data,
    quantityCreditExpireDays: systemSetting.value.quantity_credit_expire_days,
  });
};

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
  <q-card class="bg-grey-1 column justify-between" bordered flat style="min-height: 300px">
    <q-card-section>
      <TitlePage title="Sistema" icon="construction" />
    </q-card-section>
    <Loading :show="loadingSetting" />
    <q-card-section v-show="!loadingSetting">
      <q-form class="q-gutter-y-md column">
        <div class="q-mt-md">
          <q-toggle
            v-model="dataSystem.sendNotificationStockCritical"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
          >
            <div class="column">
              <span class="text-bold text-body2"> Notificações - Estoque crítico </span>
              <span>
                Notificações serão enviadas se o seu produto estiver abaixo ou igual do alerta
                mínimo.
              </span>
            </div>
          </q-toggle>
          <div class="q-my-md">
            <q-toggle
              v-model="dataSystem.hasCreditExpiredData"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              :true-value="1"
              :false-value="0"
              class="q-mr-sm"
            >
              <div class="column">
                <span class="text-bold text-body2">Expiração de crédito</span>
                <span
                  >O crédito dado ao cliente será retirado após a quantidade de dias
                  informadas</span
                >
              </div>
            </q-toggle>
            <q-input
              v-model="dataSystem.quantityCreditExpireDays"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              style="width: 200px"
              outlined
              dense
              label="Quantidade de dias para a expiração"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions align="right" v-show="!loadingSetting">
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn @click="update" color="primary" label="Atualizar" size="md" unelevated no-caps />
      </div>
    </q-card-actions>
  </q-card>
</template>
