<!-- 筛选条件 -->
<template>
  <div>
    <h4 :class="$style.title">
      {{ title }}
    </h4>

    <div :class="$style.fr">
      <ElButton
        type="text"
        :icon="`el-icon-arrow-${showFilter ? 'up' : 'down'}`"
        @click="showFilter = !showFilter"
      >
        {{ showFilter ? '隐藏' : '显示' }}筛选
      </ElButton>
      <ElButton
        v-if="isOperation"
        size="medium"
        type="primary"
        :class="$style.ml"
        @click="newBuildWorkOrder"
      >
        新建工单
      </ElButton>
    </div>

    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="showFilter"
        inline
        :label-width="CONFIG.labelWidth"
      >
        <ElFormItem label="工单编号：">
          <ElInput
            :value="value.workOrderNo"
            clearable
            placeholder="请输入工单编号"
            @input="update('workOrderNo', $event)"
          />
        </ElFormItem>

        <ElFormItem label="工单标题：">
          <ElInput
            :value="value.workOrderName"
            clearable
            placeholder="请输入工单标题"
            @input="update('workOrderName', $event)"
          />
        </ElFormItem>

        <!-- <ElFormItem
          v-if="!authFit(ROLES.custom)"
          label="关联订单："
        >
          <ElInput
            :value="value.purchaseOrderNo"
            clearable
            placeholder="请输入关联订单"
            @input="update('purchaseOrderNo', $event)"
          />
        </ElFormItem> -->

        <!-- <ElFormItem
          v-if="!authFit(ROLES.custom)"
          label="服务名称："
        >
          <ElInput
            :value="value.securityServiceName"
            clearable
            placeholder="请输入服务名称"
            @input="update('securityServiceName', $event)"
          />
        </ElFormItem> -->

        <!-- <ElFormItem
          v-if="!authFit(ROLES.custom)"
          label="工单来源："
        >
          <ElSelect
            :value="value.sourceCode"
            clearable
            filterable
            placeholder="请选择工单来源"
            @clear="update('sourceCode', '')"
            @change="update('sourceCode', $event)"
          >
            <ElOption
              v-for="(item, index) in SOURCECODE"
              :key="index"
              :value="item.code"
              :label="item.name"
            />
          </ElSelect>
        </ElFormItem> -->

        <ElFormItem label="工单类型：">
          <ElSelect
            :value="value.typeCode"
            clearable
            filterable
            placeholder="请选择工单类型"
            @clear="update('typeCode', '')"
            @change="update('typeCode', $event)"
          >
            <ElOption
              v-for="(item, index) in TYPES"
              :key="index"
              :value="item.code"
              :label="item.name"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="数据范围：">
          <ElSelect
            :value="value.dataField"
            filterable
            placeholder="请选择数据范围"
            @change="update('dataField', $event)"
          >
            <ElOption
              v-for="(item, index) in RANGE"
              :key="index"
              :value="item.code"
              :label="item.name"
            />
          </ElSelect>
        </ElFormItem>

        <template v-if="authFit(ROLES.operation)">
          <ElFormItem label="工单级别：">
            <ElSelect
              :value="value.workLevelCode"
              clearable
              filterable
              placeholder="请选择工单级别"
              @clear="update('workLevelCode', '')"
              @change="update('workLevelCode', $event)"
            >
              <ElOption
                v-for="(item, index) in LEVELS"
                :key="index"
                :value="item.code"
                :label="item.name"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="发起人：">
            <ElSelect
              :value="value.fkUserId"
              clearable
              filterable
              placeholder="请选择发起人"
              @clear="update('fkUserId', '')"
              @change="update('fkUserId', $event)"
            >
              <!--
            remote
            :class="$style.search"s
            :loading="load"
            :remote-method="search"
            @focus="users.length || search()" -->
              <ElOption
                v-for="(item, index) in users"
                :key="index"
                :value="item.id"
                :label="item.aliasName"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="创建时间：">
            <ElDatePicker
              v-model="date"
              clearable
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :format="DATE_TIME.dateTime"
              :value-format="DATE_TIME.serverDateTime"
              @change="$emit(
                'input',
                {
                  ...value,
                  beginTime: ($event || ($event = []))[0],
                  endTime: $event[1],
                }
              )"
            />
          </ElFormItem>
        </template>
      </ElForm>
    </Transition>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
// import DepSelect from '@homeCom/admin/DepSelect'
import ElDatePicker from 'element-ui/lib/date-picker'

import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'

import { allUser } from '@/api/authServer/user'

import {
  operationserviceOperateFlow,
} from '@/api/servicePlatform/workorder'
import {
  toDetail,
} from '@/api/workflow/workflow'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
// 使用码表
const TYPES = [
  {
    code: 'DELIVER_WORK_ORDER',
    name: '交付工单',
  },
  {
    code: 'SERVICE_OPERATE_ORDER',
    name: '服务运维工单',
  },
  {
    code: 'ALARM_OPERATE_ORDER',
    name: '告警处置工单',
  },
  {
    code: 'WARN_OPERATE_ORDER',
    name: '预警处置工单',
  },
]
const LEVELS = [
  {
    code: 'COMMON_LEVEL_WORK',
    name: '一般',
  },
  {
    code: 'URGENT_LEVEL_WORK',
    name: '紧急',
  },
]
const SOURCECODE = [
  {
    code: 'LOCAL_WORK_ORDER',
    name: '本地',
  },
  {
    code: 'REMOTE_WORK_ORDER',
    name: '远程',
  },
]
// 数据范围，all-全部，todo-待办
const RANGE = [
  {
    code: 'all',
    name: '全部',
  },
  {
    code: 'todo',
    name: '待办',
  },
]

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [value]
 *  add: [] 点击新增按钮
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: Object, required: true },
    title: { type: String, default: '' },
  },
  components: { ElDatePicker },
  data() {
    return {
      showFilter: false,
      load: false,
      users: [],
      date: ['', ''],
    }
  },
  computed: {
    ROLES: () => ({ operation: ROLES.operation }),
    TYPES: () => TYPES,
    RANGE: () => RANGE,
    LEVELS: () => LEVELS,
    DATE_TIME: () => DATE_TIME,
    SOURCECODE: () => SOURCECODE,
    isOperation() {
      return this.authFit(ROLES.operation)
    },
  },
  methods: {
    newBuildWorkOrder() {
      operationserviceOperateFlow().then(res => {
        toDetail(res.data.body, '创建工单', msg => {
          msg.data === 'close' && this.$refs.table.fetch()
        })
      })
    },
    update(attr: string, value: any) {
      this.$emit('input', { ...this.value, [attr]: value || '' })
    },
    search() {
      this.load = true
      // 获取处理人列表
      allUser()
        .then(res => {
          if (res?.data?.body?.length) {
            this.users = res?.data?.body || []
          }
        })
        .finally(() => {
          this.load = false
        })
    },
    checkLevel(attr: string, value: string) {
      ;((value = value.trim()) === '' ||
        (value > 0 && +value === (value | 0))) &&
        this.update(attr, value)
    },
  },
  created() {
    this.search()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}

.search {
  width: 200px;
  min-width: 200px;
}

.ml {
  margin-left: $gapNormal / 2;
}

.fr {
  float: right;
}
</style>
