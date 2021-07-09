/** 购物车 (Vue 实例) */
import Vue from 'vue'
import Message from 'element-ui/lib/message'
// ↑因scss注入问题，应在合适的地方引入组件对应的scss，比如页面入口

import CONFIG, { SPA } from '@/config'
import { STORAGE, ROLES } from '@/enums'
import { MODULE } from '@/enums/module'
import { GLOBAL } from '@/enums/events'
import { ServiceType, SERVICE_TYPE } from '@/enums/mall'
import { trim, Rule } from '@/pipe'
import { isNullish } from '@/utils'
import { local } from '@/utils/storage'
import { authFit } from '@/functions/auth'
import { encode, decode } from '@/functions/cipher'
import me from './user'

import {
  Cart as CartDTO,
  Order as OrderDTO,
  getCart,
  syncCart,
  orderCustomer,
  orderCloudService,
  orderSales,
} from '@/api/servicePlatform/securityServiceMarket'

/** 篮子(同类商品集合) */
export interface Basket {
  /** 商品类型 */
  type: ServiceType
  /** 商品类型名称 */
  name: string
  /** 商品列表 */
  items: CartDTO[]
  /** 总价 */
  price: number
}
interface Baskets {
  /** 篮子 */
  cart: Basket[]
  /** 总数 */
  total: number
  /** 失效的数量 */
  invalid: number
  /** 总价 */
  price: number
  /** 是否正在同步 */
  pending: boolean
}
/** 购物车 */
export interface Cart extends Baskets {
  /** 当前选中 */
  selected: CartDTO[]
  /** 当前选中的总价 */
  selectedPrice: number
  /** 选择/取消选择
   * @param item CartDTO: 切换选中 CartDTO[]: 切换全选
   */
  toggle: (item: CartDTO | CartDTO[]) => CartDTO | CartDTO[]
  /** 添加/修改商品 */
  push: (item: CartDTO, replace?: boolean) => Basket
  /** 删除商品 */
  remove: (item: CartDTO) => CartDTO | undefined
  /** 筛选商品 */
  filter: (items: CartDTO[]) => CartDTO[]
  /** 同步购物车到服务端, 会自动调用 */
  submit: () => Promise<void>
  /** 从服务端同步购物车 */
  sync: (fetchOnly?: boolean) => Promise<void>
}
/** 结算 */
export interface Cashier extends Baskets {
  /** 初始化账单 */
  init: () => void
  /** 清空商品 */
  clear: () => void
  /** 修改数量 */
  push: (item: CartDTO) => Basket
  /** 结算/下单 */
  order: (contact: any) => Promise<void>
}

/// -------- 篮子 -------- ///
const RULE: Rule = {
  cloudPlatformId: 1,
  id: 1,
  packageId: 1,
  packageName: 1,
  packageList: 1,
  productDTOList: {
    cartId: 1,
    cloudPlatformId: 1,
    cloudPlatformName: 1,
    id: 1,
    productId: 1,
    productName: 1,
    productPrice: 1,
    productVersion: 1,
    discountunitprice: 1,
    quantity: 1,
  },
  packageContent: 1,
  purchaseDuration: 1,
  serviceId: 1,
  serviceName: 1,
  serviceType: 1,
  serviceVersion: 1,
  status: 1,
  totalAmount: 1,
}
const priority = [
  'serviceId',
  'serviceVersion',
  'packageId',
  'cloudPlatformId',
  'purchaseDuration',
]
function isSame(item1: CartDTO, item2: CartDTO) {
  if (item1 === item2) {
    return true
  }

  let attribute
  for (attribute of priority) {
    if ((item1 as any)[attribute] !== (item2 as any)[attribute]) {
      return false
    }
  }

  return true
}
/** 添加/修改商品
 * @param replace
 *  true: 存在则替换物品数量
 *  false|undefined: 存在则累加物品数量
 *  1: 仅更新(内部使用不暴露)
 *
 * @returns true: 修改  CartDTO: 新增
 */
function basketPush(this: any, item: CartDTO, replace?: boolean | 1) {
  const items: CartDTO[] = this.items_
  const isInner = replace === 1

  let product
  let hasChange
  for (product of items) {
    if (item === product) {
      return
    }

    if (isSame(item, product)) {
      if (isInner) {
        return
      }

      // 相同商品内容(数组长度及每项顺序)应一致
      item = item.productDTOList as any
      product = product.productDTOList || []
      for (let i = 0, len = product.length, p, q; i < len; i++) {
        p = product[i]
        q = p.quantity || 0
        p.quantity = (replace ? 0 : q) + (((item as any)[i] || 0).quantity || 0)
        hasChange || (hasChange = q !== p.quantity)
      }
      return hasChange
    }
  }

  isInner || (item = trim(item, RULE))
  items.push(item)
  return item
}
/** 删除商品 */
export function basketRemove(this: any, item: CartDTO) {
  for (let i = 0, items = this.items_, len = items.length; i < len; i++) {
    if (isSame(item, items[i])) {
      item = items[i]
      items.splice(i, 1)
      return item
    }
  }
}
/** 计算篮子总价及商品价格 */
export function basketPrice(items: CartDTO[]) {
  let price = 0

  let item
  let productDTOList
  let productDTO
  let itemPrice
  for (item of items) {
    itemPrice = 0
    productDTOList = item.productDTOList || []
    for (productDTO of productDTOList) {
      itemPrice +=
        (productDTO.productPrice || 0) * ((productDTO.quantity as number) | 0)
    }
    itemPrice *= item.purchaseDuration || 0
    item.totalAmount = itemPrice
    price += itemPrice
  }

  return price
}

