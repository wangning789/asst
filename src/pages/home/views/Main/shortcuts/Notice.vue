<!-- 公告 -->
<template>
  <div>
    <IBar :to="to">
      公告列表
    </IBar>

    <ElTabs v-model="query.pageType">
      <ElTabPane
        label="最新"
        name="0"
      >
        <ITable
          :get="page"
          :query="query"
          :head="head"
          layout
        />
      </ElTabPane>

      <ElTabPane
        label="最热"
        name="1"
      >
        <ITable
          :get="page"
          :query="query"
          :head="head"
          layout
        />
      </ElTabPane>

      <ElTabPane
        v-if="hasCollect"
        label="我的收藏"
        name="2"
      >
        <ITable
          ref="table"
          :get="page"
          :query="query"
          :head="head"
          layout
        >
          <ElTableColumn
            label="操作"
          >
            <template #default="{ row }">
              <i
                class="el-icon-delete"
                :class="$style.mgl"
                title="移除"
                @click="del(row)"
              />
            </template>
          </ElTableColumn>
        </ITable>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ElTableColumn from 'element-ui/lib/table-column'
import ITable from '@com/Table'
import IBar from './Bar'

import {
  customerNoticeList,
  cancelMark,
  sellList, noticeList, cloudServiceList,
} from '@/api/servicePlatform/notice'

import { ROLES } from '@/enums'
import { MODULE } from '@/enums/module'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IBar, ITable, ElTableColumn, ElTabs, ElTabPane },
  data() {
    return { query: { pageType: '0', pageSize: 5, noticeStatus: 1, noticeType: '1' } }
  },
  computed: {
    to: () => ({ id: MODULE.noticeCenter }),
    hasCollect() { return this.authFit(ROLES.custom) },
    page() {
      switch (true) {
        case this.authFit(ROLES.custom):
          return customerNoticeList
        case this.authFit(ROLES.sales):
          return sellList
        case this.authFit('OTHER'):
          return noticeList
        case this.authFit(ROLES.cloudService):
          return cloudServiceList
        default:
          return null
      }
    },
    head() {
      return [
        {
          label: '公告标题',
          formatter: (row: any) => this.$createElement(
            'RouterLink',
            {
              class: 'el-link el-link--primary ' + (
                row.readStatus
                  ? 'el-icon-document-checked'
                  : 'el-icon-document-delete'
              ),
              props: {
                to: {
                  id: MODULE.noticeCenter,
                  path: `${row.id}/detail`,
                  append: true,
                },
              },
            },
            row.title
          ),
        },
        { prop: 'takeEffectTime', label: this.headTime() },
      ]
    },
  },
  methods: {
    async del(obj: any) {
      await this.$confirm(
        '确认取消收藏？',
        '取消收藏确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await cancelMark({ id: obj.id })
      ;(this.$refs.table as any).fetch()
      this.$notify.success(`已取消收藏【${obj.title}】`)
    },

    headTime() {
      if (this.query.pageType === '2') {
        return '收藏时间'
      } else {
        return '发布时间'
      }
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.mgl {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
