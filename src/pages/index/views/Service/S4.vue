<!-- 4：虚拟防火墙服务 -->
<template>
  <div :class="$style.wrapper">
    <!-- banner -->
    <section :class="$style.bannerBox">
      <!-- banner图 -->
      <img
        src="@index/assets/S4.png"
        alt="banner"
        :class="$style.commonImg"
      >

      <!-- banner图上的文字 -->
      <div :class="$style.textBox">
        <h1>虚拟防火墙服务</h1>

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
            虚拟防火墙服务将帮助用户理清企业内外网络的边界，针对用户的网络环境，部署防火墙设备，
            并对网络安全边界进行运维，实时保护用户的内部网络边界安全。
          </p>
        </div>
        <!-- 右 -->
        <div :class="$style.rightBox">
          <p><img src="@index/assets/lingxing.png"> 虚拟防火墙服务 </p>
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
              <i class="el-icon-circle-check" /> 出口网络建设
            </h3>
            <p :class="$style.text">
              一体化安全引擎实现对外部病毒、攻击、恶意站点等进行一体化防护，双引擎模式以及多核并行架构实现保障出口网络的稳定性及高可用性。云端安全管理提高工作效率，減少运维成本。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 上网行为管控
            </h3>
            <p :class="$style.text">
              内网资产风险管理及时发现内网薄弱环节，配合访问控制策略，实现全面管控。应用带宽管理、URL过滤、内容过滤等策略实现用户上网行为管理。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 网络隔离
            </h3>
            <p :class="$style.text">
              严格的访问控制策略保障可信网络内部信息不外泄的前提下，完成网间数据的安全交换。身份认证系统可以有效防止假冒、窃听、破坏完整性、抵赖等
            </p>
          </ElCol>
        </ElRow>
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
              <i class="el-icon-circle-check" /> VPN互联
            </h3>
            <p :class="$style.text">
              细粒度的用户接入以及应用安全控制策略，实现外部用户和机构合法接入总部。通过对接入总部的VPN进行隧道内扫描，保障外部用户和机构能够安全的接入总部
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
              src="@index/assets/service/service4_1.png"
            >
            <h3 :class="$style.title">
              按需配置
            </h3>
            <p :class="$style.text">
              虚拟防火墙配置灵活，用户可随时根据业务增减相应的虚拟防 火墙。管理1400+应用、近2400+动作、4600+入侵防护特征。
              云端安全管理提高工作效率，减少运维成本。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :offset="1"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service4_2.png"
            >
            <h3 :class="$style.title">
              完全隔离
            </h3>
            <p :class="$style.text">
              通过虚拟防火墙实现精细化的隔离，通过业务分区、角色分组 将原来为了防止业务出现中断而不得不开放的端口进行更精细
              的管理，缩小受攻击面，降低安全隐患。
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
          style="height: 500px;"
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
              <span :class="$style.indexTitle">洞察网络应用，提供全面防护</span>
            </div>
            <p :class="$style.marginBox">
              全面识别网络应用中的流量、用户、会话、内容等信息，并且通过实时数据与日志报表的方式帮助用户在复杂的网络应用中识别安全
              风险。
              通过一体化的安全引擎和安全策略实现安全功能在应用防护及策略配置方面的全面融合，从而有效阻止病毒、恶意软件、信息泄漏等
              新型安全威胁。
              业内独有的数通引擎、一体化安全引擎双引擎模式，既可以在高转发性能的基础上实现开启多种安全模块性能不出现明显下降，又能
              在应用安全功能失效或故障的情况下实现基础网络层转发不中断，从而保证用户可以放心使用安全功能。
            </p>

            <!-- 02 -->
            <div>
              <span :class="$style.index">02</span>
              <span :class="$style.indexTitle">内网风险预警，安全防患未然</span>
            </div>
            <p :class="$style.marginBox">
              全面掌控当前网络资产健康及风险状况，专家级健康改善及安全防护方案指导，专业级资产健康评分及分析系统。对无线热点行进管
              理，可以发现非法无线热点并阻断。
            </p>

            <!-- 03 -->
            <div>
              <span :class="$style.index">03</span>
              <span :class="$style.indexTitle">云端高效运维，安全尽在掌握</span>
            </div>
            <p style="padding-left: 48px; line-height: 30px;">
              与云端服务对接，可提供云端SaaS式的日志管理功能。安全日志将脱离本机和本地日志服务器的约束，在云端得到良好的存储和分析
              ，最终通过互联网以专业图表的形式呈现。用户可以随时随地，7*24
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
    width: 53px;
    height: 47px;
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
  height: 565px;
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
