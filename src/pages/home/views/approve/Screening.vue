<!-- 审批筛选 -->
<template>
  <!-- <IChooser :fetch="fetch" :args="args" >jj</IChooser> -->
  <div class="el-card">
    <ElRow
      type="flex"
      justify="space-between"
    >
      <h4 class="common_h4_title">
        审批管理
      </h4>
      <div>
        <ElButton
          type="text"
          :icon="`el-icon-arrow-${blockSel ? 'up' : 'down'}`"
          @click="blockSel = !blockSel"
        >
          {{ blockSel ? '隐藏' : '显示' }}筛选
        </ElButton>
      </div>
    </ElRow>
    <!-- 筛选 -->
    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="blockSel"
        inline
        :model="formInline"
      >
        <ElFormItem label="审批编号：">
          <ElInput
            v-model="formInline.examinationNo"
            placeholder="请输入审批编号"
            clearable
            maxlength="60"
          />
        </ElFormItem>
        <ElFormItem label="审批主题：">
          <ElSelect
            v-model="formInline.examinationTheme"
            placeholder="请选择审批主题"
            clearable
          >
            <ElOption
              v-for="item in examinationThemes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="申请人：">
          <ElInput
            v-model="formInline.applicantName"
            placeholder="请输入申请人"
            clearable
          />
        </ElFormItem>
        <ElFormItem label="状态：">
          <ElSelect
            v-model="formInline.examinationStatus"
            placeholder="请选择状态"
            clearable
          >
            <ElOption
              v-for="item in STATUS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Transition>
    <!-- 数据列表 -->
    <IList
      :route="route"
      :query="formInline"
    />
  </div>
</template>

<script lang="ts">
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
// import CONFIG from '@/config/index'
import { THEME, STATUS } from '@/enums/approve'
import IList from './List'

export default {
  props: { route: { type: Object, required: true } },
  components: {
    IList,
  },
  data() {
    return {
      blockSel: false, // 控制筛选模块
      formInline: {
        examinationNo: '',
        examinationTheme: '',
        applicantName: '',
        examinationStatus: '',
      },
    }
  },
  computed: {
    examinationThemes: () => {
      const data = []
      for (const key in THEME) {
        data.push({
          value: key,
          label: THEME[key],
        })
      }
      return data
    },
    STATUS: () => {
      const data = []
      for (const key in STATUS) {
        data.push({
          value: key,
          label: STATUS[key],
        })
      }
      return data
    },
  },
}
</script>

<style lang="scss" module>
.form {
  min-width: 300px;
  max-width: 435px;
}

.marginbox {
  text-align: center;
}
</style>
