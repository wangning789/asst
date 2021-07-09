<template>
  <div>
    <ElDialog
      title="添加威胁 IP"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <ElSteps
        :active="active"
        finish-status="success"
        process-status="process"
        align-center
      >
        <ElStep title="添加威胁 IP" />
        <ElStep title="情报碰撞" />
        <ElStep title="导入成功" />
      </ElSteps>
      <div
        v-show="active === 0"
        :class="$style.elDialog"
      >
        <!-- <div :class="$style.text"> -->
        <div :class="$style.from">
          <ElForm
            ref="form"
            :class="$style.text"
            :model="form"
            label-width="100px"
          >
            <ElFormItem label="IP：">
              <ElInput
                v-model="form.desc"
                placeholder="请输入IP,多条记录需要用逗号隔开"
                :rows="5"
                :class="$style.elinput"
                type="textarea"
              />
            </ElFormItem>
            <!-- <span>注意：输入内容不能有空格和回车</span> -->
            <ElFormItem>
              <ElUpload
                ref="upload"
                action=""
                :headers="HEAD"
                :on-change="logFileChanged"
                :on-error="onError"
                :on-success="onLogFileSuccess"
                :show-file-list="true"
                :file-list="logFileList"
                :http-request="httpRequest"
                :on-exceed="handleExceed"
                :limit="1"
                :before-upload="beforeLogUpload"
                :before-remove="removeLogFile"
                :auto-upload="false"
              >
                <!-- <div :class="$style.titleNameTwo">
                  <div> -->
                <ElButton
                  size="small"
                  type="primary"
                >
                  上传附件
                </ElButton>
                <!-- </div>
                  <div :class="$style.beCareful">注意：请上传txt格式文件</div>
                </div> -->
              </ElUpload>
            </ElFormItem>
            <ElFormItem
              label="标签："
              prop="label"
              :rules="{
                required: true,
                message: '标签不能为空',
                trigger: 'blur',
              }"
            >
              <ElInput
                v-model.trim="form.label"
                placeholder="请输入标签,多条标签需要用逗号隔开(标签最多输入10个字符)"
                :class="$style.elinput"
              />
            </ElFormItem>
            <ElFormItem>
              <div :class="$style.dialog">
                <div>
                  <ElButton
                    type="primary"
                    @click="clickAdd('form')"
                  >
                    下一步
                  </ElButton>
                </div>
                <div style="margin-left: 15px;">
                  <ElButton @click="clickCancel">
                    取 消
                  </ElButton>
                </div>
              </div>
            </ElFormItem>
          </ElForm>
        </div>
      </div>
      <div
        v-show="active === 1"
        :class="$style.elDialogTwo"
      >
        <div :class="$style.titleName">
          以下为碰撞查询结果，其中&nbsp;<label style="color: #dd4927;">{{
            number
          }}</label>&nbsp;条信息有碰撞结果
        </div>
        <div :class="$style.collision">
          <div
            v-for="(item, index) in content"
            :key="index"
          >
            <div :class="$style.outerframe">
              <div
                v-if="item.result !== ''"
                :class="$style.tag"
              >
                {{ item.result }}
              </div>
              <div
                v-else
                :class="$style.tagTwo"
              />
              <div :class="$style.ip">
                {{ item.ip }}
              </div>
              <div :class="$style.eltag">
                <div
                  v-for="(val, index1) in item.labelList"
                  :key="index1"
                >
                  <div>
                    <ElTag
                      type="danger"
                      size="medium"
                    >
                      {{ val }}
                    </ElTag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          slot="footer"
          :class="$style.dialog"
        >
          <ElButton
            type="primary"
            @click="nextStep"
          >
            添加
          </ElButton>
          <ElButton @click="clickCancel">
            取 消
          </ElButton>
        </div>
      </div>
      <div
        v-if="active === 2"
        style="height: 450px;"
      >
        <div :class="$style.elDialogShtree">
          <div :class="$style.success">
            <div>本次成功添加<label style="color: #fcb698;"> {{ addNumber }} </label>条数据</div>
            <!-- <div
              :class="$style.icno"
              class="i-checkbox-circle-fill1"
            />
            <div :class="$style.title">
              添加成功
            </div> -->
          </div>
        </div>
        <div :class="$style.tips">
          请根据实际情况选择是否需要发起相关任务
        </div>
        <div :class="$style.prohibit">
          <ElButton
            type="danger"
            plain
            @click="clickEstablish"
          >
            威胁情报通报任务
          </ElButton>
          <ElButton
            type="danger"
            plain
            @click="clickclickEstablishIP"
          >
            IP 封禁任务
          </ElButton>
        </div>
      </div>
    </ElDialog>
    <IDialog
      :visible.sync="visible"
      @success="refreshTable"
    />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { FILETYPE } from './enums'
