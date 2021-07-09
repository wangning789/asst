<!-- 3：Web防篡改服务 -->
<template>
  <div :class="$style.wrapper">
    <!-- banner -->
    <section :class="$style.bannerBox">
      <!-- banner图 -->
      <img
        src="@index/assets/S3.png"
        alt="banner"
        :class="$style.commonImg"
      >

      <!-- banner图上的文字 -->
      <div :class="$style.textBox">
        <h1>Web防篡改服务</h1>

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
            Web防篡改服务,通过文件底层驱动技术对Web站点目录提供锁定的保护，防止入侵者或病毒等对 目录中的网页、电子文档、图片、
            数据库等任何类型的文件进行非法篡改和破坏。通过事件触发 机制和定期同步机制，保证被篡改网页不可能被访问到和WEB系统的实时恢复。该服务技术具有
            响应速度快、判断准确、资源占用少及部署灵活等特点。
          </p>
        </div>
        <!-- 右 -->
        <div :class="$style.rightBox">
          <p><img src="@index/assets/lingxing.png"> Web防篡改服务 </p>
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
              <i class="el-icon-circle-check" /> Web防篡改服务
            </h3>
            <p :class="$style.text">
              Web防篡改服务基于网页防篡改系统阻断篡改行为，包括对保护文件夹内的文件进行添加、删除、修改等操作；检 测到前端的文件被篡改后，自动通过恢复机制对篡改的文件进行及时的恢复。
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
              src="@index/assets/service/service3_1.png"
            >
            <h3 :class="$style.title">
              水印防篡改
            </h3>
            <p :class="$style.text">
              Web防篡改服务系统对所有网页元素(包 括静态页面、动态脚本、图像文件、多 媒体文件以及所有能以URL形式访问的 实体)生成数字水印。
              而后如果发现当前 水印发生变化，则断定发生篡改，同时
              阻止页面流出，并进行恢复。
            </p>
          </ElCol>

          <ElCol
            :span="7"
            :class="$style.advantageCard"
          >
            <img
              src="@index/assets/service/service3_2.png"
            >
            <h3 :class="$style.title">
              内核防篡改
            </h3>
            <p :class="$style.text">
              Web防篡改服务系统将篡改监测的核心 程序通过内核文件底层驱动内嵌到操作 系统中，通过事件触发方式进行自动监 测，
              在内核中捕获文件的操作，并根据 默认的规则及用户自定义规则来进行相 应的权限控制，若发现变更，实时阻断
              篡改行为。
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
              部署灵活运维简单
            </h3>
            <p :class="$style.text">
              Web防篡改服务系支持多站点、跨平台分布式部署;支持发布端、web服务端一对多，多对多的网站架构;具备完善的平台统一管理，包括平台Web集群的统一管理，
              系统支持对网站维护工作的查询和审计，支持对篡改日志的查询。
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
              <span :class="$style.indexTitle">防篡改</span>
            </div>
            <p :class="$style.marginBox">
              防止黑客、病毒等对网页、电子文档、图片、数据库等文件进行非法篡改和破坏，保护网站，保障互联网业务
              的正常运营。
            </p>

            <!-- 02 -->
            <div>
              <span :class="$style.index">02</span>
              <span :class="$style.indexTitle">维护形象</span>
            </div>
            <p :class="$style.marginBox">
              解决网站被非法修改的问题，保证网站内容正确性，保护网站安全运行，维护政府和企业形象。
            </p>

            <!-- 03 -->
            <div>
              <span :class="$style.index">03</span>
              <span :class="$style.indexTitle">真实完整</span>
            </div>
            <p style="padding-left: 48px; line-height: 30px;">
              不间断地监测网站安全情势，有效保障网站的完整性、真实性。
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
