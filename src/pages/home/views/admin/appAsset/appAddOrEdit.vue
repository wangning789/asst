<!-- 服务器资产新增/编辑 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <h4 :class="$style.title">
      {{ form.id ? "修改资产" :'新增资产' }}
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
                v-for="(val, index) in types"
                :key="index"
                :label="types[val]"
                :value="val"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="资产编号："
            prop="ciCode"
          >
            <ElInput
              v-model.lazy.trim="form.ciCode"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="所属平台/托管位置："
            prop="cloudPlatformId"
            :rules="{
              required: true,
              message: '请选择云平台',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="cloudPlatform"
              placeholder="请选择部署云平台"
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
            :rules="{required:true,message:'请输入资产名称',trigger:'blur'}"
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
            label="访问域名："
            prop="domainName"
          >
            <ElInput
              v-model.lazy.trim="form.domainName"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            label="服务器台数："
            prop="assetNum"
          >
            <ElInput
              v-model.lazy.trim="form.assetNum"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem
            label="描述："
            prop="describe"
          >
            <ElInput
              v-model.lazy.trim="form.describe"
              type="textarea"
              :rows="2"
              placeholder="请输入描述内容"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <!-- 三框 -->
      <ElRow>
        <ElCol
          v-if="!authFit(ROLES.custom)"
          :span="16"
        >
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
              :disabled="isCustom"
              placeholder="请选择所属用户"
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
        <ElCol :span="20">
          <ElFormItem
            label="相关服务器资产："
            prop="assetList"
          >
            <ElTable
              :data="form.assetList"
              :row-class-name="tableRowClassName"
            >
              <ElTableColumn
                prop="ciName"
                label="服务器名称"
              />
              <ElTableColumn
                prop="cloudPlatformName"
                label="所属平台"
              />
              <ElTableColumn
                prop="networkArea"
                label="所属区域"
              >
                <template slot-scope="scope">
                  {{ NETWORK_AREA[scope.row.networkArea] }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="ipAddress"
                label="IP"
              />
              <ElTableColumn
                fixed="right"
                label="操作"
                width="120"
              >
                <template #default="{ row }">
                  <ElTooltip content="删除">
                    <ElButton
                      type="text"
                      :icon="'i-shanchu1 ' + STYLE.danger"
                      @click.native.prevent="deleteRow(row)"
                    />
                  </ElTooltip>
                </template>
              </ElTableColumn>
            </ElTable>

            <ElButton
              type="primary"
              style="margin-top: 20px;"
              @click="Chooser"
            >
              选择服务器
            </ElButton>
          </ElFormItem>
          <ElFormItem>
            <ElButton
              type="primary"
              @click="save"
            >
              确定
            </ElButton>

            <RouterLink
              class="el-button"
              :to="form.id ? 'app' : './'"
            >
              取消
            </RouterLink>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <!-- 按钮 -->
    <!-- <div :class="$style.fr" /> -->

    <ServiceList
      v-model="form.assetList"
      :visible.sync="relDialog"
      :own-user-id="form.ownUserId"
    />
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
// import ITable, { ElTableColumn as ITableColumn } from '@com/Table'
import ServiceList from './ServiceList'
import { getP } from '@/api/servicePlatform/productController'

import {
  addSC,
  addS,
  infoS,
  upDateS,
  upDateSC,
  Notice,
  ciUserS,
} from '@/api/servicePlatform/assetsController'

import { ciUserF } from '@/api/servicePlatform/serverAssets'
import getCode from '@/enums/code'
import { trim } from '@/pipe'

import STYLE from '@/scss/status.module.scss'
import { ROLES } from '@/enums'
import me from '@/store/user'
import clone from '@/utils/clone'

// WORK_AREA-网络区域
const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

const RULE = {
  id: 1,
  ciName: 1,
  networkArea: 1,
  cloudPlatformName: 1,
  ipAddress: 1,
}

const RULE1 = {
  assetNum: 1,
  ciCode: 1,
  ciName: 1,
  ciType: 1,
  cloudPlatform: 1,
  cloudPlatformId: 1,
  cloudPlatformName: 1,
  createDate: 1,
  createUser: 1,
  describe: 1,
  domainName: 1,
  id: 1,
  modifyDate: 1,
  modifyUser: 1,
  networkArea: 1,
  ownUserId: 1,
  ownUserName: 1,
  status: 1,
  userId: 1,
  assetList: RULE,
}

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  props: { route: { type: Object, required: true } },
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured

  components: {
    IChooser: IChooser as any, ElTable, ElTableColumn, ServiceList,
  },
  data() {
    return {
      cloudPlatform: null,
      form: {
        ciType: '系统资产',
        networkArea: null,
        assetNum: null,
        page: null,
        orderFieldType: null,
        orderField: null,
        modifyUser: null,
        modifyDate: null,
        keyword: null,
        ids: null,
        id: null,
        endTime: null,
        domainName: null,
        describe: null,
        deleteDate: null,
        delStatus: null,
        createUser: null,
        createDate: null,
        cloudPlatform: null,
        status: null,
        ciName: null,
        ciId: null,
        ciCode: null,
        assetList: null,
        beginTime: null,
        pageSize: null,
        ownUserId: null,
        cloudPlatformId: null,
        cloudPlatformName: null,
      },
      provider: [],
      isSaving: false,
      types: {},
      ciUsers: [],
      relDialog: null,
      selectionlist: [],
    }
  },
  computed: {
    ROLES: () => ROLES,
    NETWORK_AREA: () => NETWORK_AREA.value,
    STYLE: () => STYLE,
    isCustom() {
      return this.authFit(ROLES.custom)
    },
    ownUserId() {
      if (this.isCustom) {
        return me.id
      }
      return ''
    },
  },
  methods: {
    changed() {
      this.form.cloudPlatformId = this.cloudPlatform.id
      this.form.cloudPlatformName = this.cloudPlatform.providerName
    },
    // 表格颜色
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      }
      return ''
    },
    // 编辑系统资产带过来当前行数据
    async fetch(id?: string) {
      if (!id) {
        return 1
      }

      const data = (this.form = id ? (await infoS(id)).data.body || {} : {})
      this.assetList = this.form.assetList
      this.cloudPlatform = {
        id: this.form.cloudPlatformId,
        providerName: this.form.cloudPlatformName,
      }
      return (this.form = data)
    },
    // 有id编辑，没有id择是添加
    async submit(form: Notice) {
      // console.log(form)
      this.isSaving = true
      let fn
      switch (true) {
        case this.authFit(ROLES.custom):
          fn = form.id ? upDateSC : addSC
          break

        case this.authFit(ROLES.operation):
          fn = form.id ? upDateS : addS
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
    // 保存
    save() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (!valid) {
          return
        }
        !this.form.ownUserId && (this.form.ownUserId = this.ownUserId)
        const form = clone(this.form)
        this.submit(trim(form, RULE1, true))
      })
    },
    // 选择服务器弹窗

    Chooser() {
      !this.form.ownUserId && (this.form.ownUserId = this.ownUserId)
      if (this.form.ownUserId) {
        this.relDialog = true
      } else {
        this.$message.warning('请先选择所属用户')
      }

      //  这里需要判断有keyword传string 没有传‘’
    },
    select(selection: Row[]) {
      selection = trim(selection, RULE, true)
      this.form.assetList = this.assetList ? [...this.assetList, ...selection] : selection
    },
    // 删除列表中数据
    deleteRow(row) {
      this.form.assetList = this.form.assetList.filter(item => {
        return item.id !== row.id
      })
    },
    init() {
      this.form.ownUserId = this.ownUserId

      getP().then(res => {
        this.provider = res.data.body
      })

      if (this.authFit(ROLES.custom)) {
        ciUserF().then(res => {
          this.ciUsers = res.data.body || []
        })
      } else if (this.authFit(ROLES.operation)) {
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
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
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
  float: left;
  margin-left: 25%;
}
</style>
