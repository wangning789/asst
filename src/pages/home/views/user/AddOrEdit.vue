<!-- 新增/编辑 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <h4 :class="$style.title">
      {{ route.meta.title }}
    </h4>
    <ElForm
      ref="form"
      label-width="100px"
      label-position="right"
      :model="form"
      :class="$style.wrapper"
    >
      <ElRow :gutter="GAP">
        <ElCol :span="7">
          <ElFormItem
            label="工号："
            size="small"
            prop="employeeNumber"
            :rules="checkEN"
          >
            <ElInput
              v-model.lazy.trim="form.employeeNumber"
              placeholder="请输入工号"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </ElFormItem>

          <ElFormItem
            label="平台："
            size="small"
          >
            <DepSelect
              visible
              :disabled="!!form.id"
              :value="role.departmentId"
              @input="$event ? fetchRole($event) : roles = []"
            />
          </ElFormItem>
          <ElFormItem
            label="角色："
            prop="roleList"
            size="small"
            :rules="checkRole"
          >
            <ElSelect
              :disabled="!!form.id"
              :value="role.id"
              filterable
              :loading="!!role.departmentId && !roles"
              :placeholder="role.departmentId ? '请选择角色' : '请先选择部门'"
              @change="changeRole($event)"
            >
              <ElOption
                v-for="option in roles"
                :key="option.id"
                :label="option.roleName"
                :value="option.id"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem
            v-show="showRoleInfo"
            label="所属单位："
            size="small"
            prop="organizationId"
            :rules="checkOrganization"
          >
            <ElSelect
              v-model="form.organizationId"
              filterable
              placeholder="请选择所属单位"
              @change="organizationId = $event || ''"
            >
              <ElOption
                v-for="option in organizations"
                :key="option.id"
                :label="option.title"
                :value="option.id"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem
            v-show="showRoleInfo"
            label="用户身份："
            size="small"
            prop="userIdentity"
            :rules="checkUserIdentity"
          >
            <ElSelect
              v-model="form.userIdentity"
              filterable
              placeholder="请选择用户身份"
              @change="userIdentityCode = $event || ''"
            >
              <ElOption
                v-for="option in userIdentitys"
                :key="option.dictCode"
                :label="option.dictName"
                :value="option.dictCode"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem
            label="姓名："
            size="small"
            prop="aliasName"
            :rules="checkAN"
          >
            <ElInput
              v-model.lazy.trim="form.aliasName"
              placeholder="请输入姓名"
            />
          </ElFormItem>
        </ElCol>

        <ElCol :span="9">
          <ElFormItem
            label="账号："
            prop="username"
            size="small"
            :rules="checkUN"
          >
            <ElInput
              v-model.lazy.trim="form.username"
              placeholder="请输入账号"
            />
          </ElFormItem>

          <ElFormItem
            v-if="!form.id"
            label="密码："
            prop="password"
            size="small"
            :rules="checkPassword"
          >
            <template #label>
              新密码
              <ElTooltip
                content="随机"
                placement="top-start"
              >
                <ElButton
                  type="text"
                  icon="el-icon-sugar"
                  @click="random"
                />
              </ElTooltip>
            </template>

            <ElInput
              v-model.lazy.trim="form.password"
              show-password
              type="password"
              placeholder="请输入密码"
            />
          </ElFormItem>

          <ElFormItem
            label="联系方式："
            prop="cellPhone"
            size="small"
            :rules="checkPhone"
          >
            <ElInput
              v-model.lazy.trim="form.cellPhone"
              placeholder="请输入手机号码"
            />
          </ElFormItem>

          <ElFormItem
            label="邮箱："
            size="small"
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
            size="small"
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
                :src="getAvatar(form.profilePicture)"
              >
              <i
                v-else
                class="i-wode"
              >请选择小于256kb的图片</i>
            </ElUpload>
          </ElFormItem>
        </ElCol>

        <ElCol :span="16">
          <ElFormItem
            label="备注："
            size="small"
            prop="description"
          >
            <ElInput
              v-model.lazy.trim="form.description"
              show-word-limit
              type="textarea"
              maxlength="60"
              placeholder="请输入备注"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElFormItem>
        <ElButton
          type="primary"
          size="small"
          @click="save"
        >
          保存
        </ElButton>

        <RouterLink
          class="el-button el-button--small"
          :to="'/user'"
        >
          取消
        </RouterLink>
      </ElFormItem>
    </ElForm>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElUpload from 'element-ui/lib/upload'
import IChooser from '@com/ChooserAsyncFunctional'
import DepSelect from '@homeCom/admin/DepSelect'

import {
  User,
  cInfo,
  aInfo,
  saInfo,
  cAdd,
  aAdd,
  saAdd,
  cUpdate,
  aUpdate,
  saUpdate,
  enCheck,
  unCheck,
} from '@/api/authServer/user'
import { listByDep } from '@/api/authServer/role'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { sub } from '@/api/authServer/code'
import { codeType, parentCode, roleAttribute } from '@/enums/code'
import enhanceUpload from '@/libs/enhancers/upload'
import { HEAD, upload, download } from '@/api/tools/file'
import {
  username,
  phone,
  email,
  password,
  randomPassword,
  aliaName,
} from '@/functions/validators'
import { ROLES } from '@/enums'

