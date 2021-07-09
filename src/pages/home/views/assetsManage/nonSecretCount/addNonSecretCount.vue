<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>
        {{
          be === 'add'
            ? '添加统计信息'
            : be === 'edit'
              ? '编辑统计信息'
              : be === 'modify'
                ? '查看统计信息'
                : ''
        }}
      </h3>
    </div>
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        label-width="140px"
        inline
        :model="form"
        :disabled="be === 'modify'"
      >
        <div :class="$style.region">
          <div>
            <ElFormItem
              label="单位名称"
              prop="companyName"
              :rules="{
                required: true,
                message: '请输入单位名称',
              }"
            >
              <ElInput
                v-model="form.companyName"
                placeholder="请输入单位名称"
              />
            </ElFormItem>
            <ElFormItem
              label="单位级别"
              prop="companyLevel"
            >
              <ElInput
                v-model="form.companyLevel"
                placeholder="请输入单位级别"
              />
            </ElFormItem>
            <ElFormItem
              label="填报单位"
              prop="fillCompanyId"
              :rules="{
                required: true,
                message: '请输入填报单位',
              }"
            >
              <ElSelect
                v-model="form.fillCompanyId"
                placeholder="请选择"
                filterable
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
              label="填报人"
              prop="fillUser"
            >
              <ElInput
                v-model="form.fillUser"
                placeholder="请输入填报人"
              />
            </ElFormItem>
            <ElFormItem
              label="联系方式"
              prop="fillUserTel"
              :rules="form.fillUserTel ? checkPhone : {}"
            >
              <ElInput
                v-model="form.fillUserTel"
                placeholder="请输入联系方式"
              />
            </ElFormItem>
          </div>
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>服务器数量</span>
            </div>
            <ElFormItem
              label="当前数量"
              prop="serverCurrNum"
              :rules="[{ validator: checkNumber, trigger: 'blur' }]"
            >
              <ElInput
                v-model="form.serverCurrNum"
                placeholder="请输入当前数量"
              />
            </ElFormItem>
            <ElFormItem
              label="应替数量"
              prop="serverReNum"
              :rules="[{ validator: checkNumber, trigger: 'blur' }]"
            >
              <ElInput
                v-model="form.serverReNum"
                placeholder="请输入应替数量"
              />
            </ElFormItem>
            <ElFormItem
              label="2020年替换量"
              prop="serverOneReNum"
              :rules="[{ validator: checkNumber, trigger: 'blur' }]"
            >
              <ElInput
                v-model="form.serverOneReNum"
                placeholder="请输入2020年替换量"
              />
            </ElFormItem>
            <ElFormItem
              label="2021年替换量"
              prop="serverTwoReNum"
              :rules="[{ validator: checkNumber, trigger: 'blur' }]"
            >
              <ElInput
                v-model="form.serverTwoReNum"
                placeholder="请输入2021年替换量"
              />
            </ElFormItem>
            <ElFormItem
              label="2022年替换量"
              prop="serverThreeReNum"
              :rules="[{ validator: checkNumber, trigger: 'blur' }]"
            >
              <ElInput
                v-model="form.serverThreeReNum"
                placeholder="请输入2022年替换量"
              />
            </ElFormItem>
          </div>
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>终端数量</span>
            </div>

            <ElFormItem
              label="当前数量"
              prop="terminalCurrNum"
              :rules="[{ validator: checkNumber, trigger: 'blur' }]"
            >
              <ElInput
                v-model="form.terminalCurrNum"
                placeholder="请输入当前数量"
              />
            </ElFormItem>

            <div>
              <div style="margin: 15px 30px;">
                <span>单机</span>
              </div>
              <ElFormItem
                label="当前数量"
                prop="terminalSingleCurrNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalSingleCurrNum"
                  placeholder="请输入当前数量"
                />
              </ElFormItem>
              <ElFormItem
                label="替换数量"
                prop="terminalSingleReNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalSingleReNum"
                  placeholder="请输入替换数量"
                />
              </ElFormItem>
            </div>
            <div>
              <div style="margin: 15px 30px;">
                <span>联网终端</span>
              </div>
              <ElFormItem
                label="当前数量"
                prop="terminalConnCurrNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalConnCurrNum"
                  placeholder="请输入当前数量"
                />
              </ElFormItem>
              <ElFormItem
                label="应替换数量"
                prop="terminalConnReNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalConnReNum"
                  placeholder="请输入替换数量"
                />
              </ElFormItem>
              <ElFormItem
                label="2020年替换量"
                prop="terminalConnOneReNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalConnOneReNum"
                  placeholder="请输入2020年替换量"
                />
              </ElFormItem>
              <ElFormItem
                label="2021年替换量"
                prop="terminalConnTwoReNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalConnTwoReNum"
                  placeholder="请输入2021年替换量"
                />
              </ElFormItem>
              <ElFormItem
                label="2022年替换量"
                prop="terminalConnThreeReNum"
                :rules="[{ validator: checkNumber, trigger: 'blur' }]"
              >
                <ElInput
                  v-model="form.terminalConnThreeReNum"
                  placeholder="请输入2022年替换量"
                />
              </ElFormItem>
            </div>
            <div
              v-if="be !== 'modify'"
              :class="$style.saveButton"
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
        </div>
      </ElForm>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { query, modify, addSecretCount } from '@/api/assetsManage/secretCount'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { phone } from '@/functions/validators'

export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: {},
  data() {
    return {
      form: {
        srType: '1',
      },
      display: false,
      organizations: [],
    }
  },
  computed: {
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
    checkNumber(rule, value, callback) {
      const number = /\w{10,}/
      const age = /^[+]{0,1}(\d+)$/
      if (!age.test(value) && value !== undefined && value !== '') {
        callback(new Error('请输入正整数'))
      } else if (number.test(value) && value !== undefined && value !== '') {
        callback(new Error('超过输入最大限制'))
      } else {
        callback()
      }
    },
    save(this: any) {
      const data = this.form
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          ;(this.be === 'add' ? addSecretCount : modify)(data).then(() => {
            this.$notify.success('操作成功')
            this.cancel()
          })
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/assetsManage' })
    },
    getHostInfo() {
      const id = this.route.params.id || ''
      if (id) {
        query(id).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
          }
        })
      }
    },

    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
  },
  created() {
    this.getHostInfo()
    this.fetchOrganization()
  },
}
</script>

<style lang="scss" module>
.container {
  padding: 0 30px;
}

.subTitle {
  height: $gapNormal;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: $medium;
  line-height: $gapNormal;

  .subTitleFlag {
    display: inline-block;
    width: 4px;
    height: 12px;
    margin-right: 10px;
    background-color: #f8902a;
  }
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
  height: 40px;
  margin-left: 10px;
}

.saveButton {
  display: flex;
  justify-content: center;
  margin-bottom: $gapNormal;
}
</style>
