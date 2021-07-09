<!-- 采购单 -->
<template>
  <IChooser
    v-loading="requirement.pending"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <h4>
      客户信息
    </h4>
    <IContact
      ref="contactForm"
      v-model="contact"
      :disable="canNotModifyContact || type === 'info'"
    />

    <h4>{{ route.meta.title }}</h4>
    <!-- 商品列表 -->
    <IItems
      :requirement="requirement.cart"
      :disable="!canModify || type === 'info'"
      :total="requirement.total - requirement.invalid"
      :service-list="serviceList"
      @remove="remove"
      @update="update"
      @add="add"
      @init="init"
    />

    <div :class="$style.priceBox">
      总计：
      <span :class="$style.price">
        ￥{{ format(requirement.price) }}
      </span>
    </div>

    <OrderList
      v-if="requireInfo.id"
      :id="requireInfo.id"
    />

    <!-- 结算按钮 -->
    <div
      v-show="type !== 'info'"
      :class="$style.footerBar"
    >
      <!-- 运营可以确认和退回 -->
      <template
        v-if="
          isCommercial &&
            (requireInfo.formStatus === STATUS.submit || requireInfo.formStatus === STATUS.read)
        "
      >
        <ElButton
          type="primary"
          @click="submit(STATUS.confirm)"
        >
          确认
        </ElButton>
        <ElButton
          type="primary"
          @click="sendBack"
        >
          退回
        </ElButton>
        <ElButton
          :class="$style.cancel"
          @click="cancel"
        >
          取消
        </ElButton>
      </template>
      <!-- 云服务商可以新建、撤回、提交 -->
      <template v-if="isCloudService">
        <template v-if="requireInfo.formStatus === STATUS.submit">
          <ElButton
            type="primary"
            @click="recall"
          >
            撤回
          </ElButton>
          <ElButton
            :class="$style.cancel"
            @click="cancel"
          >
            取消
          </ElButton>
        </template>

        <template v-else>
          <!-- <ElButton
            v-if="!requireInfo.id && showReturn"
            type="primary"
            @click="showReturn = false"
          >
            返回修改
          </ElButton> -->
          <template v-if="requireInfo.formStatus !== STATUS.confirm">
            <ElButton
              type="primary"
              @click="submit(STATUS.submit)"
            >
              提交
            </ElButton>
            <ElButton
              :class="$style.cancel"
              @click="cancel"
            >
              取消
            </ElButton>
          </template>
        </template>
      </template>
    </div>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IItems from '@homeCom/Items'
import IContact from './Contact'
import OrderList from './OrderList'
import IChooser from '@com/ChooserAsyncFunctional'

import requirement, { emptyRequirement, emptyProduct } from '@/store/require'
import { trim, Rule } from '@/pipe'
import formatNumber from '@/utils/formatNumber'
import { ROLES, STORAGE } from '@/enums'
import { MODULE } from '@/enums/module'
import { local } from '@/utils/storage'

import {
  selectCombo,
  selectProviderSelf,
  selectShopInfo,
} from '@/api/servicePlatform/shop'
import {
  allService,
  getRequisitionFormInfo,
  commercialInfo,
  add,
  confirm,
  sendBack,
  recall,
  modify,
} from '@/api/requirement/requirement'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
enum EStatus {
  submit = 'submit',
  confirm = 'confirm',
  sendBack = 'sendBack',
  recall = 'recall',
  read = 'read',
}

const RULE: Rule = {
  id: 1,
  packageName: 1,
}

