<!-- eslint-disable -->
<!-- 关于我们 -->
<template>
  <body>
    <IHeader />
    <div :class="$style.imgBox">
      <img
      width="100%"
      style="height: 250px;"
      src="@index/assets/about.png">

      <div :class="$style.title">
        <h1>关于我们</h1>
        <p>About us</p>
      </div>
    </div>


    <section :class="$style.content">
      <div :class="$style.text">
        <p style="margin-bottom: 40px;">
          广州市信息安全测评中心(以下简称“中心”)成立于2009年，是广州市科技和信息化局与广州市国家保密局共同成立的正处级事业单位，加挂国家保密科技测评中心广州市分中心、广州市网络与信息安全监控和应急支持中心和广州市电子签名中心的牌子。中心致力于信息安全技术和保密技术研究和服务领域，承担保护国家的网络空间安全和保密安全的神圣职责，主要负责广州市网络与信息安全的检查、测评和（保密）测评；广州市网络与信息安全事件监控、预警和应急处置协调以及容灾备份；广州市数字集群共网的规划、运行维护、管理和推广；广州市电子签名应用推进、技术支持和协调管理以及广州市信息安全培训、认证和咨询服务等工作。
        </p>
        <p>
          中心现有员工60余人，拥有一支包括多名高级工程师、博士、硕士在内的高素质信息安全专业技术队伍；拥有完善的质量管理体系，通过中国合格评定国家认可委员会（CNAS）认可和CMA认证。中心现处于业务快速发展期，诚邀致力于信息安全技术事业的您加入到我们的队伍来，与我们并肩携手，为国家信息安全和保密安全贡献自己的力量！
        </p>
      </div>
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
    height: 400px;
    padding: $gapNormal 330px;
    color: $colorTextMain;
    background-color: $colorWhite;

    p {
      line-height: 30px;
      // text-indent: 28px;
    }
  }
}
</style>
