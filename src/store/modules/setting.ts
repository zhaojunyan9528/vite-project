import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      expand: false,
      refreshKey: 1
    }
  }
})
export default useLayoutSettingStore
