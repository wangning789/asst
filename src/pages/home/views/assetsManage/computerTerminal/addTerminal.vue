
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
            label="计算机终端类型："
            prop="type"
            :rules="{ required: true, message: '请输入计算机终端类型' }"
          >
            <ElInput
              v-model="form.type"
              placeholder="请输入计算机终端类型"
            />
          </ElFormItem>
          <ElFormItem
            label="终端品牌："
            prop="brand"
          >
            <ElInput
              v-model="form.brand"
              placeholder="请输入终端品牌"
            />
          </ElFormItem>
          <ElFormItem
            label="终端型号："
            prop="model"
          >
            <ElInput
              v-model="form.model"
              placeholder="请输入终端型号"
            />
          </ElFormItem>
          <ElFormItem
            label="终端密级："
            prop="secretLevel"
          >
            <ElSelect
              v-model="form.secretLevel"
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
            label="是否联网："
            prop="isInternet"
          >
            <ElSelect
              v-model="form.isInternet"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in ISINTERNET"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="设备用途："
            prop="useType"
          >
            <ElInput
              v-model="form.useType"
              placeholder="请输入设备用途"
            />
          </ElFormItem>
          <ElFormItem
            label="已安装的操作系统："
            prop="os"
          >
            <ElInput
              v-model="form.os"
              placeholder="请输入已安装的操作系统"
            />
          </ElFormItem>
          <ElFormItem
            label="数量："
            prop="count"
          >
            <ElInput
              v-model="form.count"
              placeholder="请输入数字"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </ElFormItem>
          <ElRow>
            <ElFormItem
              label="备注："
              prop="comment"
            >
              <ElInput
                v-model="form.comment"
                show-word-limit
                type="textarea"
                maxlength="60"
                placeholder="请输入备注"
                style="width: 615px;"
              />
            </ElFormItem>
          </ElRow>
          <ElFormItem
            label="资产归属单位："
            prop="belongCompanyId"
            :rules="{
              required: true,
              message: '请选择资产归属单位',
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
          <ElFormItem
            label="填报人："
            prop="recordPerson"
          >
            <ElInput
              v-model="form.recordPerson"
              placeholder="请输入填报人"
            />
          </ElFormItem>
          <ElFormItem
            label="联系方式："
            prop="telephone"
            :rules="be !== 'info' && form.telephone ? checkPhone : {}"
          >
            <ElInput
              v-model="form.telephone"
              placeholder="请输入联系方式"
            />
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
  queryTerminal,
  createTerminal,
  updateTerminal,
} from '@/api/assetsManage/computerTerminal'
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
    checkPhone() {
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
    getTerminalInfo() {
      const id = this.route.params.id || ''
      if (id) {
        const ids = []
        ids.push(id)
        queryTerminal(ids).then((res) => {
          if (res && res.data && res.data.body) {
            this.form =
              (res.data.body.length &&
                res.data.body.filter((item) => {
                  return item.id === id
                })[0]) ||
              {}
          }
        })
      }
    },
    save(this: any) {
      const data = this.form
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          ;(data.id ? updateTerminal : createTerminal)(data).then(() => {
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
    this.getTerminalInfo()
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
