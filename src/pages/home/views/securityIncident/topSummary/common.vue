
<template>
  <!-- 除去单位领导外其他角色头部安全事件图表 -->
  <div>
    <div :class="$style.container">
      <div :class="$style.titleText">
        安全事件概况
      </div>
      <ElRadioGroup
        v-model="dateRange"
        size="mini"
        fill="#DE4928"
        text-color="#fff"
        :class="$style.topRadio"
        @change="dateChange"
      >
        <ElRadioButton
          v-for="item in DATERANGE"
          :key="item.id"
          :label="item.id"
          :class="$style.radioLabel"
        >
          {{ item.label }}
        </ElRadioButton>
      </ElRadioGroup>
      <div :class="$style.chartWrap">
        <div :class="$style.leftBox">
          <p :class="$style.countBox">
            <i class="i-shangbaoanquanshijianzongshu" />
            <span>
              安全事件总数<br>
              <ElTooltip
                content="未确认的安全事件不计入总数"
              ><b>{{ totalCount }}</b></ElTooltip>
            </span>
          </p>
        </div>
        <div :class="$style.chart">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件上报来源分析</span>
          </div>
          <div
            id="sourceChart"
            style="height: 250px;"
          />
        </div>

        <div
          v-show="API !== ROLES.unitSO"
          :class="$style.chart"
        >
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件类型分布</span>
          </div>
          <div
            id="typeChart"
            style="height: 250px;"
          />
        </div>
        <div
          v-show="API === ROLES.unitSO"
          :class="$style.chart"
        >
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件趋势</span>
          </div>
          <div
            id="trendLine"
            style="height: 300px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ElRadioGroup from 'element-ui/lib/radio-group'
import ElRadioButton from 'element-ui/lib/radio-button'
import {
  getAllIncidentStatistic,
  getIncidentStatisticByView,
  getSecurityIncidentTrend,
} from '@/api/securityIncident/securityIncident'
import { DATERANGE, COLORLIST } from '../enums'
import { ROLES } from '@/enums'
import echarts from '@/libs/echarts'
// 饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  components: {
    ElRadioGroup,
    ElRadioButton,
  },
  data() {
    return {
      dateRange: 7,
      totalCount: 0,
      sourceStatistic: [], // 安全事件上报来源分析图数据
      typeStatistic: [], // 安全事件类型分布
      trendLineData: [], // 安全事件趋势
      trendXLine: [], // 安全事件趋势X轴数值
      trendYLine: [], // 安全事件趋势Y轴数值
    }
  },
  computed: {
    DATERANGE: () => DATERANGE,
    ROLES: () => ROLES,
    API() {
      switch (true) {
        case this.authFit(ROLES.unitSO):
          return ROLES.unitSO
        case this.authFit(ROLES.communicationLLY):
          return ROLES.communicationLLY
        default:
          return ''
      }
    },
    getIncidentStatistic() {
      return this.authFit(ROLES.unitSO)
        ? getIncidentStatisticByView
        : getAllIncidentStatistic
    },
  },
  methods: {
    dateChange(val) {
      if (val) {
        this.getStatisticInfo()
        this.API === ROLES.unitSO && this.getTrendLineInfo()
      }
    },
    getStatisticInfo() {
      this.getIncidentStatistic(this.dateRange).then((res) => {
        if (res && res.data && res.data.body) {
          this.totalCount = res.data.body.count
          this.sourceStatistic = res.data.body.sourceStatistic || []
          this.typeStatistic = res.data.body.typeStatistic || []
        }
        this.initSourceChart()
        this.initTypeChart()
      })
    },
    getTrendLineInfo() {
      getSecurityIncidentTrend(this.dateRange).then((res) => {
        if (res && res.data && res.data.body) {
          this.trendLineData = res.data.body || []
          this.trendXLine =
            (this.trendLineData.length &&
              this.trendLineData.map((item) => {
                return item.name
              })) ||
            []
          this.trendYLine =
            (this.trendLineData.length &&
              this.trendLineData.map((item) => {
                return item.value
              })) ||
            []
        }
        this.trendLineData && this.trendLineData.length && this.initTrendLine()
      })
    },
    initSourceChart() {
      const dom = document.getElementById('sourceChart')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.sourceStatistic.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          left: '50%',
          y: 'center',
          data: this.sourceStatistic,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['25%', '45%'],
            label: {
              show: false,
            },
            data: this.sourceStatistic,
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorList = COLORLIST
                  return colorList[params.dataIndex]
                },
              },
            },
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
    },
    initTypeChart() {
      const dom = document.getElementById('typeChart')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.typeStatistic.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          left: '50%',
          y: 'center',
          data: this.typeStatistic,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['25%', '45%'],
            label: {
              show: false,
            },
            data: this.typeStatistic,
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorList = COLORLIST
                  return colorList[params.dataIndex]
                },
              },
            },
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
    },
    initTrendLine() {
      const dom = document.getElementById('trendLine')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.trendLineData.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        xAxis: {
          type: 'category',
          data: this.trendXLine,
          axisLine: {
            show: this.trendLineData.length,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        lineStyle: {
          color: '#0e9cff',
        },
        tooltip: {
          trigger: 'axis',
        },
        boundaryGap: false,
        series: [
          {
            data: this.trendYLine,
            type: 'line',
            areaStyle: {},
          },
        ],
      }
      myChart.setOption(option, true)
    },
  },
  created() {
    this.getStatisticInfo()
    this.API === ROLES.unitSO && this.getTrendLineInfo()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/radio-group';
@import '~element-ui/packages/theme-chalk/src/radio-button';
</style>

<style lang="scss" module>
.container {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
}

.chartWrap {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.titleText {
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.topRadio {
  float: right;
  margin-left: 20px;
}

.radioLabel:hover {
  span {
    color: #de4928;
  }
}

.leftBox {
  display: flex;
  flex: 2;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;

  .countBox {
    margin: auto;

    i {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-top: 10px;
      margin-right: 24px;
      color: $colorTheme;
      font-size: 26px;
      vertical-align: top;
    }

    span {
      display: inline-block;
      color: #333;
      font-weight: 400;
      font-size: 16px;
      line-height: 28px;
      text-align: left;
    }

    b {
      color: #333;
      font-weight: bold;
      font-size: 20px;
    }
  }
}

.subTitle {
  height: $gapNormal;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: $medium;
  line-height: $gapNormal;

  .subTitleFlag {
    display: inline-block;
    width: 4px;
    height: 12px;
    margin-right: 10px;
    background-color: #f8902a;
  }
}

.noData {
  height: 250px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
  line-height: 250px;
  text-align: center;
}

.chart {
  flex: 4;
}
</style>
