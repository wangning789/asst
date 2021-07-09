<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    <ElRow :class="$style.mg">
      <ElTabs v-model="datas.pageType">
        <!-- 资产基础信息403 -->
        <ElTabPane
          label="资产基础信息"
          name="0"
        >
          <div v-if="datas.pageType === '0'">
            <h4>基础信息</h4>
            <ElRow>
              <ElCol :span="12">
                <label>资产编号：</label>
                <span>{{ info.ciCode }}</span>
              </ElCol>

              <ElCol :span="12">
                <label>资产类型：</label>
                <span>{{ info.ciType }}</span>
              </ElCol>

              <ElCol :span="12">
                <label>资产名称：</label>
                <span>{{ info.ciName }}</span>
              </ElCol>
              <ElCol :span="12">
                <label>MAC地址：</label>
                <span>{{ info.macAddress }}</span>
              </ElCol>
              <ElCol :span="12">
                <label>IP：</label>
                <span>{{ info.ipAddress }}</span>
              </ElCol>
              <ElCol :span="12">
                <label>所属云平台：</label>
                <span>{{ info.cloudPlatformName }}</span>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="12">
                <label>操作系统：</label>
                <span>{{ info.os }}</span>
              </ElCol>

              <ElCol :span="12">
                <label>内核版本：</label>
                <span>{{ info.version }}</span>
              </ElCol>

              <ElCol :span="12">
                <label>内存：</label>
                <span>{{ info.ciMemory }}</span>
              </ElCol>
              <ElCol :span="12">
                <label>CPU：</label>
                <span>{{ info.ciCpu }}</span>
              </ElCol>
              <ElCol :span="12">
                <label>硬盘：</label>
                <span>{{ info.ciHardDisk }}</span>
              </ElCol>
            </ElRow>
          </div>
        </ElTabPane>
        <!-- 网站应用名称 -->
        <ElTabPane
          v-if="isCustom"
          label="资产应用信息"
          name="1"
        >
          <ElForm
            :inline="true"
            style="margin-top: 20px;"
          >
            <ElFormItem>
              软件名：<ElInput
                v-model="pParams.name"
                clearable
              />
            </ElFormItem>

            <ElFormItem>
              版本号：<ElInput
                v-model="pParams.vesion"
                clearable
              />
            </ElFormItem>
          </ElForm>

          <ITable
            v-if="datas.pageType === '1'"
            ref="table"
            :get="getFinger"
            :query="pParams"
            :head="headFinger"
          />
        </ElTabPane>
        <!-- 漏洞信息 -->
        <ElTabPane
          v-if="isCustom"
          label="漏洞信息"
          name="2"
        >
          <div :class="$style.numArea">
            <div>
              <span>漏洞总数</span>
            </div>
            <div>
              <span :class="$style.num">{{ (+leakNums.value).toFixed(0) }}</span>
            </div>
            <div>
              <ElTooltip
                v-for="(item,index) in leakNums.levelNum"
                :key="index"
                :content="item.name"
              >
                <span :class="[getStyle(item), $style.tag]">{{ item.value }}</span>
              </ElTooltip>
            </div>
          </div>

          <ElForm :inline="true">
            <ElFormItem>
              <ElSelect
                v-model="qParams.level"
                clearable
                placeholder="漏洞等级"
                value-key="level"
              >
                <ElOption
                  v-for="item in ['高','中','低']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem>
              <ElInput
                v-model="qParams.keyword"
                clearable
                placeholder="请输入漏洞名称或者编号"
              />
            </ElFormItem>
          </ElForm>

          <ITable
            v-if="datas.pageType === '2'"
            ref="table"
            :get="leakByCiid"
            :query="params1"
            :head="headLeak"
          >
            <!-- <ElTableColumn
              align="center"
              label="操作"
              width="100"
            >
              <template #default="{ row }">
                <ElButton
                  size="small"
                  type="primary"
                  @click="leackInfo(row)"
                >
                  详情
                </ElButton>
              </template>
            </ElTableColumn> -->
          </ITable>
        </ElTabPane>
        <!-- 安全告警 -->
        <ElTabPane
          v-if="isCustom"
          label="安全告警"
          name="3"
        >
          <div :class="$style.numArea">
            <div :span="2">
              <span>安全告警总数</span>
            </div>
            <div :span="1">
              <span :class="$style.num">{{ (+alarmNums.value).toFixed(0) }}</span>
            </div>
            <div
              :span="2"
            >
              <ElTooltip
                v-for="(item,index) in alarmNums.levelNum"
                :key="index"
                :content="item.name"
              >
                <span :class="[getStyle(item), $style.tag]">{{ item.value }}</span>
              </ElTooltip>
            </div>
          </div>

          <ElForm :inline="true">
            <ElFormItem>
              <ElSelect

                v-model="mParams.level"
                clearable
                placeholder="告警等级"
                value-key="level"
              >
                <ElOption
                  v-for="(val,key) in {2:'低危',3:'中危',4:'高危',5:'严重'}"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem>
              <ElDatePicker
                v-model="mParams.alarmTime"
                placeholder="选择日期"
                align="left"
                clearable
                type="date"
              />
            </ElFormItem>
            <ElFormItem>
              <ElInput
                v-model="mParams.keyword"
                clearable
                placeholder="请输入告警名称进行查询"
              />
            </ElFormItem>
          </ElForm>

          <ITable
            v-if="datas.pageType === '3'"
            ref="table"
            :get="warningByCiid"
            :query="params2"
            :head="headWarning"
          >
            <ElTableColumn
              align="center"
              label="操作"
              width="100"
            >
              <template #default="{ row }">
                <ElButton
                  size="small"
                  type="primary"
                  @click="goTo(row)"
                >
                  详情
                </ElButton>
              </template>To
            </ElTableColumn>
          </ITable>
        </ElTabPane>
      </ElTabs>
    </ElRow>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import STYLE from '@/scss/status.module.scss'
