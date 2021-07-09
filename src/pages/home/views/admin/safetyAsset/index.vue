<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">
        安全中心
      </ElBreadcrumbItem>
      <ElBreadcrumbItem>安全服务</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div
      class="el-card"
      style="margin-top: 22px; padding: 15px;"
    >
      <h4 style="margin-top: 22px;">
        安全服务
      </h4>
      <ElForm
        :inline="true"
        style="margin-top: 22px;"
      >
        <ElFormItem
          :label-width="formLabelWidth"
        >
          <ElSelect
            v-model="pParams.productsTypeCode"
            placeholder="请选择类型"
            :popper-append-to-body="false"
            clearable
          >
            <ElOption
              v-for="(val, key) in USR_WORK_TYPE"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem align="center">
          <ElSelect
            v-model="pParams.dueStatus"
            placeholder="请选择是否临期"
            value-key="dueStatus"
            clearable
          >
            <ElOption
              v-for="(val,key) in {0:'否',1:'是'}"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <ITable
        ref="table"
        :get="page"
        :query="query"
        :head="head"
      >
        <template #prefix>
          <ElTableColumn
            prop="securityAssetNo"
            label="安全服务编号"
          >
            <template #default="{ row }">
              <!-- 没搞清楚 这个没有详情 云 -->
              <span
                v-if="row.productsTypeCode==='USR_CLOUD_WAF'"
              >
                {{ row.securityAssetNo }}
              </span>
              <!-- 应用防护 -->
              <RouterLink
                v-if="row.productsTypeCode==='USR_APP_PROTECTIVE'"
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/appInfo`"
              >
                {{ row.securityAssetNo }}
              </RouterLink>
              <!-- 主机 -->
              <RouterLink
                v-if="row.productsTypeCode==='USR_HOST_ANTIVIRUS'"
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/antivirusInfo`"
              >
                {{ row.securityAssetNo }}
              </RouterLink>
              <!--  漏洞扫描-->
              <RouterLink
                v-if="row.productsTypeCode==='USR_VULNERABILITY_SCAN'"
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/scanInfo`"
              >
                {{ row.securityAssetNo }}
              </RouterLink>
              <!-- 防火墙策略 防火墙业 -->
              <RouterLink
                v-if="row.productsTypeCode==='USR_FIREWALL'"
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/workInfo`"
              >
                {{ row.securityAssetNo }}
              </RouterLink>
              <!-- 防篡改 -->
              <RouterLink
                v-if="row.productsTypeCode==='USR_TAMPER_PROOFING'"
                class="el-link el-link--primary"
                :to="`${route.fullPath}/${row.id}/tamperInfo`"
              >
                {{ row.securityAssetNo }}
              </RouterLink>
            </template>
          </ElTableColumn>
        </template>
        <ElTableColumn
          v-if="authFit(ROLES.operation)"
          align="center"
          label="操作"
        >
          <template #default="{ row }">
            <ElTooltip content="设置到期时间">
              <ElButton
                type="text"
                :icon="'i-bianji ' + STYLE.primary"
                @click="setTime(row)"
              />
            </ElTooltip>

          <!--  v-model="dueTime" -->
          </template>
        </ElTableColumn>
      </ITable>

      <ElDialog
        :visible="visible"
        title="请设置到期时间"
        width="30%"
        @close="close"
      >
        请设置到期时间：
        <ElDatePicker
          v-model="dueTime"
          placeholder="设置到期时间"
          align="left"
          clearable
          type="datetime"
          :format="DATE_TIME.dateTime"
          :value-format="DATE_TIME.serverDateTime"
        />
        <template #footer>
          <ElButton
            type="primary"
            :loading="loading"
            @click="loading || bind()"
          >
            确定
          </ElButton>

          <ElButton @click="close">
            取消
          </ElButton>
        </template>
      </ElDialog>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import STYLE from '@/scss/status.module.scss'
import { ROLES } from '@/enums'
import ITable, { ElTableColumn } from '@com/Table'
import ElBreadcrumb from 'element-ui/lib/breadcrumb'
import ElBreadcrumbItem from 'element-ui/lib/breadcrumb-item'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import { DATE_TIME } from '@/enums/format'
import { customerPage, maintainPage, updTime } from '@/api/servicePlatform/safetyAsset'
import getCode from '@/enums/code'

// USR_WORK_TYPE-设备类型
const USR_WORK_TYPE = getCode('1', 'USR_WORK_TYPE')
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, ElDatePicker, ElBreadcrumb, ElBreadcrumbItem },
  data() {
    return {
      loading: false,
      pParams: {
        // page: 1,
        // pageSize: 5,
        productsTypeName: '',
        dueStatus: '',
      },
      formLabelWidth: '120px',
      pickId: '',
      visible: false,
      dueTime: '',
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    STYLE: () => STYLE,
    USR_WORK_TYPE: () => USR_WORK_TYPE.value,
    query(this: any) {
      return this.pParams
    },
    ROLES: () => ({ operation: ROLES.operation }),
    page() {
      switch (true) {
        case this.authFit(ROLES.custom):
          return customerPage
        case this.authFit(ROLES.operation):
          return maintainPage
        default:
          return null
      }
    },
    head() {
      return [
        { prop: 'securityAssetName', label: '安全资产名称' },
        { prop: 'productsTypeName', label: '类型' },
        {
          prop: 'orderBeginTime',
          label: '购买时间',
        },
        {
          prop: 'dueTime',
          label: '到期时间',
          formatter: (row: any, col: any, cell: boolean) => this.$createElement('span', {
            class: row.dueStatus === '0' ? '' : STYLE.danger,
          },
          cell && row.dueTime
          ),
        },
      ]
    },
  },
  methods: {
    setTime(row) {
      this.visible = true
      this.pickId = row.id
    },

    close() {
      this.dueTime = ''
      this.visible = false
    },
    bind() {
      try {
        updTime(this.pickId, this.dueTime)
          .then(() => {
            ;(this.$refs.table as any).fetch()
            this.close()
          })
          .finally(() => {
            this.loading = false
          })
        this.loading = true
      } catch (error) {
        this.$message.warning(error.message || '发生错误，请稍后重试')
      }
    },
    // change() {
    //   console.log(row.dueTime, row.id, '88888888888888888888888')
    //   // updTime(row.dueTime, row.id).then()
    // },
  },

}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
@import '~element-ui/packages/theme-chalk/src/breadcrumb';
@import '~element-ui/packages/theme-chalk/src/breadcrumb-item';
</style>

<style lang="scss" module>

.wrapper {
  padding: 0;

  h4 {
    margin: $gapNormal / 2 0;
    color: $colorTextMain;
    font-size: $larger;

    &:first-of-type {
      margin-top: 0;
    }
  }

  label {
    display: inline-block;
    width: 125px - $gapNormal / 2;
    margin: $gapNormal / 2 0;
    padding-right: $gapNormal / 2;
    text-align: right;
  }
}
</style>
