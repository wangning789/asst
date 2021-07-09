<template>
  <div>
    <ElRow>
      <!-- 巡检标题 -->
      <ElCol :span="24">
        <ElRow :class="$style.checkTitle">
          <!-- {{ isToday }} -->
          <ElCol :span="8">
            当前巡检周期：<span
              v-show="changeCheck"
              :class="$style.fontBold20"
            >
              {{ recordCycleTime || '————' }}</span>
            <ElDatePicker
              v-show="changeDate"
              v-model="value1"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间"
              :format="DATE_TIME.serverDate"
              :value-format="DATE_TIME.timestamp"
              @change="commitTime"
            />
            <ElButton
              v-show="changeCheck"
              size="mini"
              type="primary"
              plain
              style="margin-left: 24px;"
              @click=";(changeCheck = false), (changeDate = true)"
            >
              切换巡检周期
            </ElButton>
          </ElCol>
          <ElCol :span="4">
            巡检频率：<span :class="$style.fontBold20">{{
              inspectionCycle.inspectionCycleName || ''
            }}</span>
          </ElCol>
          <ElCol :span="4">
            未巡检：<span
              style="color: #e6a23c;"
              :class="$style.fontBold20"
            >{{
              noInspection
            }}</span>
          </ElCol>
          <ElCol :span="4">
            巡检异常：<span
              style="color: #f56c6c;"
              :class="$style.fontBold20"
            >{{
              abnormal
            }}</span>
          </ElCol>
          <ElCol
            style="border: none;"
            :span="4"
          >
            巡检正常：<span
              style="color: #68c23a;"
              :class="$style.fontBold20"
            >{{
              normal
            }}</span>
          </ElCol>
        </ElRow>
      </ElCol>
      <!-- 巡检列表标题 -->
      <ElCol
        :class="$style.checkListTitle"
        :span="24"
      >
        <h3>本期巡检设备</h3>
      </ElCol>
      <!-- 巡检列表 -->
      <ElCol :span="24">
        <ElForm
          :inline="true"
          :label-width="CONFIG.labelWidth"
        >
          <ElFormItem label="安全产品名称：">
            <ElInput
              v-model="filterForm.assetName"
              clearable
              placeholder="请输入安全产品名称"
            />
          </ElFormItem>
          <ElFormItem label="巡检状态：">
            <ElSelect
              v-model="filterForm.safetyInspectionStatus"
              clearable
              placeholder="请选择巡检状态"
            >
              <ElOption
                v-for="(val, key) in INSPECTIONSTATUS"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="巡检时间：">
            <ElDatePicker
              v-model="date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :format="DATE_TIME.serverDateTime"
              :value-format="DATE_TIME.timestamp"
              @change="
                ;[
                  filterForm.inspectionStartTime,
                  filterForm.inspectionEndTime,
                ] = $event || ['', '']
              "
            />
          </ElFormItem>
        </ElForm>
      </ElCol>
      <ElCol :span="24">
        <ITable
          ref="table"
          :head="head"
          :get="getList"
          :query="filterForm"
        >
          <ElTableColumn label="操作">
            <template #default="{ row }">
              <ElButton
                type="text"
                @click="routeTo(row)"
              >
                登入
              </ElButton>
              <ElButton
                v-show="authFit(ROLES.opertateMaintenance)"
                type="text"
                @click="addRecord(row)"
              >
                {{
                  row.safetyInspectionStatus === 'SYS_WAIT_INSPECTION_3'
                    ? '添加巡检记录'
                    : '巡检记录'
                }}
              </ElButton>
              <ElButton
                v-show="authFit(ROLES.projectManager)"
                type="text"
                @click="addRecord(row)"
              >
                巡检记录
              </ElButton>
            </template>
          </ElTableColumn>
        </ITable>
      </ElCol>
    </ElRow>

    <RecordDialog
      :visible-record.sync="visibleRecord"
      :record="record"
      @success="refreshTable"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import RecordDialog from './inspectionRecord'
