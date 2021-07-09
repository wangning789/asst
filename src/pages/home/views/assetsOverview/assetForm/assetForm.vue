<!-- 描述 -->
<template>
  <div>
    <div :class="$style.box">
      <ElButton
        type="primary"
        size="small"
        :class="$style.button"
        @click="exportHost()"
      >
        导出
      </ElButton>
    </div>
    <div class="table">
      <div>
        <ElTable
          :header-cell-style="{background:'#FBECEA',color:'#606266'}"
          :data="asset"
          stripe
          border
          style="width: 100%;"
        >
          <ElTableColumn
            align="center"
            prop="belongCompanyName"
          />
          <ElTableColumn
            align="center"
            prop="allTypeAssetCount"
            label="资产总数"
          />
          <ElTableColumn
            align="center"
            prop="businessAssetCount"
            label="应用系统"
          />
          <ElTableColumn
            align="center"
            prop="hostAssetCount"
            label="服务器"
          />
          <ElTableColumn
            align="center"
            prop="securityAssetCount"
            label="安全产品"
          />
        </ElTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { assetStatement, overView } from '@/api/assetsOverview/assetsOverview'
import { save } from '@/utils/downloader'
export default {
  props: {},
  components: {},
  data() {
    return {
      asset: [],
      filterForm: {},
    }
  },
  computed: {
    exportTable() {
      return overView
    },
  },
  watch: {},
  methods: {
    exportHost() {
      this.$notify.info('正在导出中，请稍后......')
      this.exportTable(this.filterForm).then((res) => {
        if (res) {
          // 要在此处判断一下是否取到值，ie浏览器在downloader的doemload方法中没有返回值
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
    assetStatements() {
      assetStatement().then((res) => {
        if (res.data.body) {
          this.asset = res.data.body
        }
      })
    },
  },
  mounted() {
    this.assetStatements()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>
<style lang="scss" module>
.table {
  display: flex;
  justify-content: center;

  div {
    width: 90%;
  }
}

.box {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
}
</style>
