export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//已有的品牌的ts数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

//包含全部品牌数据的ts类型
export type Records = TradeMark[]

//获取的已有全部品牌的数据ts类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
export interface TradeMarkAllResponseData extends ResponseData {
  data: Records
}

// 属性管理

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

export type AttrValueList = AttrValue[]

export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
//存储每一个属性对象的数组ts类型
export type AttrList = Attr[]

//属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}

// -------------------------------------

// spu管理
export interface SpuImage {
  id?: number
  imgName: string
  imgUrl: string
  spuId?: number
}

export type SpuImageList = SpuImage[]

export interface SpuImageResponseData extends ResponseData {
  data: SpuImageList
}

export interface SpuAttrValue {
  saleAttrName: string
  id: number
  spuId: number
  saleAttrValueName: string
}

type SpuAttrValueList = SpuAttrValue[]

export interface SpuAttr {
  baseSaleAttrId?: number | string
  saleAttrName: string
  id?: number
  spuId?: number
  spuSaleAttrValueList: SpuAttrValueList
}

export type SpuAttrList = SpuAttr[]

export interface SpuRecord {
  category3Id: number | string
  spuName: string
  tmId: number | string
  id?: number
  description: string
  spuImageList: SpuImageList
  spuPosterList?: SpuImageList
  spuSaleAttrList: SpuAttrList
}

export interface SpuResponseData extends ResponseData {
  data: {
    records: SpuRecord[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

export interface SaleAttr {
  id: number
  name: string
}
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

export interface SkuAttr {
  attrId: number
  attrName: string
  valueName?: string
  valueId?: number
}
export interface SkuData {
  category3Id: number | string // 三级分类的ID
  spuId: number | string // 已有的SPU的ID
  tmId: number | string // SPU品牌的ID
  //v-model收集
  skuName: string // sku名字
  price: number | string // sku价格
  weight: number | string // sku重量
  skuDesc: string // sku的描述
  skuAttrValueList: SkuAttr[] // 平台属性的收集
  skuSaleAttrValueList: SpuAttrValueList // 销售属性
  skuDefaultImg: string // sku图片地址
}

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
