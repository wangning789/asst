<template>
  <div>
    <ElDialog
      :visible="visible"
      width="600px"
      :title="showFail ? '导入失败' : '批量导入'"
      center
      @close="close"
    >
      <!-- 批量导入资产弹窗 -->
      <ElForm
        v-show="!showFail"
        ref="form"
        label-position="right"
        :model="form"
        :class="$style.wrapper"
        :label-width="CONFIG.labelWidth"
      >
        <ElFormItem
          label="选择上传文件： "
          prop="file"
          :rules="{
            required: true,
            message: '请选择文件',
            trigger: 'blur',
          }"
        >
          <ElRow>
            <ElCol :span="12">
              <ElUpload
                ref="upload"
                :action="importHosts"
                :headers="HEAD"
                :on-change="fileChanged"
                :on-error="onError"
                :on-success="onSuccess"
                :show-file-list="true"
                :auto-upload="false"
                :on-remove="removeFile"
                :file-list="fileList"
                :before-upload="beforeUpload"
              >
                <ElButton
                  size="small"
                  type="primary"
                >
                  点击上传
                </ElButton>
              </ElUpload>
            </ElCol>
            <ElCol :span="12">
              <span
                :class="$style.doloadText"
                @click="dowload"
              >下载模板</span>
            </ElCol>
          </ElRow>
        </ElFormItem>
      </ElForm>

      <span
        v-show="!showFail"
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          type="primary"
          @click="importFile"
        >导入</ElButton>
      </span>
      <FailInfo
        v-if="showFail"
        :fail-list="failList"
      />
    </ElDialog>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { HEAD } from '@/api/tools/file'
import { importHosts, downloadTemp } from '@/api/assetsManage/host'
import { save } from '@/utils/downloader'
import ElUpload from 'element-ui/lib/upload'
import FailInfo from './importFailInfo'
import { FILETYPE } from '../enums'
export default {
  props: {
    visible: { type: Boolean },
  },
  components: { ElUpload, FailInfo },
  data() {
    return {
      form: {
        file: null,
      },
      fileList: [],
      showFail: false,
      failList: [],
    }
  },
  computed: {
    HEAD: () => HEAD,
    FILETYPE: () => FILETYPE,
    importHosts,
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.showFail = false
      }
    },
  },

  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    removeFile() {
      this.form.file = null
    },
    fileChanged(file, fileList) {
      this.fileList = fileList.slice(-1)
      if (file) {
        this.form.file = file
        this.$refs.form.validate()
      }
    },
    beforeUpload(file) {
      const name = file.name
      this.fileName = name
      const type = name.substr(name.lastIndexOf('.') + 1)
      const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      if (!typeOk) {
        this.isSaving = false
        this.$message({
          message: `请上传${FILETYPE.fileType}等类型文件`,
          type: 'error',
        })
        return false
      }
      const size = file.size
      const sizeOk = size <= FILETYPE.fileSize
      if (!sizeOk) {
        this.isSaving = false
        this.$message({
          message: '文件大小需要小于50M',
          type: 'error',
        })
        return false
      }
      return true
    },
    onError(err: Error) {
      let errMessage = '上传失败，请稍后再试'
      const errInfo = err.message ? JSON.parse(err.message) : {}
      if (errInfo.msg) {
        errMessage = errInfo.msg
      }
      this.$message.error(errMessage)
      this.form.file = null
      throw err
    },
    onSuccess(res) {
      if (res && res.body) {
        if (res.body.resultType === '1') {
          this.$notify.success('导入成功')
          this.$emit('success')
          this.close()
        } else if (res.body.resultType === '2') {
          const errorMessage = res.body.errorMsg
            ? res.body.errorMsg
            : '导入失败，请稍后再试'
          this.$message.error(errorMessage)
        } else if (res.body.resultType === '3') {
          if (res.body.failList && res.body.failList.length) {
            this.failList = res.body.failList
            this.showFail = true
          } else {
            this.$message.error('导入失败，请稍后再试')
          }
        }
        this.$refs.upload.clearFiles()
      }
    },
    importFile() {
      ;(this.$refs.form as any).validate(() => {
        const avatar = this.$refs.upload
        if (avatar.uploadFiles.length) {
          return avatar.submit()
        }
      })
    },
    dowload() {
      downloadTemp().then((res) => {
        if (res) {
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
  },

}
</script>
<style lang='scss'>
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang='scss' module>
.wrapper {
  width: 360px;
  margin: 0 auto;
}

.doloadText {
  margin-left: $gapNormal;
  color: #3273c4;
  cursor: pointer;
}
</style>
