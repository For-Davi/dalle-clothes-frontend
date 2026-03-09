<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { SaleCancellationLabels } from 'src/enums/sale-cancellation-reason-enum';
import type { SaleCancellationReason } from 'src/enums/sale-cancellation-reason-enum';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'SaleCancellationDetails',
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

const { loadingCancellation, saleCancellation } = storeToRefs(useSaleStore());

const getCancellation = async () => {
  await useSaleStore().getSaleCancellation(props.data.saleID ?? 0);
};
const getCancellationReasonLabels = (reason: string) => {
  return SaleCancellationLabels[reason as SaleCancellationReason] ?? reason;
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (props.data.open) {
    await getCancellation();
  }
});
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card
      style="width: 600px; max-width: 90vw"
      class="bg-grey-2 form-basic column justify-between"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes oe cancelamento" icon="money_off" />
      </q-card-section>
      <q-card-section>
        <Loading v-show="loadingCancellation" :show="loadingCancellation" />
        <q-card flat bordered class="q-pa-md bg-white q-mb-sm" v-if="!loadingCancellation">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="info" class="q-mr-sm" />
            Informações do Cancelamento
          </div>

          <q-separator spaced />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Criada por:</b>
                {{ saleCancellation.created_by_name }}
              </p>
              <p class="flex items-center">
                <q-icon name="person" class="q-mr-sm text-primary" />
                <b>Email:</b>
                {{ saleCancellation.created_by_email }}
              </p>
              <p class="flex items-center">
                <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                <b class="q-mr-sm">Criado em:</b>
                {{ saleCancellation.created_at }}
              </p>
            </div>

            <div class="col-12 q-px-md q-py-none">
              <div class="q-gutter-y-xs">
                <q-card flat bordered class="q-pa-md q-mb-lg bg-grey-1">
                  <div class="text-subtitle2 text-black text-bold">
                    Motivo: {{ getCancellationReasonLabels(saleCancellation.reason) }}
                  </div>

                  <div class="text-body2 text-black q-mt-xs text-bold">
                    Descrição:
                    <span
                      class="text-black text-bold break-word"
                      style="white-space: pre-line; word-break: break-word"
                      >{{ saleCancellation.description ?? 'Nenhuma descrição adicionada' }}</span
                    >
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </q-card>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            :loading="loadingCancellation"
            unelevated
            no-caps
            flat
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