const PRULE: Rule = {
  fkCloudPlatformId: v => v && { k: 'cloudPlatformId', v },
  cloudPlatformName: 1,
  id: 1,
  productsTypeCode: v => ({ k: 'workTypeCode', v }),
  discountunitprice: v => ({ k: 'productPrice', v: v || 0 }),
  fkSecurityProductId: v => v && { k: 'productId', v },
  securityProductName: v => v && { k: 'productsName', v },
  unitprice: v => ({ k: 'originalPrice', v: v || 0 }),
  securityProductVersion: v => v && { k: 'productVersion', v },
  productnumber: v => ({ k: 'quantity', v: v || 0 }),
}
const SRULE: Rule = {
  id: 1,
  packageId: 1,
  packageName: 1,
  serviceName: 1,
  purchaseDuration: 1,
  serviceId: 1,
  serviceVersion: 1,
  packageList: 0,
  totalAmount: 1,
  productDTOList: 1,
  // productDTOList: {

  // },
  productPrice: v => ({ k: 'discountPrice', v: v || 0 }),
  originalPrice: v => ({ k: 'productPrice', v: v || 0 }),
  productVersion: 1,
  packageContent: 1,
  productId: 1,
  quantity: 1,
  productsName: 1,
  workTypeCode: 1,
}
const R_SRULE: Rule = {
  id: 1,
  packageId: 1,
  packageName: 1,
  serviceName: 1,
  purchaseDuration: 1,
  serviceId: 1,
  serviceVersion: 1,
  productDTOList: 1,
  // productDTOList: {
  //   cartId: 1,
  //   cloudPlatformId: 1,
  //   cloudPlatformName: 1,
  //   id: 1,
  //   productId: 1,
  //   productName: 1,
  //   productPrice: 1,
  //   productVersion: 1,
  //   discountunitprice: 1,
  //   quantity: 1,
  // },
  packageList: 1,
  productPrice: v => ({ k: 'originalPrice', v: v || 0 }),
  discountPrice: v => ({ k: 'productPrice', v: v || 0 }),
  productVersion: 1,
  packageContent: 1,
  productId: 1,
  quantity: 1,
  productsName: 1,
  workTypeCode: 1,
  totalAmount: 1,
}

function formatPrice(price?: number | string) {
  return formatNumber(price, 2)
}

