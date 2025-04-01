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
      <q-header class="bg-deep-orange-10">
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
              active-class="bg-white text-deep-orange-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="space_dashboard" />
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
              active-class="bg-white text-deep-orange-10 text-bold"
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
              :to="{ name: 'command-order' }" 
              :active="isActive('command-order')"
              active-class="bg-white text-deep-orange-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="receipt_long" />
              </q-item-section>

              <q-item-section>
                Comandas
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple 
              class="text-white"
              :to="{ name: 'order' }" 
              :active="isActive('order')"
              active-class="bg-white text-deep-orange-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="room_service" />
              </q-item-section>

              <q-item-section>
                Pedidos
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'launch' }"  
              :active="isActive('launch')"
              active-class="bg-white text-deep-orange-10 text-bold"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>

              <q-item-section>
                Lançamentos
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'fidelity' }"  
              :active="isActive('fidelity')"
              active-class="bg-white text-deep-orange-10 text-bold"
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
              :to="{ name: 'product' }" 
              :active="isActive('product')"
              active-class="bg-white text-deep-orange-10 text-bold"
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
              :to="{ name: 'category' }" 
              :active="isActive('category')"
              active-class="bg-white text-deep-orange-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>

              <q-item-section>
                Categorias
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white"   
              :to="{ name: 'coupon' }" 
              :active="isActive('coupon')"
              active-class="bg-white text-deep-orange-10 text-bold" 
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
              :to="{ name: 'offer' }" 
              :active="isActive('offer')"
              active-class="bg-white text-deep-orange-10 text-bold"  
            >
              <q-item-section avatar>
                <q-icon name="percent" />
              </q-item-section>

              <q-item-section>
                Ofertas
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'workspace' }" 
              :active="isActive('workspace')"
              active-class="bg-white text-deep-orange-10 text-bold"  
            >
              <q-item-section avatar>
                <q-icon name="work" />
              </q-item-section>

              <q-item-section>
                Ambientes
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'stock' }" 
              :active="isActive('stock')"
              active-class="bg-white text-deep-orange-10 text-bold"  
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
              :to="{ name: 'user' }" 
              :active="isActive('user')"
              active-class="bg-white text-deep-orange-10 text-bold" 
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
              :to="{ name: 'motorcyclist' }" 
              :active="isActive('motorcyclist')"
              active-class="bg-white text-deep-orange-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="sports_motorsports" />
              </q-item-section>

              <q-item-section>
                Motociclistas
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'department' }" 
              :active="isActive('department')"
              active-class="bg-white text-deep-orange-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="group" />
              </q-item-section>

              <q-item-section>
                Departamentos
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'movement' }" 
              :active="isActive('movement')"
              active-class="bg-white text-deep-orange-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="sync_alt" />
              </q-item-section>

              <q-item-section>
                Movimentações
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'schedule' }" 
              :active="isActive('schedule')"
              active-class="bg-white text-deep-orange-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="history" />
              </q-item-section>

              <q-item-section>
                Agendamentos
              </q-item-section>
            </q-item>

            <q-item 
              clickable 
              v-ripple
              class="text-white" 
              :to="{ name: 'account' }" 
              :active="isActive('account')"
              active-class="bg-white text-deep-orange-10 text-bold" 
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
              active-class="bg-white text-deep-orange-10 text-bold" 
            >
              <q-item-section avatar>
                <q-icon name="local_shipping" />
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
              active-class="bg-white text-deep-orange-10 text-bold" 
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
              active-class="bg-white text-deep-orange-10 text-bold" 
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
              active-class="bg-white text-deep-orange-10 text-bold" 
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


