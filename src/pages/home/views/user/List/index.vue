<!-- 人员管理 -->
<template>
  <div
    v-if="API.page"
    class="el-card"
  >
    <!-- 筛选 -->
    <IFilter
      v-model="query"
      :title="route.meta.title"
    />
    <!-- 列表 -->
    <ITable
      ref="table"
      :head="head"
      :query="query"
      :get="API.page"
    >
      <ElTableColumn
        label="状态"
        width="80"
      >
        <template #default="{ row }">
          <span
            v-if="row.delStatus"
            :class="STYLE.info"
          >已删除</span>
          <span
            v-else-if="row.accountNonLocked"
            :class="STYLE.danger"
          >已锁定</span>
          <span
            v-else-if="row.enabled"
            :class="STYLE.success"
          >启用中</span>
          <span
            v-else
            :class="STYLE.warn"
          >已停用</span>
        </template>
      </ElTableColumn>

      <ElTableColumn
        label="操作"
        width="250"
        :class-name="$style.opt"
      >
        <template #default="{ row }">
          <template v-if="!row.delStatus">
            <!-- <ElTooltip content="编辑">
              <RouterLink
                :class="'el-button el-button--text i-bianji ' + STYLE.primary"
                :to="`${row.id}/edit`"
                append
              />
            </ElTooltip> -->
            <ElTooltip
              :content="row.enabled ? '停用' : '启用'"
            >
              <ElSwitch
                :value="!!row.enabled"
                @change="toogle(row)"
              />
            </ElTooltip>
            <RouterLink
              :class="'el-button el-button--text  ' + STYLE.primary"
              :to="`${row.id}/edit`"
              append
            >
              编辑
            </RouterLink>

            <!-- <ElTooltip content="删除">
              <ElButton
                type="text"
                :icon="'i-shanchu1 ' + STYLE.danger"
                @click="del(row)"
              />
            </ElTooltip> -->

            <!-- <ElTooltip
              v-if="API.reset"
              content="重置密码"
            >
              <ElButton
                type="text"
                :icon="'i-mimazhongzhi ' + STYLE.warn"
                @click="id = row.id; username = row.username; visible = true"
              />
            </ElTooltip> -->

            <ElButton
              v-if="API.reset"
              type="text"
              :class="STYLE.primary"
              @click="id = row.id; username = row.username; visible = true"
            >
              重置密码
            </ElButton>

            <!-- <ElTooltip
              v-if="API.unlock && row.accountNonLocked"
              content="解除锁定"
            >
              <ElButton
                type="text"
                :icon="'el-icon-unlock ' + STYLE.success"
                @click="unlock(row)"
              />
            </ElTooltip> -->
            <ElButton
              v-if="API.unlock && row.accountNonLocked"
              type="text"
              :class="STYLE.primary"
              @click="unlock(row)"
            >
              解除锁定
            </ElButton>
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
    <!-- 重置密码 -->
    <IPassword
      :id="id"
      :username="username"
      :visible.sync="visible"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElSwitch from 'element-ui/lib/switch'
import ITable, { ElTableColumn } from '@com/Table'
import IPassword from '@com/user/Password'
import IFilter from './Filter'

import {
  User,
  cPage,
  saPage,
  aPage,
  cDel,
  saDel,
  aDel,
  enable,
  disable,
  unlock,
} from '@/api/authServer/user'
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
  components: { ElSwitch, ITable, ElTableColumn, IPassword, IFilter },
  data() {
    return { query: {} as User, id: '', username: '', visible: null }
  },
  computed: {
    STYLE: () => STYLE,
    API() {
      switch (true) {
        case this.authFit(ROLES.common):
          return { page: cPage, del: cDel, enable, disable }
        case this.authFit(ROLES.systemAdmin):
          return { page: aPage, del: aDel, enable, disable, unlock, reset: true }
        case this.authFit(ROLES.superAdmin):
          return { page: saPage, del: saDel, enable, disable, unlock, reset: true }
        default:
          return {}
      }
    },
    head() {
      return [
        {
          prop: 'employeeNumber',
          label: '工号',
          formatter: (row, col, cell) =>
            this.$createElement(
              'RouterLink',
              {
                class: 'el-button el-button--text',
                props: { to: row.id + '/info', append: true },
              },
              cell
            ),
        },
        { prop: 'aliasName', label: '姓名' },
        { prop: 'roleName', label: '角色' },
        { prop: 'departmentName', label: '平台' },
        { prop: 'organizationName', label: '所属单位' },
        { prop: 'cellPhone', label: '联系方式' },
        { prop: 'mailbox', label: '邮箱' },
        { prop: 'wechat', label: '微信号' },
        { prop: 'lastLoginTime', label: '最后登录时间' },
      ]
    },
  },
  methods: {
    async del(data: User) {
      await this.$confirm(
        `此操作不可逆, 确定要删除用户【${data.aliasName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await this.API.del(data.id)
      this.refresh()
      this.$notify.success(`删除用户【${data.aliasName}】成功`)
    },
    async toogle(data: User) {
      if (data.enabled) {
        await this.$confirm(
          `确定要停用用户【${data.aliasName}】？`,
          '停用确认',
          {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
          }
        )
        await this.API.disable(data.id)
        this.refresh()
        this.$notify.success(`停用用户【${data.aliasName}】成功`)
      } else {
        await this.API.enable(data.id)
        this.refresh()
        this.$notify.success(`启用用户【${data.aliasName}】成功`)
      }
    },
    async unlock(data: User) {
      await this.API.unlock(data.id)
      this.refresh()
      this.$notify.success(`用户【${data.roleName}】已解除锁定`)
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
  // .el-link,
  // .el-button {
  //   font-size: $large;
  // }

  .el-switch {
    margin: 0 10px;
  }
}
</style>
