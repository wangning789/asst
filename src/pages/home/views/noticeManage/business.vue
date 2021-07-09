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
        <ElFormItem label="关键字查询：">
          <ElInput
            v-model="filterForm.keyword"
            clearable
            placeholder="请输入系统名称或访问地址"
          />
        </ElFormItem>
        <ElFormItem label="所属单位：">
          <ElSelect
            v-model="filterForm.belongCompanyId"
            placeholder="请选择"
            clearable
            filterable
          >
            <ElOption
              v-for="item in organizations"
              :key="item.id"
              :label="item.organizationName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="系统部署环境：">
          <ElSelect
            v-model="filterForm.networkId"
            placeholder="请选择"
            clearable
          >
            <ElOption
              v-for="(val, key) in SUROUNDDNGS"
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
      :head="head"
      :get="activeName === '0' && queryBiz"
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

import {
  exportallBiz,
  exportBiz,
  exportcurrentBiz,
  querypageAllBiz,
  querypageCurrentBiz,
  querypageBizForOP,
} from '@/api/assetsBusiness/assetsBusiness'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import getCode from '@/enums/code'
import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'
const IPTYPE = getCode('1', 'SYS_asset_network_zone')
const DEPOSITLOCATION = getCode('1', 'SYS_asset_location_zone')
const SUROUNDDNGS = getCode('1', 'SYS_asset_secu_dev_de')
const GRADING = getCode('1', 'SYS_asset_sys_level')
const HOSTING = getCode('1', 'SYS_asset_location_zone')
const CATEGORY = getCode('1', 'SYS_ASSET_BIZ_TYPE')
export default {
  props: {
    belongCompanyId: { type: String, default: '' },
    levelSwitch: { type: Boolean, default: false },
    activeName: { type: String, default: '0' },
  },
  components: { ITable, ElTableColumn },
  data() {
    return {
      filterForm: {
        belongCompanyId: this.belongCompanyId,
        keyWord: '',
        ciName: '',
        sysLevelId: '',
        beginTime: '',
        endTime: '',
      },
      multipleSelection: [],
      organizations: [],
      date: '',
    }
  },
  computed: {
    IPTYPE: () => IPTYPE.value || [],
    DEPOSITLOCATION: () => DEPOSITLOCATION.value || [],
    SUROUNDDNGS: () => SUROUNDDNGS.value || [],
    GRADING: () => GRADING.value || [],
    HOSTING: () => HOSTING.value || [],
    CATEGORY: () => CATEGORY.value || [],
    ROLES: () => ROLES,
    DATE_TIME: () => DATE_TIME,
    head: () => [
      { prop: 'ciName', label: '系统名称' },
      { prop: 'networkStr', label: '系统部署环境' },
      { prop: 'internetAddress', label: '互联网访问地址' },
      { prop: 'intranetAddress', label: '内网访问地址' },
      { prop: 'belongCompanyStr', label: '所属单位' },
    ],
    queryBiz() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return querypageCurrentBiz
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return querypageBizForOP
        default:
          return querypageAllBiz
      }
    },
    exportTable() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return exportcurrentBiz
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return exportBiz
        default:
          return exportallBiz
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
    async querypageCurrentBiz() {
      const res = await querypageCurrentBiz
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async querypageBizForOP() {
      const res = await querypageBizForOP.apply(null, arguments).finally(() => {
        this.isLoadingForm = false
      })
      return res
    },
    async querypageAllBiz() {
      const res = await querypageAllBiz.apply(null, arguments).finally(() => {
        this.isLoadingForm = false
      })
      return res
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      this.$emit('getData', this.multipleSelection)
    },
    rowKeys(row) {
      return row.id
    },
  },
  created() {
    this.fetchOrganization()
    this.filterForm.beginTime = this.date[0]
    this.filterForm.endTime = this.date[1]
    this.filterForm.belongCompanyId = this.belongCompanyId
  },
}
</script>

<style lang="scss" module>
.searchForm {
  position: relative;
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

.tableClick {
  color: #3273c4;
  cursor: pointer;

  span:not(:first-child) {
    margin-left: 4px;
  }
}

.bottomButton {
  margin-top: 35px;
}
</style>
