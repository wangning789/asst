<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <!-- 工具条 -->
    <h4 :class="[$style.titleSty,$style.bar]">
      基本信息
    </h4>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>用户：{{ form.userName }} <a
          :class="$style.releUser"
          @click="relationUserCk"
        >关联用户</a></span>
      </ElCol>
      <ElCol :span="12">
        <span>云平台：{{ form.regionName }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>设备名称：{{ form.deviceName }} </span>
      </ElCol>
      <ElCol :span="12">
        <span>网络区域：{{ form.networkArea }}</span>
      </ElCol>
    </ElRow>

    <!-- 工具条 -->
    <h4 :class="[$style.titleSty,$style.bar]">
      漏扫任务信息
    </h4>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>任务名称：{{ form.name }}</span>
      </ElCol>
      <ElCol :span="12">
        <span>任务编号：{{ form.taskNo }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>最近漏洞扫描时间：{{ form.lastScantime }} </span>
      </ElCol>
      <ElCol :span="12">
        <span :class="$style.stateSty">
          最近漏洞扫描状态：
          <em v-if="form.status === '0'">等待扫描</em>
          <em v-else-if="form.status === '2'">正在扫描</em>
          <em v-else-if="form.status === '5'">扫描暂停</em>
          <em v-else-if="form.status === '4'">扫描完成</em>
          <em v-else>异常停止</em>
        </span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>扫描模板：{{ form.templateName }}</span>
      </ElCol>
    </ElRow>

    <h4 :class="[$style.titleSty,$style.bar]">
      漏扫任务结果
    </h4>
    <!-- 筛选表单 -->
    <div :class="$style.mtp1">
      <Transition
        name="fold"
        mode="out-in"
      >
        <ElForm
          :inline="true"
        >
          <ElFormItem>
            <ElInput
              v-model="params.assetName"
              clearable
              placeholder="请输入资产名称、IP"
            />
          </ElFormItem>
        </ElForm>
      </Transition>
    </div>
    <ITable
      ref="table"
      :get="page"
      :query="vquery"
      :head="head"
    />

    <!-- 引用关联用户组件 -->
    <RelationUser
      :vuln-id="vulnId"
      :visible.sync="visible"
    />
  </IChooser>
</template>
<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import { vulnTask, scanningList } from '@/api/servicePlatform/operat'

import ITable from '@com/Table'
import RelationUser from './relationUser'
export default {
  props: { route: { type: Object, required: true } },
  components: { IChooser: IChooser as any, ITable, RelationUser },
  data() {
    return {
      isSaving: false,
      form: {},
      activeName: 'first',
      visible: false,
      vulnId: '',
      query: { pageType: '0', pageSize: 5, noticeStatus: 1 },
      params: {
        assetName: '',
        id: this.route.params.id,
      },
    }
  },
  computed: {
    page() {
      return scanningList
    },
    vquery() {
      return this.params
    },
    head() {
      return [
        {
          prop: 'vulnName',
          label: '漏洞名称',

        },
        {
          prop: 'vulnType',
          label: '漏洞类型',

        },
        {
          prop: 'severity',
          label: '漏洞级别',

        },
        {
          prop: 'ip',
          label: 'IP',

        },

        {
          prop: 'assetName',
          label: '资产名称',
        },
      ]
    },
    showStatus(val) {
      switch (val) {
        case 0:
          return '等待扫描'
        case 2:
          return '正在扫描'
        case 5:
          return '扫描暂停'
        case 4:
          return '扫描完成'
        default:
          return '异常停止'
      }
    },
  },
  methods: {
    async fetch(this: any, id?: string) {
      if (!id) {
        return 1
      }
      const data = (await vulnTask({ id: id })).data.body
      this.vulnId = data.id
      return (this.form = data)
    },
    // 点击关联用户展示弹窗
    relationUserCk() {
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang="scss" module>
.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;

  > h4 {
    display: inline-block;
    margin: 0 0 $gapNormal / 2 0;
    font-size: $larger;
  }

  :global(.el-button--text) {
    padding-top: 0;
    color: $colorTextCommon;

    &:hover {
      color: $colorTheme;
    }
  }
}

.stateSty {
  em {
    font-style: normal;
  }
}

.rowSty {
  padding: 10px 0;
  overflow: hidden;
}

.titleSty {
  padding-bottom: 12px;
  font-weight: 700;
  font-size: 18px;
  text-align: left;
}

.releUser {
  display: inline-block;
  margin-left: 12px;
  color: #379efe;
  text-decoration: underline;
  cursor: pointer;
}
</style>
