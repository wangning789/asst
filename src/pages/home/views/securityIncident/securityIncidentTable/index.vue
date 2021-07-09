<template>
  <div :class="$style.container">
    <div class="el-card">
      <div :class="$style.titleText">
        安全事件列表
      </div>
      <div :class="$style.filterWrap">
        <Transition
          name="fold"
          mode="out-in"
        >
          <ElForm
            :inline="true"
            :label-width="CONFIG.labelWidth"
            :model="formInline"
          >
            <div
              :class="$style.moreSearch"
              @click="showSearch = !showSearch"
            >
              <span>{{ showSearch ? '收起∧' : '高级搜索∨' }}</span>
            </div>
            <ElFormItem label="事件名称：">
              <ElInput
                v-model="formInline.incidentName"
                clearable
                placeholder="请输入事件名称"
              />
            </ElFormItem>
            <ElFormItem label="事件级别:">
              <ElSelect
                v-model="formInline.incidentLevel"
                placeholder="请选择事件级别"
                clearable
              >
                <ElOption
                  v-for="(val, key) in DEALLEVEL"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="处置状态：">
              <ElSelect
                v-model="formInline.incidentStatus"
                placeholder="请选择事件处置状态"
                clearable
              >
                <ElOption
                  v-for="(val, key) in DEALSTATUS"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="上报时间：">
              <ElDatePicker
                v-model="beginDateRange"
                clearable
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :format="DATE_TIME.dateTime"
                :value-format="DATE_TIME.serverDateTime"
                @change="
                  ;[formInline.beginTime, formInline.endTime] = $event || []
                "
              />
            </ElFormItem>
            <div v-show="showSearch">
              <ElFormItem label="发生时间：">
                <ElDatePicker
                  v-model="reportDateRange"
                  clearable
                  type="datetimerange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :format="DATE_TIME.dateTime"
                  :value-format="DATE_TIME.serverDateTime"
                  @change="
                    ;[
                      formInline.incidentHappenBeginDate,
                      formInline.incidentHappenEndDate,
                    ] = $event || []
                  "
                />
              </ElFormItem>
              <ElFormItem
                label="事件类型："
                prop="incidentType"
              >
                <ElSelect
                  v-model="formInline.incidentType"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in INCIDENTTYPE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                label="事件所属单位："
                prop="company"
              >
                <ElSelect
                  v-model="formInline.company"
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
              <ElFormItem
                label="事件来源："
                prop="reportSource"
              >
                <ElSelect
                  v-model="formInline.reportSource"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <ElOption
                    v-for="(val, key) in SECURITYSOURCE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
            </div>
          </ElForm>
        </Transition>
      </div>

      <ElButton
        v-if="showCreateButton"
        type="primary"
        :class="$style.button"
        style="margin-left: 10px;"
        @click="createIncident"
      >
        上报安全事件
      </ElButton>
      <ElButton
        v-if="showExport"
        type="primary"
        :class="$style.button"
        @click="exportList"
      >
        导出
      </ElButton>
      <ElCheckbox
        v-if="showMyIncident"
        v-model="myIncident"
        style="float: right; margin: 40px 20px 0;"
      >
        我上报的安全事件
      </ElCheckbox>
      <div :class="$style.tableWrap">
        <ITable
          ref="table"
          :head="head"
          :get="getSecurityIncident"
          :query="formInline"
          :class="$style.table"
        >
          <ElTableColumn
            width="200"
            label="操作"
          >
            <template #default="{ row }">
              <div :class="$style.tableClick">
                <RouterLink
                  tag="span"
                  :to="`${route.fullPath}/${row.id}/info`"
                >
                  <span :class="$style.look">查看</span>
                </RouterLink>
                <span
                  v-if="
                    showCreateTask && row.incidentStatus === 'SYS_TO_HANDLE'
                  "
                  @click.once="startDeal(row.id)"
                >开始处置</span>
                <RouterLink
                  v-if="showModifyDelete(row)"
                  tag="span"
                  :to="`${route.fullPath}/${row.id}/edit`"
                >
                  <span>编辑</span>
                </RouterLink>
                <span
                  v-if="showModifyDelete(row)"
                  @click="deleteInfo(row.id)"
                >删除</span>
                <span
                  v-if="
                    showOperateTip && row.incidentStatus === 'SYS_IN_CONFIRM'
                  "
                  :class="$style.tableClickText"
                >
                  <span @click="confirm(row.id)">确认</span>
                  <span @click="goBack(row.id)">退回</span></span>
                <ElDropdown
                  v-if="
                    showCreateTask && row.incidentStatus === 'SYS_IN_HANDLE'
                  "
                  trigger="click"
                  @command="handleCommand"
                >
                  <span class="el-dropdown-link">
                    <span :class="$style.tableClick">创建处置任务</span>
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <ElDropdownMenu slot="dropdown">
                    <ElDropdownItem
                      v-for="(val, key) in TASK"
                      :key="key"
                      :command="{ incidentId: val, id: row.id }"
                    >
                      {{ val }}
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </ElDropdown>
              </div>
            </template>
          </ElTableColumn>
        </ITable>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-noCheck
