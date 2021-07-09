<!-- 描述 -->
<template>
  <div>
    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        :inline="true"
        :label-width="CONFIG.labelWidth"
        :model="filterForm"
      >
        <ElFormItem label="单位名称：">
          <ElInput
            v-model="filterForm.keyword"
            clearable
            placeholder="请输入单位名称"
          />
        </ElFormItem>
        <ElFormItem
          filterable
          label="填报单位："
          prop="fillCompanyId"
        >
          <ElSelect
            v-model="filterForm.fillCompanyId"
            placeholder="请选择"
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
    </Transition>
    <div :class="$style.mb">
      <ElButton
        v-if="!checkPower"
        type="primary"
        size="small"
        :class="$style.button"
        @click="addHost()"
      >
        添加
      </ElButton>
      <ElButton
        v-if="!checkPower"
        type="primary"
        size="small"
        :class="$style.button"
        @click="visible = true"
      >
        批量导入
      </ElButton>
      <ElButton
        type="primary"
        size="small"
        :class="$style.button"
        @click="exportHost()"
      >
        导出
      </ElButton>
    </div>
    <ITable
      ref="table"
      v-loading="isLoadingTable"
      :get="activeName === '4' && queryHost"
      :query="filterForm"
      style="width: 93vw;"
    >
      <ElTableColumn
        align="center"
        prop="companyName"
        label="单位名称"
      >
        <template #default="{ row }">
          <RouterLink
            class="el-link el-link--primary"
            :to="`${route.fullPath}/${row.id}/assetsManage/modifyNonSecretCount`"
          >
            {{ row.companyName }}
          </RouterLink>
        </template>
      </ElTableColumn>
      <ElTableColumn
        align="center"
        prop="companyLevel"
        label="级别"
      />
      <ElTableColumn
        align="center"
        label="服务器数量"
      >
        <ElTableColumn
          align="center"
          prop="serverCurrNum"
          label="当前数量"
        />
        <ElTableColumn
          align="center"
          prop="serverReNum"
          label="应替数量"
        />
        <ElTableColumn
          align="center"
          prop="serverOneReNum"
          label="2020年替换量"
        />
        <ElTableColumn
          align="center"
          prop="serverTwoReNum"
          label="2021年替换量"
        />
        <ElTableColumn
          align="center"
          prop="serverThreeReNum"
          label="2022年替换量"
        />
      </ElTableColumn>
      <ElTableColumn
        align="center"
        label="终端数量"
      >
        <ElTableColumn
          align="center"
          prop="terminalCurrNum"
          label="当前数量"
        />
        <ElTableColumn
          align="center"
          label="单机"
        >
          <ElTableColumn
            align="center"
            prop="terminalSingleCurrNum"
            label="当前数量"
          />
          <ElTableColumn
            align="center"
            prop="terminalSingleReNum"
            label="应替数量"
          />
        </ElTableColumn>
        <ElTableColumn
          align="center"
          label="联网终端"
        >
          <ElTableColumn
            align="center"
            prop="terminalConnCurrNum"
            label="当前数量"
          />
          <ElTableColumn
            align="center"
            prop="terminalConnReNum"
            label="应替数量"
          />
          <ElTableColumn
            align="center"
            prop="terminalConnOneReNum"
            label="2020年替换量"
          />
          <ElTableColumn
            align="center"
            prop="terminalConnTwoReNum"
            label="2021年替换量"
          />
          <ElTableColumn
            align="center"
            prop="terminalConnThreeReNum"
            label="2022年替换量"
          />
        </ElTableColumn>
      </ElTableColumn>
      <ElTableColumn
        align="center"
        width="200"
        label="填报单位"
        prop="fillCompanyId"
      />
      <ElTableColumn
        v-if="!checkPower"
        width="100"
        label="操作"
        align="center"
      >
        <template #default="{ row }">
          <div :class="$style.tableClick">
            <RouterLink
              tag="span"
              :to="`${route.fullPath}/${row.id}/assetsManage/editNonSecretCount`"
            >
              <span>编辑</span>
            </RouterLink>
            <span @click="deleteInfo(row)">删除</span>
          </div>
        </template>
      </ElTableColumn>
    </ITable>
    <IDialog
      :visible.sync="visible"
      @success="refreshTable"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { getOrganizationInfo } from '@/api/systemManage/organization'
import ITable from '@com/Table'
import {
  listAll,
  list,
  exportAll,
  exportCurrentAndNext,
  deleteSecreCount,
} from '@/api/assetsManage/secretCount'
import IDialog from '@home/views/assetsManage/nonSecretCount/importNonSecretCount'
import { save } from '@/utils/downloader'
import { ROLES } from '@/enums'
export default {
  props: {
    route: { type: Object, required: true },
    activeName: { type: String, default: '0' },
  },
  components: { ITable, IDialog },
  data() {
    return {
      organizations: [],
      visible: false,
      isLoadingTable: false,
      filterForm: {
        fillCompanyId: '',
        orderField: 'create_date',
        orderFieldType: 'desc',
        srType: '1',
        belongCompanyId: '',
        keyword: '',
        networkTypeCode: '',
        depositLocationCode: '',
      },
    }
  },
  computed: {
    ROLES: () => ROLES,
    queryHost() {
      switch (true) {
        case this.authFit(ROLES.unitSO) || this.authFit(ROLES.groupLeaders):
          return list
        default:
          return listAll
      }
    },
    checkPower() {
      const power =
        this.authFit(ROLES.groupLeaders) ||
        this.authFit(ROLES.securityExperts) ||
        this.authFit(ROLES.monitorAnlysis) ||
        this.authFit(ROLES.opertateMaintenance) ||
        this.authFit(ROLES.projectManager)
      return power
    },
    exportTable() {
      switch (true) {
        case this.authFit(ROLES.unitSO) || this.authFit(ROLES.groupLeaders) || this.filterForm.fillCompanyId !== '':
          return exportCurrentAndNext
        default :
          return exportAll
      }
    },
  },

  methods: {
    deleteInfo(row) {
      const id = row.id || ''
      const ids = []
      ids.push(id)
      const params = {
        ids,
      }
      id &&
        this.$confirm('此操作不可逆,确定删除？', '删除确认', {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        })
          .then(() => {
            deleteSecreCount(params).then((res) => {
              if (res && res.data.status) {
                ;(this.$refs.table as any).fetch()
                this.$notify.success('删除成功')
              } else {
                let errMessage = '删除失败,请稍后再试'
                if (res.data && res.data.msg) {
                  errMessage = res.data.msg
                }
                this.$message.error(errMessage)
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
    },

    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },

    async exportCurrentAndNext() {
      const res = await exportCurrentAndNext
        .apply({ srType: '1' }, arguments)
      return res
    },

    async exportAll() {
      const res = await exportAll
        .apply({ srType: '1' }, arguments)
      return res
    },

    async list() {
      const res = await list.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    exportHost() {
      this.$notify.info('正在导出中，请稍后......')
      this.exportTable(this.filterForm).then((res) => {
        if (res) {
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
    addHost() {
      this.$router.push({ path: '/assetsManage/addNonSecretCount' })
    },
    async listAll() {
      const res = await listAll.apply(null, arguments).finally(() => {
        this.isLoadingTable = false
      })
      return res
    },
    refreshTable() {
      ;(this.$refs.table as any).fetch()
    },
  },
  created() {
    this.fetchOrganization()
  },
}
</script>
<style lang="scss" module>
.tableClick {
  color: #3273c4;
  cursor: pointer;

  span:not(:first-child) {
    margin-left: 4px;
  }
}

.mb {
  margin-bottom: $gapNormal;
}
</style>
