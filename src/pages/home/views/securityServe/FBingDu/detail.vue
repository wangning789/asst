<template>
  <div
    class="el-card"
  >
    <!-- 工具条 -->
    <h4 :class="$style.titleSty">
      基本信息
    </h4>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>终端名称：{{ form.terminalName }}</span>
      </ElCol>
      <ElCol :span="12">
        <span>操作系统：{{ form.operatingSystem }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="12">
        <span>IP地址：{{ form.ip }}</span>
      </ElCol>
      <ElCol :span="12">
        <span>MAC地址：{{ form.mac }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>状态：
          <em
            v-if="form.status==='1'"
            :class="$style.success"
          >在线</em>
          <em
            v-if="form.status==='0'"
            :class="$style.error"
          >离线</em>
        </span>
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
            v-if="query.pageType==='0'"
            ref="alarmLog"
            :query="softQuery"
            :get="softPage"
            :head="softHead"
          />
        </ElTabPane>

        <ElTabPane
          label="漏洞补丁"
          name="1"
        >
          <ITable
            v-if="query.pageType==='1'"
            ref="operat"
            :query="vulneQuery"
            :get="vulnList"
            :head="vulnListHead"
          />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ITable from '@com/Table'
import {
  terminalInfo,
  getSoftwareInstall,
  getPatchInstallation,
} from '@/api/servicePlatform/SecurityService'

const LEVEL = {
  0: '可选',
  1: '可选',
  2: '中等',
  3: '重要',
  4: '严重',
  5: '必须修复',
}
const TYPE = {
  0: '系统补丁',
  1: '软件补丁',
}

export default {
  props: { route: { type: Object, required: true } },
  components: { ElTabs, ElTabPane, ITable },
  data() {
    return {
      form: {},
      activeName: 'first',
      softwareArr: [],
      vulnerabilityArr: [],
      query: {
        pageType: '0',
        pageSize: 5,
        noticeStatus: 1,
      },
    }
  },
  computed: {
    softPage() {
      return getSoftwareInstall
    },
    softQuery(this: any) {
      return {
        // assetId: this.route.query.assetId,
        clientId: this.route.query.id,
      }
    },
    softHead() {
      return [
        {
          prop: 'name',
          label: '软件安装',
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
        {
          prop: 'installAddress',
          label: '安装地址',
        },
        // {
        //   prop: 'source',
        //   label: '来源',
        // },

      ]
    },
    vulneQuery() {
      return {
        clientId: this.route.query.id,
      }
    },
    vulnList() {
      return getPatchInstallation
    },

    vulnListHead() {
      return [

        {
          prop: 'name',
          label: '补丁名称',
        },
        {
          prop: 'grade',
          label: '重要性',
          formatter: (row: any) => LEVEL[row.grade],
        },
        {
          prop: 'patchType',
          label: '补丁类型',
          formatter: (row: any) => TYPE[row.patchType],
        },
        // {
        //   prop: 'releaseTime',
        //   label: '发布时间',
        // },
        {
          prop: 'patchSummary',
          label: '补丁摘要',
        },
      ]
    },
  },
  methods: {
    getTerminalInfo() {
      terminalInfo(this.route.query.id).then(res => {
        if (res.data.body) {
          this.form = res.data.body
        }
      })
    },
  },
  mounted() {
    this.getTerminalInfo()
  },

}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
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

.mtp {
  margin-top: 30px;
}

.success {
  color: #9de17b;
  font-style: normal;
}

.error {
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
</style>
