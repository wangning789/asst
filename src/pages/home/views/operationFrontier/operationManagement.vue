<template>
  <div class="el-card">
    <div :class="$style.name">
      巡检任务列表
    </div>
    <div :class="$style.elbutton">
      <ElButton
        type="primary"
        @click="addInspection"
      >
        添加巡检任务
      </ElButton>
    </div>

    <ITable
      ref="table"
      :head="head"
      :get="queryTerminal"
      :query="filterForm"
    >
      <ElTableColumn
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <span
              v-if="time>row.inspectionEndTime"
              @click="clickDetails(row)"
            >详情</span>
            <span
              v-if="time<=row.inspectionEndTime"
              @click="clickEdit(row)"
            >编辑</span>
            <span
              v-if="time<row.inspectionStartTime"
              @click="DeleteSecurity(row)"
            >删除</span>
          </div>
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import { assetss, DeleteSecurity } from '@/api/inspectionTask/inspectionTask'
export default {
  props: {

  },
  components: { ITable, ElTableColumn },
  data() {
    return {
      time: 0,
      number: 0,
      filterForm: {},
      dialogVisible: false,
      ruleForm: {
        resource: '',
        resourceTwo: '',
      },
    }
  },
  computed: {
    queryTerminal() {
      return assetss
    },
    head: () => [
      { label: '巡检任务类型', prop: 'safetyInspectionTypeName' },
      { label: '巡检周期', prop: 'inspectionCycleName' },
      {
        label: '开始日期',
        prop: 'inspectionStartTimeStr',
      },
      {
        label: '结束日期',
        prop: 'inspectionEndTimeStr',
      },
    ],
  },
  methods: {
    clickDetails(val) {
      this.$router.push({
        path: `${this.$route.fullPath}/${val.id}/detailsInspection`,
      })
    },
    clickEdit(val) {
      this.$router.push({
        path: `${this.$route.fullPath}/${val.id}/editInspection`,
      })
    },
    DeleteSecurity(val) {
      this.$confirm('此操作将永久删除该巡检任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        DeleteSecurity(val.id).then(res => {
          if (res.data.body) {
            (this.$refs.table as any).fetch()
            this.$notify.success('删除成功')
          } else {
            this.$message.error(res.data.msg || '保存失败,请稍后再试')
          }
        })
      }).catch(() => {
        this.number = 0
      })
    },

    addInspection() {
      this.$router.push({
        path: 'operationManagement/addInspection',
      })
    },
  },
  created() {
    this.time = new Date(new Date().toLocaleDateString()).getTime()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.name {
  font-weight: bold;
  font-size: 16px;
}

.elbutton {
  margin: 24px 0;
}

.tableClick {
  color: #3273c4;
  cursor: pointer;

  span:not(:first-child) {
    margin-left: 4px;
  }
}

</style>
