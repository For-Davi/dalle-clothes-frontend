import { onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from 'src/stores/notification-store';
import echo from 'src/plugins/echo';

export function useNotificationChannel(userId: number) {
  onMounted(() => {
    echo.private(`user.${userId}`).listen('.notifications', async () => {
      await useNotificationStore().getNotifications();
    });
  });

  onUnmounted(() => {
    echo.leaveChannel(`private-user.${userId}`);
  });
}
