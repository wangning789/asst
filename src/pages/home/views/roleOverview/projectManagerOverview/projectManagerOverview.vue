
<template>
  <div>
    <ElRow :gutter="20">
      <ElCol :span="8">
        <ProjectMangerDoTasks
          :class="$style.box"
          :title-name="task"
        />
      </ElCol>
      <ElCol :span="16">
        <ProjectMangerNotice :announcements="announcements" />
      </ElCol>
    </ElRow>
    <div :class="$style.chart">
      <ProjectMangerchart />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ProjectMangerDoTasks from './projectMangerDoTasks'
import ProjectMangerNotice from './projectMangerNotice'
import ProjectMangerchart from './projectMangerchart'
import {
  notice,
  safetyBulletin,
  needToBeDealtWith,
  notification,
  security,
} from '@/api/roleOverview/missionOverview'
export default {
  components: {
    ProjectMangerDoTasks,
    ProjectMangerNotice,
    ProjectMangerchart,
  },
  data() {
    return {
      noticeStatus: '1',
      announcements: [],
      from: {
        pageSize: 5,
        page: 1,
        noticeStatus: 1,
      },

      task: [
        {
          icon: 'i-daichulianquanshijianshu',
          number: 0,
          name: '待处理安全事件',
        },
        {
          icon: 'i-chulizhongdeanquanshijian',
          number: 0,
          name: '处理中安全事件',
        },
        {
          icon: 'i-daichulirenwu',
          number: 0,
          name: '待办任务',
        },
        {
          icon: 'i-weiwanchengtongbao',
          number: 0,
          name: '未完成通报',
        },
      ],
    }
  },
  computed: {},
  methods: {
    notice() {
      notice(this.from).then((res) => {
        if (res.data) {
          this.announcements = res.data.body.data
        }
      })
    },
    safetyBulletin() {
      safetyBulletin(this.from).then((res) => {
        this.announcements = res.data.body.data
      })
    },
    needToBeDealtWith() {
      needToBeDealtWith().then((res) => {
        res.data.body.map((item) => {
          if (item.statistical_title === '任务待办') {
            this.task[2].number = item.statistical_value
          }
        })
      })
    },

    notification() {
      notification().then((res) => {
        this.task[3].number = res.data.body.total
      })
    },
    security() {
      security().then((res) => {
        res.data.body.map((item) => {
          if (item.name === 'SYS_TO_HANDLE') {
            this.task[0].number = item.value
          } else if (item.name === 'SYS_IN_HANDLE') {
            this.task[1].number = item.value
          }
        })
      })
    },
  },
  created() {
    this.needToBeDealtWith()
    this.notification()
    this.security()
    this.notice()
  },
}
</script>

<style lang="scss" module>
.box {
  width: 98%;
}

.chart {
  margin-top: 20px;
}
</style>
