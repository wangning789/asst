<!-- 安全资产详情-防火墙业务和策略信息  -->

<template>
  <div :class="'el-card ' + $style.wrapper">
    <div style="margin-bottom: 30px;">
      <h2 style="display: inline;">
        虚拟防火墙服务
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
      <h3>暂无业务数据</h3>
    </div> -->
    <div>
      <h5>安全防护信息</h5>
      <ElTable
        :data="info"
        style="width: 100%; margin-top: 20px;"
        :row-class-name="tableRowClassName"
      >
        <ElTableColumn
          type="index"
          label="序号"
          width="60"
        />
        <ElTableColumn
          prop="businessSysName"
          label="业务系统名称"
        />
        <ElTableColumn
          prop="businessSysIp"
          label="业务系统公网地址"
        />
        <ElTableColumn
          prop="port"
          label="端口"
        />
        <ElTableColumn
          prop="cloudServerIp"
          label="业务服务器地址"
        />
      </ElTable>
      <h5>防火墙策略</h5>
      <ElTable
        :data="role"
        style="width: 100%; margin-top: 20px;"
        :row-class-name="tableRowClassName"
      >
        <ElTableColumn
          type="index"
          label="序号"
          width="60"
        />
        <ElTableColumn
          prop="sourceIp"
          label="源IP"
        />
        <ElTableColumn
          prop="locationIp"
          label="目的IP"
        />
        <ElTableColumn
          prop="agreement"
          label="协议"
        />
        <ElTableColumn
          prop="port"
          label="端口"
        />
        <ElTableColumn
          prop="actionName"
          label="动作"
        />
      </ElTable>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { workInfo, ruleInfo, baseInfo } from '@/api/servicePlatform/safetyAsset'

import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
// import IChooser from '@com/ChooserAsyncFunctional'

import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ElTable, ElTableColumn },
  data() {
    return {
      info: [],
      role: [],
      infoBase: {},
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

  created() {
    workInfo(this.$route.params.id).then(res => {
      this.info = res.data.body && res.data.body.length ? res.data.body : [{}]
    })
    ruleInfo(this.$route.params.id).then(res => {
      this.role = res.data.body && res.data.body.length ? res.data.body : [{}]
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
