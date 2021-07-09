<!--&lt;!&ndash;分割线&ndash;&gt;-->
<template>
  <div
    class="el-card"
  >
    <!-- v-loading="isSaving" -->
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        inline
        :model="form"
      >
        <ElFormItem
          label="类型："
          prop="noticeLevel"
          :rules="{
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="form.noticeLevel"
            placeholder="请选择"
            clearable
            @change="selectChange"
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
          label="文件名："
          prop="titles"
          :rules="{
            required: true,
            message: '请输入文件名',
            trigger: 'change'
          }"
        >
          <ElInput
            v-model="form.titles"
            show-word-limit
            placeholder="请输入文件名"
            :maxlength="CONFIG.maxLength / 3"
            :class="$style.wide"
          />
        </ElFormItem>
        <ElFormItem
          label="附件："
        >
          <ElUpload
            ref="upload"
            class="upload-demo"
            :action="upload"
            :headers="HEAD"
            :file-list="fileList"
            :limit="1"
            :on-error="onError"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            :show-file-list="true"
            :auto-upload="false"
          >
            <ElButton
              slot="trigger"
              size="small"
            >
              选取文件
            </ElButton>
          </ElUpload>
        </ElFormItem>

        <ElFormItem
          label="描述："
          prop="content"
        >
          <ElInput
            v-model.lazy.trim="form.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请填写描述"
            :maxlength="CONFIG.maxLength"
            :class="$style.wide"
          />
        </ElFormItem>
      </ElForm>
    </div>
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

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { HEAD, upload } from '@/api/tools/file'
import { saveAppendixInfo } from '@/api/knowledge/knowledge'

import ElUpload from 'element-ui/lib/upload'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import conf from '@home/config'

/** emit: 事件说明 */
export default {
  components: { ElUpload },
  data() {
    return {
      fileList: [],
      isSaving: false,
      form: {
        customers: [],
        content: null,
        titles: null,
        noticeLevel: null,
      },
      alias: '',
      fileName: '',
      typeFile: '',
    }
  },
  computed: {
    HEAD: () => HEAD,
    upload,
    noticeLevels: () => [
      {
        label: '标准指南',
        value: '4',
      },
      {
        label: '法律法规',
        value: '1',
      },
      {
        label: '学习资料',
        value: '3',
      },
    ],
  },
  methods: {
    cancelUpload() {
      this.$router.go(-1)
    },
    beforeUpload(file: any) {
      const name = file.name
      this.fileName = name
      this.alias = this.form.titles
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
          this.$refs.form.resetFields()
        }
      })
    },
    selectChange() {
      this.typeFile = this.form.noticeLevel
    },
    onError() {
      this.$message({
        message: '上传失败',
        type: 'error',
      })
    },
    onSuccess(res: any) {
      saveAppendixInfo({
        fileId: res.body.fileId,
        fileAlias: this.alias,
        fileName: this.fileName,
        fileType: Number(this.typeFile),
        content: this.form.content,
      })
        .then(res => {
          if (res.data.status) {
            this.$message({
              showClose: true,
              message: '上传成功',
              type: 'success',
            })
            this.up(true)
            this.fileList = []
            this.form.noticeLevel = null
            this.form.titles = null
            this.form.content = null
          }
        })
    },
  },
}
</script>

<style lang='scss'>
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang="scss" module>
.contentBox {
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
