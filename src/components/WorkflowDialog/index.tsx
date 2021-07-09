/** 工作流系统集成 只允许操作顶层弹窗 */
import { CreateElement } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

import Loading from '@com/Loading'
import CONFIG, { SPA } from '@/config'
import { url } from '@/functions/validators'

import STYLE from './index.module.scss'

export interface IWorkflowDialog {
  title: string // 弹窗名称
  src: string // 慧正流程URL
}

const instanceList: WorkflowDialog[] = []

@Component
class WorkflowDialog extends Vue {
  src!: string
  title!: string
  loading = true
  $_isTop?: boolean
  $_msg?: 'close' | 'hide'
  onmessage?: (msg: MessageEvent) => void
  msgHandler?: (msg: MessageEvent) => void

  private get frameOn() {
    let count = 0
    return {
      load: () => {
        this.updateTitle()
        this.loading = false
        count++ && (this.$_msg = 'close')
      },
    }
  }

  private updateTitle() {
    if (!instanceList.indexOf(this)) {
      return
    }

    const iframe: any = this.$refs.i
    let title
    try {
      title = (
        (iframe.contentDocument || 0).title ||
        iframe.contentWindow.document.title
      )
        .trim()
        .replace(
          /[\s-]*[^\s-]*(?:慧正|\u6167\u6b63|工作流|\u5de5\u4f5c\u6d41)[^\s-]*[\s-]*/,
          ''
        )
    } catch (error) {}
    title && (this.title = title)
  }

  close(msg: MessageEvent) {
    instanceList.pop()
    instanceList.length &&
      (instanceList[instanceList.length - 1].$_isTop = true)
    document.body.removeChild(this.$el)
    this.msgHandler && window.removeEventListener('message', this.msgHandler)
    !msg &&
      this.onmessage &&
      this.onmessage({ data: this.$_msg } as MessageEvent)
  }

  private created() {
    this.$_msg = 'hide'
    window.addEventListener(
      'message',
      (this.msgHandler = (msg: MessageEvent) => {
        if (!this.$_isTop) {
          return
        }

        if (this.onmessage) {
          try {
            this.onmessage(msg)
          } catch (error) {
            console.error('WorkflowDialog:', error)
          }
        }

        const message = msg.data as string
        switch (true) {
          case !message.indexOf('loading'):
            this.loading = true
            return
          case !message.indexOf('loaded'):
            this.updateTitle()
            this.loading = false
            return
          case !message.indexOf('close'):
            return this.close(msg)
          case !message.indexOf('open:'):
            return showDialog(message.substring(5))
        }
      })
    )
    this.$once('hook:beforeDestroy', () => {
      this.msgHandler && window.removeEventListener('message', this.msgHandler)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    return (
      <el-dialog
        modal={false}
        custom-class={STYLE.wrapper}
        visible
        title={this.title}
        onclose={this.close}
      >
        {this.loading && <Loading class={STYLE.loading} />}
        <iframe
          ref="i"
          key="i"
          src={this.src}
          on={this.frameOn}
          frameborder="0"
          width="100%"
          height="800px"
        />
        {/* height={window.innerHeight * 0.8 + 'px'} */}
      </el-dialog>
    )
  }
}

function getUrl(src: string) {
  try {
    url(src)
    return src
  } catch (error) {
    const workflow = CONFIG[SPA.workflow]
    return (
      (workflow[workflow.length - 1] === '/' ? workflow : workflow + '/') +
      (src[0] === '/' ? src.substring(1) : src)
    )
  }
}

export function showDialog(
  src: string,
  title?: string,
  onmessage?: (msg: MessageEvent) => void
) {
  const instance = new WorkflowDialog({
    el: document.createElement('div'),
    data: { src: getUrl(src), title: title || '查看详情', onmessage },
  })
  instanceList.length && (instanceList[instanceList.length - 1].$_isTop = false)
  instance.$_isTop = true
  instanceList.push(instance)
  document.body.appendChild(instance.$el)
}
