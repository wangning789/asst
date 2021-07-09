<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>{{ be==='info'? '资产详情':be==='edit'? '编辑资产':'添加资产' }}</h3>
    </div>
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        label-width="140px"
        inline
        :model="form"
        :disabled="be === 'info'"
      >
        <div :class="$style.region">
          <ElFormItem
            label="品牌："
            prop="brandName"
          >
            <ElInput
              v-model="form.brandName"
              placeholder="请输入品牌"
            />
          </ElFormItem>
          <ElFormItem
            label="型号："
            prop="modelNumber"
          >
            <ElInput
              v-model="form.modelNumber"
              placeholder="请输入型号"
            />
          </ElFormItem>
          <ElFormItem
            label="设备密级："
            prop="classifyId"
          >
            <ElSelect
              v-model="form.classifyId"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in SECRETLEVEL"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="配置："
            prop="detailConfig"
          >
            <ElInput
              v-model="form.detailConfig"
              placeholder="请输入配置"
            />
          </ElFormItem>
          <ElFormItem
            label="已用空间："
            prop="usedSpace"
          >
            <ElInput
              v-model="form.usedSpace"
              placeholder="请输入数字"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </ElFormItem>
          <ElFormItem
            label="数量："
            prop="amount"
          >
            <ElInput
              v-model="form.amount"
              placeholder="请输入数字"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </ElFormItem>
          <ElRow>
            <ElFormItem
              label="备注："
              prop="description"
            >
              <ElInput
                v-model="form.description"
                show-word-limit
                type="textarea"
                maxlength="60"
                placeholder="请输入备注"
                style="width: 615px;"
              />
            </ElFormItem>
          </ElRow>
          <ElFormItem
            label="填报人："
            prop="fillUser"
          >
            <ElInput
              v-model="form.fillUser"
              placeholder="请输入填报人"
            />
          </ElFormItem>
          <ElFormItem
            label="联系方式："
            prop="fillUserTel"
            :rules="form.fillUserTel ? checkFillUserTel : {}"
          >
            <ElInput
              v-model="form.fillUserTel"
              placeholder="请输入联系方式"
            />
          </ElFormItem>
          <ElFormItem
            label="所属单位："
            prop="belongCompanyId"
            :rules="{
              required: true,
              message: '请选择所属单位',
            }"
          >
            <ElSelect
              v-model="form.belongCompanyId"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="item in organizations"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
          <div
            v-show="be !== 'info'"
            :class="$style.button"
          >
            <ElButton
              type="primary"
              @click="save"
            >
              保存
            </ElButton>
            <ElButton @click="cancel">
              取消
            </ElButton>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { ISINTERNET } from '../enums'
import {
  queryStorage,
  createStorage,
  updateStorage,
} from '@/api/assetsManage/storage'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { phone } from '@/functions/validators'
import getCode from '@/enums/code'
const SECRETLEVEL = getCode('1', 'SYS_asset_srl')

export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  data() {
    return {
      form: {},
      organizations: [],
    }
  },
  computed: {
    ISINTERNET: () => ISINTERNET,
    SECRETLEVEL: () => SECRETLEVEL.value || [],
    checkFillUserTel() {
      return {
        required: false,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              phone(value)
              callback()
            } catch (error) {
              callback(error)
            }
          }
        },
      }
    },
  },
  methods: {
    getStorageInfo() {
      const id = this.route.params.id || ''
      if (id) {
        queryStorage(id).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body || {}
          }
        })
      }
    },
    save(this: any) {
      const data = this.form
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          ;(data.id ? updateStorage : createStorage)(data).then(() => {
            this.$notify.success('操作成功')
            this.cancel()
          })
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/assetsManage' })
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
  },

  created() {
    this.getStorageInfo()
    this.fetchOrganization()
  },
}
</script>

<style lang="scss" module>
.container {
  padding: 0 30px;
}

.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.region {
  margin-bottom: 20px;
  margin-left: 0 auto;
  padding-top: $gapNormal;
}

.button {
  display: flex;
  justify-content: center;
  margin-bottom: $gapNormal;
}
</style>
