<script setup lang="ts">
import TableSupplierListProducts from '../table/TableSupplierListProducts.vue';
import TableSupplierCart from '../table/TableSupplierCart.vue';
import { ref } from 'vue'

defineOptions({
    name:'SupplierCart'
})

const supplierCartProducts = ref<ISupplierCartProduct[]>([])

const addCart = (product: ISupplierCartProduct) => {
    supplierCartProducts.value.push({
      ...product,
      newQuantity: product.quantity
    });
};
const removeCart = (id: number) => {
  const product = supplierCartProducts.value.find(
    (p) => p.product_variant_id === id
  );
  if (product) {
    supplierCartProducts.value = supplierCartProducts.value.filter(
      (p) => p.product_variant_id !== id
    );
  }
};

</script>

<template>
    <section>
        <TableSupplierListProducts @add-to-cart="addCart"/>
        <TableSupplierCart class="q-mt-md" :rows="supplierCartProducts" @remove-from-cart="removeCart"/>
    </section>
</template>
