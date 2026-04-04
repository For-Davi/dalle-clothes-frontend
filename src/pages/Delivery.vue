<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import QuantityDeliveryCard from 'src/components/card/QuantityDeliveryCard.vue';
import { ref, reactive, onMounted } from 'vue';
import { actionsDelivery } from 'src/utils/actions';
import AllDeliveries from 'src/components/fragments/delivery/AllDeliveries.vue';
import DeliveryDelivered from 'src/components/fragments/delivery/DeliveryDelivered.vue';
import DeliveryPendent from 'src/components/fragments/delivery/DeliveryPendent.vue';
import DeliveryScheduled from 'src/components/fragments/delivery/DeliveryScheduled.vue';
import FormDeliveryGuy from 'src/components/form/FormDeliveryGuy.vue';
import DeliveryGuyManage from 'src/components/manage/DeliveryGuyManage.vue';
import { storeToRefs } from 'pinia';
import { useDeliveryStore } from 'src/stores/delivery-store';

defineOptions({
  name: 'Delivery',
});

const tab = ref<'all' | 'pendent' | 'scheduled' | 'delivered'>('all');
const showFormDeliveryGuy = reactive<{
  open: boolean;
  deliveryGuyID: number | null;
}>({
  open: false,
  deliveryGuyID: null,
});
const showDeliveryGuyManage = ref<boolean>(false);

const { Dashboard } = storeToRefs(useDeliveryStore());

const changeShowFormDeliveryGuy = (show: boolean, deliveryGuyID: number | null = null): void => {
  Object.assign(showFormDeliveryGuy, {
    open: show,
    deliveryGuyID: deliveryGuyID,
  });
};
const changeShowDeliveryGuyManage = () => {
  showDeliveryGuyManage.value = !showDeliveryGuyManage.value;
};
const openAction = (type: IActionDelivery): void => {
  switch (type) {
    case 'export':
      console.log('dsahdkjsahd');
      break;
    case 'delivery_guy':
      console.log('Abrindo gerenciamento de entregadores');
      changeShowDeliveryGuyManage();
      break;
  }
};
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Entregas" icon="local_shipping" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Novo entregador"
          @click="changeShowFormDeliveryGuy(true)"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
        <q-btn-dropdown class="q-pa-none q-px-md q-mr-sm" label="Ações" no-caps auto-close>
          <q-list dense>
            <q-item
              clickable
              v-ripple
              v-for="(item, index) in actionsDelivery"
              :key="index"
              @click="openAction(item.type)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon :name="item.icon" />
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </section>
    <section class="q-mt-sm">
      <div class="flex justify-around">
        <QuantityDeliveryCard
          title="Pendentes"
          icon="timer"
          color="#FFA000"
          :data="Dashboard.pending"
        />
        <QuantityDeliveryCard title="Agendadas" icon="date_range" :data="Dashboard.scheduled" />
        <QuantityDeliveryCard
          title="Entregues"
          icon="check_circle"
          color="#66BB6A"
          :data="Dashboard.delivered"
        />
      </div>
    </section>
    <section class="q-mt-lg">
      <q-tabs
        v-model="tab"
        class="bg-grey-2 text-primary rounded-borders"
        align="left"
        inline-label
        no-caps
      >
        <q-tab
          name="all"
          :class="tab == 'all' ? 'text-primary' : 'text-grey'"
          label="Todas"
          icon="list_alt"
          :disable="false"
        />
        <q-tab
          name="pendent"
          :class="tab == 'pendent' ? 'text-amber-7' : 'text-grey'"
          icon="timer"
          label="Pendentes"
          :disable="false"
        />
        <q-tab
          name="scheduled"
          :class="tab == 'scheduled' ? 'text-primary' : 'text-grey'"
          icon="date_range"
          label="Agendadas"
          :disable="false"
        />
        <q-tab
          name="delivered"
          :class="tab == 'delivered' ? 'text-green-5' : 'text-grey'"
          icon="check_circle"
          label="Entregues"
          :disable="false"
        />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="all" class="q-px-none">
          <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
            <AllDeliveries />
          </q-scroll-area>
        </q-tab-panel>
        <q-tab-panel name="pendent" class="q-px-none">
          <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
            <DeliveryPendent />
          </q-scroll-area>
        </q-tab-panel>
        <q-tab-panel name="scheduled" class="q-px-none">
          <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
            <DeliveryScheduled />
          </q-scroll-area>
        </q-tab-panel>
        <q-tab-panel name="delivered" class="q-px-none">
          <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
            <DeliveryDelivered />
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </section>
    <!-- Modals -->
    <FormDeliveryGuy :data="showFormDeliveryGuy" @update:open="changeShowFormDeliveryGuy(false)" />
    <DeliveryGuyManage :open="showDeliveryGuyManage" @update:open="changeShowDeliveryGuyManage" />
  </main>
</template>
