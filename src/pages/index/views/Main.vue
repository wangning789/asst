<!--
 * @Description: 布局
 * @Author: 毛瑞
 * @Date: 2020-05-18 15:50:46
 -->
<template>
  <body style="overflow-x: hidden;">
    <IHeader />

    <section>
      <img
        src="@index/assets/banner.png"
        alt="banner"
        :class="$style.commonImg"
      >
    </section>

    <section :class="[$style.section, $style.white]">
      <ITitle :title="{zh: '新闻公告', en: 'NEWS ANNOUNCEMENT'}" />
      <div :class="$style.newDiv">
        <ElCarousel :class="$style.imag">
          <ElCarouselItem
            v-for="item in dataAll"
            :key="item.src"
          >
            <img :src="item.src">
          </ElCarouselItem>
        </ElCarousel>

        <IChooser
          key="noticeOpenList"
          :fetch="noticeOpenList"
          :args="[query]"
        >
          <template #success="{ data: { data: { body: { data } } } }">
            <div
              v-for="tr in data"
              :key="tr.url"
              :class="$style.text"
            >
              <!-- <ElTooltip
                :content="tr.title"
                placement="top-start"
              > -->
              <RouterLink
                :class="$style.a"
                :to="`${$route.fullPath}/${tr.id}/notice`"
                append
              >
                {{ tr.title }}
              </RouterLink>
              <!-- </ElTooltip> -->
              <span :class="$style.span">{{ tr.takeEffectTime }}<i class="i-jiantoua" /></span>
            </div>
          </template>
        </IChooser>
      </div>
    </section>

    <section :class="[$style.section, $style.gray]">
      <ITitle :title="{zh: '云安全服务产品', en: 'SERVICE PRODUCT'}" />
      <!-- 服务产品 -->
      <div :class="$style.service">
        <!-- 上方三个 -->
        <div :class="$style.sWrapper">
          <RouterLink
            :class="$style.card"
            :to="`${$route.fullPath}${1}/service`"
            append
          >
            <div :class="$style.line" />
            <img src="@index/assets/service/service1.png">
            <h1>主机防病毒服务</h1>
          </RouterLink>

          <RouterLink
            :class="$style.card"
            :to="`${$route.fullPath}${2}/service`"
            append
          >
            <div :class="$style.line" />
            <img src="@index/assets/service/service2.png">
            <h1>应用层防火墙服务</h1>
          </RouterLink>

          <RouterLink
            :class="$style.card"
            :to="`${$route.fullPath}${3}/service`"
            append
          >
            <div :class="$style.line" />
            <img src="@index/assets/service/service3.png">
            <h1>Web防篡改服务</h1>
          </RouterLink>
        </div>
        <!-- 下方两个 -->
        <div :class="$style.sWrapper">
          <RouterLink
            :class="$style.card"
            :to="`${$route.fullPath}${4}/service`"
            append
          >
            <div :class="$style.line" />
            <img src="@index/assets/service/service4.png">
            <h1>虚拟防火墙服务</h1>
          </RouterLink>

          <RouterLink
            :class="$style.card"
            :to="`${$route.fullPath}${5}/service`"
            append
          >
            <div :class="$style.line" />
            <img src="@index/assets/service/service5.png">
            <h1>主机漏洞检测服务</h1>
          </RouterLink>
        </div>
      </div>
    </section>

    <section>
      <img
        src="@index/assets/des.png"
        alt="product"
        :class="$style.commonImg"
      >
    </section>

    <IFooter />

    <div :class="$style.dg">
      <ElTooltip
        effect="light"
        placement="left"
        popper-class="index_common_tool_tip_class"
      >
        <template #content>
          <div :class="$style.boder">
            联系方式
          </div>
          <br>
          <span style="font-size: 15px;">
            <i :class="['i-dianhua',$style.isize]" /> {{ phone }}
          </span>
          <br>
        </template>
        <i :class="['i-kefu',$style.size]" />
      </ElTooltip>
    </div>
  </body>
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