/** 篮子 */
const Basket = {
  data: () => ({ type_: 0, items_: [] }),
  computed: {
    type(this: any) {
      return this.type_ as ServiceType
    },
    name(this: any) {
      return SERVICE_TYPE[this.type_ as ServiceType]
    },
    items(this: any) {
      return this.items_ as CartDTO[]
    },
    price(this: any) {
      return basketPrice(this.items)
    },
  },
}

/// -------- 购物车 -------- ///
function cartClearTimmer(this: any) {
  if (this.$_timmer) {
    clearTimeout(this.$_timmer)
    this.$_timmer = 0
  }
}
function cartAutoSubmit(this: any) {
  cartClearTimmer.call(this)
  this.$_timmer = setTimeout(() => {
    this.submit()
  }, CONFIG.cartSync)
}
/** 添加/修改商品
 * @param replace 1: 仅更新, 不暴露给外部
 */
export function cartPush(this: any, item: CartDTO, replace?: boolean | 1) {
  if (this.pending) {
    ;(this.$_cart || (this.$_cart = [])).push(arguments)
    return
  }

  let basket: any = this.$_map[item.serviceType as ServiceType]
  if (!basket) {
    basket = new Vue(Basket)
    basket.type_ = item.serviceType
    this.$_map[basket.type_ as ServiceType] = basket
  }

  if ((item = basketPush.call(basket, item, replace) as any) && replace !== 1) {
    item === true || this.cart_.push(item)
  }

  return basket
}
export function cartReset(this: any, cart?: CartDTO[]) {
  const basketMap = this.$_map || null
  let key
  for (key in basketMap) {
    basketMap[key].items_ = []
  }
  this.cart_ = cart || []
}
export function cartThen(this: any, res: { data: { body: CartDTO[] } }) {
  cartDone.call(this)
  cartReset.call(this, trim(res.data.body || [], RULE))
  const waitList = this.$_cart
  this.$_stamp = Date.now()
  if (waitList && waitList.length) {
    let args
    for (args of waitList) {
      cartPush.apply(this, args)
    }
    delete this.$_cart
  }
}
export function cartDone(this: any) {
  this.$_i = 0
  this.pending_ = false
}
export function cartGet(this: any) {
  this.pending_ = true
  cartClearTimmer.call(this)
  return getCart()
    .then(this.$_then)
    .catch(this.$_done)
}
export function cartPrice(this: any) {
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

  ;(this.$_i = (this.$_i || 0) + 1) > 1 && cartAutoSubmit.call(this)
  this.price_ = price
}

/** 购物车 */
const Cart = {
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
    selected(this: any) {
      return this.selected_
    },
    selectedPrice(this: any) {
      let price = 0

      const selected: CartDTO[] = this.selected_
      let cartDTO
      for (cartDTO of selected) {
        price += cartDTO.totalAmount || 0
      }

      return price
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
        this.filter && (this.selected_ = this.filter(this.selected_))

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
    /** 筛选商品 */
    filter(this: any, selected: CartDTO[]) {
      const result: CartDTO[] = []

      const cartDTOs: CartDTO[] = this.cart_
      let selectedItem
      let cartDTO
      for (selectedItem of selected) {
        for (cartDTO of cartDTOs) {
          if (isSame(selectedItem, cartDTO)) {
            result.push(cartDTO)
            break
          }
        }
      }

      return result
    },
    /** 选择/取消选择
     * @param item CartDTO: 切换选中 CartDTO[]: 切换全选
     */
    toggle(this: any, item: CartDTO | CartDTO[]) {
      const isToogleAll = Array.isArray(item)
      item = this.filter(isToogleAll ? item : [item]) as CartDTO[]
      const selected: CartDTO[] = this.selected_
      if (isToogleAll) {
        this.selected_ = selected.length ? [] : item
      } else if ((item = item[0])) {
        const index = selected.indexOf(item)
        index > -1 ? selected.splice(index, 1) : selected.push(item)
      }
      return item
    },
    /** 同步购物车到服务端, 会自动调用 */
    submit(this: any) {
      if (this.$_timmer) {
        this.pending_ = true
        cartClearTimmer.call(this)
        return syncCart(this.cart_)
          .then(this.$_then)
          .catch(this.$_done)
      }

      return Promise.resolve()
    },
    /** 从服务端同步购物车 */
    sync(this: any, fetchOnly?: boolean) {
      return fetchOnly ? this.$_get() : this.submit().then(this.$_get)
    },
  },
  created(this: any) {
    type SerializedInfo = {
      /** 物品列表 */
      c: CartDTO[]
      /** 时间戳 */
      t: number
      /** 用户id */
      i?: string
    }

    this.$_map = {} // 篮子字典
    this.$_then = cartThen.bind(this)
    this.$_done = cartDone.bind(this)
    this.$_get = cartGet.bind(this)
    const currentUserId = me.id
    const info = (local.get(STORAGE.cart, decode) || 0) as SerializedInfo
    if (
      info.i &&
      info.i === currentUserId &&
      info.t + CONFIG.cartSync > Date.now()
    ) {
      info.c.length && (this.cart_ = info.c)
    } else {
      this.sync(true)
    }

    const persist = () => {
      local.set<SerializedInfo>(
        STORAGE.cart,
        { c: this.cart_, t: this.$_stamp, i: currentUserId },
        encode
      )
    }
    /** 关闭窗口前(同步并)写入本地 */
    window.addEventListener('beforeunload', event => {
      persist()

      if (this.$_timmer) {
        const msg = '您有数据未保存, 请稍候...'
        const loading = this.$loading({ lock: true, text: msg })
        this.submit()
          .then(() => {
            persist()
            loading.close()
          })
          .catch(() => {
            loading.close()
          })

        return ((event || window.event || 0).returnValue = msg)
      }
    })

    this.on(GLOBAL.beforeLogout, () => {
      this.submit()
    })
  },
}

