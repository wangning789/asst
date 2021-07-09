<!-- 描述 -->
<template>
  <div class="el-card">
    <div>
      <h4 class="common_h4_title">
        公告列表
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
          :label-width="CONFIG.labelWidth"
        >
          <ElFormItem label="公告编号: ">
            <ElInput
              v-model="params.noticeNo"
              placeholder="请输入内容"
            />
          </ElFormItem>

          <ElFormItem label="公告级别: ">
            <ElSelect
              v-model="params.noticeLevel"
              placeholder="请选择"
            >
              <ElOption
                v-for="item in noticeLevels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="接收对象: ">
            <ElSelect
              v-model="params.departmentDTOList"
              placeholder="请选择"
              value-key="userId"
              multiple
            >
              <ElOption
                v-for="item in objects"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="公告标题: ">
            <ElInput
              v-model="params.title"
              placeholder="请输入内容"
            />
          </ElFormItem>

          <ElFormItem label="公告类型: ">
            <ElSelect
              v-model="params.noticeType"
              placeholder="请选择"
            >
              <ElOption
                v-for="item in noticeTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </Transition>
    </div>

    <ElRow>
      <ITable
        ref="table"
        :get="page"
        :query="query"
        :head="head"
      >
        <ElTableColumn
          label="操作"
          width="80px"
        >
          <template #default="{ row }">
            <i
              class="el-icon-edit-outline common_table_opt_icon common_margin_right"
              title="编辑"
              @click="edit(row)"
            />
            <i
              class="el-icon-delete common_table_opt_icon"
              title="删除"
              @click="del(row)"
            />
          </template>
        </ElTableColumn>
      </ITable>
    </ElRow>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import { noticeList, noticeDel, STATUS } from '@/api/servicePlatform/notice'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { del } from '@/api/tools/file'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn },
  data() {
    return {
      params: {
        pageType: '0',
      },
      objects: [],
      showFilter: false,
    }
  },
  computed: {
    page() {
      return noticeList
    },
    query(this: any) {
      return this.params
    },
    head() {
      return [
        {
          prop: 'noticeNo',
          label: '公告编号',
          width: '220x',
          formatter: (row: any) => {
            return (
              row.domainName ||
              this.$createElement(
                'RouterLink',
                {
                  class: 'el-link el-link--primary',
                  props: { to: `${this.route.fullPath}/${row.id}/detail` },
                },
                row.noticeNo
              )
            )
          },
        },
        {
          prop: 'noticeLevel',
          label: '公告级别',
          formatter: (row: any) => {
            let name = ''
            if (row.noticeLevel === '0') {
              name = '紧急'
            } else {
              name = '普通'
            }
            return row.domainName || this.$createElement('div', name)
          },
        },
        {
          prop: 'noticeType',
          label: '公告类型',
          formatter: (row: any) => {
            let name = ''
            if (row.noticeType === '1') {
              name = '平台公告'
            } else if (row.noticeType === '2') {
              name = '安全咨讯'
            } else if (row.noticeType === '3') {
              name = '风险告警'
            } else {
              name = '其他公告'
            }
            return row.domainName || this.$createElement('div', name)
          },
        },
        {
          prop: 'openStatus',
          label: '公开范围',
          formatter: (row: any) => STATUS[row.openStatus] || '-',
        },
        { prop: 'title', label: '公告标题' },
        {
          prop: 'userName',
          label: '接收对象',
          formatter: (row: any) => {
            if (row.userName === null) {
              return (row.userName = '全员')
            } else {
              return row.userName
            }
          },
        },
        { prop: 'takeEffectTime', label: '发布时间' },
        // {
        //   prop: 'noticeStatus',
        //   label: '状态',
        //   width: '80x',
        //   formatter: (row: any) => {
        //     const state = row.noticeStatus
        //     let name
        //     switch (state) {
        //       case 0:
        //         name = '待审批通过'
        //         break
        //       case 1:
        //         name = '审批通过'
        //         break
        //       case 2:
        //         name = '拒绝'
        //         break
        //       case 3:
        //         name = '撤回'
        //         break
        //     }

        //     return row.domainName || this.$createElement('div', name)
        //   },
        // },
      ]
    },
    noticeLevels: () => [
      {
        label: '全部',
        value: '',
      },
      {
        label: '紧急',
        value: '0',
      },
      {
        label: '普通',
        value: '1',
      },
    ],
    noticeTypes: () => [
      {
        label: '平台公告',
        value: '1',
      },
      {
        label: '安全资讯',
        value: '2',
      },
    ],
  },
  methods: {
    add() {
      this.jump({ path: 'add', append: true })
    },
    edit(obj: any) {
      this.jump({ path: `${obj.id}/edit`, append: true })
    },
    async del(obj: any) {
      await this.$confirm(
        `此操作不可逆, 确定要删除公告【${obj.title}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      await noticeDel({ id: obj.id })
      if (obj.fileIds) {
        await del(obj.fileIds)
      }
      ;(this.$refs.table as any).fetch()
      this.$notify.success(`删除公告【${obj.title}】成功`)
    },
    // 接收对象列表
    // getObject(this: any) {
    //   listCustomer({}).then(res => {
    //     this.objects = res.data.body
    //   })
    // },
    async fetchOrganization() {
      this.objects = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
  },
  created(this: any) {
    // this.getObject()
    this.fetchOrganization()
  },
}
</script>

<style lang="scss" module>
.fr {
  float: right;
}
</style>
