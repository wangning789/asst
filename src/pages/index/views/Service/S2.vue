<!-- 2：应用层防火墙服务 -->
<template>
  <div :class="$style.wrapper">
    <!-- banner -->
    <section :class="$style.bannerBox">
      <!-- banner图 -->
      <img
        src="@index/assets/S2.png"
        alt="banner"
        :class="$style.commonImg"
      >

      <!-- banner图上的文字 -->
      <div :class="$style.textBox">
        <h1>应用层防火墙服务</h1>

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
            应用层防火墙服务采用“云防御服务(云WAF） +
            应用防护服务（主机WAF) +安全运营”三位一体的模式，
            从前到后对用户网站提供安全防护。 网站应用防护服务是一个服务集合。
            用户可以单独选择云防御系统或应用防护系统，或者两者一起选择，
            给网站一个最全面的防护。
          </p>
        </div>
        <!-- 右 -->
        <div :class="$style.rightBox">
          <p><img src="@index/assets/lingxing.png"> 云防御服务 </p>
          <p><img src="@index/assets/lingxing.png"> 应用防护服务 </p>
          <p><img src="@index/assets/lingxing.png"> 专业安全运营团队 </p>
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
              <i class="el-icon-circle-check" /> 实时安全防护
            </h3>
            <p :class="$style.text">
              实时检测和拦截 SQL 注入、XSS 跨站攻击、
              Web上传漏洞、网页木马、网页篡改、
              敏感信息泄露等攻击，支持端口安全防护、防护
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 拦截CC流量攻击
            </h3>
            <p :class="$style.text">
              支持智能识别 CC 攻击，能够快速识别出 CC 攻击并进行拦截，
              在大规模 CC 攻击时可以避免源站资源耗尽。同时，防护系统能够
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 攻击报告
            </h3>
            <p :class="$style.text">
              通过对各类攻击事件的采集分析生成攻击趋势图、攻击分布图等图表，
              直观展现各类攻击事件
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
          justify="space-between"
          :class="$style.cardBox"
        >
          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service2_1.png"
            >
            <h3 :class="$style.title">
              全托管
            </h3>
            <p :class="$style.text">
              安全专家负责安全运维，客户免去设备维护、策略维护、
              规则库升级等大量的运维工作，7×24小时全程为网站保驾护航
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service2_2.png"
            >
            <h3 :class="$style.title">
              实时应用自保护
            </h3>
            <p :class="$style.text">
              应用防护服务通过 RASP（实时应用自保护），
              实时检测和阻断安全攻击，使应用程序具备自我保护能力，
              当应用程序遇到特定漏洞和攻击时不需要人工干预就可以进行自动重新配置应对新的攻击
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service2_3.png"
            >
            <h3 :class="$style.title">
              专业安全运营团队
            </h3>
            <p :class="$style.text">
              设有独立的安全运营中心，从事网站应用防护服务。
              运营团队主要由网络信息安全专家组建，基于身后技术背景与丰富安全服务实践经验，
              为用户提供具备国内一流水平的安全运营服务，获得了专业的安全服务资质，同时拥有大量的安全运营经验
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
              <span :class="$style.indexTitle">实时安全防护</span>
            </div>
            <p :class="$style.marginBox">
              通过检测防护常见Web攻击、识别和拦截各种恶意变形攻击，从而降低用户网站风险，保障网站稳定运行
            </p>

            <!-- 02 -->
            <div>
              <span :class="$style.index">02</span>
              <span :class="$style.indexTitle">提升处置能力</span>
            </div>
            <p :class="$style.marginBox">
              网站应用防护服务使程序能够自我监控和识别有害的输入和行为，能实时检测和阻断安全攻击，对于特定漏洞和攻击进行自动应对， 提升客户安全处置能力
            </p>

            <!-- 03 -->
            <div>
              <span :class="$style.index">03</span>
              <span :class="$style.indexTitle">常态化安全运营</span>
            </div>
            <p style="padding-left: 48px; line-height: 30px;">
              在网站发生故障或遭到黑客攻击或入侵时，通过既定的应急响应流程，
              结合云防系统的安全防御、网站镜像等高级功能，即刻对故障网站或受攻击网站进行恢复和救援，
              并由专业安全运营团队提供人工安全保障服务，保障网站服务的可用性和连续性
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
