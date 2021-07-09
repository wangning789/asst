<!-- 商城首页 -->
<template>
  <div>
    <!-- 轮播 -->
    <ISlideshow />
    <div :class="$style.content">
      <!-- 这里是推荐商品预留位置 -->
      <!-- 排序 -->
      <div
        class="el-card"
        :class="$style.filter"
      >
        <ElForm
          inline
          :class="$style.myForm"
        >
          <ElFormItem
            v-if="hasType"
            label="服务类型："
          >
            <ElSelect
              :value="filsort.serviceType + ''"
              clearable
              placeholder="请选择服务类型"
              @change="filsort.serviceType = $event && +$event"
            >
              <ElOption
                v-for="(name, value) in SERVICE_TYPE"
                :key="value"
                :label="name"
                :value="value"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="产品类型：">
            <ElSelect
              v-model="filsort.productsTypeCode"
              clearable
              placeholder="请选择产品类型"
            >
              <ElOption
                v-for="item in classify"
                :key="item.productsTypeCode"
                :label="item.productsTypeName"
                :value="item.productsTypeCode"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="关键字：">
            <ElInput
              v-model="filsort.keyword"
              clearable
              placeholder="请输入产品关键字进行搜索"
              suffix-icon="el-input__icon el-icon-search"
            />
          </ElFormItem>

          <br>
          <ElFormItem label="排序：">
            <div :class="$style.sortBox">
              <div
                :class="$style.filIcon"
                @click="sortUse('modifyDate')"
              >
                <span>上架时间</span>
                <div :class="$style.jiantou">
                  <i
                    class="i-paixujiantoushang"
                    :class="filsort.orderFieldType ==='asc'
                      && filsort.orderField ==='modifyDate'
                      && $style.defult"
                  />
                  <i
                    class="i-paixujiantouxia"
                    :class="down
                      && filsort.orderField ==='modifyDate'
                      && $style.defult"
                  />
                </div>
              </div>

              <div
                :class="$style.filIcon"
                @click="sortUse('customerNumber')"
              >
                <span>使用量</span>
                <div :class="$style.jiantou">
                  <i
                    class="i-paixujiantoushang"
                    :class="filsort.orderFieldType ==='asc'
                      && filsort.orderField ==='customerNumber'
                      && $style.defult"
                  />
                  <i
                    class="i-paixujiantouxia"
                    :class="down
                      && filsort.orderField ==='customerNumber'
                      && $style.defult"
                  />
                </div>
              </div>

              <div
                :class="$style.filIcon"
                @click="sortUse('miniPrice')"
              >
                <span>价格</span>
                <div :class="$style.jiantou">
                  <i
                    class="i-paixujiantoushang"
                    :class="filsort.orderFieldType === 'asc'
                      && filsort.orderField === 'miniPrice'
                      && $style.defult"
                  />
                  <i
                    class="i-paixujiantouxia"
                    :class="down
                      && filsort.orderField === 'miniPrice'
                      && $style.defult"
                  />
                </div>
              </div>
            </div>
          </ElFormItem>
        </ElForm>
      </div>

      <!-- 商品展示列表 -->
      <IList :query="filsort" />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
// 轮播图
import ISlideshow from './Slideshow'
import IList from './List'

import { ROLES } from '@/enums'
import { SERVICE_TYPE } from '@/enums/mall'
import { selectProductType } from '@/api/servicePlatform/shop'

export default {
  components: { ISlideshow, IList },
  data() {
    return {
      classify: [], // 产品类型
      filsort: {
        keyword: '', // 关键字搜索
        serviceType: '', // 服务类型
        productsTypeCode: '', // 筛选产品分类
        orderFieldType: 'desc', // 排序类型（升降）
        orderField: 'modifyDate', // 排序字段
      },
      down: true,
    }
  },
  computed: {
    SERVICE_TYPE: () => SERVICE_TYPE,
    hasType() {
      return this.authFit(ROLES.custom) || this.authFit(ROLES.sales)
    },
  },
  methods: {
    sortUse(orderField: string) {
      const filType = this.filsort.orderFieldType
      this.filsort.orderFieldType = filType === 'desc' ? 'asc' : 'desc'
      this.down = !this.down
      this.filsort.orderField = orderField
    },
  },
  created() {
    selectProductType().then(res => {
      this.classify = res.data.body
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.content {
  width: 90%;
  margin: auto;
  padding: $gapNormal 0;
}

.filter {
  margin-bottom: $gapNormal;
}

.myForm {
  // margin-top: $gapNormal;
  padding-top: $gapNormal;
}

.filIcon {
  display: flex;
  margin-right: $gapNormal;

  &:hover {
    color: $colorTheme;
    cursor: pointer;
  }
}

.sortBox {
  display: flex;
}

.jiantou {
  display: flex;
  flex-direction: column;

  > i:first-child {
    position: relative;
    top: 12px;
  }
}

.defult {
  color: $colorTheme;
}
</style>
