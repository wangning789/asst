<template>
  <div :class="$style.mainSty">
    <!-- 主机防病毒服务 -->
    <div :class="$style.blkBox">
      <ElRow>
        <ElCol
          :span="16"
          :class="$style.titBox"
        >
          <h3 :class="[$style.title,$style.fl]">
            Web防篡改服务
          </h3>

          <ElSelect
            v-model="applicationId"
            placeholder="请选择"
            @change="changeMsg"
          >
            <ElOption
              v-for="item in Application"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
          <p :class="$style.codeDes">
            <span>待交付:<em :class="$style.crl1">{{ codeFrom.toBeDelivered }}</em></span>
            <span>交付完成:<em :class="$style.crl2">{{ codeFrom.deliveryComplete }}</em></span>
          </p>
        </ElCol>
        <ElCol :span="8">
          <ElButton
            :class="[$style.sqBtn,$style.fr]"
            @click="applyServ"
          >
            申请服务
          </ElButton>
        </ElCol>
      </ElRow>

      <div>
        <ElRow>
          <ElCol :span="6">
            <div :class="$style.logNumber">
              <i class="i-wenjianfangcuangai" />
              <P>
                告警日志数<br>
                <b>{{ logNumber }}</b>
              </p>
            </div>
            <div :class="$style.logNumber">
              <i class="i-wenjianfangcuangai" />
              <P>
                今日告警日志数<br>
                <b>{{ tologNumber }}</b>
              </p>
            </div>
          </ElCol>
          <ElCol :span="12">
            <div :class="$style.echartBox">
              <!-- <h4 :class="$style.bjTit">
                告警趋势
              </h4> -->
              <div
                v-if="seriesArr && seriesArr.length"
                ref="alarmTrend"
                style="height: 300px;"
              />
              <Info
                v-else
                icon="el-icon-info"
                type="info"
                msg="empty"
                retry
              />
            </div>
          </ElCol>
          <ElCol :span="6">
            <!-- 右侧申请服务 -->
            <RightList
              ref="rgList"
              :service-type="sType"
            />
          </ElCol>
        </ElRow>
      </div>
    </div>
    <div :class="[$style.blkBox,$style.mtp1]">
      <!-- 列表组件 -->
      <TableList
        :query="sType"
        :application-id="applicationId"
      />
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { alarmTrend, alarmLogCount, getApplicationCheck, serviceOperateFlow, getUserOrderAssetByCode } from '@/api/servicePlatform/SecurityService'
import Info from '@com/Info'
import echarts from 'echarts'

import { toDetail } from '@/api/workflow/workflow'

import RightList from '@/pages/home/views/securityServe/common/rightList'
import TableList from '@/pages/home/views/securityServe/common/tableList'

export default {
  components: {
    RightList,
    TableList,
    Info,
  },
  data() {
    return {
      codeFrom: '',
      sType: 'USR_TAMPER_PROOFING',
      logNumber: '',
      tologNumber: '',
      xAxisArr: [],
      seriesArr: [],
      Application: [],
      applicationId: '',
      query: {
        pageType: '',
      },
    }
  },
  // watch: {
  //   seriesArr: {
  //     immediate: true,
  //     deep: true,
  //     handler(data?: any) {
  //       this.initEcharts()
  //     },
  //   },
  // },

  methods: {
    applyServ() {
      serviceOperateFlow(this.sType).then(res => {
        const code = res.data.body
        toDetail(code, '工单详情', msg => {
          msg.data === 'close' && this.$refs.operat.fetch()
        })
      })
    },
    // 获取交付订单数
    getUserOrderAssetByCode() {
      getUserOrderAssetByCode(this.sType).then(res => {
        if (res.data.body) {
          this.codeFrom = res.data.body
        }
      })
    },
    // 获取告警次数
    getAlarmLogCount() {
      alarmLogCount({ serviceType: this.sType, applicationId: this.applicationId }).then((res) => {
        this.logNumber = res.data.body.alarmLog
        this.tologNumber = res.data.body.todayAlarmLog
      })
    },
    // 获取告警趋势
    getAlarmTrend() {
      alarmTrend({ serviceType: this.sType, applicationId: this.applicationId }).then((res) => {
        this.xAxisArr = res.data.body.xAxis
        this.seriesArr = res.data.body.series
        this.initEcharts()
      })
    },
    // 切换网页数据
    getApplicationCheck() {
      getApplicationCheck({}).then((res) => {
        this.Application = res.data.body
        this.applicationId = this.Application[0].id
        this.$refs.rgList.getAssetsList(this.applicationId)
        this.getAlarmLogCount()
        this.getAlarmTrend()
      })
    },
    changeMsg(event) {
      this.applicationId = event
      this.getAlarmLogCount()
      this.getAlarmTrend()
      this.$refs.rgList.getAssetsList(event)
    },
    initEcharts() {
      const alarmTrend = this.$refs.alarmTrend
      if (alarmTrend) {
        const myChart = echarts.init(alarmTrend)
        const option = {
          xAxis: {
            type: 'category',
            data: this.xAxisArr,
            axisLine: {
              show: false,
            },
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: false, // 隐藏或显示
            },
          },
          yAxis: {
            name: ' 告警趋势',
            type: 'value',
            axisLine: {
              show: false,
            },
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, // 隐藏或显示
            },

          },
          series: [{
            name: '告警趋势',
            data: this.seriesArr,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              normal: {
                color: 'rgb(14,156,255,0.1)', // 改变区域颜色
              },
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: 'rgb(14,156,255,0.8)', // 改变折线颜色
                },
              },
            },
          }],
        }

        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      }
    },
  },
  updated() {
    this.initEcharts()
  },
  mounted() {
    this.getApplicationCheck()
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
.titBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.fr {
  float: right;
}

.title {
  display: inline-block;
  margin-right: 10px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.mtp1 {
  margin-top: 20px;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.logNumber {
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 5px 0 20px;
  padding-left: 20px;
  overflow: hidden;
  text-align: left;

  i {
    display: inline-block;
    margin-top: 5px;
    margin-right: 25px;
    color: #3273c4;
    font-size: 28px;
    vertical-align: top;
  }

  > p {
    display: inline-block;
    margin: 0;
    color: rgba(51, 51, 51, 1);
    font-weight: 400;
    font-size: 16px;
    font-family: Microsoft YaHei;
    line-height: 30px;
    text-align: left;
  }

  > b {
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
    font-size: 20px;
    font-family: Microsoft YaHei;
  }
}

.echartBox {
  height: 300px;
  margin-top: -20px;
}

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

.codeDes {
  display: inline-block;
  float: left;
  margin-top: 10px;
  margin-left: 24px;

  span {
    display: inline-block;
    margin-right: 12px;
  }

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

.bjTit {
  color: #333;
  font-weight: bold;
  font-size: 14px;
  font-style: 'normal';
}
</style>
