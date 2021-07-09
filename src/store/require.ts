/** 购物车 (Vue 实例) */
import Vue from 'vue'

import {
  Cart as CartDTO,
} from '@/api/servicePlatform/securityServiceMarket'

import { isNullish } from '@/utils'
import { ServiceType } from '@/enums/mall'

import {
  Basket,
  basketPrice,
  cartPush,
  basketRemove,
  cartThen,
  cartGet,
  cartDone,
  cartReset,
  Cart,
} from './cart'

export const emptyProduct = {
  productName: '', /** 产品名 */
  productPrice: '', /** 产品单价 example: 1299 */
  discountunitprice: '', /** 折扣价 example: 1299 */
  quantity: '', /** 数量 example: 2 */
}

export const emptyRequirement = {
  serviceId: '', // 服务id
  packageId: '', // 套餐id
  serviceVersion: '', // 服务版本
  purchaseDuration: '', // 购买时长
  packageList: [],
  productDTOList: [emptyProduct], // 产品列表
}

function cartPrice(this: any) {
  let price = 0

  const cart: Basket[] = this.cart
  let cartDTO
  let basket
  for (basket of cart) {
    if (!basket) {
      continue
    }

    for (cartDTO of basket.items) {
      price += isNullish(cartDTO.totalAmount)
        ? basketPrice([cartDTO])
        : cartDTO.totalAmount || 0
    }
  }
  this.price_ = price
}

export const Require = {
  data: () => ({
    cart_: [],
    baskets_: [],
    total_: 0,
    invalid_: 0,
    price_: 0,
    pending_: false,
    selected_: [],
  }),
  computed: {
    cart(this: any) {
      return this.baskets_
    },
    total(this: any) {
      return this.total_
    },
    invalid(this: any) {
      return this.invalid_
    },
    price(this: any) {
      return this.price_
    },
    pending(this: any) {
      return this.pending_
    },
  },
  watch: {
    cart_: {
      deep: true,
      immediate: true,
      handler(this: any, cartDTOList: CartDTO[]) {
        let invalid = 0

        const cart: Basket[] = []
        let cartDTO
        let basket
        for (cartDTO of cartDTOList) {
          cartDTO.status && invalid++
          basket = this.push(cartDTO, 1)
          cart.includes(basket) || cart.push(basket)
        }
        this.baskets_.length === cart.length || (this.baskets_ = cart)

        this.total_ = cartDTOList.length
        this.invalid_ = invalid

        this.$nextTick(cartPrice)
      },
    },
  },
  methods: {
    /** 添加/修改商品
     * @param replace 1: 仅更新, 不暴露给外部
     */
    push(this: any, item: CartDTO, replace?: boolean | 1) {
      return cartPush.call(this, item, replace)
    },
    /** 删除商品 */
    remove(this: any, item: CartDTO) {
      const basket: any = this.$_map[item.serviceType as ServiceType]
      if (basket && (item = basketRemove.call(basket, item) as CartDTO)) {
        const cartDTOList = this.cart_
        cartDTOList.splice(cartDTOList.indexOf(item), 1)
        return item
      }
    },
    /** 清空商品 */
    clear(this: any) {
      cartReset.call(this)
    },
  },
  created(this: any) {
    // type SerializedInfo = {
    //   /** 物品列表 */
    //   c: CartDTO[]
    //   /** 时间戳 */
    //   t: number
    //   /** 用户id */
    //   i?: string
    // }

    this.$_map = {} // 篮子字典
    this.$_then = cartThen.bind(this)
    this.$_done = cartDone.bind(this)
    this.$_get = cartGet.bind(this)
    // const currentUserId = me.id
    // const info = (local.get(STORAGE.cart, decode) || 0) as SerializedInfo
    // if (
    //   info.i &&
    //   info.i === currentUserId &&
    //   info.t + CONFIG.cartSync > Date.now()
    // ) {
    //   info.c.length && (this.cart_ = info.c)
    // } else {
    //   this.sync(true)
    // }
  },
}

let instanceRequire!: Cart
/** 获取采购单实例 */
function getRequireInstance() {
  return instanceRequire || (instanceRequire = new Vue(Require))
}

export { getRequireInstance as default }
