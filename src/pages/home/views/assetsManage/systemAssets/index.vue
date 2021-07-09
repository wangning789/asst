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
            placeholder="请输入系统名称或访问地址"
          />
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
        <ElFormItem label="系统定级：">
          <ElSelect
            v-model="filterForm.sysLevelId"
            placeholder="请选择"
            clearable
          >
            <ElOption
              v-for="(val, key) in GRADING"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
        <ElCollapseTransition>
          <div v-show="showSearch">
            <ElFormItem
              class="transition-box"
              label="托管位置："
            >
              <ElSelect
                v-model="filterForm.locationZoneId"
                placeholder="全部"
                clearable
              >
                <ElOption
                  v-for="(val, key) in HOSTING"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="系统类别：">
              <ElSelect
                v-model="filterForm.ciType"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in CATEGORY"
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
                  ;[filterForm.beginTime, filterForm.endTime] = $event || []
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
        @click="addBusiness()"
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
        @click="dialogVisible = true"
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
      :head="head"
      :get="activeName === '0' && queryBiz"
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
          label="系统名称"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/BusinessInfo`"
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
              :to="`${route.fullPath}/${row.id}/editBiz`"
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
    <ElDialog
      center
      title="导出"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <ElForm
        ref="form"
        label-position="right"
        :model="form"
        :class="$style.wrapper"
        :label-width="CONFIG.labelWidth"
      >
        <ElFormItem
          label="选择模板类型："
          prop="ciStatus"
          :rules="{
            required: true,
            message: '请选择模板类型',
            trigger: 'blur',
          }"
        >
          <ElSelect
            v-model="form.ciStatus"
            placeholder="请选择模板类型"
          >
            <ElOption
              label="应用系统自主可控应用评估台账"
              value="0"
            />

            <ElOption
              label="应用系统资产列表"
              value="1"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          type="primary"
          @click="exportBiz()"
        >导出</ElButton>
      </span>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ITable, { ElTableColumn } from '@com/Table'
import IDialog from './importBusiness'
import { IMPORTANCE } from '../enums'

import {
  exportallBiz, // 导出所有单位业务资产
  exportallBizTwo,
  exportBiz,
  exportBizTwo, // 导出当前单位业务资产和下级单位资产
  exportcurrentBiz,
  exportcurrentBizTwo, // 导出所有资产
  querypageAllBiz,
  querypageBiz,
  querypageCurrentBiz,
  deleteBiz,
  deleteAllBiz,
} from '@/api/assetsBusiness/assetsBusiness'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import getCode from '@/enums/code'
import { ROLES } from '@/enums'
import { save } from '@/utils/downloader'
import { DATE_TIME } from '@/enums/format'
const IPTYPE = getCode('1', 'SYS_asset_network_zone')
const DEPOSITLOCATION = getCode('1', 'SYS_asset_location_zone')
const SUROUNDDNGS = getCode('1', 'SYS_asset_secu_dev_de')
const GRADING = getCode('1', 'SYS_asset_sys_level')
const HOSTING = getCode('1', 'SYS_asset_location_zone')
const CATEGORY = getCode('1', 'SYS_ASSET_BIZ_TYPE')
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
      form: {
        ciStatus: '0',
      },
      dialogVisible: false,
      filterForm: {
        belongCompanyId: '',
        keyWord: '',
        ciName: '',
        sysLevelId: '',
        beginTime: '',
        endTime: '',
      },
      visible: false,
      multipleSelection: [],
      showSearch: false,
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
    IMPORTANCE: () => IMPORTANCE,
    ROLES: () => ROLES,
    DATE_TIME: () => DATE_TIME,
    head: () => [
      { prop: 'networkStr', label: '系统部署环境' },
      { prop: 'locationZoneStr', label: '托管位置' },
      { prop: 'ciTypeStr', label: '系统类型' },
      { prop: 'sysLevelStr', label: '系统定级' },
      { prop: 'internetAddress', label: '互联网访问地址' },
      { prop: 'intranetAddress', label: '内网访问地址' },
      { prop: 'belongCompanyStr', label: '所属单位' },
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
    queryBiz() {
      switch (true) {
        case this.filterForm.belongCompanyId && this.levelSwitch:
          return querypageCurrentBiz
        case (this.filterForm.belongCompanyId && !this.levelSwitch) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders):
          return querypageBiz
        default:
          return querypageAllBiz
      }
    },
    exportTable() {
      if (
        this.filterForm.belongCompanyId &&
        this.levelSwitch &&
        this.form.ciStatus === '0'
      ) {
        return exportcurrentBiz
      } else if (
        this.filterForm.belongCompanyId &&
        this.levelSwitch &&
        this.form.ciStatus === '1'
      ) {
        return exportcurrentBizTwo
      } else if (
        !this.levelSwitch &&
        this.form.ciStatus === '0' &&
        (this.authFit(ROLES.unitSO) || this.authFit(ROLES.groupLeaders))
      ) {
        return exportBiz
      } else if (
        this.filterForm.belongCompanyId &&
        !this.levelSwitch &&
        this.form.ciStatus === '0'
      ) {
        return exportBiz
      } else if (
        !this.levelSwitch &&
        this.form.ciStatus === '1' &&
        (this.authFit(ROLES.unitSO) || this.authFit(ROLES.groupLeaders))
      ) {
        return exportBizTwo
      } else if (
        this.filterForm.belongCompanyId &&
        !this.levelSwitch &&
        this.form.ciStatus === '1'
      ) {
        return exportBizTwo
      } else if (this.form.ciStatus === '0') {
        return exportallBiz
      } else {
        return exportallBizTwo
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
    handleClose() {
      this.dialogVisible = false
    },
    async querypageCurrentBiz() {
      const res = await querypageCurrentBiz
        .apply(null, arguments)
        .finally(() => {
          this.isLoadingForm = false
        })
      return res
    },
    async querypageBiz() {
      const res = await querypageBiz.apply(null, arguments).finally(() => {
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
    addBusiness() {
      this.$router.push({ path: `${this.route.fullPath}/addBusiness` })
    },
    deleteInfo(row) {
      const id = row.id || ''
      id &&
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteBiz(id).then((res) => {
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
    exportBiz() {
      ;(this.$refs.form as any).validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.$notify.info('正在导出中，请稍后......')
          this.exportTable(this.filterForm).then((res) => {
            if (res) {
              res.name = decodeURIComponent(res.name)
              save(res)
            }
          })
        }
      })
    },
    refreshTable() {
      ;(this.$refs.table as any).fetch()
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
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
          deleteAllBiz(ids).then((res) => {
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

  created() {
    this.fetchOrganization()
    this.filterForm.beginTime = this.date[0]
    this.filterForm.endTime = this.date[1]
  },
}
</script>

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

.bottomButton {
  margin-top: 35px;
}
</style>
