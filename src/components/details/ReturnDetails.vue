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
      <q-card-section class="q-pa-md" v-show="!loadingReturn">
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
            </div>

            <div class="col-12 col-sm-6">
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
