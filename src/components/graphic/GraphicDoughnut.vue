<script setup lang="ts">
import type { ChartConfiguration, ChartData } from 'chart.js/auto';
import { Chart } from 'chart.js/auto';
import { ref, watch, onMounted, onUnmounted } from 'vue';

defineOptions({
  name: 'GraphicDoughnut',
});

const emit = defineEmits<{
  'event-doughnut': [void];
}>();

const props = defineProps<{
  label: string[];
  labelTooltip: string;
  data: number[];
  backgroundColor: string[];
  hoverOffset?: number | null;
  responsive: boolean;
  position: 'left' | 'top' | 'right' | 'bottom' | 'center' | 'chartArea';
  title?: string | null;
  width?: string | number | null;
  height?: string | number | null;
  onClick?: boolean | undefined;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart<'doughnut'> | null>(null);

const buildChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const data: ChartData<'doughnut'> = {
    labels: props.label,
    datasets: [
      {
        label: props.labelTooltip,
        data: props.data,
        backgroundColor: props.backgroundColor,
        hoverOffset: props.hoverOffset ?? 0,
      },
    ],
  };

  const config: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data,
    options: {
      responsive: props.responsive,
      plugins: {
        legend: {
          position: props.position,
        },
        title: {
          display: !!props.title,
          text: props.title ?? '',
        },
      },
      onClick: () => {
        emit('event-doughnut');
      },
    },
  };

  chartInstance.value = new Chart(chartCanvas.value, config);
};

watch(
  () => [props.label, props.data],
  (newValues) => {
    const [labels, data] = newValues;

    if (chartInstance.value) {
      chartInstance.value.data.labels = labels as string[];
      chartInstance.value.data.datasets[0].data = data as number[];
      chartInstance.value.update();
    } else if (data && (data as number[]).length > 0) {
      buildChart();
    }
  },
  { deep: true },
);

onMounted(() => {
  if (props.data && props.data.length > 0) {
    buildChart();
  }
});
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<template>
  <canvas
    ref="chartCanvas"
    :class="props.onClick ? 'cursor-pointer' : ''"
    :width="props.width ? props.width : '500'"
    :height="props.height ? props.height : '500'"
  ></canvas>
</template>
