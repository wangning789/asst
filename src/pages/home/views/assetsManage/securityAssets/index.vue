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
        :class="$style.searchForm"
      >
        <span
          :class="$style.moreSearch"
          @click="showSearch = !showSearch"
        >{{
          showSearch ? '收起∧' : '高级搜索∨'
        }}</span>
        <ElFormItem label="关键字查询：">
          <ElInput
            v-model="filterForm.keyword"
            clearable
            placeholder="请输入安全产品或IP信息"
          />
        </ElFormItem>
        <ElFormItem
          class="transition-box"
          label="部署网络环境："
        >
          <ElSelect
            v-model="filterForm.deployEnvir"
            placeholder="全部"
            clearable
          >
            <ElOption
              v-for="(val, key) in DEPLOY"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>

        <ElCollapseTransition>
          <div v-show="showSearch">
            <ElFormItem label="安全资产类型：">
              <ElSelect
                v-model="filterForm.ciType"
                placeholder="全部"
                clearable
              >
                <ElOption
                  v-for="(val, key) in CITYPE"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>

            <ElFormItem
              class="transition-box"
              label="添加时间："
            >
              <ElDatePicker
                v-model="date"
                type="datetimerange"
                clearable
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :format="DATE_TIME.dateTime"
                :value-format="DATE_TIME.serverDateTime"
                @change="
                  ;[filterForm.beginTime, filterForm.endTime] = $event || [
                    '',
                    '',
                  ]
                "
              />
            </ElFormItem>
          </div>
        </ElCollapseTransition>
      </ElForm>
    </Transition>
    <div :class="$style.mb">
      <ElButton
        v-if="!checkPower"
        type="primary"
        size="small"
        :class="$style.button"
        @click="addSecurity()"
      >
        添加
      </ElButton>
      <ElButton
        v-if="!checkPower"
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
      <ElButton
        v-if="!checkPower"
        type="primary"
        size="small"
        :class="$style.button"
        @click="delSecuritys()"
      >
        批量删除
      </ElButton>
    </div>
    <ITable
      ref="multipleTable"
      :head="head"
      :get="activeName === '2' && queryHost"
      :query="filterForm"
      :data="queryHost"
      @select="handleSelectionChange"
    >
      >
      <template #prefix>
        <!-- 多选框 -->
        <ElTableColumn
          type="selection"
          width="55"
        />

        <ElTableColumn
          prop="ciName"
          label="安全产品名称"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/securityInfo`"
            >
              {{ row.ciName }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>

      <ElTableColumn
        show-overflow-tooltip
        prop="createDate"
        label="添加时间"
        sortable
      />

      <ElTableColumn
        v-if="!checkPower"
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <RouterLink
              tag="span"
              :to="`${route.fullPath}/${row.id}/editSecurity`"
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
import LAYOUT from '@/scss/export/layout.scss'
import IDialog from './importSecurity'
import ElDatePicker from 'element-ui/lib/date-picker'
import {
  exportAll,
  exportCurrent,
  exportCurrentAndNext,
  listAll,
  listCurrent,
  listCurrentAndNext,
  deleteSecurity,
} from '@/api/assetsManage/security'
import getCode from '@/enums/code'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { save } from '@/utils/downloader'
import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'
const DEPLOY = getCode('1', 'SYS_asset_secu_dev_de')
const CITYPE = getCode('1', 'SYS_asset_secu_dev_type')
const CIFORM = getCode('1', 'SYS_asset_secu_dev_form')
const NETWORKTYPE = getCode('1', 'SYS_asset_network_type')
const REGION = getCode('1', 'SYS_asset_network_region')
export default {
  props: {
    route: { type: Object, required: true },
    belongCompanyId: { type: String, default: '' },
    levelSwitch: { type: Boolean, default: false },
    activeName: { type: String, default: '0' },
  },
  components: { ITable, ElTableColumn, IDialog, ElDatePicker },
  data() {
    return {
      showSearch: false,
      isLoadingTree: true,
      tree: (null as any) as Menu,
      isLoadingTable: false,
      disabled: true,
      selected: (null as any) as Menu,
      filterForm: {
        belongCompanyId: '',
        ciName: '',
        createDate: '',
        keyword: '',
        beginTime: '',
        endTime: '',
        orderField: 'create_date',
        orderFieldType: 'desc',
      },

      visible: false,
      multipleSelection: [],
      checkedOne: true,
      organizations: [],
      newForm: {},
      date: ['', ''],
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    DEPLOY: () => DEPLOY.value,
    ROLES: () => ROLES,
    CITYPE: () => CITYPE.value,
    CIFORM: () => CIFORM.value,
    NETWORKTYPE: () => NETWORKTYPE.value,
    REGION: () => REGION.value,
    DATE_TIME: () => DATE_TIME,
    head: () => [
      {
        prop: 'ciType',
        label: '安全产品类型',
      },
      {
        prop: 'form',
        label: '安全产品形态',
      },
      {
        prop: 'deployEnvir',
        label: '部署网络环境',
      },
      {
        prop: 'intranetIp',
        label: 'IP(内网)',
      },
      {
        prop: 'internetIp',
        label: 'IP(互联网)',
      },
      { prop: 'belongCompanyId', label: '所属单位' },
    ],
    checkPower() {
      const power =
        this.authFit(ROLES.groupLeaders) ||
        this.authFit(ROLES.securityExperts) ||
        this.authFit(ROLES.monitorAnlysis) ||
        this.authFit(ROLES.opertateMaintenance) ||
        this.authFit(ROLES.projectManager)
      return power
    },
    queryHost() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return listCurrent
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.groupLeaders) ||
          this.authFit(ROLES.unitSO):
          return listCurrentAndNext
        default:
          return listAll
      }
    },

    exportTable() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return exportCurrent
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return exportCurrentAndNext
        default:
          return exportAll
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
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },

    // 批量删除
    delSecuritys() {
      let ids = []
      if (this.multipleSelection.length) {
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        })
          .then(() => {
            ids = this.multipleSelection.map((item) => {
              return item.id || ''
            })
            deleteSecurity({ ids }).then((res) => {
              if (res && res.data.status) {
                this.$notify.success('批量删除成功')
                ;(this.$refs.multipleTable as any).fetch()
              } else {
                let errMessage = '批量删除失败,请稍后再试'
                if (res.data && res.data.msg) {
                  errMessage = res.data.msg
                }
                this.$message.error(errMessage)
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      } else {
        this.$message.warning('请选择数据')
      }
    },
    // 选择设置
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    async listAll() {
      const res = await listAll.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },

    async listCurrent() {
      const res = await listCurrent.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    async listCurrentAndNext() {
      const res = await listCurrentAndNext
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },

    addSecurity() {
      this.$router.push({ path: `${this.route.fullPath}/addSecurity` })
    },
    deleteInfo(row) {
      const id = row.id || ''
      const ids = []
      ids.push(id)
      const params = {
        ids,
      }
      id &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        })
          .then(() => {
            deleteSecurity(params).then((res) => {
              if (res && res.data.status) {
                ;(this.$refs.multipleTable as any).fetch()
                this.$notify.success('删除成功')
              } else {
                let errMessage = '删除失败,请稍后再试'
                if (res.data && res.data.msg) {
                  errMessage = res.data.msg
                }
                this.$message.error(errMessage)
              }
            })
          })
          .catch(() => {
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
      ;(this.$refs.multipleTable as any).fetch()
    },
  },
  created() {
    this.fetchOrganization()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>
<style lang="scss" module>
.searchForm {
  position: relative;
}

.moreSearch {
  position: absolute;
  top: 0;
  right: 0;
  color: #3273c4;
  cursor: pointer;
}

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
