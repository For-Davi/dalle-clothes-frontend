<script setup lang="ts">
import { useDeliveryStore } from 'src/stores/delivery-store';
import { storeToRefs } from 'pinia';
import { columnsDelivery } from 'src/utils/columns';
import { formatToBrazilianDate } from 'src/composables/FormatData';
import { formatToReal } from 'src/composables/Money';
import DeliveryDetails from '../details/DeliveryDetails.vue';
import { reactive, computed } from 'vue';
import FormScheduleDelivery from '../form/FormScheduleDelivery.vue';
import FormPartialDeliveredDelivery from '../form/FormPartialDeliveredDelivery.vue';

defineOptions({
  name: 'DeliveriesList',
});

const props = defineProps<{
  listDeliveries: IDelivery[];
  filter?: string;
  all?: boolean;
  status: string;
}>();

const { loadingDeliveries } = storeToRefs(useDeliveryStore());

const showDeliveryDetails = reactive({
  open: false as boolean,
  deliveryID: null as number | null,
});
const showFormScheduleDelivery = reactive({
  open: false as boolean,
  deliveryID: null as number | null,
  status: '' as string,
});
const showFormPartialDelivered = reactive({
  open: false as boolean,
  saleID: null as number | null,
  returnID: null as number | null,
  deliveryID: null as number | null,
  status: '' as string,
});

const changeShowDeliveryDetails = (open: boolean, deliveryID: number | null = null): void => {
  Object.assign(showDeliveryDetails, {
    open,
    deliveryID,
  });
};
const changeShowFormScheduleDelivery = (open: boolean, deliveryID: number | null = null): void => {
  Object.assign(showFormScheduleDelivery, {
    open,
    deliveryID,
    status: props.status,
  });
};
const changeShowFormPartialDelivered = (
  open: boolean,
  saleID: number | null = null,
  returnID: number | null = null,
  deliveryID: number | null = null,
): void => {
  Object.assign(showFormPartialDelivered, {
    open,
    saleID,
    returnID,
    deliveryID,
    status: props.status,
  });
};
const getStatusAttributes = (status: string) => {
  if (status === 'delivered') {
    return {
      name: 'Entregue',
      color: 'green-5',
      textColor: 'green-1',
      icon: 'check_circle',
      hexColor: '#4CAF50',
    };
  }
  if (status === 'scheduled') {
    return {
      name: 'Agendada',
      color: 'primary',
      textColor: 'blue-1',
      icon: 'date_range',
      hexColor: '#1976D2',
    };
  }
  if (status === 'pendent') {
    return {
      name: 'Pendente',
      color: 'amber-7',
      textColor: 'amber-1',
      icon: 'timer',
      hexColor: '#FFA000',
    };
  }
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

  if (!phone) return '-';

  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};
const getPriority = (status: string): number => {
  if (status === 'scheduled') return 1;
  if (status === 'pendent') return 2;

  if (status === 'delivered' || status === 'partial_delivery' || status === 'delivered_in_person') {
    return 3;
  }

  return 99;
};
const formatScheduleDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};
const checkDueScheduleDate = (date: string): boolean => {
  const [year, month, day] = date.split('-').map(Number);

  const scheduledDate = new Date(year, month - 1, day);

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  scheduledDate.setHours(0, 0, 0, 0);

  return scheduledDate.getTime() < today.getTime();
};

const sortedDeliveries = computed(() => {
  if (props.all) {
    return [...props.listDeliveries].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } else {
    return [...props.listDeliveries].sort((a, b) => {
      if (a.status === 'pendent' && b.status === 'pendent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (a.status === 'scheduled' && b.status === 'scheduled') {
        const today = new Date().getTime();

        const diffA = Math.abs(new Date(a.scheduled_date ?? '').getTime() - today);
        const diffB = Math.abs(new Date(b.scheduled_date ?? '').getTime() - today);

        return diffA - diffB;
      }

      return getPriority(a.status) - getPriority(b.status);
    });
  }
});
</script>

