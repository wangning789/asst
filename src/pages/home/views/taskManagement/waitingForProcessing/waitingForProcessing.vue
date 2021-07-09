<!-- 描述 -->
<template>
  <div>
    <Transition
      name="fold"
      mode="out-in"
    >
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
            <ElFormItem label="创建时间：">
              <ElDatePicker
                v-model="date"
                clearable
                type="datetimerange"
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
            <ElFormItem label="状态：">
              <ElSelect
                v-model="filterForm.taskStatus"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in STATETWO"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
          </div>
        </ElForm>
      </div>
    </Transition>
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
            v-if="authFit(ROLES.projectManager)
              ||authFit(ROLES.communicationLLY)"
            command="0"
          >
            渗透测试任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="authFit(ROLES.projectManager)||
              authFit(ROLES.communicationLLY)"
            command="1"
          >
            溯源任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="
              authFit(ROLES.projectManager) ||
                authFit(ROLES.securityExperts) ||
                authFit(ROLES.opertateMaintenance)||
                authFit(ROLES.communicationLLY)
            "
            command="2"
          >
            漏洞修复任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="
              authFit(ROLES.projectManager) ||
                authFit(ROLES.monitorAnlysis)||
                authFit(ROLES.communicationLLY)"
            command="3"
          >
            IP封禁任务
          </ElDropdownItem>
          <ElDropdownItem
            v-if="
              authFit(ROLES.projectManager) ||
                authFit(ROLES.monitorAnlysis)||
                authFit(ROLES.communicationLLY)"
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
      :get="activeName === '0' && queryHost"
      :query="filterForm"
    >
      <ElTableColumn
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <span @click="jumpPage(row.processId, 'view')">查看</span>
            <span
              v-if="row.taskStatus === 'pending'"
              @click="clickDelete(row)"
            >删除</span>
          </div>
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { ROLES } from '@/enums'
import { STATETWO } from '@/enums/business'
import getCode from '@/enums/code'
import { DATE_TIME } from '@/enums/format'
import ITable, { ElTableColumn } from '@com/Table'
import {
  listAll,
  toDetail,
  addGeneralOperaMaint1,
  deleteEvent,
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
      date: ['', ''],
      showSearch: false,
      filterForm: {
        createUserName: '',
        taskTypeName: '',
        fillCompanyId: '',
        belongCompanyId: '',
        keyword: '',
        beginTime: '',
        endTime: '',
      },
    }
  },
  computed: {
    ROLES: () => ROLES,
    TASKLEVEL: () => TASKLEVEL.value || [],
    STATETWO: () => STATETWO,
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
          for (const key in STATETWO) {
            if (key === row.taskStatus) {
              return STATETWO[key]
            }
          }
        },
      },
    ],
    queryHost() {
      return listAll
    },
  },

  methods: {
    clickDelete(row) {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        deleteEvent(row.id).then((res) => {
          if (res && res.data.status) {
            ;(this.$refs.table as any).fetch()
            this.$notify.success('删除成功')
            this.$emit('cliDelite')
          } else {
            this.$notify.error('删除失败,请稍后再试')
          }
        })
      })
    },
    async listAll() {
      const res = await listAll.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },

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
