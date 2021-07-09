<!-- 导航视图 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'
import INav from './Nav'
import getShortcuts from './shortcuts'
import me from '@/store/user'

import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  // 根据用户list跳转页面
  created() {
    me &&
    me?.roleList &&
    me?.roleList[0]?.defaultPage &&
    this.$router.push(me?.roleList[0]?.defaultPage)
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const STYLE = this.$style
    return (
      <el-row gutter={+LAYOUT.gap} class={STYLE.wrapper}>
        {/* 导航 */}
        <el-col span={17} sm={15} xs={13} class="el-card">
          <transition appear name="fade" mode="out-in">
            <INav />
          </transition>
        </el-col>
        {/* 快捷信息 */}
        <el-col span={7} sm={9} xs={11}>
          {getShortcuts().map((Comp: any, index) => (
            <Comp
              key={index}
              route={this.route}
              class={STYLE.module + ' el-card ' + (index ? STYLE.mt : '')}
            />
          ))}
        </el-col>
      </el-row>
    )
  },
}
</script>

<style lang="scss" module>
.wrapper {
  padding: 0 !important;

  > :global(.el-col) {
    height: calc(100vh - #{$gapTop + $gapBottom});
    overflow: auto;

    &:first-of-type {
      background-image: url(~@home/assets/home_bg.png);
      background-repeat: no-repeat;
      background-position: 95% 95%;
    }
  }
}

.module {
  box-sizing: border-box;
  min-height: 150px;
  max-height: 450px;
  padding: $gapNormal;
  overflow-y: auto;
}

.mt {
  margin-top: $gapNormal;
}
</style>
