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
            创建任务<i class="el-icon-arrow-down el-icon--right" />
          </ElButton>
          <ElDropdownMenu slot="dropdown">
            <ElDropdownItem>goby数据导入</ElDropdownItem>
            <ElDropdownItem>nmap文件导入</ElDropdownItem>
            <ElDropdownItem>FOFA结果文件导入</ElDropdownItem>
          </ElDropdownMenu>
        </ElDropdown>
      </div>
      <div :class="$style.right">
        <ElSelect
          v-model="value"
          default-first-option
          placeholder="请选择任务类型"
          clearable
          filterable
          size="small"
        >
          <ElOption
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElInput
          v-model.lazy.trim="keyword"
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
          prop="name"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-button el-button--text"
              :to="`/assetsProbe/${row.id}/info`"
            >
              {{ row.name }}
            </RouterLink>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="任务类型"
          prop="network_type"
        />
        <ElTableColumn
          label="任务执行状态"
          prop="useStatus"
        >
          <template #default="{ row }">
            <div>
              <div
                v-if="row.useStatus === 0"
                :class="$style.probeStatus"
              >
                正常
              </div>
              <div
                v-else
                :class="$style.probeStatu"
              >
                异常
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="添加时间"
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
                @click="goToEdit(row)"
              >
                编辑
              </ElButton>
              <ElDivider direction="vertical" />
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
import { serverGetAllList } from '@/api/assets/assetsInfo/server'
import { probeGetAllList, del, ASSET_PROBE } from '@/api/assets/assetprobe'
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
      keyword: '',
      ruleForm: {},
      probeType: [],
      options: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
      value: '',
    }
  },
  computed: {
    STYLE: () => ASSET_PROBE,
  },
  watch: {
    keyword() {
      this.$refs.table.fetch()
    },
  },
  methods: {
    async get() {
      const res = await probeGetAllList({ keyword: this.keyword })
      return res
    },
    getAssetsTypeAll() {
      serverGetAllList({}).then(res => {
        this.probeType = res.data.body.dataList.list
      })
    },
    goToEdit(row) {
      this.title = 'edit'
      this.drawer = true
      this.ruleForm = row
    },
    delProbe(row) {
      const id = row.id
      del(id).then(res => {
        if (res.data.status) {
          this.$notify.warning('删除资产关系成功')
          this.$refs.table.fetch()
        }
      })
    },
  },
  created() {
    this.getAssetsTypeAll()
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
  width: 40px;
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
  width: 40px;
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
