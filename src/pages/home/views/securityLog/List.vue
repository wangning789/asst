<!-- 日志列表 -->
<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">
      <!-- 统计 -->
      <ElRow :class="$style.total">
        <ElCol
          :span="5"
          :class="$style.bgcolor"
        >
          <IIcon
            icon="i-rzsl"
            size="40px"
          />
          <div :class="$style.count">
            <p :class="$style.myP">
              日志总数
            </p>
            <span :class="$style.totalSpan">{{
              format(logCount.total_count)
            }}</span>
          </div>
        </ElCol>

        <!-- 右边进度条 -->
        <ElCol
          :span="17"
          :offset="1"
        >
          <ElRow>
            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>信息</label>
              <span :class="$style.gary">{{ format(logCount.info) }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>低</label>
              <span :class="$style.green">{{ format(logCount.low) }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>中</label>
              <span :class="$style.yellow2">{{ format(logCount.middle) }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>高</label>
              <span :class="$style.yellow">{{ format(logCount.high) }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>很高</label>
              <span :class="$style.red">{{ format(logCount.very_high) }}</span>
            </ElCol>
          </ElRow>
          <!-- 进度条 -->
          <ElRow
            type="flex"
            :class="$style.progress"
          >
            <ElCol
              :span="info"
              :class="$style.c1"
            />
            <ElCol
              :span="low"
              :class="$style.c2"
            />
            <ElCol
              :span="middle"
              :class="$style.c3"
            />
            <ElCol
              :span="high"
              :class="$style.c4"
            />
            <ElCol
              :span="veryHigh"
              :class="$style.c5"
            />
          </ElRow>
        </ElCol>
      </ElRow>
      <ElRow :class="$style.total">
        <!-- 统计今日 -->
        <ElCol
          :span="6"
          :class="$style.bgcolor"
        >
          <IIcon
            icon="i-rzsl"
            size="40px"
          />
          <div :class="$style.count">
            <p :class="$style.myP">
              今日新增
            </p>
            <span :class="$style.totalSpan">{{
              format(todayLogCount.total_count)
            }}</span>
          </div>
        </ElCol>

        <!-- 右边进度条 -->
        <ElCol
          :span="16"
          :offset="1"
        >
          <ElRow>
            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>信息</label>
              <span :class="$style.gary">{{ format(todayLogCount.info) }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>低</label>
              <span :class="$style.green">{{ format(todayLogCount.low) }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>中</label>
              <span :class="$style.yellow2">{{
                format(todayLogCount.middle)
              }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>高</label>
              <span :class="$style.yellow">{{
                format(todayLogCount.high)
              }}</span>
            </ElCol>

            <ElCol
              :span="4"
              :class="$style.colAlign"
            >
              <label>很高</label>
              <span :class="$style.red">{{
                format(todayLogCount.very_high)
              }}</span>
            </ElCol>
          </ElRow>
          <!-- 进度条 -->
          <ElRow
            type="flex"
            :class="$style.progress"
          >
            <ElCol
              :span="info1"
              :class="$style.c1"
            />
            <ElCol
              :span="low1"
              :class="$style.c2"
            />
            <ElCol
              :span="middle1"
              :class="$style.c3"
            />
            <ElCol
              :span="high1"
              :class="$style.c4"
            />
            <ElCol
              :span="veryHigh1"
              :class="$style.c5"
            />
          </ElRow>
        </ElCol>
      </ElRow>
    </div>

    <div class="el-card">
      <!-- 日志级别 -->
      <div :class="$style.myRow">
        <span>日志级别：</span>
        <ElCheckbox
          v-model="levALl"
          :indeterminate="levIndeterminate"
          @change="levCheckAllChange"
        >
          全部
        </ElCheckbox>

        <ElCheckboxGroup
          v-model="form.seclogLevels"
          @change="levCheckChange"
        >
          <ElCheckbox
            v-for="(name, value) in LEVEL"
            :key="value"
            :class="$style['l' + value]"
            :label="value"
          >
            {{ name }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </div>

      <!-- 日志类型 -->
      <div :class="$style.myRow">
        <span>日志类型：</span>
        <ElCheckbox
          v-model="typeALl"
          :indeterminate="typeIndeterminate"
          @change="typeCheckAllChange"
        >
          全部
        </ElCheckbox>

        <ElCheckboxGroup
          v-model="form.seclogTypes"
          @change="typeCheckChange"
        >
          <ElCheckbox
            v-for="item in typeLevel"
            :key="item"
            :label="item"
          >
            {{ item }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </div>

      <!-- 其他筛选 -->
      <ElForm inline>
        <ElFormItem label="关键字查询：">
          <ElInput
            v-model="form.searchInfo"
            clearable
            placeholder="请输入关键字"
          />
        </ElFormItem>

        <ElFormItem label="日期查询：">
          <ElDatePicker
            v-model="date"
            clearable
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
            @change=";[form.startTime, form.endTime] = $event || []"
          />
        </ElFormItem>
      </ElForm>
      <!-- 表格 -->
      <ITable
        :get="page"
        :query="form"
        :head="head"
      >
        <template #prefix>
          <ElTableColumn
            prop="log_name"
            label="日志名称"
          >
            <template #default="{ row }">
              <RouterLink
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/info`"
              >
                {{ row.log_name }}
              </RouterLink>
            </template>
          </ElTableColumn>
        </template>
      </ITable>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ITable, { ElTableColumn } from '@com/Table'
import IIcon from '@com/Icon'

import { selectLog, selectTotal } from '@/api/servicePlatform/safety'
import formatNumber from '@/utils/formatNumber'
import { DATE_TIME } from '@/enums/format'
import { LEVEL, getLogLevel } from './enums'
import getCode, { codeType, userCode } from '@/enums/code'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const logTypeOptions = getCode(codeType.sys, userCode.SECURITYLOG)
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, ElDatePicker, IIcon },
  data() {
    return {
      // 日志级别多选
      levALl: false,
      levIndeterminate: false,
      // 日志类型多选
      typeALl: false,
      typeIndeterminate: false,
      // 筛选数据
      form: {
        logLevel: [],
        seclogTypes: [],
        seclogLevels: [],
        searchInfo: '',
        startTime: '',
        endTime: '',
      },
      // 日志数
      logCount: {},
      totalCount: '',
      date: ['', ''],
      todayLogCount: {},
      todayTotalCount: '',
    }
  },
  computed: {
    LEVEL: () => LEVEL,
    DATE_TIME: () => DATE_TIME,
    typeLevel: () => logTypeOptions.value,
    head() {
      return [
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
        { prop: 'log_data_source', label: '日志来源' },
      ]
    },
    info() {
      return parseInt((this.logCount.info / this.totalCount) * 24)
    },
    low() {
      return parseInt((this.logCount.low / this.totalCount) * 24)
    },
    middle() {
      return parseInt((this.logCount.middle / this.totalCount) * 24)
    },
    high() {
      return parseInt((this.logCount.high / this.totalCount) * 24)
    },
    veryHigh() {
      return parseInt((this.logCount.very_high / this.totalCount) * 24)
    },

    info1() {
      return parseInt((this.todayLogCount.info / this.todayTotalCount) * 24)
    },
    low1() {
      return parseInt((this.todayLogCount.low / this.todayTotalCount) * 24)
    },
    middle1() {
      return parseInt((this.todayLogCount.middle / this.todayTotalCount) * 24)
    },
    high1() {
      return parseInt((this.todayLogCount.high / this.todayTotalCount) * 24)
    },
    veryHigh1() {
      return parseInt(
        (this.todayLogCount.very_high / this.todayTotalCount) * 24
      )
    },
  },
  methods: {
    page: selectLog,
    format: formatNumber,
    levCheckAllChange(val) {
      this.form.seclogLevels = val ? Object.keys(LEVEL) : []
      this.levIndeterminate = false
    },
    levCheckChange(value) {
      this.form.seclogLevels = value
      const len = Object.keys(LEVEL).length
      this.levALl = value.length === len
      this.levIndeterminate = value.length > 0 && !this.levALl
    },
    typeCheckAllChange(val) {
      this.form.seclogTypes = val ? Object.values(logTypeOptions.value) : []
      this.typeIndeterminate = false
    },
    typeCheckChange(value) {
      const checkedCount = value.length
      const allLength = Object.keys(this.typeLevel).length
      this.typeALl = checkedCount === allLength
      this.typeIndeterminate = checkedCount > 0 && checkedCount < allLength
    },
  },
  created() {
    selectTotal().then(res => {
      this.logCount = res.data.body.log_sum_count
      this.totalCount = res.data.body.log_sum_count.total_count
      // 今天
      this.todayLogCount = res.data.body.log_sum_count_today
      this.todayTotalCount = res.data.body.log_sum_count_today.total_count
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.myRow {
  margin-bottom: $gapNormal;

  > span {
    display: inline-block;
    width: 125px - $gapNormal / 2;
    padding-right: $gapNormal / 2;
    text-align: right;
  }

  :global {
    .el-checkbox-group {
      display: inline-block;
      width: calc(100% - #{180px + $gapNormal * 2});
      margin-left: $gapNormal * 2;
      vertical-align: middle;

      // stylelint-disable-next-line selector-max-compound-selectors
      > .el-checkbox {
        width: 85px;
        line-height: $gapNormal;
      }
    }
  }
}

.wrapper {
  padding: 0;

  > :global(.el-card) {
    padding: $gapNormal;
  }
}

.logBox {
  padding: 20px 0;
}

.total {
  display: flex;
  align-items: center;
  width: 49%;
  height: 116px;
  margin-bottom: $gapNormal;
  background: $colorWhite;
  border: $borderBase;
}

.title {
  display: flex;
  justify-content: space-between;
}

.bgcolor {
  display: flex;
  align-items: center;
  height: 116px;
  padding-left: $gapNormal;
  background: linear-gradient(90deg, $colorTheme5, $colorWhite);
}

.count {
  display: inline-block;
  margin-left: $gapNormal / 2;
}

.myP {
  margin: 0;
}

.totalSpan {
  font-weight: bold;
  font-size: 32px;
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

  > label {
    display: inline-block;
    width: 35px;
  }
}

.progress {
  height: $gapNormal / 2;
  margin-top: $gapNormal / 2;
  overflow: hidden;
  background: $colorBackGround;
  border-radius: $gapNormal / 4;
}

.logLel {
  display: flex;
}
</style>
