<!--
 * @Description: 布局
 * @Author: 毛瑞
 * @Date: 2020-05-18 15:50:46
 -->
<template>
  <body>
    <ElContainer style="height: 100vh;">
      <IHead
        :home="home"
        :class="$style.head"
      />
      <ElContainer
        style="margin-top: 50px;"
        class="elContainer"
      >
        <ElAside
          width="200"
          :class="$style.aside"
        >
          <ISideBar
            :home="home"
            :class="$style.aside"
            @setNavList="setNavList"
          />
        </ElAside>
        <ElMain :class="$style.elMain">
          <ElBreadcrumb
            v-show="navList&&navList.length"
            separator="/"
            :class="$style.bread"
          >
            <ElBreadcrumbItem
              v-for="(item, index) in navList"
              :key="index"
            >
              {{ item.title }}
            </ElBreadcrumbItem>
          </ElBreadcrumb>

          <!-- <ElLink
          v-show="$route.meta.parent"
          icon="i-fanhui"
          :underline="false"
          :class="$style.up"
          @click="up()"
        >
          返回
        </ElLink> -->

          <Transition
            appear
            name="fade"
            mode="out-in"
          >
            <KeepAlive
              :max="CONF.page > 1 ? CONF.page : 1"
              :exclude="$router.$.e"
            >
              <RouterView
                :key="$route.meta.id"
                :class="$style.main"
              />
            </KeepAlive>
          </Transition>

          <ElBacktop
            :right="20"
            :bottom="20"
          >
            <i class="el-icon-top" />
          </ElBacktop>
        </ElMain>
      </ElContainer>
    </ElContainer>
  </body>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElBacktop from 'element-ui/lib/backtop'
import IHead from '@com/Header'

import ISideBar from '@com/SideBar'

import CONFIG, { SPA } from '@/config'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { home: { type: String, default: SPA.home } },
  components: { ElBacktop, IHead, ISideBar },
  data() {
    return {
      navList: [], // 面包屑导航
    }
  },
  computed: {
    CONF: () => CONFIG,
  },
  methods: {
    setNavList(menus: any) {
      this.navList = menus
    },
  },

  mounted() {
    // console.log(this.$route, this.$router)
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/backtop';
</style>

<style lang="scss" module>
.wrapper {
  min-width: $lg !important;
  // padding: $gapTop $gapRight $gapBottom $gapLeft;
}

.head {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $zFixed;
}

.up {
  width: 45px;
  margin-bottom: $gapNormal / 2;
}

.elMain {
  min-width: 1080px;
  padding: 0 !important;
}

.bread {
  height: 30px;
  padding-left: $gapNormal;
  line-height: 30px !important;
  background: #fff;
}

.main {
  box-sizing: border-box;
  margin: $gapNormal !important;
  padding: $gapNormal;

  &:global(.el-card) {
    min-height: 745px;
  }
}

.aside {
  width: $widthSideBar;
  background: #364352;
}

.aside :global(.el-submenu__title:focus) {
  background-color: #364352;
}
</style>
