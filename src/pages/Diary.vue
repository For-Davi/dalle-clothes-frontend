<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
defineOptions({
  name: 'Diary',
});
</script>
<template>
 <main class="q-pa-lg">
    <section>
      <TitlePage title="Agenda" icon="calendar_month"/>
    </section>
  </main>
</template>