<!-- eslint-disable vue/no-v-html -->
<!-- 描述 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.query.id,route.fullPath]"
    :class="'el-card ' + $style.wrapper"
  >
    <div :class="$style.fr">
      <RouterLink
        v-show="state === 'info'"
        class="el-button el-button--text"
        :to="`edit?id=${route.query.id}&state=edit`"
      >
        <i :class="'i-bianji '" /> 编辑
      </RouterLink>
      <ElButton
        v-show="state !== 'add'"
        type="text"
        :icon="'i-shanchu1 '"
        @click="delServe"
      >
        删除
      </ElButton>
      <ElButton
        v-show="state !== 'add'"
        type="text"
        :icon="form.serviceStatus ? 'i-xiajia' : 'i-shangjia'"
        @click="putaway"
      >
        {{ title }}
      </ElButton>
    </div>

    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        inline
        label-position="right"
        :model="form"
        :disabled="display"
      >
        <h3>基本信息</h3>

        <ElFormItem
          label="服务图片："
          prop="serviceImageId"
          :rules="{
            required: true,
            message: '请上传服务图片',
            trigger: 'change'
          }"
        >
          <ElUpload
            :class="$style.avatarUploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :headers="HEAD"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-change="handleChange"
          >
            <img
              v-if="form.serviceImageId"
              :src="form.serviceImageId"
              :class="$style.avatar"
              :data="form.serviceImageId"
            >

            <span
              v-else
              :class="$style.icon"
            >
              <i

                :data="form.serviceImageId"
                class="el-icon-plus avatar-uploader-icon"
              />
              <span>请选择小于{{ MAX_IMG_SIZE }}kb的图片</span>
            </span>
          </ElUpload>
        </ElFormItem>

        <ElFormItem
          label="服务类型："
          prop="serviceType"
          :rules="{
            required: true,
            message: '请选择服务类型',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="serviceType"
            placeholder="请选择服务类型"
          >
            <ElOption
              v-for="(typeName, typeValue) in SERVICE_TYPE"
              :key="typeValue"
              :label="typeName"
              :value="typeValue"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="服务名称："
          prop="serviceName"
          :rules="{
            required: true,
            message: '请输入服务名称',
            trigger: 'change'
          }"
        >
          <ElInput
            v-model="form.serviceName"
            :maxlength="20"
            placeholder="请输入服务名称"
          />
        </ElFormItem>

        <ElFormItem
          label="标签："
          prop="serviceLabelArray"
          :rules="checkTag"
        >
          <ElSelect
            v-model="form.serviceLabelArray"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入标签"
          />
        </ElFormItem>

        <h3>服务详情</h3>
        <ElFormItem
          label="服务简介："
          prop="serviceIntroduce"
          :rules="{
            required: true,
            message: '请输入服务简介',
            trigger: 'change'
          }"
        >
          <ElInput
            v-model.lazy="form.serviceIntroduce"
            show-word-limit
            :rows="3"
            type="textarea"
            :maxlength="500"
            placeholder="请输入服务简介"
            :class="$style.wide"
          />
        </ElFormItem>

        <ElFormItem
          label="服务描述："
          prop="serviceRemarkContent"
          :rules="checkContent"
          :class="$style.content"
        >
          <div
            v-if="state === 'info'"
            id="textA"
            class="common_rich_text_des_disable"
            v-html="form.serviceRemarkContent"
          />
          <Editor
            v-else
            id="textA"
            :value="form.serviceRemarkContent"
            :data="state"
            @paretnVisibleChange="form.serviceRemarkContent = $event"
          />
        </ElFormItem>

        <ElFormItem
          label="服务规格："
          prop="serviceSpecifications"
          :rules="{
            required: true,
            message: '请输入服务规格',
            trigger: 'change'
          }"
        >
          <ElInput
            v-model.lazy="form.serviceSpecifications"
            show-word-limit
            :rows="5"
            type="textarea"
            placeholder="请输入服务规格"
            :maxlength="500"
            :class="$style.wide"
          />
        </ElFormItem>

        <div :class="$style.priceBox">
          <h3>定价：</h3>
          <ElButton
            :disabled="display"
            @click="addLi"
          >
            添加
          </ElButton>
        </div>

        <ElTable
          border
          :data="form.packageList"
        >
          <ElTableColumn
            prop="packageName"
            width="250"
          >
            <template #header>
              <span :class="$style.danger">*</span>
              <span>套餐名</span>
            </template>

            <template #default="scope">
              <ElFormItem
                :prop="'packageList['+scope.$index+'].packageName'"
                :rules="checkPackageName"
              >
                <ElInput
                  v-model="scope.row.packageName"
                  placeholder="请输入套餐名"
                />
              </ElFormItem>
            </template>
          </ElTableColumn>

          <ElTableColumn prop="productList">
            <template #header>
              <span :class="$style.danger">*</span>
              <span>套餐内容</span>
            </template>

            <template #default="scope">
              <ElFormItem
                :prop="'packageList['+scope.$index+'].productList'"
                :rules="checkProductList"
              >
                <ElSelect
                  v-model="scope.row.productList"
                  value-key="id"
                  multiple
                  placeholder="请选择"
                  :class="$style.package"
                >
                  <ElOption
                    v-for="item in options"
                    :key="item.id"
                    :label="item.productsName"
                    :value="item"
                  />
                </ElSelect>
              </ElFormItem>
            </template>
          </ElTableColumn>

          <ElTableColumn
            label="操作"
            width="100"
          >
            <template #default="scope">
              <ElButton
                v-show="form.packageList.length>1"
                class="el-icon-delete"
                :class="$style.mgl"
                title="删除"
                @click="del(scope)"
              />
            </template>
          </ElTableColumn>
        </ElTable>
      </ElForm>

      <div :class="$style.btn">
        <ElButton
          v-if="state==='add'"
          type="primary"
          @click="save"
        >
          新建
        </ElButton>

        <ElButton
          v-if="state==='edit'"
          type="primary"
          @click="save"
        >
          保存
        </ElButton>

        <ElButton @click="up">
          取消
        </ElButton>
      </div>
    </div>

    <ElDialog
      :title="title+'申请'"
      :visible.sync="centerDialogVisible"
      width="420px"
    >
      <ElForm
        ref="applyForm"
        inline
        :model="applyForm"
      >
        <ElFormItem
          prop="remark"
          label="备注"
          :rules="{required: true, message: '请输入备注'}"
        >
          <ElInput
            v-model="applyForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </ElFormItem>

        <ElFormItem
          prop="effectTime"
          label="生效时间："
          :rules="{required: true, message: '请选择生效时间'}"
        >
          <ElDatePicker
            v-model="applyForm.effectTime"
            type="datetime"
            placeholder="请选择"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
          />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton
          type="primary"
          @click="savePutaway"
        >
          确定
        </ElButton>

        <ElButton @click="centerDialogVisible = false">
          取消
        </ElButton>
      </template>
    </ElDialog>

    <ElDialog
      title="生效时间"
      :visible.sync="takeEffectTimeVisible"
      width="420px"
      center
    >
      <ElForm inline>
        <ElFormItem label="生效时间：">
          <ElDatePicker
            v-model="takeEffectTime"
            type="datetime"
            placeholder="请选择生效时间"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
          />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton
          type="primary"
          @click="takeEffectTimeVisible = false;save()"
        >
          确定
        </ElButton>

        <ElButton @click="takeEffectTimeVisible = false">
          取消
        </ElButton>
      </template>
    </ElDialog>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTable from 'element-ui/lib/table'
