import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: 'xzzmedrjsimbhwzucooo',
  wsHost: 'localhost',
  wsPort: 9001,
  forceTLS: false,
  enabledTransports: ['ws'],
});

export default echo;