import { upload, addThreat } from '@/api/threatNotification/threatNotification'
import { HEAD } from '@/api/tools/file'
import IDialog from './importPeripheral'
import ElUpload from 'element-ui/lib/upload'
import {
  addGeneralOperaMaint1,
  toDetail,
} from '@/api/taskManagement/taskManagement'
/** emit: 事件说明 */
export default {
  props: {},
  components: { IDialog, ElUpload },
  data() {
    return {
      addNumber: 0,
      number: 0,
      content: [],
      logFileList: [],
      visible: false,
      dialogVisible: false,
      active: 0,
      form: {
        desc: '',
        label: '',
      },
    }
  },
  computed: {
    HEAD: () => HEAD,
  },
  watch: {},
  methods: {
    clickCancel() {
      this.$emit('refresh')
      this.form.desc = ''
      this.form.label = ''
      this.dialogVisible = false
      this.$refs.upload.fileList.splice(0)
      this.number = 0
      this.addNumber = 0
      this.active = 0
      this.$refs.form.clearValidate()
    },
    addThreat() {
      addThreat(this.content).then((res) => {
        if (res.data.body) {
          this.active = 2
        }
      })
    },
    clickclickEstablishIP() {
      let password = ''
      this.dialogVisible = false
      this.active = 0
      addGeneralOperaMaint1('3').then((res) => {
        password = res.data.body
        this.jumpPage(password)
      })
    },
    clickEstablish() {
      let password = ''
      this.dialogVisible = false
      this.active = 0
      addGeneralOperaMaint1('4').then((res) => {
        password = res.data.body
        this.jumpPage(password)
      })
    },
    jumpPage(processId, type) {
      toDetail(processId, '详情', (msg) => {
        if (!type && (msg.data === 'close' || msg.data === 'hide')) {
          this.$emit('refresh')
        }
      })
    },
    nextStep() {
      this.addThreat()
    },
    clickAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const flitlist = this.$refs.upload.fileList
          if (this.form.desc !== '' && flitlist.length === 0) {
            const fd = new FormData() // FormData 对象
            fd.append('content', this.form.desc)
            fd.append('lable', this.form.label)
            fd.append('file', '')
            upload(fd).then((res) => {
              if (res.data.status) {
                this.$refs.upload.clearFiles()
                this.content = res.data.body
                this.content.map((item) => {
                  if (item.result !== '') {
                    this.number++
                  } else {
                    this.addNumber++
                  }
                })
                this.active = 1
                this.form.desc = ''
                this.form.label = ''
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else if (this.form.desc === '' && flitlist.length === 0) {
            this.$message.error('请填写IP或者上传附件')
          } else {
            this.$refs.upload.submit()
          }
        } else {
          return false
        }
      })
    },
    httpRequest(param) {
      const fileObj = param.file
      const fd = new FormData() // FormData 对象
      fd.append('file', fileObj) // 文件对象
      fd.append('content', this.form.desc)
      fd.append('lable', this.form.label)
      upload(fd).then((res) => {
        if (res.data.status) {
          this.content = res.data.body
          this.content.map((item) => {
            if (item.result !== '') {
              this.number++
            } else {
              this.addNumber++
            }
          })
          this.active = 1
          this.form.desc = ''
          this.form.label = ''
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
          file.raw.type === 'text/plain' &&
          this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
          }).then(() => {
            this.$refs.upload.fileList.splice(0)
            this.$notify.success('成功删除附件')
          })
        )
      }
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
        return false
      }
      const size = file.size
      if (size > FILETYPE.fileSize) {
        this.$message({
          message: '文件大小需要小于50M',
          type: 'error',
        })
        return false
      } else if (!(size > 0)) {
        this.$message({
          message: '文件内容不能为空',
          type: 'error',
        })
        return false
      }
      return true
    },
    handleExceed() {
      this.$message.warning('只能上传一个文件')
    },
    onLogFileSuccess(res) {
      if (res && res.status && res.body) {
        this.form.appendixIds = res.body.fileId || ''
      }
    },
    onError(err: Error) {
      let errorMessage = '导入失败，请稍后再试'
      if (err && err.msg) {
        errorMessage = err.msg
      }
      this.$message.error(errorMessage)
    },
    logFileChanged(file, fileList) {
      this.logFileList = fileList.slice(-1)
      this.form.appendixName = file.name
    },
    refreshTable() {
      ;(this.$refs.table as any).fetch()
    },
    handleClose() {
      this.$refs.form.clearValidate()
      this.$emit('refresh')
      this.number = 0
      this.addNumber = 0
      this.$refs.upload.fileList.splice(0)
      this.form.desc = ''
      this.form.label = ''
      this.dialogVisible = false
      this.active = 0
    },
  },
}
</script>

<style lang="scss" module>
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 108px;
  background-color: #fcb698;
}

.name {
  font-weight: bold;
  font-size: 16px;
}

.elinput {
  width: 100%;
}

.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
}

.elDialog {
  display: flex;
  justify-content: center;
  height: 450px;

  .from {
    width: 70%;
    margin: auto;
  }
}

.elDialogTwo {
  height: 400px;
}

.elDialogShtree {
  display: flex;
  justify-content: center;
}

.icno {
  display: flex;
  justify-content: center;
  margin: auto;
  margin-bottom: 24px;
  color: rgb(104, 194, 58);
  font-size: 40px;
}

.title {
  display: flex;
  justify-content: center;
  margin: auto;
  font-weight: bold;
  font-size: 20px;
}

.text {
  width: 100%;
  margin: 0 auto;
}

.success {
  margin-top: 100px;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 16px;
}

.tips {
  margin-top: 120px;
  color: #999;
  font-size: 13px;
  text-align: center;
}

.prohibit {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}

.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 28px;
  margin-right: 8px;
  color: #409eff;
  font-size: 12px;
  background-color: rgb(236, 245, 255);
  border: 1px solid rgba(166, 206, 227, 0.5);
  border-radius: 10%;
}

.tagTwo {
  width: 70px;
  height: 28px;
  margin-right: 8px;
}

.ip {
  width: 130px;
  margin-right: 50px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.outerframe {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}

.collision {
  width: 95%;
  height: 320px;
  margin: auto;
  margin-top: 10px;
  overflow: hidden;
  overflow-y: scroll;
}

.titleName {
  margin: 20px 0;
  font-size: 13px;
  text-align: center;
}

.eltag {
  display: flex;
  flex-wrap: wrap;
  width: 70%;

  div {
    margin-right: 5px;
  }
}

</style>
