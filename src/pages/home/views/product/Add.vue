<!-- eslint-disable vue/no-v-html -->
<!-- 描述 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id,route.fullPath]"
    class="el-card"
  >
    <div :class="$style.fr">
      <RouterLink
        v-show="be === 'detail'"
        class="el-button el-button--text"
        :to="`edit`"
      >
        <i :class="'i-bianji '" /> 编辑
      </RouterLink>
      <ElButton
        v-show="be !== 'add'"
        type="text"
        :icon="'i-shanchu1 '"
        @click="del"
      >
        删除
      </ElButton>
    </div>

    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        :class="$style.contentBox"
        inline
        label-position="right"
        :model="form"
        :disabled="display"
      >
        <h3>基本信息</h3>
        <ElFormItem
          label="产品名称："
          prop="productsName"
          :rules="{
            required: true,
            message: '请输入产品名称',
            trigger: 'change'
          }"
        >
          <ElInput
            v-model="form.productsName"
            placeholder="请输入产品名称"
          />
        </ElFormItem>

        <ElFormItem
          label="产品类型："
          prop="productsTypeCode"
          :rules="{
            required: true,
            message: '请选择产品类型',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="form.productsTypeCode"
            placeholder="请选择"
          >
            <ElOption
              v-for="item in optionType"
              :key="item.productsTypeCode"
              :label="item.productsTypeName"
              :value="item.productsTypeCode"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="工单流程类型："
          prop="workTypeCode"
          :rules="{
            required: true,
            message: '请选择工单流程类型',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="form.workTypeCode"
            placeholder="请选择"
          >
            <ElOption
              v-for="(workTypeName, workType) in WORK_TYPE"
              :key="workType"
              :label="workTypeName"
              :value="workType"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="产品厂商："
          prop="vendorId"
          :rules="{
            required: true,
            message: '请选择产品厂商',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="form.vendorId"
            placeholder="请选择"
          >
            <ElOption
              v-for="item in vendorList"
              :key="item.id"
              :label="item.vendorName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>

        <!-- <ElFormItem
              label="产品版本："
              prop="versionName"
            >
              <ElInput
                v-model="form.versionName"
                style="width: 200px;"
                placeholder="请输入产品版本"
              />
            </ElFormItem> -->

        <ElFormItem
          v-if="be !== 'add'"
          label="状态："
          prop="productsStatus"
          :rules="{
            required: true,
            message: '请选择产品版本',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="form.productsStatus"
            placeholder="请选择"
          >
            <ElOption
              v-for="item in optionState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="交付类型："
          prop="deliveryType"
          :rules="{
            required: true,
            message: '请选择产品版本',
            trigger: 'change'
          }"
        >
          <ElSelect
            v-model="form.deliveryType"
            placeholder="请选择"
          >
            <ElOption
              v-for="item in optionDelivery"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <h3>产品详情</h3>
        <ElFormItem
          label="产品型号："
          prop="productsModel"
          :rules="{
            required: true,
            message: '请输入产品型号',
            trigger: 'change'
          }"
        >
          <ElInput
            v-model.lazy="form.productsModel"
            show-word-limit
            type="textarea"
            placeholder="请输入产品型号"
            :rows="3"
            :maxlength="500"
            :class="$style.wide"
          />
        </ElFormItem>

        <ElFormItem
          prop="productsRemarkContent"
          label="产品描述："
          :rules="checkContent"
          :class="$style.content"
        >
          <div
            v-if="be === 'detail'"
            class="common_rich_text_des_disable"
            v-html="form.productsRemarkContent"
          />
          <Editor
            v-else
            id="textA"
            :value="form.productsRemarkContent"
            :data="be"
            @paretnVisibleChange="form.productsRemarkContent = $event"
          />
        </ElFormItem>

        <h3>产品定价</h3>
        <ElTable
          :data="form.priceList"
          border
          :class="$style.table"
        >
          <ElTableColumn
            prop="date"
            label="云服务商"
            width="250px"
          >
            <template #default="{ row }">
              <div>{{ row.providerName }}</div>
            </template>
          </ElTableColumn>

          <ElTableColumn
            prop="name"
            label="服务方式"
          >
            <template #default="scope">
              <ElFormItem
                :prop="'priceList['+scope.$index+'].productsModeCode'"
                :rules="{
                  required: true,
                  message: '请选择服务方式',
                  trigger: 'change'
                }"
              >
                <ElSelect
                  v-model="scope.row.productsModeCode"
                  placeholder="请选择"
                >
                  <ElOption
                    v-for="item in optionServe"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </template>
          </ElTableColumn>

          <ElTableColumn
            label="产品定价"
          >
            <template #default="scope">
              <ElFormItem
                :prop="'priceList['+scope.$index+'].recommenPrice'"
                :rules="{
                  required: true,
                  message: '请填写产品单价',
                  trigger: 'change'
                }"
              >
                <ElInput
                  v-model="scope.row.recommenPrice"
                  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                  oninput="if(value>=10000000)value=10000000"
                >
                  <template #prepend>
                    ￥
                  </template>
                  <template #append>
                    元
                  </template>
                </ElInput>
              </ElFormItem>
            </template>
          </ElTableColumn>
        </ElTable>
      </ElForm>

      <div :class="$style.btns">
        <ElButton
          v-if="be==='add'"
          type="primary"
          @click="save"
        >
          新建
        </ElButton>

        <ElButton
          v-if="be==='edit'"
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
      title="生效时间"
      :visible.sync="takeEffectTimeVisible"
      width="30%"
      center
    >
      <ElForm label-width="100px">
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
          @click="takeEffectTimeVisible = false; save()"
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
import ElDatePicker from 'element-ui/lib/date-picker'
import ElTableColumn from 'element-ui/lib/table-column'

