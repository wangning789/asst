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
            v-model="filterForm.deployEnvir"
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
      :get="querySecurity"
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
  listAll,
  listCurrent,
  listCurrentAndNextForOP,
} from '@/api/assetsManage/security'
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
      { prop: 'ciName', label: '安全产品名称' },
      { prop: 'ciType', label: '安全产品类型' },
      { prop: 'deployEnvir', label: '部署网络环境' },
      { prop: 'internetIp', label: 'IP（互联网）' },
      { prop: 'intranetIp', label: 'IP（内网）' },
      { prop: 'belongCompanyId', label: '所属单位' },
    ],
    querySecurity() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return listCurrent
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return listCurrentAndNextForOP
        default:
          return listAll
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
      const res = await listCurrent
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async querypageBiz() {
      const res = await listCurrentAndNextForOP.apply(null, arguments).finally(() => {
        this.isLoadingForm = false
      })
      return res
    },
    async querypageAllBiz() {
      const res = await listAll.apply(null, arguments).finally(() => {
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
