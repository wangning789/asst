<!-- eslint-disable vue/no-v-html -->
<!-- 描述 -->
<template>
  <div>
    <ElForm
      label-position="right"
      label-width="90px"
    >
      <h3 v-if="title">
        {{ title }}
      </h3>

      <ElFormItem label="服务图片：">
        <ElImage
          :src="serviceDto.serviceImageId"
          :class="$style.imgBox"
          fit="cover "
        >
          <template #error>
            <i
              class="i-tupian"
              :class="$style.defultImg"
            />
          </template>
        </ElImage>
      </ElFormItem>

      <ElFormItem label="服务名称：">
        {{ serviceDto.serviceName }}
      </ElFormItem>

      <ElFormItem label="服务类型：">
        <ServiceTypeTag :type="serviceDto.serviceType" />
      </ElFormItem>

      <ElFormItem label="标签：">
        <ElTag
          v-for="(label, index) in (serviceDto.serviceLabel || '').split(',')"
          :key="index"
          :class="$style['l' + (index % 4)]"
        >
          {{ label }}
        </ElTag>
      </ElFormItem>

      <h4>服务详情</h4>
      <!-- 服务简介 -->
      <ElFormItem label="服务简介：">
        <div
          :class="[$style.des,'common_rich_text_des']"
          v-html="serviceDto.serviceIntroduce"
        />
      </ElFormItem>
      <!-- 描述 -->
      <ElFormItem label="服务描述：">
        <div
          :class="[$style.des,'common_rich_text_des']"
          v-html="serviceDto.serviceRemarkContent"
        />
      </ElFormItem>
      <!-- 服务规格 -->
      <ElFormItem label="服务规格：">
        <div
          :class="[$style.des,'common_rich_text_des']"
          v-html="serviceDto.serviceSpecifications"
        />
      </ElFormItem>
    </ElForm>

    <h4>定价</h4>
    <ElTable
      :data="serviceDto.packageList"
      border
    >
      <ElTableColumn
        v-for="(item, i) in head"
        :key="i"
        show-overflow-tooltip
        :prop="item.prop"
        :label="item.label"
      >
        <template #default="{ row }">
          <span v-if="item.prop === 'productList'">
            {{ row.productList.map(product => product.productsName).join(',') }}
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElImage from 'element-ui/lib/image'
import ElTag from 'element-ui/lib/tag'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import ServiceTypeTag from '@com/service/ServiceTypeTag'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    serviceDto: { type: Object, required: true },
    title: { type: String, required: false, default: '' },
  },
  components: {
    ElImage,
    ElTag,
    ElTable,
    ElTableColumn,
    ServiceTypeTag,
  },
  computed: {
    head() {
      return [
        { prop: 'packageName', label: '套餐名' },
        { prop: 'productList', label: '套餐内容' },
      ]
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/image';
@import '~element-ui/packages/theme-chalk/src/tag';
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.wrapper {
  text-align: center;
}

.imgBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;

  img {
    width: 100%;
    height: 100%;
  }
}

.defultImg {
  font-size: 110px;
}

.l0,
.l1,
.l2,
.l3 {
  margin: 0 10px 0 0;
}

.l0 {
  color: #409eff !important;
  background-color: #ecf5ff !important;
  border: 1px solid #d9ecff !important;
}

.l1 {
  color: #67c23a !important;
  background-color: #f0f9eb !important;
  border-color: #e1f3d8 !important;
}

.l2 {
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
  border-color: #fde2e2 !important;
}

.l3 {
  color: #909399 !important;
  background-color: #f4f4f5 !important;
  border-color: #e9e9eb !important;
}

.des {
  min-height: 150px;
  max-height: 400px;
}
</style>
