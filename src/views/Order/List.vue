<!-- 订单列表 -->
<template>
  <ElRow v-loading="load">
    <div :class="$style.header">
      <div
        v-for="(item, i) in head"
        :key="item.prop || i"
        :style="`width:${item.width ? `${item.width}px` : width}`"
        :class="$style.head"
      >
        {{ item.label }}
        <ElTooltip
          v-if="item.prop === 'discountOrderPrice'"
          content="价格仅供参考，具体价格以合同为准"
        >
          <svg :class="$style.info">
            <use xlink:href="#i-info" />
          </svg>
        </ElTooltip>
      </div>
    </div>

    <template v-if="data && data.length">
      <!-- 需要性能优化 (for IE) -->
      <ElTable
        v-for="(row, i) of data"
        :key="row.packageOrderNo || i"
        border
        stripe
        :data="row.children"
        :class="[STYLE.table, $style.table]"
      >
        <ElTableColumn
          v-for="(item, j) in head"
          :key="`${row.packageOrderNo || i}_${item.prop || j}`"
          show-overflow-tooltip
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
          <template #header>
            <IHead
              :row="row"
              :prop="item.prop"
            />
          </template>
        </ElTableColumn>
      </ElTable>
    </template>
    <div
      v-else
      :class="$style.empty"
    >
      {{ load ? MSG.load : MSG.empty }}
    </div>

    <ElPagination
      v-show="layout && total"
      ref="page"
      background
      :total="total"
      :layout="layout"
      :page-sizes="sizes"
      :page-size="p.pageSize"
      :current-page="p.page"
      @size-change="setPageSize"
      @current-change="setPage"
    />
  </ElRow>
</template>

<script lang="ts">
// @ts-nocheck
import { CreateElement, RenderContext } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'

import Table from '@com/Table'
import Icon from '@com/Icon'

import MSG from '@/config/message'
import { SERVICE_TYPE, getIcon } from '@/enums/mall'
import formatNumber from '@/utils/formatNumber'
import { type } from '@/utils/browser'

export * from '@com/Table'

/// 选项 name,components,directives,filters,extends,mixins ///
@Component({
  components: {
    IHead: {
      functional: true,
      render(h: CreateElement, { parent, props }: RenderContext) {
        const head: {prop: string}[] = parent.head
        const prop: string = props.prop
        const row = props.row
        const STYLE = parent.$style

        let temp
        switch (prop) {
          case head[0].prop:
            return h('div', { class: STYLE.us }, row.packageOrderNo)
          case head[1].prop:
            temp = row.serviceType
            return h('div', [
              h('span', { class: STYLE.ib }, `下单时间：${row.createDate}`),
              h('span', [
                h(Icon, { props: { icon: getIcon(temp) }, class: STYLE.icon }),
                h('span', SERVICE_TYPE[temp]),
              ]),
            ])
          case parent.showTotal && head[head.length - 1].prop:
            return h('div', [
              '总金额：',
              h(
                'span',
                { class: STYLE.price },
                `￥${formatNumber(row.totalAmount, 2)}元`
              ),
            ])
        }
      },
    },
  },
})
export default class extends Table {
  /// model (@Model) ///
  /// props (@Prop) ///
  @Prop() readonly showTotal?: boolean // 是否展示总金额
  /// data (name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// 非响应式属性 (name?: string) ///
  /// computed (get name() {} set name(){}) ///
  private get MSG() {
    return MSG
  }

  private get width() {
    let width = 0

    const head = this.head
    let rest = head.length

    let item
    let value
    for (item of head) {
      value = +item.width || 0
      width += value
      value && rest--
    }

    return `calc(${100 / rest}% - ${width / rest}px)`
  }

  /// methods (getName(){}) ///
  private mounted() {
    // Fix: IE 显示一半
    type === 'IE' && this.$once('done', () => {
      // (ElTable.$el.offsetWidth/offsetHeight 没变化不会重新布局)
      // const event = document.createEvent('Event')
      // event.initEvent('resize', true, true)
      // window.dispatchEvent(event)
      let children = this.$children
      children = children && children.length && children[0].$children
      if (children && children.length) {
        let table
        for (table of children) {
          table.doLayout && table.doLayout() // 强制重布局
        }
      }
    })
    // 禁用页数选择
    const page = this.$refs.page
    let child
    let select
    for (child of page.$children) {
      if (child.$vnode.tag.includes('sizes')) {
        for (select of child.$children) {
          if (select.$vnode.tag.includes('ElSelect')) {
            select.disabled = true
            break
          }
        }
        break
      }
    }
  }
}
</script>

<style lang="scss" module>
.header {
  display: flex;
  margin-bottom: $gapNormal;
  font-weight: bold;
  background: $colorTheme9;
  user-select: none;

  > div {
    box-sizing: border-box;
    padding: $gapNormal / 2 10px;
  }
}

.table th {
  color: $colorTextMinor !important;
  font-weight: normal;
  background: $colorTheme10 !important;
}

.empty {
  padding-bottom: $gapNormal;
  color: $colorTextMinor;
  text-align: center;
  border-bottom: $borderBase;
}

.us,
.price {
  user-select: text;
}

.ib {
  display: inline-block;
  margin-right: $gapNormal;
}

.price {
  color: $colorTheme;
}

.icon {
  margin-right: $gapNormal / 4;
  vertical-align: middle;
}

.head {
  display: flex;
  align-items: center;
}

.info {
  width: $large;
  height: $large;
}
</style>
