<!--
 * @Description: 表格+翻页封装
 * @Author: 毛瑞
 * @Date: 2019-10-23 19:49:28
 -->
<template>
  <ElRow v-loading="load">
    <div class="tableStyle">
      <ElTable
        ref="table"
        stripe
        highlight-current-row
        show-overflow-tooltip
        row-key="id"
        :data="tableData"
        :span-method="spanMethod"
        :class="STYLE.table"
        @select="
          (selection, row) => {
            $emit('select', selection, row)
          }
        "
        @select-all="
          (selection, row) => {
            $emit('select', selection)
          }
        "
        @selection-change="
          (selection, row) => {
            $emit('select', selection)
          }
        "
        @current-change="
          (row, old) => {
            $emit('current-change', row, old)
          }
        "
      >
        <slot name="prefix" />
        <template v-for="(item, i) in head">
          <ElTableColumn
            v-if="item.formatter"
            :key="i"
            show-overflow-tooltip
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
            :sortable="item.sortable"
          />
          <ElTableColumn
            v-else
            :key="i"
            show-overflow-tooltip
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              {{ scope.row[item.prop] || '-' }}
            </template>
          </ElTableColumn>
        </template>

        <slot />
      </ElTable>
    </div>

    <ElPagination
      v-show="layout && total"
      class="align-right"
      background
      :total="total"
      :layout="layout"
      :page-sizes="sizes"
      :page-size="p.pageSize"
      :current-page="p.page"
      :popper-class="popperClass"
      @size-change="setPageSize"
      @current-change="setPage"
    />
  </ElRow>
</template>

<script lang="ts">
import { VNode } from 'Vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from 'vue-property-decorator'

import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import ElPagination from 'element-ui/lib/pagination'

import { GLOBAL } from '@/enums/events'
import { isEqual, trim } from '@/utils'
import { isCancel } from '@/utils/ajax'
import { Debounce } from '@/utils/performance'
import CONFIG from './config/table'

import STYLE from './scss/table.module.scss'

/// 常量(const UPPER_CASE) ///
/// 单例(const camelCase) ///
/// 函数(无副作用, function utils() {}) ///
export type Getter = (query?: IObject, noCache?: boolean) => Promise<any>
export type Head = {
  /** 数据键 */
  prop?: string
  /** 表头标题 */
  label?: string
  /** 宽度 */
  width?: number | string
  formatter?: (row: any, col: any, cell: any) => VNode | string
}[]
export type SpanMethod = (info: {
  row: any
  column: any
  rowIndex: number
  columnIndex: number
}) => [number, number] | { rowspan: number; colspan: number }

export { ElTableColumn }
/// 选项 name,components,directives,filters,extends,mixins ///
/** emit: (事件名: [参数列表, ...])
 *    select: [selection: 当前勾选, row?: 当前行数据(无则点击的是全选)] 复选框勾选
 *    current-change: [row: 当前行, old: 上一次选中行] 当前行改变
 *    done: [data: 当前数据, vm: ELTable实例, total: 总数] 完成请求
 *  slots:
 *    prefix: 前置列插槽
 *    default: 后置列插槽
 */
@Component({ components: { ElTable, ElTableColumn, ElPagination } })
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  @Prop() readonly head!: Head // 表头y
  @Prop() readonly query!: IObject // 查询参数(会默认加上分页参数)
  @Prop() readonly get!: Getter // 查询函数
  @Prop() readonly spanMethod?: SpanMethod // 行列合并
  @Prop() readonly popperClass?: string // 页数选择器下拉框类名
  @Prop({ default: () => CONFIG.sizes }) readonly sizes?: number[] // 每页大小选项
  @Prop({ default: CONFIG.layout }) readonly layout?: string // 分页布局
  @Prop() data!: IObject[] // table数据
  /// data (name: string = '响应式属性' // 除了undefined都会响应式) ///
  private page = 1 // 当前页码
  private pageSize = CONFIG.pageSize // 每页大小

  private load = false
  private total = 0 // 总数
  private tableData: readonly IObject[] = []
  /// 非响应式属性 (name?: string) ///
  private $_get?: Getter
  private $_query?: IObject
  private $_request?: any

  /// computed (get name() {} set name(){}) ///
  private get STYLE() {
    return STYLE
  }

  // private get data() {
  //   return tableData
  // }

  // for Watch get和query变化触发
  private get p() {
    const get = this.get
    let query = { page: this.page, pageSize: this.pageSize }
    if (!get) {
      this.tableData = this.data
      return query
    }

    query = trim(Object.assign(query, this.query))
    if (get === this.$_get && isEqual(query, this.$_query)) {
      return query
    }

    this.fetch((this.$_get = get), (this.$_query = query))
    return query
  }

  /// watch (@Watch) ///
  /// LifeCycle (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    if (this.on) {
      const clearSelection = (event: MouseEvent) => {
        const table = this.$refs.table as any
        table && !table.$el.contains(event.target) && table.setCurrentRow()
      }
      this.on(GLOBAL.click, clearSelection)
      this.$once('hook:destroyed', () => this.off(GLOBAL.click, clearSelection))
    }
  }

  /// methods (getName(){}) ///
  /** 刷新表格数据 */
  @Debounce(250)

  fetch(get?: Getter, query?: IObject) {
    // 会变成响应式数据啊啊啊, 放constructor也一样, 忍了
    // 不想给class名字啊啊啊, this:any 忍了
    this.load = true
    this.$_request &&
      this.$_request.cancel &&
      this.$_request.cancel('Table: 取消过时请求')
    ;(this.$_request = (get || (this.$_get as Getter))(
      query || this.$_query,
      !get
    ))
      .then((res: any) => {
        res = (res.data && (res.data.body || res.data)) || 0
        const data: any[] = Array.isArray(res.data || res.list)
          ? res.data || res.list
          : Array.isArray(res)
            ? res
            : []
        const total = +res.total || data.length
        const lastPage = Math.ceil(total / this.pageSize) || 1
        if (this.page > lastPage) {
          this.page = lastPage
          return
        }

        this.total = total
        this.tableData = data
        throw 0 // eslint-disable-line no-throw-literal
      })
      .catch((res: any) => {
        if (!isCancel(res)) {
          this.load = false
          this.$emit('done', this.tableData, this.$refs.table, this.total)
        }
      })
  }

  /** 设置当前页码 */
  setPage(page: number) {
    if (((page |= 0) < 1 ? (page = 1) : page) !== this.page) {
      const lastPage = Math.ceil(this.total / this.pageSize)
      this.page = page > lastPage ? lastPage : page
    }
  }

  /** 设置每页数量 */
  setPageSize(pageSize: number) {
    if (((pageSize |= 0) < 1 ? (pageSize = 1) : pageSize) !== this.pageSize) {
      pageSize = Math.ceil(this.total / (this.pageSize = pageSize))
      this.page > pageSize && (this.page = pageSize)
    }
  }

  /** 清除选中 */
  clearSelection() {
    const table = this.$refs.table as any
    table && table.clearSelection()
  }
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
@import '~element-ui/packages/theme-chalk/src/pagination';
</style>

<style lang="scss">
.tableStyle {
  margin-top: 2px;

  .el-table {
    // stylelint-disable-next-line selector-no-qualifying-type
    thead.is-group {// stylelint-disable-next-line selector-no-qualifying-type
      // stylelint-disable-next-line selector-max-compound-selectors
      th {
        color: $colorTextMain;
        background: $colorTableHead;
        border: 1px solid #ddd;
        border-bottom: 0;
      }
    }
  }
}

.align-right {
  text-align: right;
}
</style>
