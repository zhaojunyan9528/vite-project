import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr.ts'
import type { CategoryResponseData } from '@/api/product/type.ts'
import type { CategoryState } from './types/type.ts'
const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: ''
    }
  },
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      this.c1Arr = result.data
    },
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id)
      this.c2Arr = result.data
    },
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id)
      this.c3Arr = result.data
    }
  }
})
export default useCategoryStore
