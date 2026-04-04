<script setup lang="ts">
import DeliveriesList from 'src/components/list/DeliveriesList.vue';
import { onMounted, ref } from 'vue';
import { useDeliveryStore } from 'src/stores/delivery-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'DeliveryScheduled',
});

const { listDelivery } = storeToRefs(useDeliveryStore());

const search = ref<string>();

const fetchScheduledDeliveries = async () => {
  await useDeliveryStore().getDeliveries('scheduled');
};

onMounted(async () => {
  await fetchScheduledDeliveries();
  await useDeliveryStore().getDashboardDelivery();
});
</script>

<template>
  <main>
    <section class="q-mt-md q-px-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge v-show="true" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <DeliveriesList :filter="search" status="scheduled" :list-deliveries="listDelivery" />
    </section>
  </main>
</template>
