<!-- 分栏信息展示 -->
<template>
  <div :class="$style.bodyC">
    <div style="height: 20px; text-align: right;">
      <ElButton
        type="primary"
        @click="shiftOrder"
      >
        发起处置工单
      </ElButton>
    </div>
    <div>事件状态：{{ $route.query.status | statusFilter }}</div>
    <div>
      <p :class="$style.bd">
        <span :class="$style.circle" />
        <span :class="$style.marginl">源告警信息</span>
      </p>
      <div>
        <div>
          <table :class="$style.wrapper">
            <tr>
              <td>
                告警名称
              </td>
              <td>
                {{ tableOne.alarm_name }}
              </td>
              <td>
                告警级别
              </td>
              <td>
                {{ tableOne.alarm_level }}
              </td>
            </tr>
            <tr>
              <td>
                告警描述
              </td>
              <td colspan="3">
                {{ tableOne.alarm_descr }}
              </td>
            </tr>
            <tr>
              <td>
                告警类型
              </td>
              <td>
                {{ tableOne.alarm_type }}
              </td>
              <td>
                告警子类型
              </td>
              <td>
                {{ tableOne.alarm_sub_type }}
              </td>
            </tr>
            <tr>
              <td>
                发生时间
              </td>
              <td>
                {{ tableOne.alarm_time }}
              </td>
              <td>
                持续时长
              </td>
              <td>
                {{ tableOne.alarm_time }}
              </td>
            </tr>
            <tr>
              <td>
                攻击阶段
              </td>
              <td colspan="3">
                {{ tableOne.attack_stage }}
              </td>
            </tr>
            <tr>
              <td>
                关联日志数
              </td>
              <td colspan="3">
                {{ tableOne.rela_log_num }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div :class="$style.big">
      <div style="width: 48%;">
        <p :class="$style.bd">
          <span :class="$style.circle" />
          <span :class="$style.marginl">源IP信息</span>
          <ElSelect
            v-model="yip"
            style="margin-left: 550px;"
            value-key="id"
            size="mini"
            placeholder="请选择"
            @change="yipChange"
          >
            <ElOption
              v-for="item in yipOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </p>
        <div>
          <div>
            <table :class="$style.wrapper">
              <tr>
                <td>
                  源IP
                </td>
                <td>
                  {{ tableTwoCopy.ip }}
                </td>
                <td>
                  资产名称
                </td>
                <td>
                  {{ tableTwoCopy.asset_name }}
                </td>
              </tr>
              <tr>
                <td>
                  端口
                </td>
                <td>
                  {{ tableTwoCopy.port }}
                </td>
                <td>
                  资产类型
                </td>
                <td>
                  {{ tableTwoCopy.asset_type }}
                </td>
              </tr>
              <tr>
                <td>
                  地理位置
                </td>
                <td>
                  {{ tableTwoCopy.city }}
                </td>
                <td>
                  所属用户
                </td>
                <td>
                  {{ tableTwoCopy.asset_user_name }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div style="width: 48%;">
        <p :class="$style.bd">
          <span :class="$style.circle" />
          <span :class="$style.marginl">目的IP信息</span>
          <ElSelect
            v-model="mip"
            style="margin-left: 550px;"
            value-key="id"
            size="mini"
            placeholder="请选择"
            @change="mipChange"
          >
            <ElOption
              v-for="item in mipOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </p>
        <div>
          <div>
            <table :class="$style.wrapper">
              <tr>
                <td>
                  源IP
                </td>
                <td>
                  {{ tableTreeCopy.ip }}
                </td>
                <td>
                  资产名称
                </td>
                <td>
                  {{ tableTreeCopy.asset_name }}
                </td>
              </tr>
              <tr>
                <td>
                  端口
                </td>
                <td>
                  {{ tableTreeCopy.port }}
                </td>
                <td>
                  资产类型
                </td>
                <td>
                  {{ tableTreeCopy.asset_type }}
                </td>
              </tr>
              <tr>
                <td>
                  地理位置
                </td>
                <td>
                  {{ tableTreeCopy.city }}
                </td>
                <td>
                  所属用户
                </td>
                <td>
                  {{ tableTreeCopy.asset_user_name }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p :class="$style.bd">
        <span :class="$style.circle" />
        <span :class="$style.marginl">关联日志</span>
      </p>
      <div>
        <div>
          <ElTable
            :data="logData"
            :header-cell-style="{
              'background-color': '#EBF1F9'
            }"
          >
            <ElTableColumn
              type="index"
              label="序号"
              width="60"
            />
            <ElTableColumn
              property="log_time"
              label="发生时间"
            />
            <ElTableColumn
              property="log_name"
              label="日志名称"
            />
            <ElTableColumn
              property="log_type"
              label="日志类型"
            />
            <ElTableColumn
              property="log_level"
              label="日志级别"
            />
            <ElTableColumn
              property="src_ips"
              label="源IP"
            />
            <ElTableColumn
              property="dst_ips"
              label="目的IP"
            />
          </ElTable>
        </div>
      </div>
    </div>
    <div style="margin-top: 5px;">
      <p style="height: 35px; border-bottom: 1px solid gray;">
        <span :class="$style.circle" />
        <span :class="$style.marginl">处置记录</span>
      </p>
      <div>
        <div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTable from 'element-ui/lib/table'
// import ElDialog from 'element-ui/lib/el-dia'
import { ElTableColumn } from '@com/Table'
// import IColumn from '../warning/Column'
import {
  getAlarmrelevanceLog,
  getCurAlarmWorkOrderList,
  getCurAlarmWorkDetail,
  getAlarmUserDetail,
  alarmOperateFlow,
} from '@/api/securityReport/securityReport'
import {
  toDetail,
} from '@/api/workflow/workflow'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  components: { ElTable, ElTableColumn },
  filters: {
    statusFilter(val) {
      if (val === '1') {
        return '待处置'
      } else if (val === '2') {
        return '已升级'
      } else if (val === '3') {
        return '已处置'
      } else {
        return '已忽略'
      }
    },
  },
  data() {
    return {
      mip: null,
      yip: null,
      yipOptions: [],
      mipOptions: [],
      tableOne: {},
      tableTwo: {},
      tableTwoCopy: {},
      tableTree: {},
      tableTreeCopy: {},
      tableFour: {},
      tableFive: {},
      logData: [],
      recordData: [],
      relDialog: false,
      tableData: [],
      tableDataYJG: [],
      tableDataGL: [],
      tableDataCL: [],
      tableDataYIP2: [],
      tableDataYIP: [],
    }
  },
  methods: {
    shiftOrder() {
      alarmOperateFlow(this.$route.query.id, this.$route.query.relAlarmInfo).then(res => {
        toDetail(res.data.body, '创建工单', msg => {
          msg.data === 'close' && this.$refs.table.fetch()
        })
      })
    },
    mipChange() {
      this.tableTwoCopy = this.tableTwo[this.mip]
    },
    yipChange() {
      this.tableTreeCopy = this.tableTree[this.yip]
    },
    go(row) {
      toDetail(row.processId, '工单详情', msg => {
        msg.data === 'close' && this.$refs.table.fetch()
      })
    },
    trim: str => (str || '').trim(),
    goToOrder(row) {
      this.relDialog = true
      // console.log(row.id)
      getCurAlarmWorkDetail(row.id).then(res => {
        // console.log(res.data.body)
        this.order = res.data.body
      })
    },
  },
  created(): void {
    getAlarmUserDetail(this.$route.query.id).then(res => {
      this.tableOne = res.data.alarmInfo
      this.tableTwo = res.data.srcIps // yip
      this.tableTree = res.data.dstIps // mip
      this.yipOptions = []
      this.mipOptions = []
      if (Object.keys(this.tableTwo).length) {
        this.yipOptions = Object.keys(this.tableTwo)
        this.tableTwoCopy = this.tableTwo[Object.keys(this.tableTwo)[0]]
        this.yip = Object.keys(this.tableTwo)[0]
      }
      if (Object.keys(this.tableTree).length) {
        this.mipOptions = Object.keys(this.tableTree)
        this.tableTreeCopy = this.tableTree[Object.keys(this.tableTree)[0]]
        this.mip = Object.keys(this.tableTree)[0]
      }
    })
    getAlarmrelevanceLog(this.$route.query.id).then(res => { // 关联日志
      this.logData = res.data.body.list
    })
    getCurAlarmWorkOrderList(this.$route.query.id).then(res => {
      // console.log(res.data.body)// 处置记录
      this.recordData = res.data.body
    })
  },
}
</script>
<style lang="scss">
  @import '~element-ui/packages/theme-chalk/src/table';
  @import '~element-ui/packages/theme-chalk/src/table-column';
</style>
<style lang="scss" module>
  .bd {
    border-bottom: 1px solid $colorInfo;
  }

  .marginl {
    margin-left: 5px;
  }

  .circle {
    display: inline-block;
    width: 15px;
    height: 15px;
    background: dodgerblue;
    border-radius: 50%;
  }

  .tableH {
    height: 25px;
  }

  body {
    background-color: white;
  }

  .allBorder {
    width: 100%;
    border-color: rgba(0, 0, 0, 0.4);
    border-width: 1px;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .big {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
  }

  .wrapper {
    width: 100%;
    table-layout: fixed;
    border: $borderBase;
    border-spacing: 0;

    .bodyC {
      background-color: white;
    }

    tr {
      > td {
        height: 15px;
        padding: $gapNormal / 2 $gapNormal;
        white-space: pre-wrap;
        word-break: break-all;
        border-bottom: $borderBase;

        &:first-child {
          width: 100px;
          background: $colorTheme9;
        }

        &:nth-child(3) {
          width: 100px;
          background: $colorTheme9;
        }
      }
    }
  }
</style>
