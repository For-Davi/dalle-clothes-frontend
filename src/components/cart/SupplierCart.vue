<script setup lang="ts">
import TableSupplierListProducts from '../table/TableSupplierListProducts.vue';
import TableSupplierCart from '../table/TableSupplierCart.vue';

defineOptions({
    name:'SupplierCart'
});

const items = defineModel<ISupplierCartProduct[]>('items', { required: true });
</script>

<template>
    <section>
        <TableSupplierListProducts v-model:items="items"/>
        <TableSupplierCart class="q-mt-md"  v-model:items="items"/>
    </section>
</template>
