<!-- 5：主机漏洞检测服务 -->
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
        <h1>主机漏洞检测服务</h1>

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
            漏洞检测是指基于漏洞数据库，通过扫描等手段对指定的远程或本地主机的安全脆弱性进行检测 ，发现自身安全漏洞的安全检测行为。
            主机漏洞检测服务采用先进的漏洞检测工具，专业人员将 根据网络拓扑情况、IT资产分布对用户信息系统进行全方位、立体化的漏洞检测，使用户清晰掌
            握自身系统中存在的问题。
          </p>
        </div>
        <!-- 右 -->
        <div :class="$style.rightBox">
          <p><img src="@index/assets/lingxing.png"> 主机漏洞检测服务 </p>
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
              <i class="el-icon-circle-check" /> 系统漏洞扫描
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务具备丰富的系统漏洞扫描插件，可对上一节服务范围内所有类别的网络对象进行漏洞扫描，采用国际通用 CVSS漏洞
              评分系统，兼容CVE
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 口令猜测
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务可检测出系统中存在的弱口令，弱口令通常指容易被别人猜测或被破解工具破解的口令，比如“123456”等，是很
              多安全事件的罪魁祸首，主机漏洞检测服务支持用用户名字典、密码字典、用户名/密码组合字典、外挂密码字典的方法找出用户系统
              中的弱口令。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 系统配置风险管理
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务可检测出用户系统配置中存在的风险，如允许远程访问注册表、远程访问不进行数据加密等。
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
              <i class="el-icon-circle-check" /> 系统安全配置核查
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务可在不修改系统配置，不影响系统工作的情况下对系统配置项目进行检查和管理。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> Web应用漏洞扫描
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务可对Web网站和Web应用进行漏洞扫描，可识别十种以上Web语言，多种网站中间件、网站类型和第三方组件。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.detailCard"
          >
            <h3 :class="$style.title">
              <i class="el-icon-circle-check" /> 新技术领域漏洞扫描
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务支持云计算、大数据、物联网等新技术领域的安全漏洞扫描，覆盖这些领域的主流平台、组件或设备。
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
            <h3
              :class="$style.title"
              style="width: 400px;"
            >
              <i class="el-icon-circle-check" /> 容器镜像漏洞扫描及配置核查
            </h3>
            <p :class="$style.text">
              主机漏洞检测服务支持对容器镜像进行漏洞扫描及配置核查，解决镜像对外发布前的自动化安全评估问题和镜像以及镜像漏洞的管理
              问题，为用户减少工作量、降低成本、提升效率，使系统运维自动化，智能化。
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
              src="@index/assets/service/service5_1.png"
            >
            <h3 :class="$style.title">
              漏洞知识丰富
            </h3>
            <p :class="$style.text">
              对于任何一款漏洞扫描工具或一项漏洞检测服务来说，漏洞信息的数量和质量永远是最重要的指标。主机漏洞检测服务在漏洞信息数 量和质量方面首屈一指。
              主机漏洞检测服务的知识库中的漏洞信息数量高达16万条。涵盖所有主流基础系统、应用系统、网络设备等
              网元对象。此外，主机漏洞检测服务配备专业的安全研究团队进行漏洞跟踪和漏洞前瞻性研究，以保证漏洞知识库的时效性。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service1_1.png"
            >
            <h3 :class="$style.title">
              部署方式灵活
            </h3>
            <p :class="$style.text">
              和那些只能检测单一网元对象的扫描工具相比，拥有丰富漏洞信息的主机漏洞检测服务可以实现更为灵活的部署方式，以满足复杂的
              网络环境需要。主机漏洞检测服务支持单机单网络、单机多网络、分布式部署、
              扫描代理等多种接入方式，灵活适应各种网络拓扑环 境，便于扩展。当用户的网络环境适合多种部署方案时，将优先采用轻量级的部署方式，
              最大程度降低安全建设成本。另外，考虑到 虚拟化和IPv6网络的逐步应用，远程安全评估系统也支持通过虚拟化镜像方式在虚拟化环境下直接部署，支持IPv6 网络环境下的部署
              和漏洞扫描。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service5_3.png"
            >
            <h3 :class="$style.title">
              系统融合深入
            </h3>
            <p :class="$style.text">
              服务致力于保护用户的IT资产并为用户的信息系统打造一个安全的环境，主机漏洞检测服务将通过和用户信息系统的深入融合来完成
              上述使命。
              首先，主机漏洞检测服务和用户的IT资产深入融合。通过服务流程可以看到，当用户申请我们的服务后，首先尽量收集IT系统环境信息
              ，建立起IT资产关系列表，然后才会使用漏洞工具对其进行扫描，分析结果也将以仪表板的方式展示，从风险发生区域、类型、严重
              程度进行不同维度的分类分析报告，用户可以全局掌握安全风险，关注重点区域、重点资产，对严重问题优先修补。
              其次，主机漏洞检测服务和用户的安全管理深度融合。大量的安全事件证明安全管理对用户的信息系统安全起到的作用不亚于安全技 术。
              主机漏洞检测服务可以融入用户公司的安全管理流程，并促进流程的执行。安全管理流程制度一般包括预警、检测、分析管理、 修补、审计等几个环节，
              主机漏洞检测服务能够参与安全流程中的预警、检测、分析管理、审计环节，并通过事件告警督促安全管理
              人员进行风险修补。
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
              <span :class="$style.indexTitle">漏洞检测</span>
            </div>
            <p :class="$style.marginBox">
              主机漏洞检测服务为客户带来的最大价值就是帮助客户发现了自身信息系统存在的问题，而发现问题往往是解决问题的第一步，安全漏洞
              的发现也是避免IT资产流失的第一步。此外，主机漏洞检测服务为后续的信息安全措施划清了重点，指明了方向，用户不再需要盲目地购
              入多余的安全产品或服务，极大地降低了用户的生产成本。
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
