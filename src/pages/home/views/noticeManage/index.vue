<!-- 描述 -->
<template>
  <div class="el-card">
    <!-- 筛选 -->
    <div :class="$style.header">
      <h4 :class="$style.title">
        通报管理
      </h4>
      <div>
        <ElButton
          v-if="
            authFit(ROLES.superAdmin)||
              authFit(ROLES.communicationLLY)"
          type="primary"
          size="small"
          @click="add()"
        >
          发布通报
        </ElButton>
      </div>
    </div>

    <ElForm
      :inline="true"
      :model="filterForm"
      :class="$style.formStyle"
    >
      <ElRow>
        <ElFormItem label="通报类型：">
          <div :class="$style.flex">
            <ElCheckbox
              v-model="checkTypeAll"
              :indeterminate="isTypeIndeterminate"
              @change="checkTypeAllChange"
            >
              全选
            </ElCheckbox>
            <ElCheckboxGroup
              v-model="filterForm.circularTypeList"
              :class="$style.margin"
              @change="checkedTypeChange"
            >
              <ElCheckbox
                v-for="(val, key) in CIRCULARTYPE"
                :key="key"
                :label="key"
              >
                {{ val }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </div>
        </ElFormItem>
      </ElRow>

      <ElRow>
        <ElFormItem
          v-if="
            authFit(ROLES.superAdmin) ||
              authFit(ROLES.communicationLLY) ||
              authFit(ROLES.groupLeaders) ||
              authFit(ROLES.projectManager)
          "
          label="通报状态："
        >
          <div :class="$style.flex">
            <ElCheckbox
              v-model="checkStatusAll"
              :indeterminate="isStatusIndeterminate"
              @change="checkStatusAllChange"
            >
              全选
            </ElCheckbox>
            <ElCheckboxGroup
              v-model="filterForm.circularStatusList"
              :class="$style.margin"
              @change="checkedStatusChange"
            >
              <ElCheckbox
                v-for="(val, key) in CIRCULARSTATUS"
                :key="key"
                :label="key"
              >
                {{ val }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </div>
        </ElFormItem>
        <ElFormItem
          v-if="authFit(ROLES.unitSO)"
          label="反馈状态："
        >
          <div :class="$style.flex">
            <ElCheckbox
              v-model="checkFeedbackAll"
              :indeterminate="isFeedbackIndeterminate"
              @change="checkFeedbackAllChange"
            >
              全选
            </ElCheckbox>
            <ElCheckboxGroup
              v-model="filterForm.feedbackStatusList"
              :class="$style.margin"
              @change="checkedFeedbackChange"
            >
              <ElCheckbox
                v-for="(val, key) in FEEDBACKSTATUS"
                :key="key"
                :label="key"
              >
                {{ val }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </div>
        </ElFormItem>
      </ElRow>

      <ElFormItem label="关键字查询：">
        <ElInput
          v-model="filterForm.keyword"
          clearable
          placeholder="请输入关键字进行查询"
        />
      </ElFormItem>

      <ElFormItem label="发布时间：">
        <ElDatePicker
          v-model="date"
          clearable
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :format="DATE_TIME.dateTime"
          :value-format="DATE_TIME.serverDateTime"
          @change="
            ;[filterForm.beginTime, filterForm.endTime] = $event || ['', '']
          "
        />
      </ElFormItem>
    </ElForm>

    <ITable
      ref="table"
      :query="filterForm"
      :get="getList"
    >
      <ElTableColumn
        label="通报标题"
        prop="title"
      />
      <ElTableColumn
        align="center"
        label="通报类型"
        prop="circularType"
      >
        <template #default="{ row }">
          <span>{{ CIRCULARTYPE[row.circularType] }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="创建时间"
        prop="createDate"
      />
      <!-- 超级管理员 通报联络员 单位领导 -->
      <template
        v-if="
          authFit(ROLES.superAdmin) ||
            authFit(ROLES.communicationLLY) ||
            authFit(ROLES.groupLeaders) ||
            authFit(ROLES.projectManager)
        "
      >
        <ElTableColumn
          align="center"
          label="通报状态"
          prop="circularStatus"
        >
          <template #default="{ row }">
            <span :class="getStatusClass(row)">{{
              CIRCULARSTATUS[row.circularStatus]
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          align="center"
          label="未反馈数/总数"
          prop="feedbackNo"
        >
          <template #default="{ row }">
            <span>{{
              Number(row.feedbackNo) + ' / ' + row.feedbackCount
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作">
          <template slot-scope="scope">
            <ElButton
              type="text"
              size="small"
              @click="clickInfo(scope.row)"
            >
              详情
            </ElButton>
            <ElButton
              v-if="
                authFit(ROLES.communicationLLY) &&
                  scope.row.feedbackCount === scope.row.feedbackNo
              "
              type="text"
              size="small"
              @click="clickDetail(scope.row)"
            >
              编辑
            </ElButton>
            <ElButton
              v-if="authFit(ROLES.communicationLLY)"
              type="text"
              size="small"
              @click="clickDelete(scope.row)"
            >
              删除
            </ElButton>
          </template>
        </ElTableColumn>
      </template>
      <!-- 单位安全员 -->
      <template v-if="authFit(ROLES.unitSO)">
        <ElTableColumn
          align="center"
          label="反馈状态"
          prop="feedbackStatus"
        >
          <template #default="{ row }">
            <span :class="getFeedbackClass(row)">{{
              FEEDBACKSTATUS[row.feedbackStatus]
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作">
          <template slot-scope="scope">
            <ElButton
              type="text"
              size="small"
              @click="clickUnitSODetail(scope.row)"
            >
              详情
            </ElButton>
          </template>
        </ElTableColumn>
      </template>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import getCode from '@/enums/code'
import { DATE_TIME } from '@/enums/format'
import ITable from '@com/Table'
import ElDatePicker from 'element-ui/lib/date-picker'
import {
  queryCircularAllList,
  queryCircularList,
  getCircularListByDwld,
  deleteCircular,
} from '@/api/noticeManage/noticeManage'
import { ROLES } from '@/enums'
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')
const CIRCULARSTATUS = getCode('1', 'SYS_CIRCULAR_STATUS')
const FEEDBACKSTATUS = getCode('1', 'SYS_FEEDBACK_STATUS')
export default {
  components: { ITable, ElDatePicker },
  data() {
    return {
      filterForm: {
        beginTime: '',
        endTime: '',
        circularStatusList: [],
        circularTypeList: [],
        feedbackStatusList: [],
        keyword: '',
      },
      date: ['', ''],
      checkStatusAll: false,
      isStatusIndeterminate: false,
      checkTypeAll: false,
      isTypeIndeterminate: false,
      checkFeedbackAll: false,
      isFeedbackIndeterminate: false,
    }
  },
  computed: {
    ROLES: () => ROLES,
    CIRCULARTYPE: () => CIRCULARTYPE.value,
    CIRCULARSTATUS: () => CIRCULARSTATUS.value,
    FEEDBACKSTATUS: () => FEEDBACKSTATUS.value,
    DATE_TIME: () => DATE_TIME,
    getList() {
      switch (true) {
        case this.authFit(ROLES.superAdmin): // 超级管理员
          return queryCircularAllList
        case this.authFit(ROLES.communicationLLY): // 通讯管理员
          return queryCircularAllList
        case this.authFit(ROLES.projectManager): // 项目经理
          return queryCircularAllList
        case this.authFit(ROLES.unitSO): // 单位安全员
          return queryCircularList
        case this.authFit(ROLES.groupLeaders): // 单位领导
          return getCircularListByDwld
        default:
          return null
      }
    },
    getStatusClass() {
      return (row) => {
        return row.circularStatus === 'SYS_COMPLETED'
          ? 'colorGreen'
          : 'colorRed'
      }
    },
    getFeedbackClass() {
      return (row) => {
        switch (true) {
          case row.feedbackStatus === 'SYS_WAIT_FEEDBACK': // 待反馈
            return 'colorRed'
          case row.feedbackStatus === 'SYS_CLOSE_FEEDBACK': // 关闭反馈
            return 'colorGray'
          case row.feedbackStatus === 'SYS_FEEDBACK_COMPLETE': // 反馈完成
            return 'colorGreen'
          case row.feedbackStatus === 'SYS_ALREADY_FEEDBACK': // 已反馈
            return 'colorYellow'
          default:
            return 'colorGray'
        }
      }
    },
  },
  methods: {
    add() {
      this.$router.push('/noticeManage/add')
    },
    // 编辑
    clickDetail(row) {
      /* const path = this.authFit(this.ROLES.unitSO)
        ? '/feedbackInfo'
        : '/loopholeInfo' */
      this.$router.push('/noticeManage/' + row.id + '/edit')
    },
    clickUnitSODetail(row) {
      const path =
        row.feedbackStatus === 'SYS_WAIT_FEEDBACK'
          ? '/feedbackInfo'
          : '/carryOutInfo'
      this.$router.push('/noticeManage/' + row.id + path)
    },
    // 详情
    clickInfo(row) {
      const path = this.authFit(this.ROLES.unitSO)
        ? '/carryOutInfo'
        : '/loopholeInfo'
      this.$router.push('/noticeManage/' + row.id + path)
    },
    // 删除
    clickDelete(row) {
      const params = {
        id: row.id,
      }
      this.$confirm('确认删除？', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      })
        .then(() => {
          deleteCircular(params).then((res) => {
            if (res.data.status === true) {
              this.$notify.success('删除成功!')
              this.$refs.table.fetch()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    checkTypeAllChange(val) {
      this.filterForm.circularTypeList = val
        ? Object.keys(this.CIRCULARTYPE)
        : []
      this.isTypeIndeterminate = false
    },
    checkedTypeChange(value) {
      const checkedCount = value.length
      this.checkTypeAll = checkedCount === Object.keys(this.CIRCULARTYPE).length
      if (
        checkedCount > 0 &&
        checkedCount < Object.keys(this.CIRCULARTYPE).length
      ) {
        this.isTypeIndeterminate = true
      } else {
        this.isTypeIndeterminate = false
      }
    },
    checkStatusAllChange(val) {
      this.filterForm.circularStatusList = val
        ? Object.keys(this.CIRCULARSTATUS)
        : []
      this.isStatusIndeterminate = false
    },
    checkedStatusChange(value) {
      const checkedCount = value.length
      this.checkStatusAll =
        checkedCount === Object.keys(this.CIRCULARSTATUS).length
      if (
        checkedCount > 0 &&
        checkedCount < Object.keys(this.CIRCULARSTATUS).length
      ) {
        this.isStatusIndeterminate = true
      } else {
        this.isStatusIndeterminate = false
      }
    },
    checkFeedbackAllChange(val) {
      this.filterForm.feedbackStatusList = val
        ? Object.keys(this.FEEDBACKSTATUS)
        : []
      this.isFeedbackIndeterminate = false
    },
    checkedFeedbackChange(value) {
      const checkedCount = value.length
      this.checkFeedbackAll =
        checkedCount === Object.keys(this.FEEDBACKSTATUS).length
      if (
        checkedCount > 0 &&
        checkedCount < Object.keys(this.FEEDBACKSTATUS).length
      ) {
        this.isFeedbackIndeterminate = true
      } else {
        this.isFeedbackIndeterminate = false
      }
    },
  },
}
</script>

<style lang="scss" module>
.header {
  display: flex;
  justify-content: space-between;
}

.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}

.flex {
  display: flex;
}

.margin {
  margin-left: 30px;
}

.formStyle .el-form-item {
  margin-bottom: 0;
}
</style>

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
</style>
