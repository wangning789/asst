<template>
  <div>
    <ElDialog
      :visible="visible"
      width="1000px"
      title="巡检记录"
      @close="closeRecord"
    >
      <ElRow :class="$style.recordWrap">
        <!-- 巡检记录详情 -->
        <ElCol
          :class="$style.recordInfo"
          :span="22"
        >
          <ElRow>
            <ElTooltip
              effect="dark"
              :content="record.assetName"
              placement="top"
            >
              <ElCol
                :class="$style.hoveName"
                :span="12"
              >
                <span>服务器名称：</span>
                <span :class="$style.hoveTitle">{{ record.assetName }}</span>
              </ElCol>
            </ElTooltip>
            <ElTooltip
              effect="dark"
              :content="record.networkTypeCodeName"
              placement="top"
            >
              <ElCol
                :class="$style.hoveName"
                :span="12"
              >
                <span>部署网络环境：</span>
                <span :class="$style.hoveTitle">{{ record.networkTypeCodeName }}</span>
              </ElCol>
            </ElTooltip>
          </ElRow>
          <ElRow>
            <ElTooltip
              effect="dark"
              :content="record.intranetAddress"
              placement="top"
            >
              <ElCol
                :span="12"
                :class="$style.hoveName"
              >
                <span>IP（内网）：</span>
                <span :class="$style.hoveTitle">{{ record.intranetAddress }}</span>
              </ElCol>
            </ElTooltip>
            <ElTooltip
              effect="dark"
              :content="record.internetAddress"
              placement="top"
            >
              <ElCol
                :class="$style.hoveName"
                :span="12"
              >
                <span>IP（外网）：</span>
                <span :class="$style.hoveTitle">{{ record.internetAddress }}</span>
              </ElCol>
            </ElTooltip>
          </ElRow>
          <ElRow>
            <ElTooltip
              effect="dark"
              :content="record.assetUnitName"
              placement="top"
            >
              <ElCol
                :class="$style.hoveName"
                :span="12"
              >
                <span>所属单位：</span>
                <span :class="$style.hoveTitle">{{ record.assetUnitName }}</span>
              </ElCol>
            </ElTooltip>
          </ElRow>
        </ElCol>
        <ElCol
          :class="$style.editStyle"
          :span="2"
        >
          <ElButton
            v-show="isEdit && authFit(ROLES.opertateMaintenance)"
            type="text"
            @click="edit"
          >
            编辑
          </ElButton>
        </ElCol>
        <ElCol :span="22">
          <ElForm
            ref="form"
            :inline="true"
            label-position="left"
            :model="record"
          >
            <ElRow :class="$style.formGroup">
              <ElCol :span="24">
                <ElFormItem
                  label="巡检结果："
                  prop="safetyInspectionResults"
                  :rules="{
                    required: true,
                    message: '请选择巡检结果',
                    trigger: 'change'
                  }"
                >
                  <ElRadioGroup
                    v-model="record.safetyInspectionResults"
                    :class="$style.radioGroup"
                    :disabled="isEdit || authFit(ROLES.projectManager)"
                  >
                    <ElRadio label="SYS_Inspection_results_2">
                      正常
                    </ElRadio>
                    <ElRadio label="SYS_Inspection_results_1">
                      存在异常
                    </ElRadio>
                  </ElRadioGroup>
                </ElFormItem>
              </ElCol>
              <ElCol :span="24">
                <ElFormItem label="巡检报告：">
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
                      v-show="
                        (record.safetyInspectionStatus ===
                          'SYS_WAIT_INSPECTION_3'
                          ? true
                          : false) && authFit(ROLES.opertateMaintenance)
                      "
                      size="small"
                      type="primary"
                    >
                      上传附件
                    </ElButton>
                    <span
                      v-for="(item, i) in record.safetyInspectionRecordFiles"
                      :key="i"
                      :class="$style.download"
                      @click="download(item, i)"
                    >{{ item.inspectionFileName }}
                    </span>
                  </ElUpload>
                </ElFormItem>
              </ElCol>
              <ElCol :span="24">
                <ElFormItem
                  label="备注信息："
                  prop="remarks"
                >
                  <ElInput
                    v-model="record.remarks"
                    style="width: 600px;"
                    type="textarea"
                    :disabled="isEdit || authFit(ROLES.projectManager)"
                    maxlength="200"
                    show-word-limit
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="24">
                <ElFormItem
                  label="巡检人员："
                  prop="inspectionUserName"
                  :rules="{
                    required: true,
                    message: '请输入巡检人员',
                  }"
                >
                  <ElInput
                    v-model="record.inspectionUserName"
                    disabled
                  />
                </ElFormItem>
                <ElFormItem
                  label="巡检时间："
                  prop="inspectionCompleteTime"
                  :rules="{
                    type: 'date',
                    required: true,
                    message: '请选择时间',
                    trigger: 'change'
                  }"
                >
                  <ElDatePicker
                    v-model="record.inspectionCompleteTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :format="DATE_TIME.serverDateTime"
                    :value-format="DATE_TIME.timestamp"
                    disabled
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
          </ElForm>
        </ElCol>

        <ElCol
          style="display: flex; justify-content: center;"
          :span="24"
        >
          <ElButton
            v-show="!isEdit && authFit(ROLES.opertateMaintenance)"
            type="primary"
            @click="updateRecord"
          >
            添加
          </ElButton>
          <ElButton
            v-show="!isEdit && authFit(ROLES.opertateMaintenance)"
            @click="$emit('update:visible', false)"
          >
            取消
          </ElButton>
        </ElCol>
      </ElRow>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { DATE_TIME } from '@/enums/format'
