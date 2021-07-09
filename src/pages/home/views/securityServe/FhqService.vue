<template>
  <div>
    <!-- 应用层防火墙服务 -->
    <div :class="$style.blkBox">
      <ElRow>
        <ElCol
          :span="16"
          :class="$style.titBox"
        >
          <h3 :class="[$style.title,$style.fl]">
            应用层防火墙服务
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
      <div :class="[$style.contetBox,$style.mtpCt]">
        <ElRow>
          <ElCol :span="18">
            <ElRow>
              <ElCol :span="8">
                <div :class="$style.logNumber">
                  <i class="i-diyugongjicishu" />
                  <P>
                    告警日志数<br>
                    <b>{{ logNumber }}</b>
                  </p>
                </div>
                <div :class="$style.logNumber">
                  <i class="i-jinridiyugongjicishu" />
                  <P>
                    今日告警日志数<br>
                    <b>{{ tologNumber }}</b>
                  </p>
                </div>
              </ElCol>
              <ElCol :span="16">
                <div
                  :class="$style.echartBox"
                >
                  <h4 :class="$style.bjTit">
                    被攻击最多的资产
                  </h4>
                  <div
                    v-if="assetsSeries && assetsSeries.length"
                    ref="property"
                    style="height: 240px;"
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
            </ElRow>
            <ElRow :class="$style.mtpCt">
              <ElCol :span="8">
                <div
                  :class="[$style.echartBox,$style.mtp]"
                >
                  <h4 :class="$style.bjTit">
                    攻击类型分布
                  </h4>
                  <div
                    v-if="DistributionArr && DistributionArr.length"
                    ref="AttackType"
                    style="height: 200px;"
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
              <ElCol :span="8">
                <div
                  :class="[$style.echartBox,$style.mtp]"
                >
                  <h4 :class="$style.bjTit">
                    攻击源地区分布
                  </h4>
                  <div
                    v-if="regionArr && regionArr.length"
                    ref="AttackSource"
                    style="height: 200px;"
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

              <ElCol :span="8">
                <div :class="[$style.echartBox,$style.mtp]">
                  <h4 :class="$style.bjTit">
                    发起攻击次数最多的IP
                  </h4>
                  <div
                    v-if="AttackIPSeries && AttackIPSeries.length"
                    ref="AttackIp"
                    :class="$style.attackIp"
                    style="height: 250px;"
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
            </ElRow>
          </ElCol>
          <ElCol :span="6">
            <!-- 右侧申请服务 -->
            <RightList
              ref="rgList"
              style="height: 520px;"
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
import {
  alarmLogCount,
  regionDistribution,
  typeDistribution,
  mostAttackIp,
  mostAttacksAssets,
  getApplicationCheck,
  serviceOperateFlow,
  getUserOrderAssetByCode,
} from '@/api/servicePlatform/SecurityService'
import echarts from '@/libs/echarts'
import Info from '@com/Info'
import RightList from '@home/views/securityServe/common/rightList'
import TableList from '@home/views/securityServe/common/tableList'
import { toDetail } from '@/api/workflow/workflow'
export default {
  components: {
    RightList,
    TableList,
    Info,
  },
  data() {
    return {
      codeFrom: '',
      logNumber: '',
      tologNumber: '',
      sType: 'USR_APP_PROTECTIVE',
      assetsSeries: [],
      total: '',
      assetsxAxis: [],
      DistributionArr: [],
      regionArr: [],
      AttackIPSeries: [],
      AttackIPxAxis: [],
      applicationId: '',
      Application: [],
      query: {
        pageType: '',
      },
    }
  },

  watch: {
    AttackIPSeries: {
      handler() {
        this.initMostAttackIp()
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
      alarmLogCount({
        serviceType: this.sType,
        applicationId: this.applicationId,
      }).then((res) => {
        this.logNumber = res.data.body.alarmLog
        this.tologNumber = res.data.body.todayAlarmLog
      })
    },
    //  切换网页数据
    getApplicationCheck() {
      getApplicationCheck({}).then((res) => {
        this.Application = res.data.body
        this.applicationId = this.Application[0].id
        this.$refs.rgList.getAssetsList(this.applicationId)
        this.getAlarmLogCount()
        // 获取被攻击最多的资产的数据
        this.getMostAttacksAssets()
        // 获取攻击类型分布数据
        this.getTypeDistribution()
        // 获取攻击源地区分布数据分布
        this.getRegionDistribution()
        this.initMostAttackIp()
      })
    },
    changeMsg(event) {
      this.applicationId = event
      this.getAlarmLogCount()
      // 获取被攻击最多的资产的数据
      this.getMostAttacksAssets()
      // 获取攻击类型分布数据
      this.getTypeDistribution()
      // 获取攻击源地区分布数据分布
      this.getRegionDistribution()
      this.$refs.rgList.getAssetsList(event)
      this.initMostAttackIp()
    },
    // 获取被攻击最多的资产的数据
    getMostAttacksAssets() {
      mostAttacksAssets({
        serviceType: this.sType,
        applicationId: this.applicationId,
      }).then((res) => {
        this.assetsSeries = res.data.body.series
        this.assetsxAxis = res.data.body.xAxis
        this.initEcharts()
      })
    },
    // 获取应用层防火墙服务 -- 发起攻击次数最多的IP
    initMostAttackIp() {
      mostAttackIp({
        serviceType: this.sType,
        applicationId: this.applicationId,
      }).then(res => {
        this.AttackIPSeries = res.data.body.series
        this.AttackIPxAxis = res.data.body.xAxis
        this.initEchartsIp()
      })
    },
    // 发起攻击次数最多的IP
    initEchartsIp() {
      const AttackIp = this.$refs.AttackIp
      if (AttackIp) {
        const myChart = echarts.init(AttackIp)
        const option = {
          color: ['#7BB1F4'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            show: false,
            axisLine: {
              show: false,
            },
          },
          yAxis: {
            type: 'category',
            data: this.AttackIPxAxis,
            axisLine: {
              show: false,
            },
          },
          series: [

            {
              name: 'IP',
              type: 'bar',
              data: this.AttackIPSeries,
            },
          ],
        }
        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      }
    },
    // 被攻击最多的资产
    initEcharts() {
      const property = this.$refs.property
      if (property) {
        const myChart = echarts.init(property)
        const option = {
          color: ['#6BA2FD'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: this.assetsxAxis,
              axisLine: {
                show: false,
              },
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: {
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
          series: [
            {
              name: '被攻击最多的资产',
              type: 'bar',
              barWidth: '25px',
              data: this.assetsSeries,

            },
          ],
        }

        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      }
    },
    // 获取攻击类型分布数据
    getTypeDistribution() {
      typeDistribution({
        serviceType: this.sType,
        applicationId: this.applicationId,
      }).then((res) => {
        this.DistributionArr = res.data.body
        this.initAttackType()
      })
    },
    // 攻击类型分布
    initAttackType() {
      const attackType = this.$refs.AttackType
      if (attackType) {
        const myChart = echarts.init(attackType)
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
              name: '攻击类型分布',
              type: 'pie',
              radius: ['40%', '55%'],
              center: ['50%', '40%'],
              data: this.DistributionArr,
              itemStyle: { //
                normal: {
                  color: function(params: any) {
                    const colorList = ['#6BA2FD', '#988AFC', '#FE6A93', '#82D184', '#FEBB69', '#CFC9C9']
                    return colorList[params.dataIndex]
                  },
                },
              },
              emphasis: {
                show: false,
                itemStyle: {
                  normal: {
                    color: function(params: any) {
                      const colorList = ['#6BA2FD', '#988AFC', '#FE6A93', '#82D184', '#FEBB69', '#CFC9C9']
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
    // 获取攻击源地区分布数据分布
    getRegionDistribution() {
      regionDistribution({
        serviceType: this.sType,
        applicationId: this.applicationId,
      }).then((res) => {
        this.regionArr = res.data.body
        this.initAttackSource()
      })
    },
    // 攻击源地区分布
    initAttackSource() {
      const AttackSource: any = this.$refs.AttackSource
      if (AttackSource) {
        const myChart = echarts.init(AttackSource)
        const option: any = {
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
              name: ' 攻击源地区分布',
              type: 'pie',
              radius: ['40%', '55%'],
              center: ['50%', '40%'],
              data: this.regionArr,
              itemStyle: { //
                normal: {
                  color: function(params: any) {
                    const colorList = ['#6BA2FD', '#988AFC', '#FE6A93', '#82D184', '#FEBB69', '#CFC9C9']
                    return colorList[params.dataIndex]
                  },
                },
              },
              emphasis: {
                show: false,
                itemStyle: {
                  normal: {
                    color: function(params: any) {
                      const colorList = ['#6BA2FD', '#988AFC', '#FE6A93', '#82D184', '#FEBB69', '#CFC9C9']
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
  updated() {
    this.initAttackType()
    this.initAttackSource()
    this.initEcharts()
    this.getUserOrderAssetByCode()
  },
  mounted() {
    this.getApplicationCheck()
  },
}

</script>

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

.titBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.gressWidth {
  width: 80%;
}

.fr {
  float: right;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.mtp {
  margin-top: 80px !important;
}

.mtp1 {
  margin-top: 20px;
}

.mtpCt {
  margin-top: 0;
}

.rightSty {
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  padding: 0 20px;
  color: #333;
  font-size: 12px;
  border-left: 1px solid #dedede;

  .ipList {
    margin-top: 20px;
  }
}

.title {
  display: inline-block;
  margin-right: 10px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
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

.bjTit {
  color: #333;
  font-weight: bold;
  font-size: 14px;
  font-style: 'normal';
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

.attackIp {
  margin-top: -50px;
}
</style>
