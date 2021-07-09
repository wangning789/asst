<!-- 描述 -->
<template>
  <div
    class="el-card"
  >
    <ElRow
      type="flex"
      justify="space-between"
    >
      <h4 class="common_h4_title">
        采购记录
      </h4>
      <div>
        <ElButton
          type="text"
          :icon="`el-icon-arrow-${blockSel ? 'up' : 'down'}`"
          @click="blockSel = !blockSel"
        >
          {{ blockSel ? '隐藏' : '显示' }}筛选
        </ElButton>
        <!-- <ElButton
          v-if="authFit(ROLES.cloudService)"
          type="primary"
          size="medium"
          @click="addSupplierShow"
        >
          新建
        </ElButton> -->
      </div>
    </ElRow>

    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="blockSel"
        :inline="true"
        :label-width="CONFIG.labelWidth"
        :model="formInline"
      >
        <ElFormItem label="采购单号：">
          <ElInput
            v-model="formInline.formNo"
            clearable
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="下单客户：">
          <ElInput
            v-model="formInline.department"
            clearable
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="下单服务：">
          <ElInput
            v-model="formInline.formServices"
            clearable
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="采购单状态：">
          <ElSelect
            v-model="formInline.formStatus"
            placeholder="请选择采购单状态"
            clearable
          >
            <ElOption
              v-for="(val, key) in STATUS"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Transition>
    <!-- 渲染表格 -->
    <ITable
      ref="table"
      :get="page"
      :query="formInline"
      :head="head"
    >
      <template #prefix>
        <ElTableColumn
          prop="vendorNo"
          label="采购单号"
          width="210"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-button el-button--text"
              :to="`${route.fullPath}/${row.id}/info`"
            >
              {{ row.formNo }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>
      <ElTableColumn
        width="100"
        label="操作"
      >
        <template #default="{ row }">
          <ElTooltip
            v-if="showEdit(row)"
            content="编辑"
          >
            <RouterLink
              tag="span"
              :class="'i-bianji' + ' common_table_opt_icon common_margin_right'"
              :to="`${route.fullPath}/${row.id}/edit`"
            />
          </ElTooltip>
          <!-- 撤回      -->
          <ElTooltip
            v-if="isCloudService && row.formStatus === 'submit'"
            content="撤回"
          >
            <i
              class="i-chehui common_table_opt_icon common_margin_right"
              @click="recall(row)"
            />
          </ElTooltip>
          <ElTooltip
            content="查看"
          >
            <RouterLink
              tag="span"
              :class="'i-chakan' + ' common_table_opt_icon common_margin_right'"
              :to="`${route.fullPath}/${row.id}/info`"
            />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import {
  listReqFormByOperation,
  listReqFormByProvider,
  recall,
} from '@/api/requirement/requirement'
import { ROLES } from '@/enums'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const STATUS = {
  submit: '已提交',
  confirm: '已确认',
  sendBack: '已驳回',
  recall: '已撤回',
  read: '已读',
}

/** emit: (事件名: [参数列表 , ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn },
  data() {
    return {
      blockSel: false, // 控制筛选模块
      formInline: {
        formNo: '',
        department: '',
        formServices: '',
        formStatus: '',
      },
    }
  },
  computed: {
    STATUS: () => STATUS,
    ROLES: () => ROLES,
    isCloudService() {
      return this.authFit(ROLES.cloudService)
    },
    head: () => [
      { prop: 'department', label: '下单客户' },
      {
        prop: 'formServices',
        label: '下单服务',
        formatter: (row: any) => {
          if (row.formServices) {
            return row.formServices
          } else {
            return '-'
          }
        },
      },
      {
        prop: 'discountPrice',
        label: '金额',
        formatter: (row: any) => {
          if (row.discountPrice) {
            return `￥${row.discountPrice || 0}`
          } else {
            return '￥0'
          }
        },
      },
      { prop: 'submitTime', label: '下单时间' },
      {
        prop: 'formStatus',
        label: '采购单状态',
        formatter: (row: any) => STATUS[row.formStatus] || '-',
      },
    ],
    page() {
      switch (true) {
        case this.authFit(ROLES.cloudService):
          return listReqFormByProvider // 服务商
        case this.authFit(ROLES.commercial):
          return listReqFormByOperation // 运营
      }
      return null
    },
  },
  methods: {
    showEdit(row: any) {
      if (this.isCloudService) {
        return row.formStatus === 'recall' || row.formStatus === 'sendBack'
      } else {
        return row.formStatus === 'submit' || row.formStatus === 'read'
      }
    },
    async addSupplierShow() {
      this.$router.push(`${this.route.fullPath}/add`)
    },
    async recall(row) {
      this.$confirm('确定要撤回操作吗？', '撤回确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        recall(row.id).then(res => {
          if (!res.data.status) {
            this.$message.error(res?.data?.msg || '撤回失败')
          }
          ;(this.$refs.table as any).fetch()
        })
      })
    },
  },
}
</script>
