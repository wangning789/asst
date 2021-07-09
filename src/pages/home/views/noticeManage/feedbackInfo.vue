<template>
  <div class="el-card">
    <!-- 通知 -->
    <div :class="$style.contentBox">
      <ElRow>
        <ElCol :span="24">
          <!-- 标题 -->
          <h3>通报详情</h3>
        </ElCol>
        <ElCol :span="24">
          <ElRow
            type="flex"
            justify="space-between"
          >
            <ElCol :span="8">
              <span>通报类型：</span>
              <span>{{ CIRCULARTYPE }}</span>
            </ElCol>
            <ElCol
              :span="8"
              style="text-align: center;"
            >
              <span>创建时间：</span>
              <span>{{ infoList.createDate }}</span>
            </ElCol>
            <ElCol
              :span="8"
              style="text-align: right;"
            >
              <span>通报状态：</span>
              <span style="color: #e6a23c;">{{ CIRCULARSTATUS }}</span>
            </ElCol>
          </ElRow>
        </ElCol>
        <!-- 通知内容详情 -->
        <ElCol
          :class="$style.noticeInfoBox"
          :span="24"
        >
          <ElScrollbar style="height: 100%;">
            <div :class="$style.noticeInfo">
              <h3>{{ infoList.title }}</h3>
              <div v-html="infoList.content" />
            </div>
          </ElScrollbar>
        </ElCol>
      </ElRow>
      <!-- 漏洞通报反馈 -->
      <ElRow v-if="infoList.circularType === 'SYS_THREAT_VUL_CIRCULAR'">
        <ElCol :span="24">
          <ElRow :class="$style.feedbackTitle">
            <ElCol :span="12">
              <h3>通报反馈</h3>
            </ElCol>
            <ElCol
              :span="12"
              style="text-align: right;"
            >
              <ElButton
                v-show="checkDisplay"
                type="primary"
                @click="createWork"
              >
                创建通用运维任务
              </ElButton>
            </ElCol>
          </ElRow>
        </ElCol>
        <ElCol :span="24">
          <ElForm
            ref="form"
            label-position="right"
            label-width="220px"
            :model="feedbackList"
          >
            <ElRow>
              <ElCol :span="24">
                <ElFormItem
                  label="漏洞是否对本单位资产有影响："
                  prop="feedbackInfluence"
                  :rules="{
                    required: true,
                    message: '请选择是否有影响',
                    trigger: 'change',
                  }"
                >
                  <ElRadioGroup
                    v-model="feedbackList.feedbackInfluence"
                    :class="$style.radioGroup"
                  >
                    <ElRadio label="SYS_NO_INFLUENCE">
                      无影响
                    </ElRadio>
                    <ElRadio label="SYS_YES_INFLUENCE">
                      有影响
                    </ElRadio>
                  </ElRadioGroup>
                </ElFormItem>
              </ElCol>
              <div v-show="checkDisplay">
                <ElCol :span="24">
                  <ElFormItem
                    label="影响资产数量："
                    prop="feedbackAssetNum"
                  >
                    <span>{{ feedbackAssetCount }}</span>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="24">
                  <ElFormItem
                    label="影响资产详情："
                    :rules="{
                      required: true,
                      message: '请选择影响资产详情',
                    }"
                  >
                    <div
                      v-show="true"
                      :class="$style.region"
                    >
                      <div :class="$style.selectAssets">
                        <span>请选择影响资产详情的应用系统，服务器或安全产品</span>
                        <ElButton
                          type="primary"
                          @click="selectAssets"
                        >
                          选择{{
                            activeTab === 'business'
                              ? '应用系统'
                              : activeTab === 'host'
                                ? '服务器'
                                : '安全产品'
                          }}
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
                              :data="
                                form.business.slice(
                                  (currentPage1 - 1) * pageSize1,
                                  currentPage1 * pageSize1
                                )
                              "
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
                            <template>
                              <ElPagination
                                :current-page="currentPage1"
                                :page-sizes="[5, 10, 20, 50]"
                                :page-size="pageSize1"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="businessTotal"
                                @size-change="handleSizeChange1"
                                @current-change="handleCurrentChange1"
                              />
                            </template>
                          </div>
                        </ElTabPane>
                        <ElTabPane
                          label="服务器"
                          name="host"
                        >
                          <div :class="$style.tableWrap">
                            <ElTable
                              ref="table"
                              :data="
                                form.associateHost.slice(
                                  (currentPage2 - 1) * pageSize2,
                                  currentPage2 * pageSize2
                                )
                              "
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
                            <template>
                              <ElPagination
                                :current-page="currentPage2"
                                :page-sizes="[5, 10, 20, 50]"
                                :page-size="pageSize2"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="hostTotal"
                                @size-change="handleSizeChange2"
                                @current-change="handleCurrentChange2"
                              />
                            </template>
                          </div>
                        </ElTabPane>
                        <ElTabPane
                          label="安全产品"
                          name="securityProducts"
                        >
                          <div :class="$style.tableWrap">
                            <ElTable
                              ref="table"
                              :data="
                                form.security.slice(
                                  (currentPage3 - 1) * pageSize3,
                                  currentPage3 * pageSize3
                                )
                              "
                              border
                              :class="$style.table"
                            >
                              <ElTableColumn
                                v-for="(item, index) in securityHead"
                                :key="index"
                                :prop="item.prop"
                                :label="item.label"
                                :formatter="item.formatter"
                              />
                            </ElTable>
                            <template>
                              <ElPagination
                                :current-page="currentPage3"
                                :page-sizes="[5, 10, 20, 50]"
                                :page-size="pageSize3"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="securityTotal"
                                @size-change="handleSizeChange3"
                                @current-change="handleCurrentChange3"
                              />
                            </template>
                          </div>
                        </ElTabPane>
                      </ElTabs>
                      <span style="color: #f56c6c;">{{ assetsInfoTips }}</span>
                    </div>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="24">
                  <ElFormItem
                    label="文本记录:"
                    prop="feedbackContent"
                    :rules="{
                      required: true,
                      message: '请输入影响说明',
                    }"
                  >
                    <ElInput
                      v-model="feedbackList.feedbackContent"
                      type="textarea"
                      placeholder="请输入影响说明。"
                      rows="4"
                      maxlength="200"
                      show-word-limit
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="16">
                  <ElFormItem label="">
                    <ElUpload
                      ref="upload"
                      class="upload-demo"
                      :action="upload"
                      :headers="HEAD"
                      :file-list="fileList"
                      :limit="5"
                      :on-error="onError"
                      :on-success="onSuccess"
                      :show-file-list="true"
                      :auto-upload="false"
                      :on-change="onChange"
                      :before-upload="beforeUpload"
                      :before-remove="removeLogFile"
                    >
                      <ElButton
                        slot="trigger"
                        size="small"
                        type="primary"
                      >
                        上传附件
                      </ElButton>
                    </ElUpload>
                  </ElFormItem>
                </ElCol>
              </div>
              <ElCol
                :span="24"
                style="text-align: center;"
              >
                <ElButton
                  type="primary"
                  @click="saveData"
                >
                  提交
                </ElButton>
                <ElButton @click="backIndex">
                  取消
                </ElButton>
              </ElCol>
            </ElRow>
          </ElForm>
        </ElCol>
      </ElRow>
      <!-- IP通报反馈 -->
      <ElRow v-if="infoList.circularType === 'SYS_THREAT_IP_CIRCULAR'">
        <ElCol :span="24">
          <h3>通报反馈</h3>
        </ElCol>
        <ElCol :span="24">
          <ElForm
            ref="form"
            label-position="left"
            label-width="100px"
            :model="feedbackList"
          >
            <ElCol :span="24">
              <ElFormItem
                label="反馈详情:"
                prop="feedbackContent"
                :rules="{
                  required: true,
                  message: '请输入反馈详情',
                }"
              >
                <ElInput
                  v-model="feedbackList.feedbackContent"
                  type="textarea"
                  placeholder="请输入反馈详情。"
                  rows="4"
                  maxlength="200"
                  show-word-limit
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="16">
              <ElFormItem label="">
                <ElUpload
                  ref="upload"
                  class="upload-demo"
                  :action="upload"
                  :headers="HEAD"
                  :file-list="fileList"
                  :limit="5"
                  :on-error="onError"
                  :on-success="onSuccess"
                  :show-file-list="true"
                  :auto-upload="false"
                  :on-change="onChange"
                  :before-upload="beforeUpload"
                  :before-remove="removeLogFile"
                >
                  <ElButton
                    slot="trigger"
                    size="small"
                    type="primary"
                  >
                    上传附件
                  </ElButton>
                </ElUpload>
              </ElFormItem>
            </ElCol>
          </ElForm>
        </ElCol>
        <ElCol
          :span="24"
          style="text-align: center;"
        >
          <ElButton
            type="primary"
            @click="saveData"
          >
            提交
          </ElButton>
          <ElButton @click="backIndex">
            取消
          </ElButton>
        </ElCol>
      </ElRow>
    </div>

    <IDialog
      :visible.sync="visible"
      :active-tab="activeTab"
      :company="form.company"
      @success="success"
    />
  </div>
