<script setup lang="ts">
import TableListProducts from '../table/TableListProducts.vue';
import TableClientCart from '../table/TableClientCart.vue';
import { ref } from 'vue'

defineOptions({
    name:'ClientCart'
})

const clientCartProducts = ref<IClientCartProduct[]>([])

const addCart = (product: IClientCartProduct) => {
  const productInCart = clientCartProducts.value.find(
    (p) => p.product_variant_id === product.product_variant_id
  );
  if (productInCart) {
    const available = product.stock_quantity - productInCart.newQuantity!;
    const quantityToAdd = Math.min(product.quantity, available);

    if (quantityToAdd <= 0) return;

    productInCart.newQuantity! += quantityToAdd;
  } else {
    const initialQuantity = Math.min(product.quantity, product.stock_quantity);

    clientCartProducts.value.push({
      ...product,
      newQuantity: initialQuantity
    });
  }
};


const removeCart = (id: number) => {
  const product = clientCartProducts.value.find(
    (p) => p.product_variant_id === id
  );
  if (product) {
    clientCartProducts.value = clientCartProducts.value.filter(
      (p) => p.product_variant_id !== id
    );
  }
};

</script>

<template>
    <section>
        <TableListProducts @add-to-cart="addCart"/>
        <TableClientCart class="q-mt-md" :rows="clientCartProducts" @remove-from-cart="removeCart"/>
    </section>
</template>