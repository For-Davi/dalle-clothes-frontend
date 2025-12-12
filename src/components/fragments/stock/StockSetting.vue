<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';
import Loading from 'src/components/shared/Loading.vue';

defineOptions({
  name: 'StockSetting',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingSetting, systemSetting } = storeToRefs(useSettingsStore());

const dataSystem = reactive({
  sendNotificationStockCritical: 1 as number,
});

const update = async () => {
  const response = await useSettingsStore().updateSystemSetting({
    sendNotificationStockCritical: dataSystem.sendNotificationStockCritical,
  });

  if (response?.status === 200) {
    emit('update:open');
  }
};
const mountData = () => {
  Object.assign(dataSystem, {
    sendNotificationStockCritical: systemSetting.value.send_notification_stock_critical,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    await useSettingsStore().getSettingSystem();
    mountData();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      style="min-height: 200px; max-width: 500px"
      class="bg-grey-2 form-basic column justify-between"
    >
      <q-card-section class="q-pa-none q-mb-sm">
        <TitlePage title="Configurações do estoque" icon="settings" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading v-show="loadingSetting" :show="loadingSetting" />
        <q-form v-show="!loadingSetting" class="q-gutter-y-md column">
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
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="update"
            :loading="loadingSetting"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
