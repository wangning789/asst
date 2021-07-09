<!-- 描述 -->
<template>
  <div class="el-card">
    <div :class="$style.proinfo">
      <SubTitle :title="this.$router.currentRoute.name" />
      <div :class="$style.aLine">
        <div :class="$style.column">
          <div :class="$style.name">
            探针名称
          </div>
          <div
            :class="$style.customData"
          >
            {{ probeInfo.name }}
          </div>
        </div>
        <div :class="$style.column">
          <div :class="$style.name">
            部署服务器IP
          </div>
          <div
            :class="$style.customData"
          >
            {{ probeInfo.serverIP || '暂无' }}
          </div>
        </div>
        <div :class="$style.column">
          <div :class="$style.name">
            状态
          </div>
          <div
            :class="$style.customData"
          >
            {{ probeInfo.useStatus === 0 ? '正常':'异常' }}
          </div>
        </div>
        <div :class="$style.column">
          <div :class="$style.name">
            添加时间
          </div>
          <div
            :class="$style.customData"
          >
            {{ probeInfo.createDate }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { info } from '@/api/assets/assetprobe'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import SubTitle from '../assetsInfo/components/subTitle'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: {
    SubTitle,
  },
  data() {
    return {
      probeInfo: {},
    }
  },
  created() {
    const id = this.$router.history.current.params.id
    info(id).then(res => {
      this.probeInfo = res.data.body
    })
  },
}
</script>

<style lang="scss" module>

.aLine {
  margin-left: 29px;
  padding-bottom: 16px;
}

.proinfo {
  width: 1200px;
  margin: 0 auto;
}

.column {
  display: flex;

  .name {
    display: flex;
    align-items: center;
    width: 118px;
    height: 38px;
    margin-bottom: -1px;
    padding-left: 10px;
    background-color: rgb(244, 246, 251);
    border: 1px solid #e9e9e9;
  }

  .customData {
    display: flex;
    align-items: center;
    width: 260px;
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding-left: 10px;
    border: 1px solid #f0f0f0;
  }
}
</style>
