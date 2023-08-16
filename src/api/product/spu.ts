import request from '@/utils/request'
import type { SpuResponseData, SaleAttrResponseData } from './type.ts'

enum API {
  HASSPU_URL = '/admin/product/',
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/'
}

export const reqHasSpu = (
  pageNo: number,
  pageSize: number,
  category3Id: number | string
) =>
  request.get<any, SpuResponseData>(
    API.HASSPU_URL + `${pageNo}/${pageSize}?category3Id=${category3Id}`
  )

export const reqAllTradeMark = () => request.get<any, any>(API.ALLTRADEMARK_URL)

export const reqAllSaleAttr = () =>
  request.get<any, SaleAttrResponseData>(API.ALLSALEATTR_URL)
