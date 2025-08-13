<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import { useClientStore } from 'src/stores/client-store';
import TableClient from 'src/components/table/TableClient.vue';
import FormClient from 'src/components/form/FormClient.vue';
import FilterClient from 'src/components/filter/FilterClient.vue';

defineOptions({
  name: 'Schedule',
});

const search = ref<string>('');
const filter = reactive<IFilterClient>({
  name: '',
  email: '',
  cnpj: '',
  cpf: '',
  country: '',
  state: '',
  city: '',
});
const showFilterClient = ref<boolean>(false);
const showFormClient = reactive<{
  open: boolean;
  clientId: number | null;
}>({
  open: false,
  clientId: null,
});

const changeShowFilterClient = (): void => {
  showFilterClient.value = !showFilterClient.value;
};
const changeShowFormClient = (show: boolean, clientId: number | null = null): void => {
  showFormClient.clientId = clientId;
  showFormClient.open = show;
};
const startEditClient = (id: number): void => {
  changeShowFormClient(true, id);
};
const actionFilter = async (data: 'close' | IFilterClient): Promise<void> => {
  changeShowFilterClient();

  if (data !== 'close') {
    Object.assign(filter, {
      name: data.name,
      email: data.email,
      cnpj: data.cnpj,
      cpf: data.cpf,
      country: data.country,
      state: data.state,
      city: data.city,
    });
    await useClientStore().getClients(filter);
  }
};

const hasFilter = computed(() => {
  return (
    filter.name !== '' ||
    filter.email != '' ||
    filter.cpf != '' ||
    filter.cnpj != '' ||
    filter.country != '' ||
    filter.state != '' ||
    filter.city != ''
  );
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Usuários" icon="person" />
      <div>
        <q-btn
          @click="changeShowFormClient(true)"
          color="white"
          text-color="black"
          label="Novo cliente"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="search"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn
            @click="changeShowFilterClient"
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableClient :filter="search" @show:show-form-client="startEditClient" />
    </section>
    <FormClient :data="showFormClient" @update:open="changeShowFormClient(false)" />
    <FilterClient :open="showFilterClient" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
