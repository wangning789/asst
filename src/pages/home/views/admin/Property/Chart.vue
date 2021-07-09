<!-- 描述 -->
<template>
  <ElRow
    :span="10"
    :class="'el-card ' + $style.wrapper"
  >
    <ElCol :span="8">
      <div :class="$style.content">
        <div
          ref="first"
          style="height: 300px;"
        />
      </div>
    </ElCol>
    <ElCol :span="8">
      <div :class="$style.content">
        <h4>
          漏洞数TOP5服务器
        </h4>
        <IProcess
          :data="leaks"
        />
      </div>
    </ElCol>
    <ElCol :span="8">
      <div :class="$style.content">
        <h4>
          被攻击次数（告警次数）TOP5服务器
        </h4>
        <IProcess
          :data="warnings"
        />
      </div>
    </ElCol>
  </ElRow>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { stat, leak, warning } from '@/api/servicePlatform/serverAssets'
import IProcess from './Process'

/// 常量(UPPER_CASE),单例/变量(camelCase), 函数(无副作用,camelCase)
import echarts from '@/libs/echarts'

import 'echarts/lib/chart/pie' // 饼图
import 'echarts/lib/component/grid' // 直角坐标系
import 'echarts/lib/component/legend' // 图例 (legendScroll 可滚动的图例)
import 'echarts/lib/component/tooltip' // 提示

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    // route: { type: Object, required: true },
    // /** 图标 */
    // icon: { type: String, default: 'i-jujue' },
    // /** 图标颜色 */
    // type: { type: String, default: 'danger' },
    // /** 文字 MSG[msg] || msg */
    // msg: { type: String, default: 'fail' },
    // /** 重试消息 触发$事件(父组件监听以刷新) */
    // retry: { type: null as any, default: 'retry' },
  },
  components: { IProcess },
  data() {
    return {
      dataF: [],
      leaks: [],
      warnings: [],
    }
  },
  mounted() {
    // 获取饼图数据  #7DD8BF    #69A7F8
    stat(this.userId).then(res => {
      this.dataF = res.data.body.map(item => ({
        name: item.name,
        value: item.value,
      }))

      echarts.init(this.$refs.first).setOption({
        tooltip: {
          trigger: 'item',
          formatter: '<br/>{b} : {c} ({d}%)',
        },
        title: {
          show: this.dataF === null,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.dataF,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
        color: ['#7DD8BF', '#69A7F8'],
      })
    })

    //  通过用户id漏洞数TOP5服务器
    leak().then(res => {
      this.leaks = res?.data?.body?.data
    })

    //  通过用户id漏漏洞数TOP5服务器
    warning().then(res => {
      this.warnings = res?.data?.body?.data
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.wrapper {
  margin: $gapNormal 0;
}

.content {
  padding: $gapNormal;
}
</style>
