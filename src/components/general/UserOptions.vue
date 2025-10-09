<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import FormProfile from '../form/FormProfile.vue';
import { useSettingsStore } from 'src/stores/setting-store';
import FormEnterprise from '../form/FormEnterprise.vue';

defineOptions({
  name: 'UserOptions',
});

const showFormProfile = ref<boolean>(false);
const showFormEnterprise = ref<boolean>(false);

// const emit = defineEmits<{
//   'update:openFormPerfil': [void];
//   'update:openFormEnterprise': [void];
// }>();

const { user } = storeToRefs(useAuthStore());
const { appearanceSetting } = storeToRefs(useSettingsStore());

const router = useRouter();
const dropdown = ref<{ hide: () => void } | null>(null);
const localImage = ref<IImage | null>(user.value?.image ?? null);

const openPerfil = () => {
  dropdown.value?.hide();
  changeShowFormProfile();
};
const changeShowFormProfile = () => {
  showFormProfile.value = !showFormProfile.value;
};
const changeShowFormEnterprise = () => {
  dropdown.value?.hide();
  showFormEnterprise.value = !showFormEnterprise.value;
};

const logout = async () => {
  useAuthStore().setToken(null);
  useAuthStore().setUser(null);
  await router.push({ name: 'auth' });
};

const getColorIconNavbar = computed(() => {
  return appearanceSetting.value.navbar_icon_color_default === 0 &&
    appearanceSetting.value.navbar_icon_color_code
    ? appearanceSetting.value.navbar_icon_color_code
    : undefined;
});
const getImageUrl = (file: File | ICustomFile | IImage | null | undefined): string => {
  if (!file) {
    return '/images/user.png';
  }

  if ('url' in file && file.url) {
    return file.url;
  }

  if (file instanceof File) {
    return URL.createObjectURL(file);
  }

  if ('img' in file && file.img) {
    return file.img;
  }

  return '/images/user.png';
};

watch(user, (newUser) => {
  localImage.value = newUser?.image ?? null;
});
</script>

<template>
  <q-btn-dropdown rounded flat class="q-pa-none q-px-md q-mr-sm" ref="dropdown">
    <template v-slot:label>
      <div class="row items-center no-wrap q-pa-none">
        <q-avatar class="q-ml-sm">
          <img size="sm" :src="getImageUrl(localImage)" />
        </q-avatar>
        <span
          class="q-ml-sm"
          :style="getColorIconNavbar ? { color: getColorIconNavbar } : undefined"
        >
          {{ user?.name }}
        </span>
      </div>
    </template>
    <q-list>
      <q-item clickable v-ripple @click="changeShowFormEnterprise">
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="groups" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Organização</q-item-section>
      </q-item>
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

  <FormProfile :open="showFormProfile" @update:open="changeShowFormProfile()" />
  <FormEnterprise :open="showFormEnterprise" @update:open="changeShowFormEnterprise" />
</template>
