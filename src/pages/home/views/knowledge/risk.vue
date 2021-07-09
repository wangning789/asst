<!--分割线-->
<template>
  <div class="el-card">
    <h3>风险预警</h3>
    <ElRow
      :class="$style.mg"
    >
      <ElTabs
        v-model="params.pageType"
      >
        <ElTabPane
          label="最新"
          name="0"
        >
          <ITable
            v-if="params.pageType==='0'"
            ref="table"
            :get="page"
            :query="query"
            :head="headFirst"
          />
        </ElTabPane>
        <ElTabPane
          label="最热"
          name="1"
        >
          <ITable
            v-if="params.pageType==='1'"
            ref="table"
            :get="page"
            :query="query"
            :head="headFirst"
          />
        </ElTabPane>
        <ElTabPane
          v-if="isCustom"
          label="我的收藏"
          name="2"
        >
          <ITable
            v-if="params.pageType==='2'"
            ref="table"
            :get="page"
            :query="query"
            :head="headThird"
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
    </ElRow>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ITable, { ElTableColumn } from '@com/Table'

import {
  customerNoticeList,
  cancelMark,
  sellList,
  noticeList,
  cloudServiceList,
} from '@/api/servicePlatform/notice'
import { ROLES } from '@/enums/index'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, ElTabs, ElTabPane },
  data() {
    return {
      params: {
        Type: '3',
        noticeStatus: 1,
        noticeType: '3',
      },
    }
  },
  computed: {
    isCustom() {
      return this.authFit(ROLES.custom)
    },
    page() {
      let url = ''
      switch (true) {
        case this.isCustom:
          url = customerNoticeList // kefu
          break
        case this.authFit(ROLES.sales):
          url = sellList
          break
        case this.authFit(ROLES.cloudService):
          url = cloudServiceList
          break
        default:
          url = noticeList // yunyun
          break
      }
      return url
    },
    query(this: any) {
      return this.params
    },
    headFirst() {
      return [
        {
          prop: 'title',
          label: '标题',
          width: '800px',
          formatter: (row: any) => {
            return row.domainName || this.$createElement(
              'div',
              {
                class: 'el-link el-link--primary',
                on: {
                  click: () => {
                    window.pageType = this.params.pageType
                    this.jump({ path: `${this.route.fullPath}/${row.id}/detail`, append: true })
                  },
                },
                props: { to: `${this.route.fullPath}/${row.id}/detail` },
              },
              row.title
            )
          },
        },
        { prop: 'readCount', label: '浏览次数' },
        { prop: 'takeEffectTime', label: '发布时间' },
      ]
    },
    headThird() {
      return [
        {
          prop: 'title',
          label: '公告标题',
          formatter: (row: any) => {
            return row.domainName || this.$createElement(
              'div',
              {
                class: 'el-link el-link--primary',
                props: { to: `${this.route.fullPath}/${row.id}/detail` },
                on: {
                  click: () => {
                    window.pageType = this.params.pageType
                    this.jump({ path: `${this.route.fullPath}/${row.id}/detail`, append: true })
                  },
                },
              },
              row.title
            )
          },
        },
        { prop: 'readCount', label: '浏览次数' },
        { prop: 'takeEffectTime', label: '收藏时间' },
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
  },
  mounted() {
    // console.log(this.isCustom)
    if (window.pageType) {
      this.params.pageType = window.pageType
    }
  },
}
</script>

<style lang="scss">
  @import '~element-ui/packages/theme-chalk/src/tabs';
  @import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang="scss" module>
  .mg {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .mgl {
    margin-right: 10px;
    margin-left: 10px;
  }
</style>
