<!-- 1：主机防病毒服务 -->
<template>
  <div :class="$style.wrapper">
    <!-- banner -->
    <section :class="$style.bannerBox">
      <!-- banner图 -->
      <img
        src="@index/assets/S1.png"
        alt="banner"
        :class="$style.commonImg"
      >

      <!-- banner图上的文字 -->
      <div :class="$style.textBox">
        <h1>主机防病毒服务</h1>

        <p>三位一体模式从前到后对用户网站提供安全防护，给网站全面的防护</p>

        <!-- 购买按钮 -->
        <!-- <div :class="$style.btnBox">
          <ElButton type="primary">
            立即购买
          </ElButton>
          <ElButton :class="$style.add">
            加入购物车
          </ElButton>
        </div> -->
      </div>
    </section>

    <!-- 产品简介 -->
    <section :class="$style.introduction">
      <div :class="$style.introductionContent">
        <!-- 左 -->
        <div :class="$style.leftBox">
          <h3>
            <i class="el-icon-collection" />
            产品简介
          </h3>
          <p>
            主机防病毒服务以私有云查杀技术为基石，以黑白双控检测为机制，以可信应用控制和主机安全 策略为主线，
            以静态鉴定、程序动态安全分析为手段，以多维度多机制终端安全防护为目的，实现对APT高级攻击、勒索软件攻击的全面防护，实现对终端的有效防护。
          </p>
        </div>
        <!-- 右 -->
        <div :class="$style.rightBox">
          <p><img src="@index/assets/lingxing.png"> 主机防病毒 </p>
        </div>
      </div>
    </section>

    <!-- 服务内容 -->
    <section :class="$style.detail">
      <div :class="$style.detailContent">
        <ITitle :title="{zh: '服务内容', en: 'Service Content'}" />
        <ElRow
          type="flex"
          justify="space-between"
          :class="$style.cardBox"
        >
          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 主机防病毒
            </h3>
            <p :class="$style.text">
              主机防病毒服务主要是安装在Windows、Linux或国产操作系统的终端/服务器/虚拟化终端/专用终端上，为各类终端提供病毒扫描、系统监控、边界防御等防护手段。
            </p>
          </ElCol>
        </ElRow>
      </div>
    </section>

    <!-- 服务优势 -->
    <section :class="$style.advantage">
      <div :class="$style.advantageContent">
        <ITitle :title="{zh: '服务优势', en: 'Service Advantage'}" />
        <ElRow
          type="flex"
          :class="$style.cardBox"
        >
          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service1_1.png"
            >
            <h3 :class="$style.title">
              高效的杀毒引擎
            </h3>
            <p :class="$style.text">
              主机防病毒服务的杀毒引擎通过多引擎、多维度检测分析，快 速高效查杀已知病毒、已知病毒变种以及未知病毒的同时，
              深 度揭示文件静态向量，辅助人工判定。在互联网环境下，支持 私有云查杀和公有云查杀。在没有网络不依赖云端病毒特征库 情况下，仍可强力查杀已知及未知病毒，有效拦截访问恶意网
              页。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :offset="1"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service1_2.png"
            >
            <h3 :class="$style.title">
              多维的勒索防护
            </h3>
            <p :class="$style.text">
              主机防病毒服务基于强大的分析团队、产品研发团队和多年来 对勒索软件的分析研究，在内置的病毒库中包括了大量的已知 勒索软件的病毒特征库，同时采用了国际领先的防勒索机制，
              开发了不依赖特征码的勒索行为动态监控功能，及时阻止未知 勒索软件的勒索行为；并开发了文档保护功能，为用户的文档 提供多维度纵深防护，形成了边界防护+主动防御+文档安全的
              多维勒索防护架构，在不更新病毒库的情况下，能有效防御勒
              索软件的勒索行为。
            </p>
          </ElCol>
        </ElRow>
      </div>
    </section>

    <!-- 客户价值 -->
    <section :class="$style.client">
      <div :class="$style.clientContent">
        <ElRow
          type="flex"
          align="middle"
          justify="space-between"
          style="height: 400px;"
        >
          <ElCol :span="5">
            <h1 :class="$style.title">
              客户价值
            </h1>
            <p :class="$style.title2">
              VALUE OF CUSTOMER
            </p>
          </ElCol>
          <ElCol
            :span="16"
            :class="$style.rightBox"
          >
            <!-- 01 -->
            <div>
              <span :class="$style.index">01</span>
              <span :class="$style.indexTitle">病毒或恶意代码事件防护</span>
            </div>
            <p :class="$style.marginBox">
              通过该服务可帮助用户提升恶意代码查杀预警和查杀能力，避免数据泄露和其它网络攻击事件发生；掌握检测和消除方法，及时查收
              ，应对有害程序事件临危不乱。
            </p>

            <!-- 02 -->
            <div>
              <span :class="$style.index">02</span>
              <span :class="$style.indexTitle">APT攻击追溯</span>
            </div>
            <p :class="$style.marginBox">
              反病毒系统内置已知高级威胁特征库（定期升级），用户可对已知高级威胁进行网内追溯，查看网内是否存在高级威胁安全问题。当
              有新的高级威胁事件爆发时，用户可在升级系统后，通过高级威胁全网追溯检查自身网内是否存在事件相关威胁。
            </p>
          </ElCol>
        </ElRow>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITitle from '@indexCom/Title'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ITitle },
}
</script>

