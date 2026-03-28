<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useCommissionStore } from 'src/stores/commission-store';
import { formatToReal } from 'src/composables/Money';
import { getInitials } from 'src/composables/Label';

defineOptions({ name: 'TableCommissionResult' });

const props = defineProps<{ filters: IFilterCommission }>();
const emit = defineEmits<{ 'show:showDetailsCommission': [number, string] }>();

const { loadingCommission, listCommissionPeriod } = storeToRefs(useCommissionStore());

const rankConfig: Record<number, { color: string; icon: string; btnColor: string; label: string }> =
  {
    0: { color: 'amber-7', icon: 'emoji_events', btnColor: 'amber-8', label: '1º Lugar' },
    1: { color: 'grey-6', icon: 'emoji_events', btnColor: 'grey-7', label: '2º Lugar' },
    2: { color: 'brown-4', icon: 'emoji_events', btnColor: 'brown-5', label: '3º Lugar' },
  };

const getRankInfo = (index: number) => rankConfig[index] ?? null;
const showDetails = (sellerID: number, period: string) => {
  emit('show:showDetailsCommission', sellerID, period);
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
      <div v-for="[period, sellers] in groupedByPeriod" :key="period" class="q-mb-lg">
        <div class="text-subtitle1 text-bold q-mb-sm flex items-center">
          <q-icon name="calendar_month" color="primary" class="q-mr-sm" />
          Período: {{ period }}
        </div>

        <div class="row q-col-gutter-sm">
          <div
            v-for="(seller, index) in sellers"
            :key="seller.seller_id"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              flat
              bordered
              class="full-height"
              :class="{
                'rank-gold': index === 0,
                'rank-silver': index === 1,
                'rank-bronze': index === 2,
              }"
            >
              <q-badge
                v-if="getRankInfo(index)"
                :color="getRankInfo(index)!.color"
                floating
                class="q-pa-xs q-mr-sm q-mt-sm"
              >
                <q-icon :name="getRankInfo(index)!.icon" size="14px" />
                <span class="q-ml-xs text-weight-bold">{{ getRankInfo(index)!.label }}</span>
              </q-badge>

              <q-card-section class="row items-center no-wrap q-pb-sm">
                <q-avatar
                  :color="getRankInfo(index)?.color ?? 'primary'"
                  text-color="white"
                  size="38px"
                  class="q-mr-sm"
                >
                  {{ getInitials(seller.seller_name) }}
                </q-avatar>
                <div class="column overflow-hidden">
                  <span class="text-body2 text-weight-bolder ellipsis">
                    {{ seller.seller_name }}
                  </span>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="row q-col-gutter-sm q-py-md">
                <div class="col-6">
                  <p class="text-caption text-grey-7 q-mb-none">Vendas</p>
                  <p class="text-body1 text-weight-medium q-mb-none">{{ seller.sales_count }}</p>
                </div>
                <div class="col-6 text-right">
                  <p class="text-caption text-grey-7 q-mb-none">Comissão</p>
                  <p class="text-body1 text-weight-bolder text-positive q-mb-none">
                    {{ formatToReal(seller.total_commission) }}
                  </p>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  size="sm"
                  :color="getRankInfo(index)?.btnColor ?? 'primary'"
                  label="Detalhes"
                  icon-right="visibility"
                  @click="showDetails(seller.seller_id, seller.period)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <p v-if="groupedByPeriod.size === 0" class="text-center text-grey-6 q-mt-xl">
        Nenhuma comissão para mostrar
      </p>
    </div>
  </section>
</template>

<style scoped>
.rank-gold {
  border: 1.5px solid #f9a825;
}
.rank-silver {
  border: 1.5px solid #9e9e9e;
}
.rank-bronze {
  border: 1.5px solid #8d6e63;
}
</style>
