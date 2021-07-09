<!--
 * @Description: 码表管理
 * @Author: 毛瑞
 * @Date: 2019-11-19 16:37:03
 -->
<template>
  <ElRow>
    <!-- 码表树 -->
    <ElCol
      v-loading="load"
      :span="6"
      :class="$style.left"
    >
      <ElInput
        v-model.lazy.trim="name"
        clearable
        size="medium"
        suffix-icon="el-icon-search"
        placeholder="请输入名称"
        @change="$refs.tree.filter($event)"
      />
      <ElTree
        ref="tree"
        accordion
        highlight-current
        node-key="id"
        :data="data"
        :expand-on-click-node="false"
        :props="{ children: 'children', label: 'name' }"
        :filter-node-method="
          (value, node) => !value || node.name.indexOf(value) !== -1
        "
        @node-click="
          query.parentId = $event.id
          parentCode = $event.dictCode
        "
      />
    </ElCol>
    <!-- 增删改表格 -->
    <ElCol
      v-show="query.parentId"
      :span="18"
      :class="$style.right"
    >
      <!-- 按钮 -->
      <ElButton
        type="primary"
        size="medium"
        icon="el-icon-plus"
        :class="$style.add"
        @click="type = 1"
      >
        新增
      </ElButton>
      <span :class="$style.code">
        父节点编码:
        <b>{{ parentCode }}</b>
      </span>
      <!-- 表格 -->
      <KeepAlive>
        <ITable
          v-if="query.parentId"
          ref="table"
          :head="head"
          :get="page"
          :query="query"
        >
          <ElTableColumn
            align="center"
            label="操作"
            width="150"
          >
            <template #default="{ row }">
              <ElTooltip content="编辑">
                <ElButton
                  type="text"
                  :icon="'i-bianji '"
                  :class="$style.primary"
                  @click="edit(row, form)"
                />
              </ElTooltip>
              <ElTooltip content="删除">
                <ElButton
                  type="text"
                  :icon="'i-shanchu1 '"
                  :class="$style.danger"
                  @click="dele(row)"
                />
              </ElTooltip>
            </template>
          </ElTableColumn>
        </ITable>
      </KeepAlive>
    </ElCol>
    <!-- 弹窗 -->
    <ElDialog
      width="600px"
      :visible="!!type"
      :title="type === 1 ? '新增' : '编辑'"
      @close="close"
      @open="$refs.form && $refs.form.setIni && $refs.form.setIni(form)"
    >
      <ElForm
        ref="form"
        :model="form"
        label-width="90px"
      >
        <ElFormItem v-show="type === 1">
          <ElSwitch
            v-model.lazy.trim="isRoot"
            active-text="根节点"
            inactive-text="子节点"
          />
        </ElFormItem>
        <ElFormItem
          ref="code"
          label="编码"
          prop="dictCode"
          :rules="checkCode"
        >
          <ElInput
            v-model.lazy.trim="form.dictCode"
            placeholder="请输入编码"
          />
        </ElFormItem>
        <ElFormItem
          label="名称"
          prop="dictName"
          :rules="{
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          }"
        >
          <ElInput
            v-model.lazy.trim="form.dictName"
            placeholder="请输入名称"
          />
        </ElFormItem>
        <ElFormItem
          label="序号"
          prop="sortNo"
          :rules="checkSort"
        >
          <ElInput
            v-model.lazy.trim="form.sortNo"
            type="number"
            placeholder="请输入序号"
          />
        </ElFormItem>
        <ElFormItem
          label="备注"
          prop="remark"
        >
          <ElInput
            v-model.lazy.trim="form.remark"
            show-word-limit
            :rows="5"
            type="textarea"
            maxlength="500"
            placeholder="请输入备注"
          />
        </ElFormItem>
        <ElFormItem
          v-show="!isRoot"
          label="是否生效"
          prop="isEffect"
        >
          <ElSwitch
            v-model.lazy.trim="form.isEffect"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton
          type="primary"
          :loading="isSubmit"
          @click="isSubmit || confirm(form)"
        >
          确 定
        </ElButton>
        <ElButton
          type="info"
          @click="$refs.form.resetFields()"
        >
          重置
        </ElButton>

        <ElButton @click="close">
          取 消
        </ElButton>
      </template>
    </ElDialog>
  </ElRow>
</template>

<script lang="tsx">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from 'vue-property-decorator'
import { pInt } from '@/functions/validators'
import ElTree from 'element-ui/lib/tree'
import ElSwitch from 'element-ui/lib/switch'
import ITable, { ElTableColumn } from '@com/Table'

import { tree, page, add, put, dele, check, code } from '@/api/authServer/code'
// 权限分配
// import AUTH from '@index/config/auth/admin/code'

/// 常量(const UPPER_CASE) ///
/// 单例(const camelCase) ///
/// 函数(无副作用, function utils() {}) ///

