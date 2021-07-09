<!-- 修改我的信息 -->
<template>
  <div class="el-card">
    <h4 :class="$style.title">
      修改我的信息
    </h4>
    <ElForm
      ref="form"
      label-width="100px"
      label-position="right"
      :model="form"
      size="small"
      :class="$style.wrapper"
    >
      <ElRow :gutter="GAP">
        <ElCol :span="7">
          <ElFormItem label="工号：">
            {{ form.employeeNumber }}
          </ElFormItem>

          <ElFormItem label="部门：">
            {{ role.departmentName }}
          </ElFormItem>

          <ElFormItem label="角色：">
            {{ role.roleName }}
          </ElFormItem>

          <ElFormItem
            label="姓名："
            prop="aliasName"
            :rules="{required: true, message: '请输入姓名'}"
          >
            <ElInput
              v-model.lazy.trim="form.aliasName"
              placeholder="请输入姓名"
            />
          </ElFormItem>
        </ElCol>

        <ElCol :span="9">
          <ElFormItem label="账号：">
            {{ form.username }}
          </ElFormItem>

          <ElFormItem
            label="联系方式："
            prop="cellPhone"
            :rules="checkPhone"
          >
            <ElInput
              v-model.lazy.trim="form.cellPhone"
              placeholder="请输入手机号码"
            />
          </ElFormItem>

          <ElFormItem
            label="邮箱："
            prop="mailbox"
            :rules="checkMail"
          >
            <ElInput
              v-model.lazy.trim="form.mailbox"
              placeholder="请输入邮箱"
            />
          </ElFormItem>

          <ElFormItem
            label="微信号："
            prop="wechat"
          >
            <ElInput
              v-model.lazy.trim="form.wechat"
              placeholder="请输入微信号"
            />
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem
            label="头像："
            prop="profilePicture"
          >
            <ElUpload
              ref="upload"
              drag
              accept="image/*"
              :limit="1"
              :action="upload"
              :headers="HEAD"
              :auto-upload="false"
              :show-file-list="false"
              :on-error="onError"
              :on-exceed="onExceed"
              :on-success="onSuccess"
              :on-file-change="setAvatar"
              :class="$style.avatar"
            >
              <img
                v-if="form.profilePicture"
                :src="avatar"
              >
              <i
                v-else
                class="i-wode"
              >请选择小于256kb的图片</i>
            </ElUpload>
          </ElFormItem>
        </ElCol>

        <ElCol :span="16">
          <ElFormItem label="备注：">
            {{ form.description }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="16">
          <ElFormItem>
            <ElButton
              type="primary"
              size="small"
              :loading="isSaving"
              @click="save"
            >
              保存
            </ElButton>

            <RouterLink
              class="el-button el-button--small"
              to="./"
            >
              取消
            </RouterLink>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElUpload from 'element-ui/lib/upload'

import { User, edit } from '@/api/authServer/user'
import enhanceUpload from '@/libs/enhancers/upload'
import { HEAD, upload, download } from '@/api/tools/file'

import me, { copy } from '@/store/user'
import CONFIG, { SPA } from '@/config'
import { phone, email } from '@/functions/validators'

import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const MAX_AVATAR_SIZE = 256 * 1024
const form = copy()

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ElUpload: enhanceUpload(ElUpload) },
  data: () => ({ form, isSaving: false }),
  computed: {
    upload,
    GAP: () => +LAYOUT.gap,
    HEAD: () => HEAD,
    avatar() {
      const src = this.form.profilePicture
      return src && src.indexOf('blob:') ? download(src) : src
    },
    role() {
      const roleList = this.form.roleList
      const role = roleList ? roleList[0] : {}
      if (role.roleCode === 'CUSTOM_ROLE') {
        CONFIG.g(SPA.home)
      }
      return role
    },
    checkPhone() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入手机号码'))
          }

          try {
            phone(value)
            callback()
          } catch (error) {
            callback(error)
          }
        },
      }
    },
    checkMail() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入邮箱'))
          }

          try {
            email(value)
            callback()
          } catch (error) {
            callback(error)
          }
        },
      }
    },
  },
  methods: {
    async submit(form: User) {
      this.isSaving = true
      try {
        await edit(form)
      } catch (error) {
        this.isSaving = false
        return
      }
      Object.assign(me, form)
      this.isSaving = false
      this.$notify.success('更新成功')
      this.up(true)
    },
    onSuccess(res: any) {
      this.submit({ ...this.form, profilePicture: res.body.fileId })
    },
    onError(err: Error) {
      this.isSaving = false
      this.$message.error('上传头像失败，请稍后再试')
      throw err
    },
    save() {
      ;(this.$refs.form as any).validate(async(valid: boolean) => {
        if (!valid) {
          return
        }

        const avatar = this.$refs.upload
        if (avatar.uploadFiles.length) {
          this.isSaving = true
          return avatar.submit()
        } else {
          this.submit(this.form)
        }
      })
    },
    setAvatar(event: any) {
      const file = event.target.files[0]
      if (file && (file.type || '').includes('image')) {
        if (file.size > MAX_AVATAR_SIZE) {
          this.$message.warning('请选择小于256kb的图片')
        } else {
          this.$_avatar && URL.revokeObjectURL(this.$_avatar)
          return this.$set(
            this.form,
            'profilePicture',
            (this.$_avatar = URL.createObjectURL(file))
          )
        }
      }
      this.$_avatar && URL.revokeObjectURL(this.$_avatar)
      this.$set(this.form, 'profilePicture', (this.$_avatar = ''))
    },
    onExceed(files: any, fileList: any) {
      const file = fileList[0]
      const newFile = files[0]
      file.name = newFile.name
      file.size = newFile.size
      newFile.uid = file.uid
      file.raw = newFile
      fileList = [file]
      this.setAvatar({ target: { files: [newFile] } })
    },
  },
  activated() {
    this.$_avatar && URL.revokeObjectURL(this.$_avatar)
    this.$_avatar = ''
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang="scss" module>
.wrapper {
  max-width: $widthPage;
  margin: auto;
}

.avatar :global {
  .i-wode {
    color: $colorTextMinor;
    font-size: $medium;

    &::before {
      display: block;
      margin-bottom: $gapNormal;
      font-size: 69px;
    }
  }

  .el-upload-dragger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    background: $colorBackGround;
  }

  img {
    width: 100%;
    height: 100%;
  }
}

.title {
  margin: 0 0 $gapNormal 0;
  font-size: $larger;

  :global(.i-bianji) {
    float: right;
  }
}

</style>
