<!-- 服务器资产详情述 -->

<template>
  <div :class="$style.wrapper">
    <ElRow>
      <ElCol :span="12">
        <label>托管位置：</label>
        <span>{{ info.cloudPlatformName }}</span>
      </ElCol>
      <ElCol :span="12">
        <label>VPC：</label>
        <span>{{ NETWORK_AREA[info.networkArea] }}</span>
      </ElCol>

      <ElCol :span="12">
        <label>所属应用：</label>
        <span :class="$style.des">{{ info.serviceName }}</span>
      </ElCol>
      <ElCol :span="12">
        <label>IP：</label>
        <span>{{ info.ipAddress }}</span>
      </ElCol>
    </ElRow>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import getCode from '@/enums/code'

const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { info: { type: Object, required: true } },
  computed: {
    NETWORK_AREA: () => NETWORK_AREA.value,
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

.des {
  display: inline-block;
  width: calc(100% - 130px);
  margin-top: $gapNormal / 2;
  line-height: 1.5em;
  vertical-align: top;
}
</style>
