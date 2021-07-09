<!-- API/元素表格复选 -->
<template>
  <ITable
    ref="table"
    :head="head"
    :get="page"
    :query="query"
    :class="batch ? '' : $style.noAll"
    :popper-class="batch ? $style.popper : ''"
    @done="done"
    @select="select"
  >
    <template #prefix>
      <ElTableColumn
        type="selection"
        width="50"
      />
    </template>

    <ElTableColumn
      v-if="!batch"
      label="操作"
      width="50"
    >
      <template #default="{ row }">
        <ElTooltip content="取消关联">
          <ElButton
            type="text"
            icon="i-guanbi"
            @click="unbind(row)"
          />
        </ElTooltip>
      </template>
    </ElTableColumn>
  </ITable>
</template>

<script lang="ts">// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'

import {
  Api,
  bind,
  page,
  available,
  unbind,
  update,
} from '@/api/authServer/api'
import {
  Element,
  bind as eleBind,
  page as elePage,
  unbind as eleUnbind,
  update as eleUpdate,
} from '@/api/authServer/element'
import AUTH from '@/enums/auth'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
type Row = Api | Element

function indexOf(selected: Row[], row: Row) {
  for (let i = 0, len = selected.length, member; i < len; i++) {
    member = selected[i]
    if (member === row || member.id === row.id) {
      return i
    }
  }
  return -1
}
function match(str1: string, str2: string) {
  return str1.includes(str2) || str2.includes(str1)
}

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 查询参数 */
    query: { type: Object, required: true },
    /** 表头 */
    head: { type: Array, required: true },
    /** 批量选择 (for 弹窗) */
    batch: { type: Boolean },
    /** 是否元素权限 */
    ele: { type: Boolean },
  },
  components: { ITable, ElTableColumn },
  data: () => ({ selected: [] }),
  computed: {
    page() {
      const ele = this.ele
      return this.batch
        ? ele
          ? query => {
            const keyword = query.keyword
            const data = (AUTH[query.moduleId] || []).filter(item => {
              let key
              for (key in item) {
                if (match(keyword, item[key])) {
                  return true
                }
              }
            })
            const page = query.page
            const pageSize = query.pageSize
            return Promise.resolve({
              data: {
                body: {
                  list: data.slice((page - 1) * pageSize, page * pageSize),
                  total: data.length,
                },
              },
            })
          }
          : available
        : ele
          ? elePage
          : page
    },
  },
  methods: {
    done(rows: Row[], table: any) {
      this.$_rows = rows
      this.$_table = table
      if (rows && rows.length) {
        const selected = this.selected
        let row
        for (row of rows) {
          ;(row.auth || indexOf(selected, row) > -1) &&
            table.toggleRowSelection(row, true)
        }
      }
    },
    select(selection: Row[], row: Row) {
      const selected: Row[] = this.selected
      let index
      if (row) {
        index = indexOf(selection, row)
        const checked = index > -1
        row.auth = checked ? 1 : 0

        if (this.batch) {
          checked ? selected.push(row) : selected.splice(index, 1)
          return
        }

        Object.assign(row, this.query)
        ;(this.ele ? eleUpdate : update)([row]).catch(() => {
          this.$_table.toggleRowSelection(row, !checked)
        })
        return
      }

      if (selection && selection.length) {
        // 全选当前页
        for (row of selection) {
          if (indexOf(selected, row) < 0) {
            row.auth = 1
            selected.push(row)
          }
        }
      } else {
        // 全不选当前页
        selection = this.$_rows
        if (selection && selection.length) {
          for (row of selection) {
            index = indexOf(selected, row)
            if (index < 0) {
              row.auth = 0
              selected.splice(index, 1)
            }
          }
        }
      }
    },
    /** 刷新表格数据 */
    fetch() {
      ;(this.$refs.table as any).fetch()
    },
    /** 批量关联api到菜单 */
    bind() {
      const selected: Row[] = this.selected
      if (selected.length) {
        const query = this.query
        return (this.ele ? eleBind : bind)(
          selected.map(row => Object.assign(row, query))
        ).then(res => {
          this.fetch()
          return res
        })
      }
      throw new Error('未选中任何项')
    },
    unbind(row: Row) {
      return (this.ele ? eleUnbind : unbind)(row).then(res => {
        this.fetch()
        return res
      })
    },
    /** 清除选中 */
    clearSelection() {
      this.selected = []
      ;(this.$refs.table as any).clearSelection()
    },
  },
}
</script>

<style lang="scss" module>
.noAll :global(.el-table__header .el-table-column--selection) {
  pointer-events: none;
}

.popper {
  z-index: $zInfo !important;
}
</style>
