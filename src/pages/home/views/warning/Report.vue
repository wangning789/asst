<!-- 告警列表 -->
<template>
  <div :class="$style.wrapper">
    <!-- 统计 -->
    <ElRow>
      <ElCol
        :span="12"
        :class="[$style.total, $style.sum]"
      >
        <ElCol
          :span="6"
          :class="$style.bgcolor"
        >
          <ISVG
            icon="i-aqgj"
            size="40px"
          />
          <div :class="$style.count">
            <p :class="$style.myP">
              告警总数
            </p>
            <span :class="$style.totalSpan">{{ format(statisLis.total_count) }}</span>
          </div>
        </ElCol>
        <!-- 右边进度条 -->
        <ElCol
          :span="16"
          :offset="1"
        >
          <ElRow>
            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>严重</label>
              <span :class="$style.gary">{{ format(statisLis.high) }}</span>
            </ElCol>

            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>高危</label>
              <span :class="$style.green">{{ format(statisLis.half_middle) }}</span>
            </ElCol>

            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>中危</label>
              <span :class="$style.yellow2">{{ format(statisLis.middle) }}</span>
            </ElCol>

            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>低危</label>
              <span :class="$style.yellow">{{ format(statisLis.low) }}</span>
            </ElCol>
          </ElRow>
          <!-- 进度条 -->
          <ElRow
            type="flex"
            :class="$style.progress"
          >
            <ElCol
              :span="high"
              :class="$style.c5"
            />
            <ElCol
              :span="low"
              :class="$style.c3"
            />
            <ElCol
              :span="middle"
              :class="$style.c4"
            />
            <ElCol
              :span="halfMiddle"
              :class="$style.c2"
            />
          </ElRow>
        </ElCol>
      </ElCol>

      <ElCol
        :span="12"
        :class="[$style.total, , $style.status]"
      >
        <ElCol
          :span="6"
          :class="$style.bgcolor"
        >
          <ISVG
            icon="i-czzt"
            size="40px"
          />
          <div :class="$style.count">
            <p :class="$style.myP">
              处置状态
            </p>
          </div>
        </ElCol>
        <!-- 右边进度条 -->
        <ElCol
          :span="16"
          :offset="1"
        >
          <ElRow>
            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>告警升级</label>
              <span :class="$style.red">{{ format(dispose.warn_update) }}</span>
            </ElCol>
            <!-- 处置 -->
            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>待处置</label>
              <span :class="$style.yellow">{{ format(dispose.pengding) }}</span>
            </ElCol>
            <!-- 已处理 -->
            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>已处置</label>
              <span :class="$style.green">{{ format(dispose.handled) }}</span>
            </ElCol>
            <!-- 忽略 -->
            <ElCol
              :span="6"
              :class="$style.colAlign"
            >
              <label>已忽略</label>
              <span :class="$style.green">{{ format(dispose.ignore) }}</span>
            </ElCol>
          </ElRow>
          <!-- 处置进度条 -->
          <!-- <ElRow
            type="flex"
            :class="$style.progress"
          >
            <ElCol
              :span="warnUpdate"
              :class="$style.c5"
            />
            <ElCol
              :span="pengding"
              :class="$style.c2"
            />
            <ElCol
              :span="handled"
              :class="$style.c3"
            />
            <ElCol
              :span="ignore"
              :class="$style.c4"
            />
          </ElRow> -->
        </ElCol>
      </ElCol>
    </ElRow>

    <div class="el-card">
      <!-- 级别 -->
      <ElRow :class="$style.myRow">
        <span>告警级别：</span>
        <ElCheckbox
          v-model="levALl"
          :indeterminate="levIndeterminate"
          @change="levCheckAllChange"
        >
          全部
        </ElCheckbox>

        <ElCheckboxGroup
          v-model="form.secwarnLevels"
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
      </ElRow>

      <!-- 类型 -->
      <ElRow :class="$style.myRow">
        <span>告警类型：</span>
        <ElCheckbox
          v-model="typeALl"
          :indeterminate="typeIndeterminate"
          @change="typeCheckAllChange"
        >
          全部
        </ElCheckbox>

        <ElCheckboxGroup
          v-model="form.secwarnTypes"
          @change="typeCheckChange"
        >
          <ElCheckbox
            v-for="item in LOGTYPE"
            :key="item"
            :label="item"
          >
            {{ item }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </ElRow>
      <!-- 状态 -->
      <ElRow :class="$style.myRow">
        <span>告警状态：</span>
        <ElCheckbox
          v-model="status"
          :indeterminate="statusIndeterminate"
          @change="statusAllChange"
        >
          全部
        </ElCheckbox>

        <ElCheckboxGroup
          v-model="form.secwarnstatuss"
          @change="statusChange"
        >
          <ElCheckbox
            v-for="(name, value) in STATUS"
            :key="value"
            :class="$style['l' + value]"
            :label="value"
          >
            {{ name }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </ElRow>
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
            @change="[form.startTime, form.endTime] = $event || []"
          />
        </ElFormItem>
      </ElForm>

      <!-- 表格 -->
      <ITable
        ref="table"
        :get="page"
        :query="query"
        :head="head"
      >
        <ElTableColumn
          fixed="right"
          label="操作"
          width="100"
        >
          <template #default="{ row }">
            <span
              class="el-link el-link--primary"
              append
              @click="rout(row)"
            >
              详情
            </span>

            <template v-if="row.alarm_stat === '1'">
              <span
                class="el-link el-link--primary"
                @click="handleOrder(row)"
              >
                处置
              </span>
            </template>
          </template>
        </ElTableColumn>
      </ITable>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ITable, { ElTableColumn } from '@com/Table'
import ISVG from '@com/Icon'

import { stalist, detaList, saveAlarmDispositionMsg } from '@/api/servicePlatform/safety'
import getCode, { codeType, userCode } from '@/enums/code'
import formatNumber from '@/utils/formatNumber'
import { DATE_TIME } from '@/enums/format'
import { LEVEL, STATUS, getAlarmLevel } from './enums'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const TYPE = getCode(codeType.sys, userCode.SECURITYALARM)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, ElDatePicker, ISVG },
  data() {
    return {
      // 级别多选
      levALl: false,
      levIndeterminate: false,
      // 类型多选
      typeALl: false,
      typeIndeterminate: false,
      // 类型多选
      status: false,
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
      date: ['', ''],
      // 数
      statisLis: {},
      // 处置统计
      dispose: {},
      totalCount: '',
    }
  },
  computed: {
    LEVEL: () => LEVEL,
    LOGTYPE: () => TYPE.value,
    STATUS: () => STATUS,
    DATE_TIME: () => DATE_TIME,
    head() {
      return [
        {
          label: '告警名称',
          formatter: row => this.$createElement(
            'span',
            {
              props: { to: `${row.id}/info#b`, append: true },
            },
            row.alarm_name
          ),
        },
        { prop: 'alarm_type', label: '告警类型' },
        {
          label: '告警级别',
          formatter: row => {
            row = getAlarmLevel(row)
            return this.$createElement('span', { class: row.class }, row.text)
          },
        },
        {
          label: '状态',
          formatter: row => {
            const STY = this.$style
            let className = ''
            let text = ''
            switch (+row.alarm_stat) {
              case 3:
                className = STY.dispose
                text = '已经处置'
                break
              case 2:
                className = STY.upgrade
                text = '警告升级'
                break
              case 1:
                className = STY.disposal
                text = '待处置'
                break
              default:
                className = STY.neglect
                text = '已忽略'
            }
            return this.$createElement('span', { class: className }, text)
          },
        },
        { prop: 'alarm_time', label: '创建时间' },
        { prop: 'alarm_time', label: '更新时间' },
      ]
    },
    query() {
      const form = this.form
      const result = {}
      let key
      let value
      for (key in form) {
        value = form[key]
        Array.isArray(value) && !value.length && (value = null)
        result[key] = value
      }
      return result
    },
    // 告警
    high() {
      return parseInt(this.statisLis.high / this.totalCount * 24)
    },
    halfMiddle() {
      return parseInt(this.statisLis.half_middle / this.totalCount * 24)
    },
    middle() {
      return parseInt(this.statisLis.middle / this.totalCount * 24)
    },
    low() {
      return parseInt(this.statisLis.low / this.totalCount * 24)
    },
    // 处置
    // warnUpdate() {
    //   return parseInt(this.dispose.warn_update / this.disTotalCount * 24)
    // },
    // pengding() {
    //   return parseInt(this.dispose.pengding / this.disTotalCount * 24)
    // },
    // handled() {
    //   return parseInt(this.dispose.handled / this.disTotalCount * 24)
    // },
    // ignore() {
    //   return parseInt(this.dispose.ignore / this.disTotalCount * 24)
    // },
  },
  methods: {
    handleOrder(row) {
      this.$confirm('确定改变处置状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        saveAlarmDispositionMsg(row.alarm_id, '3').then(res => {
          if (res.data.status) {
            this.$message({
              message: '处置状态改变成功',
              type: 'success',
            })
            ;(this.$refs.table as any).fetch()
          }
        })
      })
    },
    rout(row) {
      this.$router.push({
        path: `/alarm/${row.alarm_id}/info`,
        query: {
          relAlarmInfo: `${row.alarm_name}`,
        },
      })
    },
    page: detaList,
    format: formatNumber,
    levCheckAllChange(val) {
      this.form.secwarnLevels = val ? Object.keys(LEVEL) : []
      this.levIndeterminate = false
    },
    levCheckChange(value) {
      this.form.secwarnLevels = value
      const len = Object.keys(LEVEL).length
      this.levALl = value.length === len
      this.levIndeterminate = value.length > 0 && !this.levALl
    },
    // 类型
    typeCheckAllChange(val) {
      this.form.secwarnTypes = val ? Object.values(this.LOGTYPE) : []
      this.typeIndeterminate = false
    },
    typeCheckChange(value) {
      this.form.secwarnTypes = value
      const lens = Object.keys(this.LOGTYPE).length
      this.typeALl = value.length === lens
      this.typeIndeterminate = value.length > 0 && !this.typeALl
    },
    // 状态
    statusAllChange(val) {
      this.form.secwarnstatuss = val ? Object.keys(STATUS) : []
      this.statusIndeterminate = false
    },
    statusChange(value) {
      this.form.secwarnstatuss = value
      const lenlis = Object.keys(STATUS).length
      this.status = value.length === lenlis
      this.statusIndeterminate = value.length > 0 && !this.status
    },
  },
  created() {
    stalist().then(res => {
      // 告警
      this.statisLis = res.data.body.warn_sum_count
      // 处置
      this.dispose = res.data.body.warn_sta_sum_count
      // 告警总数统计
      this.totalCount = res.data.body.warn_sum_count.total_count
      // 处置总数统计---无总数字段
      // this.disTotalCount = res.data.body.body.warn_sta_sum_count.total_count
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
      width: calc(100% - #{182px + $gapNormal * 2});
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

  :global(.el-link + .el-link) {
    margin-left: $gapNormal / 2;
  }
}

.logBox {
  padding: 20px 0;
}

.total {
  display: flex;
  align-items: center;
  height: 116px;
  margin-bottom: $gapNormal;
  background: $colorWhite;
  border: $borderBase;
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
  margin-left: 20px;
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
  }
}

.sum,
.status {
  width: calc(50% - #{$gapNormal / 2});
}

.sum {
  margin-right: $gapNormal / 2;

  .colAlign > label {
    width: 35px;
  }
}

.status {
  margin-left: $gapNormal / 2;

  .colAlign > label {
    width: 60px;
  }
}

.progress {
  height: $gapNormal / 2;
  margin-top: $gapNormal / 2;
  overflow: hidden;
  background: $colorBackGround;
  border-radius: $gapNormal / 4;
}

.all {
  width: 120px;
}

.logLel {
  display: flex;
}

.upgrade {
  color: $colorDanger;
}

.dispose {
  color: $colorSuccess;
}

.neglect {
  color: $colorInfo;
}

.disposal {
  color: $colorWarn;
}

.bottomBox {
  margin-bottom: 20px;
}
</style>
