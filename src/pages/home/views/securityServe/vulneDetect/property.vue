<template>
  <div :class="$style.blkBox">
    <!-- 工具条 -->
    <!-- <h3 :class="$style.titleSty">
      资产漏洞情况
    </h3> -->
    <h4 :class="[$style.titleSty,$style.bar]">
      基本信息
    </h4>
    <ElRow :class="$style.rowSty">
      <ElCol :span="6">
        <span>IP：{{ route.params.ip }}</span>
      </ElCol>
      <ElCol :span="6">
        <span>资产名称：{{ route.params.name }}</span>
      </ElCol>
      <ElCol :span="6">
        <span>云平台：{{ route.params.cloudPlatformName }}</span>
      </ElCol>
      <ElCol :span="6">
        <span>网络区域：{{ route.params.networkArea }}</span>
      </ElCol>
    </ElRow>
    <h4 :class="[$style.titleSty,$style.bar,$style.mtp]">
      漏洞扫描详情
    </h4>
    <ElRow :class="$style.rowSty">
      <ElCol
        :span="16"
        :class="$style.ldNum"
      >
        <p>
          <span :class="$style.tt">漏洞总数</span><br>
          <b>{{ notFixedTotalCount }}</b>
        </p>

        <div :class="$style.gBarBox">
          <GressBar
            :high-data="notFixedhighCount"
            :mld-data="notFixedMediumCount"
            :low-data="notFixedLowRiskCount "
          />
        </div>
      </ElCol>
      <ElCol :span="8">
        <p>最新配漏洞扫描时间：{{ jcFrom.lastVulnerabilityScanTime }} </p>
      </ElCol>
    </ElRow>

    <!-- 筛选表单 -->
    <div :class="$style.mtp1">
      <ElForm
        :inline="true"
      >
        <ElFormItem>
          <ElSelect
            v-model="params.grade"
            placeholder="漏洞等级"
            clearable
            value-key="item.label"
          >
            <ElOption
              v-for="item in gradeObjects"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElInput
            v-model="params.keyword"
            clearable
            placeholder="请输入漏洞名称或编号"
          />
        </ElFormItem>
      </ElForm>
    </div>

    <ElRow>
      <ITable
        ref="table"
        :get="page"
        :query="query"
        :head="head"
      >
        <!-- <ElTableColumn
          label="操作"
          width="280px"
        >
          <template #default="{ row }">
            <ElTooltip content="查看详情">
              <ElButton
                type="text"
                :icon="'i-chakan ' + STYLE.primary"
                @click="PDetail(row)"
              />
            </ElTooltip>
          </template>
        </ElTableColumn> -->
      </ITable>
    </ElRow>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import {
  alreadyAssetDetailsPage,
  securityServiceInfo,
} from '@/api/servicePlatform/SecurityService'
// import ElTableColumn from 'element-ui/lib/table-column'
import ITable from '@com/Table'
import STYLE from '@/scss/status.module.scss'
import GressBar from '../common/progressBar'
export default {
  props: { route: { type: Object, required: true } },
  components: { ITable, GressBar },
  data() {
    return {
      userId: '88',
      treminalId: '',
      ldVisible: false,
      isSaving: false,
      jcFrom: {},
      form: {},
      activeName: 'first',
      notFixedTotalCount: '',
      notFixedMediumCount: '',
      notFixedLowRiskCount: '',
      notFixedhighCount: '',
      thereAreCount: '',
      ldData: {},
      params: {
        grade: '',
        keyword: '',
        assetId: this.route.params.assetId,
      },
      gradeObjects: [{
        value: '高',
        lable: '高',
      }, {
        value: '中',
        lable: '中',
      }, {
        value: '低',
        lable: '低',
      }],
    }
  },
  computed: {
    STYLE: () => STYLE,
    page() {
      return alreadyAssetDetailsPage
    },
    query() {
      return this.params
    },
    head() {
      return [
        // {
        //   prop: 'name',
        //   label: '序号',

        // },
        {
          prop: 'grade',
          label: '漏洞等级',
          width: '100',

        },
        {
          prop: 'name',
          label: '漏洞名称',
        },
        {
          prop: 'cveId',
          label: 'CVE_ID',

        },
        {
          prop: 'firstTime',
          label: '首次发现时间',
        },
        {
          prop: 'latestScanTime',
          label: '最新扫描时间',
        },
      ]
    },
  },
  methods: {
    handleClose() {
      this.ldVisible = false
    },

    //  主机漏洞检测服务
    getSecurityServiceInfo() {
      securityServiceInfo({ serviceType: 'USR_VULNERABILITY_SCAN' }).then((res) => {
        this.jcFrom = res.data.body
        this.thereAreCount = res.data.body.thereAre
        this.notFixedhighCount = res.data.body.notFixed.high
        this.notFixedLowRiskCount = res.data.body.notFixed.lowRisk
        this.notFixedMediumCount = res.data.body.notFixed.medium
        this.notFixedTotalCount = parseInt(this.notFixedhighCount) +
         parseInt(this.notFixedLowRiskCount) +
         parseInt(this.notFixedMediumCount)
      })
    },
    // 跳转漏洞详情
    PDetail(obj: any) {
      this.$router.push({
        name: 'vulneDetectDetail',
        params: { id: obj.id },
      })
    },
  },
  mounted() {
    //  主机漏洞检测服务
    this.getSecurityServiceInfo()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang="scss" module>
.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.bar {
  margin-top: 15px;
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;

  > h4 {
    display: inline-block;
    margin: 0 0 $gapNormal / 2 0;
    padding-bottom: 12px;
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

.fontsty {
  color: rgba(50, 115, 196, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
  cursor: pointer;
}

.rowSty {
  padding: 10px 0;
  overflow: hidden;
}

.titleSty {
  padding-bottom: 10px;
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

.ldNum {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;

  p {
    display: inline-block;
    margin-top: -3px;
    margin-right: 40px;
    line-height: 26px;
  }

  span {
    color: #333;
    font-weight: 400;
    font-size: 16px;
  }

  b {
    color: #333;
    font-weight: bold;
    font-size: 18px;
  }
}

.gBarBox {
  display: inline-block;
}

.mtp {
  margin-top: 50px;
}
</style>
