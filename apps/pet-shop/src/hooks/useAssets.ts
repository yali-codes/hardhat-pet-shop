export default function useAssets() {
  // 获取静态文件目录
  const getAssetUrl = (url?: string): string => {
    const modules: any = import.meta.glob('../assets/**/*', { eager: true });
    return modules[`../assets/${url}`].default;
  };

  return { getAssetUrl };
}
