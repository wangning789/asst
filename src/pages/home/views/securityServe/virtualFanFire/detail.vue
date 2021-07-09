<template>
  <IChooser
    :fetch="fetch"
    :args="[route.params.devId]"
  >
    <!-- 工具条 -->

    <ElRow
      :class="$style.rowSty"
      :gutter="20"
    >
      <ElCol :span="12">
        <div :class="[$style.blkBox,$style.blkWith]">
          <h4 :class="$style.titleSty">
            事件统计
          </h4>

          <div :class="$style.logflx">
            <div :class="$style.logBox">
              <div :class="$style.des">
                <span>入侵事件</span>
              </div>
              <div :class="$style.eventFilter">
                <GressBar
                  :high-data="form.intrusionEventsHigh"
                  :mld-data="form.intrusionEventsMid"
                  :low-data="form.intrusionEventsLow"
                />
              </div>
            </div>
            <div :class="$style.logBox">
              <div :class="$style.des">
                <span>URL过滤</span>
                <!-- <b>4004</b> -->
              </div>
              <div :class="$style.eventFilter">
                <GressBar
                  :high-data="form.urlFilterHigh"
                  :mld-data="form.urlFilterMid"
                  :low-data="form.urlFilterLow"
                />
              </div>
            </div>
          </div>
          <div :class="$style.logflx">
            <div :class="$style.logBox">
              <div :class="$style.des">
                <span>病毒事件</span>
                <!-- <b>4004</b> -->
              </div>
              <div :class="$style.eventFilter">
                <GressBar
                  :high-data="form.virusEventsHigh"
                  :mld-data="form.virusEventsMid"
                  :low-data="form.virusEventsLow"
                />
              </div>
            </div>
            <div :class="$style.logBox">
              <div :class="$style.des">
                <span>内容过滤</span>
                <!-- <b>4004</b> -->
              </div>
              <div :class="$style.eventFilter">
                <GressBar
                  :high-data="form.contentFilterHigh"
                  :mld-data="form.contentFilterMid"
                  :low-data="form.contentFilterLow "
                />
              </div>
            </div>
          </div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div :class="[$style.blkBox,$style.blkWith,$style.ffqBox]">
          <h4 :class="$style.titleSty">
            防火墙状态
          </h4>
          <ElRow :class="$style.rowSty2">
            <ElCol
              :span="12"
            >
              <label>引擎状态：</label>
              <span
                v-if="fireForm.status==='alive'"
                :class="$style.alive"
              >正常</span>
              <span
                v-if="fireForm.status==='dead'"
                :class="$style.dead"
              >失效</span>
            </ElCol>
            <ElCol
              :span="12"
            >
              <div :class="$style.flexBox">
                <label>CPU：</label>
                <ElProgress
                  :class="$style.gressWidth"
                  :text-inside="true"
                  color="#A4D988"
                  :stroke-width="10"
                  :percentage="parseInt(`${fireForm.cpu}`)"
                />
                <!-- <b>{{ fireForm.cpu }}%</b>
               -->
              </div>
            </ElCol>
          </ElRow>
          <ElRow :class="$style.rowSty2">
            <ElCol :span="12">
              <label>版本号:</label>
              <span>{{ fireForm.version }}</span>
            </ElCol>
            <ElCol
              :span="12"
            >
              <div :class="$style.flexBox">
                <label>内存:</label>
                <ElProgress
                  :class="$style.gressWidth"
                  color="#A4D988"
                  :text-inside="true"
                  :stroke-width="10"
                  :percentage="parseInt(`${fireForm.memory}`)"
                />
                <!-- <b>{{ fireForm.memory }}%</b> -->
              </div>
            </ElCol>
          </ElRow>
          <ElRow :class="$style.rowSty2">
            <ElCol :span="12">
              <label>运行时间:</label>
              <span>{{ fireForm.runTime }}</span>
            </ElCol>
            <ElCol :span="12">
              <div :class="$style.flexBox">
                <label>剩余磁盘:</label>
                <ElProgress
                  :class="$style.gressWidth"
                  color="#A4D988"
                  :text-inside="true"
                  :stroke-width="10"
                  :percentage="parseInt(`${fireForm.disk}`)"
                />
                <!-- <span>{{ fireForm.disk }}MB</span> -->
              </div>
            </ElCol>
          </ElRow>
        </div>
      </ElCol>
    </ElRow>
    <div :class="[$style.blkBox,$style.mtp]">
      <ElTabs
        v-model="activeName"
        type="card"
      >
        <ElTabPane
          label="防火墙策略"
          name="0"
        >
          <ITable
            v-if="activeName==='0'"
            ref="table"
            :get="page1"
            :head="head1"
          />
        </ElTabPane>
        <ElTabPane
          label="防火墙操作日志"
          name="1"
        >
          <ITable
            v-if="activeName==='1'"
            ref="table"
            :query="query2"
            :get="page2"
            :head="head2"
          />
        </ElTabPane>
      </ElTabs>
    </div>
  </IChooser>
</template>
<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ITable from '@com/Table'
import ElProgress from 'element-ui/lib/progress'
import GressBar from '../common/progressBar'
import STYLE from '@/scss/status.module.scss'
import { protectionAlarmLog, firewallInfo, firewallPolicy } from '@/api/servicePlatform/SecurityService'

