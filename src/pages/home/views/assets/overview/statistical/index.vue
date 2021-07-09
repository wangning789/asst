<!-- 描述 -->
<template>
  <div>
    <div
      class="el-card"
      :class="$style.bolck"
    >
      <div :class="$style.title">
        服务器资产分析
      </div>
      <div :class="$style.square">
        <div :class="$style.analysis">
          <div class="common_area_title">
            我是标题
          </div>
          <div :class="$style.assembly">
            <div
              id="typeCharts"
              :class="$style.typeCharts"
              style="width: 100%; height: 245px;"
            />
          </div>
        </div>
        <div :class="$style.analysis">
          <div class="common_area_title">
            协议类型分布
          </div>
          <div>
            <div
              id="ladderTree"
              :class="$style.ladderTree"
              style="width: 100%; height: 245px;"
            />
          </div>
        </div>
        <div :class="$style.analysis">
          <div class="common_area_title">
            组件类型分布
          </div>
          <div
            v-for="(item,index) in progressBar"
            :key="index"
            :class="$style.poper"
          >
            <div :class="$style.mox">
              <div :class="$style.tiile">
                {{ item.tiile }}
              </div>
              <div :class="$style.under">
                <div
                  :class="$style.above"
                  :style="{width:item.percentage+'%'}"
                />
              </div>
              <div :class="$style.number">
                {{ item.number }}
              </div>
              <!-- <div></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
// import echarts from 'echarts'
import * as echarts from 'echarts'
export default {
  props: {},
  components: {},
  data() {
    return {
      total: 20,
      myChart: null,
      progressBar: [
        {
          tiile: '123',
          number: 100,
          percentage: 100,
        },
        {
          tiile: '23',
          number: 80,
          percentage: 80,
        },
        {
          tiile: '23',
          number: 70,
          percentage: 70,
        },
        {
          tiile: '23',
          number: 50,
          percentage: 50,
        },
        {
          tiile: '23',
          number: 22,
          percentage: 22,
        },
      ],
      msg: [
        {
          name: 'nodeA', // First tree
          value: 10,
          children: [
            {
              name: 'nodeAa', // First leaf of first tree
              value: 4,
            },
            {
              name: 'nodeAb', // Second leaf of first tree
              value: 6,
            },
          ],
        },
        {
          name: 'nodeB', // Second tree
          value: 20,
          children: [
            {
              name: 'nodeBa', // Son of first tree
              value: 20,
              children: [
                {
                  name: 'nodeBa1', // Granson of first tree
                  value: 20,
                },
              ],
            },
          ],
        },
      ],
    }
  },
  computed: {},
  watch: {},
  methods: {
    getTypeChart() {
      const dom = document.getElementById('typeCharts')
      const myChart = echarts.init(dom)
      const option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          right: 0,
          top: 'center',
          itemWidth: 13,
          itemHeight: 13,
          formatter(name) {
            const arr = ['{b|' + name + '}', '{a|' + 20 + '%}']
            return arr.join('')
          },
          textStyle: {
            rich: {
              a: {
                padding: [0, 0, 0, 16],
                fontSize: 16,
                color: '#666666',
              },
              b: {
                padding: [0, 0, 0, 16],
                fontSize: 16,
                color: '#666666',
              },
            },
          },
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '38%',
          style: {
            text: 7500,
            textAlign: 'center',
            fill: '#666666',
            fontSize: 34,
          },
        },
        title: {
          //  show: this.total !== 0,
          text: '总数',
          left: 'center',
          top: '55%',
          textStyle: {
            color: '#999999',
            fontSize: 14,
            align: 'center',
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorlist = ['#73C1EE', '#8AD08A']
                  return colorlist[params.dataIndex]
                },
              },
            },
            label: {
              show: false,
              position: 'center',
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
            ],
          },
        ],
      }
      myChart.setOption(option, true)
    },

    // 梯形树图表
    ladderTree() {
      const dom = document.getElementById('ladderTree')
      const myChart = echarts.init(dom)
      const option = {
        visualMap: { // 有下面两种写法
          show: false,

          color: ['#5A8DE6'], // 此种写法是echart2的写法，不推荐使用，但是可以使用，能生效
          // inRange: {     //这种写法才是目前主流的写法
          //     color: ['#5A8DE6', '#0091FE', '#0080FF', '#1751B2', '#013998'],
          // },
        },
        series: [{
          breadcrumb: { show: false },
          type: 'treemap',
          data: this.msg,
        }],
      }
      myChart.setOption(option, true)
    },
  },

  mounted() {
    this.getTypeChart()
    this.ladderTree()
  },
}
</script>

<style lang="scss" module>
.bolck {
  width: 100%;
  height: 318px;
  margin-top: 16px;
}

.title {
  margin-top: 20px;
  margin-left: 16px;
  font-weight: bold;
  font-size: 16px;
}

.square {
  display: flex;
  height: 100%;
}

.analysis {
  flex: 1;
  height: 100%;

  .assembly {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

.typeCharts {
  position: absolute;
  left: -100px;
}

.map {
  width: 300px;
  height: 300px;
}

.poper {
  width: 86%;
  margin: auto;
}

.mox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}

.under {
  width: 80%;
  height: 8px;
  background-color: #e9e9e9;
  border-radius: 15px;
}

.above {
  height: 100%;
  background-color: #5a8de6;
  border-radius: 15px;
}

.tiile {
  width: 10%;
  font-size: 12px;
}

.number {
  width: 10%;
  padding-left: 20px;
  // padding: 0 20px;
  // width: 42px;
  font-weight: bold;
  font-size: 16px;
}
</style>
