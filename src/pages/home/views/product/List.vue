<!-- 描述 -->
<template>
  <div class="el-card">
    <div>
      <h4 :class="$style.title">
        产品管理
      </h4>
      <div :class="$style.fr">
        <ElButton
          type="text"
          :icon="`el-icon-arrow-${showFilter ? 'up' : 'down'}`"
          @click="showFilter = !showFilter"
        >
          {{ showFilter ? '隐藏' : '显示' }}筛选
        </ElButton>
        <ElButton
          type="primary"
          @click="add"
        >
          新建
        </ElButton>
      </div>
      <Transition
        name="fold"
        mode="out-in"
      >
        <ElForm
          v-show="showFilter"
          :inline="true"
        >
          <ElFormItem label="产品编号：">
            <ElInput
              v-model="params.productsNo"
              placeholder="请输入内容"
            />
          </ElFormItem>
          <ElFormItem label="产品名称：">
            <ElInput
              v-model="params.productsName"
              placeholder="请输入内容"
            />
          </ElFormItem>

          <ElFormItem label="产品类型：">
            <ElSelect
              v-model="params.productsTypeCode"
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

          <ElFormItem label="产品厂商：">
            <ElInput
              v-model="params.vendorName"
              placeholder="请输入内容"
            />
          </ElFormItem>
          <ElFormItem label="状态：">
            <ElSelect
              v-model="params.productsStatus"
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

          <ElFormItem label="交付方式：">
            <ElSelect
              v-model="params.deliveryType"
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
        </ElForm>
      </Transition>
    </div>

    <ITable
      ref="table"
      :get="page"
      :query="params"
      :head="head"
    >
      <ElTableColumn
        label="操作"
        width="170"
      >
        <template #default="{ row }">
          <ElTooltip content="编辑">
            <i
              class="el-icon-edit-outline common_table_opt_icon common_margin_right"
              @click="edit(row)"
            />
          </ElTooltip>

          <ElTooltip :content="row.productsStatus ? '停用' : '启用'">
            <ElSwitch
              v-model="row.productsStatus"
              :active-value="1"
              :inactive-value="0"
              class="common_margin_right"
              @change="upDown(row)"
            />
          </ElTooltip>

          <ElTooltip content="入库">
            <i
              class="el-icon-folder-add common_table_opt_icon common_margin_right"
              @click="addLibrary(row)"
            />
          </ElTooltip>

          <ElTooltip
            v-if="row.productsStatus===0"
            content="删除"
          >
            <i
              class="el-icon-delete common_table_opt_icon"
              @click="del(row)"
            />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ITable>

    <ElDialog
      title="入库申请"
      :visible.sync="centerDialogVisible"
      width="420px"
    >
      <ElForm
        ref="applyForm"
        inline
        :model="applyForm"
      >
        <ElFormItem
          prop="addAmount"
          label="库存数量："
          :rules="{required: true, message: '请输入库存数量'}"
        >
          <ElInput
            v-model="applyForm.addAmount"
            type="number"
            :min="1"
            placeholder="请输入库存数量"
            @change="setAmount"
          />
        </ElFormItem>

        <ElFormItem
          prop="appendixId"
          label="凭证："
          :rules="{required: true, message: '请上传凭证'}"
        >
          <ElUpload
            :headers="HEAD"
            :action="upload"
            :file-list="list"
            :on-success="handleAvatarSuccess"
            class="el-input"
          >
            <ElButton
              size="small"
              type="primary"
            >
              点击上传
            </ElButton>
          </ElUpload>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton
          type="primary"
          @click="librarySave"
        >
          确定
        </ElButton>

        <ElButton @click="centerDialogVisible = false; paramsNull()">
          取消
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTableColumn from 'element-ui/lib/table-column'
import ElSwitch from 'element-ui/lib/switch'
import ElUpload from 'element-ui/lib/upload'

