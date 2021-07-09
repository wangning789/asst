<!-- 富文本编辑器 -->
<template>
  <Editor
    :id="id"
    v-model="text"
    style="width: 100%;"
    :init="init"
    @input="change"
  />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from 'vue-property-decorator'

import { API } from '@/api/tools/file'

import { AUTH } from '@/enums'
import { HEAD, getUri } from '@/utils/ajax'

import tinymce from 'tinymce/tinymce.min'
import Editor from '@tinymce/tinymce-vue'
import { i18n } from './zh_CN'

import 'tinymce/plugins/image/plugin.min' // 插入上传图片插件
import 'tinymce/plugins/media/plugin.min' // 插入视频插件
import 'tinymce/plugins/table/plugin.min' // 插入表格插件
import 'tinymce/plugins/lists/plugin.min' // 列表插件
import 'tinymce/plugins/wordcount/plugin.min' // 字数统计插件
import 'tinymce/plugins/anchor/plugin.min' // 锚点插件
import 'tinymce/plugins/print/plugin.min' // 打印插件
import 'tinymce/plugins/save/plugin.min' // 保存插件
import 'tinymce/plugins/link/plugin.min'
import 'tinymce/plugins/preview/plugin.min'
// import 'tinymce/plugins/axupimgs/plugin.min'// 批量图标上传

import 'tinymce/themes/silver/theme.min'
import 'tinymce/icons/default/icons.min'

import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'

import SIZE from '@/scss/export/size.scss'

/// name,components,directives,filters,extends,mixins ///
@Component({ components: { Editor } })
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  @Prop() value!: string
  @Prop() id!: string
  @Prop() data!: string
  @Prop() jude!: string

  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  private text = this.value || ''
  private fileIds = []

  /// private attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  private get init() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this

    return {
      selector: this.id,
      readonly: true,
      // language_url: '/static/zh_CN.js',
      language: 'zh_CN',
      height: 400,
      branding: false,
      // eslint-disable-next-line camelcase
      save_enablewhendirty: false,
      // eslint-disable-next-line camelcase
      save_onsavecallback: function(obj: any) {
        obj.getContent()
      // tipsJS('已保存')
      },
      // skin: '',
      // skin_url: '',
      // content_css: '',
      plugins: 'lists image table wordcount anchor print link preview',
      toolbar:
      'undo redo | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | removeformat | anchor | print | link | preview',
      // eslint-disable-next-line camelcase
      file_picker_types: 'file',
      // eslint-disable-next-line camelcase
      automatic_uploads: true,
      // eslint-disable-next-line camelcase
      images_upload_handler: (blobInfo: any, success: any) => {
        const reader = new FileReader()
        const blob = blobInfo.blob()
        const isLt2M = blob.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2M!')
          return isLt2M
        }

        reader.readAsDataURL(blob)
        reader.onload = function() {
          vm.imgCompress(this.result, { quality: 0.3 }, success)
          // success(this.result)
        }
      },
      // eslint-disable-next-line camelcase
      file_picker_callback(callback: any, value: any, meta: any) {
        let filetype // 文件分类
        // 为不同插件指定文件类型及后端地址
        switch (meta.filetype) {
          case 'image':
            return false
            // filetype = '.jpg, .jpeg, .png, .gif'
            // break
          case 'media':
            filetype = '.mp3, .mp4'
            break
          default:
            filetype = '.pdf, .txt, .zip, .rar, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4'
        }

        // 模拟出一个input用于添加本地文件
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', filetype)
        input.click()
        input.onchange = function(this: any) {
          const load = (vm as any).$loading({ lock: true, text: '上传中' })
          const file: any = this.files[0]
          const formData = new FormData()
          formData.append('file', file, file.name)
          const xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', getUri(API.upload))
          xhr.setRequestHeader(AUTH.head, HEAD[AUTH.head])
          // xhr.setRequestHeader('Accept', 'application/json')
          // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
          // document.getElementsByClassName('tox-dialog')[0].style.zIndex = 0
          xhr.onload = function() {
            load.close()
            let json
            try {
              json = JSON.parse(xhr.responseText)
            } catch (error) {
              json = {}
            }

            if (xhr.status !== 200) {
              return vm.$message.error(json.msg || '发生错误，请稍候重试')
            }

            json = json.body
            // document.getElementsByClassName('tox-dialog')[0].style.zIndex = 1
            // eslint-disable-next-line standard/no-callback-literal
            callback(
              getUri(API.download) + '?fileId=' + json.fileId,
              { text: file.name + `(hash:${json.hashValues})` }
            )
          }
          xhr.send(formData)
        }
      },
    }
  }

  /// watch (@Watch) ///
  /// methods (private/public) ///
  // path是指上传的图片，obj是压缩的品质，越低越模糊
  private imgCompress(path: any, obj: any, success: any) {
    const img = new Image()
    img.src = path
    img.onload = function() {
      // 默认按比例压缩
      let w = img.width
      let h = img.height
      const scale = w / h
      w = Math.min(obj.width || w, +SIZE.lg || w)
      h = obj.height || (w / scale)
      let quality = 1 // 默认图片质量为0.7
      // 生成canvas
      const canvas = document.createElement('canvas')
      const ctx: any = canvas.getContext('2d')
      // 创建属性节点
      const anw = document.createAttribute('width')
      anw.nodeValue = w as any
      const anh = document.createAttribute('height')
      anh.nodeValue = h as any
      canvas.setAttributeNode(anw)
      canvas.setAttributeNode(anh)
      ctx.drawImage(img, 0, 0, w, h)
      // 图像质量
      if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
        quality = obj.quality
      }
      // quality值越小，所绘制出的图像越模糊
      const base64 = canvas.toDataURL('image/jpeg', quality)
      success(base64)
    }
  }

  private change(obj: any) {
    this.$emit('paretnVisibleChange', obj)
  }

  /// LifeCycle (private beforeCreate/created/.../destroyed) ///
  private created() {
    tinymce.addI18n('zh_CN', i18n)
  }

  private mounted() {
    // 只读操作
    if (this.data === 'edit') {
      tinymce.editors[this.id].setMode('design')
    } else if (this.data === 'add') {
      tinymce.editors[this.id].setMode('design')
    } else {
      tinymce.editors[this.id].setMode('readonly')
    }
  }

  private activated() {
    if (this.data !== 'add') {
      const op = this.$route.fullPath.indexOf('add')
      if (op === -1) {
        tinymce.editors[this.id].destroy()
        this.refresh()
      }
    } else {
      tinymce.editors[this.id].destroy()
      this.refresh()
    }
  }
}
</script>

<style lang="scss">
.tox-tinymce-aux,
.tox .tox-dialog {
  z-index: $zPanel;
}

.tox-locked::after {
  position: absolute;
  left: 75px;
  margin-top: 6px;
  color: $colorTextMinor;
  content: '建议图片宽度不超过#{$lg}';
  pointer-events: none;
}
</style>
