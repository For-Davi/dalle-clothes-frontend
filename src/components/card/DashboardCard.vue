<script setup lang="ts">
defineOptions({
  name: 'DashboardCard',
});

const props = withDefaults(
  defineProps<{
    title: string | null;
    data: number | string;
    data2?: number | string | null;
    tooltip?: string | null;
    tooltip2?: string | null;
    dataClass?: string | null;
    dataClass2?: string | null;
    icon?: string | null;
  }>(),
  {
    data: 0,
    title: '',
    data2: null,
    icon: null,
  },
);
</script>

<template>
  <q-card class="kpi-card full-width" flat bordered>
    <q-card-section class="q-pa-md">
      <div class="row no-wrap items-center justify-between q-mb-sm">
        <div class="text-caption text-uppercase text-grey-6 text-weight-medium kpi-label">
          {{ props.title }}
        </div>
        <q-icon
          v-if="props.icon"
          :name="props.icon"
          size="20px"
          color="primary"
          class="opacity-60"
        />
      </div>

      <div :class="props.dataClass ? props.dataClass : 'text-h5 text-weight-bold text-grey-9'">
        {{ props.data }}
        <q-tooltip v-if="props.tooltip">{{ props.tooltip }}</q-tooltip>
      </div>

      <template v-if="props.data2">
        <q-separator class="q-my-sm" />
        <div :class="props.dataClass2 ? props.dataClass2 : 'text-h5 text-weight-bold text-grey-9'">
          {{ props.data2 }}
          <q-tooltip v-if="props.tooltip2">{{ props.tooltip2 }}</q-tooltip>
        </div>
      </template>
    </q-card-section>
    <div class="kpi-accent" />
  </q-card>
</template>

<style scoped>
.kpi-card {
  border-radius: 12px !important;
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
  position: relative;
  overflow: hidden;
  min-height: 100px;
}

.kpi-card:hover {
  box-shadow: 0 6px 24px rgba(21, 101, 192, 0.14) !important;
  transform: translateY(-3px);
}

.kpi-label {
  font-size: 11px;
  letter-spacing: 0.06em;
  line-height: 1.4;
}

.kpi-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1565c0 0%, #42a5f5 100%);
}
</style>
