export default function useAssets() {
  // 获取静态文件目录
  const getAssetUrl = url => {
    const path = `../assets/${url}`
    const modules = import.meta.globEager('../assets/**/*')
    return modules[path].default
  }

  return { getAssetUrl }
}