async function getPlatform() {
  let platformId = local.get(STORAGE.platform)
  if (!platformId) {
    platformId = (await selectProviderSelf())?.data?.body[0]?.id
    local.set(STORAGE.platform, platformId)
  }
  return platformId
}

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    route: { type: Object, required: true },
    type: { type: String, required: true },
  },
  components: { IItems, IContact, IChooser, OrderList },
  data: () => ({
    contact: {},
    serviceList: [],
    requireInfo: {},
  }),
  computed: {
    requirement,
    STATUS: () => EStatus,
    isCloudService() {
      return this.authFit(ROLES.cloudService)
    },
    isCommercial() {
      return this.authFit(ROLES.commercial)
    },
    canModify() { // 是云服务商，并且无状态或者为退回和撤回时才可以修改
      const status = this.requireInfo.formStatus
      return this.isCloudService && (!status ||
      status === EStatus.recall ||
      status === EStatus.sendBack)
    },
    canNotModifyContact() {
      const status = this.requireInfo.formStatus
      return (this.isCommercial && status !== EStatus.submit && status !== EStatus.read) ||
      (this.isCloudService && status && status !== EStatus.recall &&
      status !== EStatus.sendBack)
    },
  },
  methods: {
    format: formatPrice,
    async fetch(id?: string) {
      this.requirement.clear()
      this.requireInfo = {}
      this.serviceList = (await allService()).data.body
      if (!id) {
        this.requirement.push(emptyRequirement)
        return 1
      }
      let fn
      switch (true) {
        case this.isCloudService:
          fn = getRequisitionFormInfo
          break
        case this.isCommercial:
          fn = commercialInfo
          break
      }

      const data = fn && ((await fn(id)).data.body || {})
      const {
        cloudControlNo,
        contacts,
        contactsPhone,
        department,
        email,
        customerId,
        projectName,
        businessContacts, // 业务联系人
        businessEmail, // 业务联系人邮箱
        businessPhone, // 业务联系人电话
        technicalContacts, // 技术联系人
        technicalEmail, // 技术联系人邮箱
        technicalPhone, // 技术联系人电话
        useDepartment, // 使用单位
        note, // 备注
      } = data
      this.contact = {
        id,
        cloudControlNo,
        contacts,
        contactsPhone,
        department,
        email,
        customerId,
        projectName,
        businessContacts, // 业务联系人
        businessEmail, // 业务联系人邮箱
        businessPhone, // 业务联系人电话
        technicalContacts, // 技术联系人
        technicalEmail, // 技术联系人邮箱
        technicalPhone, // 技术联系人电话
        useDepartment, // 使用单位
        note, // 备注
      }
      const carts = data.requisitionFormServiceDTOs
      carts.forEach((cart) => {
        cart.packageList = [
          {
            id: cart.packageId,
            packageName: cart.packageName,
          },
        ]
        cart.totalAmount = cart.totalAmount || 0
        this.requirement.push(trim(cart, R_SRULE, true))
      })

      return (this.requireInfo = data)
    },
    async init(item: string) {
      this.requirement.remove(item)

      const serviceInfo = (await selectShopInfo(item.serviceId))?.data?.body
      const { id, packageList, version, serviceName } = serviceInfo
      const emptyObject = {
        serviceId: id, // 服务id
        packageId: '', // 套餐id
        serviceVersion: version, // 服务版本
        purchaseDuration: '', // 购买时长
        serviceName,
        packageName: '',
        packageList: trim(packageList, RULE, true),
        productDTOList: [emptyProduct], // 产品列表
        totalAmount: 0,
      }
      this.requirement.push(emptyObject)
    },

    async update(item: any) {
      this.requirement.remove(item)
      const params = {
        cloudPlantformId: await getPlatform(),
        packageId: item.packageId,
        serviceVersion: item.serviceVersion,
      }
      const pack = item.packageList.filter(pack => pack.id === item.packageId)
      const pList = (await selectCombo(params))?.data?.body

      pList.forEach(p => {
        p.discountunitprice = p.unitprice
      })

      const obj = Object.assign(item, {
        packageName: pack && pack[0].packageName,
        packageContent: pack && (pack[0].packageContent || ''),
        productDTOList: trim(pList, PRULE, true),
      })
      this.requirement.push(obj)
    },

    remove(item: any) {
      this.$confirm('确定要移除该商品？', '移除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        this.requirement.remove(item)
      })
    },

    add() {
      this.requirement.push(emptyRequirement)
    },

    alertMsg() {
      this.$message.error('请完善产品信息')
    },
    async formValidate() {
      let contactValidate = false
      try {
        contactValidate = await this.$refs.contactForm.formValidate()
      } catch (error) {
        contactValidate = false
      }
      return contactValidate
    },
    serviceValidate() {
      const cartList = this.requirement.cart
      if (cartList && cartList.length) {
        for (let i = 0; i < cartList.length; i++) {
          const data = cartList[i].items
          for (let j = 0; j < data.length; j++) {
            const service = data[j]
            if (!service.packageId) {
              this.alertMsg()
              return false
            }
          }
        }
        return true
      }
      this.alertMsg()
      return false
    },

    async submit(type: string) {
      if ((await this.formValidate()) && this.serviceValidate()) {
        this.$confirm('请确认采购单信息是否正确', '操作确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => { this.saveFn(type) })
      }
    },
    async saveFn(type: string) {
      const requisitionFormServiceDTOs = []
      const cartList = this.requirement.cart
      for (let i = 0; i < cartList.length; i++) {
        const data = cartList[i].items
        for (let j = 0; j < data.length; j++) {
          const service = data[j]
          if (service.packageId) {
            requisitionFormServiceDTOs.push(service)
          }
        }
      }
      const param = Object.assign({},
        this.contact,
        { requisitionFormServiceDTOs: trim(requisitionFormServiceDTOs, SRULE, true) })
      let fn
      switch (type) {
        case EStatus.submit:
          fn = this.requireInfo.id ? modify : add
          break
        case EStatus.confirm:
          fn = confirm
          break
        default:
          break
      }
      param.discountPrice = this.requirement.price
      fn && await fn(param)
      this.requirement.clear()
      this.$notify.success(`${this.requireInfo.id ? '修改' : '新增'}采购单成功`)
      if (type === EStatus.submit && !this.requireInfo.id) {
        this.jump({ id: MODULE.main })
      } else {
        this.jump({ id: MODULE.requirement })
      }
    },
    async sendBack() {
      const requireId = this.requireInfo.id
      requireId && sendBack(requireId)
      this.jump({ id: MODULE.requirement })
    },
    async recall() {
      const requireId = this.requireInfo.id
      requireId && recall(requireId)
      this.jump({ id: MODULE.requirement })
    },
    cancel() {
      this.$confirm('确认取消当前操作', '操作确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        this.jump({ id: (this.requireInfo.id ? MODULE.requirement : MODULE.main) })
      })
    },
  },
  mounted() {
    local.remove(STORAGE.platform)
    getPlatform()
  },
  destroyed() {
    local.remove(STORAGE.platform)
  },
}
</script>

<style lang="scss" module>
.count,
.price {
  color: $colorTheme;
  font-weight: bold;
}

.count {
  font-size: $larger;
}

.priceBox {
  text-align: right;
}

.cancel {
  margin-left: 10px;
}

.price {
  margin-right: $gapNormal;
  font-size: $xxLarge;
}

.footerBar {
  margin-top: $gapNormal;
  text-align: center;
}
</style>
