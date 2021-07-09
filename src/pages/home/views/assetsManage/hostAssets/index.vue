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
            placeholder="请输入服务器名称或IP信息"
          />
        </ElFormItem>
        <ElFormItem label="部署网络环境：">
          <ElSelect
            v-model="filterForm.networkTypeCode"
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
        <ElFormItem label="托管位置：">
          <ElSelect
            v-model="filterForm.depositLocationCode"
            placeholder="请选择托管位置"
            clearable
          >
            <ElOption
              v-for="(val, key) in DEPOSITLOCATION"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
        <div v-show="showSearch">
          <ElFormItem label="操作系统：">
            <ElSelect
              v-model="filterForm.osType"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in OSTYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="服务器形态：">
            <ElSelect
              v-model="filterForm.ciType"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in HOSTTYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="添加时间：">
            <ElDatePicker
              v-model="date"
              clearable
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :format="DATE_TIME.dateTime"
              :value-format="DATE_TIME.serverDateTime"
              @change="
                ;[filterForm.beginTime, filterForm.endTime] = $event || ['', '']
              "
            />
          </ElFormItem>
        </div>
      </ElForm>
    </Transition>
    <div :class="$style.mb">
      <ElButton
        v-if="!checkPower"
        type="primary"
        size="small"
        :class="$style.button"
        @click="addHost()"
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
        @click="deleteAll()"
      >
        批量删除
      </ElButton>
    </div>
    <ITable
      ref="table"
      v-loading="isLoadingTable"
      :head="head"
      :get="activeName === '1' && queryHost"
      :query="filterForm"
      @select="handleSelectionChange"
    >
      <template #prefix>
        <ElTableColumn
          type="selection"
          width="55"
        />
        <ElTableColumn
          prop="ciName"
          label="服务器名称"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/hostInfo`"
            >
              {{ row.ciName }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>

      <ElTableColumn
        v-if="!checkPower"
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <RouterLink
              tag="span"
              :to="`${route.fullPath}/${row.id}/editHost`"
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
import IDialog from './importHost'
import ElDatePicker from 'element-ui/lib/date-picker'
import LAYOUT from '@/scss/export/layout.scss'
import {
  queryTotalHost,
  queryCompanyTotalHost,
  queryCompanyBelowTotalHost,
  exportTotalHost,
  exportCompanyTotalHost,
  exportCompanyBelowTotalHost,
  batchDeleteHosts,
  deleteHost,
} from '@/api/assetsManage/host'
import getCode from '@/enums/code'
import { save } from '@/utils/downloader'
import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'
const IPTYPE = getCode('1', 'SYS_asset_network_type')
const DEPOSITLOCATION = getCode('1', 'SYS_asset_location_zone')
const OSTYPE = getCode('1', 'SYS_asset_os_type')
const HOSTTYPE = getCode('1', 'SYS_asset_type')
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
      isLoadingTable: false,
      disabled: true,
      selected: (null as any) as Menu,
      filterForm: {
        belongCompanyId: '',
        keyword: '',
        networkTypeCode: '',
        depositLocationCode: '',
        ciType: '',
        osType: '',
        beginTime: '',
        endTime: '',
      },
      visible: false,
      multipleSelection: [],
      showFail: false,
      date: ['', ''],
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    IPTYPE: () => IPTYPE.value || [],
    DEPOSITLOCATION: () => DEPOSITLOCATION.value || [],
    HOSTTYPE: () => HOSTTYPE.value || [],
    OSTYPE: () => OSTYPE.value || [],
    ROLES: () => ROLES,
    DATE_TIME: () => DATE_TIME,
    head: () => [
      { prop: 'networkTypeName', label: '部署网络环境' },
      { prop: 'depositLocationName', label: '托管位置' },
      {
        label: 'IP(内网)',
        formatter: (row) => {
          const addresses = row.addresses || []
          let res = ''
          const ip = []
          addresses.length &&
            addresses.forEach((item) => {
              if (item.type === 1) {
                item.ip && ip.push(item.ip)
              }
            })
          res = ip.length > 1 ? ip.join(', ') : ip[0]
          return res
        },
      },
      {
        label: 'IP(互联网)',
        formatter: (row) => {
          const addresses = row.addresses || []
          let res = ''
          const ip = []
          addresses.length &&
            addresses.forEach((item) => {
              if (item.type === 2) {
                item.ip && ip.push(item.ip)
              }
            })
          res = ip.length > 1 ? ip.join(', ') : ip[0]
          return res
        },
      },
      { prop: 'osName', label: '操作系统' },
      { prop: 'ciTypeName', label: '服务器形态' },
      { prop: 'belongCompanyName', label: '所属单位' },
      { prop: 'createDate', label: '添加时间' },
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
          return queryCompanyTotalHost
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return queryCompanyBelowTotalHost
        default:
          return queryTotalHost
      }
    },
    exportTable() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return exportCompanyTotalHost
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return exportCompanyBelowTotalHost
        default:
          return exportTotalHost
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
    async queryCompanyTotalHost() {
      const res = await queryCompanyTotalHost
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingTable = false
        })
      return res
    },
    async queryCompanyBelowTotalHost() {
      const res = await queryCompanyBelowTotalHost
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingTable = false
        })
      return res
    },
    async queryTotalHost() {
      const res = await queryTotalHost.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    addHost() {
      this.$router.push({ path: `${this.route.fullPath}/addHost` })
    },
    deleteInfo(row) {
      const id = row.id || ''
      id &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          deleteHost(id).then((res) => {
            if (res && res.data.status) {
              ;(this.$refs.table as any).fetch()
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
    },
    exportHost() {
      this.$notify.info('正在导出中，请稍后......')
      this.exportTable(this.filterForm).then((res) => {
        if (res) {
          // 要在此处判断一下是否取到值，ie浏览器在downloader的doemload方法中没有返回值
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
    refreshTable() {
      ;(this.$refs.table as any).fetch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteAll() {
      let ids = []
      if (this.multipleSelection.length) {
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          ids = this.multipleSelection.map((item) => {
            return item.id || ''
          })
          batchDeleteHosts(ids).then((res) => {
            if (res && res.data.status) {
              ;(this.$refs.table as any).fetch()
              this.$notify.success('批量删除成功')
            } else {
              let errMessage = '批量删除失败,请稍后再试'
              if (res.data && res.data.msg) {
                errMessage = res.data.msg
              }
              this.$message.error(errMessage)
            }
          })
        })
      } else {
        this.$message.warning('请选择数据')
      }
    },
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
<style lang="scss" module>
.moreSearch {
  position: absolute;
  top: 0;
  right: 0;
  color: #3273c4;
  cursor: pointer;
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
