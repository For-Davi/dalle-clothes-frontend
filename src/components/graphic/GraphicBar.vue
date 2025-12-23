<script setup lang="ts">
import { Chart } from 'chart.js/auto';
import type { ChartConfiguration, ChartDataset } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

defineOptions({ name: 'GraphicBar' });

const props = defineProps<{
  labels: string[];
  datasets: ChartDataset<'bar' | 'line' | 'bubble'>[];
  responsive?: boolean;
  indexAxis?: 'x' | 'y';
  title?: string;
  legendPosition?: 'left' | 'top' | 'right' | 'bottom' | 'center' | 'chartArea';
  stacked?: boolean;
  width: string | number;
  height: string | number;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const initChart = () => {
  if (!canvas.value) return;

  if (chart) {
    chart.destroy();
  }

  const config: ChartConfiguration<'bar' | 'line' | 'bubble'> = {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: props.datasets,
    },
    options: {
      responsive: props.responsive ?? true,
      indexAxis: props.indexAxis ?? 'x',
      scales: props.stacked
        ? {
            x: { stacked: true },
            y: { stacked: true },
          }
        : undefined,
      plugins: {
        legend: { position: props.legendPosition ?? 'top' },
        title: {
          display: !!props.title,
          text: props.title,
        },
        datalabels: {
          anchor: 'center',
          align: props.indexAxis === 'y' ? 'center' : 'top',
          color: '#001F3D',
          font: { weight: 'bold', size: 14 },
          formatter: (value) => {
            return `R$ ${value.toFixed(2)}`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  };

  chart = new Chart(canvas.value, config);
};

const calculatedHeight = computed(() => {
  if (props.indexAxis === 'y') {
    if (props.labels.length > 5) {
      return props.labels.length * 70;
    }
    return 500;
  }

  return Number(props.height);
});

watch(
  () => props.datasets,
  (newDatasets) => {
    if (chart) {
      chart.data.datasets = newDatasets;
      chart.data.labels = props.labels;
      chart.update();
    } else if (canvas.value && newDatasets.length > 0) {
      initChart();
    }
  },
  { deep: true },
);

onMounted(() => {
  initChart();
});
onUnmounted(() => {
  chart?.destroy();
});
</script>

<template>
  <div :style="`max-height:${props.height};overflow-y: auto;overflow-x: hidden;`">
    <canvas ref="canvas" :width="width" :height="calculatedHeight" />
  </div>
</template>
