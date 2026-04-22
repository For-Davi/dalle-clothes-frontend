<script setup lang="ts">
import { useProductStore } from 'src/stores/product-store';
import { storeToRefs } from 'pinia';
import { watch, computed } from 'vue';
import Loading from '../shared/Loading.vue';
import TitlePage from '../shared/TitlePage.vue';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'ProductMovementDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    productMovementID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingProductMovement, productMovement } = storeToRefs(useProductStore());

const getProductMovement = async () => {
  if (props.data.productMovementID) {
    return await useProductStore().showProductMovement(props.data.productMovementID ?? 0);
  }
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value && props.data.productMovementID) {
    await getProductMovement();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingProductMovement
          ? 'bg-grey-2 form-basic column justify-between'
          : 'bg-grey-2 form-basic'
      "
      style="max-width: 700px; width: 95vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes da Movimentação" icon="swap_vert" />
      </q-card-section>

      <Loading :show="loadingProductMovement" v-show="loadingProductMovement" />

      <q-card-section class="q-pa-md" v-if="!loadingProductMovement">
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="info" class="q-mr-sm" />
            Detalhes da Movimentação
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="swap_horiz" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Motivo:</b>
                {{ productMovement.reason ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="move_up" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Tipo:</b>
                {{ productMovement.type ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="flag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Status:</b>
                <q-icon
                  :name="productMovement.status === 'Ativa' ? 'check_circle' : 'close'"
                  :color="productMovement.status === 'Ativa' ? 'green' : 'red'"
                  size="17px"
                  class="q-mr-xs"
                />
                {{ productMovement.status }}
              </p>

              <p class="flex items-center">
                <q-icon name="description" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Nº do documento:</b>
                {{ productMovement.document_number ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="inventory_2" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Nº do lote:</b>
                {{ productMovement.lot_number ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="point_of_sale" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Cód. Venda:</b>
                {{ productMovement.sale_id ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="assignment_return" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Cód. Devolução:</b>
                {{ productMovement.return_id ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="numbers" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Quantidade:</b>
                {{ parseInt(productMovement.quantity) ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="inventory" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Estoque anterior:</b>
                {{ parseInt(productMovement.previous_stock) ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="inventory" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Novo estoque:</b>
                {{ parseInt(productMovement.new_stock) ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Custo unitário:</b>
                {{ formatToReal(productMovement.unit_cost) ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="payments" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Custo total:</b>
                {{ formatToReal(productMovement.total_cost) ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Criado por:</b>
                {{ productMovement.created_by_name ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="person_outline" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Atualizado por:</b>
                {{ productMovement.updated_by_name ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Criado em:</b>
                {{ productMovement.created_at ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="edit_calendar" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Atualizado em:</b>
                {{
                  productMovement.updated_at === productMovement.created_at
                    ? '-'
                    : productMovement.updated_at
                }}
              </p>
            </div>

            <div class="col-12" v-if="productMovement.description">
              <p class="flex items-start">
                <q-icon name="notes" class="q-mr-sm text-primary q-mt-xs" />
                <span>
                  <b class="q-mr-sm">Observação:</b>
                  {{ productMovement.description ?? 'Nenhuma descrição adicionada' }}
                </span>
              </p>
            </div>
          </div>
        </q-card>
      </q-card-section>

      <q-card-actions class="row justify-end">
        <q-btn color="red" label="Fechar" @click="open = false" unelevated flat no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
