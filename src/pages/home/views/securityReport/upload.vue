
<template>
  <div

    class="el-card"
  >
    <!-- v-loading="isSaving" -->
    <ElForm
      ref="form"
      label-position="right"
      :model="form"
      :class="$style.wrapper"
      :label-width="CONFIG.labelWidth"
    >
      <ElFormItem
        label="报表类型："
        prop="reportType"
        :rules="{
          required: true,
          message: '请选择报表类型',
          trigger: 'change'
        }"
      >
        <ElSelect
          v-model="form.reportType"
          placeholder="请选择"
          clearable
        >
          <ElOption
            v-for="item in noticeLevels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="报表名称："
        prop="reportName"
        :rules="{
          required: true,
          message: '请输入名称',
          trigger: 'change'
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
        label="所属用户："
        prop="reportUserId"
        :rules="{
          required: true,
          message: '请选择所属用户',
          trigger: 'change'
        }"
      >
        <ElSelect
          v-model="form.reportUserId"
          placeholder="请选择"
          clearable
        >
          <ElOption
            v-for="item in customerList"
            :key="item.id"
            :label="item.contacts"
            :value="item.userId"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="附件："
        prop="file"
        :rules="{
          required: true,
          message: '请选择附件',
          trigger: 'change'
        }"
      >
        <ElUpload
          ref="upload"
          :action="upload"
          :headers="HEAD"
          :limit="1"
          :on-file-change="fileChanged"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="true"
          :auto-upload="false"
          :on-remove="removeFile"
          :before-upload="beforeUpload"
        >
          <ElButton
            slot="trigger"
            size="small"
          >
            选取文件
          </ElButton>
        </ElUpload>
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
// import ElDatePicker from 'element-ui/lib/date-picker'
import { HEAD, upload } from '@/api/tools/file'
import ElUpload from 'element-ui/lib/upload'

import { saveSecurityReport, getUserList } from '@/api/securityReport/securityReport'
import enhanceUpload from '@/libs/enhancers/upload'
import conf from '@home/config'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  components: { ElUpload: enhanceUpload(ElUpload) },
  data() {
    return {
      customerList: [],
      isSaving: false,
      form: {
        reportUserId: '',
        reportName: '',
        reportType: '',
        reportFileId: '',
        file: null,
      },
      fileName: null,
    }
  },
  computed: {
    HEAD: () => HEAD,
    upload,
    noticeLevels: () => [
      {
        label: '年报表',
        value: '1',
      },
      {
        label: '月报表',
        value: '2',
      },
      {
        label: '周报表',
        value: '3',
      },
      {
        label: '日报表',
        value: '4',
      },
      {
        label: '其他',
        value: '0',
      },
    ],
  },
  methods: {
    cancelUpload() {
      this.up(true)
    },
    removeFile() {
      this.form.file = null
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
      const sizeOk = size <= conf.fileSize
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.upload.submit()
          this.isSaving = true
        }
      })
    },
    fileChanged(event: any) {
      const file = event.target.files[0]
      this.form.file = file
      this.$refs.form.validate()
    },
    onSuccess(res: any) {
      const param = Object.assign(this.form)
      param.reportFileId = res.body.fileId
      this.isSaving = false
      saveSecurityReport(param)
        .then(res => {
          if (res.data.status) {
            this.$message({
              message: '上传成功',
              type: 'success',
            })
            this.up(true)
          }
        })
    },
    onError(err: Error) {
      this.isSaving = false
      this.$message.error('上传失败，请稍后再试')
      this.form.file = null
      throw err
    },
  },
  created() {
    getUserList().then(res => {
      this.customerList = res.data.body
    })
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
</style>
