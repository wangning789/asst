<!-- Process组件 -->
<template>
  <div :class="$style.wrapper">
    <div v-if="data && data.length">
      <div
        v-for="(item, i) of data"
        :key="i"
        :class="$style.bar"
      >
        <ElTooltip :content="item.name">
          <div :class="$style.name">
            {{ item.name }}
          </div>
        </ElTooltip>
        <!-- <ElTooltip :content="`${item.value}`">
          <div :class="$style.value">
            {{ item.value }}
          </div>
        </ElTooltip> -->
        <ElProgress
          :class="$style.progress"
          :format="format"
          :color="color"
          :text-inside="true"
          :stroke-width="strokeWidth"
          :percentage="getPercent(item.value)"
        />
      </div>
    </div>
    <Info
      v-else
      icon="el-icon-info"
      type="info"
      msg="empty"
      retry
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElProgress from 'element-ui/lib/progress'

import Info from '@com/Info'
import COLOR from '@/scss/export/color.scss'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: COLOR.theme3,
    },
    strokeWidth: {
      type: Number,
      required: false,
      default: 20,
    },
  },
  components: {
    ElProgress,
    Info,
  },
  data() {
    return {
      max: 1,
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(data?: any) {
        let valList
        data && data.length && (valList = data.map((item) => +item.value))
        this.max = valList ? Math.max(...valList) : 1
      },
    },
  },
  methods: {
    getPercent(val: number) {
      return Math.floor(val / this.max * 100)
    },
    format(percent: number) {
      return `${Math.ceil(percent / 100 * this.max)}次`
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/progress';
</style>

<style lang="scss" module>
// .wrapper {
//   padding: $gapNormal;
// }

.bar {
  display: flex;
  margin: $gapNormal / 4 0;
}

.name,
.value {
  width: $gapNormal * 4;
  min-width: $gapNormal * 4;
  margin-right: $gapNormal / 2;
}

.value {
  font-weight: bold;
}

.progress {
  flex: 1;
}
</style>
