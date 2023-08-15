import useUserStore from '@/store/modules/user.ts'
/** 获取授权信息 */
export function getAuth() {
  /** 全局路由触发这个方法  如果有缓存暂时在这里交与 */
  const userStore = useUserStore()
  if (userStore.token) {
    return true
  }
  return false
}
export function getUserName() {
  const userStore = useUserStore()
  return userStore.username
}