import {
  getTotalSecurityIncident,
  getBlowSecurityIncident,
  getCommunicationSecurityIncident,
  confirm,
  goBack,
  exportUnitTable,
  exportProjectTable,
  deleteSecurityIncident,
  inHandle,
  toDetail,
  addGeneralOperaMaint2,
  addPenetrationTest2,
  tracetosource,
  threatToBan,
  bugFix,
} from '@/api/securityIncident/securityIncident'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { User } from '@/api/authServer/user'
import ITable, { ElTableColumn } from '@com/Table'
import ElDatePicker from 'element-ui/lib/date-picker'
import ElDropdown from 'element-ui/lib/dropdown'
import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
import ElDropdownItem from 'element-ui/lib/dropdown-item'
import { DATE_TIME } from '@/enums/format'
import { ROLES, STORAGE } from '@/enums'
import { TASK } from '@/enums/business'
import { save } from '@/utils/downloader'
import { local } from '@/utils/storage'

import { decode } from '@/functions/cipher'
import getCode from '@/enums/code'

const DEALSTATUS = getCode('1', 'SYS_EVENT_STATUS')
const DEALLEVEL = getCode('1', 'SYS_EVENT_LEVEL')
const INCIDENTTYPE = getCode('1', 'SYS_EVENT_TYPE')
const SECURITYSOURCE = getCode('1', 'SYS_EVENT_SOURCE')

