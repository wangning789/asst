<!-- 描述 -->
<template>
  <div :class="$style.portInformation">
    <div :class="$style.ipInfo">
      <div :class="$style.ipTitle">
        <div :class="$style.titleplace">
          端口 ({{ port.portCountMap.portCount }})
        </div>
      </div>
      <div :class="$style.ipcontent">
        <div
          :class="$style.rightModule"
        >
          <span
            v-for="(item,index) in port.portCountMap.portList"
            :key="index"
          > {{ item }}</span>
        </div>
      </div>
    </div>
    <div :class="$style.ipInfo">
      <div :class="$style.ipTitle">
        <div :class="$style.titleplace">
          协议 ({{ port.portCountMap.portCount }})
        </div>
      </div>
      <div :class="$style.ipcontent">
        <div :class="$style.rightModule">
          <span
            v-for="(item,index) in port.portCountMap.protocolList"
            :key="index"
          > {{ item }}</span>
        </div>
      </div>
    </div>
    <!--图层 -->
    <div :class="$style.portinfo">
      <div>
        <span
          v-for="(item,index) in port.portCountMap.moduleList[1]"
          :key="index"
        >{{ item }}</span>
      </div>
      <div>
        <span
          v-for="(item,index) in port.portCountMap.moduleList[2]"
          :key="index"
        >{{ item }}</span>
      </div>
      <div>
        <span
          v-for="(item,index) in port.portCountMap.moduleList[3]"
          :key="index"
        >{{ item }}</span>
      </div>
      <div>
        <span
          v-for="(item,index) in port.portCountMap.moduleList[4]"
          :key="index"
        >{{ item }}</span>
      </div>
      <div>
        <span
          v-for="(item,index) in port.portCountMap.moduleList[5]"
          :key="index"
        >{{ item }}</span>
      </div>
    </div>
    <div :class="$style.ipInfo">
      <div :class="$style.ipTitle">
        <div :class="$style.titleplace">
          同IP网站信息
        </div>
      </div>
      <div :class="$style.ipcontent" />
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
    port: { type: Object, required: true },
  },
}
</script>

<style lang="scss" module>
.portInformation {
  position: absolute;
  top: 100px;
  right: 0;
  width: 300px;

  .ipInfo {
    margin: 20px 0;

    .ipTitle {
      height: 30px;
      background-color: #f4f6fb;
    }

    .titleplace {
      width: 100px;
      height: 30px;
      margin-left: 30px;
      line-height: 30px;
    }
  }

  .modulename {
    margin-top: 10px;
  }

  .ipcontent {
    border: 1px solid #f0f0f0;
  }

  .rightModule > span {
    display: inline-block;
    height: 18px;
    margin: 16px 10px 10px;
    padding: 4px 10px;
    color: #2c73ef;
    font-weight: 400;
    font-size: 12px;
    font-family: Microsoft YaHei;
    line-height: 18px;
    text-align: center;
    background-color: rgba(44, 115, 239, 0.1);
    border-radius: 20px;
  }

  .portModule {
    display: flex;
    margin-top: 10px;

    .leftModule {
      width: 100px;
      height: 50px;
      margin-right: 20px;
      text-align: center;
      border: 1px solid rgba(63, 176, 224, 1);
    }

    .rightModule {
      display: flex;
      flex-wrap: wrap;
      width: 200px;
    }
  }

  .portinfo {
    width: 300px;
    text-align: center;

    span {
      margin-right: 4px;
      padding: 2px 8px;
      color: #03c;
      font-size: 12px;
      background-color: #fff;
      border-radius: 4px;
    }

    > div {
      height: 27px;
      line-height: 27px;
    }

    > div:nth-of-type(1) {
      background-color: #e9f7fe;
    }

    > div:nth-of-type(2) {
      background-color: #d2eefa;
    }

    > div:nth-of-type(3) {
      background-color: #abdff5;
    }

    > div:nth-of-type(4) {
      background-color: #7bcbee;
    }

    > div:nth-of-type(5) {
      background-color: #3fb0e0;
    }
  }
}
</style>