<style lang="scss" module>

.bannerBox {
  position: relative;
  height: 500px;

  .commonImg {
    display: block;
    width: 100%;
    height: 500px;
  }

  .textBox {
    position: absolute;
    top: 100px;
    left: 240px;
    width: 660px;
    color: $colorWhite;
    text-align: left;

    h1 {
      padding-top: 50px;
      font-size: 56px;
      letter-spacing: 8px;
    }

    p {
      margin-bottom: 50px;
      font-size: 20px;
      letter-spacing: 2px;
    }
  }
}

.btnBox :global(.el-button) {
  width: 177px;
  height: 60px;
  margin-right: $gapNormal;
  font-size: 24px;
  // line-height: 66px;
}

.add {
  color: $colorWhite;
  background-color: $colorTransparent;
}

//产品简介
.introduction {
  width: 100%;
  text-align: left;
  background-color: $colorWhite;
}

.introductionContent {
  display: flex;
  align-content: center;
  align-items: center;
  padding: $gapNormal*2 240px;

  .leftBox {
    width: 700px;
    margin-right: 100px;

    h3 {
      font-weight: normal;
      font-size: 24px;
      letter-spacing: 3px;
    }

    p {
      line-height: 30px;
      letter-spacing: 3px;
    }
  }

  .rightBox {
    padding-left: $gapNormal*2;
    border-left: $borderBase;

    p {
      width: 180px;
      font-size: 18px;
      line-height: 30px;
    }
  }
}

//服务内容
.detail {
  width: 100%;
  text-align: left;
  background-color: #f8f9fa;
}

.detailContent {
  padding: $gapNormal*2 240px;

  .cardBox {
    margin-top: 50px;
  }
}

.detailCard {
  // width: 400px;

  .title {
    color: $colorTextMain;
    font-weight: 400;
    font-size: 22px;
    letter-spacing: 4px;

    i {
      color: #6a7384;
      font-size: 28px;
    }
  }

  .text {
    padding-left: 42px;
    line-height: 30px;
    letter-spacing: 2px;
  }
}

//服务优势
.advantage {
  width: 100%;
  text-align: left;
  background-color: $colorWhite;
}

.advantageContent {
  padding: $gapNormal*2 240px;

  .cardBox {
    margin-top: 50px;
  }
}

.advantageCard {
  // width: 400px;
  img {
    display: block;
    margin: auto;
  }

  .title {
    color: $colorTextMain;
    font-weight: 400;
    font-size: 22px;
    letter-spacing: 4px;
    text-align: center;
  }

  .text {
    line-height: 30px;
    letter-spacing: 2px;
  }
}

//客户价值
.client {
  width: 100%;
  height: 500px;
  background: url('../../assets/service/bottom.png') no-repeat;
}

.clientContent {
  padding: $gapNormal*2 280px;

  .title {
    color: $colorTextMain;
    font-weight: 400;
    font-size: 32px;
  }

  .title2 {
    color: $colorTextMinor;
    font-weight: 400;
    font-size: 18px;
  }

  .rightBox {
    .index {
      margin-right: 20px;
      color: $colorTextMinor;
      font-size: 24px;
    }

    .indexTitle {
      color: $colorTextMain;
      font-weight: 400;
      font-size: 22px;
    }

    .marginBox {
      margin: 10px 0 $gapNormal*2 $gapNormal*2;
      line-height: 30px;
    }
  }
}

</style>
