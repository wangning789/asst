<template>
  <div>
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        v-loading="isLoadingForm"
        label-position="right"
        inline
        :model="form"
        label-width="140px"
      >
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件基础信息</span>
          </div>
          <ElFormItem
            label="安全事件名称"
            prop="incidentName"
            :rules="{
              required: true,
              message: '请输入安全事件名称',
            }"
          >
            <ElInput
              v-model="form.incidentName"
              placeholder="请输入安全事件名称"
              :maxlength="500"
            />
          </ElFormItem>
          <ElFormItem
            label="事件类型："
            prop="incidentType"
            :rules="{
              required: true,
              message: '请输入事件类型',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.incidentType"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in SECURITYTYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="事件级别："
            prop="incidentLevel"
            :rules="{
              required: true,
              message: '请输入事件级别',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.incidentLevel"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in SECURITYLEVEL"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="事件来源："
            prop="reportSource"
            :rules="{
              required: true,
              message: '请添加事件来源',
            }"
          >
            <ElSelect
              v-model="form.reportSource"
              :disabled="disabled"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in SECURITYSOURCE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            v-if="form.reportSource === 'SYS_REPORT_BY_OP'"
            label="来源设备："
          >
            <div :class="$style.tableWrap">
              <ElTable
                :data="form.deviceSourceList"
                border
                :class="$style.table"
              >
                <ElTableColumn
                  prop="name"
                  width="220px"
                >
                  <template #header>
                    <span>设备名称</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="
                        'deviceSourceList[' + scope.$index + '].deviceName'
                      "
                    >
                      <ElInput
                        v-model="scope.row.deviceName"
                        placeholder="请填写设备名称"
                        style="width: 200px;"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="tel"
                  width="298px"
                >
                  <template #header>
                    <span>相关告警ID</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'deviceSourceList[' + scope.$index + '].alarmId'"
                    >
                      <ElInput
                        v-model="scope.row.alarmId"
                        placeholder="告警ID，如果多个用','分隔"
                        style="width: 240px;"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  width="100"
                >
                  <template #default="scope">
                    <ElButton
                      class="el-icon-delete"
                      title="删除"
                      @click="delSourceInfo(scope)"
                    />
                  </template>
                </ElTableColumn>
              </ElTable>
              <ElButton
                :class="$style.button"
                :disabled="display"
                @click="addSource"
              >
                添加
              </ElButton>
            </div>
          </ElFormItem>
          <ElRow>
            <ElFormItem
              label="事件描述："
              prop="incidentDescribe"
            >
              <ElInput
                v-model.lazy="form.incidentDescribe"
                show-word-limit
                type="textarea"
                :maxlength="500"
                :rows="3"
                placeholder="请输入服务简介"
                style="width: 615px;"
              />
            </ElFormItem>
          </ElRow>
          <ElRow>
            <ElFormItem
              label="相关日志："
              prop="relatedLog"
            >
              <ElInput
                v-model="form.relatedLog"
                show-word-limit
                type="textarea"
                :maxlength="500"
                :rows="3"
                placeholder="请输入相关日志"
                style="width: 615px;"
              />
              <ElRow>
                <ElCol :span="24">
                  <ElUpload
                    ref="upload"
                    :action="upload"
                    :headers="HEAD"
                    :on-change="logFileChanged"
                    :on-error="onError"
                    :on-success="onLogFileSuccess"
                    :show-file-list="true"
                    :file-list="logFileList"
                    :on-exceed="handleExceed"
                    :limit="1"
                    :before-upload="beforeLogUpload"
                    :before-remove="removeLogFile"
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
            </ElFormItem>
          </ElRow>
          <ElRow>
            <ElFormItem
              label="事件发生时间："
              prop="incidentHappenDate"
              :rules="checkTime"
            >
              <ElDatePicker
                v-model="form.incidentHappenDate"
                clearable
                type="datetime"
                placeholder="请选择"
                :format="DATE_TIME.dateTime"
                :value-format="DATE_TIME.serverDateTime"
              />
            </ElFormItem>
            <ElFormItem
              label="上报人："
              prop="handler"
            >
              <ElInput
                v-model="form.handler"
                placeholder="请输入上报人"
              />
            </ElFormItem>
            <!-- <ElFormItem
              label="事件上报时间："
              prop="incidentReportDate"
            >
              <ElDatePicker
                v-model="form.incidentReportDate"
                clearable
                type="datetime"
                placeholder="请选择"
                :format="DATE_TIME.dateTime"
                :value-format="DATE_TIME.serverDateTime"
              />
            </ElFormItem> -->
            <ElFormItem
              label="事件所属单位："
              prop="company"
              :rules="{
                required: true,
                message: '事件所属单位',
              }"
            >
              <ElSelect
                v-model="form.company"
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
          </ElRow>

          <ElRow v-if="form.reportSource === 'SYS_REPORT_BY_MEMBER_UNIT'">
            <ElFormItem
              label="已采取的处置措施："
              prop="handleRecord"
            >
              <ElInput
                v-model="form.handleRecord"
                show-word-limit
                type="textarea"
                :maxlength="500"
                placeholder="请输入已采取的处置措施"
                style="width: 615px;"
              />
              <ElRow>
                <ElCol :span="24">
                  <ElUpload
                    ref="upload"
                    :action="upload"
                    :headers="HEAD"
                    :on-change="dealFileChanged"
                    :on-error="onError"
                    :on-success="onDealFileSuccess"
                    :show-file-list="true"
                    :file-list="dealFileList"
                    :on-exceed="handleExceed"
                    :limit="1"
                    :before-upload="beforeDealUpload"
                    :before-remove="removeDealFile"
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
            </ElFormItem>
          </ElRow>

          <ElRow>
            <ElFormItem
              label="备注："
              prop="remark"
            >
              <ElInput
                v-model="form.remark"
                show-word-limit
                type="textarea"
                :maxlength="500"
                :rows="3"
                placeholder="请输入备注"
                style="width: 615px;"
              />
            </ElFormItem>
          </ElRow>
        </div>

        <div
          v-show="form.company"
          :class="$style.region"
        >
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>关联资产信息</span>
          </div>
          <div :class="$style.selectAssets">
            <span>请选择安全事件关联的应用系统或服务器</span>
            <ElButton
              type="primary"
              @click="selectAssets"
            >
              选择{{ activeTab === 'business'?'应用系统':'服务器' }}
            </ElButton>
          </div>
          <ElTabs v-model="activeTab">
            <ElTabPane
              label="应用系统"
              name="business"
            >
              <div :class="$style.tableWrap">
                <ElTable
                  ref="table"
                  :data="form.business"
                  border
                  :class="$style.table"
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
                  :data="form.associateHost"
                  border
                  :class="$style.table"
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
        <div :class="$style.saveButton">
          <ElButton
            type="primary"
            @click="save"
          >
            上报
          </ElButton>
          <ElButton @click="cancel">
            取消
          </ElButton>
        </div>
      </ElForm>
    </div>

    <IDialog
      :visible.sync="visible"
      :active-tab="activeTab"
      :company="form.company"
      @success="success"
    />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import ElDatePicker from 'element-ui/lib/date-picker'
