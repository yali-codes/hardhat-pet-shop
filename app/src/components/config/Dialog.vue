<script>
import { useDialog } from 'naive-ui'

const Dialog = () => {
  window['$dialog'] = useDialog() // 全局变量定义
  return null
}

export default Dialog
</script>
