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
        :disabled="be==='inof'"
      >
        <div :class="$style.region">
          <ElFormItem
            label="品牌："
            prop="brand"
            :rules="{
              required: true,
              message: '请选择资产归属单位',
            }"
          >
            <ElInput
              v-model="form.brand"
              placeholder="请输入设备品牌"
            />
          </ElFormItem>
          <ElFormItem
            label="设备型号："
            prop="modelNumber"
          >
            <ElInput
              v-model="form.modelNumber"
              placeholder="请输入设备型号"
            />
          </ElFormItem>
          <ElFormItem
            label="填报人："
            prop="fillUser"
          >
            <ElInput
              v-model="form.fillUser"
              placeholder="请输入联系人"
            />
          </ElFormItem>
          <ElFormItem
            label="填报人号码："
            prop="fillUserTel"
            :rules="form.fillUserTel ? checkPhone : {}"
          >
            <ElInput
              v-model="form.fillUserTel"
              placeholder="请输入联系号码"
            />
          </ElFormItem>
          <ElFormItem
            label="数量："
            prop="quantity"
          >
            <ElInput
              v-model="form.quantity"
              placeholder="请输入设备数量"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </ElFormItem>
          <ElRow>
            <ElFormItem
              label="备注："
              prop="remark"
            >
              <ElInput
                v-model="form.remark"
                show-word-limit
                type="textarea"
                maxlength="60"
                placeholder="请输入设备备注"
                style="width: 615px;"
              />
            </ElFormItem>
          </ElRow>
          <ElFormItem
            label="设备类型："
            prop="ciType"
            :rules="{
              required: true,
              message: '请输入设备类型',
            }"
          >
            <ElSelect
              v-model="form.ciType"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in HOSTTYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="设备密级："
            prop="secretRelatedLevel"
          >
            <ElSelect
              v-model="form.secretRelatedLevel"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in DENSE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="是否联网："
            prop="importanceInString"
          >
            <ElSelect
              v-model="form.connected"
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
        </div>
        <ElFormItem>
          <div :class="$style.button">
            <ElButton
              type="primary"
              @click="submitForm('form')"
            >
              保存
            </ElButton>
            <ElButton
              @click="cancel"
            >
              取消
            </ElButton>
          </div>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { addPeripheral, queryQetails, editingPeripherals } from '@/api/assetsManage/computerPeripherals'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import getCode from '@/enums/code'
import { phone } from '@/functions/validators'
const ISINTERNET = getCode('1', 'SYS_asset_op_dev_conn')
const DENSE = getCode('1', 'SYS_asset_srl')
const HOSTTYPE = getCode('1', 'SYS_asset_op_dev_type')

export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: {

  },
  data() {
    return {
      form: {},
      display: false,
      organizations: [],
    }
  },
  computed: {
    HOSTTYPE: () => HOSTTYPE.value || [],
    ISINTERNET: () => ISINTERNET.value || [],
    DENSE: () => DENSE.value || [],
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.be === 'add') {
            this.addSave()
          } else {
            this.editSave()
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.back()
    },
    editSave() {
      editingPeripherals(this.form).then(res => {
        if (res.status === 200) {
          this.$notify.success('保存成功')
          this.$router.back()
        }
      }).catch(err => {
        if (err === 201) {
          this.$notify.error('保存失败')
        }
      })
    },

    addSave() {
      addPeripheral(this.form)
        .then((res) => {
          if (res.status === 200) {
            this.$notify.success('添加成功')
            this.$router.back()
          }
        })
        .catch((err) => {
          if (err === 201) {
            this.$notify.error('添加失败')
          }
        })
    },

    getHostInfo() {
      const id = this.route.params.id || ''
      if (id) {
        const ids = []
        ids.push(id)
        queryQetails(id).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
          }
        })
      }
    },
    delIpInfo(obj) {
      const index = obj.$index
      this.form.addresses.splice(index, 1)
    },
    addDutyPersons(this: any) {
      const obj = {
        name: '',
        tel: '',
        mail: '',
        description: '',
      }
      this.form.dutyPersons.push(obj)
    },
    delDutyPerson(obj) {
      const index = obj.$index
      this.form.dutyPersons.splice(index, 1)
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