import ElUpload from 'element-ui/lib/upload'
import IDialog from './selectAssets'
import {
  getOrganizationInfo,
  getOrganizationListById, // 获取安全员的事件所属单位
} from '@/api/systemManage/organization'
import { upload, HEAD, del } from '@/api/tools/file'
import { ROLES, STORAGE } from '@/enums'
import { DEALSTATUS, DEALLEVEL, FILETYPE } from '../../enums'
import { DATE_TIME } from '@/enums/format'
import {
  addDwSecurityIncident, // 单位安全管理员新建接口
  addYWSecurityIncident, // 安全运维和监测分析员,通报联络员新建接口
  updateSecurityIncident,
} from '@/api/securityIncident/securityIncident'
// import { emit } from '@/utils/eventBus'
import getCode from '@/enums/code'

import { local } from '@/utils/storage'

import { decode } from '@/functions/cipher'
const SECURITYTYPE = getCode('1', 'SYS_EVENT_TYPE')
const SECURITYLEVEL = getCode('1', 'SYS_EVENT_LEVEL')
const SECURITYSOURCE = getCode('1', 'SYS_EVENT_SOURCE')
const info = local.get(STORAGE.me, decode) as User
function update(data) {
  return {
    ...data,
  }
}

export default {
  props: {
    // route: { type: Object, required: true },
    be: { type: String, required: true },
    formData: { type: Object, required: true },
  },
  components: { ElDatePicker, IDialog, ElUpload },
  data() {
    return {
      activeTab: 'business',
      disabled: this.authFit(ROLES.unitSO),
      unitSO: this.authFit(ROLES.unitSO),
      departmentPower:
        this.authFit(ROLES.monitorAnlysis) ||
        this.authFit(ROLES.opertateMaintenance),
      form: {
        reportSource: '',
        businessIds: '',
        associateHostIds: '',
        deviceSourceList: [],
        associateHost: [],
        appendixIds: '',
        handleRecordIds: '',
        company: '',
        handler: '',
        incidentHappenDate: '',
      },
      visible: false,
      organizations: [],
      // associateHost: [],
      business: [],
      display: false,
      isLoadingForm: false,
      logFileList: [],
      dealFileList: [],
    }
  },
  computed: {
    DEALSTATUS: () => DEALSTATUS,
    DEALLEVEL: () => DEALLEVEL,
    DATE_TIME: () => DATE_TIME,
    HEAD: () => HEAD,
    ROLES: () => ROLES,
    info: () => info,
    SECURITYTYPE: () => SECURITYTYPE.value || [],
    SECURITYLEVEL: () => SECURITYLEVEL.value || [],
    SECURITYSOURCE: () => SECURITYSOURCE.value || [],
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
    addSecurityIncident() {
      let api = ''
      if (this.authFit(ROLES.unitSO)) {
        // 单位安全管理员新建接口
        api = addDwSecurityIncident
      } else if (
        this.authFit(ROLES.opertateMaintenance) ||
        this.authFit(ROLES.monitorAnlysis) ||
        this.authFit(ROLES.communicationLLY)
      ) {
        // 安全运维和监测分析员,通报联络员新建接口
        api = addYWSecurityIncident
      }
      return api
    },
    checkTime() {
      return {
        required: !!this.form.incidentHappenDate,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            value = this.form.incidentHappenDate
            const startAt = new Date(value) * 1000 / 1000
            if (startAt > Date.now()) {
              return callback(new Error('事件发生时间需早于当前时间'))
            } else {
              return callback()
            }
          } else {
            return callback()
          }
        },
      }
    },
  },
  watch: {
    formData(newVal) {
      if (newVal) {
        this.form = update(this.formData)
        if (this.form.appendixName) {
          this.logFileList = [{ name: this.form.appendixName }]
        }
        if (this.form.handleRecordName) {
          this.dealFileList = [{ name: this.form.handleRecordName }]
        }
      }
    },
    SECURITYSOURCE(val) {
      if (val && this.authFit(ROLES.unitSO)) {
        this.form.reportSource = 'SYS_REPORT_BY_MEMBER_UNIT'
      } else if (val && this.authFit(ROLES.communicationLLY)) {
        delete SECURITYSOURCE.value.SYS_REPORT_BY_OP
      }
    },
  },
  methods: {
    selectAssets() {
      this.visible = true
    },
    success(data, activeTab) {
      if (activeTab === 'business') {
        this.form.business = data.businessArr || []
        const businessIds =
          (this.form.business.length &&
            this.form.business.map((item) => {
              return item.id
            })) ||
          []
        this.form.businessIds =
          (businessIds.length && businessIds.join(',')) || ''
      } else if (activeTab === 'host') {
        this.form.associateHost = data.hostArr || []
        const hostIds =
          (this.form.associateHost.length &&
            this.form.associateHost.map((item) => {
              return item.id
            })) ||
          []
        this.form.associateHostIds = (hostIds.length && hostIds.join(',')) || ''
      }

      this.visible = false
    },
    async fetchOrganization() {
      // 单位安全管理员 事业单位查看本级和下级
      if (this.authFit(ROLES.unitSO)) {
        this.organizations = Object.freeze(
          (await getOrganizationListById({ organizationId: this.form.company }))
            .data.body || []
        )
      } else {
        this.organizations = Object.freeze(
          (await getOrganizationInfo()).data.body || []
        )
      }
    },
    addSource() {
      const obj = {
        deviceName: '',
        alarmId: '',
      }
      this.form.deviceSourceList.push(obj)
    },
    delSourceInfo(obj) {
      const index = obj.$index
      this.form.deviceSourceList.splice(index, 1)
    },
    save(this: any) {
      let companyName = ''
      this.organizations.map((item) => {
        if (item.id === this.form.company) {
          companyName = item.organizationName
        }
      })
      const data = { ...this.form, companyName: companyName }

      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          this.isLoadingForm = true
          ;(this.be === 'new'
            ? this.addSecurityIncident
            : updateSecurityIncident)(data)
            .then((res) => {
              if (res.data && res.data.status === true) {
                this.$notify.success('操作成功')
                this.cancel()
              } else {
                this.$message.error(res.data.msg || '保存失败,请稍后再试')
              }
            })
            .finally(() => {
              this.isLoadingForm = false
            })
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/securityIncident' })
    },
    beforeLogUpload(file) {
      const name = file.name
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      if (!typeOk) {
        this.$message({
          message: `请上传${FILETYPE.fileType}等类型的文件`,
          type: 'error',
        })
        this.form.appendixIds = ''
        this.form.appendixName = ''
        this.logFileList = []
        return false
      }
      const size = file.size
      if (size > FILETYPE.fileSize) {
        this.$message({
          message: '文件大小需要小于100M',
          type: 'error',
        })
        this.form.appendixIds = ''
        this.form.appendixName = ''
        this.logFileList = []
        return false
      } else if (!(size > 0)) {
        this.$message({
          message: '文件内容不能为空',
          type: 'error',
        })
        this.form.appendixIds = ''
        this.form.appendixName = ''
        this.logFileList = []
        return false
      }
      return true
    },
    beforeDealUpload(file) {
      const name = file.name
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      if (!typeOk) {
        this.$message({
          message: `请上传${FILETYPE.fileType}等类型的文件`,
          type: 'error',
        })
        this.form.handleRecordIds = ''
        this.form.handleRecordName = ''
        this.dealFileList = []
        return false
      }
      const size = file.size
      if (size > FILETYPE.fileSize) {
        this.$message({
          message: '文件大小需要小于100M',
          type: 'error',
        })
        this.form.handleRecordIds = ''
        this.form.handleRecordName = ''
        this.dealFileList = []
        return false
      } else if (!(size > 0)) {
        this.$message({
          message: '文件内容不能为空',
          type: 'error',
        })
        this.form.handleRecordIds = ''
        this.form.handleRecordName = ''
        this.dealFileList = []
        return false
      }
      return true
    },
    logFileChanged(file, fileList) {
      this.logFileList = fileList.slice(-1)
      this.form.appendixName = file.name
    },
    dealFileChanged(file, fileList) {
      this.dealFileList = fileList.slice(-1)
      this.form.handleRecordName = file.name
    },
    onError(err: Error) {
      let errMessage = '上传失败，请稍后再试'
      const errInfo = err.message ? JSON.parse(err.message) : {}
      if (errInfo.msg) {
        errMessage = errInfo.msg
      }
      this.$message.error(errMessage)
    },
    onLogFileSuccess(res) {
      if (res && res.status && res.body) {
        this.form.appendixIds = res.body.fileId || ''
      }
    },
    onDealFileSuccess(res) {
      if (res && res.status && res.body) {
        this.form.handleRecordIds = res.body.fileId || ''
      }
    },
    handleExceed() {
      this.$message.warning('只能上传一个文件')
    },
    removeLogFile() {
      return (this.form.appendixIds &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          // 1.删除文件服务器的数据
          del(this.form.appendixIds).then((res) => {
            if (res && res.data && res.data.status) {
              // 2.清掉安全事件的记录
              updateSecurityIncident({
                id: this.form.id,
                appendixIds: '',
                appendixName: '',
              }).then((res) => {
                if (res.status) {
                  this.$notify.success('成功删除附件')
                  this.form.appendixIds = ''
                  this.form.appendixName = ''
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
    removeDealFile() {
      return (this.form.handleRecordIds &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          // 1.删除文件服务器的数据
          del(this.form.handleRecordIds).then((res) => {
            if (res && res.data && res.data.status) {
              // 2.清掉安全事件的记录
              updateSecurityIncident({
                id: this.form.id,
                handleRecordIds: '',
                handleRecordName: '',
              }).then((res) => {
                if (res.status) {
                  this.$notify.success('成功删除附件')
                  this.form.handleRecordIds = ''
                  this.form.handleRecordName = ''
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
  },
  created() {
    this.form.handler = this.info.aliasName
    const day = new Date()
    const y = day.getFullYear()
    const M = day.getMonth() + 1 // 月份
    const d = day.getDate() // 日
    const h = day.getHours() // 小时
    const m = day.getMinutes() // 分
    const s = day.getSeconds() // 秒
    const newDay = `${y}-${M}-${d} ${h}:${m}:${s}`
    this.form.incidentHappenDate = newDay

    if (this.unitSO) {
      this.form.reportSource = 'SYS_REPORT_BY_MEMBER_UNIT'
      this.form.company = info.departmentId
      this.form.handler = info.aliasName
    } else if (this.departmentPower) {
      this.form.reportSource = 'SYS_REPORT_BY_OP'
      this.disabled = this.departmentPower
    } else if (this.authFit(ROLES.communicationLLY)) {
      delete SECURITYSOURCE.value.SYS_REPORT_BY_OP
    }
    this.fetchOrganization()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang="scss" module>
.container {
  padding: 0 30px;
}

.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.selectAssets {
  display: flex;
  justify-content: space-between;
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

.region {
  margin-bottom: 20px;
  margin-left: 0 auto;
  padding-top: $gapNormal;
}

.subTitle {
  height: $gapNormal;
  margin-bottom: 20px;
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

.saveButton {
  display: flex;
  justify-content: center;
  margin-bottom: $gapNormal;
}

.tableClick {
  color: #3273c4;
  cursor: pointer;
}
</style>
