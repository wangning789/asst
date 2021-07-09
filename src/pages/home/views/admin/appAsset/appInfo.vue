<!-- 系统日志详情 -->
<template>
  <div :class="'el-card ' + $style.wrapper">
    <IChooser
      :fetch="fetch"
      :args="[route.params.id]"
    >
      <template #success="{ data: { data = {}}}">
        <h4>系统资产详情</h4>
        <ElRow>
          <ElCol :span="8">
            <label>应用名称：</label>
            <span>{{ data.body.ciName }}</span>
          </ElCol>

          <ElCol :span="8">
            <label>托管位置：</label>
            <span>{{ data.body.cloudPlatform }}</span>
          </ElCol>

          <ElCol :span="8">
            <label>访问域名：</label>
            <span>{{ data.body.domainName }}</span>
          </ElCol>

          <ElCol :span="8">
            <label>服务器台数：</label>
            <span>{{ data.body.assetNum }}</span>
          </ElCol>
          <ElCol :span="8">
            <label>描述：</label>
            <span :class="$style.des">{{ data.body.describe }}</span>
          </ElCol>
        </ElRow>
        <h4>服务器信息</h4>

        <ElTable
          v-if="data.body.assetList.length>0"
          :data="data.body.assetList"
          :row-class-name="tableRowClassName"
        >
          <ElTableColumn
            prop="ciName"
            label="服务器名称"
          />
          <ElTableColumn
            prop="ipAddress"
            label="服务器IP"
          />
          <ElTableColumn
            prop="os"
            label="操作系统"
          />
        </ElTable>
      </template>
    </IChooser>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import IChooser from '@com/ChooserAsyncFunctional'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'

import { infoS } from '@/api/servicePlatform/assetsController'

export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { ElTable, ElTableColumn, IChooser },
  computed: {

  },
  methods: {
    // 请求第二个列表
    fetch: infoS,
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      }
      return ''
    },
  },

}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.wrapper {
  h4 {
    margin: $gapNormal / 2 0;
    color: $colorTextMain;
    font-size: $larger;

    &:first-of-type {
      margin-top: 0;
    }
  }

  .mar {
    margin-bottom: 100px;
  }

  label {
    display: inline-block;
    width: 125px - $gapNormal / 2;
    margin: $gapNormal / 2 0;
    padding-right: $gapNormal / 2;
    text-align: right;
  }
}

.des {
  display: inline-block;
  width: calc(100% - 130px);
  margin-top: $gapNormal / 2;
  line-height: 1.5em;
  vertical-align: top;
}
</style>
