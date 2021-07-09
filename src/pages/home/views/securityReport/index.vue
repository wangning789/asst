<!-- 描述 -->
<template>
  <div :class="'el-card ' + $style.wrapper">
    <ElButton
      v-if="!isCum"
      type="primary"
      :class="$style.btn"
      @click="upLoadReport"
    >
      上传
    </ElButton>
    <ElTabs
      v-model="query.reportType"
    >
      <div :class="$style.filter">
        <ElInput
          v-model="query.reportName"
          :class="$style.input"
          suffix-icon="el-icon-search"
          placeholder="请输入报表名称"
        />
      </div>
      <ElTabPane
        v-for="(pane, i) of PANELS"
        :key="i"
        :label="pane.name"
        :name="`${pane.reportType}`"
      >
        <ITable
          :head="head"
          :get="page"
          :query="query"
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
              <template v-if="!isCum">
                <ElTooltip content="删除">
                  <ElButton
                    type="text"
                    icon="el-icon-delete"
                    @click="deleteReport(scope.row)"
                  />
                </ElTooltip>
              </template>
            </template>
          </ElTableColumn>
        </ITable>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang='ts'>
// @ts-nocheck
import ElTabs from 'element-ui/lib/tabs'
import ITable, { ElTableColumn } from '@com/Table'
import ElTabPane from 'element-ui/lib/tab-pane'

import {
  getSecurityReportList,
  securityDelete,
  getOperationSecurityReportList,
} from '@/api/securityReport/securityReport'
import { download } from '@/api/tools/file'
import { save } from '@/utils/downloader'
import { ROLES } from '@/enums'

const PANELS = [
  {
    name: '年报表',
    reportType: 1,
  },
  {
    name: '月报表',
    reportType: 2,
  },
  {
    name: '周报表',
    reportType: 3,
  },
  {
    name: '日报表',
    reportType: 4,
  },
  {
    name: '其他',
    reportType: 0,
  },
]
const TYPE = {
  1: '年报表',
  2: '月报表',
  3: '周报表',
  4: '日报表',
  0: '其他',
}

export default {
  components: {
    ITable,
    ElTableColumn,
    ElTabs,
    ElTabPane,
  },
  data() {
    return {
      query: {
        reportType: '1',
        reportName: '',
      },
    }
  },
  computed: {
    head() {
      const reportUserAlias = { prop: 'reportUserAlias', label: '所属用户' }
      const cusList = [
        {
          prop: 'reportName',
          label: '报表名称',
        },
        {
          prop: 'reportType',
          label: '类型',
          formatter: (row: any) => TYPE[row.reportType],
        },
        { prop: 'createDate', label: '生成时间' },
      ]
      !this.isCum && cusList.push(reportUserAlias)
      return cusList
    },
    PANELS: () => PANELS,
    isCum() {
      return this.authFit(ROLES.custom)
    },
    page() {
      switch (true) {
        // 用户
        case this.authFit(ROLES.custom):
          return getSecurityReportList
        // 运维
        case this.authFit(ROLES.operation):
          return getOperationSecurityReportList
        default:
          return null
      }
    },
  },
  methods: {
    deleteReport(row: any) {
      securityDelete(row.reportFileId, row.id).then(res => {
        if (res.data.status) {
          this.$message('删除成功')
          ;(this.$refs.table as any).fetch()
        }
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
      this.jump({ path: 'upload', query: { state: 'add' }, append: true })
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
