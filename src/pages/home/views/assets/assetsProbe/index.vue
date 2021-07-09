<!-- 描述 -->
<template>
  <div class="el-card">
    <div :class="$style.title">
      <h3>
        资产探针管理
      </h3>
    </div>
    <div :class="$style.flex">
      <div :class="$style.right">
        <ElInput
          v-model.lazy.trim="keyword"
          clearable
          size="medium"
          suffix-icon="i-sousuo"
          placeholder="输入探针名称或者部署服务器IP进行查询"
        />
      </div>
      <div :class="$style.left">
        <ElButton
          size="small"
          type="primary"
          @click="goToAdd"
        >
          新增
        </ElButton>
      </div>
    </div>
    <div :class="$style.contenner">
      <ITable
        ref="table"
        :get="get"
        :query="query"
      >
        <ElTableColumn width="50px" />
        <ElTableColumn
          label="探针名称"
          prop="name"
        >
          <template #default="{ row }">
            <span
              class="el-button el-button--text"
              @click="draws(row)"
            >
              {{ row.name }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="网络环境"
          prop="networkType"
        >
          <template #default="{ row }">
            {{ row.networkType === '1' ? '互联网':'内网' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="部署区域"
          prop="area"
        />
        <ElTableColumn
          label="部署服务器IP"
          prop="serverIP"
          width="400px"
        />

        <ElTableColumn
          label="状态"
          prop="useStatus"
        >
          <template #default="{ row }">
            <div>
              <div
                v-if="row.useStatus === 0"
                :class="$style.probeStatus"
              >
                正常
              </div>
              <div
                v-else
                :class="$style.probeStatu"
              >
                异常
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="添加时间"
          width="200px"
          prop="createDate"
        />
        <ElTableColumn
          fixed="right"
        >
          <template #default="{ row }">
            <div :class="$style.tableRight">
              <ElButton
                type="text"
                size="small"
                @click="goToEdit(row)"
              >
                编辑
              </ElButton>
              <ElDivider direction="vertical" />
              <ElButton
                type="text"
                size="small"
                :class="$style.color"
                @click="delProbe(row)"
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
      :title="title === 'add' ? '新增探针' :'修改探针'"
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
          ref="ruleForm"
          :model="ruleForm"
          label-width="130px"
          size="small"
          :rules="rules"
        >
          <ElFormItem
            label="探针名:"
            prop="name"
          >
            <ElInput
              v-model.trim="ruleForm.name"
              size="small"
              placeholder="请输入探针名"
              maxlength="20"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem
            label="网络环境:"
            prop="networkType"
          >
            <ElSelect
              v-model="ruleForm.networkType"
              placeholder="请选择网络环境"
            >
              <ElOption
                v-for="(label,value) in STYLE"
                :key="value"
                :label="label"
                :value="value"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="部署区域:"
            prop="area"
          >
            <ElInput
              v-model.trim="ruleForm.area"
              size="small"
              placeholder="请输入部署区域"
              maxlength="200"
              show-word-limit
            />
          </ElFormItem>
          <ElFormItem
            label="部署服务器IP:"
            prop="serverId"
          >
            <ElSelect
              v-model="ruleForm.serverId"
              placeholder="请选择部署环境"
            >
              <ElOption
                v-for="item in probeType"
                :key="item.id"
                :label="item.ciName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </div>
    </IDrawer>
    <!-- 弹出框   -->
    <IDrawer
      :drawer="drawers"
      :title="'资产探针详情'"
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
      </div>
      <div slot="content">
        <div :class="$style.aLine">
          <div :class="$style.column">
            <div :class="$style.name">
              探针名称
            </div>
            <div
              :class="$style.customData"
            >
              {{ probeInfo.name }}
            </div>
          </div>
          <div :class="$style.column">
            <div :class="$style.name">
              部署服务器IP
            </div>
            <div
              :class="$style.customData"
            >
              {{ probeInfo.serverIP || '暂无' }}
            </div>
          </div>
          <div :class="$style.column">
            <div :class="$style.name">
              状态
            </div>
            <div
              :class="$style.customData"
            >
              {{ probeInfo.useStatus === 0 ? '正常':'异常' }}
            </div>
          </div>
          <div :class="$style.column">
            <div :class="$style.name">
              添加时间
            </div>
            <div
              :class="$style.customData"
            >
              {{ probeInfo.createDate }}
            </div>
          </div>
        </div>
      </div>
    </IDrawer>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import IDrawer from '@homeCom/assets/Drawer'

import ITable, { ElTableColumn } from '@/components/Table'
import { serverGetAllList } from '@/api/assets/assetsInfo/server'
import { probeGetAllList, del, ASSET_PROBE, add, probeUpdate, info } from '@/api/assets/assetprobe'
/** emit: (事件名: [参数列表, ...]) */
export default {
  components: {
    ITable,
    ElTableColumn,
    IDrawer,
  },
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  data() {
    return {
      query: {},
      keyword: '',
      drawer: false,
      title: 'add',
      ruleForm: {},
      drawers: false,
      probeType: [],
      probeInfo: {},
      rules: {
        name: [
          { required: true, message: '请输入探针名', trigger: 'blur' },
        ],
        networkType: [
          { required: true, message: '请选择网络环境', trigger: 'change' },
        ],
        area: [
          { required: true, message: '请输入部署区域', trigger: 'blur' },
        ],
        serverId: [
          { required: true, message: '请选择部署环境', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    STYLE: () => ASSET_PROBE,
  },
  watch: {
    keyword() {
      this.$refs.table.fetch()
    },
  },
  methods: {
    async get() {
      const res = await probeGetAllList({ keyword: this.keyword })
      return res
    },
    getAssetsTypeAll() {
      serverGetAllList({}).then(res => {
        this.probeType = res.data.body.dataList.list
      })
    },
    validate() {
      let formValid
      this.$refs.ruleForm.validate((valid: boolean) => {
        formValid = valid
      })
      return formValid
    },
    draws(row) {
      this.drawers = true
      const id = row.id
      info(id).then(res => {
        this.probeInfo = res.data.body
      })
    },
    relation() {
      switch (this.title) {
        case 'add':
          if (!this.validate()) {
            return 1
          }
          add(this.ruleForm).then(res => {
            if (res.data.status) {
              this.$notify.success('新增成功')
              this.$refs.table.fetch()
              this.drawer = false
            }
          })
          break
        case 'edit':
          if (!this.validate()) {
            return 1
          }
          probeUpdate(this.ruleForm).then(res => {
            if (res.data.status) {
              this.$notify.success('修改成功')
              this.$refs.table.fetch()
              this.drawer = false
            }
          })
          break
      }
    },
    // 弹出框开关
    handleClose() {
      this.drawer = false
      this.drawers = false
    },
    goToAdd() {
      this.title = 'add'
      this.ruleForm = {}
      this.drawer = true
    },
    goToEdit(row) {
      this.title = 'edit'
      this.drawer = true
      this.ruleForm = row
    },
    delProbe(row) {
      const id = row.id
      del(id).then(res => {
        if (res.data.status) {
          this.$notify.warning('删除资产关系成功')
          this.$refs.table.fetch()
        }
      })
    },
  },
  created() {
    this.getAssetsTypeAll()
  },
}
</script>

<style lang="scss" module>
.title {
  width: 100%;
  border-bottom: 1px solid $colorBorderLv1;

  h3 {
    margin: 4px 0 18px;
    font-weight: bold;
    font-size: 16px;
  }
}

.flex {
  display: flex;
  justify-content: space-between;

  .left,
  .right {
    margin: 12px  0 0;
  }
}

.color {
  color: red;
}

.probeStatus {
  width: 40px;
  height: 20px;
  color: #68c23a;
  font-size: 6px !important;
  line-height: 20px;
  text-align: center;
  background-color: rgba(204, 204, 204, 0.342);
  border: 1px solid rgba(236, 236, 236, 0);
  border-radius: 10px;
}

.probeStatu {
  width: 40px;
  height: 20px;
  color: red;
  font-size: 6px !important;
  line-height: 20px;
  text-align: center;
  background-color: rgba(204, 204, 204, 0.342);
  border: 1px solid rgba(236, 236, 236, 0);
  border-radius: 10px;
}

.right :global(.el-input) {
  width: 300px;
}

.contenner {
  margin-top: 10px;
}

.tableRight {
  float: right;
}

.dropdow {
  color: #2c73df;
  font-size: 10px;
}

.aLine {
  margin-left: 29px;
  padding-bottom: 16px;
}

.proinfo {
  width: 1200px;
  margin: 0 auto;
}

.column {
  display: flex;

  .name {
    display: flex;
    align-items: center;
    width: 118px;
    height: 38px;
    margin-bottom: -1px;
    padding-left: 10px;
    background-color: rgb(244, 246, 251);
    border: 1px solid #e9e9e9;
  }

  .customData {
    display: flex;
    align-items: center;
    width: 260px;
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding-left: 10px;
    border: 1px solid #f0f0f0;
  }
}
</style>
