<!-- 描述 -->
<template>
  <div class="el-card">
    <div :class="$style.titles">
      <h3>
        资产关系管理
      </h3>
      <div>
        <ElButton
          size="small"
          type="primary"
          @click="augment"
        >
          新增
        </ElButton>
      </div>
    </div>
    <!-- 表格   -->
    <div>
      <ITable
        ref="table"
        :get="page"
        :query="query"
      >
        <ElTableColumn
          label="关系名"
          prop="name"
        />
        <ElTableColumn
          label="逆向关系名"
          prop="reNameStr"
        />
        <ElTableColumn
          label="描述"
          prop="description"
        >
          <template slot-scope="scope">
            {{ scope.row.description || '-' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          fixed="right"
          label="操作"
        >
          <template #default="{ row }">
            <div>
              <ElButton
                type="text"
                size="small"
                @click="edit(row)"
              >
                编辑
              </ElButton>
              <ElButton
                type="text"
                size="small"
                :class="STYLE.danger"
                @click="del(row)"
              >
                删除
              </ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ITable>
    </div>
    <!-- 弹出框   -->
    <IDrawer
      :drawer="drawer"
      :title="title === 'add' ? '新增关系' :'修改关系'"
      @handleClose="handleClose"
    >
      <div slot="buttons">
        <ElButton
          plain
          size="small"
          @click="handleClose"
        >
          取消
        </ElButton>
        <ElButton
          type="primary"
          size="small"
          @click="relation"
        >
          保存
        </ElButton>
      </div>
      <div slot="content">
        <ElForm
          ref="form"
          :model="form"
          size="small"
          label-width="110px"
        >
          <ElFormItem
            label="关系名："
            :rules="[
              { required: true, message: '请输入关系名', trigger: 'blur' },
            ]"
          >
            <ElInput
              v-model="form.name"
              class="input"
              show-word-limit
              maxlength="10"
              placeholder="请输入关系名"
            />
          </ElFormItem>
          <ElFormItem
            label="逆向关系名："
            :rules="[
              { required: true, message: '请输入逆向关系名', trigger: 'blur' },
            ]"
          >
            <ElInput
              v-if="title === 'add'"
              v-model="form.reName"
              class="input"
              maxlength="10"
              show-word-limit
              placeholder="请输入逆向关系名"
            />
            <ElInput
              v-else
              v-model="form.reNameStr"
              disabled
              maxlength="10"
              class="input"
              show-word-limit
              placeholder="请输入逆向关系名"
            />
          </ElFormItem>
          <ElFormItem
            label="描述："
          >
            <ElInput
              v-model="form.description"
              type="textarea"
              show-word-limit
              maxlength="200"
            />
          </ElFormItem>
        </ElForm>
      </div>
    </IDrawer>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import {
  exportAddRelation,
  exportDelRelation,
  exportGetList,
  exportEditRelation,
} from '@/api/assets/assetsRelation'
import IDrawer from '@homeCom/assets/Drawer'
import ITable, { ElTableColumn } from '@/components/Table'
import STYLE from '@/scss/status.module.scss'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: {
    ITable,
    ElTableColumn,
    IDrawer,
  },
  data() {
    return {
      title: 'add',
      drawer: false,
      query: {},
      form: {
        name: '',
        reName: '',
        description: '',
        id: '',
        reNameStr: '',

      },
    }
  },
  computed: {
    STYLE: () => STYLE,
    page: () => exportGetList,
  },
  methods: {
    // 弹出框开关
    handleClose() {
      this.drawer = false
    },
    // 确认
    relation() {
      switch (this.title) {
        case 'add':
          if (this.form.name !== this.form.reName) {
            exportAddRelation(this.form).then(res => {
              if (res.data.status) {
                this.$notify.success('新增成功')
                this.$refs.table.fetch()
              }
            })
          } else {
            this.$notify.warning('关系名与逆向关系名重复')
          }
          break
        case 'edit':
          exportEditRelation(this.form).then(res => {
            if (res.data.status) {
              this.$notify.success('修改成功')
              this.$refs.table.fetch()
            }
          })
          break
      }
      this.drawer = false
    },
    // 新增
    augment() {
      this.drawer = true
      this.title = 'add'
      this.form = {
        id: '',
        name: '',
        reName: '',
        description: '',
      }
    },
    // 编辑
    edit(row) {
      this.title = 'edit'
      this.drawer = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.reName = row.reName
      this.form.description = row.description
      this.form.reNameStr = row.reNameStr
    },
    // 删除
    del(row) {
      const id = row.id
      exportDelRelation(id).then(res => {
        if (res.data.status) {
          this.$notify.warning('删除资产关系成功')
          this.$refs.table.fetch()
        }
      })
    },
  },
}
</script>

<style lang="scss" module>

.titles {
  display: flex;
  justify-content: space-between;

  h3 {
    margin: 4px 0 18px;
    font-weight: bold;
    font-size: 16px;
  }
}

</style>
