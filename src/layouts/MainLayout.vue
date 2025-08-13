<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from 'src/components/general/Navbar.vue';
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';

const route = useRoute();

const { appearanceSetting } = storeToRefs(useSettingsStore());

const miniState = ref<boolean>(false);
const drawer = ref<boolean>(false);

const isActive = (routeName: string) => {
  return route.name === routeName;
};

const getColorIconNotSelectedSideMenu = computed(() => {
  return appearanceSetting.value.side_menu_color_default_not_selected_icon === 0 &&
    appearanceSetting.value.side_menu_color_code_not_selected_icon
    ? appearanceSetting.value.side_menu_color_code_not_selected_icon
    : undefined;
});
const getColorIconSelectedSideMenu = computed(() => {
  return appearanceSetting.value.side_menu_color_default_selected_icon === 0 &&
    appearanceSetting.value.side_menu_color_code_selected_icon
    ? appearanceSetting.value.side_menu_color_code_selected_icon
    : '#212121';
});
const getBackgroundNotSelectedSideMenu = computed(() => {
  return appearanceSetting.value.side_menu_color_default_not_selected_item === 0 &&
    appearanceSetting.value.side_menu_color_code_not_selected_item
    ? appearanceSetting.value.side_menu_color_code_not_selected_item
    : undefined;
});
const getBackgroundSelectedSideMenu = computed(() => {
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
        <Navbar />
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
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'dashboard' }"
              :active="isActive('dashboard')"
              active-class="text-bold"
              :style="
                isActive('dashboard')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="equalizer"
                  :style="{
                    color: isActive('dashboard')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>

              <q-item-section>
                <span
                  :style="{
                    color: isActive('dashboard')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Dashboard
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'payment' }"
              :active="isActive('payment')"
              active-class="text-bold"
              :style="
                isActive('payment')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="point_of_sale"
                  :style="{
                    color: isActive('payment')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('payment')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Caixa
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'delivery' }"
              :active="isActive('delivery')"
              active-class="text-bold"
              :style="
                isActive('delivery')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="local_shipping"
                  :style="{
                    color: isActive('delivery')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('delivery')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Entregas
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'fidelity' }"
              :active="isActive('fidelity')"
              active-class="text-bold"
              :style="
                isActive('fidelity')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="favorite"
                  :style="{
                    color: isActive('fidelity')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('fidelity')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Fidelidade
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'client' }"
              :active="isActive('client')"
              active-class="text-bold"
              :style="
                isActive('client')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="groups"
                  :style="{
                    color: isActive('client')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('client')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Clientes
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'store' }"
              :active="isActive('store')"
              active-class="text-bold"
              :style="
                isActive('store')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="storefront"
                  :style="{
                    color: isActive('store')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('store')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Loja
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'coupon' }"
              :active="isActive('coupon')"
              active-class="text-bold"
              :style="
                isActive('coupon')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="sell"
                  :style="{
                    color: isActive('coupon')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('coupon')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Cupons
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'stock' }"
              :active="isActive('stock')"
              active-class="text-bold"
              :style="
                isActive('stock')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="inventory"
                  :style="{
                    color: isActive('stock')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('stock')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Estoque
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'sale' }"
              :active="isActive('sale')"
              active-class="text-bold"
              :style="
                isActive('sale')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="paid"
                  :style="{
                    color: isActive('sale')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('sale')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Vendas
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'earnings' }"
              :active="isActive('earnings')"
              active-class="text-bold"
              :style="
                isActive('earnings')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="savings"
                  :style="{
                    color: isActive('earnings')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('earnings')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Ganhos
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'user' }"
              :active="isActive('user')"
              active-class="text-bold"
              :style="
                isActive('user')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="person"
                  :style="{
                    color: isActive('user')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('user')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Usuários
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'employee' }"
              :active="isActive('employee')"
              active-class="text-bold"
              :style="
                isActive('employee')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="badge"
                  :style="{
                    color: isActive('employee')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('employee')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Funcionários
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'transaction' }"
              :active="isActive('transaction')"
              active-class="text-bold"
              :style="
                isActive('transaction')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="sync_alt"
                  :style="{
                    color: isActive('transaction')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('transaction')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Transações
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'receipt' }"
              :active="isActive('receipt')"
              active-class="text-bold"
              :style="
                isActive('receipt')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="account_balance"
                  :style="{
                    color: isActive('receipt')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('receipt')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Recebimentos
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'supplier' }"
              :active="isActive('supplier')"
              active-class="text-bold"
              :style="
                isActive('supplier')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="list_alt"
                  :style="{
                    color: isActive('supplier')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('supplier')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Fornecedores
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'diary' }"
              :active="isActive('diary')"
              active-class="text-bold"
              :style="
                isActive('diary')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="calendar_month"
                  :style="{
                    color: isActive('diary')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('diary')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Agenda
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'setting' }"
              :active="isActive('setting')"
              active-class="text-bold"
              :style="
                isActive('setting')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="settings"
                  :style="{
                    color: isActive('setting')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('setting')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Configurações
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'subscription' }"
              :active="isActive('subscription')"
              active-class="text-bold"
              :style="
                isActive('subscription')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="credit_card"
                  :style="{
                    color: isActive('subscription')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('subscription')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Assinatura
                </span>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'help' }"
              :active="isActive('help')"
              active-class="text-bold"
              :style="
                isActive('help')
                  ? getBackgroundSelectedSideMenu
                    ? { backgroundColor: getBackgroundSelectedSideMenu }
                    : undefined
                  : getBackgroundNotSelectedSideMenu
                    ? { backgroundColor: getBackgroundNotSelectedSideMenu }
                    : undefined
              "
            >
              <q-item-section avatar>
                <q-icon
                  name="help"
                  :style="{
                    color: isActive('help')
                      ? getColorIconSelectedSideMenu || ''
                      : getColorIconNotSelectedSideMenu || '',
                  }"
                />
              </q-item-section>
              <q-item-section>
                <span
                  :style="{
                    color: isActive('help')
                      ? getColorIconSelectedSideMenu || undefined
                      : getColorIconNotSelectedSideMenu || undefined,
                  }"
                >
                  Ajuda
                </span>
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
    </q-layout>
  </div>
</template>