import ElCarousel from 'element-ui/lib/carousel'
import ElCarouselItem from 'element-ui/lib/carousel-item'
import IChooser from '@com/ChooserAsyncFunctional'
import IHeader from '@indexCom/Header'
import ITitle from '@indexCom/Title'
import IFooter from '@indexCom/Footer'

import { noticeOpenList } from '@/api/servicePlatform/notice'

import p1 from '@index/assets/p1.png'
import p2 from '@index/assets/p2.png'
import p3 from '@index/assets/p3.png'
import p4 from '@index/assets/p4.png'
import p5 from '@index/assets/p5.png'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@com/hoc'
// import STYLE from './index.module.scss'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
const PHONE = '020-38905369'

/// 选项 name,components,directives,filters,extends,mixins ///
@Component({
  components: {
    ElCarousel,
    ElCarouselItem,
    IChooser,
    IHeader,
    ITitle,
    IFooter,
  } as any,
})
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  noticeOpenList = noticeOpenList
  query = {
    page: 1,
    pageSize: 5,
    pageType: 0, // 0为最新公告，1 为最热公告
  }

  /// 非响应式属性 (attr?: string // undefined) ///
  /// [computed] (get attr() {} set attr(){}) ///
  get phone() {
    return PHONE
  }

  private get dataAll() {
    return [
      { src: p1 },
      { src: p2 },
      { src: p3 },
      { src: p4 },
      { src: p5 },
    ]
  }

  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/carousel';
@import '~element-ui/packages/theme-chalk/src/carousel-item';

.el-tooltip__popper.index_common_tool_tip_class {
  border: 1px solid $colorBorderLv1;

  .popper__arrow {
    border-left-color: $colorBorderLv1 !important;
  }
}
</style>

<style lang="scss" module>
.dg {
  position: fixed;
  top: 50%;
  right: 0;
}

.size {
  display: block;
  padding: 8px;
  color: $colorWhite;
  font-size: 30px;
  background: $colorTheme;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: $colorTheme2;
  }
}

.isize {
  padding: 10px;
  color: $colorTheme;
  font-size: $xLarge;
}

.boder {
  padding: 10px;
  font-size: $medium;
  border-bottom: $borderBase;
}

.section {
  padding: $gapNormal * 2 0;
}

.white {
  background: $colorWhite;
}

.gray {
  background: #f7f7fb;
}

.commonImg {
  display: block;
  width: 100%;
}

.newDiv {

  @include clear();

  padding: $gapNormal * 2 0 0 0;
  background-color: $colorWhite;
}

.imag {
  float: left;
  box-sizing: border-box;
  width: calc(45% - 180px);
  height: 300px;
  margin-right: 60px;
  margin-left: 120px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.text {
  float: left;
  box-sizing: border-box;
  width: calc(55% - #{$gapNormal});
  margin-right: $gapNormal;
  padding-bottom: $gapNormal;
  border-bottom: $borderBase;
}

.text + .text {
  padding: $gapNormal 0;
}

.a {

  @extend %ellipsis;

  display: inline-block;
  width: calc(100% - 180px);
  color: $colorTextMain;
  font-size: $large;
  text-decoration: none;
  vertical-align: middle;

  &:hover {
    color: $colorTheme;
  }
}

.span {
  float: right;

  > i {
    margin-left: $gapNormal;
    vertical-align: bottom;
  }
}

.service {
  // padding: 70px 240px 48px;

  .sWrapper {
    display: flex;
    justify-content: center;
    padding: $gapNormal 0;
  }

  .card {
    display: inline-block;
    width: 350px;
    height: 200px;
    margin: 0 $gapNormal;
    text-align: center;
    text-decoration: none;
    background-color: $colorWhite;

    &:hover {
      box-shadow: 0 0 10px 2px $colorTheme5;
      cursor: pointer;
      transition: all 0.3s;

      /* 盒子阴影 */

      /* 持续时间 */
    }

    .line {
      margin-bottom: 30px;
      border: 2px solid $colorTheme;
    }

    h1 {
      padding-top: 20px;
      color: $colorTextMain;
      font-size: 22px;
    }
  }
}
</style>
