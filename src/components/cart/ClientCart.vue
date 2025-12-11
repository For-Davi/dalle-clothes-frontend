<script setup lang="ts">
import TableListProducts from '../table/TableListProducts.vue';
import TableClientCart from '../table/TableClientCart.vue';
import { ref, watch, computed } from 'vue';

defineOptions({
  name: 'ClientCart',
});

const emit = defineEmits<{
  'add-to-data': [IClientCartProduct[]];
  'add-total': [number];
}>();

const model = defineModel<IClientCartProduct[]>({
  default: () => [],
});
const total = ref<number>(0);

const addCart = (product: IClientCartProduct) => {
  const productInCart = model.value.find(
    (p) => p.product_variant_id === product.product_variant_id,
  );
  if (productInCart) {
    const available = product.stock_quantity - productInCart.newQuantity!;
    const quantityToAdd = Math.min(product.quantity, available);

    if (quantityToAdd <= 0) return;

    productInCart.newQuantity! += quantityToAdd;
  } else {
    const initialQuantity = Math.min(product.quantity, product.stock_quantity);

    model.value.push({
      ...product,
      newQuantity: initialQuantity,
    });
  }
};
const removeCart = (id: number) => {
  const product = model.value.find((p) => p.product_variant_id === id);
  if (product) {
    model.value = model.value.filter((p) => p.product_variant_id !== id);
  }
};
const sendTotal = (totalPrice: number) => {
  total.value = totalPrice;
};

const cartIds = computed(() => model.value.map((p) => p.product_variant_id));

watch(
  () => total,
  () => {
    emit('add-total', total.value);
  },
  { deep: true },
);
</script>

<template>
  <section>
    <TableListProducts @add-to-cart="addCart" :hidden-ids="cartIds" />
    <TableClientCart
      class="q-mt-md"
      :rows="model"
      @remove-from-cart="removeCart"
      @send-total="sendTotal"
    />
  </section>
</template>
