<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useCommissionStore } from 'src/stores/commission-store';
import CardCommission from '../card/CardCommission.vue';
import { formatToReal } from 'src/composables/Money';

defineOptions({ name: 'ListCommissionResult' });

const props = defineProps<{ filters: IFilterCommission }>();
const emit = defineEmits<{ 'show:showDetailsCommission': [number, string] }>();

const { loadingCommission, listCommissionPeriod } = storeToRefs(useCommissionStore());

const showDetails = (sellerID: number, period: string) => {
  emit('show:showDetailsCommission', sellerID, period);
};
const getCaption = (sellers: typeof listCommissionPeriod.value) => {
  const count = sellers.length;
  const labelVendedor = count !== 1 ? 'vendedores' : 'vendedor';

  const total = sellers.reduce((sum, s) => sum + Number(s.total_commission), 0);

  return `${count} ${labelVendedor} • Total: ${formatToReal(total)}`;
};

const groupedByPeriod = computed(() => {
  const map = new Map<string, typeof listCommissionPeriod.value>();

  listCommissionPeriod.value.forEach((item) => {
    if (!map.has(item.period)) map.set(item.period, []);
    map.get(item.period)!.push(item);
  });

  map.forEach((sellers, period) => {
    map.set(
      period,
      sellers.sort((a, b) => Number(b.total_commission) - Number(a.total_commission)),
    );
  });

  return map;
});

onMounted(async () => {
  await useCommissionStore().getComissions(props.filters);
});
</script>

<template>
  <section style="min-height: 300px">
    <Loading :show="loadingCommission" />

    <div v-if="!loadingCommission">
      <q-list bordered separator class="rounded-borders">
        <q-expansion-item
          v-for="[period, sellers] in groupedByPeriod"
          :key="period"
          expand-separator
          icon="calendar_month"
          :label="`Período: ${period}`"
          :caption="getCaption(sellers)"
          header-class="text-subtitle1 text-bold text-primary"
        >
          <q-card flat>
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div
                  v-for="(seller, index) in sellers"
                  :key="seller.seller_id"
                  class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <CardCommission
                    :commission="seller"
                    :index="index"
                    @show:show-details-commission="showDetails"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <p v-if="groupedByPeriod.size === 0" class="text-center text-grey-6 q-mt-xl">
        Nenhuma comissão para mostrar
      </p>
    </div>
  </section>
</template>
