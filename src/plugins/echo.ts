import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from 'src/stores/auth-store';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: 'xzzmedrjsimbhwzucooo',
  wsHost: 'localhost',
  wsPort: 9001,
  forceTLS: false,
  enabledTransports: ['ws'],
  authEndpoint: 'http://localhost/api/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${useAuthStore().token}`,
    },
  },
});

export default echo;
