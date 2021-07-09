<!-- 描述 -->
<template>
  <div>
    <div :class="$style.fun">
      <div :class="$style.flex">
        <ElForm
          inline
          size="small"
          :model="value"
        >
          <ElFormItem>
            <ElSelect
              v-model="value.companyIds"
              :class="$style.filterOrg"
              default-first-option
              placeholder="所属单位"
              collapse-tags
              multiple
            >
              <ElOption
                v-for="item in checkedOrgList"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
                disabled
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElSelect
              v-model.lazy.trim="value.serverType"
              clearable
              filterable
              placeholder="服务器类型"
            >
              <ElOption
                v-for="(label, key) in ASSET_USE_SERVER"
                :key="key"
                :value="key"
                :label="label"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElInput
              v-model.lazy.trim="value.keyword"
              clearable
              size="medium"
              placeholder="请输入关键字"
              suffix-icon="i-sousuo"
              :class="$style.type"
            />
          </ElFormItem>
        </ElForm>
      </div>
      <div>
        <ElButton
          plain
          size="small"
          :class="STYLE.primary"
          @click="drawer=true"
        >
          导入
        </ElButton>
        <ElButton
          plain
          size="small"
          :class="STYLE.primary"
          @click="exportExcel"
        >
          导出
        </ElButton>
        <ElButton
          type="primary"
          size="small"
          @click="goToRedact"
        >
          新建
        </ElButton>
      </div>
    </div>
    <Darwer
      :drawer="drawer"
      @handleClose="handleClose"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import Darwer from './darwer'
import STYLE from '@/scss/status.module.scss'
import { ASSET_USE_SERVER, exportServerReport, exportAllServerReport } from '@/api/assets/assetsInfo/server'
import { save } from '@/utils/downloader'
import { ROLES } from '@/enums'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: Object, required: true },
    checkedOrgList: { type: Array, default: () => { return [] } },
  },
  components: {
    Darwer,
  },
  data() {
    return {
      drawer: false,
      serveType: '',
      options: [], // 服务器类型
      search: '', // 搜索内容
    }
  },
  computed: {
    STYLE: () => STYLE,
    ASSET_USE_SERVER: () => ASSET_USE_SERVER,
  },
  watch: {
    checkedOrgList: {
      deep: true,
      handler() {
        this.value.companyIds = this.checkedOrgList.map(o => o.id)
      },
    },
  },
  methods: {
    // leadIn(){
    //   this.drawer=true
    // },
    // 新增
    handleClose() {
      this.drawer = false
      this.$emit('Refresh')
    },
    goToRedact() {
      this.$router.push({
        path: '/assetsInfo/server/add',
      })
    },
    // 导出
    exportExcel() {
      this.$notify.info('正在导出中，请稍后......')
      const fn = this.authFit(ROLES.systemAdmin) ? exportAllServerReport : exportServerReport
      fn(this.value).then((res) => {
        if (res) {
          res.name = decodeURIComponent(res.name)
          save(res)
        }
      })
    },
  },
}
</script>

<style lang="scss" module>

.fun {
  display: flex;
  justify-content: space-between;
}

.filterOrg :global(.el-select__tags .el-tag__close) {
  display: none;
}

.filterOrg :global(.el-select__tags >span>span:nth-child(1) .el-select__tags-text) {
  display: inline-block;
  width: 88px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: normal;
  word-break: keep-all;
}
</style>
<style scoped>
.el-select-dropdown__item {
  padding-right: 50px;
}

</style>
