<!-- 描述 -->
<template>
  <IChooser
    :fetch="particulars"
    :args="[route.params.id]"
    :class="'el-card ' + $style.wrapper"
  >
    <template #success="{data:{ data: { alarmInfo, srcIpList, dstIpList }, dispositionMessages }}">
      <div style="margin-top: 0;">
        <div>
          <h4 style="float: left;">
            告警信息
          </h4>
          <ElButton
            type="primary"
            style="float: right;"
            @click="shiftOrder"
          >
            发起处置工单
          </ElButton>
        </div>
      </div>
      <ElRow
        :gutter="GAP"
        style="clear: both;"
      >
        <ElCol :span="12">
          <IColumn
            :data="[
              {title: '告警名称', value: trim(alarmInfo.alarm_name)},
              {title: '告警描述', value: trim(alarmInfo.alarm_descr)},
              {title: '告警类型', value: trim(alarmInfo.alarm_type)},
              {title: '告警子类型', value: trim(alarmInfo.alarm_sub_type)},
              {title: '发生时间', value: trim(alarmInfo.alarm_first_time)},
              {title: '结束时间', value: trim(alarmInfo.alarm_last_time)},
            ]"
          />
        </ElCol>

        <ElCol :span="12">
          <IColumn
            :data="[
              {
                title: '告警级别',
                value: trim(alarmInfo.alarm_level),
                class: (getAlarmLevel(alarmInfo) || 0).class
              },
              {title: '攻击阶段', value: trim(alarmInfo.attack_stage)},
              {title: '持续时长', value: trim(alarmInfo.alarm_dura)},
              {title: '解决方案', value: trim(alarmInfo.alarm_solu)},
              {title: '关联日志数', value: trim(alarmInfo.rela_log_num)},
              {title: '告警时间', value: trim(alarmInfo.alarm_time)},
            ]"
          />
        </ElCol>
      </ElRow>
      <!-- IP -->
      <ElRow
        :gutter="GAP"
        :class="$style.ip"
      >
        <ElCol :span="12">
          <h4>源IP信息</h4>
          <ElSelect
            :value="srcIp || (srcIp = srcIpList[0])"
            filterable
            value-key="ip"
            @change="srcIp = $event"
          >
            <ElOption
              v-for="(item, i) in srcIpList"
              :key="i"
              :value="item"
              :label="item.ip"
            />
          </ElSelect>
        </ElCol>
        <ElCol :span="12">
          <h4>目的IP信息</h4>
          <ElSelect
            :value="dstIp || (dstIp = dstIpList[0])"
            filterable
            value-key="ip"
            @change="dstIp = $event"
          >
            <ElOption
              v-for="(item, i) in dstIpList"
              :key="i"
              :value="item"
              :label="item.ip"
            />
          </ElSelect>
        </ElCol>
      </ElRow>
      <!-- IP表信息 -->
      <ElRow :gutter="GAP">
        <ElCol :span="12">
          <IColumn
            :data="[
              {title: '资产名称', value: srcIp.asset_name},
              {title: '资产类型', value: srcIp.asset_type},
              {title: '资产位置', value: srcIp.ctry_cd},
              {title: '网络区域', value: NETWORK_AREA[srcIp.data_src_sub_region] || ''},
              {title: '操作系统', value: srcIp.os},
              {title: 'CPU数量', value: ''},
              {title: 'CPU型号', value: srcIp.ciCpu},
              {title: '内存(GB)', value: srcIp.ciMemory},
            ]"
          />
        </ElCol>
        <ElCol :span="12">
          <IColumn
            :data="[
              {title: '资产名称', value: dstIp.asset_name},
              {title: '资产类型', value: dstIp.asset_type},
              {title: '资产位置', value: dstIp.ctry_cd},
              {title: '网络区域', value: NETWORK_AREA[dstIp.data_src_sub_region] || ''},
              {title: '操作系统', value: dstIp.os},
              {title: 'CPU数量', value: ''},
              {title: 'CPU型号', value: dstIp.ciCpu},
              {title: '内存(GB)', value: dstIp.ciMemory},
            ]"
          />
        </ElCol>
      </ElRow>
      <h4> 关联日志</h4>
      <!--      <ITable-->
      <!--        :head="head"-->
      <!--        :data="tableData"-->
      <!--        :query="{ secwarnUuid: route.params.id }"-->
      <!--        layout-->
      <!--      />-->
      <ITable
        :head="head"
        :get="relLog"
        :query="{ secwarnUuid: route.params.id }"
        layout
      />
      <!-- 判断展示:详情过展示信息，处置-展示全部 -->
      <!-- 处置跳转展示 -->
      <ElRow>
        <h4>告警处理</h4>
      </ElRow>
      <ElRow :class="$style.dipflex">
        <div :class="$style.bgcline" /><span :class="$style.dispose">告警处置记录</span>
      </ElRow>
      <!-- 步骤条 -->
      <ElRow :gutter="GAP">
        <ElCol :span="24">
          <ElTable
            :data="recordData"
            :header-cell-style="{
              'background-color': '#EBF1F9'
            }"
          >
            <ElTableColumn
              property="fkWorkId"
              label="工单编号"
            />
            <ElTableColumn
              property="processTimeFormat"
              label="时间"
            />
            <ElTableColumn
              property="dealContent"
              label="处理描述"
            />
            <ElTableColumn
              property="handlerName"
              label="运维人员"
            />
            <ElTableColumn
              label="详情"
            >
              <template slot-scope="scope">
                <span
                  style="color: #2b7de2; cursor: pointer;"
                  @click="go(scope.row)"
                >详情</span>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCol>
      </ElRow>
      <!-- 处置按钮进入 -->
      <ElRow
        v-if="dispositionMessages && dispositionMessages.length"
        :gutter="GAP"
      >
        <ElCol :span="12">
          <!-- 详情按钮进入 -->
          <ElRow :class="$style.buttonbox">
            <ElButton
              type="warning"
              @click="tabPos"
            >
              完成处置
            </ElButton>
            <!-- <ElButton
              type="warning"
              @click="upgradeButton"
            >
              升级
            </ElButton> -->
          </ElRow>
        </ElCol>
      </ElRow>
    </template>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
