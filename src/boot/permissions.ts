import { boot } from 'quasar/wrappers';
import { usePermission } from 'src/composables/usePermission';

export default boot(({ app }) => {
  const { hasPermission, can } = usePermission();

  app.config.globalProperties.can = can;
  app.config.globalProperties.hasPermission = hasPermission;
});
