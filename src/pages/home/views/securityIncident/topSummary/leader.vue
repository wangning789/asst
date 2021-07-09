<template>
  <!-- 单位领导头部安全事件图表 -->
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
    <div :class="$style.incidentItemWrap">
      <div
        v-for="(item, index) in incidentCountList"
        :key="index"
      >
        <div :class="$style.leftBox">
          <p :class="$style.countBox">
            <i :class="item.icon" />
            <span>
              {{ item.name }}<br>
              <ElTooltip
                v-if="item.tooltip"
                :content="item.tooltip"
              >
                <b>{{ item.value || 0 }}</b>
              </ElTooltip>
              <b v-else>{{ item.value || 0 }}</b>
              <b v-show="item.name === '安全事件平均处置时长'"> min</b>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div :class="$style.trendWrap">
      <div :class="$style.subTitle">
        <i :class="$style.subTitleFlag" />
        <span>安全事件趋势</span>
      </div>
      <div
        id="trendLine"
        style="width: 100%; height: 250px;"
      />
    </div>
    <div :class="$style.trendWrap">
      <div :class="$style.securityIncident">
        <div :class="$style.securityIncidentItem">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件类型分布</span>
          </div>
          <div
            id="typeChart"
            style="min-width: 360px; height: 250px;"
          />
        </div>
        <div :class="$style.securityIncidentItem">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件TOP5单位</span>
          </div>
          <div v-show="topUnitData && topUnitData.length">
            <div
              v-for="(item, index) in topUnitData"
              :key="index"
            >
              <div :class="$style.ranking">
                <div :class="$style.stageHead">
                  <ElTooltip
                    :class="$style.item"
                    effect="dark"
                    :content="item.name"
                    placement="top-start"
                  >
                    <div>{{ item.name }}</div>
                  </ElTooltip>
                </div>
                <div :class="$style.count">
                  {{ item.value }}
                </div>

                <div :class="$style.column">
                  <div
                    v-show="item.leng"
                    :class="$style.columnItem"
                    :style="{ width: `${item.leng}` + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            v-show="!(topUnitData && topUnitData.length)"
            :class="$style.noData"
          >
            暂无数据
          </div>
        </div>
        <div :class="$style.securityIncidentItem">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>安全事件处置时长TOP5单位(min)</span>
          </div>
          <div v-show="topUnitTimeData && topUnitTimeData.length">
            <div
              v-for="(item, index) in topUnitTimeData"
              :key="index"
            >
              <div :class="$style.ranking">
                <div :class="$style.stageHead">
                  <ElTooltip
                    :class="$style.item"
                    effect="dark"
                    :content="item.name"
                    placement="top-start"
                  >
                    <div>{{ item.name }}</div>
                  </ElTooltip>
                </div>
                <div :class="$style.count">
                  {{ item.value }}
                </div>
                <div :class="$style.column">
                  <div
                    v-show="item.leng"
                    :class="$style.columnItem"
                    :style="{ width: `${item.leng}` + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="!(topUnitTimeData && topUnitTimeData.length)"
            :class="$style.noData"
          >
            暂无数据
          </div>
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
  getIncidentStatistic,
  getSecurityIncidentTrend,
  getIncidentStatisticByGroup,
  getTopUnit,
  getTopUnitTime,
} from '@/api/securityIncident/securityIncident'
import { DATERANGE, COLORLIST, securityTypeNumber } from '../enums'
import { ROLES } from '@/enums'
import echarts from '@/libs/echarts'
// 饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
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
      typeStatistic: [], // 安全事件类型分布
      trendLineData: [], // 安全事件趋势
      trendXLine: [], // 安全事件趋势X轴数值
      trendYLine: [], // 安全事件趋势Y轴数值
      incidentCountList: [], // 头部安全事件数目
      topUnitData: [], // 安全事件TOP5单位
      topUnitXData: [],
      topUnitYData: [],
      topUnitTimeData: [], // 安全事件处置时长TOP5单位
      topUnitTimeXData: [],
      topUnitTimeYData: [],
    }
  },
  computed: {
    DATERANGE: () => DATERANGE,
    API() {
      switch (true) {
        case this.authFit(ROLES.unitSO):
          return true
        default:
          return false
      }
    },
  },
  methods: {
    dateChange(val) {
      if (val) {
        this.getIncidentCount()
        this.getTrendLineInfo()
        this.getStatisticInfo()
        this.getTopUnit()
        this.getTopUnitTime()
      }
    },
    getStatisticInfo() {
      getIncidentStatistic(this.dateRange).then((res) => {
        if (res && res.data && res.data.body) {
          if (res && res.data && res.data.body) {
            this.totalCount = res.data.body.count
            this.typeStatistic = res.data.body.typeStatistic || []
          }
        }
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
        this.initTrendLine()
      })
    },
    getIncidentCount() {
      getIncidentStatisticByGroup(this.dateRange).then((res) => {
        if (res && res.data && res.data.body) {
          this.incidentCountList = res.data.body || []
          this.incidentCountList &&
            this.incidentCountList.length &&
            this.incidentCountList.forEach((item) => {
              securityTypeNumber.forEach((numItem) => {
                if (numItem.name === item.name) {
                  item.icon = numItem.icon
                  item.tooltip = numItem.toolTip || ''
                }
              })
            })
        }
      })
    },
    getTopUnit() {
      getTopUnit(this.dateRange).then((res) => {
        if (res && res.data && res.data.body) {
          this.topUnitData = res.data.body || []
          let number = 0
          const valueArr = this.topUnitData.map((item) => {
            if (item.value) {
              return Number(item.value)
            } else {
              return ''
            }
          }) || []
          const maxValue = valueArr.length ? Math.max(...valueArr) : 0
          this.topUnitData.map((item) => {
            if (item.value && maxValue) {
              number = Number((item.value / maxValue).toFixed(2))
              item.leng = number * 100
            }
          })
        }
      })
    },
    getTopUnitTime() {
      getTopUnitTime(this.dateRange).then((res) => {
        if (res && res.data && res.data.body) {
          this.topUnitTimeData = res.data.body || []
          let number = 0
          const valueArr = this.topUnitTimeData.map((item) => {
            if (item.value) {
              return Number(item.value)
            } else {
              return ''
            }
          }) || []
          const maxValue = valueArr.length ? Math.max(...valueArr) : 0
          this.topUnitTimeData.map((item) => {
            if (item.value && maxValue) {
              number = Number((item.value / maxValue).toFixed(2))
              item.leng = number * 100
            }
          })
        }
      })
    },
    initTypeChart() {
      const dom = document.getElementById('typeChart')
      if (dom) {
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
              center: ['25%', '40%'],
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
            show: true,
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
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
  },
  created() {
    this.getIncidentCount()
    this.getTrendLineInfo()
    this.getStatisticInfo()
    this.getTopUnit()
    this.getTopUnitTime()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/radio-group';
@import '~element-ui/packages/theme-chalk/src/radio-button';
</style>

<style lang="scss" module>
.titleText {
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.topRadio {
  float: right;
  margin-bottom: 20px;
}

.radioLabel:hover {
  span {
    color: #de4928;
  }
}

.container {
  clear: both;
  margin-bottom: 20px;
  padding: 24px;
  background: #fff;
}

.incidentItemWrap,
.securityIncident {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.securityIncidentItem {
  width: 35%;
  margin-right: 10px;
}

.securityIncidentItem:first-child {
  width: 30%;
  margin-right: 25px;
}

.noData {
  height: 250px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
  line-height: 250px;
  text-align: center;
}

.leftBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // height: 250px;
  margin: 40px;

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

.column {
  width: 200px;

  .columnItem {
    height: 7px;
    background-color: #f56c6c;
  }
}

.ranking {
  display: flex;
  align-items: center;
  margin: 25px 0;

  .stageHead {
    width: 35%;

    div {
      width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .count {
    width: 10%;
  }
}
</style>
