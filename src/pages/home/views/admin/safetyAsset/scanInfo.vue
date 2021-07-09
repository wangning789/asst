<!-- 安全资产详情-漏洞扫描 -->
<template>
  <div :class="'el-card ' + $style.wrapper">
    <div>
      <div style="margin-bottom: 30px;">
        <h2 style="display: inline;">
          漏洞扫描
        </h2>
        <span
          v-if="infoBase.activeStatus === '1'"
          :class="$style.success"
        >生效中</span>
        <span
          v-else
          :class="$style.error"
        >失效中</span>
      </div>

      <h5>安全服务基础信息</h5>
      <ElRow style="margin: 0 0 50px;">
        <ElCol :span="12">
          <label>资产名称：</label>
          <span>{{ infoBase.securityAssetName }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>关联订单：</label>
          <span style="color: 50, 115, 196;">{{ infoBase.orderNo }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>购买时间：</label>
          <span>{{ infoBase.orderBeginTime }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>到期时间：</label>
          <span>{{ infoBase.dueTime }}</span>
        </ElCol>
      </ElRow>

      <h5>安全防护信息</h5>
      <ElRow style="margin: 0 0 50px;">
        <ElCol :span="12">
          <label>扫描类型:</label>
          <span>{{ info[0].vulScanTypeName || "" }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>扫描时间段:</label>
          <span>{{ info[0].startScanTime || "" }}-{{ info[0].endScanTime || "" }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>系统地址:</label>
          <span>{{ info[0].scanIpAddress || "" }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>网站域名:</label>
          <span>{{ info[0].scanWebDomain || "" }}</span>
        </ElCol>
        <ElCol :span="12">
          <label>防护设备信息:</label>
          <span>{{ info[0].protectDevinfoName || "" }}</span>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { scanInfo, baseInfo } from '@/api/servicePlatform/safetyAsset'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  data() {
    return {
      info: [],
      infoBase: {},
    }
  },
  methods: {
    // 表格颜色
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      }
      return ''
    },
  },
  created() {
    scanInfo(this.$route.params.id).then(res => {
      this.info = res.data.body && res.data.body.length ? res.data.body : [{}]
    })
    baseInfo(this.$route.params.id).then(res => {
      this.infoBase = res.data.body ? res.data.body : {}
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>

.wrapper {
  h4 {
    margin: $gapNormal / 2 0;
    color: $colorTextMain;
    font-size: $larger;

    &:first-of-type {
      margin-top: 0;
    }
  }

  label {
    display: inline-block;
    width: 125px - $gapNormal / 2;
    margin: $gapNormal / 2 0;
    padding-right: $gapNormal / 2;
    text-align: right;
  }
}

.success {
  display: inline-block;
  margin: 0 0 0 10px;
  color: $colorSuccess;
}

.error {
  display: inline-block;
  margin: 0 0 0 10px;
  color: $colorDanger;
}
</style>
