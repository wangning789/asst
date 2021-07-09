<!-- 描述 -->
<template>
  <div :class="'el-card ' + $style.wrapper">
    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        :inline="true"
        :label-width="CONFIG.labelWidth"
        :model="filterForm"
      >
        <ElRow>
          <ElFormItem
            label="报告类型："
            style="margin-bottom: 0;"
          >
            <div :class="$style.flex">
              <ElCheckbox
                v-model="checkTypeAll"
                :indeterminate="isTypeIndeterminate"
                @change="checkTypeAllChange"
              >
                全部
              </ElCheckbox>
              <ElCheckboxGroup
                v-model="filterForm.reportTypeList"
                :class="$style.margin"
                @change="checkedTypeChange"
              >
                <ElCheckbox
                  v-for="(val, key) in REPORTTYPE"
                  :key="key"
                  :label="key"
                >
                  {{ val }}
                </ElCheckbox>
              </ElCheckboxGroup>
            </div>
          </ElFormItem>
        </ElRow>
        <ElRow>
          <ElFormItem
            label="报告来源："
            style="margin-bottom: 0;"
          >
            <div :class="$style.flex">
              <ElCheckbox
                v-model="checkSourceAll"
                :indeterminate="isSourceIndeterminate"
                @change="checkSourceAllChange"
              >
                全部
              </ElCheckbox>
              <ElCheckboxGroup
                v-model="filterForm.reportSourceList"
                :class="$style.margin"
                @change="checkedSourceChange"
              >
                <ElCheckbox
                  v-for="(val, key) in REPORTSOURCE"
                  :key="key"
                  :label="key"
                >
                  {{ val }}
                </ElCheckbox>
              </ElCheckboxGroup>
            </div>
          </ElFormItem>
        </ElRow>
        <ElFormItem label="报告名称：">
          <ElInput
            v-model="filterForm.reportName"
            :class="$style.input"
            clearable
            maxlength="20"
            placeholder="请输入关键字"
          />
        </ElFormItem>
        <ElFormItem label="报告上传时间：">
          <ElDatePicker
            v-model="date"
            clearable
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
            @change="
              ;[filterForm.beginTime, filterForm.endTime] = $event || ['', '']
            "
          />
        </ElFormItem>
      </ElForm>
    </Transition>

    <ElButton
      v-if="isCommunication"
      type="primary"
      :class="$style.btn"
      @click="upLoadReport"
    >
      上传
    </ElButton>
    <ITable
      ref="table"
      :head="head"
      :get="page"
      :query="filterForm"
    >
      <ElTableColumn label="操作">
        <template slot-scope="scope">
          <ElTooltip content="下载">
            <ElButton
              type="text"
              icon="el-icon-download"
              @click="downLoadReport(scope.row)"
            />
          </ElTooltip>
          <template v-if="isCommunication">
            <ElTooltip content="删除">
              <ElButton
                type="text"
                icon="el-icon-delete"
                @click="deleteInfo(scope.row)"
              />
            </ElTooltip>
            <ElTooltip content="编辑">
              <ElButton
                type="text"
                :icon="'i-bianji '"
                :class="$style.primary"
                @click="edit(scope.row)"
              />
            </ElTooltip>
          </template>
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang='ts'>
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import ElDatePicker from 'element-ui/lib/date-picker'
import {
  getOperationSecurityReportList,
  getSecurityReportList,
  deleteReport,
} from '@/api/reportManage'
import { download } from '@/api/tools/file'
import { save } from '@/utils/downloader'
import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'
import getCode from '@/enums/code'
const REPORTSOURCE = getCode('1', 'SYS_reportSource')
const REPORTTYPE = getCode('1', 'SecurityReportType')
export default {
  props: {
    route: { type: Object, required: true },
  },
  components: {
    ITable,
    ElTableColumn,
    ElDatePicker,
  },
  data() {
    return {
      filterForm: {
        reportType: '',
        reportName: '',
        beginTime: '',
        endTime: '',
        reportTypeList: [],
        reportSourceList: [],
      },
      date: ['', ''],
      checkTypeAll: false,
      isTypeIndeterminate: false,
      checkSourceAll: false,
      isSourceIndeterminate: false,
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    REPORTSOURCE: () => REPORTSOURCE.value || [],
    REPORTTYPE: () => REPORTTYPE.value || [],
    head() {
      const cusList = [
        { prop: 'reportName', label: '报告名称' },
        {
          prop: 'reportTypeName',
          label: '类型',
        },
        { prop: 'createDate', label: '上传时间' },
        { prop: 'reportSourceName', label: '报告来源' },
        { prop: 'reportUserAlias', label: '所属单位' },
      ]
      return cusList
    },
    isCommunication() {
      return this.authFit(ROLES.communicationLLY)
    },
    page() {
      switch (true) {
        // 用户
        case this.authFit(ROLES.communicationLLY):
          return getOperationSecurityReportList
        // 运维
        case this.authFit(ROLES.groupLeaders):
          return getSecurityReportList
        default:
          return null
      }
    },
  },
  methods: {
    async getOperationSecurityReportList() {
      const res = await getOperationSecurityReportList.apply(null, arguments)
      const body = res.data.body
      res.data.body = body?.list
      return res
    },
    async getSecurityReportList() {
      const res = await getSecurityReportList.apply(null, arguments)
      const body = res.data.body
      res.data.body = body?.list
      return res
    },
    checkTypeAllChange(val) {
      this.filterForm.reportTypeList = val ? Object.keys(this.REPORTTYPE) : []
      this.isTypeIndeterminate = false
    },
    checkedTypeChange(value) {
      const checkedCount = value.length
      this.checkTypeAll = checkedCount === Object.keys(this.REPORTTYPE).length
      if (
        checkedCount > 0 &&
        checkedCount < Object.keys(this.REPORTTYPE).length
      ) {
        this.isTypeIndeterminate = true
      } else {
        this.isTypeIndeterminate = false
      }
    },
    checkSourceAllChange(val) {
      this.filterForm.reportSourceList = val
        ? Object.keys(this.REPORTSOURCE)
        : []
      this.isSourceIndeterminate = false
    },
    checkedSourceChange(value) {
      const checkedCount = value.length
      this.checkSourceAll =
        checkedCount === Object.keys(this.REPORTSOURCE).length
      if (
        checkedCount > 0 &&
        checkedCount < Object.keys(this.REPORTSOURCE).length
      ) {
        this.isSourceIndeterminate = true
      } else {
        this.isSourceIndeterminate = false
      }
    },
    deleteInfo(row: any) {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        const params = {
          fileIds: row.reportFileId || '',
          reportIds: row.id || '',
        }
        deleteReport(params).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            ;(this.$refs.table as any).fetch()
          }
        })
      })
    },
    downLoadReport(row: any) {
      const file = {
        name: row.reportName,
        src: download(row.reportFileId),
      }
      save(file)
    },
    upLoadReport() {
      this.jump({ path: 'uploadReport', query: { state: 'add' }, append: true })
    },
    edit(row) {
      this.jump({
        path: 'uploadReport',
        query: { state: 'edit', id: row.id },
        append: true,
      })
    },
  },
}
</script>
<style lang='scss'>
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>
<style lang='scss' module>
.wrapper {
  position: relative;
}

.flex {
  display: flex;
}

.margin {
  margin-left: 30px;
}

.filter {
  display: flex;
  justify-content: space-between;
  margin: $gapNormal / 2 0 $gapNormal 0;

  .input {
    width: 220px;
  }
}

.btn {
  position: absolute;
  top: $gapNormal;
  right: $gapNormal;
  z-index: $zFixed;
}
</style>
