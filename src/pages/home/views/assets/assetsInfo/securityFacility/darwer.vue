<!-- 描述 -->
<template>
  <div>
    <IDrawer
      :drawer="drawer"
      :title="'批量导入'"
      @handleClose="handleClose"
    >
      <div slot="buttons">
        <!-- <span :class="$style.title">历史导入记录</span> -->
        <ElButton
          type="primary"
          size="small"
          @click="importFile"
        >
          导入
        </ElButton>
      </div>
      <div slot="content">
        <div :class="$style.from">
          <ElForm
            ref="form"
            size="small"
            :model="form"
            label-width="100px"
          >
            <ElFormItem
              label="服务类型："
              prop="name"
            >
              <ElInput
                v-model="form.name"
                :disabled="true"
                class="input"
                show-word-limit
                maxlength="20"
                placeholder="请输入单位名称"
              />
            </ElFormItem>
            <ElFormItem
              label="相关文件："
              prop="name"
            >
              <ElUpload
                ref="upload"
                :action="leadIn"
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
                  slot="trigger"
                  plain
                  size="small"
                >
                  上传附件
                </ElButton>
                <ElButton
                  style="margin-left: 10px;"
                  plain
                  size="small"
                  @click="downloadTemplate"
                >
                  下载模板
                </ElButton>
              </ElUpload>
            </ElFormItem>
          </ElForm>
        </div>
        <div
          v-show="show"
          :class="$style.table"
        >
          <span :class="$style.error">上传错误信息</span>
          <ElTable
            :data="tableData"
            style="width: 100%;"
          >
            <ElTableColumn
              prop="importFailRecordNumber"
              label="表格序号"
            />
            <ElTableColumn
              prop="importFailReason"
              label="错误信息"
            />
          </ElTable>
        </div>
      </div>
    </IDrawer>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { save } from '@/utils/downloader'
import { downloadTemplate, leadIn } from '@/api/assets/assetsInfo/securityFacility'
import ElUpload from 'element-ui/lib/upload'
import { FILETYPE } from './filetype'
import IDrawer from '@homeCom/assets/Drawer'
import STYLE from '@/scss/status.module.scss'
import { HEAD } from '@/api/tools/file'

export default {
  props: {
    drawer: {
      type: Boolean,
      default: Boolean,
    },
  },
  components: {
    IDrawer,
    ElUpload,
  },
  data() {
    return {
      show: false,
      tableData: [],
      uploadFlag: true,
      fileList: [],
      form: {
        name: '安全产品批量导入',
      },
      name: '',
      fileid: '',
    }
  },
  computed: {
    HEAD: () => HEAD,
    STYLE: () => STYLE,
    FILETYPE: () => FILETYPE,
    leadIn,
  },
  methods: {
    // 下载模板
    downloadTemplate() {
      downloadTemplate().then(res => {
        res.name = decodeURI(escape(res.name))
        save(res)
      })
    },
    handleClose() {
      this.show = false
      this.$emit('handleClose')
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
      // const type = name.substr(name.lastIndexOf('.') + 1)
      // const typeOk = FILETYPE.fileType.indexOf(type) !== -1
      // if (!typeOk) {
      //   this.isSaving = false
      //   this.$message({
      //     message: `请上传${FILETYPE.fileType}等类型文件`,
      //     type: 'error',
      //   })
      //   return false
      // }
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
      this.form.file = null
      throw err
    },
    onSuccess(res) {
      if (res && res.body) {
        if (res.body.resultType === '1') {
          this.$emit('handleClose')
          this.$notify.success('导入成功')
          this.show = false
          // this.$emit('success')
          // this.close()
        } else if (res.body.resultType === '2') {
          const errorMessage = res.body.errorMsg
            ? res.body.errorMsg
            : '导入失败，请稍后再试'
          this.$message.error(errorMessage)
        } else if (res.body.resultType === '3') {
          this.$message.error('上传格式错误，请重新上传')
          this.tableData = res.body.failList
          this.show = true
          // this.$message.error(res.body.failList[0].importFailReason)
        } else {
          this.$message.error(res.body)
        }
        this.$refs.upload.clearFiles()
      }
    },
    importFile() {
      ;(this.$refs.form as any).validate(() => {
        const avatar = this.$refs.upload
        if (avatar.uploadFiles.length) {
          return avatar.submit()
        } else {
          this.$message.error('请上传附件')
        }
      })
    },

  },

}
</script>

<style lang="scss" module>
.title {
  margin-right: 16px;
  color: #2c73ef;
  font-size: 12px;
}

.title:hover {
  cursor: pointer;
}

.error {
  font-weight: bold;
  font-size: 14px;
}

.table {
  // height: 600px;
  // background-color: yellow;
  // margin-top: 50px;
}

.from {
  height: 140px;
  // background-color: wheat;
}
</style>
