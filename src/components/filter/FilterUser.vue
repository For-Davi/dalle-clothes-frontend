<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useUserStore } from 'src/stores/user-store';
import { useRoleStore } from 'src/stores/role-store';
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import DepartmentChoose from '../shared/DepartmentChoose.vue';

defineOptions({
  name: 'FilterUser',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterUser;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterUser];
}>();

const { loadingUser } = storeToRefs(useUserStore());
const { loadingDepartment, listDepartment } = storeToRefs(useDepartmentStore());
const { loadingRole, listRoleSelect } = storeToRefs(useRoleStore());

const loading = ref<boolean>(false);
const showDepartmentChoose = ref<boolean>(false);
const dataUser = reactive({
  name: '' as string,
  email: '' as string,
});
const selectedDepartment = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedRole = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedStatus = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const dataDepartment = reactive({
  id: null as number | null,
  name: 'Todos' as string,
});

const open = computed({
  get: () => props.open,
  set: (state: IFilterUser | 'close') => emit('update:open', state),
});

const clear = (): void => {
  Object.assign(dataUser, {
    name: '',
    email: '',
  });
  Object.assign(dataDepartment, {
    id: null,
    name: 'Todos',
  });

  selectedDepartment.value = {
    label: 'Todos',
    value: null,
  };
  selectedRole.value = {
    label: 'Todos',
    value: null,
  };
  selectedStatus.value = {
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
const fetchRoles = async () => {
  await useRoleStore().getRolesSelect();
  const selectedItem = listRoleSelect.value.find((item) => item.name.toLowerCase() === 'master');
  selectedRole.value = {
    label: selectedItem?.name ?? 'Todos',
    value: selectedItem?.id ?? null,
  };
};
const fetchDepartments = async () => {
  await useDepartmentStore().getDepartments();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const mountFilter = () => {
  Object.assign(dataUser, {
    name: props.filters.name,
    email: props.filters.email,
  });

  const selectedRoleItem = listRoleSelect.value.find((item) => item.id === props.filters.role);
  selectedRole.value = selectedRoleItem
    ? { label: selectedRoleItem?.name, value: selectedRoleItem?.id }
    : { label: 'Todos', value: null };

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

  selectedDepartment.value = selectedDepartmentItem
    ? { label: selectedDepartmentItem?.name, value: selectedDepartmentItem?.id }
    : { label: 'Todos', value: null };
};
const search = () => {
  const data = {
    name: dataUser.name,
    email: dataUser.email,
    role: selectedRole.value.value,
    department: selectedDepartment.value.value,
    active: selectedStatus.value.value,
  };

  emit('update:open', data);
};

const optionsRoles = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listRoleSelect.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
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
  return loading.value || loadingDepartment.value || loadingUser.value || loadingRole.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchRoles();
    await fetchDepartments();
    mountFilter();
    changeLoading();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de usuários" icon="person" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataUser.name"
            bg-color="white"
            label-color="black"
            filled
            label="Filtre por nome"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataUser.email"
            bg-color="white"
            label-color="black"
            filled
            label="Filtre por e-mail"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            filled
            v-model="selectedRole"
            label="Filtre por permissão"
            :options="optionsRoles"
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
            filled
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
          <DepartmentChoose
            :open="showDepartmentChoose"
            @update:open="changeViewDepartmentChoose"
            @update:choose-department="handleChooseDepartment"
          />
          <q-select
            filled
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
              <q-icon name="check" color="black" size="20px" />
            </template>
          </q-select>
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