export default {
  props: { route: { type: Object, required: true } },
  components: {
    IChooser: IChooser as any,
    ITable,
    ElTabs,
    ElTabPane,
    ElProgress,
    GressBar,
  },
  data() {
    return {
      userId: '88',
      treminalId: '',
      visible: false,
      form: {},
      fireForm: {},
      activeName: '0',
    }
  },
  computed: {
    STYLE: () => STYLE,
    query() {
      return { serviceType: 'USR_VULNERABILITY_SCAN' }
    },
    query2() {
      return { devId: this.route.params.devId }
    },
    page1() {
      return firewallPolicy
    },
    page2() {
      return protectionAlarmLog
    },
    head1() {
      return [
        // {
        //   type: 'index',
        //   align: 'center',
        //   width: '50',
        //   label: '编号',
        // },

        {
          prop: 'policyName',
          label: '策略名称',

        },
        {
          prop: 'sourceSecurityArea',
          label: '源安全区域',
        },
        {
          prop: 'sourceAddressObject',
          label: '源地址对象',
        },
        {
          prop: 'objectiveSafeArea',
          label: '目的安全区域',
        },
        {
          prop: 'destinationAddressObject',
          label: '目的地址对象',
        },
        // {
        //   prop: 'firewall',
        //   label: '所属防火墙',
        // },
        {
          prop: 'action',
          label: '动作',
          formatter: (row: code) => {
            const isAction = row.action

            return this.$createElement(
              'i',
              {
                class: isAction === 'accept' ? `${STYLE.success} i-tongguo` : 'i-tingyong',

              }
            )
          },

        },
      ]
    },
    head2() {
      return [
        {
          prop: 'logTime',
          label: '日志时间',

        },
        {
          prop: 'logName',
          label: '事件名称',
        },
        {
          prop: 'userName',
          label: '用户名',

        },
        {
          prop: 'loginIp',
          label: '登录IP',
        },
        {
          prop: 'logType',
          label: '日志类型',
          formatter: (row: code) => {
            return row.logType === '1' ? '登录日志' : '操作日志'
          },
        },
        {
          prop: 'logCont',
          label: '日志内容',
        },
        {
          prop: 'dataSrcRegion',
          label: '数据源区域标识',
        },

      ]
    },
  },
  methods: {
    async fetch(devId?: string) {
      if (!devId) {
        return 1
      }
      const data = (await firewallInfo({ firewallId: devId })).data.body
      this.fireForm = data.firewallStatus
      return (this.form = data.eventStatistics)
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/progress';

.el-progress-bar__innerText {
  margin-top: -5px;
}
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
  margin-top: 10px;
}

.blkWith {
  height: 250px;
}

.rowSty {
  padding: 10px 0;
  overflow: hidden;
}

.rowSty2 {
  padding: 10px;
  overflow: hidden;
}

.titleSty {
  margin-top: 0;
  margin-bottom: 30px;
  color: rgba(51, 51, 51, 1);
  font-weight: bold;
  font-size: 16px;
}

.eventFilter {
  margin-bottom: 10px;
  margin-left: 40px;

  > em {
    display: inline-block;
    font-weight: bold;
    font-size: 14px;
    font-style: normal;
  }

  > p {
    margin-top: 5px;

    > span {
      margin-right: 20px;
      color: rgba(51, 51, 51, 1);
      font-weight: 400;
      font-size: 12px;
      font-family: Microsoft YaHei;
    }
  }
}

.logflx {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  margin: 20px 30px 20px 20px;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.logBox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  width: calc(50% - 20px);
  margin-bottom: 20px;
  overflow: hidden;

  .des {
    display: inline-block;

    span {
      display: block;
      color: rgba(51, 51, 51, 1);
      font-weight: 400;
      font-size: 16px;
      font-family: Microsoft YaHei;
    }

    b {
      display: inline-block;
      margin-top: 6px;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
      font-size: 18px;
      font-family: Microsoft YaHei;
    }
  }
}

.progBox {
  margin-top: -5px;
  overflow: hidden;

  .serious {
    display: inline-block;
    float: left;
    width: 57px;
    height: 8px;
    background: rgba(245, 108, 108, 1);
    border-radius: 4px 0 0 4px;
  }

  .ordin {
    display: inline-block;
    float: left;
    width: 51px;
    height: 8px;
    background: rgba(248, 144, 42, 1);
    opacity: 0.8;
  }

  .slight {
    display: inline-block;
    float: left;
    width: 96px;
    height: 8px;
    background: rgba(103, 194, 58, 1);
    border-radius: 0 4px 4px 0;
    opacity: 0.5;
  }
}

.linkSty {
  color: rgba(50, 115, 196, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
  cursor: pointer;
}

.bgcrl1 {
  background-color: rgba(255, 51, 0, 1);
}

.bgcrl2 {
  background-color: rgba(255, 153, 0, 1);
}

.bgcrl3 {
  background-color: rgba(153, 153, 153, 1);
}

.gressWidth {
  width: calc(100% - 20px);
  height: 10px;
  margin-right: 12px;
}

.flexBox {
  display: flex;
  align-self: center;
  justify-content: space-between;
}

.alive {
  color: $colorSuccess;
}

.dead {
  color: $colorDanger;
}

.ffqBox {
  color: #333;
  font-weight: 400;
  font-size: 14px;

  label {
    display: inline-block;
    width: 90px;
  }
}

.success {
  color: $colorSuccess;
}

.error {
  color: $colorDanger;
}

</style>
