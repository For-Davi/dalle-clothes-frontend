<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import CouponCard from 'src/components/card/CouponCard.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Coupon',
});

const filterCoupon = ref<string>('');
const rows = [
  {
    name: 'Cupom 100%',
    description: 'Para vendas realizadas através do Instagram',
    code: '54FGHB35',
    active: 1,
    hasLimit: 1,
    used: 1,
    limit: 6,
    dateExpiration: null,
  },
  {
    name: 'Cupom 50%',
    description: 'Para sorteios do Facebook',
    code: '175JDFY',
    active: 1,
    hasLimit: 0,
    used: 5,
    limit: null,
    dateExpiration: '23/03/2025',
  },
  {
    name: 'Cupom R$ 10 OFF',
    description: null,
    code: 'JFUICN41',
    active: 0,
    hasLimit: 1,
    used: 7,
    limit: 10,
    dateExpiration: '26/04/2025',
  },
  {
    name: 'Cupom 100%',
    description: 'Para vendas realizadas através do Instagram',
    code: '54FGHB35',
    active: 1,
    hasLimit: 1,
    used: 6,
    limit: 6,
    dateExpiration: null,
  },
  {
    name: 'Cupom R$ 5 OFF',
    description: null,
    code: '175JDFY',
    active: 1,
    hasLimit: 0,
    used: 23,
    limit: null,
    dateExpiration: '23/03/2025',
  },
];
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Cupons" icon="sell" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Novo cupom"
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
            v-model="filterCoupon"
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
          <CouponCard
            :name="item.name"
            :description="item.description"
            :active="item.active"
            :code="item.code"
            :has-limit="item.hasLimit"
            :date-expiration="item.dateExpiration"
            :limit="item.limit"
            :used="item.used"
          />
        </div>
      </div>
    </section>
  </main>
</template>
