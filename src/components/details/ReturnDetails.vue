<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from 'src/components/shared/Loading.vue';
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useReturnStore } from 'src/stores/return-store';
import TableReturnProductsDetails from '../table/TableReturnProductsDetails.vue';
import { ReturnReasonLabels } from 'src/enums/return-reason-enum';
import type { ReturnReason } from 'src/enums/return-reason-enum';
import { formatToReal } from 'src/composables/Money';
import type { PaymentType } from 'src/enums/payment-enum';
import { PaymentTypeLabels } from 'src/enums/payment-enum';

defineOptions({
  name: 'ReturnDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    returnID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'navegate:linked-return': [number];
}>();

const { loadingReturn, Return } = storeToRefs(useReturnStore());

const getReturn = async () => {
  if (returnID.value) {
    return await useReturnStore().showReturn(returnID.value);
  }
};
const getReturnReasonLabels = (reason: string) => {
  return ReturnReasonLabels[reason as ReturnReason] ?? reason;
};
const getPaymentTypeLabel = (type: string) => {
  return PaymentTypeLabels[type as PaymentType] ?? type;
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
const formatBrazilianCellphone = (value: string | null): string => {
  if (!value) return '-';

  const phone = parseBrazilianCellphone(value);

  if (!phone) return '-';

  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};
const statusTranslate = (status: string) => {
  if (status === 'pendent') return { name: 'Pendente' };
  if (status === 'scheduled') return { name: 'Agendada' };
  if (status === 'delivered') return { name: 'Entregue' };
  if (status === 'partial_delivered') return { name: 'Entregue parcialmente' };
  if (status === 'delivered_in_person') return { name: 'Entregue presencialmente' };
};

const returnID = computed(() => props.data.returnID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const groupedReturnItems = computed(() => {
  if (!Return.value?.return_items?.length) return [];

  const groups: Record<string, any> = {};

  Return.value.return_items.forEach((item) => {
    const reason = item.reason;

    if (!groups[reason]) {
      groups[reason] = {
        reason,
        description: item.description,
        items: [],
      };
    }

    groups[reason].items.push(item);
  });

  return Object.values(groups);
});
const paymentsToShow = computed(() => {
  if (Return.value.exchange_payment_methods?.length > 0) {
    return Return.value.exchange_payment_methods;
  }

  return Return.value.sale_payment_methods || [];
});
const paymentTitle = computed(() => {
  const row = Return.value;
  if (!row) return 'Pagamento';

  if (Number(row.exchange_value) > 0) {
    return 'Pagamento do estorno';
  }

  if (Number(row.difference_value) > 0) {
    return 'Pagamento da diferença';
  }

  if (
    Number(row.exchange_value) === 0 &&
    Number(row.difference_value) === 0 &&
    row.sale_payment_methods?.length > 0
  ) {
    return 'Pagamento do frete';
  }

  return 'Pagamento';
});

watch(open, async () => {
  if (open.value) {
    await getReturn();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingReturn ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'
      "
      style="min-width: 50vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes da devolução" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingReturn" v-show="loadingReturn" />
      <q-card-section class="q-pa-md" v-if="!loadingReturn">
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="info" class="q-mr-sm" />
            Informações da Devolução
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Criada (nome):</b>
                {{ Return.created_by_name }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Criada (email):</b>
                {{ Return.created_by_email }}
              </p>

              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Vendedor responsável pela troca (nome):</b>
                {{ Return.seller_name ?? '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Vendedor responsável pela troca (email):</b>
                {{ Return.seller_email ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="flag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Status:</b>
                <span class="text-bold"
                  ><q-icon
                    :name="Return.status === 'Ativa' ? 'check_circle' : 'close'"
                    :color="Return.status === 'Ativa' ? 'green' : 'red'"
                    class="cursor-pointer"
                    size="17px"
                  />{{ Return.status == 'Ativa' ? 'Ativa' : 'Cancelada' }}
                </span>
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Vinculada com a devolução:</b>
                {{ Return.linked_return_id ? Return.linked_return_id : '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Valor do estorno:</b>
                {{ formatToReal(Return.exchange_value) }}
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Valor da diferença:</b>
                {{ formatToReal(Return.difference_value) }}
              </p>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="local_shipping" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Troco do frete:</b>
                {{ formatToReal(Return.freight_change) }}
              </p>
              <p class="flex items-center">
                <q-icon name="local_shipping" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Tarifas do frete:</b>
                {{ formatToReal(Return.freight_fees) }}
              </p>
              <p class="flex items-center">
                <q-icon name="attach_money" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Troco:</b>
                {{ formatToReal(Return.change) }}
              </p>
              <p class="flex items-center">
                <q-icon name="attach_money" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Tarifas:</b>
                {{ formatToReal(Return.fees) }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Atualizada (nome):</b>
                {{ Return.updated_by_name ? Return.updated_by_name : '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Atualizada (email):</b>
                {{ Return.updated_by_email ? Return.updated_by_email : '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Data de criação:</b>
                {{ Return.created_at }}
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Data de atualização:</b>
                {{ Return.updated_at === Return.created_at ? '-' : Return.updated_at }}
              </p>
            </div>

            <div class="col-12 q-px-md q-py-none">
              <div>
                <p class="flex items-center">
                  <q-icon name="credit_card" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Produtos devolvidos:</b>
                </p>

                <div
                  v-for="(group, index) in groupedReturnItems"
                  :key="index"
                  class="q-gutter-y-xs"
                >
                  <TableReturnProductsDetails :rows="group.items" :loading="loadingReturn" />
                  <q-card flat bordered class="q-pa-md q-mb-lg bg-grey-1">
                    <div class="text-subtitle2 text-black text-bold">
                      Motivo: {{ getReturnReasonLabels(group.reason) }}
                    </div>

                    <div class="text-body2 text-black q-mt-xs text-bold">
                      Descrição:
                      <span class="text-black text-bold">{{
                        group.description ? group.description : 'Nenhuma descrição adicionada'
                      }}</span>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </q-card>
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm" v-if="Return.delivery">
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
                {{ Return.delivery.recipient_name ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="contact_phone" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Telefone do recebedor:</b>
                <span class="text-bold">{{
                  formatBrazilianCellphone(Return.delivery.recipient_phone)
                }}</span>
              </p>

              <p class="flex items-center">
                <q-icon name="local_shipping" class="q-mr-sm text-primary" />
                <b>Nome do entregador:</b>
                {{ Return.delivery.delivery_guy_name ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="contact_phone" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Telefone do entregador:</b>
                <span class="text-bold">{{
                  formatBrazilianCellphone(Return.delivery.delivery_guy_phone)
                }}</span>
              </p>

              <p class="flex items-center">
                <q-icon name="flag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Status:</b>
                <span class="text-bold">{{ statusTranslate(Return.delivery.status)?.name }}</span>
              </p>

              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Frete:</b> {{ formatToReal(Return.delivery.freight_value) }}
              </p>

              <div class="q-mt-md">
                <p class="flex items-center">
                  <q-icon name="location_on" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">CEP:</b>{{ Return.delivery.cep }}
                </p>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="my_location" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Estado:</b>
                {{ Return.delivery.state }}
              </p>

              <p class="flex items-center">
                <q-icon name="location_city" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Cidade:</b>
                {{ Return.delivery.city }}
              </p>

              <p class="flex items-center">
                <q-icon name="home_work" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Bairro:</b> {{ Return.delivery.neighborhood }}
              </p>

              <p class="flex items-center">
                <q-icon name="home" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Logradouro:</b>
                {{ Return.delivery.address }}
              </p>

              <p class="flex items-center">
                <q-icon name="tag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Número:</b>
                {{ Return.delivery.number_address }}
              </p>

              <p class="flex items-center">
                <q-icon name="tag" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Complemento:</b> {{ Return.delivery.complement }}
              </p>

              <p class="flex items-center">
                <q-icon name="description" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Observação:</b> {{ Return.delivery.observation }}
              </p>
            </div>
          </div>
        </q-card>
        <div class="column q-gutter-md" v-if="Return.return_exchange_items?.length > 0">
          <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
            <div class="text-h6 text-primary q-pa-xs">
              <q-icon name="shopping_cart" class="q-mr-sm" />Itens Trocados
            </div>
            <q-separator />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <q-icon name="credit_card" class="q-pa-sm text-primary" />
                  <b>Produtos trocados:</b>
                </p>
              </div>
            </div>
            <TableReturnProductsDetails
              :rows="Return.return_exchange_items"
              :loading="loadingReturn"
            />
          </q-card>
        </div>
        <div
          class="column q-gutter-md"
          v-if="
            Return.exchange_payment_methods.length > 0 || Return.sale_payment_methods.length > 0
          "
        >
          <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
            <div class="text-h6 text-primary q-pa-xs">
              <q-icon name="payments" class="q-mr-sm" />{{ paymentTitle }}
            </div>
            <div class="col-12 q-px-md q-py-none">
              <div>
                <q-list separator bordered class="q-mt-sm">
                  <q-item dense v-for="(payment, index) in paymentsToShow" :key="index">
                    <q-item-section class="text-left">
                      <q-item-label>{{ getPaymentTypeLabel(payment.type) }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-if="payment.installments" class="text-center">
                      <q-item-label>{{ payment.installments }}X</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium text-center">
                        {{ formatToReal(payment.value) }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-weight-medium text-right">
                        {{ payment.receipt }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card>
        </div>
        <div
          class="column q-gutter-md"
          v-if="Return.sale_payment_methods.length > 0 && Return.exchange_value > 0"
        >
          <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
            <div class="text-h6 text-primary q-pa-xs">
              <q-icon name="payments" class="q-mr-sm" />Pagamento do frete
            </div>
            <div class="col-12 q-px-md q-py-none">
              <div>
                <q-list separator bordered class="q-mt-sm">
                  <q-item
                    dense
                    v-for="(payment, index) in Return.sale_payment_methods"
                    :key="index"
                  >
                    <q-item-section class="text-left">
                      <q-item-label>{{ getPaymentTypeLabel(payment.type) }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-if="payment.installments" class="text-center">
                      <q-item-label>{{ payment.installments }}X</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium text-center">
                        {{ formatToReal(payment.value) }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-weight-medium text-right">
                        {{ payment.receipt }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card>
        </div>
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
</template>
