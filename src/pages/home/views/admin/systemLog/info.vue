<!-- 系统日志详情 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="[route.params.id]"
    :class="'el-card ' + $style.wrapper"
  >
    <template #success="{ data: { data = {}}}">
      <h4>日志详情</h4>
      <ElRow>
        <ElCol :span="8">
          <label>接口名：</label>
          <span>{{ data.body.apiName }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>操作时间：</label>
          <span>{{ data.body.createDate }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>操作类型：</label>
          <span>{{ data.body.name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>操作用户：</label>
          <span>{{ data.body.createUser }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>IP地址：</label>
          <span>{{ data.body.ip }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>路径：</label>
          <span>{{ data.body.path }}</span>
        </ElCol>
      </ElRow>

      <h4>参数详情</h4>
      <ElRow>
        <ElCol :span="20">
          <span class="spanP">{{ data.body.params }}</span>
        </ElCol>
      </ElRow>
    </template>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
import IChooser from '@com/ChooserAsyncFunctional'

import { detail } from '@/api/authServer/log'

export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { IChooser },
  methods: {
    fetch: detail,
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
