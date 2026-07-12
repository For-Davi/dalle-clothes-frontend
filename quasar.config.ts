import { configure } from 'quasar/wrappers';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const envFile = `.env.${process.env.APP_ENV || 'local'}`;
dotenv.config({ path: envFile });

export default configure((ctx) => {
  return {
    boot: ['i18n', 'axios', 'sellerApi', 'permissions'],
    css: ['app.scss'],
    extras: ['fontawesome-v6', 'roboto-font', 'material-icons'],
    build: {
      env: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
        VUE_ROUTER_MODE: process.env.VUE_ROUTER_MODE,
        VUE_ROUTER_BASE: process.env.VUE_ROUTER_BASE,
        VITE_WHATSAPP_HELPER: process.env.VITE_WHATSAPP_HELPER,
        VITE_EMAIL_HELPER: process.env.VITE_EMAIL_HELPER,
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      typescript: {
        strict: true,
        vueShim: true,
      },
      vueRouterMode: 'history',
      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            ssr: ctx.modeName === 'ssr',
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))],
          },
        ],
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },
    devServer: {
      open: true,
    },
    framework: {
      config: {},
      plugins: ['Notify'],
    },
    animations: 'all',
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false,
    },
    pwa: {
      workboxMode: 'GenerateSW',
    },
    cordova: {},
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'quasar-project',
      },
    },
    bex: {
      extraScripts: [],
    },
  };
});
