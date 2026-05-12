<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from 'src/components/general/Seller/Navbar.vue';
import ContactHelper from 'src/components/info/ContactHelper.vue';

const route = useRoute();

const showInbox = ref<boolean>(false);
const showContactHelper = ref<boolean>(false);
const miniState = ref<boolean>(false);
const drawer = ref<boolean>(false);

const isActive = (routeName: string) => route.name === routeName;
const changeShowInbox = () => {
  showInbox.value = !showInbox.value;
};
const changeShowContactHelper = () => {
  showContactHelper.value = !showContactHelper.value;
};
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
              clickable
              v-ripple
              class="text-white"
              :to="{ name: 'dashboard-seller' }"
              :active="isActive('dashboard-seller')"
              active-class="text-bold"
            >
              <q-item-section avatar>
                <q-icon name="equalizer" />
              </q-item-section>

              <q-item-section>
                <span> Dashboard </span>
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
      <!-- Notification -->
      <ContactHelper :open="showContactHelper" @update:open="changeShowContactHelper" />
    </q-layout>
  </div>
</template>
