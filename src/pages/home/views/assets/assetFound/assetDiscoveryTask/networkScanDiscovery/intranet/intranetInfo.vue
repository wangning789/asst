<!-- 描述 -->
<template>
  <div class="el-card">
    <!-- 头部 -->
    <div :class="$style.title">
      <div :class="$style.left">
        {{ this.$router.history.current.name }}
      </div>
      <div :class="$style.right">
        <ElButton
          type="primary"
          size="small"
          @click="goTo"
        >
          返回
        </ElButton>
      </div>
    </div>
    <div :class="$style.conter">
      <!-- 头部信息 -->
      <div :class="$style.details">
        <span :class="$style.ico"><i class="el-icon-s-management" /></span>
        <span :class="$style.detailsfont">{{ ruleForm.taskName }}</span>
        <span
          v-show="ruleForm.taskStatus === '1'"
          :class="$style.enable"
        >未开始</span>
        <span
          v-show="ruleForm.taskStatus === '3'"
          :class="$style.disable"
        >已完成</span>
        <span
          v-show="ruleForm.taskStatus === '2'"
          :class="$style.enable"
        >执行中</span>
      </div>
      <!-- 任务信息 -->
      <SubTitle title="任务信息" />
      <div :class="$style.aLines">
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              任务名称
            </div>
            <div
              :class="$style.customData"
            >
              {{ ruleForm.taskName }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              关联组织机构
            </div>
            <div
              :class="$style.customData"
            >
              {{ ruleForm.belongCompanyIdName }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              扫描探针
            </div>
            <div
              :class="$style.customData"
            >
              {{ ruleForm.taskTypeName }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              扫描内容
            </div>
            <div
              :class="$style.customData"
            >
              {{ ruleForm.discoverContent }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              扫描级别
            </div>
            <div
              :class="$style.customData"
            >
              <div v-if="ruleForm.discoverLevel === '1'">
                快速扫描
              </div>
              <div v-else>
                深度扫描
              </div>
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              描述
            </div>
            <div
              :class="$style.customData"
            >
              {{ ruleForm.description }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              任务执行时间
            </div>
            <div
              :class="$style.customData"
            >
              {{ ruleForm.excuteTime || '-' }}
            </div>
          </div>
        </div>
      </div>
      <!-- 任务执行记录 -->
      <SubTitle title="任务执行记录" />
      <div>
        <ElTimeline>
          <ElTimelineItem
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </ElTimelineItem>
        </ElTimeline>
      </div>
      <!-- 任务执行结果 -->
      <SubTitle title="任务执行结果" />
      <div>
        <IntranetList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IntranetList from './intranetExecutionList'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import SubTitle from '../../../../assetsInfo/components/subTitle'
import { discoveryResultGet } from '@/api/assets/discoveryResilt'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: {
    SubTitle,
    IntranetList,
  },
  data() {
    return {
      ruleForm: {},
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15',
      }, {
        content: '通过审核',
        timestamp: '2018-04-13',
      }, {
        content: '创建成功',
        timestamp: '2018-04-11',
      }],
    }
  },
  methods: {
    get() {
      const id = this.$router.history.current.params.id
      discoveryResultGet(id).then(res => {
        this.ruleForm = res.data.body
      })
    },
    goTo() {
      this.$router.go(-1)
    },
  },
  created() {
    this.get()
  },
}
</script>

<style lang="scss" module>

.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 10px;
  border-bottom: 1px solid #e9e9e9;

  .left {
    color: #333;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
  }
}

.details {
  padding: 10px 0;

  span {
    display: inline-block;
    margin-right: 10px;
  }

  .detailsfont {
    height: 26px;
    color: #333;
    font-weight: bold;
    font-size: 20px;
    line-height: 26px;
  }

  .detailsnumber {
    padding: 4px 10px;
    color: #333;
    font-weight: 400;
    font-size: 12px;
    background-color: #f4f6fb;
  }

  .enable {
    padding: 4px 10px;
    color: #68c23a;
    font-weight: 400;
    font-size: 12px;
    background: rgba(104, 194, 58, 0.1);
    border-radius: 20px;
  }

  .disable {
    padding: 4px 10px;
    color: $colorTextMinor;
    font-weight: 400;
    font-size: 12px;
    background: rgba(153, 153, 153, 0.1);
    border-radius: 20px;
  }
}

.conter {
  width: 1200px;
  margin: 0 auto;
}

.aLines {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.aLine {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.column {
  display: flex;

  .name {
    display: flex;
    align-items: center;
    width: 118px;
    height: 38px;
    margin-bottom: -1px;
    padding-left: 10px;
    background-color: rgb(244, 246, 251);
    border: 1px solid #e9e9e9;
  }

  .customData {
    display: flex;
    align-items: center;
    width: 260px;
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding-left: 10px;
    border: 1px solid #f0f0f0;
  }
}
</style>