import ElUpload from 'element-ui/lib/upload'
import ElDatePicker from 'element-ui/lib/date-picker'
import ElTableColumn from 'element-ui/lib/table-column'
import Editor from '@com/RichText'
import IChooser from '@com/ChooserAsyncFunctional'

import { isNullish, isEqual } from '@/utils'
import { HEAD } from '@/utils/ajax'
import { DATE_TIME } from '@/enums/format'
import { SERVICE_TYPE } from '@/enums/mall'
import { REG_ALIAS_NAME, hasCN } from '@/functions/validators'
import {
  serviceInfo,
  serviceSave,
  serviceEdit,
  serviceList,
  serviceDel,
  serviceUpDown,
} from '@/api/ares/serve'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const MAX_IMG_SIZE = 100

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: {
    ElUpload,
    ElTable,
    ElTableColumn,
    IChooser: IChooser as any,
    ElDatePicker,
    Editor,
  },
  data() {
    return {
      takeEffectTime: '',
      display: false,
      isSaving: false,
      takeEffectTimeVisible: false,
      centerDialogVisible: false,
      title: '',
      state: '',
      value: '',
      form: {
        packageList: [{}],
        serviceLabelArray: [],
        id: '',
        serviceStatus: '',
        serviceImageId: '',
        serviceRemarkContent: '',
      },
      applyForm: { remark: '', effectTime: '' },
      textarea: '',
      options: [],
      textContent: '',
    }
  },
  computed: {
    HEAD: () => HEAD,
    DATE_TIME: () => DATE_TIME,
    MAX_IMG_SIZE: () => MAX_IMG_SIZE,
    SERVICE_TYPE: () => SERVICE_TYPE,
    serviceType: {
      get() {
        const serviceType = this.form.serviceType
        return isNullish(serviceType) ? '' : serviceType + ''
      },
      set(val: string) {
        this.$set(this.form, 'serviceType', +val)
      },
    },
    checkTag() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: any,
          callback: (error?: Error) => void
        ) => {
          if (!value || !value.length) {
            return callback(new Error('请输入标签'))
          }

          for (const tag of value) {
            if (tag.length > 6) {
              callback(new Error('标签字数不能超过6个'))
              return
            }
            if (!REG_ALIAS_NAME.test(tag)) {
              callback(new Error('标签不能包含特殊字符'))
              return
            }
          }

          if (value.length > 10) {
            return callback(new Error('标签不能超过10个'))
          }

          callback()
        },
      }
    },
    checkContent() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          value = this.form.serviceRemarkContent
          if (!value) {
            return callback(new Error('请输入服务描述'))
          }

          if (/<(?:img|a)/.test(value)) {
            return callback()
          }

          try {
            hasCN(value)
            callback()
          } catch (error) {
            callback(new Error('服务描述必须至少包含中文、图片、附件之一'))
          }
        },
      }
    },
    checkPackageName() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: any,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入套餐名'))
          }

          const packageList = this.form.packageList
          let repeat = -1
          let item
          for (item of packageList) {
            if (item.packageName === value && ++repeat > 0) {
              return callback(new Error('套餐名重复'))
            }
          }

          callback()
        },
      }
    },
    checkProductList() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: any,
          callback: (error?: Error) => void
        ) => {
          const length = value && value.length
          if (!length) {
            return callback(new Error('请选择套餐内容'))
          }

          const packageList = this.form.packageList
          let item
          for (item of packageList) {
            item = item.productList
            if (item !== value && isEqual(item, value)) {
              return callback(new Error('套餐内容重复'))
            }
          }

          callback()
        },
      }
    },
  },
  methods: {
    // 上架 下架
    putaway(this: any) {
      this.title = this.form.serviceStatus === 0 ? '上架' : '下架'
      this.centerDialogVisible = true
    },
    savePutaway() {
      ;(this.$refs.applyForm as any).validate((valid: boolean) => {
        if (valid) {
          const form = this.form
          const applyForm = this.applyForm
          const isUp = form.serviceStatus === 0
          serviceUpDown({
            id: form.id,
            remark: applyForm.remark,
            effectTime: applyForm.effectTime,
            serviceStatus: isUp ? 1 : 0,
          }).then(res => {
            if (res.data.status) {
              this.$notify.success((isUp ? '上架' : '下架') + '审批申请成功')
              this.centerDialogVisible = false
              applyForm.remark = applyForm.effectTime = ''
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        }
      })
    },
    addLi(this: any) {
      const obj = {
        packageName: '',
        productList: [],
      }
      this.form.packageList.push(obj)
    },
    handleAvatarSuccess(res: any, file: any) {
      this.form.imageUrl = URL.createObjectURL(file.raw)
      this.form.serviceImageId = res.body.fileId
      ;(this.$refs.form as any).validate()
    },
    beforeAvatarUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 0.2441

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 256kb!')
      }
      return isLt2M
    },
    imgCompress(path, obj) { // path是指上传的图片，obj是压缩的品质，越低越模糊
    // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this // 这里的this 是把vue的实例对象指向改变为_this
      const img = new Image()
      img.src = path
      img.onload = function() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this // 这里的this 是把img的对象指向改变为that
        // 默认按比例压缩
        let w = that.width
        let h = that.height
        const scale = w / h
        w = obj.width || w
        h = obj.height || (w / scale)
        let quality = 1 // 默认图片质量为0.7
        // 生成canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // 创建属性节点
        const anw = document.createAttribute('width')
        anw.nodeValue = w
        const anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality
        }
        // quality值越小，所绘制出的图像越模糊
        const base64 = canvas.toDataURL('image/jpeg', quality)
        vm.form.imageUrl = base64
        vm.form.serviceImageId = base64
      }
    },
    handleChange(file: any) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this
      const isLt2M = MAX_IMG_SIZE * 1024
      const min = 10000 * 1024 // 将最小值设置超大，暂时不做服务产品的压缩
      if (file.size > isLt2M) {
        this.$message.error(`上传图片大小不能超过${MAX_IMG_SIZE}kb!`)
        return false
      }
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function() {
        if (file.size < min) {
          vm.form.imageUrl = this.result
          vm.form.serviceImageId = this.result
        } else {
          vm.imgCompress(this.result, { quality: 0.2 })
        }
      }
    },
    // 删除列表
    del(obj: any) {
      const index = obj.$index
      this.form.packageList.splice(index, 1)
    },
    save() {
      const data = this.form
      data.createDate = null
      data.modifyDate = null
      if (this.form.serviceRemarkContent) {
        if (this.form.serviceRemarkContent.match(/fileId=(\S*)"/img)) {
          const fileIds = this.form.serviceRemarkContent.match(/fileId=(\S*)"/img).join('=').replace(/fileId=/g, '').replace(/"/g, '').split('=')
          data.fileIds = fileIds.join(',')
        }
      }
      if (this.state === 'edit' && this.takeEffectTime) {
        data.takeEffectTime = this.takeEffectTime
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            ;(data.id ? serviceEdit : serviceSave)(data)
              .then(() => {
                this.$notify.success('服务编辑审批申请成功')
                this.up(true)
              })
          }
        })
      } else if (this.state !== 'edit') {
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            ;(data.id ? serviceEdit : serviceSave)(data)
              .then(() => {
                this.$notify.success('操作成功')
                this.up(true)
              })
          }
        })
      } else {
        this.takeEffectTimeVisible = true
      }
    },
    getProductList() {
      serviceList({}).then(res => {
        this.options = res.data.body
      })
    },
    async fetch(this: any, id?: string) {
      ;(this as any).state = this.route.query.state
      if (!id) {
        this.form = {
          packageList: [{
            packageName: '',
            productList: [],
          }],
          serviceLabelArray: [],
          id: '',
          serviceStatus: '',
          serviceImageId: '',
        }
        return 1
      }
      const data = (await serviceInfo({ id: id })).data.body
      if (data.serviceImageId) {
        data.imageUrl = 'api/tools-server/file/download?fileId=' + data.serviceImageId
      }
      this.title = data.serviceStatus === 0 ? '上架' : '下架'

      if ((this as any).state === 'info') {
        this.display = true
      } else {
        this.display = false
      }
      return (this.form = data)
    },
    // 删除服务
    async delServe(this: any) {
      const data = this.form
      await this.$confirm(
        `此操作不可逆, 确定要删除服务【${data.serviceName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      this.isSaving = true
      try {
        await serviceDel({ id: data.id })
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.up(true)
      this.$notify.success(`删除服务【${data.serviceName}】成功`)
    },
  },
  mounted() {
    this.getProductList()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/upload';
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.avatarUploader :global {
  .el-upload {
    position: relative;
    width: 178px;
    height: 178px;
    margin-right: $gapNormal * 2 - 10px;
    overflow: hidden;
    color: $colorTextMinor;
    border: $borderDashed;
    border-radius: $borderRadiusBase;
    cursor: pointer;
  }

  .el-upload:hover {
    border-color: $colorTheme;
  }
}

.content :global {
  .tox-tinymce {
    min-height: 250px;
    border-radius: $borderRadiusBase;
  }

  .tox-editor-container {
    border-radius: $borderRadiusBase $borderRadiusBase 0 0;
  }

  .tox-statusbar {
    border-radius: 0 0 $borderRadiusBase $borderRadiusBase;
  }
}

.wide,
.content :global(.tox-tinymce) {
  width: $widthPage - $gapNormal * 2 - 125px !important;
}

.content:global(.is-error .tox-tinymce) {
  border-color: $colorDanger;
}

.contentBox {
  width: $widthPage;
  margin: 0 auto;

  :global(.is-error .el-upload) {
    border-color: $colorDanger;
  }
}

.content :global(#textA) {

  // stylelint-disable-next-line scss/at-extend-no-missing-placeholder
  @extend .wide;

  max-height: 300px;
  overflow-y: auto;
}

.fr {
  float: right;
}

.icon {
  > i {
    display: block;
    height: 130px;
    font-size: $xxxLarge * 2;
    line-height: 130px;
  }
}

.avatar {
  display: block;
  width: 178px;
  height: 178px;
}

.mgl {
  margin-right: 10px;
  margin-left: 10px;
}

.editor {
  display: block !important;
}

.btn {
  margin-top: $gapNormal;
  text-align: center;
}

.priceBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: $gapNormal;

  h3 {
    margin: 0;
  }
}

.danger {
  color: $colorDanger !important;
}

.package {
  width: 695px;

  > * {
    width: 100% !important;
  }
}
</style>
