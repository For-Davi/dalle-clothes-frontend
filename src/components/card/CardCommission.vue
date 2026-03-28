<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { getInitials } from 'src/composables/Label';
import { exportCommissionDetailsBySellerAndPeriodService } from 'src/services/commission-service';
import { ref } from 'vue';

defineOptions({ name: 'CardCommission' });

const props = defineProps<{ commission: ICommissionPeriod; index: number }>();

const loading = ref<boolean>(false);
const rankConfig: Record<number, { color: string; icon: string; btnColor: string; label: string }> =
  {
    0: { color: 'amber-7', icon: 'emoji_events', btnColor: 'amber-8', label: '1º Lugar' },
    1: { color: 'grey-6', icon: 'emoji_events', btnColor: 'grey-7', label: '2º Lugar' },
    2: { color: 'brown-4', icon: 'emoji_events', btnColor: 'brown-5', label: '3º Lugar' },
  };

const getRankInfo = (index: number) => rankConfig[index] ?? null;
const startExport = async (): Promise<void> => {
  try {
    loading.value = true;
    await exportCommissionDetailsBySellerAndPeriodService({
      sellerID: props.commission.seller_id,
      period: props.commission.period,
    });
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <q-card
    flat
    bordered
    class="full-height"
    :class="{
      'rank-gold': props.index === 0,
      'rank-silver': props.index === 1,
      'rank-bronze': props.index === 2,
    }"
  >
    <q-badge
      v-if="getRankInfo(props.index)"
      :color="getRankInfo(props.index)!.color"
      floating
      class="q-pa-xs q-mr-sm q-mt-sm"
    >
      <q-icon :name="getRankInfo(props.index)!.icon" size="14px" />
      <span class="q-ml-xs text-weight-bold">{{ getRankInfo(props.index)!.label }}</span>
    </q-badge>

    <q-card-section class="row items-center no-wrap q-pb-sm">
      <q-avatar
        :color="getRankInfo(props.index)?.color ?? 'primary'"
        text-color="white"
        size="38px"
        class="q-mr-sm"
      >
        {{ getInitials(props.commission.seller_name) }}
      </q-avatar>
      <div class="column overflow-hidden">
        <span class="text-body2 text-weight-bolder ellipsis">
          {{ props.commission.seller_name }}
        </span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="row q-col-gutter-sm q-py-md">
      <div class="col-6">
        <p class="text-caption text-grey-7 q-mb-none">Vendas</p>
        <p class="text-body1 text-weight-medium q-mb-none">{{ props.commission.sales_count }}</p>
      </div>
      <div class="col-6 text-right">
        <p class="text-caption text-grey-7 q-mb-none">Comissão</p>
        <p class="text-body1 text-weight-bolder text-positive q-mb-none">
          {{ formatToReal(props.commission.total_commission) }}
        </p>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        flat
        size="sm"
        :color="getRankInfo(props.index)?.btnColor ?? 'primary'"
        label="Detalhes"
        icon-right="download"
        @click="startExport()"
        :loading="loading"
      />
    </q-card-actions>
  </q-card>
</template>
