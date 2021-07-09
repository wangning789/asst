<!-- 描述 -->
<template>
  <div>
    <div :class="$style.title">
      相关主机资产：&nbsp;&nbsp;{{ tableData.length }}台
    </div>
    <ElTable
      stripe
      :data="tableData"
      :header-cell-style="{ background: '#FBECEA', color: '#606266' }"
      style="width: 100%;"
    >
      <ElTableColumn
        prop="ciName"
        label="资产名称"
      />
      <ElTableColumn
        prop="Intranet"
        label="IP（内网）"
      />
      <ElTableColumn
        prop="Extranet"
        label="IP（外网）"
      />
      <ElTableColumn
        prop="depositLocationName"
        label="托管位置"
      />
      <ElTableColumn
        prop="networkTypeName"
        label="所属网络"
      />
      <ElTableColumn
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <span
            :class="$style.tableClick"
            @click="click(scope)"
          >详情</span>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { queryHostsByIds } from '@/api/systemManage/organization'

export default {
  props: {
    serverID: { type: Array, default: Array },
    activeName: { type: String, default: '0' },
  },
  components: {},
  data() {
    return {
      tableData: [],
      isLoadingTable: false,
    }
  },
  computed: {},

  methods: {
    click(scope) {
      this.$router.push({
        path: `/assetsManage/${scope.row.id}/hostInfo`,
      })
    },
    theServer() {
      const a = this.serverID
      queryHostsByIds(a).then((res) => {
        this.tableData = res.data.body
        this.tableData.map(item => {
          this.$set(item, 'Intranet', '')
          this.$set(item, 'Extranet', '')
          item.addresses.map(val => {
            if (val.type === 1) {
              item.Intranet += `${val.ip},`
            } else {
              item.Extranet += `${val.ip},`
            }
          })
        })
      })
    },
  },
  mounted() {
    this.theServer()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
</style>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>
<style lang="scss" module>
.tableClick {
  color: #3273c4;
}

.tableClick:hover {
  cursor: pointer;
}

.title {
  margin: 10px 0;
  font-size: 18px;
}
</style>
