<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { watch } from 'vue';

defineOptions({
  name: 'ProductAdvanced',
});

const props = defineProps<{
  loading: boolean;
}>();
const advanced = defineModel<IVModelProductAdvanced>('dataAdvanced', { required: true });

watch(
  () => advanced.value.discountMaxPercentage,
  (newDiscount) => {
    if (newDiscount.trim() !== '') {
      advanced.value.discountMaxPercentage = newDiscount.replace(/^0+/, '');
    }
    if (Number(newDiscount) > 100) {
      advanced.value.discountMaxPercentage = '100';
    }
  },
  { immediate: true },
);
watch(
  () => advanced.value.commissionPercentage,
  (newCommission) => {
    if (newCommission.trim() !== '') {
      advanced.value.commissionPercentage = newCommission.replace(/^0+/, '');
    }
    if (Number(newCommission) > 100) {
      advanced.value.commissionPercentage = '100';
    }
  },
  { immediate: true },
);
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Configurações do produto" icon="list_alt" />
    </q-card-section>
    <Loading :show="props.loading" />
    <q-card-section class="q-pa-sm" v-show="!props.loading">
      <q-form class="q-gutter-y-sm column">
        <q-toggle
          v-model="advanced.active"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          :true-value="1"
          :false-value="0"
        >
          <div class="column">
            <span class="text-bold text-body2">Disponibilidade do produto</span>
            <span
              >O produto poderá ser ativado ou desativado, controlando sua disponibilidade para
              venda. Produtos inativos não poderão ser comercializados.
            </span>
          </div>
        </q-toggle>
        <q-separator inset />
        <q-toggle
          v-model="advanced.allowCoupon"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          :true-value="1"
          :false-value="0"
        >
          <div class="column">
            <span class="text-bold text-body2">Cupom de desconto</span>
            <span>
              Ao ativar esta opção, o produto poderá receber cupons de desconto durante o processo
              de venda.
            </span>
          </div>
        </q-toggle>
        <q-separator inset />
        <q-toggle
          v-model="advanced.allowDiscount"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          :true-value="1"
          :false-value="0"
        >
          <div class="column">
            <span class="text-bold text-body2">Aplicação de desconto</span>
            <span>
              Ao ativar esta opção, o produto poderá receber descontos durante o processo de venda,
              desde que o usuário tenha permissão para aplicar descontos.
            </span>
          </div>
        </q-toggle>
        <q-input
          v-model="advanced.discountMaxPercentage"
          bg-color="white"
          label-color="black"
          :disable="advanced.allowDiscount === 0"
          outlined
          label="Desconto máximo %"
          dense
          input-class="text-black"
          style="width: 200px"
          class="q-ml-md"
          mask="###"
        />
        <q-separator inset />
        <q-toggle
          v-model="advanced.hasCommission"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          :true-value="1"
          :false-value="0"
        >
          <div class="column">
            <span class="text-bold text-body2">Comissão de venda</span>
            <span> Habilita a geração de comissão para este produto nas vendas. </span>
          </div>
        </q-toggle>
        <q-input
          v-model="advanced.commissionPercentage"
          bg-color="white"
          label-color="black"
          :disable="advanced.hasCommission === 0"
          outlined
          label="Comissão %"
          dense
          input-class="text-black"
          style="width: 200px"
          class="q-ml-md"
          mask="###"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>
