<template>
  <div>
    <div :class="$style.serch">
      <div class="from">
        <ElForm
          inline
          size="small"
          :model="value"
        >
          <ElFormItem>
            <ElSelect
              v-model="value.belongCompanyIds"
              :class="$style.filterOrg"
              default-first-option
              multiple
              collapse-tags
              placeholder="所属单位"
            >
              <ElOption
                v-for="item in checkedOrgList"
                :key="item.id"
                disabled
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElSelect
              v-model="value.useStatus"
              placeholder="状态"
              clearable
            >
              <ElOption
                v-for="(val, index) in ASSET_USE_STATUS"
                :key="index"
                :label="val"
                :value="index"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElInput
              v-model.lazy.trim="value.keyword"
              :class="$style.input"
              clearable
              size="medium"
              suffix-icon="i-sousuo"
              placeholder="请输入关键字"
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
          @click="exportExcel()"
        >
          导出
        </ElButton>
        <ElButton
          type="primary"
          size="small"
          @click="$router.push('/assetsInfo/businessSystem/add')"
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
<script>
import Darwer from './darwer'
import {
  exportAll,
  exportCurrent,
} from '@/api/assets/assetsInfo/businessSystem'
import {
  ASSET_USE_STATUS,
} from '@/api/assets/assetsInfo'
import { save } from '@/utils/downloader'
import STYLE from '@/scss/status.module.scss'
import { ROLES } from '@/enums'

export default {
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
    }
  },
  computed: {
    STYLE: () => STYLE,
    ASSET_USE_STATUS: () => ASSET_USE_STATUS,
  },
  watch: {
    checkedOrgList: {
      deep: true,
      handler() {
        this.value.belongCompanyIds = this.checkedOrgList.map(o => o.id)
      },
    },
  },
  methods: {
    handleClose() {
      this.drawer = false
      this.$emit('Refresh')
    },
    exportExcel() {
      this.$notify.info('正在导出中，请稍后......')
      const fn = this.authFit(ROLES.systemAdmin) ? exportAll : exportCurrent
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
.serch {
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
