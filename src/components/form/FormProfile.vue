<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ProfileData from '../fragments/profile/ProfileData.vue';
import ProfilePassword from '../fragments/profile/ProfilePassword.vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'FormProfile',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const type = ref<'data' | 'password'>('data');

const changeMode = (mode: 'data' | 'password'): void => {
  type.value = mode;
};
const clear = (): void => {
  type.value = 'data';
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card style="min-height: 200px; max-width: 500px" class="bg-grey-2 form-basic column">
      <q-card-section class="q-pa-none q-mb-sm">
        <TitlePage title="Dados do perfil" icon="person" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <ProfileData
          v-if="type === 'data'"
          @updateMode="changeMode"
          @update:open="open = false"
          :type="type"
        />
        <ProfilePassword v-else @updateMode="changeMode" @update:open="open = false" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
