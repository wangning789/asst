<!-- ni -->
<template>
  <div
    :class="$style.wrapper"
    class="el-card"
  >
    <ElRow
      :span="24"
      :gutter="20"
    >
      <ElCol
        :span="15"
        :class="$style.myStyle"
      >
        <div style="width: 30%; height: 200px;">
          <img
            src="@/assets/yellow.png.png"
            style="height: 180px;"
          >
        </div>
        <div style="width: 70%; height: 250px; border-right: 1px solid #999;">
          <div style="margin-top: 100px; margin-bottom: 20px; font-weight: bold; font-size: 16px;">
            <p
              v-if="waitHandle.total_count > 0"
              style="margin-bottom: 10px;"
            >
              当前有 <span style="color: #f5572d;">
                <span style="font-size: 18px;">{{ waitHandle.total_count }}</span>
              </span>
              个未处理警告 您的资产安全风险性较高，请尽快处理
            </p>
            <p
              v-else
              style="margin-bottom: 10px;"
            >
              当前有 <span style="color: #f5572d;">
                <span style="font-size: 18px;">{{ waitHandle.total_count }}</span>
              </span>
              个未处理警告 您的资产安全风险性较低
            </p>
            <br>
            <span style="color: #999; font-size: 14px;">已处理日志</span>
            <span>{{ yjcl }}</span>
            <span style="color: #999; font-size: 14px;">条,</span>
            <span style="color: #999; font-size: 14px;">生成警告</span>
            <span>{{ notHandle.total_count }}</span>
            <span style="color: #999; font-size: 14px;">条,</span>
            <span style="color: #999; font-size: 14px;">
              其中严重/高/中/低危数
              <span style="color: #f5572d;">{{ notHandle.high }}</span>
              <span style="color: #f5572d;">/ {{ notHandle.middle }}</span>
              <span style="color: #d89b08;">/ {{ notHandle.half_middle }}</span>
              <span style="color: #67c23a;">/ {{ notHandle.low }},</span>
              已处理严重/高/中/低危告警数
              <span style="color: #f5572d;">{{ alarmData.handled.high }}/</span>
              <span style="color: #f5572d;">{{ alarmData.handled.middle }}/</span>
              <span style="color: #d89b08;">{{ alarmData.handled.half_middle }}/</span>
              <span style="color: #67c23a;">{{ alarmData.handled.low }}</span>
            </span>
          </div>
        </div>
      </ElCol>
      <ElCol
        :span="9"
        style="height: 250px;"
      >
        <div style="display: flex; flex-direction: column; margin-top: 15px;">
          <div :class="$style.myCll">
            <div style="width: 50%; text-align: right;">
              <img
                src="@/assets/jinrigaojing.png"
                style="height: 30px; margin-top: 15px; margin-right: 20px;"
              >
            </div>
            <div style="width: 50%; text-align: left;">
              <div style="margin-top: 25px;">
                今日告警数
              </div>
              <div :class="$style.myGap">
                {{ alarmData.today.total_count }}
              </div>
            </div>
          </div>
          <div :class="$style.myCll">
            <div style="width: 50%; text-align: right;">
              <img
                src="@/assets/daichuligaojing.png"
                style="height: 30px; margin-top: 15px; margin-right: 20px;"
              >
            </div>
            <div style="width: 50%; text-align: left;">
              <div style="margin-top: 25px;">
                待处理告警数
              </div>
              <div :class="$style.myGap">
                {{ waitHandle.total_count }}
              </div>
            </div>
          </div>
        </div>
      </ElCol>
    </ElRow>
    <!--    <div style=''>告警处理详情</div>-->
    <!--    <div>今日告警数</div>-->
    <ElTabs
      v-model="activeName"
    >
      <ElTabPane
        label="告警列表"
        name="first"
      >
        <ElRow
          :span="24"
          :gutter="10"
        >
          <ElCol :span="3">
            <ElSelect
              v-model="query.secwarnType"
              style="width: 100%;"
              placeholder="告警类型"
              clearable
            >
              <ElOption
                v-for="(name, value) in LOGTYPE"
                :key="value"
                :label="name"
                :value="name"
              />
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <ElSelect
              v-model="query.secwarnstatus"
              style="width: 100%;"
              placeholder="处理状态"
              clearable
            >
              <ElOption
                v-for="(name, value) in MYLOGTYPE"
                :key="value"
                :class="$style['l' + value]"
                :label="name"
                :value="value"
              />
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <ElSelect
              v-model="query.secwarnLevel"
              style="width: 100%;"
              placeholder="告警级别"
              clearable
            >
              <ElOption
                v-for="(name, value) in LEVEL"
                :key="value"
                :class="$style['l' + value]"
                :label="name"
                :value="value"
              />
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElRow
          :span="24"
          :gutter="10"
          style="margin-top: 15px;"
        >
          <ElCol :span="5">
            <ElDatePicker
              v-model="date"
              style="width: 100%;"
              clearable
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :format="DATE_TIME.dateTime"
              :value-format="DATE_TIME.serverDateTime"
              @change="dateFormatter"
            />
          </ElCol>
        </ElRow>
        <div
          :class="$style.paddingBox"
          style="width: 110%; margin-top: 10px;"
        >
          <div>
            <ElRow>
              <ElCol
                :span="23"
              >
                <ITable
                  :head="head"
                  :get="page"
                  :query="query"
                >
                  <ElTableColumn
                    label="处理状态"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.alarm_stat | alarmFilter }}
                    </template>
                  </ElTableColumn>
                  <ElTableColumn label="操作">
                    <template slot-scope="scope">
                      <ElTooltip
                        content="详情"
                      >
                        <i
                          class="i-chakan common_table_opt_icon"
                          @click="shiftDetail(scope.row)"
                        />
                      </ElTooltip>
                    </template>
                  </ElTableColumn>
                </ITable>
              </ElCol>
            </ElRow>
          </div>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang='ts'>
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ITable, { ElTableColumn } from '@com/Table'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import { DATE_TIME } from '@/enums/format'
import { LEVEL, LOGTYPE, STATUS, MYLOGTYPE } from './enums'
import {
  getAlarmLevelStatistics,
  getAlarmNotHandleStatistics,
  getAlarmHandledStatistics,
  getAlarmTodayStatistics,
  getCurrentUserAlarmList,
  // getAlarmrelevanceLog,
  // getAlarmDetail,
  getSecurityLogStatistics,
} from '@/api/securityReport/securityReport'
// import STYLE from '@/scss/status.module.scss'
import LAYOUT from '@/scss/export/layout.scss'
// import STYLE from '@/scss/status.module.scss'
// import { ROLES } from '@/enums'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
export default {
  props: { route: { type: Object, required: true } },
  components: { ElTableColumn, ElDatePicker, ElTabs, ElTabPane, ITable },
  filters: {
    alarmFilter(val) {
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
      yjcl: 0,
      notHandle: {},
      waitHandle: {},
      nothhh: null,
      tableLoading: false,
      nothandTotal: null,
      today: null,
      types: null,
      status: null,
      level: null,
      query: {
        searchInfo: null,
        logLevel: null,
        endTime: null,
        startTime: null,
        secwarnLevel: null,
        secwarnType: null,
        secwarnstatus: null,
      },
      total: null,
      currentPage1: null,
      dialogVisible: false,
      tableData: [],
      alarmData: {
        today: {},
        total: null,
        notHandle: [],
        handled: [],
      },
      inputSearch: null,
      date: ['', ''],
      activeName: 'first',
      // 级别多选
      levALl: false,
      levIndeterminate: false,
      // 类型多选
      typeALl: false,
      typeIndeterminate: false,
      // 类型多选
      statusIndeterminate: false,
      // 筛选数据
      form: {
        logLevel: [],
        // 类型
        secwarnTypes: [],
        // 级别
        secwarnLevels: [],
        // 状态
        secwarnstatuss: [],
        searchInfo: '',
        startTime: '',
        endTime: '',
      },
      // 升级勾选
      checked: [],
      alarmIds: '',
      // 事件
      upform: {
        eventName: '',
        threatLevel: '',
        // 提交人
        handler: '',
      },
    }
  },
  computed: {
    page() {
      return getCurrentUserAlarmList
    },
    head() {
      return [
        {
          prop: 'alarm_level',
          label: '告警级别',
        },
        {
          prop: 'alarm_name',
          label: '告警名称',
        },
        {
          prop: 'alarm_time',
          label: '告警时间',
        },
        {
          prop: 'alarm_type',
          label: '告警类型',
        },
        {
          prop: 'src_ips',
          label: '源IP',
        },
        {
          prop: 'attack_stage',
          label: '攻击阶段',
        },
      ]
    },
    // notHandleComputed() {
    //   return this.alarmData.notHandle[1]
    // },
    handCom() {
      return this.alarmData.handled[1]
    },
    GAP: () => +LAYOUT.gap,
    LEVEL: () => LEVEL,
    LOGTYPE: () => {
      return LOGTYPE
    },
    STATUS: () => STATUS,
    DATE_TIME: () => DATE_TIME,
    MYLOGTYPE: () => MYLOGTYPE,
  },
  methods: {
    clearAll() {
      this.query = {}
    },
    dateFormatter(val) {
      if (val) {
        this.query.startTime = val[0]
        this.query.endTime = val[1]
      } else {
        this.query.startTime = null
        this.query.endTime = null
      }
      // this.query.startTime = this.date
    },
    // handleSizeChange(val) {
    //   this.query.pageSize = val
    //   this.getTableData()
    // },
    // handleCurrentChange(val) {
    //   this.query.page = val
    //   this.getTableData()
    // },
    // formatterAlerm(row) {
    //   console.log(row)
    // },
    // clearWord() {
    //   this.query = {
    //     page: 1,
    //     pageSize: 10,
    //     searchInfo: null,
    //     logLevel: null,
    //     endTime: null,
    //     startTime: null,
    //     secwarnLevel: null,
    //     secwarnType: null,
    //     secwarnstatus: null,
    //   }
    //   this.date = ['', '']
    //   this.getTableData()
    // },
    // getTableData() {
    //   this.tableLoading = true
    //   if (this.date) {
    //     this.query.startTime = this.date[0]
    //     this.query.endTime = this.date[1]
    //   } else {
    //     this.query.startTime = null
    //     this.query.endTime = null
    //   }
    //   getCurrentUserAlarmList(this.query).then(res => {
    //     if (res.data.body.list) {
    //       this.tableData = res.data.body.list
    //     } else {
    //       this.tableData = []
    //     }
    //     this.total = res.data.body.total
    //   }).finally(() => { this.tableLoading = false })
    // },
    shiftDetail(row) {
      this.$router.push({
        path: 'securityWarning/detail',
        query: {
          id: `${row.alarm_id}`,
          status: `${row.alarm_stat}`,
          relAlarmInfo: `${row.alarm_name}`,
        },
      })
    },
    // selectChange() {
    //   this.getTableData()
    // },
  },
  created(): void {
    // this.getTableData()
    getAlarmLevelStatistics().then((res) => {
      // console.log(res.data.body)
      this.notHandle = res.data.body || {}
      // this.alarmData.total = res.data.body.sum
    })
    getAlarmNotHandleStatistics().then(res => {
      this.waitHandle = res.data.body || {}
    })
    getAlarmHandledStatistics().then(res => {
      // 已处理的数字 高 中 低
      this.alarmData.handled = res.data.body
    })
    getAlarmTodayStatistics().then(res => {
      // console.log(res.data.body)
      // if (res.data.body) {
      this.alarmData.today = res.data.body || {}
      // }
    })
    getSecurityLogStatistics().then(res => {
      // eslint-disable-next-line camelcase
      this.yjcl = res?.data?.body?.total_count // 已处理日志
      // console.log(res.data.body)
      // if (res.data.body) {
      //   this.alarmData.total = res.data.body.total
      // }
    })
  },

}
</script>

