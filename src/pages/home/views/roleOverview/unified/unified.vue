
<template>
  <div>
    {{ getIncidentStatistic }}
    {{ API }}
    <ElRow :gutter="20">
      <ElCol :span="8">
        <Todotasks
          :class="$style.box"
          :title-name="task"
        />
      </ElCol>
      <ElCol :span="16">
        <Notice :announcements="announcements" />
      </ElCol>
    </ElRow>
    <div :class="$style.chart">
      <Chart />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Todotasks from './toDoTasks'
import Notice from './notice'
import Chart from './chart'
import {
  notice,
  safetyBulletin,
  needToBeDealtWith,
  notification,
  security,
} from '@/api/roleOverview/missionOverview'
import { ROLES } from '@/enums'
export default {
  components: {
    Todotasks,
    Notice,
    Chart,
  },
  data() {
    return {
      announcements: [],
      from: {
        noticeStatus: 1,
        pageSize: 5,
        page: 1,
      },

      task: [
        {
          icon: 'i-daichulirenwu',
          number: 0,
          name: '待办任务',
        },
        {
          icon: 'i-weichulianquanshijian',
          number: 0,
          name: '进行中通报',
        },
        {
          icon: 'i-daixunjiananquanshebei',
          number: 0,
          name: '待确认安全事件',
        },
      ],
    }
  },
  computed: {
    getIncidentStatistic() {
      switch (true) {
        case this.authFit(ROLES.communicationLLY):
          return this.communication()
        case this.authFit(ROLES.opertateMaintenance) ||
          this.authFit(ROLES.monitorAnlysis):
          return this.monitorAnlysis()
        case this.authFit(ROLES.securityExperts):
          return this.needToBeDealtWith()
        default:
          return ''
      }
    },
    API() {
      switch (true) {
        case this.authFit(ROLES.communicationLLY) ||
          this.authFit(ROLES.monitorAnlysis) ||
          this.authFit(ROLES.opertateMaintenance):
          return this.notice()
        case this.authFit(ROLES.securityExperts):
          return this.safetyBulletin()
        default:
          return ''
      }
    },
  },
  methods: {
    monitorAnlysis() {
      this.needToBeDealtWith()
      this.unsettledMatter()
    },
    communication() {
      this.needToBeDealtWith()
      this.notification()
      this.security()
    },
    unsettledMatter() {
      this.task.splice(1)
      const obj = {
        icon: 'i-daixunjiananquanshebei',
        number: 0,
        name: '已上报且未处置完成的安全事件',
      }
      this.task.push(obj)
      security().then((res) => {
        let number = 0
        res.data.body.map((item) => {
          if (item.name === 'SYS_TO_HANDLE' || item.name === 'SYS_IN_HANDLE') {
            number += Number(item.value)
          }
        })
        this.task[1].number = number
      })
    },
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
            this.task[0].number = item.statistical_value
          }
        })
        if (this.authFit(ROLES.securityExperts)) {
          this.task.splice(1)
        }
      })
    },

    notification() {
      notification().then((res) => {
        this.task[1].number = res.data.body.total
      })
    },
    security() {
      security().then((res) => {
        res.data.body.map((item) => {
          if (item.name === 'SYS_IN_CONFIRM') {
            this.task[2].number = item.value
          }
        })
      })
    },
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
