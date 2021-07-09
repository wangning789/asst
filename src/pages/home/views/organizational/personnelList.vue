<!-- 描述 -->
<template>
  <div>
    <span :class="$style.name">人员列表</span>
    <div :class="$style.option">
      <div :class="$style.list">
        <div :class="$style.elinput">
          <ElInput
            v-model.lazy.trim="keyWord"
            :class="$style.input"
            clearable
            size="medium"
            suffix-icon="i-sousuo"
            placeholder="请输入人员名称/手机号"
          />
        </div>
      </div>
      <div :class="$style.list">
        <div style="margin-right: 8px;">
          <ElButton
            size="small"
            :class="$style.buttonAll"
            type="primary"
            @click="newlyBuild"
          >
            新建
          </ElButton>
        </div>
        <div>
          <ElButton
            size="small"
            :class="$style.button"
            plain
            @click="department"
          >
            变更单位
          </ElButton>
        </div>
      </div>
    </div>
    <div
      class="table"
      style="margin-top: 12px;"
    >
      <ElTable
        ref="multipleTable"
        row-key="id"
        :class="$style.table"
        :header-cell-style="{ background: '#F1F3F6', height: '40px' }"
        tooltip-effect="dark"
        :data="tableData"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn
          :reserve-selection="true"
          :class="$style.table"
          type="selection"
          width="55"
        />
        <template v-for="(item, index) in head">
          <ElTableColumn
            :key="index"
            :class="$style.table"
            :prop="item.prop"
            :label="item.label"
          >
            <template slot-scope="scope">
              {{ scope.row[item.prop] || '-' }}
            </template>
          </ElTableColumn>
        </template>
        <ElTableColumn
          :class="$style.table"
          fixed="right"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <div class="elButtomText">
              <span
                class="changeDepartment"
                @click="unitChange(scope)"
              >编辑</span>
              <span
                class="delete"
                @click="changeDepartment(scope)"
              >删除</span>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div :class="$style.paging">
      <div>
        <ElPagination
          :current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChangeTwo"
        />
      </div>
    </div>
    <IDrawer
      :drawer="drawer"
      :title="'新增人员'"
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
          @click="addPeople"
        >
          保存
        </ElButton>
      </div>
      <div slot="content">
        <ElForm
          ref="form"
          size="small"
          :model="form"
          label-width="100px"
        >
          <ElFormItem
            label="姓名："
            prop="staffName"
            :rules="[
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ]"
          >
            <ElInput
              v-model="form.staffName"
              show-word-limit
              maxlength="10"
              placeholder="请输入姓名"
            />
          </ElFormItem>
          <ElFormItem
            label="手机号："
            prop="phoneNumber"
            :rules="[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '请输入正确的手机号码',
                trigger: 'blur',
              },
            ]"
          >
            <ElInput
              v-model="form.phoneNumber"
              show-word-limit
              placeholder="请输入手机号码"
            />
          </ElFormItem>
          <ElFormItem
            label="所属单位："
            prop="organizationId"
            :rules="[
              { required: true, message: '请选择所属单位', trigger: 'blur' },
            ]"
          >
            <ElSelect
              v-model="form.organizationId"
              default-first-option
              placeholder="请输入所属单位"
              clearable
              filterable
            >
              <ElOption
                v-for="item in organizations"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="邮箱："
            prop="mailbox"
            :rules="[
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: ['blur', 'blur'],
              },
            ]"
          >
            <ElInput
              v-model="form.mailbox"
              show-word-limit
              placeholder="请输入邮箱"
            />
          </ElFormItem>
          <ElFormItem
            label="备注："
            prop="description"
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
    <div class="dialog">
      <ElDialog
        title="变更单位"
        :visible.sync="dialogVisible"
        width="450px"
        :before-close="handleCloseTwo"
      >
        <div class="elform">
          <ElForm
            ref="reffrom"
            size="small"
            :model="elform"
            label-width="110px"
          >
            <ElFormItem
              label="单位："
              prop="id"
              :rules="[
                { required: true, message: '请选择变更单位', trigger: 'blur' },
              ]"
            >
              <ElSelect
                v-model="elform.id"
                default-first-option
                style="width: 250px;"
                placeholder="请选择需要变更的单位"
                clearable
                filterable
              >
                <ElOption
                  v-for="item in organizations"
                  :key="item.id"
                  :label="item.organizationName"
                  :value="item.id"
                />
              </ElSelect>
            </ElFormItem>
          </ElForm>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <ElButton
            size="small"
            type="primary"
            @click="sureChange"
          >确 定</ElButton>
          <ElButton
            :class="$style.button"
            plain
            size="small"
            @click="handleCloseTwo"
          >取 消</ElButton>
        </span>
      </ElDialog>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import {
  addQuery,
  personnel,
  deletePeople,
  addPeople,
  changeDepartment,
  eimt,
} from '@/api/assets/organizational'
import IDrawer from '@homeCom/assets/Drawer'
export default {
  props: {
    value: {
      type: Boolean,
      default: Boolean,
    },
    organizationId: {
      type: String,
      default: String,
    },
  },
  components: { IDrawer },
  data() {
    return {
      addOrEdit: false, // 是否编辑人员或者添加人员，false是编辑true是添加
      choice: false, // 是否多选
      popleIds: [], // 需要变更单位的人员id多选
      ids: [], // 需要变更单位的人员id单选
      elform: {
        id: '',
      },
      current: true,
      thier: -1,
      total: 0, // 总人员数量
      organizations: [],
      dialogVisible: false,
      currentPage: 1,
      form: {
        staffName: '',
        phoneNumber: '',
        organizationId: '',
        mailbox: '',
        description: '',
      },
      drawer: false,
      tableData: [],
      keyWord: '',
    }
  },
  computed: {
    addAndEdit() {
      switch (true) {
        case this.addOrEdit === true:
          return addPeople
        default:
          return eimt
      }
    },
    head: () => [
      { label: '姓名', prop: 'staffName' },
      { label: '手机号', prop: 'phoneNumber' },
      { label: '邮箱', prop: 'mailbox' },
      { label: '所属单位', prop: 'organizationName' },
    ],
  },
  watch: {
    // 查不查看本级
    value(val) {
      this.currentPage = 1
      this.current = !val
      this.personnel()
    },
    // 输出框数据
    keyWord() {
      clearInterval(this.thier)
      this.thier = setTimeout(() => {
        this.currentPage = 1
        this.personnel()
      }, 200)
    },
    // 组织架构id
    organizationId(val) {
      if (val) {
        this.currentPage = 1
        this.personnel()
      }
    },
  },
  methods: {
    // 跨页多选变更单位
    handleSelectionChange(val) {
      this.choice = true
      this.popleIds = []
      if (val.length > 0) {
        val.map((item) => {
          this.popleIds.push(item.id)
        })
      }
    },

    // 变更单位单选
    unitChange(val) {
      addQuery().then((res) => {
        this.addOrEdit = false
        this.drawer = true
        if (res.data && res.data.body.length > 0) {
          this.organizations = res.data.body
          this.form.organizationId = this.organizationId
          this.drawer = true
          this.form = {
            staffName: val.row.staffName,
            phoneNumber: val.row.phoneNumber,
            organizationId: val.row.organizationId,
            mailbox: val.row.mailbox,
            description: val.row.description,
            id: val.row.id,
          }
        }
      })
    },
    // 确认改变单位
    sureChange() {
      ;(this.$refs.reffrom as any).validate((valid: boolean) => {
        if (valid) {
          const from = {
            ids: this.choice === false ? this.ids : this.popleIds,
            organizationId: this.elform.id,
          }
          changeDepartment(from).then((res) => {
            if (res.data.status === true) {
              this.dialogVisible = false
              if (this.choice === true) {
                this.$refs.multipleTable.clearSelection()
              }
              this.choice === false
                ? (this.currentPage =
                    this.tableData.length === 1 && this.currentPage > 1
                      ? this.currentPage - 1
                      : this.currentPage)
                : (this.currentPage = 1)
              this.$notify({
                message: '人员变更成功',
                type: 'success',
              })
              this.ids = []
              this.personnel()
            }
          })
        }
      })
    },
    // 分页
    handleCurrentChangeTwo(val) {
      this.currentPage = val
      this.personnel()
    },
    // 保存新增人员
    addPeople() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          this.addAndEdit(this.form).then((res) => {
            if (res.data.status === true) {
              this.form = {
                staffName: '',
                phoneNumber: '',
                organizationId: '',
                mailbox: '',
                description: '',
              }
              this.drawer = false
              this.$notify({
                message: this.addOrEdit === true ? '添加人员成功' : '编辑人员成功',
                type: 'success',
              })
              this.personnel()
            }
          })
        }
      })
    },
    // 删除人员
    changeDepartment(val) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePeople(val.row.id).then((res) => {
            if (res.data.status === true) {
              this.currentPage =
                this.tableData.length === 1 && this.currentPage > 1
                  ? this.currentPage - 1
                  : this.currentPage
              this.$notify({
                message: '删除人员成功',
                type: 'success',
              })
              this.personnel()
            }
          })
        })
        .catch(() => {
          this.thier = -1
        })
    },
    // 组织机构人员
    personnel() {
      const from = {
        keyword: this.keyWord,
        organizationId: this.organizationId,
        page: this.currentPage,
        pageSize: 10,
        scopeFlag: this.current,
      }
      personnel(from).then((res) => {
        if (res.data.body) {
          this.tableData = res.data.body.data
          this.total = res.data.body.total
        }
      })
    },

    // 变更单位对话框
    handleCloseTwo() {
      this.$refs.reffrom.resetFields()
      this.elform = {
        id: '',
      }
      this.dialogVisible = false
    },
    // 变更单位多选
    department() {
      if (this.popleIds.length > 0) {
        this.dialogVisible = true
        addQuery().then((res) => {
          if (res.data && res.data.body.length > 0) {
            this.organizations = res.data.body
          }
        })
      } else {
        this.$message.error('请选择需要变更的人员')
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 关闭抽屉和取消抽屉
    handleClose() {
      this.form = {
        staffName: '',
        phoneNumber: '',
        organizationId: '',
        mailbox: '',
        description: '',
      }
      this.$refs.form.resetFields()
      this.drawer = false
    },
    // 点击新建
    newlyBuild() {
      addQuery().then((res) => {
        this.addOrEdit = true
        this.drawer = true
        if (res.data && res.data.body.length > 0) {
          this.organizations = res.data.body
          this.form.organizationId = this.organizationId
        }
      })
    },
  },
  mounted() {
    this.$on('bridge', () => {
      this.personnel()
    })
  },
}
</script>

