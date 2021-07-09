<!-- 描述 -->
<template>
  <div>
    <!--服务器 -->
    <div>
      <Ifilter
        v-model="filterForm"
        :checked-org-list="checkedOrgList"
        @Refresh="Refresh"
      />
      <div :class="$style.severlist">
        <div :class="$style.table">
          <ITable
            ref="table"
            :get="get"
            :query="filterForm"
            :head="head"
          >
            <template #prefix>
              <ElTableColumn
                width="180"
                fixed
                prop="ciSysCode"
                label="系统编号"
              >
                <template #default="{ row }">
                  <RouterLink
                    class="el-button el-button--text"
                    :to="`/assetsInfo/server/${row.id}/info`"
                  >
                    {{ row.ciSysCode }}
                  </RouterLink>
                </template>
              </ElTableColumn>
            </template>
          </ITable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Ifilter from './Filter'
import { serverGetAllList, serverGetList } from '@/api/assets/assetsInfo/server'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import { ROLES } from '@/enums'
import STYLE from '@/scss/status.module.scss'
import ITable, { ElTableColumn } from '@com/Table'
export default {
  props: {
    checkedOrgList: { type: Array, default: () => { return [] } },
  },
  components: {
    Ifilter,
    ITable,
    ElTableColumn,
  },
  data() {
    return {
      filterForm: {},
      head: [],
      serveType: [], // 服务器类型
    }
  },
  computed: {
    STYLE: () => STYLE,
  },
  methods: {
    Refresh() {
      this.$refs.table.fetch()
    },
    async get() {
      let fn = ''
      switch (true) {
        case this.authFit(ROLES.systemAdmin):
          fn = serverGetAllList
          break
        case this.authFit(ROLES.assetManager):
          fn = serverGetList
          break
        default:
          break
      }
      const res = await fn.apply(null, arguments)
      const dataList = res.data.body.dataList.list.map(
        (element: any) => {
          return Object.assign(element, element.data)
        }
      )
      const columnDTOList = res.data.body.columnDTOList
      const total = res.data.body.dataList.total
      columnDTOList.forEach(o => {
        // 是下拉的字段取XXName
        o.enName = o.type === '7' ? o.enName + 'Name' : o.enName
      })
      this.head = []
      // display  是否显示,1:是;2:否',
      // allowModify 是否固定字段,1:自定义字段;2:固定字段'
      columnDTOList.forEach(o => {
        if (o.enName === 'useStatusName') {
          this.head.push({
            prop: o.enName,
            label: o.chName,
            width: 80,
            formatter: (row, col, cell) =>
              this.$createElement(
                'span',
                {
                  class: row.useStatus === '0' ? 'enable' : 'disable',
                },
                cell
              ),
          })
        } else if (o.display === '1' && o.enName !== 'ciSysCode') {
          this.head.push({ label: o.chName, prop: o.enName, width: 120 })
        }
      })
      res.data.body = {
        total: total,
        data: dataList,
      }
      return res
    },
  },
  activated() {
    // 重新更新列表
    this.filterForm = {
      ...this.filterForm,
      t: new Date().getTime(),
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  overflow: hidden;
  color: #333;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.table :global(.el-table__empty-block) {
  width: 100% !important;
}

.table :global(.el-table .cell) {
  white-space: nowrap;
}

</style>
