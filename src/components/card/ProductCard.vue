<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

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
    return 'green';
  } else {
    return 'black';
  }
});

let intervalId = setInterval(() => {
  tab.value = tab.value === 'price' ? 'info' : 'price';
}, 4000);

// Caso esteja utilizando o <script setup>, você pode usar onUnmounted para limpar o intervalo
onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
<template>
  <q-card class="full-width bg-grey-1">
    <q-img
      v-if="props.data.images.length == 0"
      src="https://cdn.quasar.dev/img/mountains.jpg"
      fit="scale-down"
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
    <q-separator />
    <q-card-section class="q-py-sm q-px-none" :class="props.data.active === 0 ? 'opacity-4' : ''">
      <q-tabs v-model="tab" dense align="center" inline-label :breakpoint="0" no-caps>
        <q-tab
          name="price"
          :class="tab == 'price' ? 'text-primary' : 'text-grey'"
          icon="attach_money"
        />
        <q-tab
          name="info"
          :class="tab == 'info' ? 'text-primary' : 'text-grey'"
          icon="trending_up"
        />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="q-pa-none">
        <q-tab-panel name="price" class="q-px-md q-py-sm">
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

        <q-tab-panel name="info" class="q-px-md q-py-sm">
          <!-- <div
            class="text-bold row justify-between items-center"
            :class="props.data.active === 0 ? 'opacity-4' : ''"
          >
            <span
              ><span class="text-white bg-secondary q-px-sm rounded-borders text-h6">{{
                props.data.sales
              }}</span>
              Vendas</span
            >
            <span
              ><span class="text-white bg-dark q-px-sm rounded-borders text-h6">{{
                props.data.stock
              }}</span>
              Disponíveis</span
            >
          </div> -->
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

    <q-separator />

    <q-card-actions align="right" :class="props.data.active === 0 ? 'opacity-4' : ''">
      <q-btn v-show="props.data.description" icon-right="info" rounded color="primary" flat>
        <q-tooltip>{{ props.data.description }}</q-tooltip>
      </q-btn>
      <q-btn icon-right="sell" rounded color="purple" flat>
        <q-tooltip>Tags</q-tooltip>
      </q-btn>
      <q-btn :icon-right="getIconStatus" rounded :color="getColorStatus" flat>
        <q-tooltip>{{ props.data.active === 1 ? 'Ativo' : 'Inativo' }}</q-tooltip>
      </q-btn>
      <q-btn icon-right="edit" rounded flat />
      <q-btn icon-right="delete" rounded color="red" flat />
    </q-card-actions>
  </q-card>
</template>
