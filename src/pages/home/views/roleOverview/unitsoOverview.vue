<template>
  <div>
    <!-- 公告,通报 -->
    <ElRow :class="$style.wrap">
      <ElCol
        :span="12"
        :class="$style.noticeWrap"
      >
        <Notice :announcements="announcements" />
      </ElCol>
      <ElCol
        :span="12"
        :class="$style.reportWrap"
      >
        <div :class="$style.titleWrap">
          <span :class="$style.moduleTitle">最新通报</span>
          <span
            :class="$style.more"
            @click="readMore"
          >查看更多</span>
        </div>
        <div :class="$style.reportContent">
          <div
            v-for="(item, index) in newReports"
            :key="index"
            :class="$style.transverse"
          >
            <div :class="$style.icon">
              <i class="i-youxiang" />
            </div>
            <div :class="$style.notification">
              <div
                :class="[$style.tag, getTypeClass(item.circularType)]"
                size="medium"
              >
                {{ CIRCULARTYPE[item.circularType] }}
              </div>
            </div>
            <div
              :class="$style.title"
              @click="clickToDetail(item)"
            >
              {{ item.title }}
            </div>
            <div :class="$style.time">
              <span
                :class="[
                  $style.feedbackStatus,
                  getFeedbackClass(item.feedbackStatus),
                ]"
              >{{ FEEDBACK_STATUS[item.feedbackStatus] }}</span>
              <span>{{ item.createDate }}</span>
            </div>
          </div>
        </div>
      </ElCol>
    </ElRow>
    <!-- 任务 -->
    <ElRow :class="$style.wrap">
      <ElCol
        :span="8"
        :class="$style.myTodoWrap"
      >
        <div :class="[$style.moduleTitle, $style.todoTitle]">
          <span>我的待办</span>
        </div>
        <div :class="$style.todoTaskWrap">
          <div :class="$style.todoTaskContent">
            <div :class="$style.todoTask">
              <i
                :class="$style.todoIcon"
                class="i-daichulirenwu"
              />
              <div :class="$style.todoInfo">
                <span
                  :class="$style.todoText"
                >待办任务<br><br>
                  <span
                    :class="$style.todoValue"
                    @click="toTask"
                  >{{
                    todoTaskValue
                  }}</span></span>
              </div>
            </div>
            <div :class="$style.todoTask">
              <i
                :class="$style.todoIcon"
                class="i-weichulianquanshijian"
              />
              <div :class="$style.todoInfo">
                <span
                  :class="$style.todoText"
                >未处理完成的安全事件<br><br>
                  <span
                    :class="$style.todoValue"
                    @click="toSecurityIncident"
                  >{{
                    todoSecurityValue
                  }}</span></span>
              </div>
            </div>
            <div :class="$style.todoTask">
              <i
                :class="$style.todoIcon"
                class="i-weifankuiwanchengdetongbao"
              />
              <div :class="$style.todoInfo">
                <span
                  :class="$style.todoText"
                >未反馈完成的通报<br><br>
                  <span
                    :class="$style.todoValue"
                    @click="toNoticeManage"
                  >{{
                    todoAnnounceValue
                  }}</span></span>
              </div>
            </div>
          </div>
        </div>
      </ElCol>
      <ElCol
        :span="16"
        :class="$style.taskInfoWrap"
      >
        <Chart />
      </ElCol>
    </ElRow>
    <!-- 安全事件概况 -->
    <div :class="$style.securityInfoWrap">
      <div :class="$style.securityInfoTop">
        <div :class="$style.moduleTitle">
          <span>安全事件概况</span>
        </div>
        <ElRadioGroup
          v-model="dateRange"
          size="mini"
          fill="#DE4928"
          text-color="#fff"
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
      </div>

      <ElRow>
        <ElCol
          :span="8"
          :class="$style.securityCountWrap"
        >
          <div :class="$style.securityCountContent">
            <div
              v-for="(item, index) in securityCountList"
              :key="index"
              :class="$style.securityCount"
            >
              <div :class="$style.todoIcon">
                <i :class="item.icon" />
              </div>

              <div :class="$style.todoInfo">
                <span :class="$style.todoText">
                  {{ item.name }}<br><br>
                  <ElTooltip
                    v-if="item.toolTip"
                    :content="item.toolTip"
                  >
                    <span :class="$style.todoValue">{{ item.number }}</span>
                  </ElTooltip>
                  <span
                    v-else
                    :class="$style.todoValue"
                  >{{
                    item.number
                  }}</span>
                </span>
              </div>
            </div>
          </div>
        </ElCol>
        <ElCol
          :span="14"
          :class="$style.trendLine"
        >
          <div
            id="trendLine"
            style="height: 300px;"
          />
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ElRadioGroup from 'element-ui/lib/radio-group'
import ElRadioButton from 'element-ui/lib/radio-button'
import Notice from './unified/notice'
import Chart from './unified/chart'
import echarts from '@/libs/echarts'
// 饼图
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import { cloudServicesList, needToBeDealtWith } from '@/api/roleOverview/index'
import {
  circularNowStat,
  notFinishAnnounce,
  todoSecurity,
  getIncidentStatisticByDwaq,
} from '@/api/roleOverview/unitsoOverview'
import { getSecurityIncidentTrend } from '@/api/securityIncident/securityIncident'
import { getFloat } from '@/utils/number'
import { DATERANGE } from './enums'
// import { securityCountInfo } from './enums'
import getCode from '@/enums/code'
const FEEDBACK_STATUS = getCode('1', 'SYS_FEEDBACK_STATUS')
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')

