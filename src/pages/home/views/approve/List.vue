<!-- 描述 -->
<template>
  <ITable
    :get="get"
    :head="head"
    :query="query"
    :default-sort="{prop: 'date'}"
  >
    <!-- <ElTableColumn
          prop="examinationNo"
          label="审批编号"
        >
          <template #prefix="{ row }">
            <RouterLink
              :to="`${route.fullPath}/${row.id}/detail`"
              class="el-link el-link--primary"
            >
              {{ row.examinationNo }}
            </RouterLink>
          </template>
        </ElTableColumn> -->
    <template #default>
      <ElTableColumn
        prop="examinationStatus"
        label="状态"
      >
        <template #default="{ row }">
          <span :class="COLOR[row.examinationStatus]">
            {{ STATUS[row.examinationStatus] }}
          </span>
        </template>
      </ElTableColumn>

      <ElTableColumn
        label="操作"
        width="120px"
      >
        <template #default="{ row }">
          <div v-if="row.examinationStatus === 0">
            <!-- 通过 -->
            <ElTooltip
              v-if="commercialManager"
              content="通过"
            >
              <i
                class="i-tongguo common_table_opt_icon common_margin_right"
                @click="tongguo(row)"
              />
            </ElTooltip>
            <!-- 拒绝 -->
            <ElTooltip
              v-if="commercialManager"
              content="拒绝"
            >
              <i
                class="i-shibai common_table_opt_icon common_margin_right"
                @click="jujue(row)"
              />
            </ElTooltip>
            <!-- 撤回 -->
            <ElTooltip
              v-if="row.createUser === idUser"
              content="撤回"
            >
              <i
                class="i-chehui common_table_opt_icon"
                @click="chehui(row)"
              />
            </ElTooltip>
            <ElDialog
              title="审批备注"
              :visible.sync="remarkVisible"
              width="30%"
            >
              <ElForm
                ref="addForm"
                :model="remarkForm"
              >
                <ElFormItem
                  prop="remark"
                  :rules="{
                    required: true,
                    message: '请输入审批备注',

                  }"
                >
                  <ElInput
                    v-model="remarkForm.remark"
                    type="textarea"
                    autocomplete="off"
                    :maxlength="50"
                  />
                </ElFormItem>
              </ElForm>

              <template #footer>
                <ElButton
                  type="primary"
                  @click="save(remarkForm)"
                >
                  确定
                </ElButton>

                <ElButton @click="cancelSave(remarkForm)">
                  取消
                </ElButton>
              </template>
            </ElDialog>
          </div>
        </template>
      </ElTableColumn>
    </template>
  </ITable>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'

import me from '@/store/user'
import { ROLES } from '@/enums'
import { THEME, STATUS } from '@/enums/approve'

import { list, listor, passAndRefuseSave } from '@/api/servicePlatform/examination'
import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: { type: Object, required: true },
    query: { type: Object, required: true },
  },
  components: { ITable, ElTableColumn },
  data() {
    return {
      // 权限控制
      commercialManager: this.authFit(ROLES.commercialManager),
      remarkVisible: false,
      remarkForm: {
        id: '',
        examinationNo: '',
        examinationTheme: '',
        applicantName: '',
        examinationStatus: '',
        remark: '',
      },
    }
  },
  computed: {
    examinationThemes: () => THEME,
    STATUS: () => STATUS,
    COLOR: () => {
      return [
        STYLE.primary,
        STYLE.success,
        STYLE.danger,
        STYLE.info,
      ]
    },
    get() {
      switch (true) {
        case this.authFit(ROLES.commercialManager):
          return list
        case this.authFit(ROLES.commercialMember):
          return listor
        default:
          return null
      }
    },
    head() {
      return [
        {
          label: '审批编号',
          formatter: row => this.$createElement(
            'RouterLink',
            {
              class: 'el-link el-link--primary',
              props: { to: `detail?id=${row.id}`, append: true },
            },
            row.examinationNo
          ),
        },
        {
          prop: 'examinationTheme',
          label: '审批主题',
          formatter: (row: any) => {
            const state = row.examinationTheme
            return row.domainName || this.examinationThemes[state] || '未知'
          },
        },
        { prop: 'applicantName', label: '申请人' },
        { prop: 'createDate', label: '时间' },
        { prop: 'remark', label: '备注' },
      ]
    },
    // 获取当前用户id
    idUser: () => me.id,
  },
  methods: {
    // pass
    save() {
      const remark = this.remarkForm.remark
      if (remark.length <= 0) {
        this.$notify.error('备注不能为空')
        return true
      }
      this.remarkVisible = false
      const data = {
        id: this.remarkForm.id,
        examinationType: this.remarkForm.examinationType,
        remark: this.remarkForm.remark,
        examinationTheme: this.remarkForm.examinationTheme,
      }
      passAndRefuseSave(data)
        .then(() => {
          // this.emit(GLOBAL.return, true)
          this.$notify.success('操作成功')
        })
        .finally(() => {
          this.remarkForm.remark = ''// 清空备注信息
          // 自动刷新
          this.$router.go(0)
        })
    },
    // 取消新增
    cancelSave() {
      this.remarkVisible = false
      this.remarkForm.remark = ''// 清空备注信息
    },
    // 通过
    tongguo(row: any) {
      this.remarkVisible = true
      this.remarkForm.id = row.id
      this.remarkForm.examinationTheme = row.examinationTheme
      this.remarkForm.examinationType = 1
    },
    // 拒绝
    jujue(row: any) {
      this.remarkVisible = true
      this.remarkForm.id = row.id
      this.remarkForm.examinationTheme = row.examinationTheme
      this.remarkForm.examinationType = 2
    },
    // 撤回
    chehui(row: any) {
      this.remarkVisible = true
      this.remarkForm.id = row.id
      this.remarkForm.examinationTheme = row.examinationTheme
      this.remarkForm.examinationType = 3
    },
  },

}
</script>
