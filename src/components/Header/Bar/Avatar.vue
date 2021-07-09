<!-- 头像 -->
<template>
  <ElDropdown
    v-if="data.id"
    @command="onCommand"
  >
    <ElAvatar
      :src="avatar"
      :class="$style.avatar"
      :size="30"
    >
      <IIcon
        icon="i-morentouxianglanse"
        size="30px"
      />
    </ElAvatar>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          disabled
          style="pointer-events: unset;"
        >
          <ElTooltip
            :content="data.aliasName"
            placement="left"
          >
            <b :class="$style.name">{{ data.aliasName }}</b>
          </ElTooltip>
        </ElDropdownItem>

        <ElDropdownItem
          v-if="isUser"
          divided
          command="me"
          icon="i-wode"
        >
          个人信息
        </ElDropdownItem>

        <ElDropdownItem
          command="pwd"
          icon="i-mimazhongzhi"
        >
          修改密码
        </ElDropdownItem>

        <ElDropdownItem
          command="logout"
          icon="i-zhuyi-pingfenkanban"
        >
          注销
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
    <IPassword
      :id="data.id"
      :username="data.username"
      :visible.sync="visible"
    />
  </ElDropdown>

  <ElAvatar
    v-else
    :class="$style.avatar"
  >
    <i class="i-wode" />
  </ElAvatar>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElAvatar from 'element-ui/lib/avatar'
import ElDropdown from 'element-ui/lib/dropdown'
import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
import ElDropdownItem from 'element-ui/lib/dropdown-item'
import IIcon from '@com/Icon'
import IPassword from '@com/user/Password'

import CONFIG, { SPA } from '@/config'
import { GLOBAL } from '@/enums/events'
import { download } from '@/api/tools/file'
import { logout } from '@/api/authServer/user'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { data: { type: Object, default: () => ({}) } },
  components: {
    ElAvatar,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    IIcon,
    IPassword,
  },
  data() {
    return { visible: null }
  },
  computed: {
    isUser() {
      const roleList = this.data.roleList
      const role = roleList ? roleList[0] : {}
      return role.roleCode !== 'CUSTOM_ROLE'
    },
    avatar() {
      const src = this.data.profilePicture
      return src && src.indexOf('blob:') ? download(src) : src
    },
  },
  methods: {
    onCommand(command: string) {
      switch (command) {
        case 'me':
          CONFIG.g(SPA.me)
          return
        case 'pwd':
          this.visible = false
          return
        case 'logout':
          sessionStorage.clear()
          localStorage.clear()
          this.emit(GLOBAL.beforeLogout)
          this.$loading({ lock: true, text: '注销中, 请稍候...' })
          logout().finally(() => {
            CONFIG.g()
          })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/avatar';
@import '~element-ui/packages/theme-chalk/src/dropdown';
@import '~element-ui/packages/theme-chalk/src/dropdown-menu';
@import '~element-ui/packages/theme-chalk/src/dropdown-item';
</style>

<style lang="scss" module>
.avatar {
  vertical-align: middle;
  background-color: $colorTransparent !important;
  cursor: pointer;
}

.name {

  @extend %ellipsis;

  display: inline-block;
  width: 125px;
  vertical-align: middle;
}
</style>