const info = local.get(STORAGE.me, decode) as User
export default {
  props: { route: { type: Object, required: true } },
  components: {
    ITable,
    ElTableColumn,
    ElDatePicker,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
  },
  data() {
    return {
      showSearch: false,
      beginDateRange: [],
      reportDateRange: [],
      formInline: {
        incidentName: '',
        incidentStatus: '',
        beginTime: '',
        endTime: '',
        incidentHappenBeginDate: '',
        incidentHappenEndDate: '',
        createUser: '',
      },
      myIncident: false,
      organizations: [],
    }
  },
  computed: {
    DEALSTATUS: () => DEALSTATUS.value || [],
    DEALLEVEL: () => DEALLEVEL.value || [],
    INCIDENTTYPE: () => INCIDENTTYPE.value || [],
    DATE_TIME: () => DATE_TIME,
    TASK: () => TASK,
    SECURITYSOURCE: () => SECURITYSOURCE.value || [],
    getSecurityIncident() {
      let api = ''
      switch (true) {
        case this.authFit(ROLES.projectManager) ||
          this.authFit(ROLES.monitorAnlysis) ||
          this.authFit(ROLES.opertateMaintenance) ||
          this.authFit(ROLES.securityExperts):
          api = getTotalSecurityIncident
          break
        case this.authFit(ROLES.unitSO) || this.authFit(ROLES.groupLeaders):
          api = getBlowSecurityIncident
          break
        case this.authFit(ROLES.communicationLLY):
          api = getCommunicationSecurityIncident
          break
      }
      return api
    },
    exportTable() {
      let api = ''
      if (this.authFit(ROLES.projectManager)) {
        api = exportProjectTable
      } else if (this.authFit(ROLES.unitSO)) {
        api = exportUnitTable
      }
      return api
    },
    showCreateButton() {
      return (
        this.authFit(ROLES.unitSO) ||
        this.authFit(ROLES.monitorAnlysis) ||
        this.authFit(ROLES.opertateMaintenance) ||
        this.authFit(ROLES.communicationLLY)
      )
    },
    showOperateTip() {
      return this.authFit(ROLES.communicationLLY)
    },
    showModifyDelete() {
      return (row) => {
        // 运维管理员：监测分析员，通报联络员：只有待处理状态时，支持编辑删除;
        // 单位安全管理员：待确认和已退回支持 编辑和删除
        return (
          ((this.authFit(ROLES.communicationLLY) ||
            this.authFit(ROLES.opertateMaintenance) ||
            this.authFit(ROLES.monitorAnlysis)) &&
            row.incidentStatus === 'SYS_TO_HANDLE') ||
          (this.authFit(ROLES.unitSO) &&
            (row.incidentStatus === 'SYS_IN_CONFIRM' ||
              row.incidentStatus === 'SYS_GO_BACK'))
        )
      }
    },
    showCreateTask() {
      return this.authFit(ROLES.projectManager) || this.authFit(ROLES.communicationLLY)
    },
    showExport() {
      return this.authFit(ROLES.projectManager) || this.authFit(ROLES.unitSO)
    },
    showMyIncident() {
      return (
        this.authFit(ROLES.opertateMaintenance) ||
        this.authFit(ROLES.monitorAnlysis)
      )
    },
    head: () => [
      { prop: 'incidentName', label: '事件名称' },
      {
        prop: 'incidentTypeName',
        label: '事件类型',
      },
      {
        prop: 'incidentLevelName',
        label: '事件级别',
      },
      { prop: 'companyName', label: '事件所属单位' },
      { prop: 'createDate', label: '事件上报时间' },
      { prop: 'incidentHappenDate', label: '事件发生时间' },
      { prop: 'reportSourceName', label: '事件来源' },
      { prop: 'handler', label: '上报人' },
      {
        prop: 'incidentStatusName',
        label: '处置状态',
      },
    ],
  },
  watch: {
    DEALSTATUS(val) {
      if (
        val &&
        (this.authFit(ROLES.communicationLLY) ||
          this.authFit(ROLES.unitSO) ||
          this.authFit(ROLES.groupLeaders))
      ) {
        delete DEALSTATUS.value.SYS_CLOSE
      } else if (
        val &&
        (this.authFit(ROLES.opertateMaintenance) ||
          this.authFit(ROLES.projectManager) ||
          this.authFit(ROLES.monitorAnlysis))
      ) {
        delete DEALSTATUS.value.SYS_IN_CONFIRM
        delete DEALSTATUS.value.SYS_GO_BACK
        delete DEALSTATUS.value.SYS_CLOSE
      }
    },
    myIncident(newVal) {
      this.formInline.createUser = newVal ? info.id : ''
      ;(this.$refs.table as any).fetch()
    },
  },
  methods: {
    async getTotalSecurityIncident() {
      const res = await getTotalSecurityIncident.apply(null, arguments)
      const body = res.data.body
      res.data.body = body?.list
      return res
    },
    createIncident() {
      this.$router.push({
        path: `${this.route.fullPath}/new`,
      })
    },
    confirm(id) {
      this.$confirm('此操作不可逆, 确定此操作？', '操作确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        confirm(id).then((res) => {
          if (res.data.body) {
            this.$notify.success('确认成功')
            ;(this.$refs.table as any).fetch()
          }
        })
      })
    },
    goBack(id) {
      this.$confirm('此操作不可逆, 确定退回？', '退回确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        goBack(id).then((res) => {
          if (res.data.body) {
            this.$notify.success('退回成功')
            ;(this.$refs.table as any).fetch()
          }
        })
      })
    },
    handleCommand(command) {
      const taskApi = this.toFrameApi(command.incidentId)
      taskApi(command.id).then((res) => {
        if (res && res.data && res.data.body) {
          const processId = res.data.body
          toDetail(processId, command.incidentId, (msg) => {
            msg.data === 'close' && this.$refs.table.fetch()
          })
        }
      })
    },
    toFrameApi(task) {
      switch (task) {
        case this.TASK.generalOperaMain:
          return addGeneralOperaMaint2
        case this.TASK.penetrationTest:
          return addPenetrationTest2
        case this.TASK.tracetosource:
          return tracetosource
        case this.TASK.threatToBan:
          return threatToBan
        case this.TASK.bugFix:
          return bugFix
      }
    },
    exportList() {
      this.$notify.info('正在导出中，请稍后......')
      if (this.authFit(ROLES.projectManager) || this.authFit(ROLES.unitSO)) {
        this.exportTable(this.formInline).then((res) => {
          if (res) {
            // 要在此处判断一下是否取到值，ie浏览器在downloader的doemload方法中没有返回值
            res.name = decodeURIComponent(res.name)
            save(res)
          }
        })
      }
    },
    deleteInfo(id) {
      if (id) {
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          deleteSecurityIncident(id).then((res) => {
            if (res && res.data.status) {
              ;(this.$refs.table as any).fetch()
              this.$notify.success('删除成功')
            } else {
              this.$message.error('删除失败,请稍后再试')
            }
          })
        })
      }
    },
    startDeal(id) {
      inHandle(id).then((res) => {
        if (res && res.data.status) {
          ;(this.$refs.table as any).fetch()
          this.$notify.success('处置成功')
        } else {
          this.$message.error('处置失败,请稍后再试')
        }
      })
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
  },
  created() {
    this.fetchOrganization()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
@import '~element-ui/packages/theme-chalk/src/dropdown';
@import '~element-ui/packages/theme-chalk/src/dropdown-menu';
@import '~element-ui/packages/theme-chalk/src/dropdown-item';
</style>
<style lang="scss" module>
.container {
  padding: 20px;
  background: #fff;
}

.titleText {
  margin: $gapNormal;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.moreSearch {
  float: right;
  margin-right: 20px;
  color: #3273c4;
  cursor: pointer;
}

.table {
  margin: auto;
}

.button {
  margin: 20px;
}

.filterWrap {
  padding-top: 20px;
}

.tableWrap {
  padding: 10px;
}

.tableClick {
  width: 100%;
  color: #3273c4;
  cursor: pointer;

  span {
    margin-left: 4px;
  }
}

.dealTask {
  margin-left: 0;
}

// .look {
//   margin-right: 5px;
// }
</style>
