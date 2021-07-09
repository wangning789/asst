<template>
  <ElTabs
    v-model="activeName"
    type="card"
  >
    <ElTabPane
      label="告警日志信息"
      name="0"
    >
      <ITable
        v-if="activeName==='0'"
        ref="alarmLog"
        :query="gQuery"
        :get="alarmLogPage"
        :head="head1"
      />
    </ElTabPane>

    <ElTabPane
      label="运维服务记录"
      name="1"
    >
      <ITable
        v-if="activeName==='1'"
        ref="operat"
        :query="gQuery"
        :get="maintenanceRecords"
        :head="head2"
      >
        <ElTableColumn
          label="操作"
          width="100px"
        >
          <template #default="{ row }">
            <ElTooltip content="查看详情">
              <ElButton
                type="text"
                :icon="'i-chakan ' + STYLE.primary"
                @click="toDetailClick(row)"
              />
            </ElTooltip>
          </template>
        </ElTableColumn>
      </ITable>
    </ElTabPane>
  </ElTabs>

  <!-- 列表 -->
</template>
<script lang="ts">
// @ts-nocheck
import { alarmLogPage, maintenanceRecords } from '@/api/servicePlatform/SecurityService'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ElTableColumn from 'element-ui/lib/table-column'
import ITable from '@com/Table'
import STYLE from '@/scss/status.module.scss'
import { toDetail } from '@/api/workflow/workflow'
export default {
  props: {
    query: {
      type: String, required: true,
    },
    applicationId: {
      type: String, required: true,
    },
  },
  components: { ITable, ElTableColumn, ElTabs, ElTabPane },
  data() {
    return {
      activeName: '0',
    }
  },
  computed: {
    STYLE: () => STYLE,
    alarmLogPage() {
      return alarmLogPage
    },
    gQuery(this: any) {
      return {
        serviceType: this.query,
        applicationId: this.applicationId,
      }
    },
    head1() {
      return [
        {
          label: '等级',
          formatter: (row: any) => {
            const oGrade = row.grade
            let oclass = `${STYLE.warn}`
            switch (oGrade) {
              case '高':
                oclass = `${STYLE.success}`
                break
              case '中':
                oclass = `${STYLE.danger}`
                break
              default:
                oclass = `${STYLE.warn}`
            }
            return this.$createElement(
              'span',
              {
                class: oclass,
              },
              row.grade
            )
          },
        },
        {
          prop: 'name',
          label: '日志名称',
        },
        {
          prop: 'alarmTime',
          label: '发生时间',

        },
        {
          prop: 'assets',
          label: '影响资产',
        },
        // {
        //   prop: 'file',
        //   label: '被篡改文件',
        // },
        // {
        //   prop: 'status',
        //   label: '处理状态',
        //   formatter: (row: any) => {
        //     const oStatus = row.status
        //     let oclass = `${STYLE.warn}`
        //     switch (oStatus) {
        //       case '已处理':
        //         oclass = `${STYLE.success}`
        //         break
        //       case '未处理':
        //         oclass = `${STYLE.danger}`
        //         break
        //       default:
        //         oclass = `${STYLE.warn}`
        //     }
        //     return this.$createElement(
        //       'span',
        //       {
        //         class: oclass,
        //       },
        //       row.status
        //     )
        //   },
        // },
      ]
    },
    maintenanceRecords() {
      return maintenanceRecords
    },

    head2() {
      return [
        {
          prop: 'workOrderNo',
          label: '工单编号',
        },
        {
          prop: 'createDate',
          label: '时间',
        },
        {
          prop: 'workOrderContent',
          label: '问题描述',
        },
        {
          prop: 'workOrderName',
          label: '服务内容',

        },
        {
          prop: 'handler',
          label: '运维人员',
        },
      ]
    },
  },

  methods: {
    toDetailClick(row) {
      toDetail(row.processId, '工单详情', msg => {
        msg.data === 'close' && this.$refs.operat.fetch()
      })
    },
  },
}

</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/tag';
</style>

<style lang="scss" module>

.fontsty {
  color: rgba(50, 115, 196, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
}

</style>
