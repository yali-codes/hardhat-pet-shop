<script lang="ts">
import { useLoadingBar } from 'naive-ui';

const Loadingbar = () => {
  window['$loadingbar'] = useLoadingBar(); // 全局变量定义
  return null;
};

export default Loadingbar;
</script>
