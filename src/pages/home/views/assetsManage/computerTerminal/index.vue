<!-- 描述 -->
<template>
  <div>
    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        :inline="true"
        :label-width="CONFIG.labelWidth"
        :model="filterForm"
      >
        <ElFormItem label="关键字：">
          <ElInput
            v-model="filterForm.keyword"
            clearable
            placeholder="请输入终端品牌或终端型号"
          />
        </ElFormItem>
        <ElFormItem label="终端密级：">
          <ElSelect
            v-model="filterForm.secretLevel"
            placeholder="全部"
            clearable
          >
            <ElOption
              v-for="(val, key) in SECRETLEVEL"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Transition>
    <div :class="$style.mb">
      <ElButton
        v-if="!authFit(ROLES.groupLeaders)"
        type="primary"
        size="small"
        :class="$style.button"
        @click="addTerminal()"
      >
        添加
      </ElButton>
      <ElButton
        v-if="!authFit(ROLES.groupLeaders)"
        type="primary"
        size="small"
        :class="$style.button"
        @click="visible = true"
      >
        批量导入
      </ElButton>
      <ElButton
        type="primary"
        size="small"
        :class="$style.button"
        @click="exportTerminal()"
      >
        导出
      </ElButton>
    </div>
    <ITable
      ref="table"
      :head="head"
      :get="activeName === '5' && queryTerminal"
      :query="filterForm"
    >
      <template #prefix>
        <ElTableColumn
          prop="type"
          label="计算机终端类型"
          width="120"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/terminalInfo`"
            >
              {{ row.type }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>
      <ElTableColumn
        v-if="!authFit(ROLES.groupLeaders)"
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <RouterLink
              tag="span"
              :to="`${route.fullPath}/${row.id}/editTerminal`"
            >
              <span>编辑</span>
            </RouterLink>
            <span @click="deleteInfo(row)">删除</span>
          </div>
        </template>
      </ElTableColumn>
    </ITable>
    <IDialog
      :visible.sync="visible"
      @success="refreshTable"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import IDialog from './importTerminal'
import {
  queryTotalTerminal,
  queryCompanyTotalTerminal,
  queryCompanyBelowTotalTerminal,
  exportTotalTerminal,
  exportCompanyTotalTerminal,
  exportCompanyBelowTotalTerminal,
  deleteTerminal,
} from '@/api/assetsManage/computerTerminal'
import { save } from '@/utils/downloader'
import getCode from '@/enums/code'
import { ROLES } from '@/enums'
import { ISINTERNET } from '../enums'
const SECRETLEVEL = getCode('1', 'SYS_asset_srl')

export default {
  props: {
    route: { type: Object, required: true },
    belongCompanyId: { type: String, default: '' },
    levelSwitch: { type: Boolean, default: false },
    activeName: { type: String, default: '0' },
  },
  components: { ITable, ElTableColumn, IDialog },
  data() {
    return {
      visible: false,
      filterForm: {
        belongCompanyId: '',
        keyword: '',
        secretLevel: '',
      },
    }
  },
  computed: {
    SECRETLEVEL: () => SECRETLEVEL.value || [],
    ISINTERNET: () => ISINTERNET,
    head: () => [
      { label: '终端品牌', prop: 'brand' },
      { label: '终端型号', prop: 'model' },
      {
        label: '终端密级',
        prop: 'secretLevelName',
      },
      {
        label: '是否联网',
        prop: 'isInternet',
        formatter: (row) => ISINTERNET[row.isInternet],
      },
      { label: '设备用途', prop: 'useType' },
      { label: '已安装的操作系统', prop: 'os', width: '140px' },
      { label: '数量', prop: 'count', width: '60px' },
      { label: '备注', prop: 'comment' },
      { label: '所属单位', prop: 'company' },
      { label: '添加时间', prop: 'createDate' },
    ],
    ROLES: () => ROLES,
    queryTerminal() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return queryCompanyTotalTerminal
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return queryCompanyBelowTotalTerminal
        default:
          return queryTotalTerminal
      }
    },
    exportTable() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return exportCompanyTotalTerminal
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return exportCompanyBelowTotalTerminal
        default:
          return exportTotalTerminal
      }
    },
  },
  watch: {
    belongCompanyId(newVal) {
      if (newVal) {
        this.filterForm.belongCompanyId = newVal
      }
    },
  },
  methods: {
    async queryCompanyTotalTerminal() {
      const res = await queryCompanyTotalTerminal
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async queryCompanyBelowTotalTerminal() {
      const res = await queryCompanyBelowTotalTerminal
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async queryTotalTerminal() {
      const res = await queryTotalTerminal
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    addTerminal() {
      this.$router.push({ path: `${this.route.fullPath}/addTerminal` })
    },
    exportTerminal() {
      this.$notify.info('正在导出中，请稍后......')
      this.exportTable(this.filterForm).then((res) => {
        if (res) {
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
    refreshTable() {
      this.$refs.table.fetch()
    },
    deleteInfo(row) {
      const id = row.id || ''
      id &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          deleteTerminal(id).then((res) => {
            if (res && res.data.status) {
              ;(this.$refs.table as any).fetch()
              this.$notify.success('删除计算机终端成功')
            } else {
              this.$notify.error('删除计算机终端失败,请稍后再试')
            }
          })
        })
    },
  },
}
</script>
<style lang="scss" module>
.mb {
  margin-bottom: $gapNormal;
}

.tableClick {
  color: #3273c4;
  cursor: pointer;

  span:not(:first-child) {
    margin-left: 4px;
  }
}
</style>