import Editor from '@com/RichText'
import IChooser from '@com/ChooserAsyncFunctional'

import { DATE_TIME } from '@/enums/format'
import getCode, { codeType, userCode } from '@/enums/code'
import { hasCN } from '@/functions/validators'
import {
  productInfo,
  productSave,
  productEdit,
  productDel,
  getProvider,
  getVendorList,
  getProductsModeCode,
} from '@/api/ares/product'
import { selectProductType } from '@/api/servicePlatform/shop'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const WORK_TYPE = getCode(codeType.sys, userCode.WORK_TYPE)

/** emit: 事件说明 */
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: { IChooser: IChooser as any, ElTable, ElTableColumn, Editor, ElDatePicker },
  data() {
    return {
      takeEffectTime: '',
      takeEffectTimeVisible: false,
      isChange: false,
      isSaving: false,
      display: false,
      title: '',
      value: '',
      form: {
        priceList: [],
      },
      optionService: [],
      vendorList: [],
      optionType: [],
      num: 0,
      optionServe: [],
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    WORK_TYPE: () => WORK_TYPE.value,
    optionState: () => [
      { label: '停用', value: 0 },
      { label: '启用', value: 1 },
    ],
    optionDelivery: () => [
      { label: '本地交付', value: '0' },
      { label: '线上交付', value: '1' },
    ],
    checkContent() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          value = this.form.productsRemarkContent
          if (!value) {
            return callback(new Error('请输入产品描述'))
          }

          if (/<(?:img|a)/.test(value)) {
            return callback()
          }

          try {
            hasCN(value)
            callback()
          } catch (error) {
            callback(new Error('产品描述必须至少包含中文、图片、附件之一'))
          }
        },
      }
    },
  },
  watch: {
    'form.priceList': {
      deep: true,
      handler() {
        if (this.num >= 2) {
          this.isChange = true
        } else {
          this.num++
        }
      },
    },
  },
  methods: {
    save(this: any) {
      const data = this.form
      data.createDate = data.modifyDate = null
      if (this.form.productsRemarkContent) {
        if (this.form.productsRemarkContent.match(/fileId=(\S*)"/img)) {
          const fileIds = this.form.productsRemarkContent.match(/fileId=(\S*)"/img).join('=').replace(/fileId=/g, '').replace(/"/g, '').split('=')
          data.fileIds = fileIds.join(',')
        }
      }
      if (this.be === 'edit' && this.isChange && this.takeEffectTime) {
        data.takeEffectTime = this.takeEffectTime
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            ;(data.id ? productEdit : productSave)(data)
              .then(() => {
                this.$notify.success('操作成功')
                this.up(true)
              })
          }
        })
      } else if (this.be === 'add') {
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            ;(data.id ? productEdit : productSave)(data)
              .then(() => {
                this.$notify.success('操作成功')
                this.up(true)
              })
          }
        })
      } else if (this.be === 'edit' && this.isChange === false) {
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            ;(data.id ? productEdit : productSave)(data)
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
    async fetch(id?: string) {
      if (!id) {
        return 1
      }
      const data = (await productInfo({ id: id })).data.body
      if (data.deliveryType === '0') {
        this.title = '启动'
      } else {
        this.title = '停止'
      }

      if ((this as any).be === 'detail') {
        this.display = true
      } else {
        this.display = false
      }
      return (this.form = data)
    },
    async  del(this: any) {
      const data = this.form
      await this.$confirm(
        `此操作不可逆, 确定要删除产品【${data.productsName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      this.isSaving = true
      try {
        await productDel({ id: data.id })
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.up(true)
      this.$notify.success(`删除服务【${data.productsName}】成功`)
    },
    // 启动 停止
    async goStart(this: any) {
      if (this.form.deliveryType === '0') {
        this.form.deliveryTyp = '1'
      } else {
        this.form.deliveryTyp = '0'
      }
      productEdit(this.form).then(() => {
        this.up(true)
      })
    },
  },
  mounted() {
    getProvider().then(res => {
      this.optionService = res.data.body
      if (this.form.priceList.length === 0) {
        res.data.body.forEach(res => {
          this.form.priceList.push({
            providerName: res.providerName,
            cloudPlatformId: res.id,
          })
        })
      }
    })

    getVendorList().then(res => {
      this.vendorList = res.data.body || []
    })

    selectProductType().then(res => {
      this.optionType = res.data.body || []
    })
    getProductsModeCode().then(res => {
      this.optionServe = res.data.body || []
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.contentBox {
  width: $widthPage;
  margin: 0 auto;
}

.btns {
  margin-top: $gapNormal;
  text-align: center;
}

.fr {
  float: right;
}

.mgl {
  margin-right: 10px;
  margin-left: 10px;
}

.add {
  position: absolute;
  right: 5%;
}

.screen {
  position: relative;
  right: -68%;
}

.textarea {
  width: 80vw;
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

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.content :global(#textA) {

  // stylelint-disable-next-line scss/at-extend-no-missing-placeholder
  @extend .wide;

  max-height: 300px;
  overflow-y: auto;
}

.box {
  padding: $gapNormal 10%;
}
</style>
