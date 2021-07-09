<!-- eslint-disable -->
<!-- 联系方式 -->
<template>
  <body>
    <IHeader />

    <div :class="$style.imgBox">
      <img
      width="100%"
      style="height: 250px;"
      src="@index/assets/contact.png">

      <div :class="$style.title">
        <h1>联系方式</h1>
        <p>Contact information</p>
      </div>
    </div>

    <section :class="$style.content">
      <el-row type="flex" justify="space-between" align="middle" :class="$style.text">
        <div>
          <p>联系电话</p>
          <h2>020-38905369</h2>
          <p style="margin-top: 60px;">联系地址</p>
          <h3>广州市天河区天阳路 132 号 1 层</h3>
        </div>
        <div :class="$style.border">
          <img src="@index/assets/map.png" width="100%">
        </div>
      </el-row>
    </section>
    <IFooter />
  </body>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IHeader from '@indexCom/Header'
import IFooter from '@indexCom/Footer'

/** emit: 事件说明 */
export default {
  components: { IHeader, IFooter },
}
</script>

<style lang="scss" module>

.imgBox {
  height: 250px;

  .title {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    width: 181px;
    margin: auto;
    color: $colorWhite;
    text-align: center;
    transform: translateY(-180px);

    h1 {
      font-weight: 400;
      font-size: 36px;
    }
  }
}

.content {
  background-color: $colorWhite;

  .text {
    padding: $gapNormal 330px;
    color: $colorTextMain;
    background-color: $colorWhite;

    p {
      color: $colorTextMinor;
      font-size: 20px;
    }

    h2 {
      color: $colorTextMain;
      font-weight: 400;
      font-size: 40px;
    }

    .border {
      font-size: 0;
      border: $borderDashed;
    }
  }
}
</style>
