<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import ProductCard from 'src/components/card/ProductCard.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Store',
});

const filterStore = ref<string>('');
const rows = [
  {
    name: 'Blusa Básica',
    images: [
      '/images/blusa-branca-f/1.jpeg',
      '/images/blusa-branca-f/2.jpeg',
      '/images/blusa-branca-f/3.jpeg',
    ],
    description: 'Uma bela blusa branca feminina para verão',
    price: 28.99,
    offer: null,
    sales: 15,
    active: 1,
    stock: 100,
  },
  {
    name: 'Bermuda',
    images: ['/images/bermuda-m/1.jpg', '/images/bermuda-m/2.jpg', '/images/bermuda-m/3.jpg'],
    description: 'Uma bela bermuda masculina para festa',
    price: 60.0,
    offer: 50.0,
    sales: 12,
    active: 1,
    stock: 20,
  },
  {
    name: 'Blusa Elegante',
    images: ['/images/blusa-preta-m/2.jpeg'],
    description: 'Uma bela blusa elegante',
    price: 55.0,
    offer: 35.0,
    sales: 7,
    active: 1,
    stock: 35,
  },
  {
    name: 'Boné',
    images: [],
    description: 'Uma belo boné',
    price: 15.0,
    offer: null,
    sales: 23,
    active: 1,
    stock: 5,
  },
  {
    name: 'Calça Jeans',
    images: ['/images/calca-f/1.jpg', '/images/calca-f/2.jpg'],
    description: 'Uma bela calça',
    price: 85.0,
    offer: null,
    sales: 42,
    active: 1,
    stock: 12,
  },
  {
    name: 'Calça Curta',
    images: ['/images/calca-m/1.jpg', '/images/calca-m/2.jpg', '/images/calca-m/3.jpg'],
    description: 'Uma bela calça',
    price: 72.0,
    offer: null,
    sales: 2,
    active: 0,
    stock: 46,
  },
];
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Loja" icon="storefront" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Configurações"
          icon-right="settings"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Incluir produto"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterStore"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <div class="q-mt-sm row wrap items-start q-col-gutter-md">
        <div
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          v-for="(item, index) in rows"
          :key="index"
        >
          <ProductCard :data="item" />
        </div>
      </div>
    </section>
  </main>
</template>