import IChooser from '@com/ChooserAsyncFunctional'
// import IInfo from '@com/Info'
import ITable from '@com/Table'
import IColumn from './Column'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'

import { particulars, dispose, relLog, alarmOperateFlow, getOperationCurAlarmWorkOrderList } from '@/api/servicePlatform/safety'
// import { MODULE } from '@/enums/module'
import { getLogLevel } from '../securityLog/enums'
import { getAlarmLevel } from './enums'
import {
  toDetail,
} from '@/api/workflow/workflow'
import getCode from '@/enums/code'

import STYLE from '@/scss/status.module.scss'
import LAYOUT from '@/scss/export/layout.scss'

const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

export default {
  props: { route: { type: Object, required: true } },
  components: {
    // ElTimeline,
    // ElTimelineItem,
    // ElTabs,
    // ElTabPane,
    ElTable,
    ElTableColumn,
    IChooser,
    IColumn,
    ITable,
    // IInfo,
  },
  data() {
    return {
      recordData: [],
      // tableData: [],
      customerLoginId: null,
      activedTab: '漏洞扫描',
      srcIp: '',
      dstIp: '',
      // 告警处理记录
      formLabelAlign: {
        target: '',
        tall: '',
        centre: '',
        low: '',
        record: '',
        // 修复
        repairtall: '',
        repaircentre: '',
        repairlow: '',
        // 基线
        basetarget: '',
        basetartall: '',
        attackIP: '',
        region: '',
        step: '',
        // id展示页面
        id: '',
      },
    }
  },
  computed: {
    NETWORK_AREA: () => NETWORK_AREA.value,
    // relLog,
    GAP: () => +LAYOUT.gap,
    STY: () => STYLE,
    // 日志
    head() {
      return [
        {
          label: '名称',
          formatter: row => this.$createElement(
            'span',
            {
              class: 'el-link el-link--primary',
              on: {
                click: () => {
                  this.$router.push({
                    path: `/securityLog/${row.log_id}/info`,
                  })
                },
              },
            },
            row.log_name
          ),
        },
        { prop: 'log_type', label: '日志类型' },
        {
          label: '日志级别',
          formatter: row => {
            row = getLogLevel(row)
            return this.$createElement('span', { class: row.class }, row.text)
          },
        },
        { label: '源IP', formatter: row => row.src_ips },
        { label: '目的IP', formatter: row => row.dst_ips },
        { prop: 'log_time', label: '更新时间' },
      ]
    },
  },
  methods: {
    go(row: any) {
      toDetail(row.processId, '工单详情', msg => {
        msg.data === 'close' && this.$refs.table.fetch()
      })
    },
    shiftOrder() {
      particulars(this.$route.params.id).then(res => {
        alarmOperateFlow(
          this.$route.params.id,
          this.$route.query.relAlarmInfo,
          res.data.customerLoginIds,
          res.data.customerLoginNames
        ).then(res => {
          toDetail(res.data.body, '发起工单', msg => {
            msg.data === 'close' && this.$refs.table.fetch()
          })
        })
      })
    },
    particulars,
    getAlarmLevel,
    trim: str => (str || '').trim(),
    async relLog() {
      const res = await relLog.apply(this, arguments)
      const body = res.data.body || {}
      res.data.body = body.list || []
      return res
    },
    tabPos() {
      // 升级状态-升级完成
      (this.$refs[this.activedTab] || this.$refs.default).validate(val => {
        if (!val) {
          return this.$message({
            message: '请填写升级信息！！',
            type: 'warning',
          })
        }
        dispose({ secewarnStatus: '3', alarmIds: this.route.params.id }).then(res => {
          if (res.status === 200) {
            this.$message({
              showClose: true,
              message: '已完成处置成功！！',
              type: 'success',
            })
          }
        })
      })
    },
    // 确定-告警处置请求
    confirm() {
      ;(this.$refs[this.activedTab] || this.$refs.default).validate(valid => {
        if (!valid) {
          return this.$message({
            message: '请填写要提交的内容！！',
            type: 'warning',
          })
        }

        const formLabelAlign = this.formLabelAlign
        const DIC_LEAK = { tall: '高', centre: '中', low: '低' }
        const DIC_REPAIRE = { repairtall: '高', repaircentre: '中', repairlow: '低' }
        let dispositionMessage = ''
        let attr
        let value
        switch (this.activedTab) {
          case '漏洞扫描':
            dispositionMessage = `对 ${formLabelAlign.target} 执行了${this.activedTab}，共检测到`
            for (attr in DIC_LEAK) {
              value = +formLabelAlign[attr]
              if (value >= 0) {
                dispositionMessage += `${DIC_LEAK[attr]}危漏洞 ${value} 个，`
              }
            }
            dispositionMessage += '已修复'
            for (attr in DIC_REPAIRE) {
              value = +formLabelAlign[attr]
              if (value >= 0) {
                dispositionMessage += `${DIC_REPAIRE[attr]}危漏洞 ${value} 个，`
              }
            }
            dispositionMessage = dispositionMessage.substring(0, dispositionMessage.length - 1)
            break
          case '基线检查':
            dispositionMessage = `对 ${formLabelAlign.basetarget} 执行了基线检查，发现风险项 ${formLabelAlign.basetarrisk} 项，并完成修改 ${formLabelAlign.basetartall} 项`
            break
          case '攻击源目标':
            dispositionMessage = `${formLabelAlign.target} 被 ${formLabelAlign.attackIP} 攻击，已被 ${formLabelAlign.region} 阻断`
            break
          default:
            dispositionMessage = formLabelAlign.step + '' + formLabelAlign.record
        }
        dispose({ dispositionMessage, alarmIds: this.route.params.id }).then(() => {
          this.refresh()
        })
      })
    },
    // 取消-处置
    cancel() {
      this.formLabelAlign = {}
    },
    // 升级跳转
    upgradeButton() {
      this.$router.push({ name: 'Upgrade' })
    },
  },
  created() {
    getOperationCurAlarmWorkOrderList(this.$route.params.id).then(res => {
      this.recordData = res.data.body
    })
    const id = this.route.query.id
    particulars({ id }).then(res => {
      this.customerLoginId = res.data.customerLoginIds
      this.form = res.data.body
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/timeline';
@import '~element-ui/packages/theme-chalk/src/timeline-item';
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.wrapper {
  h4 {
    margin: $gapNormal / 2 0;
    color: $colorTextMain;
    font-size: $larger;
  }
}

.ip {
  margin: $gapNormal / 2 0;

  h4 {
    display: inline-block;
  }

  :global(.el-select) {
    float: right;
  }
}

.bgcline {
  display: inline-block;
  width: 4px;
  height: 12px;
  margin-top: 8px;
  margin-right: 8px;
  margin-left: 8px;
  background: $colorTheme;
}

.dipflex {
  display: flex;
  margin: $gapNormal 0;
}

.minx {
  width: 64px !important;
}

.texbox {
  width: 240px;
  height: 40px;
  border: $borderBase;
  border-radius: $borderRadiusBase;
}

.buttonbox {
  margin: $gapNormal 0;
  text-align: center;
}

.dispose {
  color: $colorTextMain;
  font-weight: bold;
  font-size: $medium;
  line-height: $gapNormal;
}
</style>
