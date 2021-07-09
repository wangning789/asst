<template>
  <div>
    <!-- 头部公告 -->
    <ElRow :class="$style.noticeHeader">
      <ElCol :span="5">
        <i
          class="i-gonggao"
          :class="$style.iconColor"
        />
        <span
          :class="[$style.weightFont, $style.marginL24]"
          style="margin-left: 20px;"
        >公告</span>
      </ElCol>

      <ElCol :span="19">
        <ElCarousel
          indicator-position="none"
          height="64px"
          direction="vertical"
          :autoplay="true"
        >
          <ElCarouselItem
            v-for="item in noticeList"
            :key="item.id"
          >
            <ElRow style="line-height: 64px;">
              <ElCol :span="4">
                <ElTag
                  style="color: #409eff; border: 1px solid #d9ecff;"
                  color="#ecf5ff"
                >
                  {{ item.noticeType }}
                </ElTag>
              </ElCol>
              <ElCol :span="20">
                <div :class="$style.noticeTitle">
                  <span
                    style="cursor: pointer;"
                    :class="[$style.marginL24, $style.titleNotice]"
                    @click="toNoticeInfo(item.id)"
                  >{{ item.title }}</span>
                  <span>{{ item.takeEffectTime }}</span>
                </div>
              </ElCol>
            </ElRow>
          </ElCarouselItem>
        </ElCarousel>
      </ElCol>
    </ElRow>
    <!-- 安全事件概况 -->
    <ElRow :class="$style.safeContent">
      <ElCol :span="24">
        <span :class="$style.title">安全事件概况</span>
      </ElCol>
      <ElCol
        style="margin-top: 20px;"
        :span="24"
      >
        <ElRow :class="$style.safeEcharts">
          <ElCol :span="8">
            <ElRow>
              <ElCol
                :class="$style.flex"
                :span="12"
              >
                <i
                  class="i-diyugongjicishu"
                  :class="$style.iconColor"
                />
                <div :class="$style.marginL24">
                  <div style="font-size: 16px;">
                    安全事件总数
                  </div>
                  <p
                    :class="$style.safeNum"
                    @click="goSafe"
                  >
                    {{ safeList.count }}
                  </p>
                </div>
              </ElCol>
              <ElCol
                :class="$style.flex"
                :span="12"
              >
                <i
                  class="i-daichulianquanshijianshu"
                  :class="$style.iconColor"
                />
                <div :class="$style.marginL24">
                  <div style="font-size: 16px;">
                    特别重大/重大安全事件数
                  </div>
                  <p
                    :class="$style.safeNum"
                    @click="goSafe"
                  >
                    {{ safeList.urgent }} / {{ safeList.major }}
                  </p>
                </div>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol
                :class="$style.flex"
                :span="12"
              >
                <i
                  class="i-chuzhishuai"
                  :class="$style.iconColor"
                />
                <div :class="$style.marginL24">
                  <div style="font-size: 16px;">
                    处置率
                  </div>
                  <p
                    :class="$style.safeNum"
                    @click="goSafe"
                  >
                    {{
                      safeList.completed
                        ? ((safeList.completed / safeList.count) * 100).toFixed(
                          2
                        )
                        : 0
                    }}%
                  </p>
                </div>
              </ElCol>
              <ElCol
                :class="$style.flex"
                :span="12"
              >
                <i
                  class="i-pingjunchuzhishijian"
                  :class="$style.iconColor"
                />
                <div :class="$style.marginL24">
                  <div style="font-size: 16px;">
                    平均处置时长
                  </div>
                  <p
                    :class="$style.safeNum"
                    @click="goSafe"
                  >
                    {{ safeList.completionTime }}min
                  </p>
                </div>
              </ElCol>
            </ElRow>
          </ElCol>
          <ElCol :span="16">
            <ElRow>
              <ElCol :span="12">
                <div
                  id="disposeChart"
                  style="height: 250px;"
                />
              </ElCol>
              <ElCol :span="12">
                <div
                  id="typeChart"
                  style="height: 250px;"
                />
              </ElCol>
            </ElRow>
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>
    <!-- 成员单位工作完成情况 -->
    <ElRow :class="$style.safeContent">
      <ElCol :span="24">
        <span :class="$style.title">成员单位工作完成情况</span>
      </ElCol>
      <ElCol
        style="margin-top: 20px;"
        :span="24"
      >
        <ElRow>
          <ElCol :span="8">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>任务未完成数TOP5单位</span>
            </div>
            <div v-show="topTask && topTask.length">
              <div
                v-for="(item, index) in topTask"
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
                      :class="$style.columnItem1"
                      :style="{ width: `${item.leng}` + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-show="!(topTask && topTask.length)"
              :class="$style.noData"
            >
              暂无数据
            </div>
          </ElCol>
          <ElCol :span="8">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>通报未完成数TOP5单位</span>
            </div>
            <div v-show="topNotice && topNotice.length">
              <div
                v-for="(item, index) in topNotice"
                :key="index"
              >
                <div :class="$style.ranking">
                  <div :class="$style.stageHead">
                    <ElTooltip
                      :class="$style.item"
                      effect="dark"
                      :content="item.statistical_unit"
                      placement="top-start"
                    >
                      <div>{{ item.statistical_unit }}</div>
                    </ElTooltip>
                  </div>
                  <div :class="$style.count">
                    {{ item.statistical_value }}
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
              v-show="!(topNotice && topNotice.length)"
              :class="$style.noData"
            >
              暂无数据
            </div>
          </ElCol>
          <ElCol :span="8">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>安全事件未完成数TOP5单位</span>
            </div>
            <div v-show="topCompany && topCompany.length">
              <div
                v-for="(item, index) in topCompany"
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
                      :class="$style.columnItem2"
                      :style="{ width: `${item.leng}` + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-show="!(topCompany && topCompany.length)"
              :class="$style.noData"
            >
              暂无数据
            </div>
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
import {
  getIncidentStatisticByLD,
  listToDoWorkByUserId,
  circularProcessingStat,
  cloudServicesList,
} from '@/api/roleOverview/leadersOverview'
import echarts from '@/libs/echarts'
// 饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  data() {
    return {
      safeList: {},
      statusStatistic: [], // 处置状态
      typeStatistic: [], // 事件类型
      topTask: [], // 任务未完成数top5
      topNotice: [], // 通报未完成数 TOP5 单位
      topCompany: [], // 待处置 TOP5
      noticeList: [], // 公告列表
    }
  },
  computed: {
    noticeTypes: () => [
      {
        label: '全部',
        value: '',
      },
      {
        label: '其他公告',
        value: '0',
      },
      {
        label: '平台公告',
        value: '1',
      },
      {
        label: '安全资讯',
        value: '2',
      },
      {
        label: '风险预警',
        value: '3',
      },
    ],
    noticeType() {
      let name = ''
      const noticeType = this.form.noticeType
      this.noticeTypes.forEach((res) => {
        if (res.value === noticeType) {
          name = res.label
        }
      })
      return name
    },
  },
  methods: {
    initdisposeChart() {
      const dom = document.getElementById('disposeChart')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.statusStatistic.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}',
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          left: '50%',
          y: 'center',
          data: this.statusStatistic,
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
            data: this.statusStatistic,
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
      myChart.setOption(option, true)
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
          formatter: '{a} <br/>{b}',
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
      myChart.setOption(option, true)
    },
    goSafe() {
      this.$router.push('/securityIncident')
    },
    getTask() {
      listToDoWorkByUserId({ type: 0, allOrUnfinish: 200 }).then((res) => {
        this.topTask = res.data.body || []
        let number = 0
        const valueArr =
          this.topTask.map((item) => {
            if (item.value) {
              return Number(item.value)
            } else {
              return ''
            }
          }) || []
        const maxValue = valueArr.length ? Math.max(...valueArr) : 0
        this.topTask.map((item) => {
          if (item.value && maxValue) {
            number = Number((item.value / maxValue).toFixed(2))
            item.leng = number * 100
          }
        })
      })
    },
    getNotice() {
      circularProcessingStat().then((res) => {
        this.topNotice = res.data.body || []
        let number = 0
        const valueArr =
          this.topNotice.map((item) => {
            if (item.statistical_value) {
              return Number(item.statistical_value)
            } else {
              return ''
            }
          }) || []
        const maxValue = valueArr.length ? Math.max(...valueArr) : 0
        this.topNotice.map((item) => {
          if (item.statistical_value && maxValue) {
            number = Number((item.statistical_value / maxValue).toFixed(2))
            item.leng = number * 100
          }
        })
      })
    },
    toNoticeInfo(id) {
      this.$router.push({
        path: `/notice/${id}/detail`,
      })
    },
  },

  created() {
    getIncidentStatisticByLD().then((res) => {
      this.safeList = res.data.body
      // 处置状态
      this.statusStatistic = res.data.body.statusStatistic
      this.statusStatistic.forEach((item) => {
        item.name =
          item.name +
          ` ${item.value} ` +
          '(' +
          ((item.value / this.safeList.count) * 100).toFixed(2) +
          '%)'
      })
      // 事件类型
      this.typeStatistic = res.data.body.typeStatistic
      this.typeStatistic.forEach((item) => {
        item.name =
          item.name +
          ` ${item.value} ` +
          '(' +
          ((item.value / this.safeList.count) * 100).toFixed(2) +
          '%)'
      })
      this.topCompany = res.data.body.companyStatistic || []
      let number = 0
      const valueArr =
        this.topCompany.map((item) => {
          if (item.value) {
            return Number(item.value)
          } else {
            return ''
          }
        }) || []
      const maxValue = valueArr.length ? Math.max(...valueArr) : 0
      this.topCompany.map((item) => {
        if (item.value && maxValue) {
          number = Number((item.value / maxValue).toFixed(2))
          item.leng = number * 100
        }
      })
      this.initTypeChart()
      this.initdisposeChart()
    })
    const params = {
      page: 1,
      pageSize: 10,
      pageType: 0,
    }
    cloudServicesList(params).then((res) => {
      this.noticeList = res.data.body.data
      this.noticeList.forEach((item) => {
        if (item.noticeType === '0') {
          item.noticeType = '其他公告'
        } else if (item.noticeType === '1') {
          item.noticeType = '平台公告'
        } else if (item.noticeType === '2') {
          item.noticeType = '安全资讯'
        }
      })
    })
    this.getTask()
    this.getNotice()
  },
}
</script>

<style lang="scss" module>
.titleNotice {
  width: 400px;
  overflow: hidden; //隐藏
  white-space: nowrap; //文本不进行换行
  text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
  word-wrap: normal;    //保持默认处理
  word-break: keep-all;  //中英文不断词
}

.noData {
  height: 250px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
  line-height: 250px;
  text-align: center;
}

.el-carousel__item span {
  margin: 0;
  color: black;
  font-size: 14px;
  line-height: 200px;
  opacity: 0.75;
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

.column {
  width: 200px;

  .columnItem {
    height: 7px;
    background-color: #f56c6c;
  }

  .columnItem1 {
    height: 7px;
    background-color: #f79267;
  }

  .columnItem2 {
    height: 7px;
    background-color: #ffb340;
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
    background-color: #dd4927;
  }
}

.safeNum {
  color: #333;
  font-size: 28px;
  cursor: pointer;
}

.flex {
  display: flex;
}

.iconColor {
  color: #dd4927;
  font-size: 24px;
}

.marginL24 {
  margin-left: $gapNormal;
}

.title {
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

.noticeTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.noticeHeader {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.weightFont {
  font-weight: bold;
}

.safeContent {
  width: 100%;
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .safeEcharts {
    padding: 20px;
  }
}
</style>
