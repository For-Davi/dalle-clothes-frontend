<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from 'src/components/shared/Loading.vue';
import TableOrderHistory from 'src/components/table/TableOrderHistory.vue';
import { computed } from 'vue';

defineOptions({
  name: 'SaleDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="max-width: 700px; width: 95vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes da venda" icon="list_alt" />
      </q-card-section>
      <Loading :show="false" v-show="false" />
      <q-card-section class="q-pa-md" v-show="true">
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="info" class="q-mr-sm" />
            Informações da Venda
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Vendedor:</b> dasdadadadsada
              </p>

              <p class="flex items-center">
                <q-icon name="flag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Status:</b>
                <span class="text-bold"> daskjdhaskjdasd </span>
              </p>

              <p class="flex items-center">
                <q-icon name="notes" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Faturas:</b> asdadasda
              </p>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Total da venda:</b>
                dasdasdasdasdfff
              </p>

              <p class="flex items-center">
                <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Data de criação:</b> asdasdasdaw
              </p>

              <p class="flex items-center">
                <q-icon name="event" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Pagamentos:</b>
                dagacascasaz
              </p>

              <p class="flex items-center">
                <q-icon name="schedule" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Criado em:</b>
                asdasdqwdqwd
              </p>
            </div>
          </div>
        </q-card>
        <div v-if="false" class="column q-gutter-md">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary">Itens do Pedido</div>
            <q-separator />
            <q-list class="column q-gutter-y-sm">
              <!-- <q-item
                v-for="(item, index) in dataOrder?.items ?? []"
                :key="index"
                class="q-py-md border-full-grey-light rounded-borders"
              >
                <q-item-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="shopping_bag" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Produto:</b> {{ item?.variant?.product?.name }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="view_module" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Grade:</b> {{ item?.variant?.grid_item?.size }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="qr_code_2" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Código:</b> {{ item?.variant?.code }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="label" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">SKU:</b> {{ item?.variant?.sku }}
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="palette" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Cor:</b>
                        <span
                          class="cursor-pointer"
                          :style="getColorStyle(item?.variant?.color?.hex_color_code ?? '')"
                        >
                          <q-tooltip>{{ item?.variant?.color?.name }}</q-tooltip>
                        </span>
                      </p>

                      <p class="flex items-center">
                        <q-icon name="payments" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Custo unitário:</b> {{ formatToReal(item?.unit_cost) }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="paid" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Total:</b>{{ formatToReal(item?.total_cost) }}
                      </p>
                    </div>

                    <div class="col-12">
                      <q-separator spaced />
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="shopping_cart" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde requisitada:</b> {{ item?.quantity_requested }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="inventory" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde recebida:</b> {{ item?.quantity_received ?? '-' }}
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon
                          name="check_circle"
                          class="q-mr-sm"
                          :class="item?.finished ? 'text-positive' : 'text-grey'"
                        />
                        <b class="q-mr-sm">Finalizado:</b> {{ item?.finished ? 'Sim' : 'Não' }}
                      </p>
                    </div>

                    <div class="col-12" v-if="showSupplierOrderReceipt && needReceived(item)">
                      <q-input
                        outlined
                        label="Informe a quantidade recebida"
                        dense
                        v-model="item.received"
                        input-class="text-right"
                        class="q-mr-sm"
                        mask="##########"
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item> -->
            </q-list>
            <div class="col-12 q-mt-sm" v-if="false">
              <q-input
                v-model="dateReceived"
                bg-color="white"
                label-color="black"
                outlined
                label="Data de recebimento"
                dense
                input-class="text-black"
                mask="##/##/####"
              >
                <template v-slot:prepend>
                  <q-icon name="today" color="black" size="20px" />
                </template>
              </q-input>
            </div>
          </q-card>
        </div>
        <div v-else-if="false" class="column q-gutter-md">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary flex items-center">
              <q-icon name="update" class="q-mr-sm" />
              Atualizar Status do Pedido
            </div>

            <q-separator spaced />

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  outlined
                  v-model="selectedStatus"
                  :options="optionsStatus"
                  label="Selecione o novo status"
                  map-options
                  dense
                  class="q-mb-md full-width"
                >
                  <template v-slot:prepend>
                    <q-icon name="flag" class="text-primary" />
                  </template>
                </q-select>
              </div>
            </div>
          </q-card>
        </div>
        <div v-else-if="false" class="column q-gutter-md">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary flex items-center">
              <q-icon name="update" class="q-mr-sm" />
              Histórico do pedido
            </div>

            <div class="col-12 q-mt-sm">
              <TableOrderHistory :items="[]" />
            </div>
          </q-card>
        </div>
      </q-card-section>
      <q-card-actions v-show="true" class="row justify-between items-center">
        <div class="row no-wrap">
          <div v-if="true">
            <q-btn
              @click="console.log('status')"
              color="primary"
              icon="list_alt"
              round
              unelevated
              no-caps
              class="q-ml-sm"
            >
              <q-tooltip>Status</q-tooltip>
            </q-btn>
            <q-btn
              @click="console.log('history')"
              color="secondary"
              icon="history"
              round
              unelevated
              no-caps
              class="q-ml-sm"
            >
              <q-tooltip>Histórico</q-tooltip>
            </q-btn>
            <q-btn
              color="grey"
              icon="download"
              round
              unelevated
              no-caps
              class="q-ml-sm"
              @click="console.log('lasdjaksl')"
            >
              <q-tooltip>Download</q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn
              v-if="false"
              color="green"
              icon="fa-solid fa-box-archive"
              round
              unelevated
              no-caps
              class="q-ml-sm"
              @click="console.log('lasdjaksl')"
            >
              <q-tooltip>Recebimento</q-tooltip>
            </q-btn>
            <q-btn
              v-if="false"
              color="red"
              icon="close"
              round
              unelevated
              no-caps
              class="q-ml-sm"
              @click="emit('update:open')"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div>
          <q-btn
            color="red"
            label="Fechar"
            @click="open = false"
            unelevated
            no-caps
            class="q-mr-sm"
          />
          <q-btn
            v-if="true"
            @click="console.log('ldsladlaskld')"
            color="primary"
            label="Salvar"
            class="q-mr-sm"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
