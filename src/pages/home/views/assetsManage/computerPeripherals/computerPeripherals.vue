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
            placeholder="请输入品牌或者型号"
          />
        </ElFormItem>
        <ElFormItem label="密级：">
          <ElSelect
            v-model="filterForm.secretRelatedLevel"
            placeholder="全部"
            clearable
          >
            <ElOption
              v-for="(val, key) in IPTYPE"
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
        @click="addHost()"
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
        @click="exportHost()"
      >
        导出
      </ElButton>
    </div>
    <ITable
      ref="table"
      v-loading="isLoadingTable"
      :head="head"
      :get="activeName === '6' && queryHost"
      :query="filterForm"
    >
      <template #prefix>
        <ElTableColumn
          prop="ciType"
          label="设备类型"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/assetsManage/addPeripherals/inof`"
            >
              {{ row.ciType }}
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
              :to="`${route.fullPath}/${row.id}/assetsManage/addPeripherals/edit`"
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
import IDialog from '@home/views/assetsManage/computerPeripherals/importPeripheral'
import LAYOUT from '@/scss/export/layout.scss'
import { ROLES } from '@/enums'
import {
  listAll,
  equipment,
  exportPeripheralsAll,
  exportCurrentLevel,
  deletePeripheral,
} from '@/api/assetsManage/computerPeripherals'
import getCode from '@/enums/code'
import { save } from '@/utils/downloader'
const IPTYPE = getCode('1', 'SYS_asset_srl')
const DEPOSITLOCATION = getCode('1', 'SYS_asset_location_zone')
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
      peripheral: [],
      isLoadingTable: false,
      disabled: true,
      selected: (null as any) as Menu,
      filterForm: {
        belongCompanyId: '',

      },
      visible: false,
    }
  },
  computed: {
    ROLES: () => ROLES,
    GAP: () => +LAYOUT.gap,
    IPTYPE: () => IPTYPE.value || [],
    DEPOSITLOCATION: () => DEPOSITLOCATION.value || [],
    head: () => [
      { prop: 'brand', label: '品牌' },
      { prop: 'modelNumber', label: '型号' },
      { prop: 'secretRelatedLevel', label: '设备密级' },
      { prop: 'connected', label: '是否联网' },
      { prop: 'quantity', label: '数量', align: 'right' },
      { prop: 'remark', label: '备注' },
      { prop: 'belongCompanyId', label: '所属单位', align: 'right' },
      { prop: 'createDate', label: '添加时间' },
    ],
    queryHost() {
      switch (true) {
        case (this.filterForm.belongCompanyId && this.levelSwitch) ||
         this.authFit(ROLES.groupLeaders):
          return equipment
        default:
          return listAll
      }
    },
    exportTable() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return exportCurrentLevel
        default:
          return exportPeripheralsAll
      }
    },
  },
  watch: {
    belongCompanyId(newVal) {
      if (newVal) {
        this.filterForm.belongCompanyId = newVal
      }
    },
    levelSwitch(newVal) {
      this.filterForm.levelSwitch = newVal
    },
  },
  methods: {
    async equipment() {
      const res = await equipment
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingTable = false
        })
      return res
    },
    async exportCurrentLevel() {
      const res = await exportCurrentLevel.apply(null, arguments).finally(() => {
        this.isLoadingForm = false
      })
      return res
    },

    async exportPeripheralsAll() {
      const res = await exportPeripheralsAll.apply(null, arguments).finally(() => {
        this.isLoadingForm = false
      })
      return res
    },

    async listAll() {
      const res = await listAll.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    addHost() {
      this.$router.push({ path: `${this.route.fullPath}/addPeripherals` })
    },
    deleteInfo(row) {
      const id = row.id || ''
      const ids = []
      ids.push(id)
      const params = {
        ids,
      }
      id && this.$confirm('此操作不可逆,确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        deletePeripheral(params).then(() => {
          (this.$refs.table as any).fetch()
          this.$notify.success('删除资产成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    exportHost() {
      this.$notify.info('正在导出中，请稍后......')
      this.exportTable(this.filterForm).then((res) => {
        if (res) {
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
    refreshTable() {
      ;(this.$refs.table as any).fetch()
    },
  },

}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>
<style lang="scss" module>
.tree {
  max-height:
    calc(
      100vh - #{$gapTop + $gapBottom + $gapNormal * 2.25 + $heightInput}
    );
  overflow: auto;
  border: $borderBase;
}

.main {
  max-width: $lg;
  margin: auto !important;
}

.form {
  width: 650px;
  margin: $gapNormal auto;
}

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
