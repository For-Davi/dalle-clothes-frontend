import { onMounted, onUnmounted } from 'vue';
import echo from 'src/plugins/echo';

export function usePaymentChannel(onSuccess: () => Promise<void> | void) {
  onMounted(() => {
    echo.channel('payments').listen('.payment.success', () => {
      void onSuccess();
    });
  });

  onUnmounted(() => {
    echo.leaveChannel('payments');
  });
}