import { HEAD, getUri } from '@/utils/ajax'
import { del, API } from '@/api/tools/file'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import {
  pageList,
  productDel,
  productEdit,
  productProdApply,
} from '@/api/ares/product'
import { selectProductType } from '@/api/servicePlatform/shop'
import ITable from '@com/Table'
/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: {
    ITable,
    ElTableColumn,
    ElSwitch,
    ElUpload,
  },
  data() {
    return {
      list: [],
      showFilter: false,
      centerDialogVisible: false,
      optionType: [],
      params: {},
      selectRow: {},
      applyForm: { addAmount: '', appendixId: '', appendixName: '' },
    }
  },
  computed: {
    HEAD: () => HEAD,
    page: () => pageList,
    upload: () => getUri(API.upload),
    optionDelivery: () => [
      { label: '全部', value: '' },
      { label: '本地交付', value: '0' },
      { label: '线上交付', value: '1' },
    ],
    optionState: () => [
      {
        label: '全部',
        value: '',
      },
      {
        label: '停用',
        value: '0',
      },
      {
        label: '启用',
        value: '1',
      },
    ],
    head() {
      return [
        {
          label: '产品编号',
          width: '240px',
          formatter: (row: any) =>
            this.$createElement(
              'RouterLink',
              {
                class: 'el-link el-link--primary',
                props: { to: `${this.route.fullPath}/${row.id}/detail` },
              },
              row.productsNo
            ),
        },
        { prop: 'productsName', label: '产品名称' },
        {
          label: '产品类型',
          width: '120px',
          formatter: (row: any) => (
            this.optionType.find(
              d => d.productsTypeCode === row.productsTypeCode
            ) || 0
          ).productsTypeName,
        },
        { prop: 'vendorName', label: '产品厂商' },
        // { prop: 'vendor', label: '服务方式' },
        {
          label: '交付方式',
          width: '80px',
          formatter: (row: any) => {
            switch (row.deliveryType) {
              case '0':
                return '本地交付'
              case '1':
                return '线上交付'
            }
          },
        },
        // { prop: 'cpuCore', label: '单价' },
        { prop: 'storageAmounts', label: '库存', width: '80px' },
        { prop: 'createDate', label: '创建时间', width: '160px' },
        {
          label: '状态',
          width: '80x',
          formatter: (row: any) => {
            switch (row.productsStatus) {
              case 0:
                return '已停用'
              case 1:
                return '已启用'
            }
          },
        },
      ]
    },
  },
  methods: {
    add() {
      this.jump({ path: 'add', append: true })
    },
    addLibrary(this: any, obj: any) {
      this.paramsNull()
      this.selectRow = obj
      this.centerDialogVisible = true
    },
    edit(obj: any) {
      this.jump({ path: `${obj.id}/edit`, append: true })
    },
    async del(obj: any) {
      await this.$confirm(
        `此操作不可逆, 确定要删除产品【${obj.productsName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await productDel({ id: obj.id })
      if (obj.fileIds) {
        await del(obj.fileIds)
      }
      ;(this.$refs.table as any).fetch()
      this.$notify.success(`删除产品【${obj.productsName}】成功`)
    },
    setAmount(amount: string) {
      this.applyForm.addAmount = Math.abs(amount | 0) || 0
    },
    // 停用 启用
    upDown(obj: any) {
      productEdit(obj).then(() => {
        ;(this.$refs.table as any).fetch()
      }).catch(() => {
        ;(this.$refs.table as any).fetch()
      })
    },
    // 入库保存
    librarySave(this: any) {
      ;(this.$refs.applyForm as any).validate((valid: boolean) => {
        if (valid) {
          const applyForm = this.applyForm
          productProdApply({
            appendixId: applyForm.appendixId,
            appendixName: applyForm.appendixName,
            addAmount: applyForm.addAmount,
            productId: this.selectRow.id,
          }).then(res => {
            if (res.data.status) {
              this.$notify.success('产品入库申请提交成功')
              this.centerDialogVisible = false
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        }
      })
    },
    // 文件上传成功钩子
    handleAvatarSuccess(res: any, file: any) {
      const applyForm = this.applyForm
      applyForm.appendixId = res.body.fileId
      applyForm.appendixName = file.name
    },
    // 参数制空
    paramsNull() {
      const applyForm = this.applyForm
      applyForm.addAmount = applyForm.appendixId = applyForm.appendixName = ''
      this.list = []
    },
  },
  created() {
    selectProductType().then(res => {
      res = res.data.body || []
      res.unshift({ productsTypeName: '全部', productsTypeCode: '' })
      this.optionType = res
    })
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table-column';
@import '~element-ui/packages/theme-chalk/src/switch';
@import '~element-ui/packages/theme-chalk/src/upload';
</style>

<style lang="scss" module>
.fr {
  float: right;
}

.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}
</style>
