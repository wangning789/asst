<!-- 系统日志列表 -->
<template>
  <div class="el-card">
    <!-- 筛选 -->
    <ElForm
      inline
      size="small"
    >
      <ElFormItem>
        <ElInput
          v-model="form.keyword"
          clearable
          placeholder="请输入关键字"
        />
      </ElFormItem>

      <ElFormItem>
        <ElDatePicker
          v-model="date"
          clearable
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :format="DATE_TIME.dateTime"
          :value-format="DATE_TIME.serverDateTime"
          @change="[form.startTime, form.endTime] = $event || []"
        />
      </ElFormItem>
    </ElForm>
    <!-- 列表 -->
    <ITable
      :get="page"
      :head="head"
      :query="form"
    >
      <template #prefix>
        <ElTableColumn
          prop="controller"
          label="管理员"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}`"
            >
              {{ row.controller }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ITable, { ElTableColumn } from '@com/Table'
// import IIcon from '@com/Icon'

import { page } from '@/api/authServer/log'
import formatNumber from '@/utils/formatNumber'
import { DATE_TIME } from '@/enums/format'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, ElDatePicker },
  data() {
    return {
      form: {
        keyword: '',
        startTime: '',
        endTime: '',
      },
      logCount: {},
      totalCount: '',
      date: ['', ''],
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    head() {
      return [
        { prop: 'apiName', label: '接口名' },
        { prop: 'createDate', label: '操作时间' },
        { prop: 'name', label: '操作类型' },
        { prop: 'createUser', label: '操作用户' },
        { prop: 'ip', label: 'IP地址' },
        { prop: 'path', label: '路径' },
      ]
    },
  },
  methods: {
    page: page,
    format: formatNumber,
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
