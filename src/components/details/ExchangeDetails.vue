<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from 'src/components/shared/Loading.vue';
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useExchangeStore } from 'src/stores/exchange-store';
import type { PaymentType } from 'src/enums/payment-enum';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'ExchangeDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    exchangeID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingExchange, Exchange } = storeToRefs(useExchangeStore());

const getExchange = async () => {
  if (exchangeID.value) {
    return await useExchangeStore().showExchange(exchangeID.value);
  }
};
const getPaymentTypeLabel = (type: string) => {
  return PaymentTypeLabels[type as PaymentType] ?? type;
};

const exchangeID = computed(() => props.data.exchangeID);
const hasExchangePayments = computed(
  () => (Exchange.value.exchange_payment_method?.length ?? 0) > 0,
);

const hasDifferencePayments = computed(
  () => (Exchange.value.difference_payment_method?.length ?? 0) > 0,
);

const hasAnyPayments = computed(() => hasExchangePayments.value || hasDifferencePayments.value);

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    await getExchange();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingExchange ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'
      "
      style="min-width: 40vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes do estorno ou diferença" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingExchange" v-show="loadingExchange" />
      <q-card-section class="q-pa-md" v-show="!loadingExchange">
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="info" class="q-mr-sm" />
            {{ hasExchangePayments ? 'Informações da Diferença' : 'Informações do Estorno' }}
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Criado (nome):</b>
                {{ Exchange.created_by_name }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Criado (email):</b>
                {{ Exchange.created_by_email }}
              </p>

              <p class="flex items-center">
                <q-icon name="flag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Status:</b>
                <span class="text-bold"
                  ><q-icon
                    :name="Exchange.status === 'Ativo' ? 'check_circle' : 'close'"
                    :color="Exchange.status === 'Ativo' ? 'green' : 'red'"
                    class="cursor-pointer"
                    size="17px"
                  />{{ Exchange.status == 'Ativo' ? 'Ativo' : 'Cancelado' }}
                </span>
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm"
                  >{{ Exchange.exchange_value > 0 ? 'Valor a estornar' : 'Diferença a pagar' }}:</b
                >
                {{
                  Exchange.exchange_value > 0
                    ? formatToReal(Exchange.exchange_value)
                    : formatToReal(Exchange.difference_value)
                }}
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Tarifas:</b>
                {{ Exchange.fees ? formatToReal(Exchange.fees) : '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Troco:</b>
                {{ Exchange.change ? formatToReal(Exchange.change) : '-' }}
              </p>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Atualizado (nome):</b>
                {{ Exchange.updated_by_name ?? '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Atualizado (email):</b>
                {{ Exchange.updated_by_email ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Data de criação:</b>
                {{ Exchange.created_at }}
              </p>

              <p class="flex items-center">
                <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Data de atualização:</b>
                {{ Exchange.updated_at ?? '-' }}
              </p>
            </div>

            <div class="col-12 q-px-md q-py-none">
              <div>
                <p class="flex items-center">
                  <q-icon name="credit_card" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Pagamentos:</b>
                  <span v-if="!hasAnyPayments">Nenhum pagamento realizado</span>
                </p>

                <q-list separator bordered class="q-mt-sm" v-if="hasExchangePayments">
                  <q-item
                    dense
                    v-for="(payment, index) in Exchange.exchange_payment_method"
                    :key="index"
                  >
                    <q-item-section class="text-left">
                      <q-item-label>{{
                        getPaymentTypeLabel(payment.type_receipt_name)
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium text-center">
                        {{ formatToReal(payment.value) }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-weight-medium text-right">
                        {{ payment.receipt_name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-list separator bordered class="q-mt-sm" v-if="hasDifferencePayments">
                  <q-item
                    dense
                    v-for="(payment, index) in Exchange.difference_payment_method"
                    :key="index"
                  >
                    <q-item-section class="text-left">
                      <q-item-label>{{
                        getPaymentTypeLabel(payment.type_receipt_name)
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section
                      v-if="Exchange.difference_payment_method && payment.installments"
                      class="text-center"
                    >
                      <q-item-label>{{ payment.installments }}X</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium text-center">
                        {{ formatToReal(payment.value) }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-weight-medium text-right">
                        {{ payment.receipt_name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-card flat bordered class="q-pa-md q-mt-lg bg-grey-1">
                <div class="text-body2 text-black q-mt-xs text-bold">
                  Descrição:
                  <span class="text-black text-bold">{{
                    Exchange.description ? Exchange.description : 'Nenhuma descrição adicionada'
                  }}</span>
                </div>
              </q-card>
            </div>
          </div>
        </q-card>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end q-pr-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
</template>
