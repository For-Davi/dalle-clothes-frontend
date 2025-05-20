<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useAuthStore());
defineOptions({
  name: 'Dashboard',
});
</script>
<template>
  <main class="q-pa-lg">
    <section>
      <TitlePage title="Dashboard" icon="equalizer" />
      USER :{{ user }}
    </section>
  </main>
</template>
