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
            placeholder="请输入设备品牌或型号查询"
          />
        </ElFormItem>
        <ElFormItem label="密级：">
          <ElSelect
            v-model="filterForm.classifyId"
            placeholder="请选择"
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
        @click="addStorage()"
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
      :get="activeName === '7' && queryStorage"
      :query="filterForm"
    >
      <template #prefix>
        <ElTableColumn
          prop="brandName"
          label="品牌"
          width="120"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/storageInfo`"
            >
              {{ row.brandName }}
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
              :to="`${route.fullPath}/${row.id}/editStorage`"
            >
              <span>编辑</span>
            </RouterLink>
            <span @click="del(row)">删除</span>
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
import IDialog from './importStorage'
import { ISINTERNET } from '../enums'
import {
  pageQueryAllStorage,
  pageQueryCurrentStorage,
  pageQueryStorage,
  exportTotalStorage,
  exportCompanyTotalStorage,
  exportCompanyBelowTotalStorage,
  deleteStorage,
} from '@/api/assetsManage/storage'
import { save } from '@/utils/downloader'
import getCode from '@/enums/code'
import { ROLES } from '@/enums'
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
        classifyId: '',
      },
    }
  },
  computed: {
    SECRETLEVEL: () => SECRETLEVEL.value || [],
    ISINTERNET: () => ISINTERNET,
    ROLES: () => ROLES,
    head: () => [
      { label: '型号', prop: 'modelNumber' },
      {
        label: '设备密级',
        prop: 'classifyStr',
      },
      {
        label: '配置',
        prop: 'detailConfig',
      },
      {
        label: '已用空间',
        prop: 'usedSpace',
      },
      { label: '数量', prop: 'amount' },
      { label: '备注', prop: 'description' },
      { label: '所属单位', prop: 'belongCompanyStr' },
      { label: '添加时间', prop: 'createDate' },
    ],
    queryStorage() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return pageQueryCurrentStorage
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return pageQueryStorage
        default:
          return pageQueryAllStorage
      }
    },
    exportTable() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return exportCompanyTotalStorage
        case this.filterForm.belongCompanyId && !this.levelSwitch:
          return exportCompanyBelowTotalStorage
        default:
          return exportTotalStorage
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
    async pageQueryCurrentStorage() {
      const res = await pageQueryCurrentStorage
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async pageQueryStorage() {
      const res = await pageQueryStorage
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async pageQueryAllStorage() {
      const res = await pageQueryAllStorage
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    addStorage() {
      this.$router.push({ path: `${this.route.fullPath}/addStorage` })
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
    del(data) {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        deleteStorage(data.id).then(() => {
          this.$notify.success('删除成功')
          this.refreshTable()
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
