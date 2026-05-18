<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useUserStore } from 'src/stores/user-store';
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import DepartmentChoose from '../shared/DepartmentChoose.vue';

defineOptions({
  name: 'FilterEmployee',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterEmployee;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterEmployee];
}>();

const { loadingUser } = storeToRefs(useUserStore());
const { loadingDepartment, listDepartment } = storeToRefs(useDepartmentStore());

const loading = ref<boolean>(false);
const showDepartmentChoose = ref<boolean>(false);
const dataEmployee = reactive({
  name: '' as string,
  email: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
});
const selectedDepartment = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const dataDepartment = reactive({
  id: null as number | null,
  name: 'Todos' as string,
});
const selectedStatus = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedSex = ref<IQuasarSelect<string | null>>({
  label: 'Todos',
  value: null,
});
const selectedLoginAccess = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const clear = (): void => {
  Object.assign(dataEmployee, {
    name: '',
    email: '',
    cpf: '',
    cnpj: '',
  });
  Object.assign(dataDepartment, {
    id: null,
    name: 'Todos',
  });

  selectedDepartment.value = {
    label: 'Todos',
    value: null,
  };
  selectedStatus.value = {
    label: 'Todos',
    value: null,
  };
  selectedSex.value = {
    label: 'Todos',
    value: null,
  };
  selectedLoginAccess.value = {
    label: 'Todos',
    value: null,
  };
};
const changeViewDepartmentChoose = (): void => {
  showDepartmentChoose.value = !showDepartmentChoose.value;
};
const handleChooseDepartment = (tree: { id: number; label: string } | null): void => {
  selectedDepartment.value = {
    label: tree === null ? 'Todos' : tree.label,
    value: tree === null ? null : tree.id,
  };
  dataDepartment.id = tree === null ? null : tree.id;
  dataDepartment.name = tree === null ? 'Todos' : tree.label;
  changeViewDepartmentChoose();
};
const fetchDepartments = async () => {
  await useDepartmentStore().getDepartments();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const mountFilter = () => {
  Object.assign(dataEmployee, {
    name: props.filters.name,
    email: props.filters.email,
    cpf: props.filters.cpf,
    cnpj: props.filters.cnpj,
  });

  const selectedDepartmentItem = listDepartment.value.find(
    (item) => item.id === props.filters.department,
  );
  selectedDepartment.value = selectedDepartmentItem
    ? { label: selectedDepartmentItem?.name, value: selectedDepartmentItem?.id }
    : { label: 'Todos', value: null };

  Object.assign(dataDepartment, {
    id: selectedDepartment.value.value,
    name: selectedDepartment.value.label,
  });

  selectedSex.value =
    props.filters.sex === 'M'
      ? { label: 'Masculino', value: 'M' }
      : props.filters.sex === 'F'
        ? { label: 'Feminino', value: 'F' }
        : { label: 'Todos', value: null };

  selectedStatus.value =
    props.filters.active === 1
      ? { label: 'Apenas ativos', value: 1 }
      : props.filters.active === 0
        ? { label: 'Apenas inativos', value: 0 }
        : { label: 'Todos', value: null };

  selectedLoginAccess.value =
    props.filters.hasLoginAccess === 1
      ? { label: 'Com acesso', value: 1 }
      : props.filters.hasLoginAccess === 0
        ? { label: 'Sem acesso', value: 0 }
        : { label: 'Todos', value: null };
};
const search = () => {
  const data = {
    name: dataEmployee.name,
    email: dataEmployee.email,
    cpf: dataEmployee.cpf,
    cnpj: dataEmployee.cnpj,
    sex: selectedSex.value.value,
    active: selectedStatus.value.value,
    department: selectedDepartment.value.value,
    hasLoginAccess: selectedLoginAccess.value.value,
  };

  emit('update:open', data);
};

const optionsLoginAccess = computed(() => {
  return [
    {
      label: 'Acesso ao sistema',
      value: 1,
    },
    {
      label: 'Sem acesso ao sistema',
      value: 0,
    },
    {
      label: 'Todos',
      value: null,
    },
  ];
});
const optionsSex = computed(() => {
  return [
    {
      label: 'Masculino',
      value: 'M',
    },
    {
      label: 'Feminino',
      value: 'F',
    },
    {
      label: 'Todos',
      value: null,
    },
  ];
});
const optionsStatus = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];
});
const isLoading = computed((): boolean => {
  return loading.value || loadingDepartment.value || loadingUser.value;
});
const open = computed({
  get: () => props.open,
  set: (state: IFilterEmployee | 'close') => emit('update:open', state),
});

watch([() => dataEmployee.cpf, () => dataEmployee.cnpj], ([cpf, cnpj]) => {
  if (cpf != null) {
    dataEmployee.cpf = cpf.replace(/\D/g, '');
  }
  if (cnpj != null) {
    dataEmployee.cnpj = cnpj.replace(/\D/g, '');
  }
});

watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataEmployee.cnpj = '';
    } else {
      dataEmployee.cpf = '';
    }
  },
  { immediate: true },
);
watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchDepartments();
    mountFilter();
    changeLoading();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de funcionários" icon="person" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataEmployee.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por nome"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEmployee.email"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por e-mail"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
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
              v-model="dataEmployee.cnpj"
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
              v-model="dataEmployee.cpf"
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
          <q-select
            outlined
            v-model="selectedStatus"
            label="Filtre por status"
            :options="optionsStatus"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="list" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedSex"
            label="Filtre por sexo"
            :options="optionsSex"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="list" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedLoginAccess"
            label="Filtre por acesso"
            :options="optionsLoginAccess"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="list" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataDepartment.name"
            bg-color="white"
            label-color="black"
            outlined
            type="text"
            label="Filtre por departamento"
            readonly
            clearable
            dense
          >
            <template v-slot:prepend>
              <q-icon name="groups" color="black" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="changeViewDepartmentChoose" />
            </template>
          </q-input>
        </q-form>

        <!-- Modals -->
        <DepartmentChoose
          :open="showDepartmentChoose"
          @update:open="changeViewDepartmentChoose"
          @update:choose-department="handleChooseDepartment"
        />
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
          <q-btn
            v-show="!isLoading"
            @click="clear"
            color="secondary"
            label="Limpar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-show="!isLoading"
            @click="search"
            color="primary"
            label="Filtrar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
