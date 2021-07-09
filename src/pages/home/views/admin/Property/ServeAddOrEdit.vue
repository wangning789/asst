<!-- 服务器资产新增/编辑 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <h4 :class="$style.title">
      {{ form.id ? '修改资产' : '新增资产' }}
    </h4>
    <ElForm
      ref="form"
      label-width="160px"
      label-position="right"
      :model="form"
      :class="$style.wrapper"
    >
      <ElRow>
        <ElCol :span="12">
          <ElFormItem
            label="资产类型："
            prop="ciType"
          >
            <ElSelect
              v-model="form.ciType"
              filterable
              placeholder="资产类型"
              disabled
            >
              <ElOption
                v-for="(val, key, index) in types"
                :key="index"
                :label="val"
                :value="val"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            prop="cloudPlatformId"
            label="所属平台/托管位置："
            :rules="{
              required: true,
              message: '请选择云平台',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="cloudPlatform"
              placeholder="请选择云平台"
              :popper-append-to-body="false"
              value-key="id"
              @change="changed"
            >
              <ElOption
                v-for="item in provider"
                :key="item.id"
                :label="item.providerName"
                :value="item"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="资产编号："
            prop="ciCode"
          >
            <ElInput v-model.lazy.trim="form.ciCode" />
          </ElFormItem>
          <ElFormItem
            label="区域/VPC："
            prop="networkArea"
            :rules="{
              required: true,
              message: '请选择区域/VPC',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.networkArea"
              placeholder="请选择区域/VPC"
              :popper-append-to-body="false"
            >
              <ElOption
                v-for="(val, key) in NETWORK_AREA"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <!-- 二框 -->
      <ElRow>
        <ElCol :span="12">
          <ElFormItem
            label="资产名称："
            prop="ciName"
            :rules="{
              required: true,
              message: '请输入资产名称',
              trigger: 'blur',
            }"
          >
            <ElInput
              v-model.lazy.trim="form.ciName"
              :maxlength="20"
              show-word-limit
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="MAC地址："
            :rules="checkMAC"
            prop="macAddress"
          >
            <ElInput v-model.lazy.trim="form.macAddress" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="IP："
            :rules="checkIP"
            prop="ipAddress"
          >
            <ElInput v-model.lazy.trim="form.ipAddress" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="操作系统："
            prop="os"
          >
            <ElInput v-model.lazy="form.os" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="内存："
            prop="ciMemory"
          >
            <ElInput v-model.lazy.trim="form.ciMemory" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="硬盘："
            prop="ciHardDisk"
          >
            <ElInput v-model.lazy.trim="form.ciHardDisk" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="内核版本："
            prop="version"
          >
            <ElInput v-model.lazy="form.version" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="CPU："
            prop="ciCpu"
          >
            <ElInput v-model.lazy="form.ciCpu" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <!-- 三框 -->
      <ElRow v-if="!authFit(ROLES.custom)">
        <ElCol :span="16">
          <ElFormItem
            label="所属用户："
            prop="ownUserId"
            :rules="{
              required: true,
              message: '请选择所属用户',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.ownUserId"
              filterable
              placeholder="请选择所属用户"
              :disabled="isCustom"
            >
              <ElOption
                v-for="item in ciUsers"
                :key="item.id"
                :label="item.department"
                :value="item.userId"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem>
        <ElButton
          type="primary"
          @click="save"
        >
          保存
        </ElButton>
        <RouterLink
          class="el-button"
          :to="form.id ? 'server' : './'"
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
import IChooser from '@com/ChooserAsyncFunctional'
import { ciTypeS, ciUserS } from '@/api/servicePlatform/assetsController'
import getCode from '@/enums/code'
import { getP } from '@/api/servicePlatform/productController'

import { ROLES } from '@/enums'
import me from '@/store/user'

import {
  addFC,
  updataFC,
  addF,
  infoF,
  upDateF,
  Notice,
  ciUserF,
} from '@/api/servicePlatform/serverAssets'

// 校验
import { ip, macId } from '@/functions/validators'

import LAYOUT from '@/scss/export/layout.scss'