<style lang='scss'>
  @import '~element-ui/packages/theme-chalk/src/date-picker';
  @import '~element-ui/packages/theme-chalk/src/table';
  @import '~element-ui/packages/theme-chalk/src/table-column';
  @import '~element-ui/packages/theme-chalk/src/pagination';
  @import '~element-ui/packages/theme-chalk/src/tabs';
  @import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang='scss' module>
  .myGap {
    width: 80px;
    margin-top: 15px;
    font-weight: 600;
    font-size: 20px;
    text-align: center;
  }

  .myCll {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    height: 100px;
  }

  .myStyle {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: 250px;
  }

  .qingkong {
    margin-left: 15px;
    color: #5992d3;
    cursor: pointer;
  }

  .paddingBox {
    margin: 0 21px;
  }

  .xiangqing {
    color: #5992d3;
    cursor: pointer;
  }

  .total {
    display: flex;
    align-items: center;
    height: 116px;
    margin-bottom: 30px;
  }

  .bgcolor {
    display: flex;
    align-items: center;
    height: 116px;
    background: linear-gradient(90deg, $colorTheme5, $colorWhite);
  }

  .myP {
    margin: 0;
  }

  .totalSpan {
    font-weight: bold;
    font-size: 32px;
  }

  .myRow {
    margin: 20px 0;
  }

  //   5: '很高',
  //   4: '高',
  //   3: '中',
  //   2: '低',
  //   1: '信息',
  .l5,
  .red {
    color: $colorDanger;
  }

  .l4,
  .yellow {
    color: $colorTheme;
  }

  .l3,
  .yellow2 {
    color: $colorWarn;
  }

  .l2,
  .green {
    color: $colorSuccess;
  }

  .l1,
  .gary {
    color: $colorInfo;
  }

  .l1,
  .l2,
  .l3,
  .l4,
  .l5,
  .l0 {
    width: 85px;
  }

  .red,
  .green,
  .yellow,
  .yellow2,
  .gary {
    font-weight: bold;
    font-size: 24px;
  }

  .c5 {
    background-color: $colorDanger;
  }

  .c4 {
    background-color: $colorTheme;
  }

  .c3 {
    background-color: $colorWarn;
  }

  .c2 {
    background-color: $colorSuccess;
  }

  .c1 {
    background-color: $colorInfo;
  }

  .colAlign {
    display: flex;
    align-items: center;
  }

  .progress {
    width: 70%;
    height: 12px;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 6px;
  }

  .all {
    width: 120px;
  }

  .logLel {
    display: flex;
  }

  .upgrade {
    color: rgba(245, 108, 108, 1);
  }

  .dispose {
    color: rgba(104, 194, 58, 1);
  }

  .neglect {
    color: rgba(214, 214, 214, 1);
  }

  .disposal {
    color: rgba(249, 166, 85, 1);
  }
  // 升级事件
  .pdter {
    padding: 0 24px;
  }

  .inputbox {
    width: 314px;
  }

</style>
