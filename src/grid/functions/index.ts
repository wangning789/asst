/** 布局算法 */
import { Component, AsyncComponent, VNodeData } from 'vue'
import { isNumber } from '@/utils'
import { SIZE } from '@/enums'
import { get } from '@/grid/widgets'

import SSIZE from '@/scss/export/size.scss'

/** 内容溢出行为 */
export type overflow = 'auto' | 'hidden' | 'scroll' | 'visible'

/** 网格 */
export type cell = {
  /** 水平坐标(单元格倍数) */
  x: number
  /** 竖直坐标(单元格倍数) */
  y: number
  /** 宽度(单元格倍数/px) */
  w: number | string
  /** 高度(单元格倍数/px) */
  h: number | string
  /** 层级 */
  z?: number
  /** overflow-x */
  ox?: overflow
  /** overflow-y */
  oy?: overflow

  /** 目标微件id */
  is?: string
  /** 传递给目标微件的组件数据 */
  data?: VNodeData
  // ... 留待扩展
}
/** 布局 */
export type layout = {
  /** 块 */
  cells: cell[]
  /** 水平间距(css单位) */
  gapx?: string
  /** 竖直间距(css单位) */
  gapy?: string
  /** 顶部距离(px/width%) */
  top?: number | string
  /** 左侧距离(px/width%) */
  left?: number | string
  /** 右侧距离(px/width%) */
  right?: number | string
  /** 底部距离(px/width%) */
  bottom?: number | string
}
/** 响应式布局 */
export type responsiveLayout = {
  /** < 768px */
  [SIZE.xSmall]?: layout
  /** 768px ~ 992px */
  [SIZE.small]?: layout
  /** 992px ~ 1200px */
  [SIZE.medium]?: layout
  /** 1200px ~ 1920px */
  [SIZE.large]?: layout
  /** > 1920px */
  [SIZE.xLarge]?: layout
  /** 默认尺寸(默认: SIZE.medium 查找顺序: 向下最接近的 => default) */
  default?: SIZE
}

const UNIT = 'px'
const COLUMNS = 24
const PX_DIGIT = 1 // 小数位数
const REG_NUM = /^(\d+(?:\.\d+)?)(.*)$/
const SIZES = [
  { w: +SSIZE[SIZE.xLarge], n: SIZE.xLarge },
  { w: +SSIZE[SIZE.large], n: SIZE.large },
  { w: +SSIZE[SIZE.medium], n: SIZE.medium },
  { w: +SSIZE[SIZE.small], n: SIZE.small },
  { w: 0, n: SIZE.xSmall },
]

function getLayout(data: responsiveLayout, width?: number) {
  width || (width = window.innerWidth)
  for (let i = 0, len = SIZES.length, item; i < len; i++) {
    item = SIZES[i]
    if (width > item.w) {
      if ((item = data[item.n])) {
        return item
      }

      while (++i < len) {
        if ((item = data[SIZES[i].n])) {
          return item
        }
      }

      return data[data.default || SIZE.medium]
    }
  }
}
function getPX(number: string | number | undefined, base: number) {
  return number
    ? isNumber(number)
      ? number
      : ((parseFloat(number) || 0) / 100) * base
    : 0
}
function getGap(gapx?: string, gapy?: string) {
  gapx && (gapx = REG_NUM.exec(gapx) as any)
  gapy && (gapy = REG_NUM.exec(gapy) as any)
  return gapy || gapx
    ? `padding:${gapy ? +gapy[1] / 2 + (gapy[2] || UNIT) : '0'} ${
      gapx ? +gapx[1] / 2 + (gapx[2] || UNIT) : '0'
    };`
    : ''
}

/** 获取编辑容器内边距
 * @param layout 布局
 * @param width 容器宽度
 */
function getPading(layout: layout, width?: number) {
  width || (width = window.innerWidth)
  return `padding:${getPX(layout.top, width) + UNIT} ${getPX(
    layout.right,
    width
  ) + UNIT} ${getPX(layout.bottom, width) + UNIT} ${getPX(layout.left, width) +
    UNIT}`
}

/** 获取单元格尺寸
 * @param layout 布局
 * @param width 容器宽度
 * @param sizeFix 尺寸修正值
 */
function getSize(layout: layout, width?: number, sizeFix?: number) {
  width || (width = window.innerWidth)
  return (
    (
      (width - getPX(layout.left, width) - getPX(layout.right, width)) /
        COLUMNS +
      (sizeFix || 0)
    ).toFixed(PX_DIGIT) + UNIT
  )
}

/** 样式取二者最大数值
 * @param style 样式
 * @param attr 样式名
 * @param number 比较数值
 * @param delta 增量
 */
function max(style: string, attr: string, number: number, delta?: number) {
  return style.replace(
    new RegExp(`([^\\w-]?${attr} *: *)(\\d+(?:\\.\\d+)?)([^;]*)`),
    (match, name, value, unit) =>
      name + (Math.max(+value, number) + (delta || 0)) + unit
  )
}

/** 渲染信息 */
export type renderInfo = {
  /** 需要的高度等 */
  style: string
  /** 网格信息 */
  cells: { is?: Component | AsyncComponent; data?: VNodeData; style: string }[]
}
/** 获取渲染信息
 * @param data 数据
 * @param width 容器宽度
 */
function render(data: responsiveLayout | layout, width?: number) {
  width || (width = window.innerWidth)
  let layout: layout | undefined
  if ((data as layout).cells) {
    layout = data as layout
  } else {
    layout = getLayout(data as responsiveLayout, width)
  }

  const info: renderInfo = { cells: [] } as any
  if (!layout || !layout.cells || !layout.cells.length) {
    info.style = 'height:' + width / COLUMNS + UNIT
    return info
  }

  const top = getPX(layout.top, width)
  const left = getPX(layout.left, width)
  const cellSize = (width - left - getPX(layout.right, width)) / COLUMNS

  // 计算所有网格的渲染信息
  const gap = getGap(layout.gapx, layout.gapy)
  let maxHeight!: number
  for (let i = 0, len = layout.cells.length, cell, y, h, t; i < len; i++) {
    cell = layout.cells[i]
    y = cell.y * cellSize || 0
    h = (isNumber(cell.h) ? cell.h * cellSize : parseFloat(cell.h)) || 0
    t = y + h
    maxHeight > t || (maxHeight = t)
    info.cells.push({
      is: get(cell.is),
      data: cell.data,
      style: `${gap}width:${(isNumber(cell.w)
        ? (cell.w * cellSize).toFixed(PX_DIGIT)
        : parseFloat(cell.w)) + UNIT};height:${h.toFixed(PX_DIGIT) +
        UNIT};top:${(top + y).toFixed(PX_DIGIT) + UNIT};left:${(
        left +
        cell.x * cellSize
      ).toFixed(PX_DIGIT) + UNIT};${cell.z ? `z-index:${cell.z};` : ''}${
        cell.ox ? `overflow-x:${cell.ox};` : ''
      }${cell.oy ? `overflow-y:${cell.oy};` : ''}`,
    })
  }
  info.style =
    'height:' + (top + getPX(layout.bottom, width) + maxHeight) + UNIT

  return info
}

export { getPading, getSize, max, render }
