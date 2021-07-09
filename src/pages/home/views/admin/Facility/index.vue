<!-- 安全设备 -->
<template>
  <div class="el-card">
    <h4 class="common_h4_title">
      {{ route.meta.title }}
    </h4>

    <div :class="$style.fr">
      <ElButton
        v-if="authFit(ROLES.operation)"
        type="primary"
        @click="addition"
      >
        新增
      </ElButton>
    </div>
    <!-- 列表 -->
    <ITable
      ref="table"
      :get="getPage"
      :head="head"
      :query="form"
    >
      <template #prefix>
        <ElTableColumn
          align="center"
          prop="name"
          label="设备名称"
        >
          <template #default="{ row }">
            <!-- 查询详情跳转-->
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}`"
            >
              {{ row.name }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>
      <ElTableColumn
        v-if="authFit(ROLES.operation)"
        align="center"
        label="操作"
        width="230"
      >
        <template #default="{ row }">
          <ElTooltip content="关联">
            <ElButton
              type="text"
              icon="el-icon-connection"
              @click="relUser(row)"
            />
          </ElTooltip>
          <ElTooltip content="编辑">
            <ElButton
              type="text"
              :icon="'i-bianji ' + STYLE.primary"
              @click="alter(row, editForm)"
            />
          </ElTooltip>
          <ElTooltip content="删除">
            <ElButton
              type="text"
              :icon="'i-shanchu1 ' + STYLE.danger"
              @click="remove(row)"
            />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ITable>
    <!-- 弹框 -->
    <ElDialog
      class="demo-ruleForm"
      :title="type1 === 1 ? '新增安全设备' : '编辑安全设备'"
      :visible.sync="dialogFormVisible"
    >
      <ElForm
        ref="editForm"
        :model="editForm"
        :rules="rules"
      >
        <ElFormItem
          label="设备厂商"
          prop="vendor"
          :label-width="formLabelWidth"
        >
          <ElSelect
            v-model="editForm.vendor"
            placeholder="请选择设备厂商"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="(val, key) in VENDOR"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="设备类型"
          prop="typeCode"
          :label-width="formLabelWidth"
        >
          <ElSelect
            v-model="editForm.typeCode"
            placeholder="请选择设备类型"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="(val, key) in USR_WORK_TYPE"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="API版本"
          prop="version"
          :label-width="formLabelWidth"
        >
          <ElSelect
            v-model="editForm.version"
            placeholder="请选择API版本"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="(val, key) in DEVICE_VERSION"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>

        <!-- 接口请求拿数据 -->
        <ElFormItem
          label="部署云平台"
          prop="providerName"
          :label-width="formLabelWidth"
        >
          <ElSelect
            v-model="editForm.providerName"
            placeholder="请选择部署云平台"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="item in provider"
              :key="item.id"
              :label="item.providerName"
              :value="item.providerName"
            />
          </ElSelect>
        </ElFormItem>
        <!--  网络区域-->
        <ElFormItem
          label="网络区域"
          prop="networkArea"
          :label-width="formLabelWidth"
        >
          <ElSelect
            v-model="editForm.networkArea"
            placeholder="请选择网络区域"
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

        <ElFormItem
          label="设备名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <ElInput
            v-model="editForm.name"
            autocomplete="off"
          />
        </ElFormItem>
        <ElFormItem
          label="管理IP"
          prop="ip"
          :label-width="formLabelWidth"
        >
          <ElInput
            v-model="editForm.ip"
            autocomplete="off"
          />
        </ElFormItem>
        <ElFormItem
          label="管理端口"
          prop="port"
          :label-width="formLabelWidth"
        >
          <ElInput
            v-model="editForm.port"
            autocomplete="off"
          />
        </ElFormItem>
        <ElFormItem
          label="认证用户名"
          prop="username"
          :label-width="formLabelWidth"
        >
          <ElInput
            v-model="editForm.username"
            autocomplete="off"
          />
        </ElFormItem>
        <ElFormItem
          label="密码"
          prop="password"
          :label-width="formLabelWidth"
        >
          <ElInput
            v-model="editForm.password"
            autocomplete="off"
          />
        </ElFormItem>
      </ElForm>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          type="primary"
          @click="save"
        >
          确 定
        </ElButton>
        <ElButton @click="dialogFormVisible = false">
          取 消
        </ElButton>
      </div>
    </ElDialog>
    <!-- 关联多选 -->
    <ElDialog
      title="请选择关联用户"
      :visible.sync="relDialog"
    >
      <ElForm
        ref="relForm"
        :rules="ruleRel"
        :model="relForm"
      >
        <ElFormItem
          label="关联用户："
          prop="ids"
          label-width="120px"
        >
          <ElSelect
            v-model="relForm.ids"
            placeholder="请选择关联用户"
            :popper-append-to-body="false"
            multiple
          >
            <ElOption
              v-for="(item,index) in getrelMan"
              :key="index"
              :label="item.department"
              :value="item.userId"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          type="primary"
          @click="sure"
        >
          确 定
        </ElButton>
        <ElButton @click="resetForm">
          取 消
        </ElButton>
        <!-- save -->
      </div>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import { ROLES } from '@/enums'
import { page, add, edit, dele, rel, det, all } from '@/api/maintance/facility'
import { getP } from '@/api/servicePlatform/productController'
import formatNumber from '@/utils/formatNumber'
import { DATE_TIME } from '@/enums/format'
// import { local } from '@/utils/storage'
// import { allUser } from '@/api/authServer/user'
import STYLE from '@/scss/status.module.scss'

import getCode from '@/enums/code'
// WORK_AREA-网络区域
const NETWORK_AREA = getCode('1', 'NETWORK_AREA')
// USR_WORK_TYPE-设备类型
const USR_WORK_TYPE = getCode('1', 'USR_WORK_TYPE')
// VENDOR-设备厂商
const VENDOR = getCode('1', 'VENDOR')
// DEVICE_VERSION-api版本
const DEVICE_VERSION = getCode('1', 'DEVICE_VERSION')

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn },
  data() {
    const validIp = (rule, value, callback) => {
      const reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      if (!reg.test(value)) {
        callback(new Error('请填写正确IP'))
      }
      callback()
    }

    const validPort = (rule, value, callback) => {
      const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if (!reg.test(value)) {
        callback(new Error('请填写正确IP'))
      }
      callback()
    }
    return {
      // typeCode: null,
      form: {
        keyword: '',
        startTime: '',
        endTime: '',
      },
      relDialog: false,
      getrelMan: [],
      provider: [],
      relForm: {
        ids: [],
        id: '',
      },
      // ruleForm: {
      //   region: '',
      // },
      editForm: {
        vendor: '',
        typeCode: '',
        version: '',
        name: '',
        providerName: '',
        ip: '',
        port: '',
        username: '',
        password: '',
        networkArea: '',
      },
      rules: {
        vendor: [
          { required: true, message: '请选择设备厂商', trigger: 'change' },
        ],
        typeCode: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        version: [
          { required: true, message: '请选择API版本', trigger: 'change' },
        ],
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        providerName: [
          { required: true, message: '请选择部署云平台', trigger: 'change' },
        ],
        ip: [{ required: true, message: '请输入管理IP', trigger: 'blur' },
          { validator: validIp, trigger: 'blur' }],
        port: [{ required: true, message: '请输入管理端口', trigger: 'blur' },
          { validator: validPort, trigger: 'blur' }],
        username: [
          { required: true, message: '请输入认证用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        networkArea: [
          { required: true, message: '请输入网络区域', trigger: 'change' },
        ],

      },
      ruleRel: {
        ids: [
          { required: true, message: '请选择关联用户', trigger: 'change' },
        ],
      },
      logCount: {},
      totalCount: '',
      date: ['', ''],
      dialogFormVisible: false,
      type1: 0,
      formLabelWidth: '120px',
    }
  },
  computed: {
    ROLES: () => ({ operation: ROLES.operation }),
    STYLE: () => STYLE,
    DATE_TIME: () => DATE_TIME,
    head() {
      return [
        { prop: 'vendorName', label: '设备厂商' },
        { prop: 'typeName', label: '设备类型' },
        { prop: 'versionName', label: 'API版本' },
        // { prop: 'name', label: '设备名称' },
        { prop: 'providerName', label: '部署云平台' },
        { prop: 'ip', label: '管理IP' },
        { prop: 'port', label: '管理端口' },
        { prop: 'username', label: '认证用户名' },
        { prop: 'networkAreaName', label: '网络区域' },
      ]
    },
    NETWORK_AREA: () => NETWORK_AREA.value,
    USR_WORK_TYPE: () => USR_WORK_TYPE.value,
    VENDOR: () => VENDOR.value,
    DEVICE_VERSION: () => DEVICE_VERSION.value,
  },
  methods: {
    getPage: page,
    format: formatNumber,
    // 新增
    addition() {
      this.dialogFormVisible = true
      this.type1 = 1
      getP().then(res => {
        this.provider = res.data.body
      })
      this.editForm = {
        vendorName: '',
        typeName: '',
        // typeCode: '',
        versionName: '',
        name: '',
        providerName: '',
        ip: '',
        port: '',
        username: '',
        password: '',
        networkAreaName: '',
      }
    },
    // 修改
    alter(row) {
      det(row.id).then(res => {
        this.editForm.password = res.data.body.password
      })
      this.dialogFormVisible = true
      this.type1 = 0
      this.editForm = Object.assign({}, row)
      // this.typeCode = rsow.typeCode
      getP(row.id, row.ids).then(res => {
        this.provider = res.data.body
      })
    },
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.type1 === 0) {
            edit(this.editForm).then(() => (this.$refs.table as any).fetch())
          } else {
            //  新增
            // this.editForm.typeCode = this.typeCode
            add(this.editForm).then(() => (this.$refs.table as any).fetch())
          }
        } else {
          return false
        }
        this.dialogFormVisible = false
      })
    },

    // 删除
    remove({ id }: code) {
      id &&
        this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(() => {
          dele(id).then(() => (this.$refs.table as any).fetch())
        })
    },

    // 关联
    relUser(row) {
      det(row.id).then(res => {
        if (res.data.body.relUsers) {
          const tem = res.data.body.relUsers.map(item => item.id)
          this.relForm.ids = tem
        }
      })
      this.relDialog = true
      this.relForm.id = row.id
      all()
        .then(res => {
          if (res?.data?.body?.length) {
            this.getrelMan = res?.data?.body || []
          }
        })
        .finally(() => {
          this.load = false
        })
    },
    // 确认关联

    sure() {
      const param = this.relForm
      this.$refs.relForm.validate((valid) => {
        if (valid) {
          rel(param)
          this.relDialog = false
        } else {
          return false
        }
      })
    },
    // 取消
    resetForm() {
      this.$refs.relForm.resetFields()
      this.relDialog = false
    },
  },

}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.fr {
  float: right;
}
</style>
