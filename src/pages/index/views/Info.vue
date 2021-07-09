<!-- 描述 -->
<template>
  <body>
    <IHeader />

    <img
      width="100%"
      src="@index/assets/banner.png"
    >

    <IArticles :be="route.params.id" />

    <IFooter />
  </body>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IHeader from '@indexCom/Header'
import IArticles from '@index/articles'
import IFooter from '@indexCom/Footer'

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { IArticles, IFooter, IHeader },
}
</script>
