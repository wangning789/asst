<!-- 描述 -->
<template>
  <div :class="$style.card">
    <div class="el-card">
      <div :class="$style.peripheral">
        <div :class="$style.general">
          <div :class="$style.title">
            资产概况
          </div>
          <div :class="$style.block">
            <div :class="$style.whole">
              <div
                v-for="(item,index) in statistical"
                :key="index"
                :class="$style.box"
              >
                <div :class="$style.summary">
                  <div :class="index===0||index===2?$style.iconOne:$style.icon">
                    <i :class="item.icon" />
                  </div>
                  <div>
                    <div :class="$style.name">
                      {{ item.title }}
                    </div>
                    <div :class="$style.number">
                      {{ item.number }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="$style.general">
          <div :class="$style.title">
            资产类型占比
          </div>
          <div :class="$style.block">
            <div
              id="typeChart"
              style="width: 80%; height: 206px;"
            />
          </div>
        </div>
        <div :class="$style.general">
          <div :class="$style.title">
            资产新增变更趋势
          </div>
          <div :class="$style.block" />
        </div>
      </div>
      <!-- <div :class="$style.tiele">资产概括</div> -->
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import echarts from '@/libs/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
export default {
  props: {
  },
  components: {
  },
  data() {
    return {
      statistical: [
        {
          icon: 'i-xinzengzichan',
          title: '新增资产总数/台',
          number: 15,
        },
        {
          icon: 'i-xitongzongshu',
          title: '新增资产类型/台',
          number: 6,
        },
        {
          icon: 'i-jinqitianbiangengzichan',
          title: '近7天变更资产数量/台',
          number: 0,
        },
        {
          icon: 'i-jin30tianbiangengzichan',
          title: '近30天变更资产数量/台',
          number: 0,
        },
      ],
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {
    getTypeChart() {
      const dom = document.getElementById('typeChart')
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
            const arr = [
              '{a|' + 10 + '%}',
              '{b|' + name + '}',
            ]
            return arr.join('')
          },

        },

        textStyle: {
          rich: {
            a: {
              padding: [0, 0, 0, 16],
            },
            b: {
              padding: [0, 0, 0, 16],
            },
          },
        },
        series: [
          {
            name: '访问来源%',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' },
            ],
          },
        ],
      }
      myChart.setOption(option, true)
    },
  },

  mounted() {
    this.getTypeChart()
  },

}
</script>

<style lang="scss" module>
.card {
  margin-top: 16px;
}

.peripheral {
  display: flex;

  .general {
    flex: 1;
  }
}

.title {
  margin: 20px 0;
  margin-left: 16px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.block {
  height: 220px;
  // background-color: aqua;
  border: 1px solid red;
}

.icon {
  margin-right: 16px;
  // margin-left: 46px;
  color: #2c73ef;
  font-size: 20px;
}

.iconOne {
  margin-right: 16px;
  // margin-left: 46px;
  // margin-left: 46px;
  color: #2c73ef;
  font-size: 20px;
}

.name {
  margin-bottom: 16px;
  color: #333;
  font-size: 14px;
  line-height: 20px;
}

.number {
  color: #333;
  font-weight: bold;
  font-size: 20px;
}

i:nth-child(2n) {
  margin-left: 46px;
  // color: #333;
  // stroke-width: 0%;
}

.summary {
  display: flex;
}

.whole {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  // justify-content: space-between;
  width: 100%;
  height: 190px;

  .box {
    display: flex;
    align-items: center;
    width: 42%;
    height: 50%;
    // border: 1px solid red;
  }
}
</style>
