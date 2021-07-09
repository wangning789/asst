
<template>
  <div>
    <div :class="$style.taskWrap">
      <div :class="$style.box">
        <div :class="$style.survey">
          <div :class="$style.name">
            <div>任务统计</div>
          </div>
          <div>
            <div class="block">
              <ElDatePicker
                v-model="value1"
                value1-format="yyyy-MM-dd hh:mm:ss"
                :picker-options="pickerBeginDateBefore"
                :clearable="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="submitChange"
              />
            </div>
          </div>
        </div>
        <div>
          <div>
            <ElRadioGroup
              v-model="checkValue"
              size="mini"
              fill="#DE4928"
              text-color="#fff"
              @change="clickChange"
            >
              <!-- @click="clickall"  @click="clickunfinish" -->
              <ElRadioButton label="全部" /><ElRadioButton label="未完成" />
            </ElRadioGroup>
          </div>
        </div>
      </div>
      <div :class="$style.echart">
        <div
          id="sourceChart"
          :class="$style.sourceChart"
        />
        <div
          v-show="total !== 0"
          :class="$style.statistics"
        >
          <div :class="$style.max">
            <div :class="$style.block" />
            <div>
              <div>任务总数</div>
              <div :class="$style.number">
                {{ total }}
              </div>
            </div>
          </div>
          <div :class="$style.max">
            <div :class="$style.blockTwo" />
            <div>
              <div>未完成数</div>
              <div :class="$style.number">
                {{ unfinishedQuantity }}
              </div>
            </div>
          </div>
        </div>
        <div
          id="chartPiec"
          :class="$style.columnara"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import * as echarts from 'echarts'
