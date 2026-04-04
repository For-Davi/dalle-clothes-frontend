<script setup lang="ts">
defineOptions({
  name: 'QuantityDeliveryCard',
});

const props = defineProps<{
  title: string;
  icon: string;
  color?: string | null;
  data: number;
}>();
</script>

<template>
  <q-card
    rounded
    bordered
    flat
    style="min-height: 100px; max-height: 150px; min-width: 200px; max-width: 400px; width: 33%"
    :style="{ border: `1px solid ${props.color || '#1976d2'}` }"
  >
    <q-card-section>
      <div class="flex justify-start">
        <div
          :style="{ backgroundColor: props.color || '#1976d2' }"
          style="width: 60px; height: 60px; border-radius: 20%"
          class="flex items-center justify-center"
        >
          <q-icon :name="props.icon" color="white" size="40px" />
        </div>

        <div class="flex column justify-between">
          <span
            class="q-ml-sm text-h5 text-weight-medium"
            :style="{ color: props.color || '#1976d2' }"
          >
            {{ props.title }}
          </span>
          <span class="q-ml-md text-h4 text-weight-light text-blue-grey-7"> {{ props.data }} </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
