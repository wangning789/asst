<template>
  <div>
    <ElTable
      ref="table"
      :data="failList"
      border
      height="500"
    >
      <ElTableColumn
        prop="importFailRecordNumber"
        label="表格序号"
      />
      <ElTableColumn
        prop="importFailReason"
        label="错误原因"
      />
    </ElTable>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
export default {
  props: { failList: { type: Array, default: () => [] } },
  components: {
    ElTable,
    ElTableColumn,
  },
}
</script>
