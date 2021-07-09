<!-- 描述 -->
<template>
  <IChooser
    :fetch="info"
    :args="[id]"
    :class="'el-card ' + $style.box"
  >
    <ElRow
      type="flex"
      :class="$style.widthBox"
    >
      <!-- 左 图片 -->
      <ElCol
        :span="6"
        :class="$style.imgBox"
      >
        <ElImage
          v-if="data.serviceImageId"
          :src="data.serviceImageId"
          :class="$style.imgBox"
          fit="cover"
        />
        <div
          v-else
          :class="$style.imgBox"
        >
          <img src="@mall/assets/shop.png">
        </div>
      </ElCol>

      <!-- 描述 -->
      <ElCol
        :span="18"
        :class="$style.right"
      >
        <ServiceTypeTag :type="data.serviceType" />
        <h2 :class="$style.name">
          {{ data.serviceName }}
        </h2>
        <ElTooltip
          :content="data.serviceIntroduce"
          placement="top-start"
        >
          <p :class="$style.text">
            {{ data.serviceIntroduce }}
          </p>
        </ElTooltip>
        <div :class="$style.priceBox">
          <!-- 左边价格 -->
          <div>
            <span :class="$style.info">价格</span>
            <span :class="$style.money">￥{{ format(data.miniPrice) }}</span>
            <span :class="$style.info"> 起</span>
          </div>
          <!-- 右边数量 -->
          <div style="text-align: right;">
            <!-- 使用数量 -->
            <p :class="$style.info">
              {{ data.customerNumber || 0 }}人在用
            </p>
            <ElRate :value="data.averageScore / 2" />
          </div>
        </div>
        <!-- 选择商品信息 -->
        <div :class="$style.shopMeg">
          <ElForm
            label-position="left"
            label-width="80px"
          >
            <!-- 套餐版本 -->
            <ElFormItem label="套餐版本">
              <ElRadioGroup
                v-model="comb"
                @change="comChange"
              >
                <!-- 修改 -->
                <ElRadioButton
                  v-for="item in combo"
                  :key="item.id"
                  :class="$style.checkMo"
                  :label="item.packageName"
                />
              </ElRadioGroup>
            </ElFormItem>

            <!-- 云平台 -->
            <ElFormItem label="云平台">
              <ElRadioGroup
                v-model="cloudPlant"
                @change="plantChange"
              >
                <ElRadioButton
                  v-for="item in provider"
                  :key="item.id"
                  :class="$style.checkMo"
                  :label="item.providerName"
                />
              </ElRadioGroup>
            </ElFormItem>

            <!-- 购买数量 -->
            <ElFormItem label="购买数量">
              <ElRow
                type="flex"
                justify="space-between"
                style="text-align: center;"
                :class="$style.head"
              >
                <ElCol :span="6">
                  <span>内容</span>
                </ElCol>
                <ElCol :span="6">
                  <span>数量</span>
                </ElCol>
                <ElCol :span="6">
                  <span>单价(元)</span>
                </ElCol>
                <ElCol :span="6">
                  <span>计费方式(每年)</span>
                </ElCol>
              </ElRow>
              <ElRow :class="$style.borBox">
                <IChooser
                  key="product"
                  :fetch="fetch"
                  :args="[comboForm]"
                >
                  <ElFormItem
                    v-for="(item, index) in body"
                    :key="index"
                    :prop="index + ''"
                    class="el-row"
                    style="text-align: center;"
                  >
                    <!-- 内容 -->
                    <ElCol
                      :span="6"
                      :class="$style.shopName"
                      :title="item.securityProductName"
                    >
                      {{ item.securityProductName }}
                    </ElCol>
                    <!-- 数量 -->
                    <ElCol :span="6">
                      <ElInputNumber
                        v-model="item.productnumber"
                        :step="1"
                        :step-strictly="true"
                        size="small"
                        :min="1"
                        :max="1000"
                        @change="regNum"
                      />
                    </ElCol>
                    <!-- 单价 -->
                    <ElCol :span="6">
                      ￥{{ format(item.unitprice) }}
                    </ElCol>
                    <!-- 计费方式 -->
                    <ElCol :span="6">
                      {{ item.productsModeCode==='PRODUCT_VALUATION_POINT'?
                        '按个数':'按次' }}
                    </ElCol>
                  </ElFormItem>
                  <!-- </ElForm> -->
                </IChooser>
              </ElRow>
              <div
                v-show="isDisabled"
                style="text-align: center;"
                class="el-form-item__error el-col el-col-6 el-col-offset-6"
              >
                请输入购买数量
              </div>
            </ElFormItem>

            <ElRow
              type="flex"
              align="middle"
              justify="space-between"
            >
              <!-- 购买时长 -->
              <ElFormItem label="购买时长">
                <ElRadioGroup v-model="duration">
                  <ElRadioButton
                    :label="1"
                    :class="$style.checkMo"
                  >
                    1年
                  </ElRadioButton>
                  <ElRadioButton
                    :label="2"
                    :class="$style.checkMo"
                  >
                    2年
                  </ElRadioButton>
                  <ElRadioButton
                    :label="3"
                    :class="$style.checkMo"
                  >
                    3年
                  </ElRadioButton>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem>
                <span>总计：</span>
                <span :class="$style.totalPrice">￥{{ format(totalPrice) }}</span>
              </ElFormItem>
            </ElRow>

            <!-- 购买 -->
            <ElFormItem style="text-align: right;">
              <ElButton
                type="primary"
                :disabled="isDisabled || !body.length"
                @click="buy"
              >
                立即购买
              </ElButton>

              <ElButton
                type="danger"
                icon="i-gouwuche"
                :disabled="isDisabled || !body.length"
                @click="cart"
              >
                加入购物车
              </ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      </ElCol>
    </ElRow>

    <!-- 服务详情 -->
    <IProduct :content="packageContent" />

    <!-- 规格 -->
    <ICombo :data="combo" />

    <!-- 用户评价 -->
    <IAppraise :id="id" />
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElImage from 'element-ui/lib/image'
import ElRadioGroup from 'element-ui/lib/radio-group'
import ElRadioButton from 'element-ui/lib/radio-button'
import ElInputNumber from 'element-ui/lib/input-number'
import IChooser from '@com/ChooserAsyncFunctional'
import ServiceTypeTag from '@com/service/ServiceTypeTag'
import ElRate from '@mallCom/Rate'
import IProduct from './ProductInfo'
import IAppraise from './Appraise'
import ICombo from './Combo'

