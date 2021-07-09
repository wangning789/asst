<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    示例文字
  </div>
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
/// 顺序: name/extends/mixins/components/directives/filters
@Component
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string)
  /// [props] (@Prop() readonly attr!: string)
  /// [data] (attr: string = '' // 除 undefined)
  /// 非响应式属性 (attr?: string // undefined)
  /// [computed] (get attr() {} set attr(){})
  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {})
  /// [methods] (method(){})
  /// [LifeCycle] (beforeCreate(){}/.../destroyed(){})
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
}
</style>
