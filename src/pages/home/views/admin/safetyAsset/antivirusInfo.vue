<!-- 安全资产详情-主机杀毒 -->
<template>
  <div :class="'el-card ' + $style.wrapper">
    <div style="margin-bottom: 30px;">
      <h2 style="display: inline;">
        {{ infoBase.securityAssetName }}
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
    <!-- <div v-if="info.length === 0">
      <h3>清除病毒前自动备份至恢复区（推荐</h3>
    </div> -->
    <h5>安全防护信息</h5>
    <ElTabs v-model="activeName">
      <ElTabPane
        v-for="(item, index) in info"
        :key="index"
        :label="worker[index]"
        :name="`${index}`"
      >
        <h5 style="margin: 20px 0;">
          服务器操作系统
        </h5>
        <ElTable
          :data="item.antivirusServerDTOList"
          style="width: 100%; margin-top: 20px;"
          :row-class-name="tableRowClassName"
        >
          <ElTableColumn
            type="index"
            label="序号"
            width="60"
          />
          <ElTableColumn
            prop="ipAddress"
            label="IP地址"
          />
          <ElTableColumn
            prop="osName"
            label="操作系统"
          />
          <ElTableColumn
            prop="osVersion"
            label="操作系统版本"
          />
          <ElTableColumn
            prop="attributeBusinessName"
            label="归属业务"
          />
        </ElTable>
        <h5 style="margin: 20px 0;">
          系统策略要求
        </h5>
        <ElRow>
          <ElCol :span="24">
            <label>扫描任务类型：</label>
            <span>{{ item.scanTaskName }}</span>
          </ElCol>
          <ElCol :span="24">
            <!-- /{{ item.scanDecribe }} -->
            <label>扫描周期：</label>
            <span>{{ item.scanCycleName }} / {{ item.scanDecribe }}</span>
          </ElCol>
          <ElCol :span="24">
            <label>扫描时间段：</label>
            <span>{{ item.scanStartTime }}-{{ item.scanEndTime }}</span>
          </ElCol>
          <ElCol :span="24">
            <label>病毒处理规则：</label>
            <span>{{ item.disposalRuleName }}</span>
            <ElCheckbox
              v-model="checked"
              style="margin: 0 0 0 20px;"
            >
              清除病毒前自动备份至恢复区（推荐）
            </ElCheckbox>
          </ElCol>
          <ElCol :span="24">
            <label>定时升级策略：</label>
            <span>{{ item.upgradeRuleName }} / {{ item.upgradeDescribe }}</span>
          </ElCol>
          <ElCol :span="24">
            <label>定时升级时间段：</label>
            <span>{{ item.upgradeStartTime }}-{{ item.upgradeEndTime }}</span>
          </ElCol>
          <ElCol :span="24">
            <label>漏洞修复策略：</label>
            <span>{{ item.repairRuleName }}</span>
          </ElCol>
        </ElRow>
        <h4 style="margin: 20px 0;">
          例外策略
        </h4>
        <ElRow>
          <ElCol :span="24">
            <label>白名单路径：</label>
            <span>{{ item.whiteList }}</span>
          </ElCol>
          <ElCol :span="24">
            <label>例外程序路径：</label>
            <span>{{ item.exprogrameList }}</span>
          </ElCol>
          <ElCol :span="24">
            <label>WEB例外URL：</label>
            <span>{{ item.exurlList }}</span>
          </ElCol>
        </elrow>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { antivirusInfo, baseInfo } from '@/api/servicePlatform/safetyAsset'

import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
// import IChooser from '@com/ChooserAsyncFunctional'

import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ElTabs, ElTabPane, ElTable, ElTableColumn },
  data() {
    return {
      info: [],
      activeName: '0',
      worker: ['业务一', '业务二', '业务三', '业务四', '业务五', '业务六', '业务七', '业务八'],
      infoBase: {},
      checked: false,
    }
  },
  computed: {
    STYLE: () => STYLE,
    fetch: baseInfo,
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
  mounted() {
    if (window.pageType) {
      this.params.pageType = window.pageType
    }
  },
  created() {
    antivirusInfo(this.$route.params.id).then(res => {
      this.info = res.data.body && res.data.body.length ? res.data.body : [{}]
      // this.activeName = this.info[0].index || 0
      // console.log(this.activeName, '858585855885')
      if (this.info.cleanStatusCode === '0') {
        this.checked = true
      }
    })
    baseInfo(this.$route.params.id).then(res => {
      this.infoBase = res.data.body
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
// .mg {
//   margin-top: 20px;
//   margin-bottom: 20px;
// }

// .mgl {
//   margin-right: 10px;
//   margin-left: 10px;
// }

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
