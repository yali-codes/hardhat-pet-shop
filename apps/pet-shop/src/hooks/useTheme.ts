import { reactive } from 'vue';

export default function useTheme() {
  const themeConfig = reactive({
    common: {
      primaryColor: '#1890ff',
      primaryColorHover: '#40a9ff',
      primaryColorPressed: '#096dd9',
      primaryColorSuppl: '#4098FC',
    },
  });

  return { themeConfig };
}
