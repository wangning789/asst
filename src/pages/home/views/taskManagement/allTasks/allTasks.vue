<!-- 描述 -->
<template>
  <div>
    <!-- <Transition
      name="fold"
      mode="out-in"
    > -->
    <div :class="$style.max">
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

        <ElFormItem label="输入查询：">
          <ElInput
            v-model="filterForm.keyword"
            clearable
            placeholder="请输入任务名称/编号"
          />
        </ElFormItem>
        <ElFormItem label="任务类型：">
          <ElSelect
            v-model="filterForm.taskTypeCode"
            placeholder="请选择"
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

        <div v-show="showSearch">
          <ElFormItem label="创建人:">
            <ElInput
              v-model="filterForm.createUserName"
              clearable
              placeholder="请输入创建人"
            />
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
          <ElFormItem label="状态：">
            <ElSelect
              v-model="filterForm.taskStatus"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in STATESGREE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
        </div>
      </ElForm>
    </div>
    <!-- </Transition> -->
    <div style="margin-bottom: 15px;">
      <ElDropdown
        trigger="click"
        @command="handleCommand"
      >
        <ElButton type="primary">
          新建任务<i class="el-icon-arrow-down el-icon--right" />
        </ElButton>
        <ElDropdownMenu slot="dropdown">
          <ElDropdownItem
            v-if="authFit(ROLES.projectManager)"
            command="0"
          >
            渗透测试任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="authFit(ROLES.projectManager)"
            command="1"
          >
            溯源任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="
              authFit(ROLES.projectManager) ||
                authFit(ROLES.securityExperts) ||
                authFit(ROLES.opertateMaintenance)
            "
            command="2"
          >
            漏洞修复任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="
              authFit(ROLES.projectManager) || authFit(ROLES.monitorAnlysis)
            "
            command="3"
          >
            IP封禁任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="
              authFit(ROLES.projectManager) || authFit(ROLES.monitorAnlysis)
            "
            command="4"
          >
            威胁情报通报任务
          </ElDropdownItem>
          <ElDropdownItem command="5">
            通用运维任务
          </ElDropdownItem>
        </ElDropdownMenu>
      </ElDropdown>
    </div>
    <ITable
      ref="table"
      v-loading="isLoadingTable"
      style="width: 94vw;"
      :head="head"
      :get="activeName === '2' && queryHost"
      :query="filterForm"
    >
      <ElTableColumn
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <span @click="jumpPage(row.processId, 'view')">查看</span>
          </div>
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { ROLES } from '@/enums'
import { STATESGREE } from '@/enums/business'
import getCode from '@/enums/code'
import { DATE_TIME } from '@/enums/format'
import ITable, { ElTableColumn } from '@com/Table'
import {
  allTasks,
  depSecManager,
  projectManager,
  toDetail,
  addGeneralOperaMaint1,
} from '@/api/taskManagement/taskManagement'
const IPTYPE = getCode('1', 'TASK')
const TASKLEVEL = getCode('1', 'WORKORDER_LEVEL')
export default {
  props: {
    route: { type: Object, required: true },
    activeName: { type: String, default: '0' },
  },
  components: {
    ITable,
    ElTableColumn,
  },
  data() {
    return {
      visible: false,
      isLoadingTable: false,
      showSearch: false,
      filterForm: {
        fillCompanyId: '',
        belongCompanyId: '',
        keyword: '',
        networkTypeCode: '',
        depositLocationCode: '',
        beginTime: '',
        endTime: '',
      },
      date: ['', ''],
    }
  },
  computed: {
    ROLES: () => ROLES,
    TASKLEVEL: () => TASKLEVEL.value || [],
    STATESGREE: () => STATESGREE,
    IPTYPE: () => IPTYPE.value || [],
    DATE_TIME: () => DATE_TIME,
    head: () => [
      { prop: 'taskNo', label: '任务编号' },
      { prop: 'taskTypeName', label: '任务类型' },
      { prop: 'taskTitle', label: '任务名称' },
      {
        label: '任务级别',
        formatter: (row) => {
          for (const key in TASKLEVEL.value) {
            if (key === row.taskLevel) {
              return TASKLEVEL.value[key]
            }
          }
        },
      },
      { prop: 'createDate', label: '创建时间' },
      { prop: 'createUserName', label: '创建人' },
      {
        label: '状态',
        formatter: (row) => {
          for (const key in STATESGREE) {
            if (key === row.taskStatus) {
              return STATESGREE[key]
            }
          }
        },
      },
    ],
    queryHost() {
      switch (true) {
        case this.authFit(ROLES.unitSO):
          return depSecManager
        case this.authFit(ROLES.projectManager):
          return projectManager
        default:
          return allTasks
      }
    },
  },

  methods: {
    handleCommand(command) {
      let password = ''
      command = this.authFit(ROLES.unitSO) ? '6' : command
      addGeneralOperaMaint1(command).then((res) => {
        password = res.data.body
        this.jumpPage(password)
      })
    },

    jumpPage(processId, type) {
      toDetail(processId, '详情', (msg) => {
        if (!type && (msg.data === 'close' || msg.data === 'hide')) {
          this.$refs.table.fetch()
          this.$emit('cliDelite')
        }
      })
    },

    async allTasks() {
      const res = await allTasks.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    async projectManager() {
      const res = await projectManager.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    async depSecManager() {
      const res = await depSecManager.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
<style lang="scss" module>
.max {
  width: 100vw;
}

.moreSearch {
  position: absolute;
  right: 100px;
  display: flex;
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
