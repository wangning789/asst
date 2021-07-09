<!-- 角色管理 -->
<template>
  <div class="el-card">
    <!-- 筛选 -->
    <IFilter
      v-model="query"
      :title="route.meta.title"
      @add="role = {}; visible = true"
    />
    <!-- 列表 -->
    <ITable
      ref="table"
      :head="head"
      :query="query"
      :get="get"
    >
      <ElTableColumn
        align="center"
        label="是否内置角色"
      >
        <template #default="{row}">
          <span>{{ row.issys === 0 ? '是' : '否' }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        align="center"
        label="状态"
        width="80"
      >
        <template #default="{row}">
          <span
            v-if="row.enabled"
            :class="STYLE.success"
          >已启用</span>
          <span
            v-else
            :class="STYLE.info"
          >已停用</span>
        </template>
      </ElTableColumn>

      <ElTableColumn
        label="操作"
        width="250"
        :class-name="$style.opt"
      >
        <template #default="{ row }">
          <template v-if="row.issys !== 0 || authFit(ROLES.superAdmin)">
            <ElTooltip :content="row.enabled ? '停用' : '启用'">
              <ElSwitch
                :value="!!row.enabled"
                @change="toogle(row)"
              />
            </ElTooltip>
            <!-- <ElTooltip content="编辑">
              <ElButton
                type="text"
                size="mini"
                :icon="'i-bianji ' + STYLE.primary"
                @click="role = row; visible = true"
              />
            </ElTooltip> -->
            <ElButton
              type="text"
              :class="STYLE.primary"
              @click="role = row; visible = true"
            >
              编辑
            </ElButton>

            <!-- <ElTooltip content="删除">
              <ElButton
                type="text"
                size="mini"
                :icon="'i-shanchu1 ' + STYLE.danger"
                @click="del(row)"
              />
            </ElTooltip> -->

            <ElButton
              type="text"
              :class="STYLE.primary"
              @click="role = row; showMenu = true"
            >
              分配菜单
            </ElButton>

            <!-- <ElTooltip content="分配菜单">
              <ElButton
                type="text"
                size="mini"
                :icon="'i-quanxianpeizhi ' + STYLE.success"
                @click="role = row; showMenu = true"
              />
            </ElTooltip> -->
            <ElButton
              type="text"
              :class="STYLE.danger"
              @click="del(row)"
            >
              删除
            </ElButton>
          </template>
        </template>
      </ElTableColumn>
    </ITable>

    <!-- 新增/编辑弹窗 -->
    <IDialog
      :data="role"
      :visible.sync="visible"
      @success="refresh"
    />
    <!-- 分配菜单 -->
    <IMenu
      :data="role"
      :visible.sync="showMenu"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElSwitch from 'element-ui/lib/switch'
import ITable, { ElTableColumn } from '@com/Table'
import IFilter from './Filter'
import IDialog from './AddOrEdit'
import IMenu from './Menu'

import {
  Role,
  tableSA,
  tableA,
  del,
  enable,
  disable,
} from '@/api/authServer/role'
import { ROLES } from '@/enums'
import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ElSwitch, ITable, ElTableColumn, IFilter, IDialog, IMenu },
  data() {
    return {
      query: {} as Role,
      role: {} as Role,
      visible: false,
      showMenu: false,
    }
  },
  computed: {
    STYLE: () => STYLE,
    ROLES: () => ROLES,
    get() {
      switch (true) {
        case this.authFit(ROLES.superAdmin):
          return tableSA
        case this.authFit(ROLES.systemAdmin):
          return tableA
        default:
          return null
      }
    },
    head() {
      return [
        { prop: 'roleName', label: '角色名称' },
        { prop: 'roleType', label: '角色类型' },
        { prop: 'roleLevel', label: '角色等级' },
        { prop: 'departmentName', label: '所属部门' },
      ]
    },
  },
  methods: {
    async del(data: Role) {
      await this.$confirm(
        `此操作不可逆, 确定要删除角色【${data.roleName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await del(data)
      this.refresh()
      this.$notify.success(`删除角色【${data.roleName}】成功`)
    },
    async toogle(data: Role) {
      if (data.enabled) {
        await this.$confirm(
          `确定要停用角色【${data.roleName}】？`,
          '停用确认',
          {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
          }
        )
        await disable(data)
        this.refresh()
        this.$notify.success(`停用角色【${data.roleName}】成功`)
      } else {
        await enable(data)
        this.refresh()
        this.$notify.success(`启用角色【${data.roleName}】成功`)
      }
    },
    refresh() {
      ;(this.$refs.table as any).fetch()
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.opt :global {
  // .el-button {
  //   font-size: $large;
  // }

  .el-switch {
    margin: 0 10px;
  }
}
</style>
