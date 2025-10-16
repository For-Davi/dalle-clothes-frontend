<script setup lang="ts">
import TableSupplierListProducts from '../table/TableSupplierListProducts.vue';
import TableSupplierCart from '../table/TableSupplierCart.vue';
import { ref, watch } from 'vue'

defineOptions({
    name:'SupplierCart'
})

const emit = defineEmits<{
  'send-cart': [ISupplierCartProduct[]];
}>();

const supplierCartProducts = ref<ISupplierCartProduct[]>([])

const addCart = (product: ISupplierCartProduct) => {
  console.log('addCart', product);
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

watch(() => supplierCartProducts.value, () => {
  console.log('Novo item no carrinho', supplierCartProducts.value);
  emit('send-cart', supplierCartProducts.value);
},{deep: true});
</script>

<template>
    <section>
        <TableSupplierListProducts @add-to-cart="addCart"/>
        supplierCartProducts {{ supplierCartProducts }}
        <TableSupplierCart class="q-mt-md" :rows="supplierCartProducts" @remove-from-cart="removeCart"/>
    </section>
</template>