</template>

<script>
import {
  getCircularDetail,
  addGeneralOperaMaintBySafety,
  updateCircularFeedback,
  toDetail,
} from '@/api/noticeManage/loopholeInfo'
import ElUpload from 'element-ui/lib/upload'
import { HEAD, upload, del } from '@/api/tools/file'
import { FILETYPE } from './enums'
import IDialog from './selectAssets'

import { decode } from '@/functions/cipher'
import getCode from '@/enums/code'
// 码表
// 通报类型
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')
// 通报状态
const CIRCULARSTATUS = getCode('1', 'SYS_CIRCULAR_STATUS')

export default {
  components: { ElUpload, IDialog },
  data() {
    return {
      uploadFlag: true,
      assetsInfoTips: '',
      activeTab: 'business',
      fileList: [],
      infoList: {},
      id: this.$route.params.id,
      feedbackList: {
        feedbackAssetNum: 0,
        feedbackFile: '',
        feedbackFileName: '',
        circularUserAssetList: [],
        feedbackFileList: [],
        associateHostIds: '',
        businessIds: '',
        securityDeviceIds: '',
      },
      currentPage1: 1,
      pageSize1: 10,
      businessTotal: 0,
      currentPage2: 1,
      pageSize2: 10,
      hostTotal: 0,
      currentPage3: 1,
      pageSize3: 10,
      securityTotal: 0,
      dialogVisible: false,
      problemVisible: false,
      completeId: '',
      display: false,
      name: '',
      fileid: '',
      visible: false,
      form: {
        businessIds: '',
        associateHostIds: '',
        deviceSourceList: [],
        associateHost: [],
        company: '',
        security: [],
        business: [],
      },
      business: [],
      associateHost: [],
      createFlag: true,
    }
  },
  computed: {
    CIRCULARTYPE() {
      let newVal = ''
      for (const val in CIRCULARTYPE.value) {
        if (val === this.infoList.circularType) {
          newVal = CIRCULARTYPE.value[val]
        }
      }
      return newVal
    },
    CIRCULARSTATUS() {
      let newVal = ''
      for (const val in CIRCULARSTATUS.value) {
        if (val === this.infoList.circularStatus) {
          newVal = CIRCULARSTATUS.value[val]
        }
      }
      return newVal
    },
    checkAssetsInfo() {
      const { associateHost, security, business } = this.form
      return {
        associateHost,
        security,
        business,
      }
    },
    checkDisplay() {
      return this.feedbackList.feedbackInfluence !== 'SYS_NO_INFLUENCE'
    },
    feedbackAssetCount() {
      return (
        this.form.business.length +
        this.form.associateHost.length +
        this.form.security.length
      )
    },
    HEAD: () => HEAD,
    FILETYPE: () => FILETYPE,
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
    securityHead: () => [
      { prop: 'ciName', label: '安全产品名称' },
      { prop: 'ciType', label: '安全产品类型' },
      { prop: 'deployEnvir', label: '部署网络环境' },
      { prop: 'internetIp', label: 'IP（互联网）' },
      { prop: 'intranetIp', label: 'IP（内网）' },
      { prop: 'belongCompanyId', label: '所属单位' },
    ],
  },
  watch: {
    checkAssetsInfo(val) {
      if (val) {
        this.assetsInfoTips = ''
      }
    },
  },
  methods: {
    handleSizeChange1(val) {
      this.pageSize1 = val
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
    },
    handleSizeChange2(val) {
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    handleSizeChange3(val) {
      this.pageSize3 = val
    },
    handleCurrentChange3(val) {
      this.currentPage3 = val
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
        this.feedbackList.businessIds =
          (businessIds.length && businessIds.join(',')) || ''
        this.businessTotal = this.form.business.length
      } else if (activeTab === 'host') {
        this.form.associateHost = data.hostArr || []
        const hostIds =
          (this.form.associateHost.length &&
            this.form.associateHost.map((item) => {
              return item.id
            })) ||
          []
        this.feedbackList.associateHostIds =
          (hostIds.length && hostIds.join(',')) || ''
        this.hostTotal = this.form.associateHost.length
      } else if (activeTab === 'securityProducts') {
        this.form.security = data.securityArr || []
        const securityIds =
          (this.form.security.length &&
            this.form.security.map((item) => {
              return item.id
            })) ||
          []
        this.feedbackList.securityDeviceIds =
          (securityIds.length && securityIds.join(',')) || ''
        this.securityTotal = this.form.security.length
      }

      this.visible = false
    },
    selectAssets() {
      this.visible = true
    },
    removeLogFile(file) {
      const name = file.name
      this.fileName = name

      const size = file.size
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      if (!size || !typeOk || size > FILETYPE.fileSize) {
        return true
      } else {
        return (
          file.status === 'success' &&
          this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
          }).then(() => {
            del(file.response.body.fileId).then((res) => {
              if (res && res.data && res.data.status) {
                this.name = this.name.replace(file.name + ',', '')
                this.fileid = this.fileid.replace(
                  file.response.body.fileId + ',',
                  ''
                )
              }
            })
          })
        )
      }
    },
    // 取消编辑
    backIndex() {
      const fileIdList = this.fileid.slice(0, this.fileid.length - 1).split(',')
      // 取消时清楚已上传文件
      if (fileIdList[0] !== '') {
        for (let i = 0; i < fileIdList.length; i++) {
          del(fileIdList[i])
        }
      }
      this.$router.push('/noticeManage')
    },
    saveData() {
      this.$refs.form.validate((valid) => {
        if (
          !(
            this.feedbackList.businessIds ||
            this.feedbackList.associateHostIds ||
            this.feedbackList.securityDeviceIds
          ) &&
          this.feedbackList.feedbackInfluence === 'SYS_YES_INFLUENCE'
        ) {
          this.assetsInfoTips = '请选择影响资产详情'
          return false
        } else if (this.uploadFlag) {
          this.feedbackList.feedbackAssetNum = this.feedbackAssetCount
          if (this.feedbackList.taskIds) {
            this.feedbackList.taskIds = this.feedbackList.taskIds.slice(4)
          }
          if (
            this.feedbackList.feedbackInfluence === 'SYS_YES_INFLUENCE' &&
            !valid
          ) {
            return false
          }
          if (this.feedbackList.feedbackInfluence === 'SYS_NO_INFLUENCE') {
            this.saveInfo()
            this.$notify.success('提交成功')
            this.$router.push('/noticeManage')
          } else if (
            this.feedbackList.feedbackInfluence === 'SYS_YES_INFLUENCE'
          ) {
            this.saveInfo()
            this.$notify.success('提交成功')
            this.$router.push('/noticeManage')
          } else if (
            this.infoList.circularType === 'SYS_THREAT_IP_CIRCULAR' &&
            !(this.feedbackList.feedbackContent === null)
          ) {
            this.saveInfo()
            this.$notify.success('提交成功')
            this.$router.push('/noticeManage')
          }
        }
      })
    },
    beforeUpload(file) {
      this.uploadFlag = false
      const name = file.name
      this.fileName = name

      const size = file.size
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      if (!typeOk) {
        this.$message({
          message: `请上传${FILETYPE.fileType}等类型的文件`,
          type: 'error',
        })
        return false
      }
      if (size > FILETYPE.fileSize) {
        this.$message({
          message: '文件大小需要小于10M',
          type: 'error',
        })
        return false
      }
      if (size <= 0) {
        this.$message({
          message: '文件内容不能为空',
          type: 'error',
        })
        return false
      }
      return true
    },
    saveInfo() {
      this.feedbackList.feedbackFileName = this.name
      this.feedbackList.feedbackFile = this.fileid
      const data = this.feedbackList
      updateCircularFeedback(data)
    },
    addIpInfo() {
      const obj = {
        assetName: '',
        assetIp: '',
        assetDescribe: '',
      }
      this.feedbackList.circularUserAssetList.push(obj)
    },
    delIpInfo(obj) {
      const index = obj.$index
      this.feedbackList.circularUserAssetList.splice(index, 1)
    },
    jumpPage(processId) {
      toDetail(processId, '详情', (msg) => {
        msg.data === 'close' && this.$refs.table.fetch()
      })
    },
    createWork() {
      if (!this.createFlag) {
        this.$message({
          message: '运维任务还没有创建完毕，请稍后再试',
          type: 'warning',
        })
        return false
      }
      addGeneralOperaMaintBySafety().then((res) => {
        this.feedbackList.taskIds =
          this.feedbackList.taskIds + (res.data.body + ',')
        this.jumpPage(res.data.body)
      })
      this.createFlag = false
      setTimeout(() => {
        this.createFlag = true
      }, 2000)
    },
    onChange() {
      this.$refs.upload.submit()
    },
    onError() {
      this.$message({
        message: '上传失败',
        type: 'error',
      })
    },
    onSuccess(response, file) {
      this.name = this.name + (file.name + ',')
      this.fileid = this.fileid + (response.body.fileId + ',')
      this.uploadFlag = true
    },
    sub() {
      if (this.feedbackList.feedbackAssetNum > 0) {
        this.feedbackList.feedbackAssetNum--
      }
    },
    add() {
      if (this.feedbackList.feedbackAssetNum < 100) {
        this.feedbackList.feedbackAssetNum++
      }
    },
    changeInput(val) {
      if (val > 100) {
        this.feedbackList.feedbackAssetNum = 0
      }
    },
  },
  created() {
    getCircularDetail({ circularId: this.id }).then((res) => {
      this.infoList = res.data.body
      this.infoList.content = decode(this.infoList.content)
      this.feedbackList = res.data.body.circularUserRelList[0]
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang="scss" module>
.selectAssets {
  display: flex;
  justify-content: space-between;
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

.region {
  margin-bottom: 20px;
  margin-left: 0 auto;
  padding-top: $gapNormal;
}

.el-card {
  padding: 0 30px;
}

.noticeInfoBox {
  height: 400px;
  margin: 30px 0;
  background-color: #f2f4f8;

  :global(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

.noticeInfo {
  padding: 30px;
  line-height: 30px;

  div {
    padding: 20px 0;
  }

  h3 {
    text-align: center;
  }
}

.feedbackTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .feedbackTitle_right {
    text-align: right;
  }
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.tableWrap {
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

.radioGroup {
  :global(.el-radio__input.is-checked + .el-radio__label) {
    color: #d5402b !important;
  }

  :global(.el-radio__input.is-checked .el-radio__inner) {
    background: #d5402b !important;
    border-color: #d5402b !important;
  }
}

.ipStyle {
  margin: 20px 0 !important;
}

.inputNum {
  > input {
    text-align: center;
  }
}
</style>
