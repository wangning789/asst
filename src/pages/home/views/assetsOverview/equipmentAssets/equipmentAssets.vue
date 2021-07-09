<template>
  <div class="max">
    <div
      id="chartPiec"
      class="Columnara"
    />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    statistics: {
      type: Array,
      default: Array,
    },
  },
  components: {},
  data() {
    return {
      name: [],
      value: [],
      number: 0,
    }
  },
  watch: {
    statistics(val) {
      if (val) {
        this.number = 0
        this.value = []
        this.name = []
        val.map((item) => {
          this.name.push(item.name)
          this.value.push(item.value)
          this.number += item.value
        })
        this.getdata()
      }
    },
  },
  methods: {

    getdata() {
      this.chartPiec = echarts.init(
        document.getElementById('chartPiec'),
        'macarons'
      )
      this.chartPiec.setOption({
        tooltip: {},
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
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
            max: this.number,
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#CCCCCC',
              },
              show: true,
            },
            axisLine: {
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
            data: this.value,
            barWidth: 15,
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
  mounted() {
    window.addEventListener('resize', () => {
      this.getdata()
      this.chartPiec.resize()
    })
    this.getdata()
  },
}
</script>

<style scoped lang='scss'>
.max {
  width: 100%;
  height: 100%;
}

.Columnara {
  width: 99%;
  height: 250px;
}
</style>
