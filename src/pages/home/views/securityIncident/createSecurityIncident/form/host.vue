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
            placeholder="请输入服务器名称或IP"
          />
        </ElFormItem>
        <ElFormItem
          label="所属单位："
          prop="belongCompanyId"
        >
          <ElSelect
            v-model="filterForm.belongCompanyId"
            placeholder="请选择所属单位"
            clearable
            filterable
            @change="handleChange"
          >
            <ElOption
              v-for="item in organizations"
              :key="item.id"
              :label="item.organizationName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="部署网络环境："
          prop="networkTypeCode"
        >
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
      </ElForm>
    </Transition>
    <ITable
      ref="table"
      v-loading="isLoadingTable"
      :head="head"
      :get="queryCompanyBelowTotalHostForOP"
      :query="filterForm"
      @select="handleSelectionChange"
    >
      <template #prefix>
        <ElTableColumn
          type="selection"
          :reserve-selection="true"
          width="55"
        />
      </template>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import LAYOUT from '@/scss/export/layout.scss'
import {
  queryTotalHost,
  queryCompanyTotalHost,
  queryCompanyBelowTotalHostForOP,
} from '@/api/assetsManage/host'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import getCode from '@/enums/code'
import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'

const IPTYPE = getCode('1', 'SYS_asset_network_type')
const DEPOSITLOCATION = getCode('1', 'SYS_asset_location_zone')
const OSTYPE = getCode('1', 'SYS_asset_os_type')
const HOSTTYPE = getCode('1', 'SYS_asset_type')
export default {
  props: {
    companyId: { type: String, default: () => '' },
  },
  components: { ITable, ElTableColumn },
  data() {
    return {
      showSearch: false,
      isLoadingTable: false,
      disabled: true,
      selected: (null as any) as Menu,
      filterForm: {
        belongCompanyId: this.companyId,
        keyword: '',
        networkTypeCode: '',
        depositLocationCode: '',
        ciType: '',
        osType: '',
        beginTime: '',
        endTime: '',
      },
      multipleSelection: [],
      showFail: false,
      date: ['', ''],
      organizations: [],
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
      { prop: 'ciName', label: '服务器名称' },

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
      { prop: 'belongCompanyName', label: '所属单位' },
      { prop: 'networkTypeName', label: '部署网络环境' },
    ],
    queryHost() {
      return queryCompanyBelowTotalHostForOP
    },
  },
  watch: {
    organizations(newVal) {
      this.organizations = newVal
    },
    companyId(newVal) {
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
    async queryCompanyBelowTotalHostForOP() {
      const res = await queryCompanyBelowTotalHostForOP
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

    refreshTable() {
      ;(this.$refs.table as any).fetch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      this.$emit('getData', this.multipleSelection)
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
    handleChange(val) {
      this.$forceUpdate()
      if (val) {
        this.$set(this.filterForm, this.filterForm.belongCompanyId, val)
      } else {
        this.$set(this.filterForm, this.filterForm.belongCompanyId, '')
      }
    },
  },
  created() {
    this.fetchOrganization()
    this.filterForm.belongCompanyId = this.companyId
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
<style lang="scss" module>
.tableClick {
  color: #3273c4;
  cursor: pointer;

  span:not(:first-child) {
    margin-left: 4px;
  }
}
</style>
