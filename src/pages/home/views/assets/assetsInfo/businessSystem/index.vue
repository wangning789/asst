<!-- 安全设备列表页 -->
<template>
  <div>
    <IFilter
      v-model="filterForm"
      :checked-org-list="checkedOrgList"
      @Refresh="Refresh"
    />
    <ITable
      ref="table"
      :head="head"
      :get="get"
      :query="filterForm"
    >
      <template #prefix>
        <ElTableColumn
          width="180"
          fixed
          label="系统编号"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-button el-button--text"
              :to="`/assetsInfo/businessSystem/${row.id}/info`"
            >
              {{ row.ciSysCode }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import IFilter from './Filter'
// import { getList, getAllList } from '@/api/assets/assetsInfo/securityFacility'
import {
  allWhole as getAllList,
  biz as getList,
} from '@/api/assets/assetsInfo/businessSystem'
import { ROLES } from '@/enums'
import STYLE from '@/scss/status.module.scss'
export default {
  props: {
    checkedOrgList: { type: Array, default: () => { return [] } },
  },
  components: {
    ITable,
    IFilter,
    ElTableColumn,
  },
  data() {
    return {
      filterForm: {},
      head: [],
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
          fn = getAllList
          break
        case this.authFit(ROLES.assetManager):
          fn = getList
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
<style lang="scss">
.enable {
  color: #68c23a;
}

.disable {
  color: $colorTextMinor;
}
</style>