<style lang="scss" module>
.edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 24px;
  margin-left: 24px;

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  .butt {
    display: flex;
  }
}

.option {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
}

.name {
  color: #333;
  font-weight: bold;
  font-size: 14px;
}

.input:global(.el-input--medium .el-input__inner) {
  width: 180px;
  height: 32px;
}

.input:global(.el-input--medium .el-input__icon) {
  line-height: 32px;
}

.button:global(.el-button) {
  color: $colorTheme;
}

.list {
  display: flex;
}

.elinput {
  margin-right: 8px;
}

.table:global(.el-table__header tr, .el-table__header th) {
  padding: 0;
}

.table:global(.el-table__body tr, .el-table__body td) {
  padding: 0;
}

.buttonClub {
  color: $colorTheme;
}

.paging {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 22px;
}
</style>
<style scoped>

.table >>> .el-table th {
  padding: 0;
}

.table >>> .el-table td {
  height: 40px;
  padding: 0;
}

.table >>> .el-table thead {
  color: #333;
  font-weight: 400;
}

.elButtomText {
  display: flex;
  font-size: 12px;
}

.elButtomText:hover {
  cursor: pointer;
}

.changeDepartment {
  margin-right: 8px;
  color: #2c73ef;
}

.delete {
  color: #f56c6c;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.dialog >>> .el-dialog__title {
  font-size: 16px;
}

.elformitem {
  margin-top: 24px;
  margin-left: 16px;
}

</style>
