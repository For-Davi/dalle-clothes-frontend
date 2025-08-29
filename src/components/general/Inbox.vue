<script setup lang="ts">
import { computed, watch, reactive, ref } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import Empty from '../info/Empty.vue';
import { useRoute } from 'vue-router';
import { useNotificationStore } from 'src/stores/notification-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import NotificationDetails from '../details/NotificationDetails.vue';

defineOptions({
  name: 'Inbox',
});

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ 'update:open': [void] }>();

const notificationMonitoring = ref<number | null>(null);
const route = useRoute();
const { loadingNotification, listNotification } = storeToRefs(useNotificationStore());

const showNotificationDetails = reactive<{
  open: boolean;
  notification: INotification | null;
}>({
  open: false,
  notification: null,
});

const clear = () => {
  notificationMonitoring.value = null;
};
const excludeNotification = async (id: number) => {
  notificationMonitoring.value = id;
  await useNotificationStore().deleteNotification(notificationMonitoring.value ?? 0);
  clear();
};
function timeAgo(createdAt: string | Date): string {
  const now = new Date();
  const created = new Date(createdAt);

  const diffMs = now.getTime() - created.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'agora';
  } else if (diffMinutes < 60) {
    return `há ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  } else {
    return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  }
}
const changeShowNotificationDetails = (
  show: boolean,
  notification: INotification | null = null,
): void => {
  Object.assign(showNotificationDetails, {
    open: show,
    notification: notification,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(
  () => route.fullPath,
  () => {
    void useNotificationStore().getNotifications();
  },
  { immediate: true },
);
</script>

<template>
  <q-drawer
    v-model="open"
    show-if-above
    side="right"
    class="bg-grey-2"
    overlay
    :width="300"
    bordered
  >
    <div class="q-ma-sm">
      <TitlePage title="Notificações" icon="notifications" />
    </div>

    <div v-show="!loadingNotification">
      <div v-show="listNotification.length > 0">
        <q-list>
          <q-item
            v-for="notification in listNotification"
            :key="notification.id"
            class="cursor-pointer hover"
            :class="{ 'text-bold bg-grey-4': notification.read === 0 }"
            dense
            @click="changeShowNotificationDetails(true, notification)"
          >
            <q-item-section
              clickable
              v-ripple
              @click="changeShowNotificationDetails(true, notification)"
            >
              <q-item-label>{{ notification.title }}</q-item-label>
              <q-item-label caption>{{ timeAgo(notification.created_at) }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label>
                <q-btn
                  :loading="loadingNotification"
                  @click="excludeNotification(notification.id)"
                  flat
                  round
                  icon="delete"
                  color="red"
                  size="sm"
                />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset />
        </q-list>
        <Loading :show="loadingNotification" />
      </div>
      <div class="q-mt-lg">
        <Empty
          v-show="listNotification.length <= 0 && !loadingNotification"
          message="Você não possui notificações"
          color="bg-red-3"
          type-img="inbox"
        />
      </div>
    </div>
    <div class="q-mini-drawer-hide absolute" style="top: 15px; left: -12px">
      <q-btn
        dense
        round
        unelevated
        color="grey-9"
        icon="chevron_right"
        size="sm"
        @click="open = false"
      />
    </div>
  </q-drawer>
  <!-- Modals -->
  <NotificationDetails
    :data="showNotificationDetails"
    @update:open="changeShowNotificationDetails(false)"
  />
</template>
