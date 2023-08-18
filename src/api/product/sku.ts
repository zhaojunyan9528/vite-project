import request from '@/utils/request'
import type { SkuResponseData } from './type.ts'

enum API {
  SKU_URL = '/admin/product/list/',
  CANCEL_URL = '/admin/product/cancelSale/',
  SALE_URL = '/admin/product/onSale/',
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  DELETE_URL = '/admin/product/deleteSku/'
}

export const reqSkuData = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 下架
export const reqCancelSale = (skuId: number) =>
  request.get<any, SkuResponseData>(API.CANCEL_URL + skuId)

// 上架
export const reqSaleSku = (skuId: number) =>
  request.get<any, SkuResponseData>(API.SALE_URL + skuId)

export const reqSkuInfo = (skuId: number) =>
  request.get<any, any>(API.SKUINFO_URL + skuId)

export const reqDeleteSku = (skuId: number) =>
  request.get<any, any>(API.DELETE_URL + skuId)
