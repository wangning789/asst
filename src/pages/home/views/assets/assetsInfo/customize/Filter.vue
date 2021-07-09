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
            <ElInput
              v-model.lazy.trim="value.keyword"
              clearable
              size="medium"
              placeholder="请输入编号/名称"
              suffix-icon="i-sousuo"
              :class="$style.type"
            />
          </ElFormItem>
        </ElForm>
      </div>
      <div :class="$style.flexright">
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
      :ci-type-id="ciTypeId"
      :active-name="activeName"
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
import { exportCurrAndNext, exportAll } from '@/api/assets/assetsInfo/customize'
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
    ciTypeId: { type: String, default: () => { return '' } },
    activeName: { type: String, default: () => { return '' } },
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
    handleClose() {
      this.drawer = false
      this.$emit('Refresh')
    },
    // 新增
    goToRedact() {
      this.$router.push({
        path: `/assetsInfo/customize/${this.ciTypeId}/add`,
      })
    },
    // 导出
    exportExcel() {
      this.$notify.info('正在导出中，请稍后......')
      const fn = this.authFit(ROLES.systemAdmin) ? exportAll : exportCurrAndNext
      const params = {
        ...this.value,
        ciTypeId: this.ciTypeId,
      }
      fn(params).then((res) => {
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
.title {
  width: 100%;
}

.title :global(.el-menu-item) {
  font-weight: bold;
  font-family: Microsoft YaHei;
}

.fun {
  display: flex;
  justify-content: space-between;
  margin: 4px 0 0;
}

.severlist {
  width: 100%;
}

.flexright {
  display: flex;
  justify-content: space-around;
  width: 200px;
  height: 32px;
}

.flexright :global(.el-dropdown-link) {
  color: #409eff;
  cursor: pointer;
}

.flex :global(.el-input__inner) {
  width: 190px;
  height: 32px;
}

.flex :global(.el-input__icon) {
  line-height: 32px;
}

.flex :global(.el-icon-arrow-up) {
  line-height: 32px;
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
