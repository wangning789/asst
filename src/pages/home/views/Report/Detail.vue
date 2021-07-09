<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <!-- 工具条 -->
    <h4 :class="$style.titleSty">
      基本信息
    </h4>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>终端名称：{{ form.name }}</span>
      </ElCol>
      <ElCol :span="12">
        <span>操作系统：{{ form.system }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>用户：{{ form.userName }} <a
          :class="$style.releUser"
          @click="relationUserCk"
        >关联用户</a></span>
      </ElCol>
      <ElCol :span="12">
        <span>IP地址：{{ form.ip }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>状态：
          <em :class="form.onlineStatus==='1' ? `${$style.install}`: `${$style.unstall}` ">
            {{ form.onlineStatus==="1"? "在线":"离线" }}</em>
        </span>
      </ElCol>
      <ElCol :span="12">
        <span>MAC地址：{{ form.mac }}</span>
      </ElCol>
    </ElRow>
    <div :class="$style.mtp">
      <ElTabs
        v-model="query.pageType"
        type="card"
      >
        <ElTabPane
          label="软件安装"
          name="0"
        >
          <ITable
            ref="table"
            :get="page1"
            :query="softQuery"
            :head="head1"
          />
        </ElTabPane>

        <ElTabPane
          label="漏洞补丁"
          name="1"
        >
          <ITable
            ref="table"
            :query="ldQuery"
            :get="page2"
            :head="head2"
          />
        </ElTabPane>
      </ElTabs>
    </div>
    <!-- 引用关联用户组件 -->
    <RelationUser
      :user-id="userId"
      :treminal-id="`${route.params.id}`"
      :visible.sync="visible"
    />
  </IChooser>
</template>
<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import { terminalDetail, softwareList, vulnList } from '@/api/servicePlatform/operat'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ITable from '@com/Table'

import RelationUser from './relationUser'

const LEVEL = {
  0: '可选',
  1: '可选',
  2: '中等',
  3: '重要',
  4: '严重',
  5: '必须修复',
}

export default {
  props: { route: { type: Object, required: true } },
  components: { IChooser: IChooser as any, ITable, ElTabs, ElTabPane, RelationUser },
  data() {
    return {
      userId: '88',
      treminalId: '',
      visible: false,
      isSaving: false,
      form: {},
      activeName: 'first',
      assetId: '',
      query: {
        pageType: '0',
        pageSize: 5,
      },
    }
  },
  computed: {
    softQuery() {
      return {
        id: this.route.params.id,
        assetId: this.assetId,
      }
    },
    ldQuery() {
      return { id: this.route.params.id }
    },
    page1() {
      return softwareList
    },
    head1() {
      return [
        {
          prop: 'name',
          label: '软件名称',

        },
        {
          prop: 'publisher',
          label: '发布者',
        },
        {
          prop: 'installTime',
          label: '安装时间',

        },
        {
          prop: 'version',
          label: '版本',
        },
        { prop: 'installAddress', label: '安装地址' },
        {
          prop: 'source',
          label: '来源',
        },
      ]
    },
    page2() {
      return vulnList
    },

    head2() {
      return [
        {
          prop: 'patchNumber',
          label: '补丁编号',
        },
        {
          prop: 'name',
          label: '补丁名称',
        },
        {
          prop: 'grade',
          label: '重要性',
          formatter: (row: any) => LEVEL[row.grade],
        },
        { prop: 'patchSummary', label: '补丁摘要' },
      ]
    },
  },
  methods: {
    async fetch(this: any, id?: string) {
      if (!id) {
        return 1
      }
      const data = (await terminalDetail({ id: id })).data.body
      this.assetId = data.assetId
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

.install {
  color: #72c64b;
  font-style: normal;
}

.unstall {
  color: #f56c6c;
  font-style: normal;
}

.rowSty {
  padding: 10px 0;
  overflow: hidden;
}

.titleSty {
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

.mtp {
  margin-top: 20px;
}
</style>
