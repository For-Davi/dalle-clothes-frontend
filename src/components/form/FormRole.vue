<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from '../shared/Loading.vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from 'src/stores/role-store';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'FormRole',
});

const props = defineProps<{
  data: {
    open: boolean;
    roleId: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingRole, listPermission } = storeToRefs(useRoleStore());

const dataRole = reactive({
  name: '' as string,
  description: '' as string,
  selectedPermissions: [] as number[],
});

const permissionGroups = [
  {
    label: 'Dashboard e Assinatura',
    slugPrefixes: ['dashboard.', 'subscription.'],
  },
  {
    label: 'Organização',
    slugPrefixes: ['enterprise.', 'result.'],
  },
  {
    label: 'Vendas',
    slugPrefixes: ['sale.', 'sale-discount.'],
  },
  {
    label: 'Entregas e Entregadores',
    slugPrefixes: ['delivery.', 'delivery-guy.'],
  },
  {
    label: 'Devoluções',
    slugPrefixes: ['return.'],
  },
  {
    label: 'Cores de Produtos',
    slugPrefixes: ['product-color.'],
  },
  {
    label: 'Tags de Produtos',
    slugPrefixes: ['product-tag.'],
  },
  {
    label: 'Categorias de Produtos',
    slugPrefixes: ['product-category.'],
  },
  {
    label: 'Produtos e Grades',
    slugPrefixes: ['product.', 'grid.'],
  },
  {
    label: 'Usuários',
    slugPrefixes: ['user.'],
  },
  {
    label: 'Funcionários',
    slugPrefixes: ['employee.'],
  },
  {
    label: 'Departamentos',
    slugPrefixes: ['department.'],
  },
  {
    label: 'Transações',
    slugPrefixes: ['transaction.', 'transaction-category.'],
  },
  {
    label: 'Recebimentos e Comissões',
    slugPrefixes: ['receipt.', 'commission.'],
  },
  {
    label: 'Clientes',
    slugPrefixes: ['client.'],
  },
  {
    label: 'Fornecedores',
    slugPrefixes: ['supplier.', 'supplier-category.', 'supplier-order.', 'supplier-catalog.'],
  },
  {
    label: 'Configurações e Permissões',
    slugPrefixes: ['config.', 'role.'],
  },
];

const groupedPermissions = computed(() => {
  return permissionGroups
    .map((group) => ({
      label: group.label,
      permissions: listPermission.value.filter((p) =>
        group.slugPrefixes.some((prefix) => p.slug.startsWith(prefix)),
      ),
    }))
    .filter((g) => g.permissions.length > 0);
});

const isGroupAllSelected = (permissions: IPermission[]): boolean => {
  return (
    permissions.length > 0 && permissions.every((p) => dataRole.selectedPermissions.includes(p.id))
  );
};

const isGroupIndeterminate = (permissions: IPermission[]): boolean => {
  const someSelected = permissions.some((p) => dataRole.selectedPermissions.includes(p.id));
  return someSelected && !isGroupAllSelected(permissions);
};

const groupCheckboxValue = (permissions: IPermission[]): boolean | null => {
  if (isGroupAllSelected(permissions)) return true;
  if (isGroupIndeterminate(permissions)) return null;
  return false;
};

const toggleGroup = (permissions: IPermission[]): void => {
  if (isGroupAllSelected(permissions)) {
    permissions.forEach((p) => {
      const idx = dataRole.selectedPermissions.indexOf(p.id);
      if (idx !== -1) dataRole.selectedPermissions.splice(idx, 1);
    });
  } else {
    permissions.forEach((p) => {
      if (!dataRole.selectedPermissions.includes(p.id)) {
        dataRole.selectedPermissions.push(p.id);
      }
    });
  }
};

const clear = (): void => {
  Object.assign(dataRole, {
    name: '',
    description: '',
    selectedPermissions: [],
  });
};

const save = async (): Promise<void> => {
  if (!dataRole.name.trim()) {
    createErrorData('O nome da permissão é obrigatório');
    return;
  }
  const response = await useRoleStore().createRole({
    name: dataRole.name.trim(),
    description: dataRole.description.trim() !== '' ? dataRole.description : null,
    permissions: dataRole.selectedPermissions,
  });

  if (response?.status === 201) {
    clear();
    emit('update:open');
  }
};

const update = async (): Promise<void> => {
  if (!dataRole.name.trim()) {
    createErrorData('O nome da permissão é obrigatório');
    return;
  }
  const response = await useRoleStore().updateRole({
    id: props.data.roleId ?? 0,
    description: dataRole.description.trim() !== '' ? dataRole.description : null,
    name: dataRole.name.trim(),
    permissions: dataRole.selectedPermissions,
  });
  if (response?.status === 200) {
    clear();
    emit('update:open');
  }
};

const checkDataEdit = async (): Promise<void> => {
  if (roleId.value) {
    const response = await useRoleStore().showRole(roleId.value);
    if (response?.status === 200) {
      const role = response.data.role;

      Object.assign(dataRole, {
        name: role.name ?? '',
        description: role.description ?? '',
        selectedPermissions: role.permissions.map((p) => p.id),
      });
    }
  }
};

const roleId = computed(() => props.data.roleId);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  clear();
  if (open.value) {
    if (listPermission.value.length === 0) {
      await useRoleStore().getPermissions();
    }
    await checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="roleId ? 'Editar permissão' : 'Nova permissão'"
          icon="admin_panel_settings"
        />
      </q-card-section>
      <Loading :show="loadingRole" />
      <q-card-section class="q-pa-sm" v-show="!loadingRole">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataRole.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da permissão"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataRole.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição (opcional)"
            dense
            input-class="text-black no-resize"
            type="textarea"
            rows="2"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>

          <div class="text-subtitle2 text-weight-medium q-mt-sm q-mb-xs">Permissões</div>

          <div
            v-for="group in groupedPermissions"
            :key="group.label"
            class="bg-white rounded-borders border-grey-light q-pa-sm q-mb-xs"
          >
            <div class="row items-center justify-between">
              <span class="text-caption text-weight-bold text-uppercase text-grey-7">
                {{ group.label }}
              </span>
              <q-checkbox
                :model-value="groupCheckboxValue(group.permissions)"
                :indeterminate-value="null"
                @update:model-value="toggleGroup(group.permissions)"
                label="Todos"
                dense
                color="primary"
                size="sm"
              />
            </div>
            <q-separator class="q-my-xs" />
            <div class="row q-gutter-x-sm q-gutter-y-xs">
              <q-checkbox
                v-for="permission in group.permissions"
                :key="permission.id"
                v-model="dataRole.selectedPermissions"
                :val="permission.id"
                :label="permission.description"
                dense
                color="primary"
                size="sm"
                class="col-12 col-sm-5"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingRole">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn color="red" label="Fechar" size="md" flat @click="open = false" no-caps />
          <q-btn
            v-if="!roleId"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingRole"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingRole"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
