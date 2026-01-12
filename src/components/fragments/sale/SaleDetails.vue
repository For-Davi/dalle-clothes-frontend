<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from 'src/components/shared/Loading.vue';
import TableOrderHistory from 'src/components/table/TableOrderHistory.vue';
import { formatToReal } from 'src/composables/Money';
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import type { PaymentType } from 'src/enums/payment-enum';
import { PaymentTypeLabels } from 'src/enums/payment-enum';

defineOptions({
  name: 'SaleDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingSale, Sale } = storeToRefs(useSaleStore());

const getSale = async () => {
  if (saleID.value) {
    return await useSaleStore().showSale(saleID.value);
  }
};
const formatToBrazilianDateTime = (value?: string | null) => {
  if (!value) return '';

  const localValue = value.replace('Z', '');

  const date = new Date(localValue);

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} as
          ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const getPaymentTypeLabel = (type: string) => {
  return PaymentTypeLabels[type as PaymentType] ?? type;
};
const getColorStyle = (hexColor: string) => {
  return {
    backgroundColor: hexColor || 'transparent',
    width: '15px',
    height: '15px',
    border: '1px solid #ddd',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
};
const parseBrazilianCellphone = (value: string) => {
  if (!value) return null;

  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith('55')) {
    return digits.slice(2);
  }
};
const formatBrazilianCellphone = (value: string): string => {
  const phone = parseBrazilianCellphone(value);

  if (!phone) return '';

  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};

const saleID = computed(() => props.data.saleID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    await getSale();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      :class="loadingSale ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'"
      style="max-width: 700px; width: 95vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes da venda" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingSale" v-show="loadingSale" />
      <q-card-section class="q-pa-md" v-show="!loadingSale">
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
                <b>Vendedor:</b>
                {{ Sale.seller_name }}
              </p>

              <p class="flex items-center">
                <q-icon name="flag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Status:</b>
                <span class="text-bold"> daskjdhaskjdasd </span>
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Faturas:</b> {{ formatToReal(Sale.fees) }}
              </p>

              <div class="q-mt-md">
                <p class="flex items-center">
                  <q-icon name="credit_card" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Pagamentos:</b>
                </p>

                <q-list
                  separator
                  bordered
                  style="max-height: 200px; overflow-y: auto"
                  class="q-mt-sm"
                >
                  <q-item
                    dense
                    v-for="(payment, index) in Sale.sale_payments_methods"
                    :key="index"
                    class="q-pa-sm"
                  >
                    <q-item-section>
                      <q-item-label>{{ getPaymentTypeLabel(payment.type) }}</q-item-label>
                    </q-item-section>

                    <q-item-section
                      v-if="payment.installments"
                      class="text-center"
                      style="max-width: 50px"
                    >
                      <q-item-label>{{ payment.installments }}X</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-weight-medium">
                        {{ formatToReal(payment.value) }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label>
                        {{ payment.receipt }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Cliente:</b>
                {{ Sale.client_name ? Sale.client_name : 'Consumidor final' }}
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Total da venda:</b>
                {{ formatToReal(Sale.total) }}
              </p>

              <p class="flex items-center">
                <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Data de criação:</b> {{ formatToBrazilianDateTime(Sale.date) }}
              </p>
            </div>
          </div>
        </q-card>
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm" v-if="Sale.sale_delivery">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="moped" class="q-mr-sm" />
            Informações da Entrega
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Nome do recebedor:</b>
                {{ Sale.sale_delivery.recipient_name }}
              </p>

              <p class="flex items-center">
                <q-icon name="contact_phone" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Telefone do recebedor:</b>
                <span class="text-bold">{{
                  formatBrazilianCellphone(Sale.sale_delivery.recipient_phone)
                }}</span>
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Frete:</b> {{ formatToReal(Sale.sale_delivery.freight_value) }}
              </p>

              <div class="q-mt-md">
                <p class="flex items-center">
                  <q-icon name="location_on" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">CEP:</b>{{ Sale.sale_delivery.cep }}
                </p>
              </div>
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <q-icon name="my_location" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Estado:</b>
                  {{ Sale.sale_delivery.state }}
                </p>

                <p class="flex items-center">
                  <q-icon name="location_city" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Cidade:</b>
                  {{ Sale.sale_delivery.city }}
                </p>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="home_work" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Bairro:</b> {{ Sale.sale_delivery.neighborhood }}
              </p>

              <p class="flex items-center">
                <q-icon name="home" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Logradouro:</b>
                {{ Sale.sale_delivery.address }}
              </p>

              <p class="flex items-center">
                <q-icon name="tag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Número:</b>
                {{ Sale.sale_delivery.number_address }}
              </p>

              <p class="flex items-center">
                <q-icon name="tag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Complemento:</b> {{ Sale.sale_delivery.complement }}
              </p>

              <p class="flex items-center">
                <q-icon name="description" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Observação:</b> {{ Sale.sale_delivery.observation }}
              </p>
            </div>
          </div>
        </q-card>
        <div v-if="true" class="column q-gutter-md">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary q-pa-xs">
              <q-icon name="shopping_cart" class="q-mr-sm" />Itens da Venda
            </div>
            <q-separator />
            <q-list class="column q-gutter-y-sm">
              <q-item
                class="q-py-md border-full-grey-light rounded-borders"
                v-for="(product, index) in Sale.sale_itens"
                :key="index"
              >
                <q-item-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="shopping_bag" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Produto:</b>
                        {{ product.product_name }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="view_module" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Grade:</b>{{ product.grid }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="qr_code_2" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Código:</b>{{ product.code }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="label" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">SKU:</b>{{ product.product_sku }}
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="palette" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Cor:</b>
                        <span class="cursor-pointer" :style="getColorStyle(product.color ?? '')">
                          <q-tooltip>{{ product.color_name }}</q-tooltip>
                        </span>
                      </p>

                      <p class="flex items-center">
                        <q-icon name="payments" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Custo unitário:</b
                        >{{ formatToReal(product.product_price) }}
                      </p>
                    </div>

                    <div class="col-12">
                      <q-separator spaced />
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="shopping_cart" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde comprada:</b> {{ product.quantity }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="inventory" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Total:</b> {{ formatToReal(product.total) }}
                      </p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="col-12 q-mt-sm" v-if="false">testando</div>
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
              <div class="col-12">testando</div>
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
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
