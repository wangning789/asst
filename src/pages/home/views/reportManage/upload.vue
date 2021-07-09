
<template>
  <div class="el-card">
    <!-- v-loading="isSaving" -->
    <ElForm
      ref="form"
      v-loading="isSaving"
      label-position="right"
      :model="form"
      :class="$style.wrapper"
      :label-width="CONFIG.labelWidth"
    >
      <ElFormItem
        label="报告类型："
        prop="reportType"
        :rules="{
          required: true,
          message: '请选择报告类型',
          trigger: 'change',
        }"
      >
        <ElSelect
          v-model="form.reportType"
          placeholder="请选择"
          clearable
          @change="changeTypeValue()"
        >
          <ElOption
            v-for="(val, key) in REPORTTYPE"
            :key="key"
            :label="val"
            :value="key"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="报告来源："
        prop="reportSource"
        :rules="{
          required: true,
          message: '请选择报告来源',
          trigger: 'change',
        }"
      >
        <ElSelect
          v-model="form.reportSource"
          placeholder="请选择"
          clearable
          @change="changeSourceValue()"
        >
          <ElOption
            v-for="(val, key) in REPORTSOURCE"
            :key="key"
            :label="val"
            :value="key"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="报告名称："
        prop="reportName"
        :rules="{
          required: true,
          message: '请输入名称',
          trigger: 'change',
        }"
      >
        <ElInput
          v-model="form.reportName"
          show-word-limit
          placeholder="请填写名称"
          :maxlength="CONFIG.maxLength / 3"
          :class="$style.wide"
        />
      </ElFormItem>
      <ElFormItem
        label="所属单位："
        prop="reportUserId"
        :rules="{
          required: true,
          message: '请选择所属单位',
          trigger: 'change',
        }"
      >
        <ElSelect
          v-model="form.reportUserId"
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
        label="附件："
        prop="file"
        :rules="{
          required: !showFile,
          message: '请选择附件',
          trigger: 'change',
        }"
      >
        <ElUpload
          ref="upload"
          :action="upload"
          :headers="HEAD"
          :on-change="fileChanged"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="true"
          :auto-upload="false"
          :on-remove="removeFile"
          :file-list="fileList"
          :before-upload="beforeUpload"
        >
          <ElButton
            slot="trigger"
            size="small"
          >
            {{ state === 'edit' ? '重新选取文件' : '选取文件' }}
          </ElButton>
        </ElUpload>
        <span
          v-show="showFile"
          :class="$style.tableClick"
          @click="downloadFile()"
        >{{ form.reportFileName }}</span>
      </ElFormItem>
    </ElForm>
    <div :class="$style.center">
      <ElButton
        type="primary"
        @click="fileUpload"
      >
        上传
      </ElButton>
      <ElButton @click="cancelUpload">
        取消
      </ElButton>
    </div>
  </div>
</template>

<script lang='ts'>
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { HEAD, upload, download } from '@/api/tools/file'
import ElUpload from 'element-ui/lib/upload'

import { getSecurityReportById, saveSecurityReport } from '@/api/reportManage'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { save } from '@/utils/downloader'
import conf from '@home/config'
import getCode from '@/enums/code'
const REPORTSOURCE = getCode('1', 'SYS_reportSource')
const REPORTTYPE = getCode('1', 'SecurityReportType')
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: { type: Object, required: true },
  },
  components: { ElUpload },
  data() {
    return {
      state: '',
      isSaving: false,
      form: {
        reportUserId: '',
        reportName: '',
        reportType: '',
        reportFileName: '',
        file: null,
      },
      fileName: null,
      organizations: [],
      fileList: [],
      showFile: false,
    }
  },
  computed: {
    HEAD: () => HEAD,
    REPORTSOURCE: () => REPORTSOURCE.value || [],
    REPORTTYPE: () => REPORTTYPE.value || [],
    upload,
  },
  methods: {
    changeTypeValue() {
      this.form.reportTypeName = this.REPORTTYPE[this.form.reportType]
    },
    changeSourceValue() {
      this.form.reportSourceName = this.REPORTSOURCE[this.form.reportSource]
    },
    cancelUpload() {
      this.jump({ path: '/reportManage', append: true })
    },
    removeFile() {
      this.form.file = null
      this.form.reportFileName = ''
    },
    beforeUpload(file: any) {
      const name = file.name
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = conf.fileType.indexOf(type) !== -1
      if (!typeOk) {
        this.isSaving = false
        this.$message({
          message: `请上传${conf.fileType}等类型文件`,
          type: 'error',
        })
        return false
      }
      const size = file.size
      const sizeOk = !(size > conf.fileSize || size < 0)
      if (!sizeOk) {
        this.isSaving = false
        this.$message({
          message: '需小于50M',
          type: 'error',
        })
        return false
      }
      return true
    },
    fileUpload() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.showFile) {
            this.$refs.upload.submit()
          } else {
            const param = Object.assign(this.form)
            this.saveReport(param)
          }
        }
      })
    },
    fileChanged(file, fileList) {
      this.showFile = false
      this.fileList = fileList.slice(-1)
      if (file) {
        this.form.file = file
        this.form.reportFileName = file.name || ''
        this.$refs.form.validate()
      }
    },
    onSuccess(res: any) {
      const param = Object.assign(this.form)
      param.reportFileId = res.body.fileId
      param.reportFileName = this.form.reportFileName
      this.saveReport(param)
    },
    saveReport(param) {
      this.isSaving = true
      saveSecurityReport(param).then((res) => {
        this.isSaving = false
        if (res.data.status) {
          this.$message({
            message: '上传成功',
            type: 'success',
          })
          this.jump({ path: '/reportManage', append: true })
        }
      })
    },
    onError(err: Error) {
      this.isSaving = false
      let errMessage = '上传失败，请稍后再试'
      const errInfo = err.message ? JSON.parse(err.message) : {}
      if (errInfo.msg) {
        errMessage = errInfo.msg
      }
      this.$message.error(errMessage)
      this.form.file = null
      this.form.reportFileName = ''
      throw err
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
    downloadFile() {
      const file = {
        name: this.form.reportName,
        src: download(this.form.reportFileId),
      }
      save(file)
    },
  },
  created() {
    this.state = this.$route.query.state || ''
    const id = this.$route.query.id || ''
    if (this.state === 'edit') {
      this.showFile = true
      id &&
        getSecurityReportById(id).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
          }
        })
    }
    this.fetchOrganization()
  },
}
</script>

<style lang='scss'>
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang='scss' module>
.wrapper {
  width: $widthPage;
  margin: 0 auto;
}

.wide {
  width: $widthPage - $gapNormal * 2 - 125px !important;
}

.center {
  text-align: center;
}

.tableClick {
  margin-left: 10px;
  color: #3273c4;
  cursor: pointer;
}
</style>
