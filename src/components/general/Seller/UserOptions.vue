<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import FormProfile from 'src/components/form/Seller/FormProfile.vue';

defineOptions({
  name: 'UserOptions',
});

const showFormProfile = ref<boolean>(false);

// const emit = defineEmits<{
//   'update:openFormPerfil': [void];
//   'update:openFormEnterprise': [void];
// }>();

const { seller } = storeToRefs(useSellerStore());

const router = useRouter();
const dropdown = ref<{ hide: () => void } | null>(null);

const openPerfil = () => {
  dropdown.value?.hide();
  changeShowFormProfile();
};
const changeShowFormProfile = () => {
  showFormProfile.value = !showFormProfile.value;
};

const logout = async () => {
  useSellerStore().setToken(null);
  useSellerStore().setSeller(null);
  await router.push({ name: 'home' });
};
</script>

<template>
  <q-btn-dropdown rounded flat class="q-pa-none q-px-md q-mr-sm" ref="dropdown">
    <template v-slot:label>
      <div class="row items-center no-wrap q-pa-none">
        <q-avatar class="q-ml-sm">
          <img size="sm" :src="'/images/user.png'" />
        </q-avatar>
        <span class="q-ml-sm">
          {{ seller?.name }}
        </span>
      </div>
    </template>
    <q-list>
      <q-item clickable v-ripple @click="openPerfil">
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="account_circle" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Perfil</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="logout">
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="logout" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Sair</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <!-- Modals -->
  <FormProfile :open="showFormProfile" @update:open="changeShowFormProfile" />
</template>
