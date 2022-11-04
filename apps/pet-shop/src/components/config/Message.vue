<script lang="ts">
import { useMessage } from 'naive-ui';

const Message = () => {
  window['$message'] = useMessage(); // 全局变量定义
  return null;
};

export default Message;
</script>
