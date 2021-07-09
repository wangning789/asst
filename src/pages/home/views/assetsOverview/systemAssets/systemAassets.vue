<template>
  <div class="max1">
    <div
      id="chartPieabcd"
      class="pie-wrap1"
    />
    <div
      id="chartPieb"
      class="pie-wrap1"
    />
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // 引入主题
export default {
  props: {
    businessAssets: {
      type: Array,
      default: Array,
    },
    businessResources: {
      type: Array,
      default: Array,
    },
  },
  components: {},
  data() {
    return {
      chartPieabcd: null,
      chartPieb: null,
      material: {},
    }
  },

  watch: {
    businessAssets(val) {
      if (val) {
        this.drawPieCharta()
      }
    },
    businessResources(val) {
      if (val) {
        this.drawPieChartb()
      }
    },
  },
  methods: {
    drawPieCharta() {
      const colorList = ['#FBC96B', '#66D8A6']
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
      this.material = mylabel
      this.chartPieabcd = echarts.init(
        document.getElementById('chartPieabcd'),
        'macarons'
      )
      this.chartPieabcd.setOption({
        title: {
          x: 'center',
        },
        color: colorList,
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [
          {
            name: 'b',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: this.businessAssets,
            label: {
              show: true,
              position: 'center',
              formatter:
                '{active|系统类型}',
              color: '#4c4a4a',
              fontSize: 20,
              rich: {
                active: {
                  fontFamily: '微软雅黑',
                  fontSize: 12,
                  color: '#6c7a89',
                  lineHeight: 30,
                },
              },
            },
          },
        ],
      })
    },

    drawPieChartb() {
      const colorList = ['#FBC96B', '#66D8A6']
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
      this.material = mylabel
      this.chartPieb = echarts.init(
        document.getElementById('chartPieb'),
        'macarons'
      )
      this.chartPieb.setOption({
        title: {
          x: 'center',
        },
        color: colorList,
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [
          {
            name: 'b',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: this.businessResources,

            label: {
              show: true,
              position: 'center',
              formatter:
                '{active|系统部署环境}',
              color: '#4c4a4a',
              fontSize: 20,
              rich: {
                active: {
                  fontFamily: '微软雅黑',
                  fontSize: 12,
                  color: '#6c7a89',
                  lineHeight: 30,
                },
              },
            },
          },
        ],
      })
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.drawPieCharta()
      this.drawPieChartb()
    })
  },
}
</script>
<style scoped lang='scss'>
.max1 {
  display: flex;
}

.pie-wrap1 {
  width: 90%;
  height: 250px;
}
</style>
