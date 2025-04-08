<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from 'src/components/general/Navbar.vue';

const route = useRoute();
const miniState = ref<boolean>(false);
const drawer = ref<boolean>(false);

function isActive(routeName: string) {
  return  route.name === routeName 
}
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
              active-class="bg-white text-blue-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="equalizer" />
              </q-item-section>

              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple 
              class="text-white"
              :to="{ name: 'payment' }" 
              :active="isActive('payment')"
              active-class="bg-white text-blue-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="point_of_sale" />
              </q-item-section>

              <q-item-section>
                Caixa
              </q-item-section>
            </q-item>


            <q-item 
              clickable 
              v-ripple 
              class="text-white"
              :to="{ name: 'delivery' }" 
              :active="isActive('delivery')"
              active-class="bg-white text-blue-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="local_shipping" />
              </q-item-section>

              <q-item-section>
                Entregas
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'fidelity' }"  
              :active="isActive('fidelity')"
              active-class="bg-white text-blue-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="favorite" />
              </q-item-section>

              <q-item-section>
                Fidelidade
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'client' }"  
              :active="isActive('client')"
              active-class="bg-white text-blue-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="groups" />
              </q-item-section>

              <q-item-section>
                Clientes
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white"  
              :to="{ name: 'product' }" 
              :active="isActive('product')"
              active-class="bg-white text-blue-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="inventory_2" />
              </q-item-section>

              <q-item-section>
                Produtos
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white"   
              :to="{ name: 'coupon' }" 
              :active="isActive('coupon')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="sell" />
              </q-item-section>

              <q-item-section>
                Cupons
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'stock' }" 
              :active="isActive('stock')"
              active-class="bg-white text-blue-10 text-bold"  
            >
              <q-item-section avatar>
                <q-icon name="inventory"/>
              </q-item-section>

              <q-item-section>
                Estoque
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'sale' }" 
              :active="isActive('sale')"
              active-class="bg-white text-blue-10 text-bold"  
            >
              <q-item-section avatar>
                <q-icon name="paid"/>
              </q-item-section>

              <q-item-section>
                Vendas
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'earnings' }" 
              :active="isActive('earnings')"
              active-class="bg-white text-blue-10 text-bold"  
            >
              <q-item-section avatar>
                <q-icon name="savings"/>
              </q-item-section>

              <q-item-section>
                Ganhos
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'user' }" 
              :active="isActive('user')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section>
                Usuários
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'employee' }" 
              :active="isActive('employee')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="badge" />
              </q-item-section>

              <q-item-section>
                Funcionários
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'delivery-man' }" 
              :active="isActive('delivery-man')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="rocket_launch" />
              </q-item-section>

              <q-item-section>
                Entregadores
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'transaction' }" 
              :active="isActive('transaction')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="sync_alt" />
              </q-item-section>

              <q-item-section>
                Transações
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'account' }" 
              :active="isActive('account')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="account_balance" />
              </q-item-section>

              <q-item-section>
                Contas
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'supplier' }" 
              :active="isActive('supplier')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>

              <q-item-section>
                Fornecedores
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'diary' }" 
              :active="isActive('diary')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="calendar_month" />
              </q-item-section>

              <q-item-section>
                Agenda
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'setting' }" 
              :active="isActive('setting')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section>
                Configurações
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'help' }" 
              :active="isActive('help')"
              active-class="bg-white text-blue-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>

              <q-item-section>
                Ajuda
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
          <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>


