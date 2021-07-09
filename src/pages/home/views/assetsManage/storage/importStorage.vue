
<template>
  <div>
    <ElDialog
      :visible="visible"
      width="600px"
      :title="'批量导入'"
      center
      @close="close"
    >
      <!-- 批量导入计算机终端弹窗 -->
      <ElForm
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
            trigger: 'change',
          }"
        >
          <ElRow>
            <ElCol :span="12">
              <ElUpload
                ref="upload"
                :action="importStorages"
                :headers="HEAD"
                :limit="1"
                :on-file-change="fileChanged"
                :on-error="onError"
                :on-success="onSuccess"
                :show-file-list="true"
                :auto-upload="false"
                :on-remove="removeFile"
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
                @click="downloadTemplate"
              >下载模板</span>
            </ElCol>
          </ElRow>
        </ElFormItem>
      </ElForm>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          type="primary"
          @click="importFile"
        >导入</ElButton>
      </span>
    </ElDialog>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { HEAD } from '@/api/tools/file'
import { importStorages, downloadTemplate } from '@/api/assetsManage/storage'
import { save } from '@/utils/downloader'
import ElUpload from 'element-ui/lib/upload'
// import enhanceUpload from '@/libs/enhancers/upload'
export default {
  props: {
    visible: { type: Boolean },
  },
  components: { ElUpload },
  data() {
    return {
      form: {
        file: null,
      },
    }
  },
  computed: {
    HEAD: () => HEAD,
    importStorages,
  },
  methods: {
    downloadTemplate() {
      downloadTemplate().then(res => {
        save(res)
      })
    },
    close() {
      this.$emit('update:visible', false)
    },
    removeFile() {
      this.form.file = null
    },
    fileChanged(event: any) {
      const file = event.target.files[0]
      this.form.file = file
      this.$refs.form.validate()
    },
    onError(err: Error) {
      this.$message.error('上传失败，请稍后再试')
      this.form.file = null
      throw err
    },
    onSuccess(res) {
      if (res && res.status) {
        this.$notify.success('导入成功')
        this.$emit('success')
        this.close()
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
