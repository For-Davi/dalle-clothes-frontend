<script setup lang="ts">
import { computed, watch, reactive, ref } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { checkSellerLogin } from 'src/composables/CheckData';
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import { createErrorData } from 'src/composables/CreateNotify';
import Loading from '../shared/Loading.vue';
import { storeToRefs } from 'pinia';
import InformEmail from '../fragments/email/InformEmail.vue';
import { checkDataReset } from 'src/composables/CheckData';
import { createSuccess } from 'src/composables/CreateNotify';

defineOptions({
  name: 'FormSellerLogin',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:changeRender': [IRenderAuth];
}>();

const { loadingSeller } = storeToRefs(useSellerStore());

const showInformEmail = reactive<{
  open: boolean;
  clientEmail: string | null;
}>({
  open: false,
  clientEmail: null,
});
const isPwd = ref<boolean>(true);
const dataSeller = reactive({
  cpf: '' as string,
  password: '' as string,
});
const changeRender = (render: IRenderAuth): void => {
  emit('update:changeRender', render);
};
const login = async () => {
  const check = checkSellerLogin(dataSeller);
  if (check.status) {
    await useSellerStore().doLogin(dataSeller.cpf, dataSeller.password);
  } else {
    createErrorData(check.message || 'Erro ao enviar dados para realizar o login de associado');
  }
};
const sendEmailReset = async (email: string) => {
  const verifyData = checkDataReset({ email });
  if (!verifyData.status) {
    createSuccess(verifyData.message || 'Erro ao mandar e-mail');
  } else {
    const response = await useSellerStore().doReset(email);
    if (response?.status === 200) {
      changeRender('home');
    }
  }
};
const clear = () => {
  Object.assign(dataSeller, {
    cpf: '',
    password: '',
  });
};
const changeShowInformEmail = (show: boolean) => {
  Object.assign(showInformEmail, {
    open: show,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingSeller
          ? 'bg-grey-2 form-basic column justify-between'
          : 'bg-grey-2 column justify-between'
      "
      style="width: 600px; max-width: 95vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Login do associado" icon="handshake" />
      </q-card-section>
      <Loading :show="loadingSeller" v-show="loadingSeller" />
      <q-card-section v-if="!loadingSeller" class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataSeller.cpf"
            bg-color="white"
            label-color="black"
            outlined
            label="CPF do associado"
            dense
            input-class="text-black"
            maxlength="11"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSeller.password"
            bg-color="white"
            label-color="black"
            outlined
            label="Senha do associado"
            dense
            input-class="text-black"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="black" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon
                @click="isPwd = !isPwd"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            :loading="loadingSeller"
            unelevated
            no-caps
          />
          <q-btn
            color="grey"
            label="Esqueceu a senha"
            size="md"
            @click="changeShowInformEmail(true)"
            :loading="loadingSeller"
            unelevated
            no-caps
          />
          <q-btn
            @click="login"
            :loading="loadingSeller"
            color="primary"
            label="Login"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
    <!-- Modals -->
    <InformEmail
      :data="showInformEmail"
      @update:open="changeShowInformEmail(false)"
      @send-email="sendEmailReset"
    />
  </q-dialog>
</template>