import { ROLES } from '@/enums'
import ElUpload from 'element-ui/lib/upload'
import { HEAD, upload, del, download } from '@/api/tools/file'
import { updateSafetyInspectionRecord } from '@/api/dailyInspection/dailyInspection'
import { FILETYPE } from './enums'

export default {
  props: {
    visible: { type: Boolean, default: Boolean },
    record: { type: Object, default: Object },
  },
  components: { ElUpload },
  data() {
    return {
      fileList: [],
      name: '',
      fileid: '',
      safetyInspectionRecordFiles: [],
      inspectionFileName: '',
      inspectionFileId: '',
      isEdit: true,
      uploadFlag: true,
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    HEAD: () => HEAD,
    FILETYPE: () => FILETYPE,
    ROLES: () => ROLES,
    upload,
  },
  watch: {
    'record.safetyInspectionStatus': {
      handler(val) {
        this.isEdit = val === 'SYS_WAIT_INSPECTION_2'
      },
      immediate: true,
    },
    'record.inspectionCompleteTime': {
      handler(val) {
        if ((val === null) && (this.record.safetyInspectionStatus === 'SYS_WAIT_INSPECTION_3')) {
          const day = new Date()
          this.record.inspectionCompleteTime = Date.parse(day)
        }
      },
      immediate: true,
    },
  },
  methods: {
    download(item) {
      const id = item
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = download(id.inspectionFileId)
      link.click()
      link = null
    },
    edit() {
      this.isEdit = false
    },
    // yymmdd转时间戳
    getTodayTimestamp() {
      const today = new Date()
      let month = today.getMonth() + 1
      month = month < 10 ? '0' + month : month
      const tdstr = today.getFullYear() + '/' + month + '/' + today.getDate()
      const date = new Date(Date.parse(tdstr))
      const tdtsp = Number(date)
      return tdtsp
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
      const obj = {
        inspectionFileName: file.name,
        inspectionFileId: response.body.fileId,
        safetyInspectionId: this.record.id,
      }
      this.safetyInspectionRecordFiles.push(obj)
      this.uploadFlag = true
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
          message: '文件大小需要小于50M',
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
                for (
                  let i = 0;
                  i < this.safetyInspectionRecordFiles.length;
                  i++
                ) {
                  if (
                    this.safetyInspectionRecordFiles[i].inspectionFileId ===
                    file.response.body.fileId
                  ) {
                    this.safetyInspectionRecordFiles.splice(i, 1)
                  }
                }
              }
            })
          })
        )
      }
    },
    closeRecord() {
      this.$emit('update:visible', false)
      this.isEdit =
        this.record.safetyInspectionStatus === 'SYS_WAIT_INSPECTION_2'
    },
    updateRecord() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (!valid) {
          return false
        }
        const updateObj = {
          id: this.record.id,
          inspectionCompleteTime: this.record.inspectionCompleteTime,
          remarks: this.record.remarks,
          inspectionUserId: this.record.inspectionUserId,
          safetyInspectionRecordFiles: this.safetyInspectionRecordFiles,
          safetyInspectionResults: this.record.safetyInspectionResults,
        }
        if (this.uploadFlag) {
          updateSafetyInspectionRecord(updateObj).then(() => {
            this.$notify.success('编辑成功')
            this.$refs.upload.clearFiles()
            this.closeRecord()
            this.$emit('success')
            this.safetyInspectionRecordFiles = []
          })
        } else {
          this.$notify.error('还没有上传完毕，请稍后提交')
        }
      })
    },
  },
}
</script>

<style lang="scss" module>
.editStyle {
  text-align: right;
}

.recordWrap {
  padding: 0 40px;
}

.recordInfo {
  line-height: 40px;
  border-bottom: 1px solid #e5e5e5;
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

.formGroup {
  margin-top: 20px;
}

.download {
  width: fit-content;
  color: #76b4f2;
  cursor: pointer;
}

.hoveTitle {
  display: inline-block;
  width: 280px;
  overflow: hidden; //隐藏
  line-height: 50px;
  white-space: nowrap; //文本不进行换行
  text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
  word-wrap: normal;    //保持默认处理
  word-break: keep-all;  //中英文不断词
}

.hoveName {
  display: flex;
  align-items: center;
}
</style>