let instanceCart!: Cart
/** 获取购物车实例 */
function getCartInstance() {
  return instanceCart || (instanceCart = new Vue(Cart))
}

/// -------- 结算 -------- ///
function decodePhone(phone: string) {
  try {
    return decode(phone)
  } catch (error) {
    return phone
  }
}
const PRODUCT_RULE: Rule = {
  cloudPlatformId: 1,
  cloudPlatformName: 1,
  productId: 1,
  productVersion: 1,
  quantity: 1,
  discountunitprice: 1,
}
const ORDER_RULE: Rule = {
  id: v => ({ k: 'cartId', v }),
  packageId: 1,
  purchaseDuration: 1,
  serviceId: 1,
  serviceVersion: 1,
  productDTOList: v => ({
    k: 'serviceProductDTOList',
    v: trim(v, PRODUCT_RULE, true),
  }),
}
function toOrder(contacts: any, remak: any, baskets: Basket[]): OrderDTO[] {
  return baskets.map(basket => ({
    customer: contacts.department,
    customerId: contacts.id,
    orderContacts: contacts.contacts,
    orderContactsPhone: decodePhone(contacts.phone),
    packageOrderRemark: remak[basket.type],
    serviceType: basket.type,
    orderServiceDTOList: basket.items.map(item => trim(item, ORDER_RULE)),
  }))
}

/** 结算 */
const Cashier = {
  data: Cart.data,
  computed: Cart.computed,
  watch: Cart.watch,
  methods: {
    /** 初始化账单 */
    init(this: any) {
      if (this.cart_.length) {
        return
      }

      const items = local.get<CartDTO[]>(STORAGE.cashier)
      if (!items) {
        return history.back()
      }

      cartReset.call(this, items as CartDTO[])
      local.remove(STORAGE.cashier)
    },
    /** 清空商品 */
    clear(this: any) {
      cartReset.call(this)
    },
    /** 修改数量
     * @param replace 不暴露给外部
     */
    push: Cart.methods.push,
    remove: Cart.methods.remove,
    /** 结算/下单 */
    order(this: any, contacts: any, remak: any) {
      if (this.$_o) {
        this.pending_ = true
        const orderData = toOrder(contacts, remak, this.cart)
        const cartInstance = getCartInstance()
        this.$_o(orderData)
          .then(() => cartInstance.sync(true))
          .then(() => {
            this.$_done()
            this.jump({ id: MODULE.order, SPA: SPA.home })
          })
          .catch(() =>
            cartInstance.sync(true).then(() => {
              cartReset.call(this, cartInstance.filter(this.cart_))
            })
          )
      } else {
        Message.error('您没有下单权限！')
      }
    },
  },
  created(this: any) {
    switch (true) {
      case authFit(SPA.mall, [ROLES.custom]):
        this.$_o = orderCustomer
        break
      case authFit(SPA.mall, [ROLES.cloudService]):
        this.$_o = orderCloudService
        break
      case authFit(SPA.mall, [ROLES.sales]):
        this.$_o = orderSales
        break
    }

    this.$_map = {} // 篮子字典
    this.$_then = cartThen.bind(this)
    this.$_done = cartDone.bind(this)
    this.$_get = cartGet.bind(this)
    // eslint-disable-next-line no-empty-function
    Object.defineProperty(this, '$_i', { get: () => 0, set: () => {} })
    this.init()
  },
}

let instanceCashier!: Cashier
/** 获取结算实例 */
function getCashierInstance() {
  return instanceCashier || (instanceCashier = new Vue(Cashier))
}

export { getCartInstance as default, getCashierInstance as cashier }
