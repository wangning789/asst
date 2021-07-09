<template>
  <div>
    <ITable
      ref="table"
      :data="ciChangeRecordList"
    >
      <ElTableColumn
        prop="changeDate"
        label="变更时间"
      />
      <ElTableColumn
        prop="changeContent"
        label="变更内容"
      >
        <template #default="{ row }">
          <div v-html="row.changeContent" />
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="changeUserName"
        label="变更人"
      />
    </ITable>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import ITable from '@/components/Table'
export default {
  props: {
    ciChangeRecordList: { type: Array, required: true },
  },
  components: {
    ITable,
  },
}
</script>
