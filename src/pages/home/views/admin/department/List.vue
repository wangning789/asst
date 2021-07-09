<!-- 列表页 -->
<template>
  <div class="el-card">
    <ElForm inline>
      <ElFormItem>
        <RouterLink
          class="el-button el-button--primary el-button--small"
          :to="`${route.fullPath}/add`"
        >
          新建
        </RouterLink>
      </ElFormItem>
    </ElForm>

    <ITable
      ref="table"
      :head="head"
      :get="selectAll"
      layout
    >
      <ElTableColumn
        label="操作"
        width="150"
      >
        <template #default="{ row }">
          <ElTooltip content="详情">
            <RouterLink
              :class="'el-button el-button--text el-icon-tickets ' + STYLE.success"
              :to="`${route.fullPath}/${row.id}/info`"
            />
          </ElTooltip>
          <ElTooltip content="分配菜单">
            <ElButton
              type="text"
              :icon="'i-caidan ' + STYLE.warn"
              @click="parentId=row.parentId; showMenu = !!(id = row.id)"
            />
          </ElTooltip>

          <ElTooltip content="编辑">
            <RouterLink
              :class="'el-button el-button--text i-bianji ' + STYLE.primary"
              :to="`${route.fullPath}/${row.id}/edit`"
            />
          </ElTooltip>

          <ElTooltip content="新增下级部门">
            <RouterLink
              :class="'el-button el-button--text el-icon-plus ' + STYLE.success"
              :to="`${route.fullPath}/${row.id}/add`"
            />
          </ElTooltip>

          <ElTooltip content="删除">
            <ElButton
              type="text"
              :icon="'i-shanchu1 ' + STYLE.danger"
              @click="del(row)"
            />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ITable>
    <!-- 分配菜单 -->
    <IMenu
      :id="id"
      :parent-id="parentId"
      :visible.sync="showMenu"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import IMenu from './Menu'

import { DateTime } from '@/enums/format'
import formatDate from '@/utils/formatDate'
import { selectAll, deleteDep, Department } from '@/api/authServer/department'
import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, IMenu },
  data() {
    return { id: '', parentId: '', showMenu: false }
  },
  computed: {
    STYLE: () => STYLE,
    head() {
      const formatter = (row: any, col: any, cell: number) =>
        ((cell = +cell) && formatDate(cell, DateTime.dateTime)) || ''
      return [
        {
          prop: 'departmentName',
          label: '部门名称',
          formatter: (row: any) =>
            this.$createElement(
              'RouterLink',
              {
                class: 'el-link el-link--default',
                props: { to: `${this.route.fullPath}/${row.id}/info` },
              },
              row.departmentName
            ),
        },
        { prop: 'createUser', label: '创建者' },
        { prop: 'createDate', label: '创建日期', formatter },
        { prop: 'modifyUser', label: '最后修改人' },
        { prop: 'modifyDate', label: '最后修改日期', formatter },
        { prop: 'departmentDesc', label: '描述' },
      ]
    },
  },
  methods: {
    async selectAll() {
      const res = await selectAll.apply(null, arguments)
      const body = res.data.body
      res.data.body = body?.children
      return res
    },
    async del(data: Department) {
      await this.$confirm(
        `此操作不可逆, 确定要删除部门【${data.departmentName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      const res = (await deleteDep(data.id as string)).data
      if (res.status) {
        ;(this.$refs.table as any).fetch()
        this.$notify.success(`删除部门【${data.departmentName}】成功`)
      } else {
        this.$notify.error(res.msg || `删除部门【${data.departmentName}】失败`)
      }
    },
  },
}
</script>
