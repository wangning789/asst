/** 注册模块 */
import { Component, AsyncComponent } from 'vue'

import { isString } from '@/utils'
import { getAsync } from '@com/hoc'

/** 微件字典 */
const WIDGETS: { [key: string]: Component | AsyncComponent } = {
  /** 内置微件 */
}

/** 外部微件(先上传, 约定微件包内容, 提供开发脚手架) */
type widget = {
  js: string | string[]
  css?: string | string[]
}

const REG_JS = /([^\\/]+).js[^\w]*$/
function defaultResolver(urls: string[]): Component | AsyncComponent {
  for (const url of urls) {
    let fileName: RegExpExecArray | null | string = REG_JS.exec(url)
    if (fileName) {
      fileName = fileName[1]
      // TODO: 解析 webpackJsonp 对象 【如何管理避免模块冲突&共享模块？】
    }
  }
  return null as any
}
/** 已加载的资源 */
const LOADED: { [url: string]: 1 } = {}
const REG_SKIN = /([^\\/]+)@[^\\/]+\.css/
function appendCSS(url: string) {
  if (LOADED[url]) {
    return
  }

  const tag = document.createElement('link')
  let skin: RegExpExecArray | null | string = REG_SKIN.exec(url)
  skin && (skin = skin[1])
  tag.type = 'text/css'
  const isAlternate =
    skin &&
    (tag.title = skin) !==
      (process.env.SKIN_FIELD ||
        (window as any).__SKIN__ ||
        process.env.SKIN ||
        'default')
  isAlternate && (tag.disabled = true)
  tag.onload = () => {
    tag.onload = null
    LOADED[url] = 1
    if (!isAlternate && skin) {
      tag.disabled = true
      tag.disabled = false
    }
  }
  tag.onerror = error => {
    isAlternate
      ? console.warn(`加载备用皮肤:${skin} ${url} 失败!`, error)
      : console.error(error)
    document.head.removeChild(tag)
  }
  tag.rel = `${isAlternate ? 'alternate ' : ''}stylesheet`
  tag.href = url
  document.head.appendChild(tag)
}
function appendJS(
  url: string,
  resolve: (url: string) => void,
  reject: (reason?: any) => void
) {
  if (LOADED[url]) {
    return resolve(url)
  }

  const tag = document.createElement('script')
  tag.defer = true
  tag.charset = 'utf-8'
  tag.onerror = error => {
    reject(error)
    document.head.removeChild(tag)
  }
  tag.onload = () => {
    LOADED[url] = 1
    resolve(url)
  }
  tag.src = url
  document.head.appendChild(tag)
}
function defaultLoader(widget: widget) {
  // 先加载css, 不管是否成功
  widget.css &&
    (isString(widget.css) ? [widget.css] : widget.css).forEach(url => {
      appendCSS(url)
    })
  // 加载js
  return Promise.all(
    (isString(widget.js) ? [widget.js] : widget.js).map(
      url =>
        new Promise((resolve, reject) => {
          appendJS(url, resolve, reject)
        })
    )
  )
}

/** 注册外部(上传的)微件
 * @param info 外部微件信息, 【! 注意 !】: 微件id需要【固定】且【唯一】
 * @param resolver 组件解析器(解析加载结果)
 * @param loader 微件加载器
 */
function register(
  info: { [id: string]: widget },
  resolver: (
    res: any[],
    id: string
  ) => Component | AsyncComponent = defaultResolver,
  loader: (widget: widget, id: string) => Promise<any> = defaultLoader
) {
  for (const id in info) {
    WIDGETS[id] = getAsync(() =>
      loader(info[id], id).then(res => resolver(res, id))
    )
  }
}

/** 根据ID获取微件
 * @param id
 */
function get(id?: string) {
  // next: 异步组件占位 & ajax 获取
  return WIDGETS[id as string]
}

export { WIDGETS as default, register, get }
