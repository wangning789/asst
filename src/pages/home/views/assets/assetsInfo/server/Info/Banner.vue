<!-- banner信息 -->
<template>
  <div>
    <div
      v-for="(item,index) in portList"
      :key="index"
      :class="$style.banner"
    >
      <div :class="$style.bannerContent">
        <div :class="$style.leftContent">
          <div :class="$style.contentTitle">
            {{ item.port }}/{{ item.protocol }}
          </div>
          <div :class="$style.contentName">
            <span :class="$style.contentIco" />
            {{ item.name }}
            <span :class="$style.contentSite"><i class="el-icon-link" /></span>
          </div>
          <div
            v-show="item.includeManageStatus === '1'"
            :class="$style.contentStuas"
          >
            <span>已纳管</span>
          </div>
          <div
            v-show="item.includeManageStatus === '2'"
            :class="$style.content"
          >
            <span>未纳管</span>
          </div>
        </div>
        <div :class="$style.rightContent">
          {{ item.banner }}
        </div>
      </div>
      <div :class="$style.contentTop">
        <i class="el-icon-arrow-down" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    portList: { type: Array, required: true },
  },
}
</script>

<style lang="scss" module>

.banner {
  width: 100%;
  margin-top: 10px;
  background-color: rgba(242, 242, 242, 0.486274509803922);

  .bannerContent {
    display: flex;
    padding: 30px 20px 10px;
  }

  .contentTop {
    width: 100%;
    font-size: 25px;
    text-align: center;
    background-color: #f2f2f2;
  }

  .leftContent {
    width: 200px;

    .contentTitle {
      width: 100px;
      width: 103px;
      height: 35px;
      color: #fff;
      font-weight: 700;
      font-family: 'Arial Negreta', 'Arial';
      line-height: 35px;
      text-align: center;
      background-color: rgba(63, 176, 224, 1);
    }

    .contentName {
      padding: 20px 0;
    }

    .contentIco {
      display: inline-block;
      width: 5px;
      height: 10px;
      border: 1px solid #3fb0e0;
    }

    .contentSite {
      color: #3fb0e0;
    }

    .contentStuas {
      width: 53px;
      height: 20px;
      color: #fff;
      font-weight: 400;
      font-size: 12px;
      font-family: 'Microsoft YaHei Regular', 'Microsoft YaHei';
      font-style: normal;
      line-height: 20px;
      text-align: center;
      background-color: rgba(24, 144, 255, 1);
      border-radius: 4px;
    }

    .content {
      width: 53px;
      height: 20px;
      color: #fff;
      font-weight: 400;
      font-size: 12px;
      font-family: 'Microsoft YaHei Regular', 'Microsoft YaHei';
      font-style: normal;
      line-height: 20px;
      text-align: center;
      background-color: red;
      border-radius: 4px;
    }
  }
}
</style>
