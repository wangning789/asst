<!-- 描述 -->
<template>
  <div>
    <div
      :class="$style.total"
      style=" margin: 20px 0;"
    >
      <div style="font-size: 18px;">
        安全事件总数&nbsp;&nbsp;{{ total }}
      </div>
      <div :class="$style.moreSearch">
        {{ emergency }}
      </div>
      <div :class="$style.number">
        {{ general }}
      </div>
    </div>
    <ElForm
      :inline="true"
      :label-width="CONFIG.labelWidth"
      :model="filterForm"
      :class="$style.searchForm"
    >
      <ElFormItem label="查询详情：">
        <ElInput
          v-model="filterForm.keyword"
          clearable
          placeholder="请输入事件编号和事件名称"
        />
      </ElFormItem>

      <ElFormItem label="事件级别：">
        <ElSelect
          v-model="filterForm.incidentLevel"
          placeholder="请选择事件级别"
          clearable
        >
          <ElOption
            v-for="(val, key) in REPLACE"
            :key="key"
            :label="val"
            :value="key"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="处置状态:">
        <ElSelect
          v-model="filterForm.incidentStatus"
          placeholder="请选择处置状态"
          clearable
        >
          <ElOption
            v-for="(val, key) in STATUS"
            :key="key"
            :label="val"
            :value="key"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <ITable
      ref="table"
      v-loading="isLoadingTable"
      style="width: 94vw;"
      :head="head"
      :get="activeName === '0' && queryHost"
      :query="filterForm"
    >
      <!-- <ElTableColumn
        width="100"
        label="详情"
      >
        <template #default="{ row }">
          <span
            :class="$style.tableClic"
            @click="click(row)"
          >查看</span>
        </template>
      </ElTableColumn> -->
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import getCode from '@/enums/code'
import ITable from '@com/Table'
// import ITable, { ElTableColumn } from '@com/Table'
import { businessId, getIncidentCount } from '@/api/systemManage/organization'

const REPLACE = getCode('1', 'SYS_EVENT_LEVEL')
const STATUS = getCode('1', 'SYS_EVENT_STATUS')
export default {
  props: {
    business: { type: String, default: '' },
    activeName: { type: String, default: '0' },
  },
  components: {
    ITable,
    // ElTableColumn,
  },
  data() {
    return {
      general: 0,
      emergency: 0,
      total: 0,
      filterForm: {
        businessId: '',
      },
      isLoadingTable: false,
    }
  },

  computed: {
    REPLACE: () => REPLACE.value || [],
    STATUS: () => STATUS.value || [],
    head: () => [
      { prop: 'incidentNo', label: '安全事件编号' },
      { prop: 'incidentReportDate', label: '事件上报时间' },
      { prop: 'incidentHappenDate', label: '事件发生时间' },
      { prop: 'incidentName', label: '事件名称' },
      { prop: 'associateHostIds', label: '相关主机' },
      {
        label: '事件级别',
        formatter: (row) => {
          for (const key in REPLACE.value) {
            if (key === row.incidentLevel) {
              return REPLACE.value[key]
            }
          }
        },
      },
      {
        label: '处置状态',
        formatter: (row) => {
          for (const key in STATUS.value) {
            if (key === row.incidentStatus) {
              return STATUS.value[key]
            }
          }
        },
      },

    ],
    queryHost() {
      return businessId
    },
  },

  methods: {
    click(row) {
      this.$router.push({
        path: `securityIncident/${row.id}/info`,
      })
    },
    async businessId() {
      const res = await businessId.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },

  },
  mounted() {
    this.filterForm.businessId = this.business
    getIncidentCount({ businessId: this.business }).then(res => {
      this.total = res.data.total
      this.emergency = res.data.emergency
      this.general = res.data.general
    })
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
<style lang="scss" module>
.tableClic {
  color: #3273c4;
}

.tableClic:hover {
  cursor: pointer;
}

.moreSearch {
  padding: 2px 4px;
  color: white;
  background-color: #f66;
  border-radius: 4px;
}

.number {
  padding: 2px 4px;
  color: white;
  background-color: #ccc;
  border-radius: 4px;
}

.total {
  display: flex;
  align-items: center;

  div {
    margin: 0 10px;
  }
}

</style>
