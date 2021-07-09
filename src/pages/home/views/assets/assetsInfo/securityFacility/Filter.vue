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
              v-model="value.form"
              default-first-option
              placeholder="资产形态"
              clearable
              filterable
            >
              <ElOption
                v-for="(label, key) in ASSET_FORM"
                :key="key"
                :value="key"
                :label="label"
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
                v-for="(val, key) in ASSET_USE_STATUS"
                :key="key"
                :value="key"
                :label="val"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem>
            <ElInput
              v-model.lazy.trim="value.keyword"
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
          @click="$router.push('/assetsInfo/securityFacility/add')"
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
import { downloadAssets, downloadAllAssets } from '@/api/assets/assetsInfo/securityFacility'
import {
  ASSET_USE_STATUS, ASSET_FORM,
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
    ASSET_FORM: () => ASSET_FORM,
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
    exportExcel() {
      this.$notify.info('正在导出中，请稍后......')
      const fn = this.authFit(ROLES.systemAdmin) ? downloadAllAssets : downloadAssets
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