export default {
  components: {
    Notice,
    Chart,
    ElRadioGroup,
    ElRadioButton,
  },
  data() {
    return {
      dateRange: 7,
      announcements: [],
      newReports: [],
      from: {
        pageSize: 5,
        page: 1,
      },
      todoList: [],
      todoTaskValue: 0,
      todoSecurityValue: 0,
      todoAnnounceValue: 0,
      securityCountList: [],
    }
  },
  computed: {
    DATERANGE: () => DATERANGE,
    FEEDBACK_STATUS: () => FEEDBACK_STATUS.value || [],
    CIRCULARTYPE: () => CIRCULARTYPE.value || [],
    getFeedbackClass() {
      return (status) => {
        switch (true) {
          case status === 'SYS_WAIT_FEEDBACK': // 待反馈
            return 'colorRed'
          case status === 'SYS_CLOSE_FEEDBACK': // 关闭反馈
            return 'colorGray'
          case status === 'SYS_FEEDBACK_COMPLETE': // 反馈完成
            return 'colorGreen'
          case status === 'SYS_ALREADY_FEEDBACK': // 已反馈
            return 'colorYellow'
          default:
            return 'colorGray'
        }
      }
    },
    getTypeClass() {
      return (type) => {
        if (type === 'SYS_THREAT_VUL_CIRCULAR') {
          return 'tagRed'
        } else {
          return 'tagYellow'
        }
      }
    },
  },
  methods: {
    getNotice() {
      cloudServicesList(this.from).then((res) => {
        if (res && res.data && res.data.body && res.data.body.data) {
          this.announcements = res.data.body.data
        }
      })
    },
    getNewReports() {
      circularNowStat().then((res) => {
        if (res && res.data && res.data.body) {
          this.newReports = res.data.body
        }
      })
    },
    getTasktodo() {
      needToBeDealtWith().then((res) => {
        if (res && res.data && res.data.body && res.data.body.length) {
          this.todoTaskValue = res.data.body[0].statistical_value || 0
        }
      })
    },

    getTodoSecurity() {
      todoSecurity().then((res) => {
        if (res && res.data && res.data.body) {
          this.todoSecurityValue = res.data.body.statistical_value || 0
        }
      })
    },

    getNotFinishAnnounce() {
      notFinishAnnounce().then((res) => {
        if (res && res.data && res.data.body) {
          this.todoAnnounceValue = res.data.body.statistical_value || 0
        }
      })
    },

    getSecurityCount() {
      getIncidentStatisticByDwaq().then((res) => {
        if (res && res.data && res.data.body) {
          const securityCountInfo = res.data.body
          const count = Number(securityCountInfo.count)
          const urgent = Number(securityCountInfo.urgent)
          const major = Number(securityCountInfo.major)
          const completed = Number(securityCountInfo.completed)
          const completionTime = Number(securityCountInfo.completionTime)
          this.securityCountList = [
            {
              icon: 'i-diyugongjicishu',
              name: '安全事件总数',
              toolTip: '未确认的安全事件不计入总数',
              number: count,
            },
            {
              icon: 'i-daichulianquanshijianshu',
              name: '特别重大/重大安全事件数',
              number: urgent + '/' + major,
            },
            {
              icon: 'i-chuzhishuai',
              name: '处置率',
              number:
                (completed === 0 || count === 0) ? 0
                  : (
                    getFloat((completed / count) *
                  100, '2'
                    )) + '%',
            },

            {
              icon: 'i-pingjunchuzhishijian',
              name: '平均处置时长',
              number: completionTime + ' min',
            },
          ]
        }
      })
    },

    getTrendLineInfo(date) {
      getSecurityIncidentTrend(date).then((res) => {
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

    dateChange(val) {
      if (val) {
        this.getTrendLineInfo(val)
      }
    },

    toTask() {
      this.$router.push({
        path: 'taskManagement',
      })
    },
    toSecurityIncident() {
      this.$router.push({
        path: 'securityIncident',
      })
    },
    toNoticeManage() {
      this.$router.push({
        path: 'noticeManage',
      })
    },
    readMore() {
      this.$router.push({
        path: 'noticeManage',
      })
    },
    clickToDetail(val) {
      const path =
        val.feedbackStatus === 'SYS_WAIT_FEEDBACK'
          ? '/feedbackInfo'
          : '/carryOutInfo'
      this.$router.push({
        path: `noticeManage/${val.id}/${path}`,
      })
    },
  },
  created() {
    this.getNotice()
    this.getNewReports()
    // 获取任务待办
    this.getTasktodo()
    this.getTodoSecurity()
    this.getNotFinishAnnounce()
    this.getSecurityCount()
    this.getTrendLineInfo(this.dateRange)
  },
}
</script>

<style scoped>
.colorGreen {
  color: #68c23a;
}

.colorRed {
  color: #dd4927;
}

.colorYellow {
  color: #ebc20c;
}

.colorGray {
  color: #333;
}

.tagRed {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
  border: 1px solid rgba(245, 108, 108, 0.30196078431372547);
}

.tagYellow {
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.1);
  border: 1px solid rgba(230, 162, 60, 0.30196078431372547);
}
</style>

<style lang="scss" module>
.wrap {
  display: flex;
  align-items: center;
  width: 100%;
}

.securityInfoWrap {
  margin-top: $gapNormal;

  .securityInfoTop {
    display: flex;
    justify-content: space-between;
  }

  .radioLabel:hover {
    span {
      color: #de4928;
    }
  }
}

.noticeWrap {
  height: 280px;
}

.reportWrap,
.myTodoWrap,
.hostAssetsWrap,
.businessAssetsWrap,
.securityInfoWrap {
  padding: $gapNormal;
  background-color: #fff;
  border-radius: 10px;

  .more {
    color: #5084cb;
    font-size: $smaller;
    cursor: pointer;
  }
}

.myTodoWrap {
  display: flex;
  flex-direction: column;
  min-width: 440px;
  height: 410px;
}

.wrap:not(:first-child) {
  margin-top: $gapNormal;
}

.reportWrap,
.taskInfoWrap,
.businessAssetsWrap {
  margin-left: $gapNormal;
}

.titleWrap {
  display: flex;
  justify-content: space-between;
}

.moduleTitle {
  float: left;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  font-size: $larger;
}

.reportContent {
  display: flex;
  flex-direction: column;
  height: 204px;
}

.transverse {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: $smaller;
}

.transverse:not(:last-child) {
  border-bottom: 1px solid #f2f4f8;
}

.icon {
  margin-right: $gapNormal;
}

.todoTitle {
  margin-bottom: 35px;
}

.todoTaskWrap {
  display: flex;
  align-items: center;
  height: 100%;
}

.securityCountWrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 432px;
  height: 300px;
}

.todoTaskContent,
.securityCountContent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 $gapNormal;
}

