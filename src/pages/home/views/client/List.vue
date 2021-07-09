<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    <!-- Top -->
    <ElRow
      type="flex"
      justify="space-between"
    >
      <!-- 1 -->
      <ElCol
        :span="4"
        class="el-card"
      >
        <ElRow
          type="flex"
          align="middle"
          :class="$style.topHight"
        >
          <ElCol
            :span="8"
            :class="$style.myIcon"
          >
            <IIcon
              icon="i-khgl"
              size="40px"
            />
          </ElCol>
          <ElCol :span="8">
            <p>客户总数</p>
            <h3>{{ count.customerCount }}</h3>
          </ElCol>
        </ElRow>
      </ElCol>
      <!-- 2 -->
      <ElCol
        :span="4"
        class="el-card"
      >
        <ElRow
          type="flex"
          align="middle"
          :class="$style.topHight"
        >
          <ElCol
            :span="8"
            :class="$style.myIcon"
          >
            <IIcon
              icon="i-zdkh"
              size="40px"
            />
          </ElCol>
          <ElCol :span="8">
            <p>重点客户</p>
            <h3>{{ count.keyCount }}</h3>
          </ElCol>
        </ElRow>
      </ElCol>
      <!-- 3 -->
      <ElCol
        :span="4"
        class="el-card"
      >
        <ElRow
          type="flex"
          align="middle"
          :class="$style.topHight"
        >
          <ElCol
            :span="8"
            :class="$style.myIcon"
          >
            <IIcon
              icon="i-byxzkh"
              size="40px"
            />
          </ElCol>
          <ElCol :span="8">
            <p>本月新增客户</p>
            <h3>{{ count.monthNewCount }}</h3>
          </ElCol>
        </ElRow>
      </ElCol>
      <!-- 4 -->
      <ElCol
        :span="4"
        class="el-card"
      >
        <ElRow
          type="flex"
          align="middle"
          :class="$style.topHight"
        >
          <ElCol
            :span="8"
            :class="$style.myIcon"
          >
            <IIcon
              icon="i-lqkh"
              size="40px"
            />
          </ElCol>
          <ElCol :span="8">
            <p>临期客户</p>
            <h3>{{ count.dueCount }}</h3>
          </ElCol>
        </ElRow>
      </ElCol>
      <!-- 5 -->
      <ElCol
        :span="4"
        class="el-card"
      >
        <ElRow
          type="flex"
          align="middle"
          :class="$style.topHight"
        >
          <ElCol
            :span="8"
            :class="$style.myIcon"
          >
            <IIcon
              icon="i-wqykh"
              size="40px"
            />
          </ElCol>
          <ElCol :span="8">
            <p>未签约客户</p>
            <h3>{{ count.noSignCount }}</h3>
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>

    <!-- content -->
    <div
      class="el-card"
      :class="$style.clearMag"
    >
      <!-- 客户列表+按钮 -->
      <ElRow
        type="flex"
        justify="space-between"
        align="middle"
      >
        <h4 class="common_h4_title">
          客户列表
        </h4>
        <div>
          <ElButton
            type="text"
            :icon="`el-icon-arrow-${blockSel ? 'up' : 'down'}`"
            @click="blockSel = !blockSel"
          >
            {{ blockSel ? '隐藏' : '显示' }}筛选
          </ElButton>
          <RouterLink
            class="el-button el-button--medium el-button--primary"
            :to="`${route.fullPath}/add`"
          >
            新建
          </RouterLink>
        </div>
      </ElRow>
      <!-- 筛选表单 -->
      <Transition
        name="fold"
        mode="out-in"
      >
        <ElForm
          v-show="blockSel"
          inline
          :model="filterForm"
          :label-width="CONFIG.labelWidth"
        >
          <!-- 第一行 -->
          <ElFormItem label="客户编号：">
            <ElInput
              v-model="filterForm.customerNo"
              clearable
              placeholder="请输入"
            />
          </ElFormItem>

          <ElFormItem label="客户联系人：">
            <ElInput
              v-model="filterForm.contacts"
              clearable
              placeholder="请输入"
            />
          </ElFormItem>

          <!-- 第二行 -->
          <ElFormItem label="客户单位：">
            <ElInput
              v-model="filterForm.department"
              clearable
              placeholder="请输入"
            />
          </ElFormItem>

          <ElFormItem label="是否重点客户：">
            <ElSelect
              v-model="filterForm.keyStatus"
              clearable
              placeholder="请选择"
            >
              <ElOption
                v-for="item in booleanOption"
                :key="item.value"
                :class="$style.sel"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="是否已签约：">
            <ElSelect
              v-model="filterForm.signStatus"
              clearable
              placeholder="请选择"
            >
              <ElOption
                v-for="item in booleanOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </Transition>

      <!-- 渲染表格 -->
      <ElRow>
        <ITable
          ref="table"
          :get="page"
          :query="filterForm"
          :head="head"
        >
          <template #prefix>
            <ElTableColumn
              prop="customerNo"
              label="客户编号"
              width="220"
            >
              <template #default="{ row }">
                <RouterLink
                  class="el-link el-link--primary"
                  :to="`${route.fullPath}/${row.id}/info`"
                >
                  {{ row.customerNo }}
                </RouterLink>
              </template>
            </ElTableColumn>
          </template>
          <ElTableColumn
            fixed="right"
            label="操作"
            width="120"
          >
            <template #default="{ row }">
              <RouterLink
                tag="span"
                class="i-bianji common_table_opt_icon common_margin_right"
                :to="`${route.fullPath}/${row.id}/edit`"
              />
              <i
                class="i-shanchu1 common_table_opt_icon common_margin_right"
                @click="del(row)"
              />
              <i
                class="i-fenpeifuzeren common_table_opt_icon"
                @click="open(row)"
              />
            </template>
          </ElTableColumn>
        </ITable>
      </ElRow>
    </div>

    <!-- 分配弹框 -->
    <ElDialog
      title="分配"
      width="30%"
      :visible.sync="visible"
    >
      <ElForm
        ref="distributeForm"
        v-loading="isSave"
        :model="form"
      >
        <ElFormItem
          label="请分配销售人员："
          label-width="150px"
          prop="sellMan"
          :rules="{ required: true, message: '请选择销售人员',trigger: 'change' }"
        >
          <ElSelect
            v-model="form.sellMan"
            clearable
            value-key="id"
            placeholder="请选择"
            :popper-append-to-body="false"
            :class="$style.selectFix"
          >
            <!-- @change="sellChange" -->
            <ElOption
              v-for="item in sellMan"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="请分配云服务商："
          label-width="150px"
          prop="provider"
          :rules="{ required: true, message: '请选择云服务商',trigger: 'change' }"
        >
          <ElSelect
            v-model="form.provider"
            multiple
            clearable
            value-key="id"
            placeholder="请选择"
            :popper-append-to-body="false"
            :class="$style.selectFix"
          >
            <ElOption
              v-for="item in provider"
              :key="item.id"
              :label="item.providerName"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton
          type="primary"
          @click="distribute"
        >
          确定
        </ElButton>

        <ElButton @click="visible = false">
          取消
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import { trim } from '@/pipe'
import IIcon from '@com/Icon'
import {
  selectCountByRun,
  selectListByRun,
  getProvider,
  delClient,
  allocationSellMan,
  allocationProvider,
  selectListByProvider,
  selectCountByProvider,
  selectListBySell,
  selectCountBySellMan,
} from '@/api/sell/client'
import { getSellMan } from '@/api/authServer/user'
import clone from '@/utils/clone'
import { ROLES } from '@/enums'
// import clientIcon from '@home/assets/svg/client'
import STYLE from '@/scss/status.module.scss'
import formatNumber from '../../../../utils/formatNumber'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const whiteList = [
  'id',
  'customerNo',
  'department',
  'contacts',
  'phone',
  'keyStatus',
  'sellMan',
  'provider',
  'note',
  'modifyDate',
  'createDate',
]
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, IIcon },
  data() {
    return {
      blockSel: false,
      count: {}, // top客户数
      isSave: false,
      // 筛选数据
      filterForm: {
        customerNo: '', // 客户编号
        contacts: '', // 客户联系人
        keyStatus: '', // 是否为重点客户
        phone: '', // 联系方式
        department: '', // 客户单位
        signStatus: '', // 是否为已签约客户
      },
      visible: false, // 控制弹框显示
      form: {},
      // 两个下拉框的值
      sellMan: [],
      provider: [],
    }
  },
  computed: {
    // 根据权限请求列表
    page() {
      switch (true) {
        case this.authFit(ROLES.cloudService):
          return selectListByProvider // 云服务商
        case this.authFit(ROLES.sales):
          return selectListBySell // 销售
        case this.authFit(ROLES.commercial):
          return selectListByRun // 运营
        default:
          return () => Promise.resolve()
      }
    },
    // 根据权限请求统计
    getCount() {
      switch (true) {
        case this.authFit(ROLES.cloudService):
          return selectCountByProvider // 云服务商
        case this.authFit(ROLES.sales):
          return selectCountBySellMan // 销售
        case this.authFit(ROLES.commercial):
          return selectCountByRun // 运营
        default:
          return () => Promise.resolve()
      }
    },
    head() {
      return [
        { prop: 'department', label: '客户单位' },
        { prop: 'contacts', label: '客户联系人' },
        { prop: 'phone', label: '联系方式' },
        {
          prop: 'signStatus',
          label: '是否签约',
          formatter: (row: any, col: any, cell: boolean) => this.$createElement('span', {
            class: cell ? `${STYLE.success}` : STYLE.danger,
          },
          cell && row.orderPrice ? '是' : '否'
          ),
        },
        {
          prop: 'orderPrice',
          label: '已签约金额(元)',
          formatter: (row: any) => this.$createElement('span',
            `￥${formatNumber(row.orderPrice, 2)} `
          ),
        },
        { prop: 'productCount', label: '已购安全服务数' },
        {
          prop: 'keyStatus',
          label: '是否为重点客户',
          formatter: (row: any, col: any, cell: boolean) => this.$createElement('span', {
            class: cell ? STYLE.success : STYLE.danger,
          }, cell ? '是' : '否'),
        },
        {
          prop: 'expireTime',
          label: '最近安全服务到期时间',
          width: '200',
        },
      ]
    },
    booleanOption: () => [
      {
        value: 1,
        label: '是',
      },
      {
        value: 0,
        label: '否',
      },
    ],

  },
  methods: {

    // 删除
    async del(row: object) {
      const id = row.id
      await this.$confirm(
        `此操作不可逆, 确定要删除客户编号为【${row.customerNo}】的客户？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      delClient(id).then(res => {
        if (res.data.status) {
          this.$notify.warning('删除客户成功')
        }
      })
      this.$refs.table.fetch()
    },
    // 打开分配弹框
    open(row: object) {
      this.visible = true
      this.form = trim(row, whiteList)
      this.form.sellMan = this.form.sellMan[0]
    },
    // 分配
    distribute() {
      ;(this.$refs.distributeForm as any).validate((valid?: boolean) => {
        if (valid) {
          this.isSave = true
          const newForm = clone(this.form)
          newForm.sellMan = [newForm.sellMan]
          // 顺序
          allocationProvider(newForm)
            .then(() => allocationSellMan(newForm))
            .then(() => {
              this.$notify.success('分配成功')
              this.visible = false
              this.refresh()
            })
        }
      })
    },
  },
  created() {
    this.getCount().then(res => {
      this.count = res.data.body
    })
    // 请求云服务商信息
    getProvider().then(res => {
      this.provider = res.data.body
    })
    // 请求销售负责人信息
    getSellMan().then(res => {
      // console.log(res)
      this.sellMan = res.data.body
    })
  },
}
</script>

<style lang="scss" module>
.topHight {
  height: 116px;
  background-image: url('~@/assets/card.png');
  background-repeat: no-repeat;
  background-position: 120px 40px;
}

.myIcon {
  font-size: $xxxLarge;
  text-align: center;
}

.clearMag {
  margin: $gapNormal 0 0 !important;
  padding: $gapNormal;
}

.link {
  margin-right: $gapNormal;
}

.selectFix {
  display: block !important;
}
</style>
