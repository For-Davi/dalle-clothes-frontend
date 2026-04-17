<script setup lang="ts">
import { useDeliveryStore } from 'src/stores/delivery-store';
import { storeToRefs } from 'pinia';
import { formatToReal } from 'src/composables/Money';
import { watch, computed } from 'vue';
import Loading from '../shared/Loading.vue';
import TitlePage from '../shared/TitlePage.vue';
import { formatToBrazilianDate } from 'src/composables/FormatData';

defineOptions({
  name: 'DeliveryDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    deliveryID: number | null;
  };
}>();

const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingDelivery, Delivery } = storeToRefs(useDeliveryStore());

const showDelivery = async () => {
  await useDeliveryStore().showDelivery(props.data.deliveryID ?? 0);
};

const formatBrazilianCellphone = (value: string | null): string => {
  if (!value) return '-';
  const digits = value.replace(/\D/g, '');
  const phone = digits.length === 13 && digits.startsWith('55') ? digits.slice(2) : digits;

  if (phone.length !== 11) return value;
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};

const formatScheduleDate = (date: string | null) => {
  if (date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
  return '-';
};

const attributesStatus = (status: string) => {
  if (status === 'pendent') return { name: 'Pendente', icon: 'timer' };
  if (status === 'scheduled') return { name: 'Agendada', icon: 'date_range' };
  if (status === 'delivered') return { name: 'Entregue', icon: 'check_circle' };
  if (status === 'partial_delivered')
    return { name: 'Entregue parcialmente', icon: 'check_circle' };
  if (status === 'delivered_in_person')
    return { name: 'Entregue presencialmente', icon: 'check_circle' };
  return { name: 'Não definido', icon: 'help' };
};
const compareDeliveryDates = (updatedAt: string | null, scheduledDate: string | null) => {
  if (!updatedAt || !scheduledDate) return null;

  const dateDelivered = new Date(updatedAt);
  dateDelivered.setHours(0, 0, 0, 0);

  const dateScheduled = new Date(scheduledDate + 'T00:00:00');
  dateScheduled.setHours(0, 0, 0, 0);

  const diffInMs = dateDelivered.getTime() - dateScheduled.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return {
      label: 'No prazo',
      color: 'positive',
      icon: 'check',
      message: 'Entregue no dia agendado',
    };
  } else if (diffInDays > 0) {
    return {
      label: 'Atrasado',
      color: 'negative',
      icon: 'warning',
      message: `Entregue depois de ${diffInDays} dia(s) do agendamento`,
    };
  } else {
    const daysBefore = Math.abs(diffInDays);
    return {
      label: 'Adiantado',
      color: 'info',
      icon: 'auto_awesome',
      message: `Entregue ${daysBefore} dia(s) antes do agendamento`,
    };
  }
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

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    await showDelivery();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingDelivery ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'
      "
      style="max-width: 700px; width: 95vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes da entrega" icon="moped" />
      </q-card-section>

      <Loading :show="loadingDelivery" v-show="loadingDelivery" />

      <q-card-section class="q-pa-md q-gutter-y-md" v-show="!loadingDelivery">
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="info" class="q-mr-sm" />
            Informações da Entrega
          </div>
          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon
                  :name="Delivery.return_id ? 'assignment_return' : 'point_of_sale'"
                  class="q-mr-sm text-primary"
                />
                <b>{{ Delivery.return_id ? 'Devolução' : 'Venda' }}:</b
                >{{ Delivery.return_id ? Delivery.return_id : Delivery.sale_id }}
              </p>

              <p class="flex items-center">
                <q-icon
                  :name="attributesStatus(Delivery.status)?.icon"
                  class="q-mr-sm text-primary"
                />
                <b>Status:</b>{{ attributesStatus(Delivery.status)?.name }}
              </p>

              <p class="flex items-center">
                <q-icon name="event" class="q-mr-sm text-primary" />
                <b>Agendamento:</b>{{ formatScheduleDate(Delivery.scheduled_date) }}
              </p>

              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Nome do recebedor:</b>{{ Delivery.recipient_name ?? '-' }}
              </p>

              <p class="flex items-center">
                <q-icon name="contact_phone" class="q-mr-sm text-primary" />
                <b>Telefone do recebedor:</b
                ><span class="text-bold">{{
                  formatBrazilianCellphone(Delivery.recipient_phone)
                }}</span>
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b>Entregador:</b>{{ Delivery.delivery_guy_name ?? '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b>Telefone do entregador:</b
                >{{ formatBrazilianCellphone(Delivery.delivery_guy_phone) }}
              </p>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="paid" class="q-mr-sm text-primary" />
                <b>Frete:</b>{{ formatToReal(Delivery.freight_value) }}
              </p>
              <p class="flex items-center">
                <q-icon name="edit_calendar" class="q-mr-sm text-primary" />
                <b>Última atualização:</b>{{ formatToBrazilianDate(Delivery.updated_at) }}
              </p>
              <p class="flex items-center">
                <q-icon name="account_circle" color="primary" class="q-mr-xs" />
                <b>Atualizado por:</b> {{ Delivery.updated_by_name ?? '-' }}
              </p>
              <p class="flex items-center">
                <q-icon name="date_range" color="primary" class="q-mr-xs" />
                <b>Data de criação:</b> {{ formatToBrazilianDate(Delivery.created_at) }}
              </p>
              <p
                v-if="
                  Delivery.scheduled_date &&
                  (Delivery.status === 'delivered' || Delivery.status === 'delivered_in_person')
                "
                class="flex items-center"
              >
                <q-icon
                  :name="compareDeliveryDates(Delivery.updated_at, Delivery.scheduled_date)?.icon"
                  :color="compareDeliveryDates(Delivery.updated_at, Delivery.scheduled_date)?.color"
                  class="q-mr-xs"
                />
                <b
                  >{{
                    compareDeliveryDates(Delivery.updated_at, Delivery.scheduled_date)?.label
                  }}:</b
                >
                {{ compareDeliveryDates(Delivery.updated_at, Delivery.scheduled_date)?.message }}
              </p>
            </div>
          </div>
        </q-card>

        <q-card flat bordered class="q-pa-md bg-white">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="location_on" class="q-mr-sm" />
            Endereço de Destino
          </div>
          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="map" class="q-mr-sm text-primary" />
                <b>CEP:</b>{{ Delivery.cep }}
              </p>
              <p class="flex items-center">
                <q-icon name="location_city" class="q-mr-sm text-primary" />
                <b>Cidade/UF:</b>{{ Delivery.city }} / {{ Delivery.state }}
              </p>
              <p class="flex items-center">
                <q-icon name="home_work" class="q-mr-sm text-primary" />
                <b>Bairro:</b>{{ Delivery.neighborhood ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="home" class="q-mr-sm text-primary" />
                <b>Logradouro:</b>{{ Delivery.address ?? '-' }},
                {{ Delivery.number_address ?? 'S/N' }}
              </p>
              <p class="flex items-center">
                <q-icon name="tag" class="q-mr-sm text-primary" />
                <b>Complemento:</b>{{ Delivery.complement ?? '-' }}
              </p>
            </div>

            <div class="col-12">
              <q-banner dense class="bg-grey-1 rounded-borders border-full-grey-light">
                <template v-slot:avatar>
                  <q-icon name="description" color="primary" />
                </template>
                <div class="text-italic text-grey-9">
                  <b>Observação:</b> {{ Delivery.observation ?? 'Nenhuma observação adicionada' }}
                </div>
              </q-banner>
            </div>
          </div>
        </q-card>

        <div class="column q-gutterx-md">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary q-pa-xs">
              <q-icon name="shopping_cart" class="q-mr-sm" />{{
                Delivery.return_id ? 'Itens da troca' : 'Itens da venda'
              }}
            </div>
            <q-separator />
            <q-list class="column q-gutter-y-sm">
              <q-item
                class="q-py-md border-full-grey-light rounded-borders"
                v-for="(product, index) in Delivery.items"
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
                        <b class="q-mr-sm">Código:</b>{{ product.product_code }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="label" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">SKU:</b>{{ product.product_sku }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="palette" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Cor:</b>
                        <span class="cursor-pointer" :style="getColorStyle(product.color ?? '')">
                          <q-tooltip>{{ product.color_name }}</q-tooltip>
                        </span>
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="payments" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Custo unitário:</b
                        >{{ formatToReal(product.product_price) }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="shopping_cart" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde comprada:</b> {{ product.quantity }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="local_shipping" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde entregue:</b> {{ product.quantity_delivered ?? 0 }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="local_shipping" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Entregue:</b
                        ><span>
                          <q-icon
                            :color="product.delivered ? 'green-5' : 'red'"
                            :name="product.delivered ? 'check_circle' : 'cancel'"
                            size="xs"
                          />
                        </span>
                      </p>

                      <p class="flex items-center">
                        <q-icon name="inventory" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Total:</b> {{ formatToReal(product.total) }}
                      </p>
                    </div>
                    <div class="col-12">
                      <q-separator spaced v-if="index < Delivery.items.length - 1" />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn
          color="red"
          label="Fechar"
          @click="open = false"
          unelevated
          flat
          no-caps
          class="q-px-lg"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
