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
  }>(),
  {
    data: 0,
    title: '',
    data2: null,
  },
);
</script>

<template>
  <q-card
    bordered
    class="card-hover"
    style="min-height: 100px; max-height: 150px; min-width: 200px; max-width: 400px; width: 24.5%"
  >
    <q-card-section v-if="props.title">
      <div class="flex text-h4 text-weight-medium text-black justify-center q-mb-xs">
        {{ props.title }}
      </div>
      <div
        :class="
          props.dataClass
            ? props.dataClass
            : 'flex justify-center text-h4 text-weight-medium text-green-8 q-mt-md'
        "
      >
        {{ props.data }}
        <q-tooltip v-if="props.tooltip">
          {{ props.tooltip }}
        </q-tooltip>
      </div>
      <q-separator v-if="props.data2" class="q-ma-xs" />
      <div
        :class="
          props.dataClass2
            ? props.dataClass2
            : 'flex justify-center text-h4 text-weight-medium text-red-8'
        "
      >
        {{ props.data2 }}
        <q-tooltip v-if="props.tooltip2">
          {{ props.tooltip2 }}
        </q-tooltip>
      </div>
    </q-card-section>
  </q-card>
</template>
