<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import FormProfile from '../form/FormProfile.vue';

defineOptions({
  name: 'UserOptions',
});

const showFormProfile = ref<boolean>(false)

// const emit = defineEmits<{
//   'update:openFormPerfil': [void];
//   'update:openFormEnterprise': [void];
// }>();

const { user } = storeToRefs(useAuthStore());

const router = useRouter();
const dropdown = ref<{ hide: () => void } | null>(null);

const openPerfil = () => {
  dropdown.value?.hide();
  changeShowFormProfile()
};

const changeShowFormProfile = () => {
  showFormProfile.value = !showFormProfile.value
}

const logout = async () => {
  useAuthStore().setToken(null);
  useAuthStore().setUser(null);
  await router.push({ name: 'auth' });
};
</script>

<template>
  <q-btn-dropdown
    rounded
    flat
    class="q-pa-none q-px-md q-mr-sm text-white"
    :label="user?.name"
    ref="dropdown"
  >
    <template v-slot:label>
      <div class="row items-center no-wrap q-pa-none">
        <q-avatar class="q-ml-sm">
          <q-img size="sm" src="/images/user.png" />
        </q-avatar>
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

   <FormProfile :open="showFormProfile" @update:open="changeShowFormProfile()"/>
</template>
