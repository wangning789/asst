<!-- API/元素权限 -->
<template>
  <div>
    <ElInput
      v-model="keyword"
      size="small"
      clearable
      suffix-icon="i-sousuo"
      placeholder="请输入关键字"
      :class="$style.search"
    />
    <ElButton
      type="text"
      icon="el-icon-connection"
      @click="visible = true"
    >
      关联{{ ele ? '元素' : 'API' }}
    </ElButton>
    <ISelect
      ref="table"
      :ele="ele"
      :head="head"
      :query="{ ...query, keyword }"
    />

    <ElDialog
      :visible="visible"
      :title="`关联${ele ? '元素' : 'API'}`"
      width="80%"
      @close="close"
    >
      <ElInput
        v-model="keyword1"
        size="small"
        clearable
        suffix-icon="i-sousuo"
        placeholder="请输入关键字"
        :class="$style.search"
      />
      <ISelect
        ref="select"
        batch
        :ele="ele"
        :head="head"
        :query="{ ...query, keyword: keyword1 }"
        :class="$style.select"
      />

      <template #footer>
        <ElButton
          type="primary"
          size="small"
          :loading="loading"
          @click="loading || bind()"
        >
          确定
        </ElButton>

        <ElButton
          size="small"
          @click="close"
        >
          取消
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ISelect from './Select'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 查询参数 */
    query: { type: Object, required: true },
    /** 表头 */
    head: { type: Array, required: true },
    /** 是否元素权限 */
    ele: { type: Boolean },
  },
  components: { ISelect },
  data: () => ({ visible: false, loading: false, keyword: '', keyword1: '' }),
  methods: {
    close() {
      this.visible = false
      ;(this.$refs.select as any).clearSelection()
    },
    bind() {
      try {
        ;(this.$refs.select as any).bind()
          .then(() => {
            ;(this.$refs.table as any).fetch()
            this.close()
          })
          .finally(() => {
            this.loading = false
          })
        this.loading = true
      } catch (error) {
        this.$message.warning(error.message || '发生错误，请稍后重试')
      }
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
</style>
