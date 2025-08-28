<script setup lang="ts">
import { computed, watch } from 'vue'
import TitlePage from '../shared/TitlePage.vue';
import Empty from '../info/Empty.vue';
import { useRoute } from 'vue-router'
import { useNotificationStore } from 'src/stores/notification-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'Inbox',
});

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [void] }>()

const route = useRoute()
const { loadingNotification, listNotification } = storeToRefs(useNotificationStore())

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
const handleClickNotification = (notification: INotification) => {
  console.log('Notificação clicada:', notification)
}

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(
  () => route.fullPath,
  () => {
    void useNotificationStore().getNotifications() 
  },
  { immediate: true } 
)
</script>

<template>
  <q-drawer
    v-model="open"
    side="right"
    class="bg-grey-2"
    overlay
    :width="500"
  >
    <div class="q-ma-sm">
      <TitlePage title="Notificações" icon="notifications"/>
    </div>

    <div v-show="!loadingNotification">
      <div v-show="listNotification.length > 0">
        <q-list>
          <q-item 
            v-for="notification in listNotification" 
            :key="notification.id" 
            class="cursor-pointer"
            clickable
            v-ripple
            @click="handleClickNotification(notification)"
          >
            <q-item-section>
              <q-item-label>{{ notification.title }}</q-item-label>
              <q-item-label caption>{{ timeAgo(notification.created_at) }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>
                <q-btn flat round icon="delete" color="red"/>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset/>
        </q-list>
      </div>

      <div class="q-mt-lg">
        <Empty
          v-show="listNotification.length <= 0 && !loadingNotification"
          message="Você não possui notificações"
          color="bg-red-3"
        />
      </div>

      <Loading :show="loadingNotification"/>
    </div>
  </q-drawer>
</template>
