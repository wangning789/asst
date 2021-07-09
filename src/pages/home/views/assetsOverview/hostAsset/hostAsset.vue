<template>
  <div class="max">
    <div
      id="chartPie"
      class="pie-wrap"
    />
    <div
      id="chartPieTwo"
      class="pie-wrap1"
    />
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // 引入主题
export default {
  props: {
    hostAssets: {
      type: Array,
      default: Array,
    },
    networkHostAssets: {
      type: Array,
      default: Array,
    },
  },
  components: {},
  data() {
    return {
      num: 20,
      chartPie: null,
      chartPieTwo: null,
      show: true,
    }
  },
  computed: {},
  watch: {
    hostAssets(val) {
      if (val) {
        this.drawPieChartabcd()
      }
    },
    networkHostAssets(val) {
      if (val) {
        this.drawPieChartabc()
      }
    },
  },
  methods: {
    drawPieChartabcd() {
      const colorList = [
        '#8AD08A',
        '#73C1EE',
        '#FCB970',
        '#6CA5F8',
        '#EF7C7C',
        '#00ff77',
      ]
      const mytextStyle = {
        color: '#8AD08A',
        fontSize: 18,
      }
      const mylabel = {
        show: true,
        position: 'right',
        offset: [30, 40],
        textStyle: mytextStyle,
      }
      this.chartPie = echarts.init(
        document.getElementById('chartPie'),
        'macarons'
      )

      this.chartPie.setOption({
        title: {
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          position: ['50%', '50%'],
        },
        color: colorList,
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: this.hostAssets,
            label: {
              normal: {
                position: 'center',
                show: mylabel.show,
                formatter: '{active|部署网络环境}',
                color: '#4c4a4a',
                fontSize: 20,
                rich: {
                  active: {
                    fontFamily: '微软雅黑',
                    fontSize: 13,
                    color: '#454c5c',
                    lineHeight: 30,
                  },
                },
              },
            },
          },
        ],
      })
    },

    drawPieChartabc() {
      const colorList = [
        '#8AD08A',
        '#73C1EE',
        '#FCB970',
        '#6CA5F8',
        '#EF7C7C',
        '#00ff77',
      ]
      const mytextStyle = {
        color: '#333',
        fontSize: 18,
      }
      const mylabel = {
        show: true,
        position: 'right',
        offset: [30, 40],
        formatter: '{b} : {c} ({d}%)',
        textStyle: mytextStyle,
      }

      this.chartPieTwo = echarts.init(
        document.getElementById('chartPieTwo'),
        'macarons'
      )
      this.chartPieTwo.setOption({
        title: {
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        color: colorList,
        series: [
          {
            name: 'b',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: this.networkHostAssets,
            label: {
              normal: {
                position: 'center',
                show: mylabel.show,
                formatter: '{active|托管位置}',
                color: '#4c4a4a',
                fontSize: 20,
                rich: {
                  active: {
                    fontFamily: '微软雅黑',
                    fontSize: 13,
                    color: '#454c5c',
                    lineHeight: 30,
                  },
                },
              },
            },
          },
        ],
      })
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.chartPie.resize()
      this.chartPieTwo.resize()
    })
    this.drawPieChartabcd()
    this.drawPieChartabc()
  },
}
</script>
<style scoped lang='scss'>
.max {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.pie-wrap {
  width: 49%;
  height: 250px;
}

.pie-wrap1 {
  width: 49%;
  height: 250px;
}
</style>
