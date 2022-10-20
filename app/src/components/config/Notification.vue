<script>
import { useNotification } from 'naive-ui'

const Notification = () => {
  window['$notification'] = useNotification() // 全局变量定义
  return null
}

export default Notification
</script>
