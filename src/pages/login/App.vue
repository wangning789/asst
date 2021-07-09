<!--
 * @Description: 布局
 * @Author: 毛瑞
 * @Date: 2020-05-18 15:50:46
 -->
<template>
  <body @keyup.enter="visible === null ? login() : $refs.pwd.modify()">
    <div :class="$style.rest">
      <div :class="$style.post" />

      <div :class="$style.right">
        <img
          src="@/assets/logo-login.png"
          :class="$style.logo"
        >

        <div :class="$style.form">
          <div :class="$style.loginText">
            <span>用户登录</span>
          </div>
          <ElForm
            ref="id"
            :model="forms.id"
          >
            <ElFormItem
              prop="username"
              :rules="{
                required: true,
                message: '请输入账号'
              }"
            >
              <ElInput
                v-model.trim="forms.id.username"
                prefix-icon="i-wode"
                placeholder="请输入账号"
              />
            </ElFormItem>

            <ElFormItem
              prop="password"
              :rules="{
                required: true,
                message: '请输入密码'
              }"
            >
              <ElInput
                v-model.trim="forms.id.password"
                type="password"
                show-password
                prefix-icon="i-mima"
                placeholder="请输入密码"
              />
            </ElFormItem>
            <div :class="$style.codeArea">
              <img
                :class="$style.img"
                :src="src"
                alt="验证码"
                @click="refreshUuid"
              >

              <ElFormItem
                prop="imageCode"
                :rules="{
                  required: true,
                  trigger: 'change',
                  message: '请输入验证码',
                }"
                :class="$style.code"
              >
                <ElInput
                  v-model.lazy.trim="forms.id.imageCode"
                  placeholder="请输入验证码"
                />
              </ElFormItem>
            </div>
          </ElForm>

          <!-- <ElCheckbox
            v-model="remember"
            :class="$style.auto"
          >
            自动登录
          </ElCheckbox> -->
          <ElButton
            type="primary"
            :loading="load"
            :class="$style.login"
            @click="login"
          >
            登录
          </ElButton>
        </div>
      </div>
    </div>

    <IPassword
      :id="id"
      ref="pwd"
      :username="forms[way].username"
      :visible.sync="visible"
      @revised="revised"
    />
  </body>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IPassword from '@com/user/Password'

import { isFn } from '@/utils'
import { login, API } from '@/api/authServer/user'
import { getUuid } from '@/utils/getKey'
import { getUri } from '@/utils/ajax'
import { systemCode } from '@/config/config'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IPassword },
  data() {
    return {
      // 登录方式
      way: 'id' as const,
      forms: {
        id: { username: '', password: '', imageCode: '' },
      },
      load: false,
      id: '',
      visible: null as null | false,
      uuid: '',
    }
  },
  computed: {
    // name() {
    //   return process.env.APP_NAME
    // },
    src() {
      return getUri(API.code, { uuid: this.uuid })
    },
  },
  methods: {
    refreshUuid() {
      this.uuid = getUuid('', 16, true)
      this.forms.id.imageCode = ''
    },
    login() {
      this.load ||
        (this.$refs[this.way] as any).validate((valid: boolean) => {
          if (!valid) {
            return
          }

          switch (this.way) {
            case 'id':
              this.load = true
              return this.loginById(this.forms[this.way])
          }
        })
    },
    loginById(form: { username: string; password: string; imageCode: string }) {
      form.systemCode = location.href.split('systemCode=')[1] ? location.href.split('systemCode=')[1] : systemCode
      login(form)
        .then(res => {
          if (isFn(res)) {
            res()
          } else {
            this.id = res.id
            this.visible = false
          }
        })
        .catch(() => {
          this.uuid = getUuid('', 16, true)
        })
        .finally(() => {
          this.load = false
        })
    },
    revised() {
      this.refreshUuid()
      const forms: any = this.forms
      let attr
      let attr1
      let obj
      for (attr in forms) {
        if ((obj = forms[attr])) {
          for (attr1 in obj) {
            obj[attr1] = ''
          }
          ;(this.$refs[attr] as any).resetFields()
        }
      }
      this.visible = null
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang="scss" module>
:global {
  html {
    background: linear-gradient(225deg, $colorTheme8, $colorTheme9);

    body {
      height: 100vh;
      background: url(~@login/assets/bg.png) 0 0 no-repeat;
      background-size: cover;
    }
  }
}

.body {

  @extend %centerPage;

  width: 75vw;
  min-width: 900px;
  height: 42vw;
  min-height: 510px;
  background: $colorWhite;
}

.logo {
  position: absolute;
  top: $gapNormal * (-4);
  width: 398px;
  // height: 72px;
}

.rest {
  display: flex;
  align-items: center;
  // justify-content: center;
  height: calc(100% - #{$gapNormal * 4});
  padding: 0 12vw;
}

.post {
  width: 60vh;
  height: 100vh; // calc(100% - #{$gapNormal * 2});
  margin: $gapNormal * 2 10vw 0 0;
  background: url(~@login/assets/ball.png) center center no-repeat;
  background-size: contain;
}

.right {
  position: relative;
  width: 400px;
  min-width: 400px;
  margin: $gapNormal * 3 0 0;

  > h1 {
    margin: 0 0 $gapNormal;
    color: $colorWhite;
    font-size: $xxxxLarge;
    line-height: 1.5em;
    text-align: left;
  }

  :global(.el-tabs__item.is-active) {
    color: $colorWhite !important;
  }
}

.loginText {
  height: 67px;
  color: #fff;
  font-size: 22px;
  line-height: 67px;
}

.form {
  padding: $gapNormal 0;

  .codeArea {
    display: flex;
    align-items: center;
  }

  .img {
    display: inline-block;
    box-sizing: border-box;
    width: 250px - $gapNormal;
    height: 54px;
    margin-right: $gapNormal;
    margin-bottom: 22px;
  }

  .auto {
    color: $colorTextMinor;
  }

  input,
  .login {
    height: 54px;
  }

  .login {
    width: 100%;
    margin-top: $gapNormal;
    font-size: 20px;
    background: #1d8af8;
    border: 0;
  }

  .login:hover {
    background: #1d8af8 0.8;
  }

  .code {
    display: inline-block;
    width: 150px;
  }
}
</style>
