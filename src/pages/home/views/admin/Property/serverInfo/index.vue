<!-- 资产管理资产详情 -->
<template>
  <IChooser
    key="ciInfo"
    :fetch="fetch"
    :args="[route.params.id]"
    :class="'el-card ' + $style.wrapper"
  >
    <h4>
      资产{{ info.ciName }}
    </h4>

    <ElRow>
      <ElCol :span="14">
        <CiInfo
          v-if="info"
          :info="info"
        />
      </ElCol>
      <ElCol :span="10">
        <Leak
          v-if="info && authFit(ROLES.custom)"
          :info="info"
        />
      </ElCol>
    </ElRow>

    <!-- tabs -->
    <TabsInfo
      :route="route"
      :info="info"
    />
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import CiInfo from './CiInfo'
import Leak from './Leak'
import TabsInfo from './TabsInfo'
import IChooser from '@com/ChooserAsyncFunctional'

import { ROLES } from '@/enums/index'

import {
  infoF,
  baseByCiid,
} from '@/api/servicePlatform/serverAssets'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { CiInfo, Leak, TabsInfo, IChooser },
  data() {
    return {
      info: {},
    }
  },
  computed: {
    ROLES: () => ROLES,
  },
  methods: {
    async fetch(id?: string) {
      if (!id) {
        return 1
      }

      let fn

      switch (true) {
        case this.authFit(ROLES.custom):
          fn = baseByCiid
          break
        case this.authFit(ROLES.operation):
          fn = infoF
          break
        default:
          fn = null
      }

      const data = (await fn(id)).data.body || {}
      this.id = data.id
      return (this.info = data)
    },
  },
}

</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/breadcrumb';
@import '~element-ui/packages/theme-chalk/src/breadcrumb-item';

</style>
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