import cart from '@/store/cart'
import { trim, Rule } from '@/pipe'
import { local } from '@/utils/storage'
import { MODULE } from '@/enums/module'
import { ROLES, STORAGE } from '@/enums'
import formatNumber from '@/utils/formatNumber'

import {
  selectShopInfo,
  selectProvider,
  selectProviderSelf,
  selectCombo,
  selectBaseInfo,
} from '@/api/servicePlatform/shop'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const RULE: Rule = {
  fkCloudPlatformId: v => v && { k: 'cloudPlatformId', v },
  cloudPlatformName: 1,
  id: 1,
  fkSecurityProductId: v => v && { k: 'productId', v },
  securityProductName: v => v && { k: 'productName', v },
  unitprice: v => ({ k: 'productPrice', v: v || 0 }),
  securityProductVersion: v => v && { k: 'productVersion', v },
  productnumber: v => ({ k: 'quantity', v: v || 0 }),
}

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: {
    ElRate,
    ElImage,
    ElRadioGroup,
    ElRadioButton,
    ElInputNumber,
    IChooser,
    ServiceTypeTag,
    IProduct,
    IAppraise,
    ICombo,
  },
  data() {
    return {
      isDisabled: false,
      data: {},
      packageContent: '', // 服务详情内容
      // comment: [], // 评论数据
      combo: [], // 规格表格数据
      provider: [], // 云平台信息
      comboForm: {
        packageId: '', // 套餐id
        cloudPlantformId: '', // 云平台id
        serviceVersion: '', // 服务版本
      },
      duration: 1, // 购买时长
      comb: '',
      cloudPlant: '',
      body: [],
    }
  },
  computed: {
    id() {
      return this.route.params.id
    },
    totalPrice() {
      const data = this.body
      const year = this.duration
      let sum = 0
      let item
      for (item of data) {
        sum += item.productnumber * item.unitprice * year
      }
      return sum
    },
  },
  methods: {
    info(id: string) {
      return selectBaseInfo(id).then(data => {
        data = data.data
        if (data.status) {
          // 查询服务详情
          selectShopInfo(id).then(res => {
            this.packageContent = res.data.body.serviceRemarkContent
            this.combo = res.data.body.packageList
            this.comb = res.data.body.packageList[0].packageName
            this.comboForm.packageId = res.data.body.packageList[0].id
            this.comboForm.serviceVersion = res.data.body.version
          })

          // 鉴权
          ;(this.authFit(ROLES.cloudService)
            ? selectProviderSelf
            : selectProvider
          )().then(res => {
            this.provider = res.data.body
            this.cloudPlant = res.data.body[0].providerName
            this.comboForm.cloudPlantformId = res.data.body[0].id
          })

          return (this.data = data.body)
        }

        this.$message.warning('该商品已下架')
        return this.up(true)
      })
    },
    async fetch(params: any) {
      // 三个参数同时有值才允许请求
      for (const key in params) {
        if (!params[key]) {
          return
        }
      }

      this.body = (await selectCombo(params)).data.body || []
      return this.body
    },
    getData() {
      const comboForm = this.comboForm
      const data = this.data

      return {
        cloudPlatformId: comboForm.cloudPlantformId,
        packageId: comboForm.packageId,
        packageName: this.cloudPlant,
        productDTOList: trim(this.body, RULE, true),
        purchaseDuration: this.duration,
        serviceId: data.id,
        serviceName: data.serviceName,
        serviceType: data.serviceType,
        serviceVersion: data.version,
      }
    },
    buy() {
      local.set(STORAGE.cashier, [this.getData()])
      this.$router.push({ id: MODULE.cashier })
    },
    cart() {
      cart().push(this.getData())
    },

    // 选择套餐
    comChange(val) {
      this.combo.map(item => {
        if (val === item.packageName) {
          this.comboForm.packageId = item.id
        }
      })
      this.isDisabled = false
    },
    // 选择云平台
    plantChange(val) {
      this.provider.map(item => {
        if (val === item.providerName) {
          this.comboForm.cloudPlantformId = item.id
        }
      })
      this.isDisabled = false
    },

    // 处理价格后的两个小数
    format(num: string) {
      return formatNumber(num, 2)
    },

    // 验证购买数量
    regNum() {
      for (const item of this.body) {
        if (!item.productnumber) {
          this.isDisabled = true
          return
        }
        this.isDisabled = false
      }

      // val ? this.isDisabled = false : this.isDisabled = true
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/rate';
@import '~element-ui/packages/theme-chalk/src/radio-group';
@import '~element-ui/packages/theme-chalk/src/radio-button';
@import '~element-ui/packages/theme-chalk/src/input-number';
</style>

<style lang="scss" module>
.widthBox {
  max-width: $lg;
}

.checkMo {
  position: relative;
  margin-right: 10px;
  overflow: hidden;

  > span {
    color: $colorTextMain !important;
    background-color: $colorWhite !important;
    border: $borderBase !important;
    border-radius: 0 !important;
    transition: border 0.3s;
  }
}

.checkMo > input:checked + span {
  color: $colorTheme !important;
  background-repeat: no-repeat;
  background-position: right bottom;
  background-origin: border-box;
  border: 1px solid $colorTheme !important;
  border-radius: 0 !important;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border: 5px solid;
    border-color: $colorTransparent $colorTheme $colorTheme $colorTransparent;
    content: '';
  }
}

.box {
  padding: $gapNormal 10%;
}

.imgBox {
  width: 240px;
  height: 240px;
  overflow: hidden;
  border-radius: $borderRadiusSmall;

  img {
    width: 100%;
    height: 100%;
  }
}

.right {
  margin-left: $gapNormal;
}

.priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 77px;
  padding: 0 $gapNormal;
  background-image: url(~@mall/assets/bg.png);

  .money {
    color: $colorTheme;
    font-weight: bold;
    font-size: $xLarge;
  }

  .info {
    color: $colorTextMinor;
  }
}

.shopMeg {
  margin-top: $gapNormal;

  :global {
    .el-form-item__label {
      color: $colorTextMinor;
      font-size: $smaller;
    }
  }
}

.text {

  @include ellipsis(3);

  color: $colorTextMinor;
  line-height: 24px;
}

.head {
  padding: 0 $gapNormal;
  color: $colorTextMinor;
  line-height: 30px;
  background-color: $colorBackGround;
}

.borBox {
  padding: $gapNormal / 2 $gapNormal;
  color: $colorTextMain;
  border: $borderBase;
  border-top: none;
  border-radius: $borderRadiusSmall;
}

.name {
  display: inline-block;
  margin: 0 0 0 $gapNormal / 2;
  color: $colorTextMain;
  font-weight: bold;
  font-size: $large;
  line-height: $gapNormal * 1.5;
}

.totalPrice {
  color: $colorTheme;
  font-weight: bold;
  font-size: $large;
}

.shopName {

  @extend %ellipsis;
}
</style>
