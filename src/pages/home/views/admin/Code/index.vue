<!--
 * @Description: 码表管理
 * @Author: 毛瑞
 * @Date: 2019-11-08 16:17:07
 -->
<template>
  <ElTabs
    v-model.lazy.trim="is"
    v-loading="load"
    :class="'el-card is-always-shadow ' + $style.wrapper"
  >
    <ElTabPane
      v-for="tab in tabs"
      :key="tab.dictCode"
      lazy
      :label="tab.dictName"
      :name="tab.dictCode"
    >
      <IManager :code="tab.dictCode" />
    </ElTabPane>
  </ElTabs>
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import IManager from './Manager'

import { type } from '@/api/authServer/code'
// 没有权限的问题
// import AUTH from '@index/config/auth/admin/code'

/// 常量(const UPPER_CASE) ///
/// 单例(const camelCase) ///
/// 函数(无副作用, function utils() {}) ///

/// 选项 name,components,directives,filters,extends,mixins ///
@Component({ components: { ElTabs, ElTabPane, IManager } })
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (name: string = '响应式属性' // 除了undefined都会响应式) ///
  private is = ''
  private load = true
  /// 非响应式属性 (name?: string) ///
  private tabs?: { dictCode: string; dictName: string }[]
  /// computed (get name() {} set name(){}) ///
  /// watch (@Watch) ///
  /// LifeCycle (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    this.tabs = undefined
    type()
      .then((res: any) => {
        const tabs = []
        let item: any
        for (item of res.data.body) {
          tabs.push(item)
        }
        this.tabs = tabs
        this.is = tabs[0].dictCode
      })
      .finally(() => {
        this.load = false
      })
  }
  /// methods (getName(){}) ///
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang="scss" module>
.wrapper {
  padding-top: 0;
}
</style>
