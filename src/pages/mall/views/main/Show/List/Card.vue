<!-- 卡片 -->
<template>
  <ElCard
    :class="$style.card"
    shadow="never"
  >
    <!-- 左 图片 -->
    <RouterLink
      :to="data.id"
      append
    >
      <ElImage
        v-if="data.serviceImageId"
        fit="cover"
        :src="data.serviceImageId"
        :class="$style.imgBox"
      />
      <div
        v-else
        :class="$style.imgBox"
      >
        <img src="@mall/assets/shop.png">
      </div>
    </RouterLink>

    <!-- 右边文字 -->
    <div :class="$style.rightBox">
      <!-- 中 描述 -->
      <ElCol :span="18">
        <ElRow type="flex">
          <ServiceTypeTag :type="data.serviceType" />
          <!-- 安全服务名称 -->
          <ElTooltip
            :content="data.serviceName"
            placement="top-start"
          >
            <RouterLink
              :to="data.id"
              :class="$style.name"
              append
            >
              {{ data.serviceName }}
            </RouterLink>
          </ElTooltip>
          <!-- 租户评分平均值 -->
          <ElRate :value="data.averageScore / 2" />
        </ElRow>

        <!-- 安全服务简介 -->
        <p :class="$style.myP">
          {{ data.serviceIntroduce || '-' }}
        </p>

        <!-- 上架时间 -->
        <p :class="$style.info">
          上架时间：{{ data.modifyDate || '-' }}
        </p>
        <!-- 安全服务标签 -->
        <ElTag
          v-for="(label, index) in tag"
          :key="index"
          :class="$style['l' + (index % 4)]"
        >
          {{ label }}
        </ElTag>
      </ElCol>

      <!-- 右 价格 -->
      <ElCol
        :span="6"
        :class="$style.price"
      >
        <!-- 服务最低价格 -->
        <p>
          <span :class="$style.money">￥{{ format(data.miniPrice) }}</span>
          <span :class="$style.info"> 起</span>
        </p>
        <!-- 使用租户数量 -->
        <p :class="$style.info">
          {{ data.customerNumber || '0' }} 位租户在用
        </p>
        <RouterLink
          append
          :to="data.id"
          class="el-button el-button--primary"
        >
          查看详情
        </RouterLink>
      </ElCol>
    </div>
  </ElCard>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTag from 'element-ui/lib/tag'
import ElImage from 'element-ui/lib/image'
import ServiceTypeTag from '@com/service/ServiceTypeTag'
import ElRate from '@mallCom/Rate'

import formatNumber from '@/utils/formatNumber'
// import { getUri } from '@/utils/ajax'
// import { API } from '@/api/tools/file'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { data: { type: Object, required: true } },
  components: { ElRate, ElTag, ElImage, ServiceTypeTag },
  computed: {
    tag() {
      return this.data.serviceLabel.split(',')
    },
  },
  methods: {
    format(num: string) {
      return formatNumber(num, 2)
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/rate';
@import '~element-ui/packages/theme-chalk/src/tag';
@import '~element-ui/packages/theme-chalk/src/image';
</style>

<style lang="scss" module>
.card {
  height: 200px;
  margin-bottom: $gapNormal;

  :global(.el-card__body) {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    padding: 0 !important;
  }
}

.imgBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
  }
}

.rightBox {
  display: flex;
  justify-content: space-between;
  width: 86%;
  // height: 152px;
  padding: 0 $gapNormal;

  :global(.el-rate) {
    margin-top: 5px;
  }
}

.price {
  // padding-right: $gapNormal;
  text-align: right;

  .money {
    color: $colorTheme;
    font-weight: bold;
    font-size: $xLarge;
  }
}

.name {

  @extend %ellipsis;

  margin: 0 $gapNormal 0 $gapNormal / 2;
  color: $colorTextMain;
  font-weight: bold;
  font-size: $large;
  line-height: $gapNormal * 1.25;
  text-decoration: none !important;
}

.myP {

  @include ellipsis(3);

  color: $colorTextCommon;
  line-height: $large;
}

.info {
  color: $colorTextMinor;
}

.l0,
.l1,
.l2,
.l3 {
  margin: 0 10px 0 0;
}

.l0 {
  color: $colorSuccess !important;
  background-color: mix($colorWhite, $colorSuccess, 90%) !important;
  border: 1px solid mix($colorWhite, $colorSuccess, 80%) !important;
}

.l1 {
  color: $colorWarn !important;
  background-color: mix($colorWhite, $colorWarn, 90%) !important;
  border: 1px solid mix($colorWhite, $colorWarn, 80%) !important;
}

.l2 {
  color: $colorDanger !important;
  background-color: mix($colorWhite, $colorDanger, 90%) !important;
  border: 1px solid mix($colorWhite, $colorDanger, 80%) !important;
}

.l3 {
  color: $colorTheme !important;
  background-color: mix($colorWhite, $colorTheme, 90%) !important;
  border: 1px solid mix($colorWhite, $colorTheme, 80%) !important;
}
</style>