import ElRadioGroup from 'element-ui/lib/radio-group'
import ElRadioButton from 'element-ui/lib/radio-button'
import { statistics, taskProcess } from '@/api/roleOverview/missionOverview'
export default {
  components: { ElRadioGroup, ElRadioButton },
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      flie: true,
      maxValue: 0,
      dataType: 'all',
      name: [],
      number: [],
      total: 0,
      quantityCompleted: 0,
      unfinishedQuantity: 0,
      Completed: 0,
      defaultvalue: [

      ],
      value1: [],
      sourceStatistic: [], // 安全事件上报来源分析图数据
      checkValue: '全部',
      chartPiec: null,
    }
  },
  computed: {},
  watch: {
    value1(val) {
      if (val.length > 1 && this.flie) {
        this.statistics(val)
        this.taskProcess(val)
        this.flie = false
      }
    },
  },
  methods: {
    submitChange() {
      const nowDate = this.value1[0]
      const y = nowDate.getFullYear()
      const m = nowDate.getMonth() + 1
      const d = nowDate.getDate()
      const oneDate = `${y}-${m}-${d}`
      const nowTwoDate = this.value1[1]
      const yy = nowTwoDate.getFullYear()
      const mm = nowTwoDate.getMonth() + 1
      const dd = nowTwoDate.getDate()
      const twoDate = `${yy}-${mm}-${dd}`
      this.value1[0] = oneDate
      this.value1[1] = twoDate
      this.statistics(this.value1)
      this.taskProcess(this.value1)
    },
    clickChange() {
      this.checkValue === '全部' ? this.clickall() : this.clickunfinish()
    },
    clickall() {
      this.dataType = 'all'
      this.taskProcess(this.value1)
    },
    clickunfinish() {
      this.dataType = 'unfinish'
      this.taskProcess(this.value1)
    },
    statistics(value1) {
      statistics({ beginTime: value1[0], endTime: value1[1] }).then((res) => {
        this.defaultvalue = res.data.body
        this.defaultvalue.map((item) => {
          if (item.statistical_type === 'notFinished') {
            item.value = item.statistical_value
            item.name = item.statistical_title
            this.unfinishedQuantity = item.statistical_value
          } else if (item.statistical_type === 'finished') {
            this.quantityCompleted = item.statistical_value
          } else {
            item.value = item.statistical_value
            item.name = item.statistical_title
            this.total = item.statistical_value
          }
        })
        if (this.total === 0) {
          this.Completed = 0
        } else {
          this.Completed = (
            (this.quantityCompleted / this.total) *
            100
          ).toFixed(0)
        }
        this.defaultvalue.splice(2, 1)
        this.initSourceChart()
      })
    },

    taskProcess(value1) {
      taskProcess({
        beginTime: value1[0],
        endTime: value1[1],
        dataType: this.dataType,
      }).then((res) => {
        this.name = []
        this.number = []
        res.data.body.map((item) => {
          this.name.push(item.statistical_title)
          this.number.push(item.statistical_value)
        })
        this.maxValue = this.number.length ? Math.max(...this.number) : 0
        this.getdata()
      })
    },

    initSourceChart() {
      if (this.total === 0) {
        this.defaultvalue.splice(0)
      }
      const colorList = ['#7AB956', '#CCD4D8']
      const dom = document.getElementById('sourceChart')
      const myChart = echarts.init(dom)
      const option = {
        // title: {
        //   show: this.total === 0,
        //   text: '暂无数据',
        //   left: 'center',
        //   top: 'center',
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}',
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: this.total === 0 ? '' : `${this.Completed}%`,
            textAlign: 'center',
            fill: '#7AB956',
            fontSize: 26,
            // fontWeight:700
          },
        },
        title: {
          //  show: this.total !== 0,
          text: this.total === 0 ? '暂无数据' : '已完成',
          left: 'center',
          top: this.total === 0 ? '45%' : '50%',
          textStyle: {
            color: this.total === 0 ? '#333333' : '#6c7a89',
            fontSize: this.total === 0 ? 18 : 14,
            align: 'center',
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false,
                position: 'center',
              },

            },
            data: this.defaultvalue,
            color: colorList,
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
    getdata() {
      this.chartPiec = echarts.init(
        document.getElementById('chartPiec'),
        'macarons'
      )
      this.chartPiec.setOption({
        title: {
          show: this.name.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {},
        grid: {
          right: '2%',
          top: '7%',
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
              show: this.name.length,
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
            },
            data: this.name,
          },
        ],
        yAxis: [
          {
            max: this.maxValue,
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#CCCCCC',
              },
              show: true,
            },
            axisLine: {
              show: this.name.length,
              lineStyle: {
                color: '#CCCCCC',
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: 'bar',
            data: this.number,
            // data: this.value,
            barWidth: 30,
            // center:[30,30],
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorlist = [
                    '#8AD08A',
                    '#73C1EE',
                    '#FCB970',
                    '#6CA5F8',
                    '#EF7C7C',
                    '#00ff77',
                    '#7AB956',
                    '#52A7E1',
                    '#F79267',
                  ]
                  return colorlist[params.dataIndex]
                },
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: {
                    // 数值样式
                    color: 'black',
                    fontSize: 16,
                  },
                },
              },
            },
          },
        ],
      })
    },
  },
  created() {
    const nowDate = new Date()
    const y = nowDate.getFullYear()
    const m = nowDate.getMonth() + 1
    const d = nowDate.getDate()
    const oneDate = `${y}-${m}-01`
    const twoDare = `${y}-${m}-${d}`
    this.value1.unshift(oneDate)
    this.value1.push(twoDare)

    this.$nextTick(function() {
      this.initSourceChart()
      this.getdata()
    })
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/radio-group';
@import '~element-ui/packages/theme-chalk/src/radio-button';
</style>
<style lang="scss" module>
.taskWrap {
  padding: $gapNormal;
  background-color: #fff;
  border-radius: 10px;
}

.box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.name {
  margin-right: 50px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.survey {
  display: flex;
}

.echart {
  display: flex;
  align-items: center;
}

.sourceChart {
  width: 25%;
  min-width: 180px;
  height: 300px;
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

.number {
  margin-top: 15px;
  font-weight: bold;
  font-size: 28px;
}

.blockTwo {
  width: 14px;
  height: 14px;
  margin-right: 15px;
  background: #ccd4d8;
}

.statistics {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 25vh;
  margin-left: $gapNormal;
}

.columnara {
  width: 50%;
  height: 320px;
  margin-left: auto;
}

.radioLabel:hover {
  span {
    color: #de4928;
  }
}
</style>