import { STORAGE, ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'
import {
  getSafetyInspectionRecord,
  getSafetyInspectionCycle,
  getSafetyInspectionRecordStat,
  getSafetyInspectionRecordCycle,
} from '@/api/dailyInspection/dailyInspection'
import getCode from '@/enums/code'
import { local } from '@/utils/storage'
import { decode } from '@/functions/cipher'
import { fmtDate, formatDate } from './enums'
const info = local.get(STORAGE.me, decode) as User
const INSPECTIONSTATUS = getCode('1', 'SYS_SAFETY_INSPECTION_STATUS')
const INSPECTIONRESULTS = getCode('1', 'SYS_Inspection_results')
export default {
  components: { ITable, ElTableColumn, RecordDialog },
  data() {
    return {
      filterForm: {
        safetyInspectionType: 'SYS_SECURITY_INSPECTION',
        safetyInspectionCycleId: '',
        safetyInspectionTypeName: '',
        inspectionStartTime: '',
        inspectionEndTime: '',
        assetName: '',
        assetType: '',
        today: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
      },
      visibleRecord: false,
      value1: '',
      changeCheck: true,
      changeDate: false,
      inspectionCycle: {},
      recordCycleTime: '————',
      date: [],
      abnormal: '',
      noInspection: '',
      normal: '',
      record: {},
      safetyInspectionCycleId: '',
      todayTime: 0,
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    INSPECTIONSTATUS: () => INSPECTIONSTATUS.value,
    INSPECTIONRESULTS: () => INSPECTIONRESULTS.value,
    ROLES: () => ROLES,
    isToday() {
      if (this.value1 === this.todayTime) {
        return false
      } else {
        return true
      }
    },
    // yymmdd转时间戳
    getTodayTimestamp() {
      const today = new Date()
      let month = today.getMonth() + 1
      month = month < 10 ? '0' + month : month
      const tdstr = today.getFullYear() + '/' + month + '/' + today.getDate()
      const date = new Date(Date.parse(tdstr))
      const tdtsp = Number(date)
      return tdtsp
    },
    getList() {
      return getSafetyInspectionRecord
    },
    head: () => [
      {
        prop: 'assetName',
        label: '安全产品名称',
      },
      {
        prop: 'assetType',
        label: '类型',
      },
      {
        prop: 'networkTypeCodeName',
        label: '部署网络环境',
      },
      {
        prop: 'assetUnitName',
        label: '所属单位',
      },
      {
        label: '所在巡检周期',
        formatter: (row) => {
          const a =
            fmtDate(row.inspectionStartTime) +
            '~' +
            fmtDate(row.inspectionEndTime)
          return a
        },
      },
      {
        prop: 'inspectionCompleteTime',
        label: '巡检时间',
        formatter: (row) => {
          if (row.inspectionCompleteTime !== null) {
            return formatDate(row.inspectionCompleteTime)
          }
        },
      },
      {
        prop: 'safetyInspectionStatus',
        label: '巡检状态',
        formatter: (row) => INSPECTIONSTATUS.value[row.safetyInspectionStatus],
      },
      {
        prop: 'safetyInspectionResults',
        label: '巡检结果',
        formatter: (row) =>
          INSPECTIONRESULTS.value[row.safetyInspectionResults],
      },
    ],
  },
  watch: {
    safetyInspectionCycleId(val) {
      this.getStat(this.value1, val)
      this.getRecordCycle(val, this.value1)
      // this.filterForm.today = this.getTodayTimestamp
    },
  },
  methods: {
    addRecord(row) {
      this.visibleRecord = true
      if (this.authFit(ROLES.opertateMaintenance)) {
        row.inspectionUserName = info.aliasName
      }
      row.inspectionUserId = info.id
      this.record = JSON.parse(JSON.stringify(row))
    },
    routeTo(row) {
      if (!row.assetAddress) {
        this.$notify.error('当前行没有管理地址不能登入')
        return false
      }
      window.open(row.assetAddress)
    },
    refreshTable() {
      ;(this.$refs.table as any).fetch()
      this.getStat(this.getTodayTimestamp, this.safetyInspectionCycleId)
    },
    commitTime() {
      this.changeCheck = true
      this.changeDate = false
      if (this.value1 === null) {
        this.value1 = this.getTodayTimestamp
      }
      this.getCycle(this.value1)
      this.getStat(this.value1, this.safetyInspectionCycleId)
      this.getRecordCycle(this.safetyInspectionCycleId, this.value1)
      this.filterForm.today = this.value1
      this.refreshTable()
    },
    // 时间戳转yymmdd
    fmtDate(obj) {
      const date = new Date(obj)
      const y = 1900 + date.getYear()
      const m = '0' + (date.getMonth() + 1)
      const d = '0' + date.getDate()
      return (
        y +
        '-' +
        m.substring(m.length - 2, m.length) +
        '-' +
        d.substring(d.length - 2, d.length)
      )
    },
    getCycle(obj) {
      getSafetyInspectionCycle({
        safetyInspectionType: 'SYS_SECURITY_INSPECTION',
        today: obj,
      }).then((res) => {
        this.inspectionCycle = res.data.body[0] || {}
        this.safetyInspectionCycleId = this.inspectionCycle.id
        this.filterForm.safetyInspectionCycleId = this.inspectionCycle.id
        if (res.data.body === []) {
          this.inspectionCycle.inspectionCycleName = '———'
        }
        if (!this.inspectionCycle.inspectionStartTime) {
          this.inspectionCycle.inspectionCycleName = '———'
          this.abnormal = '———'
          this.noInspection = '———'
          this.normal = '———'
          this.safetyInspectionCycleId = ''
          this.filterForm.safetyInspectionCycleId = ''
        }
      })
    },
    getStat(obj, obj1) {
      getSafetyInspectionRecordStat({
        safetyInspectionType: 'SYS_SECURITY_INSPECTION',
        today: obj,
        safetyInspectionCycleId: obj1,
      }).then((res) => {
        this.abnormal = res.data.body.abnormal || '———'
        this.noInspection = res.data.body.noInspection || '———'
        this.normal = res.data.body.normal || '———'
      })
    },
    getRecordCycle(obj, obj1) {
      getSafetyInspectionRecordCycle({
        cycleId: obj,
        today: obj1,
      }).then(res => {
        this.recordCycleTime = res.data.body
      })
    },
  },
  created() {
    this.getCycle(this.getTodayTimestamp)
    this.todayTime = this.getTodayTimestamp
    this.value1 = this.getTodayTimestamp
    this.filterForm.today = this.getTodayTimestamp
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
<style lang="scss" module>
.fontBold20 {
  font-weight: bold;
  font-size: 20px;
}

.checkTitle {
  display: flex;
  align-items: center;
  height: 68px;
  margin: 20px 0;
  background: #f9fafb;

  :global(.el-col) {
    height: 40px;
    padding: 0 2%;
    line-height: 40px;
    border-right: 1px solid #e2e2e2;
  }
}

.checkListTitle {
  display: flex;
  justify-content: space-between;
}
</style>
