<!-- 描述 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    :class="$style.wrapper"
    class="el-card"
  >
    <div :class="$style.box">
      <!-- 供应商详情 -->
      <ElRow
        :gutter="GAP"
        type="flex"
        justify="space-between"
        :class="$style.infoHead"
      >
        <h3 :class="$style.myTit">
          供应商详情
        </h3>
        <div v-show="type !=='edit'">
          <RouterLink
            tag="span"
            class="el-icon-edit-outline"
            :class="$style.edit"
            to="edit"
          >
            编辑
          </RouterLink>
          <ElLink
            icon="el-icon-delete"
            @click="del"
          >
            删除
          </ElLink>
        </div>
      </ElRow>

      <ElRow>
        <ElForm
          ref="myForm"
          :model="data"
          label-width="150px"
        >
          <ElRow
            type="flex"
            justify="space-between"
          >
            <ElCol :span="8">
              <ElFormItem
                label="供应商名："
                prop="vendorName"
                :rules="{ required: true, message: '供应商名不能为空'}"
              >
                <ElInput
                  v-model="data.vendorName"
                  :disabled="type !== 'edit'"
                  clearable
                  :class="$style.myInput"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="对接人："
                prop="contact"
                :rules="{ required: true, message: '对接人名不能为空'}"
              >
                <ElInput
                  v-model="data.contact"
                  :disabled="type !== 'edit'"
                  clearable
                  :class="$style.myInput"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem
                label="联系方式："
                prop="phoneNumber"
                :rules="checkPhone"
              >
                <ElInput
                  v-model="data.phoneNumber"
                  clearable
                  :disabled="type !== 'edit'"
                  :class="$style.myInput"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
        <ElForm label-width="150px">
          <ElRow
            v-show="type !=='edit'"
            type="flex"
            justify="space-between"
          >
            <ElCol :span="8">
              <ElFormItem label="供应商编号：">
                <ElInput
                  v-model="data.vendorNo"
                  :disabled="type !== 'edit'"
                  clearable
                  :class="$style.myInput"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="创建时间：">
                <ElInput
                  v-model="data.createDate"
                  :disabled="type !== 'edit'"
                  clearable
                  :class="$style.myInput"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="最后修改时间：">
                <ElInput
                  v-model="data.modifyDate"
                  :disabled="type !== 'edit'"
                  clearable
                  :class="$style.myInput"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElRow>
      <!-- 供应产品列表 -->
      <ElRow :class="$style.list">
        <h3 :class="$style.myList">
          供应产品列表
        </h3>
        <ElTable :data="data.products">
          <ElTableColumn
            type="index"
            :index="1"
          />
          <ElTableColumn
            prop="productsName"
            label="产品名称"
            align="center"
          />
          <ElTableColumn
            prop="version"
            label="产品版本"
            align="center"
          />
        </ElTable>
      </ElRow>
      <!-- 保存 取消 -->
      <ElRow
        v-show="type !=='info'"
        type="flex"
        justify="center"
      >
        <ElButton
          type="primary"
          @click="upd"
        >
          保存
        </ElButton>
        <ElButton @click="cancel">
          取消
        </ElButton>
      </ElRow>
    </div>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
// import ITable, { ElTableColumn } from '@com/Table'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import { info, delet, update } from '@/api/supplier/supplier'
// import { GLOBAL } from '@/enums/events'
import IChooser from '@com/ChooserAsyncFunctional'
import { phone } from '@/functions/validators'

import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    route: { type: Object, required: true },
    type: { type: String, required: true },
  },
  components: { ElTable, ElTableColumn, IChooser: IChooser as any },
  data() {
    return {
      id: '',
      data: {},
      isSaving: false, // 等待效果
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
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
    fetch(...args: any[]) {
      return info.apply(null, args).then(res => {
        return (this.data = res.data.body)
      })
    },
    // 删除
    async del() {
      const id = this.id
      const data = this.data
      await this.$confirm(
        `此操作不可逆, 确定要删除供应商【${data.vendorName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await delet(id)
      this.$notify.warning(`删除供应商【${data.vendorName}】成功`)
      this.up(true)
      // this.$notify({
      //   type: 'success',
      //   message: `删除供应商【${data.vendorName}】成功`,
      //   onClose: () => {
      //     this.up(true)
      //   },
      // })
    },
    // 修改
    async upd() {
      const data = {}
      data.vendorName = this.data.vendorName
      data.contact = this.data.contact
      data.phoneNumber = this.data.phoneNumber
      data.id = this.id
      ;(this.$refs.myForm as any).validate(valid => {
        if (valid) {
          update(data)
          this.$notify.success('修改成功')
          this.up(true)
          // this.$notify({
          //   type: 'success',
          //   message: '修改成功',
          //   onClose: () => {
          //     this.up(true)
          //   },
          // })
        }
      })
    },
    // 取消
    async cancel() {
      await this.$confirm(
        '取消后修改将不会被保存，是否确认取消？',
        '取消确认',
        {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      )
      this.jump('info')
    },
  },
  created() {
    this.id = this.route.params.id
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.wrapper {
  text-align: center;
}

.box {
  // border: 1px solid red;
  margin-top: 30px;
  // background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.infoHead {
  margin: 0 !important;
  padding: $gapNormal 0;
}

.goBack:hover {
  cursor: pointer;
}

.edit {
  margin-right: $gapNormal;
}

.edit:hover {
  cursor: pointer;
}

.list {
  margin-bottom: $gapNormal;
}

.myList {
  text-align: left;
}

.myInput {
  width: 240px;
}

.myTit {
  margin: 0;
}
</style>
