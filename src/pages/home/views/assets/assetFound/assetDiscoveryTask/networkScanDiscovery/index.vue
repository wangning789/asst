<!-- 描述 -->
<template>
  <div>
    <div :class="$style.flex">
      <div :class="$style.left">
        <ElDropdown>
          <ElButton
            type="primary"
            size="small"
          >
            新建任务<i class="el-icon-arrow-down el-icon--right" />
          </ElButton>
          <ElDropdownMenu slot="dropdown">
            <ElDropdownItem>
              <RouterLink
                class="el-link el-link--primary"
                :to="'assetDiscoveryTask/internetAssetDiscovery'"
              >
                互联网资产发现
              </RouterLink>
            </ElDropdownItem>
            <ElDropdownItem>
              <RouterLink
                class="el-link el-link--primary"
                :to="'assetDiscoveryTask/intranetAssetDiscovery'"
              >
                内网资产发现
              </RouterLink>
            </ElDropdownItem>
          </ElDropdownMenu>
        </ElDropdown>
      </div>
      <div :class="$style.right">
        <ElSelect
          v-model="form.taskType"
          default-first-option
          placeholder="请选择任务类型"
          clearable
          filterable
          size="small"
        >
          <ElOption
            v-for="(item,index) in PROBE_INT"
            :key="index"
            :label="item"
            :value="index"
          />
        </ElSelect>
        <ElInput
          v-model="form.keyword"
          clearable
          size="medium"
          suffix-icon="i-sousuo"
          placeholder="输入任务名称或者关联组织机构"
        />
      </div>
    </div>
    <div :class="$style.contenner">
      <ITable
        ref="table"
        :get="get"
        :query="query"
      >
        <ElTableColumn width="50px" />
        <ElTableColumn
          label="任务名称"
          prop="taskName"
          width="130px"
        >
          <template #default="{ row }">
            <div v-show="row.taskTypeName ==='互联网资产发现'">
              <RouterLink
                class="el-button el-button--text"
                :to="`/assetDiscoveryTask/internet/${row.id}/info`"
              >
                {{ row.taskName }}
              </RouterLink>
            </div>
            <div v-show="row.taskTypeName ==='内网资产发现'">
              <RouterLink
                class="el-button el-button--text"
                :to="`/assetDiscoveryTask/intranet/${row.id}/info`"
              >
                {{ row.taskName }}
              </RouterLink>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="任务类型"
          prop="taskTypeName"
        /><ElTableColumn
          label="扫描目标"
          prop="discoverContent"
        />
        <ElTableColumn
          label="关联组织机构"
          prop="belongCompanyIdName"
        />

        <ElTableColumn
          label="任务状态"
        >
          <template #default="{ row }">
            <div v-show="row.taskStatus === '1'">
              <div

                :class="$style.probeStatus"
              >
                未开始
              </div>
            </div>
            <div v-show="row.taskStatus === '2'">
              <div

                :class="$style.probeStatus"
              >
                执行中
              </div>
            </div>
            <div v-show="row.taskStatus === '3'">
              <div
                :class="$style.probeStatu"
              >
                异常
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="任务创建时间"
          width="200px"
          prop="createDate"
        />
        <ElTableColumn
          fixed="right"
        >
          <template #default="{ row }">
            <div :class="$style.tableRight">
              <ElButton
                type="text"
                size="small"
                :class="$style.color"
                @click="delProbe(row)"
              >
                删除
              </ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ITable>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import ITable, { ElTableColumn } from '@/components/Table'
import { discoveryResultDelete, discoveryResultListAll, PROBE_INT } from '@/api/assets/discoveryResilt'
/** emit: (事件名: [参数列表, ...]) */
export default {
  components: {
    ITable,
    ElTableColumn,
  },
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  data() {
    return {
      query: {},
      ruleForm: {},
      probeType: [],
      form: {
        taskType: '',
        keyword: '',
      },
    }
  },
  computed: {
    PROBE_INT: () => PROBE_INT,
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.$refs.table.fetch()
      },
    },
  },
  methods: {
    async get() {
      // switch (true) {
      //   case this.authFit(ROLES.systemAdmin):
      //     fn = discoveryResultListAll
      //     break
      //   case this.authFit(ROLES.assetManager):
      //     fn = discoveryResultListBiz
      //     break
      //   default:
      //     break
      // }
      const fn = discoveryResultListAll
      const res = await fn(this.form)
      return res
    },
    delProbe(row) {
      const id = row.id
      discoveryResultDelete(id).then(res => {
        if (res.data.status) {
          this.$notify.warning('删除资产发现任务成功')
          this.$refs.table.fetch()
        } else {
          this.$notify.warning(res.data.body)
        }
      })
    },
  },
}
</script>

<style lang="scss" module>
.title {
  width: 100%;
  border-bottom: 1px solid $colorBorderLv1;

  h3 {
    margin: 4px 0 18px;
    font-weight: bold;
    font-size: 16px;
  }
}

.flex {
  display: flex;
  justify-content: space-between;

  .right {
    display: flex;
  }
}

.color {
  color: red;
}

.probeStatus {
  width: 60px;
  height: 20px;
  color: #68c23a;
  font-size: 6px !important;
  line-height: 20px;
  text-align: center;
  background-color: rgba(204, 204, 204, 0.342);
  border: 1px solid rgba(236, 236, 236, 0);
  border-radius: 10px;
}

.probeStatu {
  width: 60px;
  height: 20px;
  color: red;
  font-size: 6px !important;
  line-height: 20px;
  text-align: center;
  background-color: rgba(204, 204, 204, 0.342);
  border: 1px solid rgba(236, 236, 236, 0);
  border-radius: 10px;
}

.right :global(.el-input__inner) {
  width: 190px;
  margin-left: 10px;
}

.contenner {
  margin-top: 10px;
}

.tableRight {
  float: right;
}

.dropdow {
  color: #2c73df;
  font-size: 10px;
}
</style>
