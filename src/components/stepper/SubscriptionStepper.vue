<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import Loading from '../shared/Loading.vue';
import FormCreditCard from '../fragments/subscription/FormCreditCard.vue';
import QrCodePix from '../fragments/subscription/QrCodePix.vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { checkPaymentCreditCardData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { onMounted, onUnmounted } from 'vue';
import echo from 'src/plugins/echo';

defineOptions({
  name: 'SubscriptionStepper',
});

const emit = defineEmits<{
  'update:open': [void];
}>();
const props = defineProps<{
  subscriptionID: number;
}>();

const { loadingSubscription } = storeToRefs(useSubscriptionStore());

const step = ref<number>(1);
const type = ref<'credit' | 'pix' | null>(null);
const dataPaymentCreditCard = reactive({
  subscriptionID: props.subscriptionID,
  creditCard: {
    holderName: '' as string,
    number: '' as string,
    expiryMonth: '' as string,
    expiryYear: '' as string,
    ccv: '' as string,
  },
  creditCardHolderInfo: {
    name: '' as string,
    email: '' as string,
    cpfCnpj: '' as string,
    postalCode: '' as string,
    addressNumber: '' as string,
    addressComplement: '' as string,
    phone: '' as string,
  },
});

const checkType = async () => {
  if (type.value === 'credit') {
    await sendDataCreditCard(dataPaymentCreditCard);
  }
};
const sendDataCreditCard = async (dataCreditCard: IVMPaymentSubscriptionCreditCard) => {
  const check = checkPaymentCreditCardData(dataCreditCard);
  if (check.status) {
    await useSubscriptionStore().sendCreditCardData(dataCreditCard);
  } else {
    createErrorData(check.message || 'Erro ao enviar dados do cartão');
  }
};

const changeType = (sendType: 'pix' | 'credit') => {
  type.value = sendType;
  step.value = 2;
};
const back = () => {
  type.value = null;
  step.value = 1;
  Object.assign(dataPaymentCreditCard, {
    creditCard: {
      holderName: '',
      number: '',
      expiryMonth: '',
      expiryYear: '',
      ccv: '',
    },
    creditCardHolderInfo: {
      name: '',
      email: '',
      cpfCnpj: '',
      postalCode: '',
      addressNumber: '',
      addressComplement: '',
      phone: '',
    },
  });
};
const createChannelPayment = () => {
  echo.channel('payments').listen('.payment.made', () => {
    useSubscriptionStore().setLoading(false);
    step.value = 3;
  });
};

const stepTitle = computed(() => {
  if (type.value === 'credit') return 'Formulário do cartão de crédito';
  if (type.value === 'pix') return 'Escaneie o QRCode ou copie e cole';
  return '';
});

onMounted(() => {
  createChannelPayment();
});

onUnmounted(() => {
  echo.leaveChannel('payments');
});
</script>

<template>
  <q-stepper v-model="step" color="primary" flat animated bordered alternative-labels>
    <q-step :name="1" title="Informe a forma de pagamento" icon="attach_money" :done="step > 1">
      <div class="row items-center q-gutter-sm">
        <q-separator class="col" />
        <span class="text-h5 text-bold text-weight-light" style="color: #0d47a1">
          Selecione a forma do pagamento
        </span>
        <q-separator class="col" />
      </div>
      <q-stepper-navigation align="right">
        <div class="row justify-center items-center q-gutter-x-sm">
          <q-btn
            label="Cartão de crédito"
            color="primary"
            unelevated
            no-caps
            icon="credit_card"
            @click="changeType('credit')"
          />
          <q-btn
            label="Gerar QR Code PIX"
            color="teal-6"
            unelevated
            no-caps
            icon="qr_code_2"
            @click="changeType('pix')"
          />
        </div>
      </q-stepper-navigation>
    </q-step>
    <q-step :name="2" :title="stepTitle" icon="attach_money" :done="step > 2">
      <div v-show="loadingSubscription" class="flex justify-center q-pa-xl q-ma-xl">
        <Loading :show="loadingSubscription" />
      </div>
      <div v-show="!loadingSubscription">
        <div v-if="type === 'credit'">
          <FormCreditCard v-model="dataPaymentCreditCard" />
        </div>
        <div v-else>
          <QrCodePix :subscriptionID="props.subscriptionID" />
        </div>
      </div>
      <q-stepper-navigation align="right">
        <q-btn
          label="Fechar"
          @click="emit('update:open')"
          :loading="loadingSubscription"
          class="q-mr-sm"
          color="red"
          flat
          no-caps
        />
        <q-btn
          label="Voltar"
          @click="back"
          :loading="loadingSubscription"
          class="q-mr-sm"
          color="primary"
          outline
          no-caps
        />
        <q-btn
          v-if="type === 'credit'"
          label="Efetuar pagamento"
          color="green-7"
          @click="checkType"
          :loading="loadingSubscription"
          unelevated
          no-caps
        />
      </q-stepper-navigation>
    </q-step>
    <q-step :name="3" title="Pagamento aprovado" icon="attach_money" :done="step > 3">
      <div class="flex justify-center">
        <q-img src="/icons/payment-maid.png" style="height: 300px; width: 300px" />
      </div>
      <div class="flex justify-center">
        <span class="text-weight-bolder text-primary text-h4"
          >Parabéns! Assinatura Confirmada!</span
        >
        <span class="text-weight-bolder text-blue-10 text-subtitle2 text-center"
          >Que ótima notícia! Seu pagamento foi processado com sucesso e sua assinatura está ativa
          agora mesmo!</span
        >
      </div>
      <q-stepper-navigation align="right">
        <q-btn
          label="Fechar"
          @click="emit('update:open')"
          class="q-mr-sm"
          color="red"
          flat
          no-caps
        />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>
