<!-- 描述 -->
<template>
  <div>
    <div :class="$style.blkBox">
      <div :class="$style.titBox">
        <h3 :class="[$style.title,$style.fl]">
          主机杀毒
        </h3>
        <p :class="$style.codeDes">
          <span>待交付:<em :class="$style.crl1">{{ codeFrom.toBeDelivered }}</em></span>
          <span>交付完成:<em :class="$style.crl2">{{ codeFrom.deliveryComplete }}</em></span>
        </p>

        <ElButton
          :class="[$style.sqBtn,$style.fr]"
          @click="applyServ"
        >
          申请服务
        </ElButton>
      </div>
      <div :class="[$style.echartitem,$style.fl]">
        <ElRow>
          <ElCol
            :span="8"
            :class="$style.leftBox"
          >
            <p :class="$style.countSty1">
              <i class="i-zaiguanzhongduan" />
              <span>
                在管终端总数<br>
                <!-- <b>{{ countFrom.allCount || 0 }}</b> -->
                <b>{{ allCount || 0 }}</b>
              </span>
            </p>
            <p :class="$style.countSty2">
              <i class="i-zaixian-lixianzhongduan" />
              <span>
                在线/离线终端数<br>
                <b>
                  <em :class="$style.sty1">{{ onlineCount || 0 }}</em>
                  <em :class="$style.sty2">/{{ offlineCount || 0 }}</em>
                </b>
              </span>
            </p>
          </ElCol>
          <ElCol :span="16">
            <!-- 圆形图表（终端总数） -->
            <div
              v-if="terminalCountArr && terminalCountArr.length"
              id="containerTerminal"
              style="height: 200px;"
            />
            <Info
              v-else
              :class="$style.mtp1"
              icon="el-icon-info"
              type="info"
              msg="empty"
              retry
            />
          </ElCol>
        </ElRow>
      </div>
      <div :class="[$style.echartitem,$style.fr]">
        <ElRow>
          <ElCol :span="8">
            <p
              v-for="(item,index) in systemStatistics"
              :key="index"
              :class="$style[`countSty${index+3}`]"
            >
              <i :class="`${item.name}`==='linux'?'i-linuxzhongduan':'i-Windowszhongduan'" />
              <span>
                {{ item.name }}<br>
                <b>{{ item.value }}</b>
              </span>
            </p>
          </ElCol>
          <ElCol
            :span="16"
            :class="$style.rightBox"
          >
            <!-- 圆形图表（系统） -->
            <div
              v-if="systemCount && systemCount.length"
              id="containerSystem"
              style="height: 200px;"
            />
            <Info
              v-else
              icon="el-icon-info"
              type="info"
              :class="$style.mtp1"
              msg="empty"
              retry
            />
          </ElCol>
        </ElRow>
      </div>
    </div>

    <!-- table -->
    <div :class="[$style.blkBox,$style.mtp2]">
      <ElTabs
        v-model="activeName"
        type="card"
      >
        <ElTabPane
          label="防护终端列表"
          name="0"
        >
          <!-- 筛选表单 -->
          <div :class="[$style.mtp1,$style.mtb1]">
            <Transition
              name="fold"
              mode="out-in"
            >
              <ElForm
                :inline="true"
              >
                <ElFormItem>
                  <ElInput
                    v-model="pParams.keyword"
                    clearable
                    placeholder="请输入IP、MAC、终端名称"
                  />
                </ElFormItem>

                <ElFormItem>
                  <ElSelect
                    v-model="pParams.status"
                    clearable
                    placeholder="在线状态"
                    value-key="item.status"
                  >
                    <ElOption
                      v-for="item in statusObjects"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </ElFormItem>

                <ElFormItem>
                  <ElSelect
                    v-model="pParams.operatingSystem"
                    placeholder="操作系统"
                    clearable
                    value-key="item.operatingSystem"
                  >
                    <ElOption
                      v-for="item in systemObjects"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </ElFormItem>
              </ElForm>
            </Transition>
          </div>
          <ITable
            v-if="activeName==='0'"
            ref="table"
            :get="protPage"
            :query="pParams"
            :head="protHead"
          >
            <ElTableColumn
              label="操作"
              width="100px"
            >
              <template #default="{ row }">
                <ElTooltip content="查看详情">
                  <ElButton
                    type="text"
                    :icon="'i-chakan ' + STYLE.primary"
                    @click="protDetails(row)"
                  />
                </ElTooltip>
              </template>
            </ElTableColumn>
          </ITable>
        </ElTabPane>

        <ElTabPane
          label="运维服务记录"
          name="1"
        >
          <ITable
            v-if="activeName==='1'"
            ref="table"
            :class="$style.mtp1"
            :get="mainPage"
            :query="mainQuery"
            :head="mainHead"
          >
            <ElTableColumn
              label="操作"
              width="100px"
            >
              <template #default="{ row }">
                <ElTooltip content="查看详情">
                  <ElButton
                    type="text"
                    :icon="'i-chakan ' + STYLE.primary"
                    @click="toDetailClick(row)"
                  />
                </ElTooltip>
              </template>
            </ElTableColumn>
          </ITable>
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
import ElTableColumn from 'element-ui/lib/table-column'
import ITable from '@com/Table'
import echarts from '@/libs/echarts'
import Info from '@com/Info'
// 饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import STYLE from '@/scss/status.module.scss'
import { toDetail } from '@/api/workflow/workflow'
import {
  securityServiceInfo,
  maintenanceRecords,
  protectionTerminalListPage,
  serviceOperateFlow,
  getUserOrderAssetByCode,
} from '@/api/servicePlatform/SecurityService'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  components: { ITable, ElTableColumn, ElTabs, ElTabPane, Info },
  data() {
    return {
      systemStatistics: [],
      codeFrom: '',
      activeName: '0',
      allCount: 0, // 终端总数
      onlineCount: 0, // 在线总数
      offlineCount: 0, // 离线总数
      WindowsCount: '', // Windows终端
      LinxCount: '', // Linux终端
      systemCount: [], // 操作系统占比统计饼图数据
      reUserObjects: [],
      terminalCountArr: [],
      sType: 'USR_HOST_ANTIVIRUS',
      pParams: {
        keyword: '',
        status: '',
        operatingSystem: '',
        serviceType: this.sType,
      },
      objects: [],
    }
  },
  computed: {
    STYLE: () => STYLE,
    protPage() {
      return protectionTerminalListPage
    },
    mainPage() {
      return maintenanceRecords
    },
    mainHead() {
      return [
        {
          prop: 'workOrderNo',
          label: '工单编号',
        },
        {
          prop: 'createDate',
          label: '时间',
        },
        {
          prop: 'workOrderContent',
          label: '问题描述',
        },
        {
          prop: 'workOrderName',
          label: '服务内容',

        },
        {
          prop: 'handler',
          label: '运维人员',
        },
      ]
    },
    mainQuery(this: any) {
      return { serviceType: this.sType }
    },
    protHead() {
      return [
        {
          prop: 'status',
          label: '在线状态',
          formatter: (row: code) => {
            const oStatus = row.status
            return this.$createElement(
              'span',
              oStatus === '0'
                ? {
                  class: `${STYLE.danger}`,
                } : {
                  class: `${STYLE.success}`,
                },
              row.status === '0' ? '离线' : '在线'
            )
          },
        },
        {
          prop: 'terminalName',
          label: '终端名称',
          formatter: (row: code) => {
            return this.$createElement(
              'b',
              row.terminalName
            )
          },

        },
        {
          prop: 'ip',
          label: 'IP地址',
        },
        { prop: 'mac', label: 'MAC地址' },
        {
          prop: 'operatingSystem',
          label: '操作系统',
        },
        { prop: 'clientVersion', label: '客户端版本' },
        { prop: 'virusLibraryVersion', label: '病毒库版本', width: '120x' },
        { prop: 'latestActiveTime', label: '最新活跃时间', width: '220x' },

      ]
    },
    statusObjects: () => [{
      value: '1',
      label: '在线',
    }, {
      value: '0',
      label: '离线',
    }],
    systemObjects: () => [{
      value: 'windows',
      label: 'windows',
    }, {
      value: 'linux',
      label: 'linux',
    }],
  },
  watch: {
    terminalCountArr: {
      immediate: true,
      deep: true,
      handler() {
        this.initEachartTerminal()
      },
    },
    systemCount: {
      immediate: true,
      deep: true,
      handler() {
        this.initEachartSystem()
      },
    },
  },
  methods: {
    applyServ() {
      serviceOperateFlow(this.sType).then(res => {
        const code = res.data.body
        toDetail(code, '工单详情', msg => {
          msg.data === 'close' && this.$refs.operat.fetch()
        })
      })
    },
    toDetailClick(row) {
      toDetail(row.processId, '工单详情', msg => {
        msg.data === 'close' && this.$refs.operat.fetch()
      })
    },
    // 跳转详情
    protDetails(obj: any) {
      this.$router.push({
        name: 'bdDetail',
        query: {
          assetId: obj.assetId,
          id: obj.id,
        },
      })
    },
    //  主机漏洞检测服务
    getSecurityServiceInfo() {
      securityServiceInfo({ serviceType: this.sType }).then((res) => {
        this.systemStatistics = res.data.body.systemStatistics
        this.systemCount = res.data.body.systemShare
        this.terminalCountArr = res.data.body.terminalCount
        this.initEachartTerminal()
        this.initEachartSystem()
        this.terminalCountArr.map((item) => {
          switch (item.name) {
            case '在线':
              this.onlineCount = item.value
              break
            case '离线':
              this.offlineCount = item.value
              break
            default:
              this.offlineCount = 0
              this.onlineCount = 0
          }
          this.allCount = parseInt(this.onlineCount) + parseInt(this.offlineCount)
        })
      })
    },

    // 初始化图表
    initEachartTerminal() {
      const dom = document.getElementById('containerTerminal')
      if (dom) {
        const myChart = echarts.init(dom)
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          series: [
            {
              name: '终端数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '40%'],
              data: this.terminalCountArr.map((item) => {
                if (item.name === '在线') {
                  item.itemStyle = { color: '#81d381' }
                }
                if (item.name === '离线') {
                  item.itemStyle = { color: '#d1d0da' }
                }
                return item
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },

            },
          ],
        }

        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      }
    },
    // 获取交付订单数
    getUserOrderAssetByCode() {
      getUserOrderAssetByCode(this.sType).then(res => {
        if (res.data.body) {
          this.codeFrom = res.data.body
        }
      })
    },
    // 初始化图表
    initEachartSystem() {
      const dom = document.getElementById('containerSystem')
      if (dom) {
        const myChart = echarts.init(dom)
        const option = {

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          graphic: {
            type: 'text',
            left: '44%',
            top: '30%',
            z: 5,
            zlevel: 100,
            style: {
              // text: `${text}\n\n    ${total}`,
              fill: '#000',
              width: 90,
              height: 30,
              font: 'bolder',
              fontSize: 14,
            },
          },
          series: [
            {
              name: '系统',
              type: 'pie',
              radius: ['40%', '55%'],
              center: ['50%', '40%'],
              data: this.systemCount,
              emphasis: {
                show: false,
                itemStyle: {
                  normal: {
                    color: function(params) {
                      const colorList = ['#FEBB69', '#6BA2FD', '#CFC9C9', '#988AFC', '#FE6A93', '#82D184']
                      return colorList[params.dataIndex]
                    },
                  },
                },
              },
            },
          ],
        }
        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      }
    },
  },
  mounted() {
    // 初始化表
    this.getSecurityServiceInfo()
    this.getUserOrderAssetByCode()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/tag';
</style>

<style lang="scss" module>
.sqBtn {
  width: 90px;
  height: 40px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  font-family: Microsoft YaHei;
  line-height: 8px;
  text-align: center;
  background: #3273c4;
  border-radius: 2px;
}

.fr {
  float: right;
}

.fl {
  float: left;
}

.mtp1 {
  margin-top: 10px;
}

.mtp2 {
  margin-top: 20px;
}

.mtb1 {
  margin-bottom: -14px;
  padding: 0 10px;
}

.onLine {
  color: rgba(103, 194, 58, 1);
  font-weight: bold;
  font-size: 14px;
  font-family: Microsoft YaHei;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.echartBox {
  min-height: 120px;
  padding: 24px;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
}

.echartitem {
  position: relative;
  width: 50%;
}

.linkSty {
  display: inline-block;
  margin-right: 12px;
  color: rgba(51, 116, 196, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
  cursor: pointer;
}

.countSty1,
.countSty2,
.countSty3,
.countSty4 {
  i {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-top: 7px;
    margin-right: 24px;
    color: $colorTheme;
    font-size: 30px;
    vertical-align: top;
  }

  span {
    display: inline-block;
    color: #333;
    font-weight: 400;
    font-size: 16px;
    font-family: Microsoft YaHei;
    line-height: 28px;
    text-align: left;
  }

  b {
    color: #333;
    font-weight: bold;
    font-size: 20px;
    font-family: Microsoft YaHei;

    em {
      font-style: normal;
    }

    .sty1 {
      color: #81d381;
    }

    .sty2 {
      color: #d1d0da;
    }
  }
}

.countSty1 {
  align-self: start;
}

.countSty2 {
  align-self: end;
}

.countSty3 {
  align-self: start;
}

.countSty4 {
  align-self: end;
}

.leftBox {
  padding-left: 20px;
}

.rightBox {
  padding-right: 40px;
}

.titBox {
  margin-bottom: 15px;
  overflow: hidden;
}

.title {
  display: inline-block;
  margin-top: 5px;
  color: rgba(51, 51, 51, 1);
  font-weight: bold;
  font-size: 16px;
  font-family: Microsoft YaHei;
}

.codeDes {
  display: inline-block;
  float: left;
  margin-top: 10px;
  margin-left: 24px;

  span {
    display: inline-block;
    margin-right: 12px;

    em {
      font-style: normal;
    }

    .crl2 {
      color: $colorSuccess;
    }

    .crl1 {
      color: $colorDanger;
    }
  }
}

</style>