<template>
  <section>
    <q-table
      grid
      :rows="loadingDeliveries ? [] : sortedDeliveries"
      :columns="columnsDelivery"
      :filter="props.filter"
      :loading="loadingDeliveries"
      row-key="id"
      card-container-class="row q-col-gutter-md"
      no-data-label="Nenhuma entrega para mostrar"
      :rows-per-page-options="[0]"
    >
      <template v-slot:item="props">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card
            class="user-card q-pa-xs"
            flat
            bordered
            :style="{
              border: '2px solid transparent',
              borderRadius: '12px',
              background: `
      linear-gradient(white, white) padding-box,
      linear-gradient(
        to right,
        ${getStatusAttributes(props.row.status)?.hexColor},
        #e0e0e0
      ) border-box
    `,
            }"
          >
            <div class="flex justify-between">
              <q-chip
                dense
                class="q-pa-md"
                :color="getStatusAttributes(props.row.status)?.color"
                :text-color="getStatusAttributes(props.row.status)?.textColor"
                :icon="getStatusAttributes(props.row.status)?.icon"
              >
                {{ getStatusAttributes(props.row.status)?.name }}
              </q-chip>

              <div v-if="props.row.status === 'pendent'" class="row items-center q-mr-sm">
                <q-icon name="date_range" color="secondary" size="xs" class="q-mr-sm" />
                <div class="text-grey-9">Data:</div>
                <div class="text-grey-9 q-ml-xs">
                  {{ formatToBrazilianDate(props.row.created_at) }}
                </div>
              </div>
              <div v-if="props.row.status === 'scheduled'" class="row items-center q-mr-sm">
                <q-icon name="date_range" color="blue" size="xs" class="q-mr-sm" />
                <div class="text-grey-9">Agendada para:</div>
                <div class="text-grey-9 q-ml-xs">
                  {{ formatScheduleDate(props.row.scheduled_date) }}
                </div>
                <q-icon
                  v-if="checkDueScheduleDate(props.row.scheduled_date)"
                  name="warning"
                  color="red"
                  size="xs"
                  class="q-ml-md cursor-pointer"
                >
                  <q-tooltip> Atrasado </q-tooltip>
                </q-icon>
              </div>
            </div>

            <q-card-section class="text-center q-pb-none">
              <section class="flex justify-start q-gutter-x-md">
                <section>
                  <div class="row items-center q-mb-xs">
                    <q-icon name="location_city" color="primary" size="xs" class="q-mr-sm" />
                    <div class="text-weight-light text-grey-8">{{ props.row.city }}</div>
                  </div>

                  <div class="row items-center q-mb-xs">
                    <q-icon name="flag" color="primary" size="xs" class="q-mr-sm" />
                    <div class="text-weight-light text-grey-8">{{ props.row.state }}</div>
                  </div>

                  <div class="row items-center q-mb-xs">
                    <q-icon name="holiday_village" color="primary" size="xs" class="q-mr-sm" />
                    <div class="text-weight-light text-grey-8">{{ props.row.neighborhood }}</div>
                  </div>

                  <div class="row items-center q-mb-sm">
                    <q-icon name="point_of_sale" color="secondary" size="xs" class="q-mr-sm" />
                    <div class="text-grey-8 q-mr-xs">Venda:</div>
                    <div class="text-grey-8">{{ props.row.sale_id }}</div>
                  </div>
                </section>

                <section>
                  <div class="row items-center q-mb-xs">
                    <q-icon name="person" color="primary" size="xs" class="q-mr-sm" />
                    <div class="text-weight-light text-grey-8">
                      {{ props.row.recipient_name ?? '-' }}
                    </div>
                  </div>
                  <div class="row items-center q-mb-xs">
                    <q-icon name="call" color="primary" size="xs" class="q-mr-sm" />
                    <div class="text-weight-light text-grey-8">
                      {{ formatBrazilianCellphone(props.row.recipient_phone) }}
                    </div>
                  </div>
                  <div class="row items-center q-mb-xs">
                    <q-icon name="attach_money" color="primary" size="xs" />
                    <div class="text-weight-light text-grey-8 q-mr-xs">Frete:</div>
                    <div class="text-weight-light text-grey-8">
                      {{ formatToReal(props.row.freight_value) }}
                    </div>
                  </div>
                </section>
              </section>

              <q-separator inset class="q-my-sm" />

              <div class="row justify-end items-end">
                <div class="row">
                  <q-btn
                    v-if="props.row.status === 'pendent'"
                    @click="changeShowFormScheduleDelivery(true, props.row.id)"
                    flat
                    round
                    color="indigo-11"
                    icon="date_range"
                    size="sm"
                  >
                    <q-tooltip>Agendar entrega</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="props.row.status !== 'delivered'"
                    @click="changeShowFormScheduleDelivery(true, props.row.id)"
                    flat
                    round
                    color="green-5"
                    icon="done_all"
                    size="sm"
                  >
                    <q-tooltip>Finalizar entrega</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="props.row.status !== 'delivered'"
                    @click="
                      changeShowFormPartialDelivered(
                        true,
                        props.row.sale_id,
                        props.row.return_id,
                        props.row.id,
                      )
                    "
                    flat
                    round
                    color="orange-7"
                    icon="check"
                    size="sm"
                  >
                    <q-tooltip>Finalizar entrega parcialmente</q-tooltip>
                  </q-btn>
                  <q-btn
                    @click="changeShowDeliveryDetails(true, props.row.id)"
                    flat
                    round
                    color="primary"
                    icon="visibility"
                    size="sm"
                  >
                    <q-tooltip>Detalhes da entrega</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
    <!-- Modals -->
    <DeliveryDetails :data="showDeliveryDetails" @update:open="changeShowDeliveryDetails(false)" />
    <FormScheduleDelivery
      :data="showFormScheduleDelivery"
      @update:open="changeShowFormScheduleDelivery(false)"
    />
    <FormPartialDeliveredDelivery
      :data="showFormPartialDelivered"
      @update:open="changeShowFormPartialDelivered(false)"
    />
  </section>
</template>