// WORK_AREA-网络区域
const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: {
    IChooser: IChooser as any,
  },
  data() {
    return {
      form: {
        ciType: '服务器资产',
        agentUuid: null,
        alarmNum: null,
        areaVpc: null,
        beginTime: null,
        businessImpact: null,
        ciCode: null,
        ciCpu: null,
        ciHardDisk: null,
        ciId: null,
        ciMemory: null,
        ciName: null,
        cloudPlatform: null,
        createDate: null,
        createUser: null,
        delStatus: null,
        status: null,
        deleteDate: null,
        diskSpace: null,
        endTime: null,
        id: null,
        ids: null,
        ipAddress: null,
        keyword: null,
        leakNum: null,
        location: null,
        macAddress: null,
        modifyDate: null,
        modifyUser: null,
        networkArea: null,
        orderField: null,
        orderFieldType: null,
        os: null,
        page: null,
        pageSize: null,
        processorCount: null,
        processorName: null,
        processorSpeed: null,
        serviceName: null,
        totalMemory: null,
        ownUserId: null,
        userName: null,
        version: null,
        cloudPlatformId: null,
        cloudPlatformName: null,
      },
      cloudPlatform: null,
      roles: null,
      isSaving: false,
      types: {},
      ciUsers: [],
      inputValue: false,
      provider: null,
    }
  },
  computed: {
    ROLES: () => ROLES,
    NETWORK_AREA: () => NETWORK_AREA.value,
    GAP: () => +LAYOUT.gap,
    isCustom() {
      return this.authFit(ROLES.custom)
    },
    ownUserId() {
      if (this.isCustom) {
        return me.id
      }
      return ''
    },
    // 校验方法MCA
    checkMAC() {
      return {
        // required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback()
          }
          try {
            macId(value)
            callback()
          } catch (error) {
            callback(error)
          }
        },
      }
    },
    checkIP() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入IP地址'))
          }

          try {
            ip(value)
            callback()
          } catch (error) {
            callback(error)
          }
        },
      }
    },
  },
  methods: {
    changed() {
      this.form.cloudPlatformId = this.cloudPlatform.id
      this.form.cloudPlatformName = this.cloudPlatform.providerName
    },
    async fetch(id?: string) {
      if (!id) {
        return 1
      }

      const data = (this.form = id ? (await infoF(id)).data.body || {} : {})
      this.assetList = this.form.assetList
      this.cloudPlatform = {
        id: this.form.cloudPlatformId,
        providerName: this.form.cloudPlatformName,
      }
      return (this.form = data)
    },
    // 有id编辑，没有id择是添加
    async submit(form: Notice) {
      this.isSaving = true
      let fn
      switch (true) {
        case this.authFit(ROLES.custom):
          fn = form.id ? updataFC : addFC
          break
        case this.authFit(ROLES.operation):
          fn = form.id ? upDateF : addF
          break
        default:
          break
      }

      fn && fn(form).then(res => {
        if (res?.data?.status) {
          this.$notify.success(
            `${!form.id ? '添加' : '更新'}资产【${form.ciName}】成功`
          )
          this.up(true)
        } else {
          this.$message.error(res?.data?.msg || res?.data?.body || '请联系管理员')
        }
      }).finally(() => {
        this.isSaving = false
      })
    },
    save() {
      (this.$refs.form as any).validate(async(valid: boolean) => {
        if (!valid) {
          return
        }
        this.submit(this.form)
      })
    },
    init() {
      this.form.ownUserId = this.ownUserId

      getP().then(res => {
        this.provider = res.data.body
      })

      ciTypeS().then(res => {
        this.types = res.data.body || {}
      })

      if (this.authFit(ROLES.custom)) {
        ciUserF().then(res => {
          this.ciUsers = res.data.body || []
        })
      } else if (
        this.authFit(ROLES.operation)
      ) {
        ciUserS().then(res => {
          this.ciUsers = res.data.body || []
        })
      }
    },
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
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
    width: 250px;
    height: 250px;
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

.fr {
  float: right;
}
</style>
