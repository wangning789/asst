<template>
  <div>
    <div class="leaderTaskOverview">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <div :class="$style.gridLeft">
            <h4>任务统计</h4>
            <div :class="$style.totalTask">
              <div
                id="typeChart"
                style="width: 60%; height: 206px;"
              />
              <div :class="$style.statistics">
                <div :class="$style.max">
                  <div :class="$style.block" />
                  <div>
                    <div>任务总数</div>
                    <div :class="$style.number">
                      {{ getNumber.totalNum }}
                    </div>
                  </div>
                </div>
                <div :class="$style.max">
                  <div :class="$style.blockTwo" />
                  <div>
                    <div>未完成数</div>
                    <div :class="$style.number">
                      {{ getNumber.unFinishNum }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ElCol>

        <ElCol :span="16">
          <div :class="$style.griTopRight">
            <ElRow :gutter="20">
              <div
                class="all"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 60px;
"
              >
                <h4>任务分析</h4>
                <div>
                  <ElRadioGroup
                    v-model="changeVal"
                    size="mini"
                    fill="#DE4928"
                    text-color="#fff"
                    @change="clickChange()"
                  >
                    <ElRadioButton
                      :class="$style.radioLabel"
                      label="全部"
                    />
                    <ElRadioButton
                      :class="$style.radioLabel"
                      label="未完成"
                    />
                  </ElRadioGroup>
                </div>
              </div>
              <ElCol :span="11">
                <div class="top">
                  <div
                    id="taskAnalysis"
                    style="height: 206px;"
                  />
                </div>
              </ElCol>
              <ElCol :span="13">
                <div :class="$style.securityIncidentItem">
                  <div :class="$style.subTitle">
                    <i :class="$style.subTitleFlag" />
                    <span>任务数TOP5单位</span>
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
              </ElCol>
            </ElRow>
          </div>
        </ElCol>
      </ElRow>
      <ElRow
        :gutter="20"
        style="margin-top: 20px;"
      >
        <ElCol :span="12">
          <div :class="$style.gridLeft">
            <h4>任务处置率最高 TOP5 成员单位</h4>

            <div
              id="hightDisposalRate"
              style="height: 320px;"
            />
          </div>
        </ElCol>
        <ElCol :span="12">
          <div :class="$style.gridLeft">
            <h4>任务处置率最低 TOP5 成员单位</h4>

            <div
              id="lowestDisposalRate"
              style="height: 320px;"
            />
          </div>
        </ElCol>
      </ElRow>

      <ElRow
        :gutter="20"
        style="margin-top: 20px;"
      >
        <ElCol :span="12">
          <div :class="$style.longTime">
            <div :class="$style.securityIncidentItem">
              <div :class="$style.subTitle">
                <i :class="$style.subTitleFlag" />
                <span>任务处置平均时长最长 TOP5 成员单位（min）</span>
              </div>
              <div v-show="LongestTime && LongestTime.length">
                <div
                  v-for="(item, index) in LongestTime"
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
                v-show="!(LongestTime && LongestTime.length)"
                :class="$style.noData"
              >
                暂无数据
              </div>
            </div>
          </div>
        </ElCol>

        <ElCol :span="12">
          <div :class="$style.longTime">
            <div :class="$style.securityIncidentItem">
              <div :class="$style.subTitle">
                <i :class="$style.subTitleFlag" />
                <span>任务处置平均时长最短 TOP5 成员单位（min）</span>
              </div>
              <div v-show="shortestTime && shortestTime.length">
                <div
                  v-for="(item, index) in shortestTime"
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
                v-show="!(shortestTime && shortestTime.length)"
                :class="$style.noData"
              >
                暂无数据
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script >
import {
  getNumber,
  getType,
  taskNum,
  LongestTime,
  hightDisposalRate,
  lowestDisposalRate,
  shortestTime,
  getCurrency,
} from '@/api/leaderTaskOverView/leaderTaskOverView'
import echarts from '@/libs/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/bar'
export default {
  data() {
    return {
      changeVal: '全部',
      names: '',
      paramData: { type: 0, allOrUnfinish: 100 },
      shortestTime: [], // 最短
      LongestTime: [], // 最长
      hightDisposalRate: [], // 处置率最高
      hightDisposalRateName: [],
      lowDisposalRate: [], // 处置率最低
      lowDisposalRateName: [], // 处置率最低
      topUnitData: [],
      dataType: [],
      type: 0,
      tongyongType: 0,
      louDongType: 0,
      allOrUnfinish: 100,
      getNumber: { totalNum: '', unFinishNum: '', ratio: '' },
    }
  },
  watch: {
    dataType() {
      this.taskAnalysis()
    },
    getNumber() {
      this.getTypeChart()
    },
    hightDisposalRate() {
      this.getHightDisposalRatem()
    },
    lowDisposalRate() {
      this.getLowestDisposalRate()
    },
    topUnitData() {
      if (this.param) {
        this.getCurrency()
      }
    },
  },
  methods: {
    // 任务数量统计
    getTaskNum() {
      getNumber().then((res) => {
        res.data.body.name = '任务完成率'
        this.getNumber = res.data.body
      })
      this.getTypeChart()
    },

    // 任务分析
    getTypenum() {
      getType(this.type).then((res) => {
        this.dataType = res.data.body || []
        let sum = 0
        this.dataType.forEach((item) => {
          const newVal = parseInt(item.value)
          sum += newVal
        })
        this.dataType.map((item) => {
          item.names =
            item.name +
            ` ${item.value}, ` +
            ((item.value / sum) * 100).toFixed(0) +
            '%'
          this.names = item.names
        })
      })
      this.taskAnalysis()
    },

    // 任务数TOP5单位
    leaderboard() {
      taskNum(this.type, this.allOrUnfinish).then((res) => {
        if (res && res.data && res.data.body) {
          this.topUnitData = res.data.body.slice(0, 5) || []
          let number = 0
          const valueArr =
            this.topUnitData.map((item) => {
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

    // 任务处置平均时长最长 TOP5 成员单位
    longest() {
      LongestTime().then((res) => {
        if (res && res.data && res.data.body) {
          this.LongestTime = res.data.body.slice(0, 5) || []
          let number = 0
          const valueArr =
            this.LongestTime.map((item) => {
              if (item.value) {
                return Number(item.value)
              } else {
                return ''
              }
            }) || []
          const maxValue = valueArr.length ? Math.max(...valueArr) : 0
          this.LongestTime.map((item) => {
            if (item.value && maxValue) {
              number = Number((item.value / maxValue).toFixed(2))
              item.leng = number * 100
            }
          })
        }
      })
    },

    // 任务处置平均时长最短 TOP5 成员单位
    getShortestTime() {
      shortestTime().then((res) => {
        if (res && res.data && res.data.body) {
          this.shortestTime = res.data.body.slice(0, 5) || []
          let number = 0
          const valueArr =
            this.shortestTime.map((item) => {
              if (item.value) {
                return Number(item.value)
              } else {
                return ''
              }
            }) || []
          const maxValue = valueArr.length ? Math.max(...valueArr) : 0
          this.shortestTime.map((item) => {
            if (item.value && maxValue) {
              number = Number((item.value / maxValue).toFixed(2))
              item.leng = number * 100
            }
          })
        }
      })
    },

    // 任务处置率最高 TOP5 成员单位
    getHightDisposal() {
      hightDisposalRate().then((res) => {
        if (res && res.data && res.data.body) {
          this.hightDisposalRate = res.data.body.slice(0, 5) || []
          // this.hightDisposalRate.forEach(item=>{
          //   item.value=item.value+"%"
          //   console.log(item.value);
          // })
          this.hightDisposalRateName = []
          res.data.body.map((item) => {
            this.hightDisposalRateName.push(item.name)
          })
        }
      })
      this.getHightDisposalRatem()
    },

    // 任务处置率最低 TOP5 成员单位
    getLowDisposal() {
      lowestDisposalRate().then((res) => {
        if (res && res.data && res.data.body) {
          this.lowDisposalRate = res.data.body.slice(0, 5) || []
          this.lowDisposalRateName = []
          res.data.body.map((item) => {
            this.lowDisposalRateName.push(item.name)
          })
        }
      })
      this.getLowestDisposalRate()
    },

    getCurrency() {
      if (this.data.type && this.data.allOrUnfinish) {
        getCurrency(this.data.type, this.data.allOrUnfinish).then((res) => {
          this.topUnitData = res.data.body || []
          let number = 0
          const valueArr =
            this.topUnitData.map((item) => {
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
        })
      }
    },
    getYunWei() {
      getCurrency(2, 200).then((res) => {
        this.topUnitData = res.data.body
      })
    },

    getTypeChart() {
      const dom = document.getElementById('typeChart')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: !this.getNumber.totalNum,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },

        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}',
        },
        color: ['#7AB956', '#CCD4D8'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['45%', '45%'],
            label: {
              show: true,
              position: 'center',
              normal: {
                position: 'center',
                show: true,
                formatter: !this.getNumber.totalNum
                  ? ''
                  : '{total|' +
                    this.getNumber.ratio +
                    '}' +
                    '\n\r' +
                    '{active|' +
                    this.getNumber.name +
                    '}',
                color: '#fff',
                fontSize: 20,
                rich: {
                  total: {
                    fontSize: 22,
                    fontFamily: '微软雅黑',
                    color: '#7AB956',
                  },
                  active: {
                    fontFamily: '微软雅黑',
                    fontSize: 14,
                    color: '#6c7a89',
                    lineHeight: 30,
                  },
                },
              },
            },
            emphasis: {},
            labelLine: {
              show: false,
            },
            data: [
              { value: this.getNumber.totalNum, name: '任务总数' },
              { value: this.getNumber.unFinishNum, name: '未完成任务' },
              { value: this.getNumber.ratio, name: '任务完成率' },
            ],
          },
        ],
      }
      myChart.setOption(option, true)
    },
    taskAnalysis() {
      const dom = document.getElementById('taskAnalysis')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.dataType.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        calculable: true,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          x: '25%',
          y: 'center',
          left: '60%',
          data: this.dataType,
        },
        color: ['#66D8A6', '#A6CEE3', '#FFAE77'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['25%', '45%'],
            label: {
              show: false,
            },
            emphasis: {
              label: {
                fontSize: '20',
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.dataType,
          },
        ],
      }
      myChart.clear()
      myChart.setOption(option, true)
      myChart.off('click')
      myChart.on('click', (param) => {
        this.data = param.data
        if (param.data.name === '通用运维任务') {
          this.getCurrency()
        } else if (param.data.name === '漏洞修复任务') {
          this.getCurrency()
        }
      })
    },

    getHightDisposalRatem() {
      const dom = document.getElementById('hightDisposalRate')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.hightDisposalRate.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          formatter: (params) => {
            const res = params.data.name + params.data.value + '%' // 可以在这个方法中做改变
            return res
          },
        },
        xAxis: [
          {
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#CCCCCC',
              },
              show: true,
            },

            axisLine: {
              show: this.hightDisposalRate.length,
              lineStyle: {
                color: '#CCCCCC',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#000000',
              },
              formatter: function(value) {
                // 关键代码
                let res = value
                if (res.length > 11) {
                  res = res.substring(0, 10) + '...'
                }
                return res
              },
            },
            data: this.hightDisposalRateName,
          },
        ],
        yAxis: [
          {
            max: this.maxValue,
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#999999',
              },
              show: true,
            },
            axisLine: {
              show: this.hightDisposalRate.length,
              lineStyle: {
                color: '#999999',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
            },
          },
        ],
        series: [
          {
            type: 'bar',
            data: this.hightDisposalRate,
            barWidth: 30,
            itemStyle: {
              normal: {
                color: ['#7AB956'],

                label: {
                  formatter: '{c}%', // 显示百分号
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: {
                    // 数值样式
                    color: 'black',
                    fontSize: 14,
                  },
                },
              },
            },
          },
        ],
      }
      myChart.setOption(option, true)
    },
    getLowestDisposalRate() {
      const dom = document.getElementById('lowestDisposalRate')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.lowDisposalRate.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          formatter: (params) => {
            const res = params.data.name + params.data.value + '%' // 可以在这个方法中做改变
            return res
          },
        },
        xAxis: [
          {
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#CCCCCC',
              },
              show: true,
            },

            axisLine: {
              show: this.lowDisposalRate.length,
              lineStyle: {
                color: '#CCCCCC',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              show: true,
              formatter: function(value) {
                // 关键代码
                let res = value
                if (res.length > 11) {
                  res = res.substring(0, 10) + '...'
                }
                return res
              },
              textStyle: {
                color: '#000000',
              },
            },
            data: this.lowDisposalRateName,
          },
        ],
        yAxis: [
          {
            max: this.maxValue,
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#999999',
              },
              show: true,
            },
            axisLine: {
              show: this.lowDisposalRate.length,
              lineStyle: {
                color: '#999999',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
            },
          },
        ],
        series: [
          {
            type: 'bar',
            data: this.lowDisposalRate,
            barWidth: 30,
            itemStyle: {
              normal: {
                color: ['#7AB956'],

                label: {
                  formatter: '{c}%', // 显示百分号

                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: {
                    // 数值样式
                    color: 'black',
                    fontSize: 14,
                  },
                },
              },
            },
          },
        ],
      }
      myChart.setOption(option, true)
    },
    clickChange() {
      this.changeVal === '全部' ? this.all() : this.undone()
    },
    all() {
      this.type = 0
      this.allOrUnfinish = 100
      this.getTypenum()
      this.leaderboard()
    },
    undone() {
      this.type = 0
      this.allOrUnfinish = 200
      getType(1).then((res) => {
        this.dataType = res.data.body || []
        let sum = 0
        this.dataType.forEach((item) => {
          const newVal = parseInt(item.value)
          sum += newVal
        })
        this.dataType.map((item) => {
          item.names =
            item.name +
            ` ${item.value}, ` +
            ((item.value / sum) * 100).toFixed(0) +
            '%'
          this.names = item.names
        })
      })
      this.taskAnalysis()
      this.leaderboard()
    },
  },
  created() {
    this.$nextTick(function() {
      this.getLowDisposal()
      this.getShortestTime()
      this.getHightDisposal()
      this.getTypenum()
    })
  },
  mounted() {
    this.getTaskNum()
    this.taskAnalysis()
    this.leaderboard()
    this.longest()
  },
}
</script>
<style lang="scss" module>
.leaderTaskOverview {
  background: #fff;
}

.gridLeft {
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 366px;
  padding: 5px 15px;
  background: #fff;
}

.totalTask {
  display: flex;
}

.griTopRight {
  box-sizing: border-box;
  width: 100%;
  height: 366px;
  padding: 5px 15px;
  background: #fff;
}

.back {
  width: 6px;
  height: 14px;
  margin-right: 5px;
  background: #dd4927;
}

.securityIncidentItem {
  margin-right: 10px;
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
    margin-right: 5px;
    background: #dd4927;
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
    width: 250px;

    div {
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .count {
    width: 16%;
  }
}

.longTime {
  box-sizing: border-box;
  height: 376px;
  padding: 20px;
  background: #fff;
}

.statistics {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.max {
  display: flex;
  margin-top: 20px;
  color: #333;
  font-size: 16px;
}

.block {
  width: 14px;
  height: 14px;
  margin-right: 15px;
  background: #7ab956;
}

.blockTwo {
  width: 14px;
  height: 14px;
  margin-right: 15px;
  background: #ccd4d8;
}

.number {
  margin-top: 15px;
  font-weight: bold;
  font-size: 28px;
}

.radioLabel:hover {
  span {
    color: #de4928;
  }
}
</style>
