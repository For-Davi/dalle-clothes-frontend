<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

defineOptions({
  name: 'ProductCard',
});

const props = defineProps<{
  data: {
    name: string;
    description: string | null;
    price: number;
    offer: number | null;
    sales: number;
    active: number;
    stock: number;
    images: string[];
  };
}>();

const slide = ref<number>(1);
const fab = ref<boolean>(false);
const hideLabels = ref<boolean>(false);
const tab = ref<'price' | 'info'>('price');

const getIconStatus = computed((): string => {
  if (props.data.active === 1) {
    return 'task_alt';
  } else {
    return 'cancel';
  }
});
const getColorStatus = computed((): string => {
  if (props.data.active === 1) {
    return 'text-green';
  } else {
    return 'text-black';
  }
});

onMounted(() => {
  const interval = setInterval(() => {
    tab.value = tab.value === 'price' ? 'info' : 'price';
  }, 4000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>
<template>
  <q-card class="full-width bg-grey-1">
    <q-img
      v-if="props.data.images.length == 0"
      src="https://cdn.quasar.dev/img/mountains.jpg"
      fit="fill"
      height="300px"
    />
    <q-img
      v-else-if="props.data.images.length == 1"
      :src="props.data.images[0] ?? ''"
      fit="fill"
      height="300px"
    />
    <q-carousel
      v-else
      animated
      height="300px"
      v-model="slide"
      arrows
      infinite
      navigation
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide
        v-for="(item, index) in props.data.images"
        :name="index"
        :key="index"
        class="q-pa-none"
      >
        <q-img :src="item" fit="fill" height="300px" />
      </q-carousel-slide>
    </q-carousel>

    <q-card-section class="q-py-sm" :class="props.data.active === 0 ? 'opacity-4' : ''">
      <div class="text-h6">{{ props.data.name }}</div>
    </q-card-section>
    <q-card-section class="q-py-none q-px-none" :class="props.data.active === 0 ? 'opacity-4' : ''">
      <q-tabs v-model="tab" dense align="center" inline-label :breakpoint="0" no-caps>
        <q-tab
          name="price"
          :class="tab == 'price' ? 'text-primary' : 'text-grey'"
          icon="attach_money"
          @click.prevent.stop
        />
        <q-tab
          name="info"
          :class="tab == 'info' ? 'text-primary' : 'text-grey'"
          icon="trending_up"
          @click.prevent.stop
        />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="q-pa-none">
        <q-tab-panel name="price" class="q-px-md q-py-sm border-top-grey-light bg-grey-1">
          <div
            class="row items-center"
            :class="props.data.offer ? 'justify-between' : 'justify-center'"
          >
            <span
              v-if="props.data.offer"
              class="text-subtitle1 bg-primary q-px-sm rounded-borders text-white text-bold"
              >R$ {{ props.data.offer }}</span
            >
            <span
              class="text-subtitle1 text-primary text-bold"
              :class="
                props.data.offer
                  ? 'text-strike text-red opacity-6'
                  : ' bg-primary q-px-sm rounded-borders text-white'
              "
              >R$ {{ props.data.price }}</span
            >
          </div>
        </q-tab-panel>

        <q-tab-panel name="info" class="q-px-md q-py-sm border-top-grey-light bg-grey-1">
          <div
            class="row justify-between items-center"
            :class="props.data.active === 0 ? 'opacity-4' : ''"
          >
            <span class="text-subtitle1 bg-primary q-px-sm rounded-borders text-white text-bold"
              >{{ props.data.sales }} Vendas</span
            >
            <span class="text-subtitle1 bg-grey-8 q-px-sm rounded-borders text-white text-bold"
              >{{ props.data.stock }} Disponíveis</span
            >
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <q-separator />

    <q-card-actions
      class="row justify-between items-center"
      :class="props.data.active === 0 ? 'opacity-4' : ''"
    >
      <div>
        <q-btn icon-right="visibility" rounded color="orange" flat>
          <q-tooltip>Detalhes</q-tooltip>
        </q-btn>
        <q-btn v-show="props.data.description" icon-right="info" rounded color="primary" flat>
          <q-tooltip>{{ props.data.description }}</q-tooltip>
        </q-btn>
      </div>
      <div>
        <q-fab
          v-model="fab"
          label="Ações"
          color="grey-7"
          icon="add"
          direction="up"
          unelevated
          padding="xs"
          label-class="q-px-md"
        >
          <q-fab-action :hide-label="hideLabels" color="white" icon="edit" class="text-black" />
          <q-fab-action
            :hide-label="hideLabels"
            color="white"
            :icon="getIconStatus"
            :class="getColorStatus"
          />
          <q-fab-action :hide-label="hideLabels" color="white" icon="delete" class="text-red" />
        </q-fab>
      </div>
    </q-card-actions>
  </q-card>
</template>