/// 选项 name,components,directives,filters,extends,mixins ///
@Component({ components: { ElTree, ElSwitch, ITable, ElTableColumn } })
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  @Prop() private readonly code!: string
  /// data (name: string = '响应式属性' // 除了undefined都会响应式) ///
  private data: IObject[] = []
  private name = ''
  private currentCode = ''
  private load = true
  private isSubmit = false
  private type = 0 // 0:无 1:新增 2:编辑
  private query = { dictType: this.code, parentId: '' }
  private form: IObject = {
    dictCode: '',
    dictName: '',
    sortNo: '',
    remark: '',
    isEffect: '0',
  }

  private isRoot = false // 是否新增根节点
  private parentCode = '' // 当前根节点code
  // private STYLE: () => STYLE

  /// 非响应式属性 (name?: string) ///
  /// computed (get name() {} set name(){}) ///
  // private get AUTH() {
  //   return AUTH
  // }
  private get head() {
    const $style = this.$style // 依赖收集

    return [
      { prop: 'sortNo', label: '序号' },
      { prop: 'dictCode', label: '编码' },
      { prop: 'dictName', label: '名称' },
      {
        prop: 'isEffect',
        label: '是否生效',
        formatter: (row: code, column: string[], cellValue: string) => {
          const isEffect = cellValue === '1'

          return this.$createElement(
            'i',
            {
              class: isEffect
                ? $style.success + ' el-icon-success'
                : $style.error + ' el-icon-error',
            },
            [isEffect ? ' 已生效' : ' 未生效']
          )
        },
      },
      { prop: 'remark', label: '备注' },
    ]
  }

  private get page() {
    return page
  }

  // 序号验证
  private get checkSort() {
    return {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: (error?: Error) => void) => {
        if (value || value === 0) {
          try {
            pInt(value)
          } catch (error) {
            return callback(error)
          }
          return callback()
        }
        callback()
      },
    }
  }

  // 编码验证
  private get checkCode() {
    return {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: any, callback: (error?: Error) => void) => {
        if (!value) {
          return callback(new Error('请输入编码'))
        }
        if (
          this.type === 2 &&
          value === this.currentCode
        ) {
          // 编辑且值未变
          return callback()
        }
        check({
          dictType: this.code,
          dictCode: value,
        })
          .then((res: any) => {
            // 丢掉过期请求d
            res.meta.params.dictCode === this.form.dictCode && !res.data.status ? callback(new Error('编码已存在')) : callback()
          })
          .catch(() => {
            callback(new Error('服务器错误, 请稍候再试'))
          })
      },
    }
  }

  /// watch (@Watch) ///
  /// LifeCycle (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    this.tree()
  }

  /// methods (getName(){}) ///
  private tree() {
    this.load = true
    tree(this.code)
      .then(res => {
        this.data = res.data.body
      })
      .finally(() => {
        this.load = false
      })
  }

  private close() {
    this.type = 0
    const form = this.form
    for (const att in form) {
      form[att] = att === 'isEffect' ? '0' : ''
    }
    this.isRoot = false
  }

  private notify(msg: string, noRefresh?: boolean) {
    noRefresh || (this.$refs.table as any).fetch()
    this.tree()
    this.close()
    this.$notify.success(msg)
  }

  private edit(row: IObject, form: IObject) {
    for (const key in form) {
      form[key] = row[key]
    }
    this.currentCode = row.dictCode
    form.id = row.id
    form.dictType = this.code
    form.parentId = row.parentId
    this.type = 2
  }

  private confirm(form: code) {
    this.isSubmit = true
    ;(this.$refs.form as any).validate((valid: boolean) => {
      valid
        ? this.type === 1
          ? this.create(form)
          : this.update(form)
        : (this.isSubmit = false)
    })
  }

  private create(form: code) {
    this.isSubmit = true
    form.id = undefined
    form.dictType = this.code
    if (this.isRoot) {
      form.parentId = undefined
      form.isEffect = '1'
    } else {
      form.parentId = this.query.parentId
    }
    add(form)
      .then(() => {
        this.notify('新增成功')
      })
      .finally(() => {
        this.isSubmit = false
      })
  }

  private update(form: code) {
    this.isSubmit = true
    put(form)
      .then(() => {
        this.notify('更新成功')
      })
      .finally(() => {
        this.isSubmit = false
      })
  }

  private dele({ id, dictName }: code) {
    id &&
      this.$confirm(`此操作不可逆, 确定删除【${dictName}】？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        dele(id).then(() => {
          this.notify('删除成功')
        })
      })
  }
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tree';
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.left {
  min-height: 150px;
  padding-right: 15px;
  border-right: $borderBase;
  transform: translate3d($borderSolidWidth, 0, 0);

  :global(.el-tree) {
    max-height: calc(100vh - 255px);
    overflow: auto;
  }
}

.right {
  padding-left: $borderSolidWidth + 15px;
  border-left: $borderBase;
}

.add {
  margin-bottom: 15px;
}

.success {
  color: $colorSuccess;
}

.error {
  color: $colorDanger;
}

.danger {
  color: $colorDanger !important;
}

.primary {
  color: $colorTheme !important;
}

.code {
  margin-left: 20px;
  color: $colorTextMinor;
  font-size: $small;

  > b {
    color: $colorTextCommon;
  }
}
</style>
