<!-- 描述 -->
<template>
  <div :class="'el-card ' + $style.wrapper">
    <ElRow
      type="flex"
      justify="space-between"
    >
      <h4 class="common_h4_title">
        供应商列表
      </h4>
      <div>
        <ElButton
          type="text"
          :icon="`el-icon-arrow-${blockSel ? 'up' : 'down'}`"
          @click="blockSel = !blockSel"
        >
          {{ blockSel ? '隐藏' : '显示' }}筛选
        </ElButton>
        <ElButton
          type="primary"
          @click="addSupplier=true"
        >
          新建
        </ElButton>
      </div>
    </ElRow>
    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="blockSel"
        inline
        :label-width="CONFIG.labelWidth"
        :model="formInline"
        :class="$style.myForm"
        class="demo-form-inline"
      >
        <ElFormItem label="供应商编号：">
          <ElInput
            v-model="formInline.vendorNo"
            clearable
            :class="$style.myInput"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="供应商名：">
          <ElInput
            v-model="formInline.vendorName"
            clearable
            :class="$style.myInput"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="供应产品：">
          <ElInput
            v-model="formInline.productsName"
            clearable
            :class="$style.myInput"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="对接人：">
          <ElInput
            v-model="formInline.contact"
            clearable
            :class="$style.myInput"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="联系方式：">
          <ElInput
            v-model="formInline.phoneNumber"
            clearable
            :class="$style.myInput"
            placeholder="请输入"
          />
        </ElFormItem>
      </ElForm>
    </Transition>
    <!-- 渲染表格 -->
    <ITable
      ref="table"
      :get="page"
      :query="formInline"
      :head="head"
    >
      <template #prefix>
        <ElTableColumn
          prop="vendorNo"
          label="供应商编号"
          width="190"
        >
          <template #default="{ row }">
            <RouterLink
              class="el-link el-link--primary"
              :to="`${route.fullPath}/${row.id}/info`"
            >
              {{ row.vendorNo }}
            </RouterLink>
          </template>
        </ElTableColumn>
      </template>
      <ElTableColumn
        fixed="right"
        label="操作"
      >
        <template #default="{ row }">
          <RouterLink
            tag="span"
            class="el-icon-edit-outline common_table_opt_icon common_margin_right"
            :to="`${route.fullPath}/${row.id}/edit`"
          />
          <i
            class="el-icon-delete common_table_opt_icon"
            @click="del(row)"
          />
        </template>
      </ElTableColumn>
    </ITable>

    <!-- 新建弹框 -->
    <ElDialog
      title="新建供应商"
      :visible.sync="addSupplier"
      width="30%"
    >
      <ElForm
        ref="addForm"
        :model="addForm"
      >
        <ElFormItem
          label="供应商名："
          prop="vendorName"
          :label-width="formLabelWidth"
          :rules="{ required: true, message: '供应商名不能为空'}"
        >
          <ElInput
            v-model="addForm.vendorName"
            autocomplete="off"
            clearable
          />
        </ElFormItem>
        <ElFormItem
          label="对接人："
          prop="contact"
          :label-width="formLabelWidth"
          :rules="{ required: true, message: '对接人不能为空'}"
        >
          <ElInput
            v-model="addForm.contact"
            clearable
            autocomplete="off"
          />
        </ElFormItem>
        <ElFormItem
          label="联系方式："
          prop="phoneNumber"
          :label-width="formLabelWidth"
          :rules="checkPhone"
        >
          <ElInput
            v-model="addForm.phoneNumber"
            clearable
            autocomplete="off"
          />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton
          type="primary"
          @click="addFn(addForm)"
        >
          确定
        </ElButton>

        <ElButton @click="cancelAdd(addForm)">
          取消
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

import ITable, { ElTableColumn } from '@com/Table'
import { phone } from '@/functions/validators'
import { allList, add, delet, fil } from '@/api/supplier/supplier'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn },
  data() {
    return {
      blockSel: false, // 控制筛选模块
      addSupplier: false, // 新增弹框
      formLabelWidth: '120px',
      // 筛选数据
      formInline: {
        vendorNo: '',
        vendorName: '',
        productsName: '',
        contact: '',
        phoneNumber: '',
      },
      // 新增数据
      addForm: {
        vendorName: '',
        contact: '',
        phoneNumber: '',
      },
    }
  },
  computed: {
    head: () => [
      { prop: 'vendorName', label: '供应商名' },
      { prop: 'productsName', label: '供应产品' },
      { prop: 'contact', label: '对接人' },
      { prop: 'phoneNumber', label: '联系方式' },
      { prop: 'createDate', label: '创建时间' },
    ],
    checkPhone() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入手机号码'))
          }

          try {
            phone(value)
            callback()
          } catch (error) {
            callback(error)
          }
        },
      }
    },
  },
  methods: {
    page: allList,
    // 取消新增
    cancelAdd() {
      this.addSupplier = false
      this.$refs.addForm.resetFields()// 清空表单数据
    },
    // 新增
    addFn() {
      const addForm = this.addForm
      // 验证表单
      ;(this.$refs.addForm as any).validate((valid) => {
        if (valid) {
          this.addSupplier = false
          add(addForm).then(() => {
            this.$message.success('新增成功')
            this.$refs.addForm.resetFields()
            ;(this.$refs.table as any).fetch()
          })
        }
      })
    },
    // 删除
    async del(row: object) {
      await this.$confirm(
        `此操作不可逆, 确定要删除供应商【${row.vendorName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await delet(row.id as string)
      ;(this.$refs.table as any).fetch()
      this.$notify.warning(`删除供应商【${row.vendorName}】成功`)
    },
    // 筛选
    filter() {
      fil(this.formInline)
    },
  },
}
</script>

<style lang="scss" module>
//   text-align: center;
// }
.wrapper {
  .link {
    margin-right: 30px;
  }
}

// .myForm {
//   display: flex;
//   justify-content: space-between;
// }

.myInput {
  width: 240px;
}
</style>
