<!-- 描述 -->
<template>
  <footer :class="$style.footer">
    <div>
      <div :class="$style.footNav">
        <div>
          <RouterLink
            :class="$style.a"
            :to="`/`"
          >
            首页
          </RouterLink>
        </div>

        <div>
          <RouterLink
            :class="$style.a"
            :to="`/about`"
          >
            关于我们
          </RouterLink>
        </div>

        <div>
          <RouterLink
            :class="$style.a"
            :to="`/law`"
          >
            法律声明
          </RouterLink>
        </div>

        <div>
          <RouterLink
            :class="$style.a"
            :to="`/terms`"
          >
            服务条款
          </RouterLink>
        </div>

        <div>
          <RouterLink
            :class="$style.a"
            :to="`/contact`"
          >
            联系方式
          </RouterLink>
        </div>
      </div>

      <div :class="$style.info">
        <div>地址：广州市天河区天阳路 132 号 1层</div>
        <div>©2020-2023  广州市信息安全测评中心 版权所有</div>
      </div>
    </div>
    <div>
      <div :class="$style.phoneInfo">
        <i class="i-dianhua" /> 服务电话
      </div>
      <div :class="$style.phone">
        {{ phone }}
      </div>
      <div :class="$style.phoneInfo">
        <i class="i-footer3" /> 1V1大客户服务
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const FOOT_NAV = [
  '关于我们',
  '法律声明',
  '服务条款',
  '联系方式',
]
const PHONE = '020-38905369'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  computed: {
    footNav() {
      return FOOT_NAV
    },
    phone() {
      return PHONE
    },
  },
}
</script>

<style lang="scss" module>
.footer {
  display: flex;
  justify-content: space-between;
  padding: $gapNormal * 2 $gapNormal * 10;
  background: $colorWhite;
  border-top: $borderBase;
}

.footNav {
  display: flex;

  > div {
    margin-right: 80px;
  }
}

.info {
  margin-top: $gapNormal * 2;
  font-size: $smaller;

  > div {
    margin: $gapNormal / 4 0;
  }
}

.phoneInfo {
  > i {
    margin-right: $gapNormal / 4;
  }
}

.phone {
  margin: $gapNormal / 2 0 $gapNormal / 2 $gapNormal;
  font-size: $xLarge;
}

.a {
  display: inline-block;
  color: $colorTextMain;
  font-weight: 600;
  text-decoration: none;
  vertical-align: middle;

  &:hover {
    color: $colorTheme;
  }
}
</style>
