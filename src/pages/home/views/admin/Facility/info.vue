<!-- 系统日志详情 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="[route.params.id]"
    :class="'el-card ' + $style.wrapper"
  >
    <template #success="{ data: { data = {}}}">
      <h4>安全设备详情</h4>
      <ElRow>
        <ElCol :span="8">
          <label>设备厂商：</label>
          <span>{{ data.body.vendorName }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>设备类型：</label>
          <span>{{ data.body.typeName }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>API版本：</label>
          <span>{{ data.body.versionName }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>设备名称：</label>
          <span>{{ data.body.name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>部署云平台：</label>
          <span>{{ data.body.providerName }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>管理IP：</label>
          <span>{{ data.body.ip }}</span>
        </ElCol>
        <ElCol :span="8">
          <label>管理端口：</label>
          <span>{{ data.body.port }}</span>
        </ElCol>
        <ElCol :span="8">
          <label>认证用户名：</label>
          <span>{{ data.body.username }}</span>
        </ElCol>
        <ElCol :span="8">
          <label>网络区域：</label>
          <span>{{ data.body.networkAreaName }}</span>
        </ElCol>
        <ElCol :span="8">
          <label>关联用户：</label>
          <span
            v-for="item in data.body.relUsers"
            :key="item.id"
          > {{ item.name }} </span>
        </ElCol>
      </ElRow>
    </template>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
import IChooser from '@com/ChooserAsyncFunctional'

import { det } from '@/api/maintance/facility'
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { IChooser },
  methods: {
    fetch: det,
  },
}
</script>

<style lang="scss" module>
.wrapper {
  h4 {
    margin: $gapNormal / 2 0;
    color: $colorTextMain;
    font-size: $larger;

    &:first-of-type {
      margin-top: 0;
    }
  }

  label {
    display: inline-block;
    width: 125px - $gapNormal / 2;
    margin: $gapNormal / 2 0;
    padding-right: $gapNormal / 2;
    text-align: right;
  }
}
</style>
