<!-- 权限管理 -->
<template>
  <ElRow
    :gutter="GAP"
    class="el-card"
  >
    <ElCol :span="8">
      <ITree @change="query = $event" />
    </ElCol>

    <ElCol :span="16">
      <ElButtonGroup :class="$style.mb">
        <ElButton
          :type="isAPI ? 'primary' : ''"
          size="small"
          @click="is = 'api'"
        >
          API权限
        </ElButton>

        <ElButton
          :type="isAPI ? '' : 'primary'"
          size="small"
          @click="is = ''"
        >
          元素权限
        </ElButton>
      </ElButtonGroup>

      <Transition
        appear
        name="fade"
        mode="out-in"
      >
        <KeepAlive>
          <IInfo
            v-if="isEmpty"
            icon="i-zanwushuju"
            type="info"
            msg="empty"
            retry=""
          />
          <AuthAPI
            v-else-if="isAPI"
            :query="query"
          />
          <AuthEle
            v-else
            :query="query"
          />
        </KeepAlive>
      </Transition>
    </ElCol>
  </ElRow>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IInfo from '@com/Info'
import ITree from './Tree'
import AuthAPI from './API'
import AuthEle from './Element'

import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
export type query = { roleId: string; menuId: string; moduleId: string }

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IInfo, ITree, AuthAPI, AuthEle },
  data: () => ({ is: 'api', query: {} as query }),
  computed: {
    GAP: () => +LAYOUT.gap,
    isAPI() {
      return this.is === 'api'
    },
    isEmpty() {
      const query: query = this.query
      return !query.roleId || !query.menuId || query.menuId === '0'
    },
  },
}
</script>

<style lang="scss" module>
.mb {
  margin-bottom: $gapNormal;
}
</style>
