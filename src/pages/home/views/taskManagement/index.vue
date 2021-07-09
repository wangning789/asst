<template>
  <div class="el-card">
    <ElRow>
      <ElTabs v-model="activeName">
        <ElTabPane
          v-for="(item, index) in tabName"
          :key="index"
          :label="item.name + item.number"
        />
      </ElTabs>
    </ElRow>
    <ElCol
      v-loading="isLoadingTable"
      :span="19"
    >
      <Waitingforprocessing
        v-if="activeName === '0'"
        :route="route"
        :active-name="activeName"
        @cliDelite="cliDelite"
      />
      <Done
        v-if="activeName === '1'"
        :route="route"
        :active-name="activeName"
        @cliDelite="cliDelite"
      />
      <Alltasks
        v-if="activeName === '2'"
        :route="route"
        :active-name="activeName"
        @cliDelite="cliDelite"
      />
    </ElCol>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { count } from '@/api/taskManagement/taskManagement'
import { ROLES } from '@/enums'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import Waitingforprocessing from './waitingForProcessing/waitingForProcessing'
import Done from './done/done'
import Alltasks from '@/pages/home/views/taskManagement/allTasks/allTasks'
/** emit: 事件说明 */
export default {
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  components: {
    ElTabs,
    ElTabPane,
    Waitingforprocessing,
    Done,
    Alltasks,
  },
  data() {
    return {
      show: 0,
      tabName: [
        { name: '我的待办', type: 'todoCount', number: 0 },
        { name: '我的已办', type: 'doneCount', number: 0 },
        { name: '小组全部任务', type: 'allCount', number: 0 },
      ],
      activeName: '0',
      isLoadingTable: false,
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {
    cliDelite() {
      this.getCount()
    },
    getCount() {
      let id = '0'
      if (this.authFit(ROLES.projectManager)) {
        id = '2'
      } else if (this.authFit(ROLES.unitSO)) {
        id = '1'
      }
      count(id).then(res => {
        res.data.body.map((item) => {
          this.tabName.map((itemOne) => {
            if (item.statistical_type === itemOne.type) {
              itemOne.number = item.statistical_value
            }
          })
        })
      })
    },
  },
  created() {
    this.getCount()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.tree {
  max-height:
    calc(
      100vh - #{$gapTop + $gapBottom + $gapNormal * 2.25 + $heightInput}
    );
  overflow: auto;
  border: $borderBase;
}

.main {
  margin: auto !important;
}

.treeTitle {
  margin-bottom: 16px;
  font-weight: bold;
  font-size: $larger;

  .levelSwitch {
    font-size: $medium;
  }
}
</style>
