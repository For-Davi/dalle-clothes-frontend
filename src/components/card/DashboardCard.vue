<script setup lang="ts">
defineOptions({
  name: 'DashboardCard',
});

const props = defineProps<{
  title: string | null;
  data: number | string;
  data2?: number | string | undefined;
}>();
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
          props.data2
            ? 'flex justify-center text-h6 text-weight-medium text-green-8'
            : 'flex justify-center text-h4 text-weight-medium text-green-8 q-mt-md'
        "
      >
        {{ props.data }}
      </div>
      <q-separator v-if="props.data2" class="q-ma-xs" />
      <div
        :class="
          props.data2
            ? 'flex justify-center text-h6 text-weight-medium text-red-8'
            : 'flex justify-center text-h4 text-weight-medium text-red-8'
        "
      >
        {{ props.data2 }}
      </div>
    </q-card-section>
  </q-card>
</template>
