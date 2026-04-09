<script setup lang="ts">
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
  <q-card flat bordered class="system-card">
    <q-card-section class="q-pb-sm">
      <div class="row items-center q-gutter-x-sm">
        <q-icon name="build" color="primary" size="22px" />
        <div>
          <div class="text-subtitle1 text-weight-bold">Sistema</div>
          <div class="text-caption text-grey-6">Configurações gerais do sistema</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <Loading :show="loadingSetting" />

    <q-card-section v-show="!loadingSetting" class="q-pt-md">
      <q-form class="column q-gutter-y-none">
        <!-- Grupo: Notificações -->
        <div class="settings-group">
          <div class="group-label">
            <q-icon name="notifications" size="15px" class="q-mr-xs" />
            Notificações
          </div>
          <div class="setting-row row items-center justify-between">
            <div class="col">
              <q-toggle
                v-model="dataSystem.sendNotificationStockCritical"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Estoque crítico</div>
                  <div class="text-caption text-grey-6">
                    Notificações enviadas quando produto atingir o alerta mínimo
                  </div>
                </div>
              </q-toggle>
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Grupo: Crédito -->
        <div class="settings-group">
          <div class="group-label">
            <q-icon name="credit_card" size="15px" class="q-mr-xs" />
            Crédito de Clientes
          </div>
          <div class="setting-row row items-center justify-between q-mb-sm">
            <div class="col">
              <q-toggle
                v-model="dataSystem.hasCreditExpiredData"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Expiração de crédito</div>
                  <div class="text-caption text-grey-6">
                    O crédito do cliente será retirado após o prazo informado
                  </div>
                </div>
              </q-toggle>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs">
            <q-icon name="schedule" color="grey-5" size="18px" />
            <q-input
              v-model="dataSystem.quantityCreditExpireDays"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Dias para expiração"
              type="number"
              style="width: 200px"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-separator v-show="!loadingSetting" />

    <q-card-actions align="right" v-show="!loadingSetting" class="q-pa-md">
      <q-btn @click="update" color="primary" label="Atualizar" size="md" unelevated no-caps />
    </q-card-actions>
  </q-card>
</template>
<style scoped>
.system-card {
  border-radius: 12px !important;
}

.settings-group {
  padding: 4px 0;
}

.group-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #78909c;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.setting-row {
  padding: 6px 0;
  gap: 12px;
}
</style>
