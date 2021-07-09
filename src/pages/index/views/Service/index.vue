<!-- 描述 -->
<template>
  <body>
    <IHeader />
    <!-- $route.params.id
      --根据这个id来判断展示哪个服务产品
      -- 1：主机防病毒服务
      -- 2：应用层防火墙服务
      -- 3：Web防篡改服务
      -- 4：虚拟防火墙服务
      -- 5：主机漏洞检测服务-->
    <IS1 v-if="id==='1'" />
    <IS2 v-if="id==='2'" />
    <IS3 v-if="id==='3'" />
    <IS4 v-if="id==='4'" />
    <IS5 v-if="id==='5'" />

    <IFooter />
  </body>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IHeader from '@indexCom/Header'
import IFooter from '@indexCom/Footer'
import IS1 from './S1'
import IS2 from './S2'
import IS3 from './S3'
import IS4 from './S4'
import IS5 from './S5'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: {
    IHeader,
    IS1,
    IS2,
    IS3,
    IS4,
    IS5,
    IFooter,
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
}
</script>
