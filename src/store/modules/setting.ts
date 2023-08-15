import { defineStore } from 'pinia'
import type { SettingState } from './types/type.ts'
const useLayoutSettingStore = defineStore('SettingStore', {
  state: (): SettingState => {
    return {
      expand: false,
      refreshKey: 1
    }
  }
})
export default useLayoutSettingStore