.todoTask,
.securityCount {
  display: flex;

  .todoIcon {
    display: inline-block;
    width: 26px;
    height: 28px;
    margin-right: 27px;
    color: $colorTheme1;
    font-size: 26px;
  }

  .todoInfo {
    display: flex;
    flex-direction: column;
  }

  .todoText {
    color: #333;
    font-size: $larger;
  }

  .todoValue {
    margin-top: $gapNormal;
    color: #333;
    font-weight: bold;
    font-size: 28px;
    cursor: pointer;
  }
}

.securityCount:first-child {
  margin-bottom: 40px;
}

.todoTask:first-child {
  margin-bottom: 40px;
}

.securityCount:last-child {
  width: 234px;
}

.notification {
  margin-right: $gapNormal;
}

.time {
  display: flex;
  min-width: 172px;
  height: 30px;
  margin-left: auto;
  font-size: $smaller;
  line-height: 30px;
}

.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: $gapNormal;
  border-radius: 10%;
}

.feedbackStatus {
  margin-right: $gapNormal;
  font-weight: 400;
  font-size: $smaller;
}

.title {
  overflow: hidden; //隐藏
  font-size: 12px;
  white-space: nowrap; //文本不进行换行
  text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
  word-wrap: normal;    //保持默认处理
  word-break: keep-all;  //中英文不断词
}

.title:hover {
  cursor: pointer;
}

.name:hover {
  cursor: pointer;
}
</style>
