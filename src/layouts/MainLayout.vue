<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/setting-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useNotificationChannel } from 'src/channels/NotificationChanel';
import Navbar from 'src/components/general/Navbar.vue';
import Inbox from 'src/components/general/Inbox.vue';
import ContactHelper from 'src/components/info/ContactHelper.vue';

const route = useRoute();
const { appearanceSetting } = storeToRefs(useSettingsStore());
const { user } = storeToRefs(useAuthStore());

useNotificationChannel(user.value?.id ?? 0);

const showInbox = ref(false);
const showContactHelper = ref(false);
const miniState = ref(false);
const drawer = ref(false);

const allMenuItems = [
  { name: 'dashboard', icon: 'equalizer', label: 'Dashboard', permission: 'dashboard.view' },
  { name: 'payment', icon: 'point_of_sale', label: 'Caixa', permission: 'sale.create' },
  { name: 'delivery', icon: 'local_shipping', label: 'Entregas', permission: 'delivery.view' },
  { name: 'client', icon: 'groups', label: 'Clientes', permission: 'client.view' },
  { name: 'stock', icon: 'inventory', label: 'Estoque', permission: 'product.view' },
  { name: 'sale', icon: 'paid', label: 'Vendas', permission: 'sale.view' },
  { name: 'results', icon: 'analytics', label: 'Resultados', permission: 'comission.view' },
  { name: 'user', icon: 'person', label: 'Usuários', permission: 'user.view' },
  { name: 'employee', icon: 'badge', label: 'Funcionários', permission: 'employee.view' },
  { name: 'transaction', icon: 'sync_alt', label: 'Transações', permission: 'transaction.view' },
  { name: 'receipt', icon: 'account_balance', label: 'Recebimentos', permission: 'receipt.view' },
  { name: 'supplier', icon: 'list_alt', label: 'Fornecedores', permission: 'supplier.view' },
  { name: 'setting', icon: 'settings', label: 'Configurações', permission: 'setting.view' },
  { name: 'help', icon: 'help', label: 'Ajuda' }, // Sem permission sempre aparece
];

const filteredMenuItems = computed(() => {
  if (!user.value?.role?.permissions) return [];

  const userSlugs = new Set(user.value.role.permissions.map((p) => p.slug));

  return allMenuItems.filter((item) => {
    if (!item.permission) return true;
    return userSlugs.has(item.permission);
  });
});

const isActive = (routeName: string) => route.name === routeName;

const getItemStyle = (routeName: string) => {
  const bg = isActive(routeName) ? backgroundSelected.value : backgroundNotSelected.value;
  return bg ? { backgroundColor: bg } : undefined;
};

const changeShowInbox = () => {
  showInbox.value = !showInbox.value;
};

const changeShowContactHelper = () => {
  showContactHelper.value = !showContactHelper.value;
};

const getIconColor = (routeName: string) => {
  return isActive(routeName) ? colorIconSelected.value || '' : colorIconNotSelected.value || '';
};

const getLabelColor = (routeName: string) => {
  return isActive(routeName) ? colorIconSelected.value : colorIconNotSelected.value;
};

// Cores Dinâmicas
const colorIconNotSelected = computed(() => {
  return appearanceSetting.value.side_menu_color_default_not_selected_icon === 0 &&
    appearanceSetting.value.side_menu_color_code_not_selected_icon
    ? appearanceSetting.value.side_menu_color_code_not_selected_icon
    : undefined;
});

const colorIconSelected = computed(() => {
  return appearanceSetting.value.side_menu_color_default_selected_icon === 0 &&
    appearanceSetting.value.side_menu_color_code_selected_icon
    ? appearanceSetting.value.side_menu_color_code_selected_icon
    : '#212121';
});

const backgroundNotSelected = computed(() => {
  return appearanceSetting.value.side_menu_color_default_not_selected_item === 0 &&
    appearanceSetting.value.side_menu_color_code_not_selected_item
    ? appearanceSetting.value.side_menu_color_code_not_selected_item
    : undefined;
});

const backgroundSelected = computed(() => {
  return appearanceSetting.value.side_menu_color_default_selected_item === 0 &&
    appearanceSetting.value.side_menu_color_code_selected_item
    ? appearanceSetting.value.side_menu_color_code_selected_item
    : '#ffffff';
});
</script>

<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="height: 100vh">
      <q-header class="bg-blue-10">
        <Navbar
          @update:open-inbox="changeShowInbox"
          @update:open-contact-helper="changeShowContactHelper"
        />
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        @mouseenter="miniState = false"
        @mouseleave="miniState = true"
        mini-to-overlay
        :width="200"
        :breakpoint="500"
        class="bg-grey-10"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
          <q-list>
            <q-item
              v-for="item in filteredMenuItems"
              :key="item.name"
              clickable
              v-ripple
              class="text-white"
              :to="{ name: item.name }"
              :active="isActive(item.name)"
              active-class="text-bold"
              :style="getItemStyle(item.name)"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" :style="{ color: getIconColor(item.name) }" />
              </q-item-section>
              <q-item-section>
                <span :style="{ color: getLabelColor(item.name) }">{{ item.label }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>

      <Inbox :open="showInbox" @update:open="changeShowInbox" />
      <ContactHelper :open="showContactHelper" @update:open="changeShowContactHelper" />
    </q-layout>
  </div>
</template>
