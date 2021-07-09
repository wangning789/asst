<!-- API/元素权限 -->
<template>
  <!-- 选择服务器弹窗 -->
  <ElDialog
    v-if="visible"
    visible
    title="选择服务器"
    @close="close"
  >
    <div>
      <ElInput
        v-model="keyword"
        clearable
        suffix-icon="i-sousuo"
        placeholder="请输入关键字"
        :class="$style.search"
      />

      <ITable
        ref="table"
        :head="head"
        :get="page"
        :query="query"
        :popper-class="$style.popper"
        @done="done"
        @select="select"
      >
        <template #prefix>
          <ElTableColumn
            type="selection"
            width="50"
          />
        </template>
      </ITable>
    </div>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <ElButton @click="close">
        取 消
      </ElButton>
      <ElButton
        type="primary"
        @click="sure"
      >
        确 定
      </ElButton>
    </div>
  </ElDialog>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
// import ISelect from './Select'
import ITable, { ElTableColumn } from '@com/Table'

import getCode from '@/enums/code'

import {
  forAppList,
} from '@/api/servicePlatform/serverAssets'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    visible: { type: null as any, default: null },
    ownUserId: { type: String, required: true },
    value: { type: Array, required: false, default: () => [] },
  },
  components: { ITable, ElTableColumn },
  data() {
    return {
      keyword: '',
      table: null,
      selection: [],
    }
  },
  computed: {
    NETWORK_AREA: () => NETWORK_AREA.value,
    page: () => forAppList,
    head() {
      return [
        { prop: 'ciName', label: ' 服务器名称' },
        { prop: 'ipAddress', label: 'IP地址' },
        { prop: 'cloudPlatform', label: '所属云平台' },
        {
          prop: 'networkArea',
          label: '所属区域',
          formatter: (row: any) => {
            return this.NETWORK_AREA[row.networkArea]
          },
        },
        { prop: 'os', label: '操作系统' },
      ]
    },
    query() {
      return {
        keyword: this.keyword || '',
        ownUserId: this.ownUserId,
      }
    },
  },
  methods: {
    sure() {
      this.$emit('input', this.selection)
      this.close()
    },
    close() {
      this.$emit('update:visible', null)
    },
    done(rows: Row[], table: any) {
      this.table = table
      for (const row of rows) {
        if (this.value && this.value.length) {
          for (const item of this.value) {
            if (row.id === item.id) {
              this.table.toggleRowSelection(row)
            }
          }
        }
      }
    },
    select(selection: Row[]) {
      this.selection = selection
    },
    // /** 刷新表格数据 */
    fetch() {
      ;(this.$refs.table as any).fetch()
    },
  },
}
</script>

<style lang="scss" module>
.search {
  width: 220px;
  margin: 0 $gapNormal / 2 $gapNormal / 2 0;
}

.select :global(.el-table__body-wrapper) {
  max-height: 41vh;
  overflow-y: auto;
}

.popper {
  z-index: $zInfo !important;
}
</style>
