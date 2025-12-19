<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';

defineOptions({
  name: 'FilterClient',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterClient;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterClient];
}>();

const dataClient = reactive({
  name: '' as string,
  email: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
  country: '' as string,
  state: '' as string,
  city: '' as string,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const open = computed({
  get: () => props.open,
  set: (state: IFilterClient | 'close') => emit('update:open', state),
});

const clear = (): void => {
  Object.assign(dataClient, {
    name: '',
    email: '',
    cpf: '',
    cnpj: '',
    country: '',
    state: '',
    city: '',
  });
};
const mountFilter = () => {
  Object.assign(dataClient, {
    name: props.filters.name,
    email: props.filters.email,
    cpf: props.filters.cpf,
    cnpj: props.filters.cnpj,
    country: props.filters.country,
    state: props.filters.state,
    city: props.filters.city,
  });
};
const search = () => {
  const data = {
    name: dataClient.name,
    email: dataClient.email,
    cpf: dataClient.cpf,
    cnpj: dataClient.cnpj,
    country: dataClient.country,
    state: dataClient.state,
    city: dataClient.city,
  };

  emit('update:open', data);
};

watch(
  () => dataClient.country,
  (country: string) => {
    if (country.trim().length > 0) {
      dataClient.country = dataClient.country.replace(/\d+/g, '');
    }
  },
);
watch([() => dataClient.cpf, () => dataClient.cnpj], ([cpf, cnpj]) => {
  dataClient.cpf = cpf.replace(/\D/g, '');
  dataClient.cnpj = cnpj.replace(/\D/g, '');
});
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataClient.cnpj = '';
    } else {
      dataClient.cpf = '';
    }
  },
  { immediate: true },
);
watch(open, () => {
  if (open.value) {
    clear();
    mountFilter();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de clientes" icon="person" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataClient.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por nome"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataClient.email"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por e-mail"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-select
              v-model="selectedIdentifier"
              :options="optionsIdentifier"
              label="Selecione o documento"
              outlined
              dense
              options-dense
              bg-color="white"
              label-color="black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="info" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              v-if="selectedIdentifier === 'CNPJ'"
              v-model="dataClient.cnpj"
              bg-color="white"
              label-color="black"
              outlined
              label="Filtre por CNPJ"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="14"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-else
              v-model="dataClient.cpf"
              bg-color="white"
              label-color="black"
              outlined
              label="Filtre por CPF"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="11"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataClient.country"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por país"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="south_america" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataClient.state"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por estado"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="map" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataClient.city"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por cidade"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
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
            @click="emit('update:open', 'close')"
            unelevated
            no-caps
          />
          <q-btn @click="clear" color="secondary" label="Limpar" size="md" unelevated no-caps />
          <q-btn @click="search" color="primary" label="Filtrar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
