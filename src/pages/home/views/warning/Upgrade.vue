<!-- ni -->
<template>
  <div
    :class="$style.wrapper"
    class="el-card"
  >
    <div :class="$style.paddingBox">
      <h4>
        已选告警
      </h4>
      <!-- 升级列表 -->
      <ElRow>
        <ElCol
          :span="22"
          :offset="1"
        >
          <ITable
            :get="getChecked"
            @select="cancelChecked"
          >
            <ElTableColumn
              type="selection"
              width="55"
            />
            <!-- 已确认对接，后端没此字段 -->
            <ElTableColumn
              prop=""
              label="安全告警编号"
            />

            <ElTableColumn
              prop="alarm_create_time"
              label="创建时间"
            />

            <ElTableColumn
              prop="alarm_level"
              label="告警级别"
            />

            <ElTableColumn
              prop="alarm_sub_type"
              label="告警类型"
            />

            <ElTableColumn
              prop="alarm_name"
              label="告警名称"
            />

            <ElTableColumn
              prop="alarm_stat"
              label="状态"
            >
              <template #default="{ row }">
                <div
                  v-if="row.alarm_stat === '1'"
                  :class="$style.disposal"
                >
                  待处置
                </div>
                <div
                  v-else-if="row.alarm_stat === '2'"
                  :class="$style.upgrade"
                >
                  警告升级
                </div>
                <div
                  v-else-if="row.alarm_stat === '3'"
                  :class="$style.dispose"
                >
                  已经处置
                </div>
                <div
                  v-else
                  :class="$style.neglect"
                >
                  已忽略
                </div>
              </template>
            </ElTableColumn>
          </ITable>
        </ElCol>
      </ElRow>
      <!-- content -->
      <h4>告警列表</h4>
      <div>
        <!-- 级别 -->
        <ElRow :class="$style.myRow">
          <ElCol
            :span="2"
            :offset="1"
          >
            告警级别：
          </ElCol>

          <ElCol
            :span="21"
            :class="$style.logLel"
          >
            <ElCheckbox
              v-model="levALl"
              :indeterminate="levIndeterminate"
              :class="$style.all"
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
          </ElCol>
        </ElRow>

        <!-- 类型 -->
        <ElRow :class="$style.myRow">
          <ElCol
            :span="2"
            :offset="1"
          >
            告警类型：
          </ElCol>
          <ElCol
            :span="21"
            :class="$style.logLel"
          >
            <ElCheckbox
              v-model="typeALl"
              :class="$style.all"
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
                :class="$style.l0"
                :label="item"
              >
                {{ item }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </ElCol>
        </ElRow>
        <!-- 状态 -->
        <ElRow :class="$style.myRow">
          <ElCol
            :span="2"
            :offset="1"
          >
            告警状态：
          </ElCol>

          <ElCol
            :span="21"
            :class="$style.logLel"
          >
            <ElCheckbox
              v-model="status"
              :indeterminate="statusIndeterminate"
              :class="$style.all"
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
          </ElCol>
        </ElRow>
        <!-- 筛选条件 -->
        <ElRow :class="$style.myRow">
          <ElForm
            :model="form"
            inline
            :label-width="CONFIG.labelWidth"
          >
            <ElRow type="flex">
              <ElCol :span="1" />

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
            </ElRow>
          </ElForm>
        </ElRow>
        <!-- 渲染表格 -->
        <ElRow>
          <ElCol
            :span="22"
            :offset="1"
          >
            <ITable
              ref="table"
              :get="page"
              :query="query"
              :head="head"
              @select="tableclick"
            >
              <template #prefix>
                <ElTableColumn
                  type="selection"
                  width="55"
                />
              </template>
              <ElTableColumn
                prop="alarm_stat"
                label="状态"
              >
                <template #default="{ row }">
                  <div
                    v-if="row.alarm_stat === '1'"
                    :class="$style.disposal"
                  >
                    待处置
                  </div>
                  <div
                    v-else-if="row.alarm_stat === '2'"
                    :class="$style.upgrade"
                  >
                    警告升级
                  </div>
                  <div
                    v-else-if="row.alarm_stat === '3'"
                    :class="$style.dispose"
                  >
                    已经处置
                  </div>
                  <div
                    v-else
                    :class="$style.neglect"
                  >
                    已忽略
                  </div>
                </template>
              </ElTableColumn>
            </ITable>
          </ElCol>
        </ElRow>
      </div>
      <!-- 事件信息 -->
      <h4>
        事件信息填写
      </h4>
      <ElRow :class="$style.pdter">
        <ElForm
          :model="upform"
          label-width="80px"
        >
          <ElFormItem label="事件名称">
            <ElInput
              v-model="upform.eventName"
              placeholder="请输入内容"
              :class="$style.inputbox"
            />
          </ElFormItem>
          <ElFormItem label="威胁等级:">
            <ElSelect
              v-model="upform.threatLevel"
              placeholder="请选择"
            >
              <ElOption
                label="高"
                value="1"
              />
              <ElOption
                label="中"
                value="2"
              />
              <ElOption
                label="低"
                value="3"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="提交人:">
            <ElInput
              v-model="upform.handler"
              placeholder="请输入提交人"
              :class="$style.inputbox"
            />
          </ElFormItem>
        </ElForm>
      </ElRow>
      <!-- 按钮 -->
      <ElRow
        type="flex"
        class="row-bg"
        justify="center"
        :gutter="GAP"
      >
        <ElCol :span="2">
          <ElButton
            type="warning"
            @click="commitbutton"
          >
            提交
          </ElButton>
        </ElCol>
        <ElCol :span="2">
          <ElButton @click="commitcancel">
            取消
          </ElButton>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ITable, { ElTableColumn } from '@com/Table'

import { DATE_TIME } from '@/enums/format'
import { LEVEL, LOGTYPE, STATUS } from './enums'
import { updateAlarm, detaList } from '@/api/servicePlatform/safety'

import STYLE from '@/scss/status.module.scss'
import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, ElDatePicker },
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
      date: ['', ''],
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    LEVEL: () => LEVEL,
    LOGTYPE: () => LOGTYPE,
    STATUS: () => STATUS,
    DATE_TIME: () => DATE_TIME,
    head() {
      return [
        { prop: '', label: '安全告警编号' },
        { prop: 'alarm_create_time', label: '创建时间' },
        {
          prop: 'alarm_level',
          label: '告警级别',
          formatter: (row, col, cell) => {
            let className = ''
            switch (+row.alarm_level_cd) {
              case 5:
                className = STYLE.danger
                break
              case 4:
                className = STYLE.warn
                break
              case 3:
                className = STYLE.primary
                break
              case 2:
                className = STYLE.success
                break
            }
            return this.$createElement('span', { class: className }, cell)
          },
        },
        { prop: 'alarm_type', label: '告警类型' },
        { prop: 'alarm_name', label: '告警名称' },
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
    // 升级
    getChecked() {
      const checked = this.checked
      return () => Promise.resolve({ data: { body: checked } })
    },
  },
  methods: {
    page: detaList,
    // 全选
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
      this.form.secwarnTypes = val ? Object.values(LOGTYPE) : []
      this.typeIndeterminate = false
    },
    typeCheckChange(value) {
      this.form.secwarnTypes = value
      const lens = Object.keys(LOGTYPE).length
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

    // 下列表-升级 获取id
    tableclick(checked: any[]) {
      if (checked) {
        this.checked = checked
        this.alarmIds = checked.reduce(
          (prev, next) => (prev ? prev + ',' : prev) + next.id,
          ''
        )
      } else {
        this.$refs.form.clearSelection()
      }
    },
    cancelChecked(checked: any) {
      this.tableclick(
        this.checked.filter(
          checkedItem => !checked.find(
            cancelItem => {
              if (cancelItem.id === checkedItem.id) {
                this.$refs.table.$refs.table.toggleRowSelection(cancelItem)
                return true
              }
            }
          )
        )
      )
    },
    // 升级事件
    commitbutton() {
      this.UpgradeOptions = updateAlarm({
        alarmIds: this.alarmIds,
        eventName: this.upform.eventName,
        threatLevel: this.upform.threatLevel,
        handler: this.upform.handler,
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '提交安全事件完成！',
            type: 'success',
          })
        }
      })
    },
    //  取消
    commitcancel() {
      this.upform = ''
    },
  },

}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.paddingBox {
  margin: 0 21px;
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
