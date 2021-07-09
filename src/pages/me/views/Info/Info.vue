<!-- 我的信息 -->
<template>
  <div class="el-card">
    <h4 :class="$style.title">
      我的信息

      <RouterLink
        class="el-button el-button--text i-bianji"
        to="edit"
      >
        编辑
      </RouterLink>
    </h4>
    <ElRow :class="$style.user">
      <ElAvatar
        :src="avatar"
        :size="120"
      >
        <IIcon
          icon="i-morentouxianglanse"
          size="120px"
        />
      </ElAvatar>
      <br>
      <p :class="$style.name">
        {{ body.aliasName }}
      </p>
    </ElRow>
    <ElForm
      label-width="110px"
      label-position="right"
      :class="$style.wrapper"
    >
      <ElRow :gutter="GAP">
        <ElCol :span="8">
          <ElFormItem label="工号：">
            {{ body.employeeNumber }}
          </ElFormItem>

          <ElFormItem label="联系方式：">
            {{ body.cellPhone }}
          </ElFormItem>

          <ElFormItem label="创建时间：">
            {{ body.createDate }}
          </ElFormItem>
          <ElFormItem label="备注：">
            {{ body.description }}
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="部门：">
            {{ role.departmentName }}
          </ElFormItem>

          <ElFormItem label="邮箱：">
            {{ body.mailbox }}
          </ElFormItem>

          <ElFormItem label="最后登录时间：">
            {{ body.lastLoginTime }}
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="角色：">
            {{ role.roleName }}
          </ElFormItem>

          <ElFormItem label="微信号：">
            {{ body.wechat }}
          </ElFormItem>

          <ElFormItem label="更新时间：">
            {{ body.modifyDate }}
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElAvatar from 'element-ui/lib/avatar'
import IIcon from '@com/Icon'

import me from '@/store/user'
import CONFIG, { SPA } from '@/config'
import { download } from '@/api/tools/file'

import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ElAvatar, IIcon },
  computed: {
    GAP: () => +LAYOUT.gap,
    body: () => me,
    avatar() {
      const src = me.profilePicture
      return src && src.indexOf('blob:') ? download(src) : src
    },
    role() {
      const roleList = me.roleList
      const role = roleList ? roleList[0] : {}
      if (role.roleCode === 'CUSTOM_ROLE') {
        CONFIG.g(SPA.home)
      }
      return role
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/avatar';
</style>

<style lang="scss" module>
.title {
  margin: 0 0 $gapNormal 0;
  font-size: $larger;

  :global(.i-bianji) {
    float: right;
  }
}

.user {
  text-align: center;

  :global(.el-avatar) {
    background-color: $colorTransparent !important;
  }
}

.name {
  display: inline-block;
  margin-right: $gapNormal;
  color: $colorTextMain;
  font-weight: bold;
  font-size: $xLarge;
  vertical-align: middle;
}

.wrapper {
  max-width: $lg;
  margin: auto;
}
</style>