import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const MAX_AVATAR_SIZE = 256 * 1024

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: {
    ElUpload: enhanceUpload(ElUpload),
    IChooser: IChooser as any,
    DepSelect,
  },
  data() {
    return {
      form: {} as User,
      roles: null,
      organizations: null,
      userIdentitys: null,
      showRoleInfo: false,
      organizationId: '',
      userIdentityCode: '',
      isSaving: false,
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    HEAD: () => HEAD,
    upload,
    API() {
      switch (true) {
        case this.authFit(ROLES.common):
          return { info: cInfo, add: cAdd, edit: cUpdate }
        case this.authFit(ROLES.systemAdmin):
          return { info: aInfo, add: aAdd, edit: aUpdate }
        case this.authFit(ROLES.superAdmin):
          return { info: saInfo, add: saAdd, edit: saUpdate }
        default:
          return {}
      }
    },
    role: {
      get() {
        const roleList = this.form.roleList
        const role = roleList ? roleList[0] : {}
        this.roles || (role.departmentId && this.fetchRole(role.departmentId))
        return role
      },
      set(id: string) {
        const roles = this.roles
        if (roles) {
          let role
          for (role of roles) {
            if (id === role.id) {
              this.showRoleInfo = role.roleAttribute === roleAttribute.SYS_ROLE_UNIT
              this.$set(this.form, 'roleList', [role])
              return
            }
          }
        }
      },
    },
    checkEN() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入工号'))
          }
          try {
            username(value, '工号')
          } catch (error) {
            return callback(error)
          }

          enCheck(value, this.form.id)
            .then(res => {
              res.data.status
                ? callback()
                : callback(new Error(res.data.msg || '工号重复'))
            })
            .catch(err => {
              callback(new Error(err.data.msg || '工号重复'))
            })
        },
      }
    },
    checkUN() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入账号'))
          }
          try {
            username(value)
          } catch (error) {
            return callback(error)
          }

          unCheck(value, this.form.id)
            .then(res => {
              res.data.status
                ? callback()
                : callback(new Error(res.data.msg || '账号重复'))
            })
            .catch(err => {
              callback(new Error(err.data.msg || '账号重复'))
            })
        },
      }
    },
    checkAN() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入姓名'))
          }
          try {
            aliaName(value, '姓名')
            callback()
          } catch (error) {
            return callback(error)
          }
        },
      }
    },
    checkRole() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          this.role.id ? callback() : callback(new Error('请选择角色'))
        },
      }
    },
    checkOrganization() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (this.showRoleInfo) {
            this.form.organizationId ? callback() : callback(new Error('请选择所属单位'))
          } else {
            callback()
          }
        },
      }
    },
    checkUserIdentity() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (this.showRoleInfo) {
            this.form.userIdentity ? callback() : callback(new Error('请选择用户身份'))
          } else {
            callback()
          }
        },
      }
    },
    checkPassword() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入密码'))
          }

          try {
            password(value)
            callback()
          } catch (error) {
            callback(error)
          }
        },
      }
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
    changeRole(event) {
      if (event) {
        this.role = event
        this.showRoleInfo && this.getRoleInfo()
      }
    },
    changeOrganization(event) {
      this.organizationId = event || ''
    },
    async fetch(id?: string) {
      this.form = id ? (await this.API.info(id)).data.body || {} : {}
      if (this.form.userIdentity && this.form.organizationId) {
        this.getRoleInfo()
        this.showRoleInfo = true
      }
      return this.form
    },
    async fetchRole(depId: string) {
      this.roles = Object.freeze((await listByDep(depId)).data.body || [])
    },
    getRoleInfo() {
      this.fetchOrganization()
      this.fetchUserIdentity()
    },
    async fetchOrganization() {
      this.organizations = Object.freeze((await getOrganizationInfo()).data.body || [])
    },
    async fetchUserIdentity() {
      const params = {
        dictCode: parentCode.UNIT_IDENTITY,
        dictType: codeType.sys,
      }
      this.userIdentitys = Object.freeze((await sub(params)).data.body || [])
    },
    async submit(form: User) {
      this.isSaving = true
      try {
        await this.API[form.id ? 'edit' : 'add'](form)
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.$notify.success(
        `${!form.id ? '添加' : '更新'}用户【${form.aliasName}】成功${
          !form.id ? '，请10分钟后再尝试使用该用户登陆' : ''
        }`
      )
      this.up(true)
    },
    getAvatar(src: string) {
      return src && src.indexOf('blob:') ? download(src) : src
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
    random() {
      this.$set(this.form, 'password', randomPassword())
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
    // background: $colorBackGround;
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

.fr {
  float: right;
}
</style>
