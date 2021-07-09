<!-- 描述 -->
<template>
  <div class="el-card">
    <div>
      <h4 :class="$style.title">
        服务管理
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
          <ElFormItem label="服务编号：">
            <ElInput
              v-model="params.serviceNo"
              placeholder="请输入服务编号"
            />
          </ElFormItem>

          <ElFormItem label="服务名称：">
            <ElInput
              v-model="params.serviceName"
              placeholder="请输入服务名称"
            />
          </ElFormItem>

          <ElFormItem label="服务简介：">
            <ElInput
              v-model="params.serviceIntroduce"
              placeholder="请输入服务简介"
            />
          </ElFormItem>

          <ElFormItem label="状态：">
            <ElSelect
              v-model="params.serviceStatus"
              style="width: 200px;"
              placeholder="请选择"
            >
              <ElOption
                v-for="item in optionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </Transition>
    </div>
    <ElRow :class="$style.mg">
      <ITable
        ref="table"
        :get="page"
        :query="query"
        :head="head"
      >
        <ElTableColumn
          label="操作"
          width="120px"
        >
          <template #default="{ row }">
            <ElTooltip content="编辑">
              <i
                class="el-icon-edit-outline common_table_opt_icon common_margin_right"
                @click="edit(row)"
              />
            </ElTooltip>
            <ElTooltip content="删除">
              <i
                class="el-icon-delete common_table_opt_icon common_margin_right"
                @click="del(row)"
              />
            </ElTooltip>
            <ElTooltip :content="row.serviceStatus ? '下架' : '上架'">
              <i
                :class="'common_table_opt_icon ' +
                  (row.serviceStatus ? 'i-xiajia' : 'i-shangjia')"
                @click="putaway(row)"
              />
            </ElTooltip>
          </template>
        </ElTableColumn>
      </ITable>
    </ElRow>

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
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTableColumn from 'element-ui/lib/table-column'
import ElDatePicker from 'element-ui/lib/date-picker'
import ITable from '@com/Table'

import { del } from '@/api/tools/file'
import { listServicePage, serviceDel, serviceUpDown } from '@/api/ares/serve'

import { DATE_TIME } from '@/enums/format'
import { SERVICE_TYPE } from '@/enums/mall'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: {
    ITable,
    ElTableColumn,
    ElDatePicker,
  },
  data() {
    return {
      title: '',
      selectObj: {},
      centerDialogVisible: false,
      showFilter: false,
      form: {},
      params: {},
      applyForm: { remark: '', effectTime: '' },
    }
  },
  computed: {
    DATE_TIME: () => DATE_TIME,
    optionType: () => [
      { value: '', label: '全部' },
      { value: '0', label: '下架' },
      { value: '1', label: '上架' },
    ],
    page() {
      return listServicePage
    },
    query(this: any) {
      return this.params
    },
    head() {
      return [
        {
          prop: 'serviceNo',
          label: '服务编号',
          width: '220x',
          formatter: (row: any) => {
            return (
              row.domainName ||
              this.$createElement(
                'RouterLink',
                {
                  class: 'el-link el-link--primary',
                  props: {
                    to: `${this.route.fullPath}/info?id=${row.id}&state=info`,
                  },
                },
                row.serviceNo
              )
            )
          },
        },
        {
          width: '90x',
          label: '服务类型',
          formatter: row => SERVICE_TYPE[row.serviceType],
        },
        { prop: 'serviceName', label: '服务名' },
        { prop: 'serviceIntroduce', label: '服务简介' },
        // { prop: 'serviceRemarkContent', label: '服务描述' },
        {
          prop: 'createDate',
          label: '创建时间',
        },
        {
          prop: 'serviceStatus',
          label: '状态',
          width: '80x',
          formatter: (row: any) => {
            const state = row.serviceStatus
            let name
            if (state === 0) {
              name = '下架'
            } else {
              name = '上架'
            }
            return row.domainName || this.$createElement('div', name)
          },
        },
      ]
    },
  },
  methods: {
    add() {
      this.jump({ path: 'add', query: { state: 'add' }, append: true })
    },
    edit(obj: any) {
      this.jump({
        path: 'add',
        query: { id: obj.id, state: 'edit' },
        append: true,
      })
    },
    async del(obj: any) {
      await this.$confirm(
        `此操作不可逆, 确定要删除服务【${obj.serviceName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      try {
        await serviceDel({ id: obj.id })
        if (obj.fileIds) {
          await del(obj.fileIds)
        }
      } catch (error) {
        return
      }
      this.$notify.success(`删除服务【${obj.serviceName}】成功`)
      ;(this.$refs.table as any).fetch()
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
    // 上架 下架
    putaway(this: any, row: any) {
      const state = row.serviceStatus
      this.selectObj = row
      this.title = state === 0 ? '上架' : '下架'

      const applyForm = this.applyForm
      applyForm.effectTime = applyForm.remark = ''
      this.centerDialogVisible = true
    },
    savePutaway(this: any) {
      ;(this.$refs.applyForm as any).validate((valid: boolean) => {
        if (valid) {
          const selectObj = this.selectObj
          const applyForm = this.applyForm
          const isUp = selectObj.serviceStatus === 0
          serviceUpDown({
            id: selectObj.id,
            remark: applyForm.remark,
            effectTime: applyForm.effectTime,
            serviceStatus: isUp ? 1 : 0,
          }).then(res => {
            if (res.data.status) {
              this.$notify.success((isUp ? '上架' : '下架') + '审批申请成功')
              ;(this.$refs.table as any).fetch()
              this.centerDialogVisible = false
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table-column';
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.wrapper {
  text-align: center;
}

.mg {
  margin-top: 20px;
  margin-bottom: 20px;
}

.add {
  position: absolute;
  right: 0%;
}

.screen {
  position: relative;
  right: -68%;
}

.fr {
  float: right;
}

.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}
</style>
