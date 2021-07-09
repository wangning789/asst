<!-- 系统资产 -->
<template>
  <div :class="$style.wrapper">
    <IStat />

    <div
      :class="'el-card ' + $style.mg"
    >
      <h4 class="common_h4_title">
        {{ route.meta.title }}
      </h4>

      <div :class="$style.fr">
        <ElButton
          type="text"
          :icon="`el-icon-arrow-${showFilter ? 'up' : 'down'}`"
          @click="showFilter = !showFilter"
        >
          {{ showFilter ? '隐藏' : '显示' }}筛选
        </ElButton>
        <RouterLink
          class="el-button el-button--primary"
          to="add"
          append
        >
          新建
        </RouterLink>
      </div>

      <Transition
        name="fold"
        mode="out-in"
      >
        <ElForm
          v-show="showFilter"
          v-model="form"
          inline
          :label-width="CONFIG.labelWidth"
        >
          <ElFormItem
            label="关键字："
            prop="keyword"
          >
            <ElInput
              v-model="form.keyword"
              clearable
              :class="$style.input"
              placeholder="请输入关键字"
            />
          </ElFormItem>
          <ElFormItem
            label="状态："
            prop="status"
          >
            <ElSelect
              v-model="form.status"
              clearable
              filterable
              placeholder="请选择状态"
            >
              <ElOption
                v-for="(v, k) in ASSET_STATU"
                :key="k"
                :value="k"
                :label="v"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </Transition>

      <ITable
        ref="table"
        :get="pageS"
        :query="form"
        :head="headSecond"
      >
        <template #prefix>
          <ElTableColumn
            prop="ciName"
            label="系统资产名称"
          >
            <template #default="{ row }">
              <RouterLink
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/app`"
              >
                {{ row.ciName }}
              </RouterLink>
            </template>
          </ElTableColumn>
        </template>
        <ElTableColumn
          label="操作"
          width="100"
        >
          <template #default="{ row }">
            <ElTooltip
              v-if="isCustom && row.status !== '1'"
              content="资产确认"
            >
              <ElButton
                type="text"
                :icon="'i-queren ' + STYLE.primary"
                @click="upDown(row)"
              />
            </ElTooltip>
            <ElTooltip content="编辑">
              <RouterLink
                :class="'el-button el-button--text i-bianji ' + STYLE.primary"
                :to="`${row.id}/edit`"
                append
              />
            </ElTooltip>
            <ElTooltip content="删除">
              <ElButton
                type="text"
                :icon="'i-shanchu1 ' + STYLE.danger"
                @click="removeApp(row)"
              />
            </ElTooltip>
          </template>
        </ElTableColumn>
      </ITable>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { ROLES } from '@/enums'
import ITable, { ElTableColumn } from '@com/Table'
import IStat from './Statistics'
import STYLE from '@/scss/status.module.scss'
import getCode from '@/enums/code'

import {
  listS,
  deleS,
  deleSC,
  pageS,
  statusS,
} from '@/api/servicePlatform/assetsController'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const ASSET_STATU = {
  0: '待确认',
  1: '已确认',
}
const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, IStat },
  data() {
    return {
      form: {
        keyword: '',
        status: '',
      },
      showFilter: false,
    }
  },
  computed: {
    NETWORK_AREA: () => NETWORK_AREA.value,
    ROLES: () => ROLES,
    ASSET_STATU: () => ASSET_STATU,
    STYLE: () => STYLE,
    pageS() {
      switch (true) {
        case this.authFit(ROLES.custom):
          return listS
        case this.authFit(ROLES.operation):
          return pageS
        default:
          return null
      }
    },
    isCustom() {
      return this.authFit(ROLES.custom)
    },
    headSecond() {
      return [
        { prop: 'domainName', label: '域名' },
        { prop: 'describe', label: '描述' },
        {
          label: '状态',
          width: '80x',
          formatter: (row: any) => {
            switch (row.status) {
              case '0':
                return '待确认'
              case '1':
                return '已确认'
            }
          },
        },
      ]
    },
  },
  methods: {
    // 删除系统资产
    removeApp({ id }: code) {
      id &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          switch (true) {
            case this.authFit(ROLES.custom):
              return deleSC(id).then(() => {
                (this.$refs.table as any).fetch()
                this.$notify.success('删除资产成功')
              })
            case this.authFit(ROLES.operation):
              return deleS(id).then(() => {
                (this.$refs.table as any).fetch()
                this.$notify.success('删除资产成功')
              })
            default:
              return null
          }
        })
    },
    // 修改状态
    upDown(obj: any) {
      this.$confirm('是否为我的资产？', '资产确认', {
        type: 'warning',
        cancelButtonText: '否',
        confirmButtonText: '是',
      }).then(() => {
        statusS(obj).finally(() => {
          ;(this.$refs.table as any).fetch()
        })
      })
    },

  },
}
</script>

<style lang="scss" module>
.wrapper {
  padding: 0;
}

.fr {
  float: right;
}

.mg {
  margin: $gapNormal 0 0 0;
  padding: $gapNormal;
}

.btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: $gapNormal / 2;

  .input {
    width: 220px;
  }
}

.mgl {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
