<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>查看安全事件详情</h3>
    </div>
    <div :class="$style.topButton">
      <!--仅仅事件状态为处理中的时候展示创建处置任务按钮   -->
      <ElDropdown
        v-if="showCreateTask && form.incidentStatus === 'SYS_IN_HANDLE'"
        trigger="click"
        :class="$style.rightButton"
        @command="handleCommand"
      >
        <ElButton type="primary">
          创建处置任务<i class="el-icon-arrow-down el-icon--right" />
        </ElButton>
        <ElDropdownMenu slot="dropdown">
          <ElDropdownItem
            v-for="(val, key) in TASK"
            :key="key"
            :command="{ incidentId: val, id: form.id }"
          >
            {{ val }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </ElDropdown>

      <!-- 仅仅事件状态为待处理的时候展示开始处置按钮 -->
      <ElButton
        v-if="showCreateTask && form.incidentStatus === 'SYS_TO_HANDLE'"
        type="primary"
        :class="$style.rightButton"
        @click="startDeal(form.id)"
      >
        开始处置
      </ElButton>
      <!-- 仅仅只有项目经理和事件状态为处理中的情况下才有处置完成 -->
      <ElButton
        v-if="
          authFit(ROLES.projectManager) &&
            form.incidentStatus === 'SYS_IN_HANDLE'
        "
        type="primary"
        :class="$style.rightButton"
        @click="endDeal(form.id)"
      >
        处置完成
      </ElButton>
      <!-- 仅仅事件状态为待确认的时候展示确认,退回按钮 -->
      <ElButton
        v-if="showOperateTip && form.incidentStatus === 'SYS_IN_CONFIRM'"
        type="primary"
        :class="$style.rightButton"
        @click="confirm(form.id)"
      >
        确认
      </ElButton>
      <ElButton
        v-if="showOperateTip && form.incidentStatus === 'SYS_IN_CONFIRM'"
        type="primary"
        :class="$style.rightButton"
        @click="goBack(form.id)"
      >
        退回
      </ElButton>
    </div>
    <div :class="$style.contentBox">
      <ElForm
        label-width="140px"
        label-position="right"
        :class="$style.wrapper"
      >
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件基础信息</span>
          </div>
          <ElRow :gutter="GAP">
            <ElCol :span="8">
              <ElFormItem
                label="安全事件名称："
                prop="incidentName"
              >
                {{ form.incidentName }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="事件状态："
                prop="incidentStatusName"
              >
                {{ form.incidentStatusName }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="事件类型："
                prop="incidentTypeName"
              >
                {{ form.incidentTypeName }}
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow :gutter="GAP">
            <ElCol :span="8">
              <ElFormItem
                label="事件级别："
                prop="incidentLevel"
              >
                {{ form.incidentLevelName }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="事件来源：">
                {{ form.reportSourceName }}
              </ElFormItem>
            </ElCol>
          </ElRow>
          <!-- 仅仅事件来源为运维监测发现展示来源设备 -->
          <ElRow
            v-if="form.reportSource === 'SYS_REPORT_BY_OP'"
            :gutter="GAP"
          >
            <ElCol :span="16">
              <ElFormItem label="来源设备：">
                <div :class="$style.tableWrap">
                  <ElTable
                    :data="form.deviceSourceList"
                    border
                    :class="$style.table"
                    max-height="400"
                  >
                    <ElTableColumn
                      prop="deviceName"
                      label="设备名称"
                      width="220px"
                    />
                    <ElTableColumn
                      prop="alarmId"
                      label="相关告警ID"
                    />
                  </ElTable>
                </div>
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElFormItem
            label="事件描述："
            prop="incidentDescribe"
          >
            {{ form.incidentDescribe }}
          </ElFormItem>
          <ElFormItem
            label="相关日志："
            prop="relatedLog"
          >
            {{ form.relatedLog }}
            <p
              :class="$style.tableClick"
              @click="downloadLog()"
            >
              {{ form.appendixName }}
            </p>
          </ElFormItem>
          <!-- 仅仅事件来源为成员单位上报展示已采取的措施 -->
          <ElFormItem
            v-if="form.reportSource === 'SYS_REPORT_BY_MEMBER_UNIT'"
            label="已采取的处置措施："
            prop="handleRecord"
          >
            {{ form.handleRecord }}
            <p
              :class="$style.tableClick"
              @click="downloadRecord()"
            >
              {{ form.handleRecordName }}
            </p>
          </ElFormItem>

          <ElFormItem
            label="备注："
            prop="remark"
          >
            {{ form.remark }}
          </ElFormItem>
          <ElRow>
            <ElCol :span="8">
              <ElFormItem
                label="事件发生时间："
                prop="incidentHappenDate"
              >
                {{
                  (form.incidentHappenDate &&
                    format(form.incidentHappenDate)) ||
                    ''
                }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="事件所属单位："
                prop="company"
              >
                {{ form.companyName }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="上报人："
                prop="handler"
              >
                {{ form.handler }}
              </ElFormItem>
            </ElCol>
          </ElRow>

          <ElRow>
            <ElCol :span="8">
              <ElFormItem
                label="事件上报时间："
                prop="createDate"
              >
                {{ (form.createDate && format(form.createDate)) || '' }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="处置完成时间："
                prop="incidentHandleDate"
              >
                {{
                  (form.incidentHandleDate &&
                    format(form.incidentHandleDate)) ||
                    ''
                }}
              </ElFormItem>
            </ElCol>
          </ElRow>
        </div>
        <div
          v-show="form.company || form.companyName"
          :class="$style.region"
        >
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>关联资产信息</span>
          </div>
          <ElTabs v-model="activeTab">
            <ElTabPane
              label="应用系统"
              name="business"
            >
              <div :class="$style.tableWrap">
                <ElTable
                  ref="table"
                  :data="businessList"
                  border
                  :class="$style.table"
                  max-height="400"
                >
                  <ElTableColumn
                    v-for="(item, index) in businessHead"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                  />
                </ElTable>
              </div>
            </ElTabPane>
            <ElTabPane
              label="服务器"
              name="host"
            >
              <div :class="$style.tableWrap">
                <ElTable
                  ref="table"
                  :data="hostList"
                  border
                  :class="$style.table"
                  max-height="400"
                >
                  <ElTableColumn
                    v-for="(item, index) in hostHead"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :formatter="item.formatter"
                  />
                </ElTable>
              </div>
            </ElTabPane>
          </ElTabs>
        </div>
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>事件处置情况</span>
          </div>
          <div :class="$style.tableWrap">
            <ElTable
              ref="table"
              :data="workTaskList"
              border
              :class="$style.table"
              max-height="400"
            >
              <ElTableColumn
                prop="taskNo"
                label="任务编号"
              >
                <template #default="{ row }">
                  <span
                    :class="$style.tableClick"
                    @click="toTaskDetail(row.processId)"
                  >{{ row.taskNo }}</span>
                </template>
              </ElTableColumn>

              <ElTableColumn
                v-for="(item, index) in dealInfoHead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
              />
            </ElTable>
          </div>
        </div>
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>事件相关报告</span>
          </div>
          <!-- 仅仅在处理中状态支持此附件上传   -->
          <ElRow
            v-if="showCreateTask && form.incidentStatus === 'SYS_IN_HANDLE'"
          >
            <ElCol :span="12">
              <ElUpload
                ref="upload"
                :action="upload"
                :headers="HEAD"
                :on-change="fileChanged"
                :on-error="onError"
                :on-success="onSuccess"
                :show-file-list="true"
                :file-list="fileList"
                :on-exceed="handleExceed"
                :limit="1"
                :before-upload="beforeUpload"
                :before-remove="removeFile"
              >
                <ElButton
                  size="small"
                  type="primary"
                >
                  上传附件
                </ElButton>
              </ElUpload>
            </ElCol>
          </ElRow>
          <div v-else>
            <div
              v-if="form.relatedReportsName"
              :class="$style.tableClick"
              @click="downloadAnnex()"
            >
              {{ form.relatedReportsName }}
            </div>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import {
  getSecurityIncident,
  toDetail,
  addGeneralOperaMaint2,
  addPenetrationTest2,
  tracetosource,
  threatToBan,
  bugFix,
  inHandle,
  handle,
  updateSecurityIncident,
  confirm,
  goBack,
  getTaskList,
} from '@/api/securityIncident/securityIncident'
import { TASK, STATE } from '@/enums/business'
import { FILETYPE } from '../enums'
import { ElTableColumn } from '@com/Table'
import ElDropdown from 'element-ui/lib/dropdown'
import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
import ElDropdownItem from 'element-ui/lib/dropdown-item'
import ElUpload from 'element-ui/lib/upload'
import LAYOUT from '@/scss/export/layout.scss'
import { DateTime } from '@/enums/format'
import { HEAD, download, upload, del } from '@/api/tools/file'
import { ROLES } from '@/enums'

import { save } from '@/utils/downloader'
export default {
  props: {
    route: { type: Object, required: true },
  },
  components: {
    ElTableColumn,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElUpload,
  },
  data() {
    return {
      form: {},
      fileList: [],
      workTaskList: [],
      appendixFileId: '',
      hostList: [],
      businessList: [],
      activeTab: 'business',
      finished: '',
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    TASK: () => TASK,
    DateTime: () => DateTime,
    HEAD: () => HEAD,
    FILETYPE: () => FILETYPE,
    STATE: () => STATE,
    ROLES: () => ROLES,
    upload,
    businessHead: () => [
      { prop: 'ciName', label: '系统名称' },
      { prop: 'networkStr', label: '系统部署环境' },
      { prop: 'internetAddress', label: '互联网访问地址' },
      { prop: 'intranetAddress', label: '内网访问地址' },
      { prop: 'belongCompanyStr', label: '所属单位' },
    ],
    hostHead: () => [
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
    dealInfoHead: () => [
      { prop: 'taskTypeName', label: '任务类型' },
      { prop: 'taskTitle', label: '任务标题' },
      { prop: 'createDate', label: '创建时间' },
      { prop: 'handler', label: '当前处理人' },
      { prop: 'taskLevelName', label: '任务级别' },
      {
        prop: 'taskStatus',
        label: '状态',
        formatter: (row) => {
          return STATE[row.taskStatus] || ''
        },
      },
      {
        prop: 'modifyDate',
        label: '任务完成时间',
        formatter: (row) => {
          return row.taskStatus === 'finished' ? row.modifyDate : ''
        },
      },
    ],
    showCreateTask() {
      return this.authFit(ROLES.projectManager) || this.authFit(ROLES.communicationLLY)
    },
    showOperateTip() {
      return this.authFit(ROLES.communicationLLY)
    },
  },
  methods: {
    getIncidentInfo() {
      const id = this.route.params.id || ''
      if (id) {
        getSecurityIncident(id).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
            this.fileList = this.form.relatedReports
              ? [{ name: this.form.relatedReportsName }]
              : []
            const id = this.form.id || ''
            getTaskList(id).then((res) => {
              if (res && res.data && res.data.body) {
                const finishList =
                  (res.data.body.length &&
                    res.data.body.filter((item) => {
                      return item.taskStatus === 'finished' || item.taskStatus === 'processing'
                    })) || []
                this.workTaskList = finishList
              }
            })
            this.businessList = this.form.business
            this.hostList = this.form.associateHost
          }
        })
      }
    },
    startDeal(id) {
      inHandle(id).then((res) => {
        if (res && res.data.status) {
          this.$notify.success('处置成功')
          this.getIncidentInfo()
        } else {
          this.$message.error('处置失败,请稍后再试')
        }
      })
    },
    endDeal(id) {
      const workTaskList = this.workTaskList
      const finishList =
        (workTaskList.length &&
          workTaskList.filter((item) => {
            return item.taskStatus === 'finished'
          })) ||
        []
      if (finishList.length < workTaskList.length) {
        this.$message.warning(
          '该事件仍有任务未完成，请在相关任务全部完成后再操作。'
        )
      } else {
        this.$confirm('确定该事件已处置完成？', '处置完成确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          handle(id).then((res) => {
            if (res && res.data.status) {
              this.$notify.success('处置完成')
              this.getIncidentInfo()
            } else {
              this.$message.error('处置失败,请稍后再试')
            }
          })
        })
      }
    },
    handleCommand(command) {
      const taskApi = this.toFrameApi(command.incidentId)
      taskApi(command.id).then((res) => {
        if (res && res.data && res.data.body) {
          const processId = res.data.body
          toDetail(processId, command.incidentId, (msg) => {
            if (msg.data === 'close' || msg.data === 'hide') {
              this.getIncidentInfo()
            }
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
    format(date) {
      if (date.indexOf('.0') === date.length - 2) {
        date = date.split('.0')[0]
      }
      return date
    },
    downloadLog() {
      const src = download(this.form.appendixIds)
      const fileInfo = {
        name: this.form.appendixName || '',
        src,
      }
      save(fileInfo)
    },
    downloadRecord() {
      const src = download(this.form.handleRecordIds)
      const fileInfo = {
        name: this.form.handleRecordName || '',
        src,
      }
      save(fileInfo)
    },

    downloadAnnex() {
      const src = download(this.form.relatedReports)
      const fileInfo = {
        name: this.form.relatedReportsName || '',
        src,
      }
      save(fileInfo)
    },
    handleExceed() {
      this.$message.warning('只能上传一个文件')
    },
    beforeUpload(file) {
      const name = file.name
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      let uploadFlag = true
      if (!typeOk) {
        this.$message({
          message: `请上传${FILETYPE.fileType}等类型的文件`,
          type: 'error',
        })
        uploadFlag = false
      }
      const size = file.size
      if (size > FILETYPE.fileSize) {
        this.$message({
          message: '文件大小需要小于100M',
          type: 'error',
        })
        uploadFlag = false
      } else if (!(size > 0)) {
        this.$message({
          message: '文件内容不能为空',
          type: 'error',
        })
        uploadFlag = false
      }
      if (!uploadFlag) {
        this.fileList = []
      }
      return uploadFlag
    },
    fileChanged(file, fileList) {
      this.fileList = fileList.slice(-1)
      this.form.relatedReportsName = file.name
    },
    onError(err: Error) {
      let errorMessage = '导入失败，请稍后再试'
      if (err && err.msg) {
        errorMessage = err.msg
      }
      this.$message.error(errorMessage)
    },
    onSuccess(res) {
      if (res && res.status && res.body) {
        const params = {
          relatedReports: res.body.fileId || '',
          id: this.form.id || '',
          relatedReportsName: this.form.relatedReportsName,
        }
        updateSecurityIncident(params).then((res) => {
          if (res.data.status === true) {
            this.$notify.success('上传成功')
            this.form.relatedReports = params.relatedReports
            this.form.relatedReportsName = params.relatedReportsName
          } else {
            this.$message.error(res.data.msg || '上传失败，请稍后再试')
          }
        })
      }
    },
    removeFile() {
      return (
        this.form.relatedReports &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          // 1.删除文件服务器的数据
          del(this.form.relatedReports).then((res) => {
            if (res && res.data && res.data.status) {
              // 2.清掉安全事件的记录
              updateSecurityIncident({
                id: this.form.id,
                relatedReports: 'deleted',
              }).then((res) => {
                if (res.status) {
                  this.$notify.success('成功删除附件')
                  this.form.relatedReports = ''
                  this.form.relatedReportsName = ''
                } else {
                  this.$message.error('删除失败，请稍后再试')
                }
              })
            } else {
              this.$message.error('删除失败，请稍后再试')
            }
          })
        })
      )
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
            this.getIncidentInfo()
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
            this.getIncidentInfo()
          }
        })
      })
    },
    toTaskDetail(processId) {
      toDetail(processId, '任务详情', (msg) => {
        msg.data === 'close' && this.getIncidentInfo()
      })
    },
  },
  created() {
    this.getIncidentInfo()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang="scss" module>
.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.topButton {
  display: flex;
  justify-content: flex-end;

  .rightButton {
    margin-right: 10px;
  }
}

.subTitle {
  height: $gapNormal;
  margin: 20px 0;
  font-weight: bold;
  font-size: $medium;
  line-height: $gapNormal;

  .subTitleFlag {
    display: inline-block;
    width: 4px;
    height: 12px;
    margin-right: 10px;
    background-color: #f8902a;
  }
}

.tableWrap {
  display: flex;

  .button {
    height: 40px;
    margin-left: 10px;
  }
}

.tableWrap :global(.el-table__header) {
  tr,
  th {
    padding: 0;
    background: $colorTheme9;
  }
}

.tableClick {
  margin-left: 10px;
  color: #3273c4;
  cursor: pointer;
}
</style>