import ITable, { ElTableColumn } from '@com/Table'
import { DATE_TIME } from '@/enums/format'
import { ROLES } from '@/enums'

import {
  fingerId,
  leakByCiid,
  warningByCiid,
  leakNum,
  alarmNum,
} from '@/api/servicePlatform/serverAssets'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: { type: Object, required: true },
    info: { type: Object, required: true },
  },
  components: {
    ElTabs,
    ElTabPane,
    ITable,
    ElTableColumn,
    ElDatePicker,
  },
  data() {
    return {
      datas: { pageType: '0' },
      keyword: null,
      infoD: {},
      leakNums: {},
      alarmNums: {},
      pParams: {
        id: '',
        vesion: '',
        name: '',
      },
      qParams: {
        id: '',
        level: '',
        keyword: '',

      },
      mParams: {
        alarmTime: '',
        id: '',
        keyword: '',
        level: '',

      },
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    STYLE() {
      return [
        STYLE.bgsuccess,
        STYLE.bgprimary,
        STYLE.bgwarn,
        STYLE.bgdanger,
      ]
    },
    isCustom() {
      return this.authFit(ROLES.custom)
    },
    getFinger: () => fingerId, // 指纹列表
    leakByCiid: () => leakByCiid, // 查漏洞详情列表
    warningByCiid: () => warningByCiid, // 告警列表
    params(this: any) {
      return this.pParams
    },
    params1(this: any) {
      return this.qParams
    },
    params2(this: any) {
      return this.mParams
    },
    headFinger() {
      return [
        { prop: 'name', label: '软件名' },
        { prop: 'vesion', label: '软件版本' },
        { prop: 'lastUpdateTime', label: '最后更新时间' },
        { prop: 'installDir', label: '软件安装目录' },
      ]
    },
    headLeak() {
      return [
        { prop: 'level', label: '漏洞等级' },
        { prop: 'name', label: '漏洞名称' },
        { prop: 'cve', label: 'CVE_ID' },
        { prop: 'fristFindTime', label: '首次发现时间' },
        { prop: 'newScanTime', label: '最新扫描时间' },

      ]
    },
    headWarning() {
      return [
        { prop: 'level', label: '告警级别' },
        { prop: 'name', label: '安全告警名称' },
        { prop: 'alarmTime', label: '告警发生时间' },
        { prop: 'attackAsset', label: '被攻击资产' },
        { prop: 'assetIp', label: '攻击源IP' },

      ]
    },
  },
  methods: {
    getStyle(level: any) {
      let i = 0
      switch (true) {
        case level.name.indexOf('低') !== -1:
          i = 0
          break
        case level.name.indexOf('中') !== -1:
          i = 1
          break
        case level.name.indexOf('高') !== -1:
          i = 2
          break
        case level.name.indexOf('严重') !== -1:
          i = 3
          break
      }
      return this.STYLE[i]
    },
    leackInfo(row) {
      // 跳转漏洞详情
      this.$router.push({
        path: `/VulnerTask/${row.id}/detail`,
      })
    },
    goTo(row) {
      // 跳转安全告警
      this.$router.push({
        path: '/securityWarning/detail',
        query: {
          id: `${row.id}`,
        },
      })
    },
  },

  mounted() {
    if (window.pageType) {
      this.data.pageType = window.pageType
    }
  },
  created() {
    this.qParams.id = this.route.params.id
    this.mParams.id = this.route.params.id
    this.pParams.id = this.route.params.id
    // if (this.authFit(ROLES.custom)) {
    //   baseByCiid(this.route.params.id).then(res => {
    //     this.infoD = res.data.body
    //   })
    // } else if (this.authFit(ROLES.operation)) {
    //   infoF(this.route.params.id).then(res => {
    //     this.infoD = res.data.body
    //   })
    // }

    leakNum(this.route.params.id).then(res => {
      this.leakNums = res.data.body
    })
    alarmNum(this.route.params.id).then(res => {
      this.alarmNums = res.data.body
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.search {
  width: 220px;
  margin: 0 $gapNormal / 2 $gapNormal / 2 0;
}

.select :global(.el-table__body-wrapper) {
  max-height: 41vh;
  overflow-y: auto;
}

.tag {
  margin: 0 $gapNormal / 4;
  padding: $gapNormal / 4;
  color: $colorWhite;
  border-radius: $borderRadiusBase;
}

.numArea {
  display: flex;
  margin-bottom: $gapNormal / 2;

  > div {
    height: $xxxLarge;
    margin-right: $gapNormal;
    line-height: $xxxLarge;
  }
}

.num {
  margin: 0 $gapNormal / 4;
  padding: 2px 0;
  font-size: $large;
  border-bottom: 1px solid $colorTextStress;
}

.wrapper {
  margin-top: $gapNormal;

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
