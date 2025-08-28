<script setup lang="ts">
import { ref, computed } from 'vue';
import UserOptions from './UserOptions.vue';
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';
import FormFeedback from '../form/FormFeedback.vue';
import { useNotificationStore } from 'src/stores/notification-store';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:openFormEnterprise': [void];
  'update:openEmailInfo': [void];
  'update:changeOpenMenu': [void];
  'update:openInbox': [void];
}>();

const { appearanceSetting } = storeToRefs(useSettingsStore());
const { listNotification } = storeToRefs(useNotificationStore())

const showFormFedback = ref<boolean>(false);

const changeOpenFormFeedback = (): void => {
  showFormFedback.value = !showFormFedback.value;
};
const startOpenInbox = (): void => {
  emit('update:openInbox')
};

const getBackgroundNavbar = computed(() => {
  return appearanceSetting.value.navbar_color_default === 0 &&
    appearanceSetting.value.navbar_color_code
    ? appearanceSetting.value.navbar_color_code
    : undefined;
});
const getColorIconNavbar = computed(() => {
  return appearanceSetting.value.navbar_icon_color_default === 0 &&
    appearanceSetting.value.navbar_icon_color_code
    ? appearanceSetting.value.navbar_icon_color_code
    : undefined;
});
</script>
<template>
  <nav :style="getBackgroundNavbar ? { backgroundColor: getBackgroundNavbar } : undefined">
    <q-toolbar class="row items-center justify-between">
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          :style="getColorIconNavbar ? { color: getColorIconNavbar } : undefined"
          @click="emit('update:changeOpenMenu')"
          flat
          icon-right="menu"
          rounded
        />
      </div>
      <div class="row justify-end">
        <div v-if="!$q.screen.lt.md">
          <q-btn
            @click="emit('update:openEmailInfo')"
            flat
            icon-right="fa-solid fa-headset"
            rounded
            :style="getColorIconNavbar ? { color: getColorIconNavbar } : undefined"
          >
            <q-tooltip> Entrar em contato </q-tooltip>
          </q-btn>
          <q-btn
            @click="changeOpenFormFeedback"
            :style="getColorIconNavbar ? { color: getColorIconNavbar } : undefined"
            flat
            icon-right="chat"
            rounded
          >
            <q-tooltip> Enviar sugestão </q-tooltip>
          </q-btn>
          <q-btn
            @click="startOpenInbox"
            flat
            icon-right="notifications"
            rounded
            class="q-mr-md"
            :style="getColorIconNavbar ? { color: getColorIconNavbar } : undefined"
          >
            <q-tooltip> Notificações </q-tooltip>
            <q-badge color="black" rounded floating :label="listNotification.length" /> 
          </q-btn>
        </div>
        <div v-else>
          <q-btn-dropdown
            round
            flat
            class="q-pa-none q-px-md q-mr-sm text-black"
            ref="dropdown"
            dropdown-icon="info"
            :style="getColorIconNavbar ? { color: getColorIconNavbar } : undefined"
          >
            <q-list>
              <q-item clickable v-ripple @click="emit('update:openEmailInfo')">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="chat" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Entrar em contato</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="changeOpenFormFeedback">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="fa-solid fa-headset" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Enviar sugestão ou dúvida</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="startOpenInbox">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="notifications" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Notificações</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <UserOptions
          @update:open-form-perfil="emit('update:openFormPerfil')"
          @update:open-form-enterprise="emit('update:openFormEnterprise')"
        />
      </div>
    </q-toolbar>
  </nav>
  <!-- Modals -->
  <FormFeedback :open="showFormFedback" @update:open="changeOpenFormFeedback" />
</template>
