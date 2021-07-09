<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>
        {{
          be === 'info'
            ? '资产详情'
            : be === 'edit'
              ? '编辑服务器资产'
              : '添加服务器资产'
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
        :disabled="be === 'info'"
      >
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>基础信息</span>
          </div>
          <ElFormItem
            label="服务器名称："
            prop="ciName"
            :rules="{
              required: true,
              message: '请输入服务器名称',
              trigger: 'change',
            }"
          >
            <ElInput
              v-model="form.ciName"
              placeholder="请输入服务器名称"
            />
          </ElFormItem>
          <ElFormItem
            label="资产编号："
            prop="ciCode"
          >
            <ElInput
              v-model="form.ciCode"
              placeholder="请输入资产编号"
            />
          </ElFormItem>
          <ElFormItem
            label="服务器形态："
            prop="ciType"
            :rules="{
              required: true,
              message: '请选择服务器形态',
              trigger: 'change',
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
          <ElRow>
            <ElFormItem
              v-show="form.ciType === 'SYS_asset_type_physical_server'"
              label="厂商："
              prop="vendor"
              :rules="{
                required: form.ciType === 'SYS_asset_type_physical_server',
                message: '请输入厂商信息',
                trigger: 'change',
              }"
            >
              <ElInput
                v-model="form.vendor"
                show-word-limit
                type="textarea"
                maxlength="60"
                size="medium"
                placeholder="请输入厂商信息"
                :class="$style.textarea"
                style="width: 615px;"
              />
            </ElFormItem>
          </ElRow>
          <ElFormItem
            label="用途类型："
            prop="useType"
            :rules="{
              required: true,
              message: '请选择用途类型',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.useType"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in USETYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="资产重要性："
            prop="importance"
            :rules="{
              required: true,
              message: '请选择资产重要性',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.importance"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in IMPORTANCE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="涉密/非密："
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
            label="操作系统："
            prop="osType"
            :rules="{
              required: true,
              message: '请选择操作系统',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.osType"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in OSTYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="操作系统版本号："
            prop="osVersion"
            :rules="{
              required: true,
              message: '请输入操作系统版本号',
              trigger: 'change',
            }"
          >
            <ElInput
              v-model="form.osVersion"
              placeholder="请输入操作系统版本号"
            />
          </ElFormItem>
          <ElFormItem
            label="内核版本："
            prop="kernelVersion"
          >
            <ElInput
              v-model="form.kernelVersion"
              placeholder="请输入内核版本"
            />
          </ElFormItem>
          <ElFormItem
            label="状态："
            prop="ciStatus"
            :rules="{
              required: true,
              message: '请选择状态',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.ciStatus"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in ASSETSTATUS"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="是否接入磐石："
            prop="psConnection"
          >
            <ElSelect
              v-model="form.psConnection"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in PSCONNECTION"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="备注："
            prop="description"
          >
            <ElInput
              v-model="form.description"
              show-word-limit
              type="textarea"
              maxlength="60"
              size="medium"
              placeholder="请输入备注信息"
              :class="$style.textarea"
              style="width: 615px;"
            />
          </ElFormItem>
        </div>
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>网络及部署位置信息</span>
          </div>
          <ElFormItem
            label="部署网络环境："
            prop="networkTypeCode"
            :rules="{
              required: true,
              message: '请选择部署网络环境',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.networkTypeCode"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in IPTYPE"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="所属网络区域："
            prop="networkRegionCode"
          >
            <ElSelect
              v-model="form.networkRegionCode"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in IPREGION"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="托管位置："
            prop="depositLocationCode"
            :rules="{
              required: true,
              message: '请选择托管位置',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.depositLocationCode"
              placeholder="请选择"
              clearable
            >
              <ElOption
                v-for="(val, key) in DEPOSITLOCATION"
                :key="key"
                :label="val"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            v-if="form.depositLocationCode === 'SYS_asset_location_zone_public_cloud' ||
              form.depositLocationCode === 'SYS_asset_location_zone_service_provider_tg' "
            label="托管位置描述："
            prop="extra"
            :rules="{ required: true, message: '请填写位置描述' }"
          >
            <ElInput
              v-model="form.extra"
              placeholder="请输入公有云名称或者服务商名称"
              type="textarea"
              maxlength="60"
              show-word-limit
              style="width: 615px;"
              size="medium"
              :autosize="{ minRows: 2 }"
              :class="$style.textarea"
            />
          </ElFormItem>
          <ElFormItem label="IP地址信息：">
            <div :class="$style.tableWrap">
              <ElTable
                :data="form.addresses"
                border
                :class="$style.table"
              >
                <ElTableColumn
                  prop="typeInString"
                  width="260"
                >
                  <template #header>
                    <span :class="$style.danger">* </span>
                    <span> 内网/互联网</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'addresses[' + scope.$index + '].typeInString'"
                      :class="$style.formItem"
                      :rules="{
                        required: true,
                        message: '请选择网络类型',
                        trigger: 'change',
                      }"
                    >
                      <ElSelect
                        v-model="scope.row.typeInString"
                        placeholder="请选择"
                        @change="changeIpType()"
                      >
                        <ElOption
                          v-for="(val, key) in NETTYPE"
                          :key="key"
                          :label="val"
                          :value="key"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="ip"
                  width="260"
                >
                  <template #header>
                    <span :class="$style.danger">* </span>
                    <span> IP</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'addresses[' + scope.$index + '].ip'"
                      :rules="checkIPRules"
                    >
                      <ElInput
                        v-model="scope.row.ip"
                        placeholder="请输入IP地址"
                        @input="((val)=>{changeIp(scope)})"
                      />
                      <div
                        v-show="form.addresses[scope.$index].showRepeat"
                        ref="repeatError"
                      >
                        <span class="el-form-item__error">同一网络类型下的ip地址不能重复</span>
                      </div>
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="mac"
                  width="260"
                >
                  <template #header>
                    <span> MAC</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'addresses[' + scope.$index + '].mac'"
                      :rules="checkMAC"
                    >
                      <ElInput
                        v-model="scope.row.mac"
                        placeholder="请输入MAC地址"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  v-if="form.addresses.length>1"
                  label="操作"
                  width="100"
                >
                  <template #default="scope">
                    <ElButton
                      class="el-icon-delete"
                      title="删除"
                      @click="delIpInfo(scope)"
                    />
                  </template>
                </ElTableColumn>
              </ElTable>
              <ElButton
                :class="$style.button"
                :disabled="display"
                @click="addIpInfo"
              >
                添加
              </ElButton>
            </div>
          </ElFormItem>
        </div>
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>归属责任信息</span>
          </div>
          <ElFormItem
            label="资产归属单位："
            prop="belongCompanyId"
            :rules="{
              required: true,
              message: '请选择资产归属单位',
              trigger: 'change',
            }"
          >
            <ElSelect
              v-model="form.belongCompanyId"
              placeholder="请选择"
              clearable
              filterable
            >
              <ElOption
                v-for="item in organizations"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="责任人信息：">
            <div :class="$style.tableWrap">
              <ElTable
                :data="form.dutyPersons"
                border
                :class="$style.table"
              >
                <ElTableColumn
                  prop="name"
                  width="120px"
                >
                  <template #header>
                    <span>姓名</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'dutyPersons[' + scope.$index + '].name'"
                    >
                      <ElInput
                        v-model="scope.row.name"
                        placeholder="请填写姓名"
                        style="width: 100px;"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="tel"
                  width="200px"
                >
                  <template #header>
                    <span>联系电话</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'dutyPersons[' + scope.$index + '].tel'"
                      :rules="checkPhone"
                    >
                      <ElInput
                        v-model="scope.row.tel"
                        placeholder="请填写联系电话"
                        style="width: 180px;"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>

                <ElTableColumn
                  prop="mail"
                  width="240"
                >
                  <template #header>
                    <span>邮箱</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'dutyPersons[' + scope.$index + '].mail'"
                      :rules="checkMail"
                    >
                      <ElInput
                        v-model="scope.row.mail"
                        placeholder="请填写邮箱"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="description"
                  width="240"
                >
                  <template #header>
                    <span>备注</span>
                  </template>
                  <template #default="scope">
                    <ElFormItem
                      :prop="'dutyPersons[' + scope.$index + '].description'"
                    >
                      <ElInput
                        v-model="scope.row.description"
                        placeholder="请填写备注"
                      />
                    </ElFormItem>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  width="100"
                >
                  <template #default="scope">
                    <ElButton
                      class="el-icon-delete"
                      title="删除"
                      @click="delDutyPerson(scope)"
                    />
                  </template>
                </ElTableColumn>
              </ElTable>
              <ElButton
                :class="$style.button"
                :disabled="display"
                @click="addDutyPersons"
              >
                添加
              </ElButton>
            </div>
          </ElFormItem>
          <ElFormItem
            label="填报单位："
            prop="recordCompanyId"
          >
            <ElSelect
              v-model="form.recordCompanyId"
              placeholder="请选择"
              clearable
              filterable
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
            :rules="checkPhone"
          >
            <ElInput
              v-model="form.telephone"
              placeholder="请输入联系方式"
            />
          </ElFormItem>
          <div
            v-show="be !== 'info'"
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
      </ElForm>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { TITLE } from './code'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'

import { NETTYPE, PSCONNECTION } from '../enums'
import { queryHost, createNewHost, updateHost } from '@/api/assetsManage/host'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { User } from '@/api/authServer/user'
import { phone, email, isIpv4OrIPv6, isIPv6Equals, checkIP, checkIPv6, macId } from '@/functions/validators'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'
import getCode from '@/enums/code'
const HOSTTYPE = getCode('1', 'SYS_asset_type')
const DEPOSITLOCATION = getCode('1', 'SYS_asset_location_zone')
const IPTYPE = getCode('1', 'SYS_asset_network_type')
const IPREGION = getCode('1', 'SYS_asset_network_region')
const OSTYPE = getCode('1', 'SYS_asset_os_type')
const USETYPE = getCode('1', 'SYS_asset_use_type')
const IMPORTANCE = getCode('1', 'SYS_asset_importance')
const SECRETLEVEL = getCode('1', 'SYS_asset_srl')
const ASSETSTATUS = getCode('1', 'SYS_ASSET_STATUS')
const info = local.get(STORAGE.me, decode) as User
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: {
    ElTable,
    ElTableColumn,
  },
  data() {
    return {
      form: {
        recordPerson: info.aliasName || '',
        telephone: info.cellPhone || '',
        addresses: [{
          type: '',
          ip: '',
          showRepeat: false,
        }],
        dutyPersons: [],
      },
      display: false,
      organizations: [],
      showRepeatIndex: [],
      ipInfoValidate: true,
    }
  },
  computed: {
    TITLE: () => TITLE,
    HOSTTYPE: () => HOSTTYPE.value || [],
    IMPORTANCE: () => IMPORTANCE.value || [],
    DEPOSITLOCATION: () => DEPOSITLOCATION.value || [],
    IPTYPE: () => IPTYPE.value || [],
    IPREGION: () => IPREGION.value || [],
    OSTYPE: () => OSTYPE.value || [],
    USETYPE: () => USETYPE.value || [],
    SECRETLEVEL: () => SECRETLEVEL.value || [],
    ASSETSTATUS: () => ASSETSTATUS.value || [],
    NETTYPE: () => NETTYPE,
    PSCONNECTION: () => PSCONNECTION,
    checkPhone() {
      return {
        required: false,
        trigger: 'change',
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
          } else {
            callback()
          }
        },
      }
    },
    checkMail() {
      return {
        required: false,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              email(value)
              callback()
            } catch (error) {
              return callback(error)
            }
          } else {
            callback()
          }
        },
      }
    },

    checkIPRules() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              isIpv4OrIPv6(value)
              callback()
            } catch (error) {
              callback(error)
            }
          } else {
            return callback(new Error('请输入IP地址 '))
          }
        },
      }
    },

    checkMAC() {
      return {
        required: false,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              macId(value)
              callback()
            } catch (error) {
              return callback(error)
            }
          } else {
            callback()
          }
        },
      }
    },

  },
  methods: {
    changeIpType() {
      this.changeIp()
    },
    changeIp() {
      const addresses = this.form.addresses
      const repeatIndex = []
      this.ipInfoValidate = true
      if (addresses.length > 1) {
        for (let i = 0; i < addresses.length; i++) {
          this.form.addresses[i].showRepeat = false
          for (let j = i + 1; j < addresses.length; j++) {
            if (addresses[i].typeInString && addresses[i].ip) {
              if (addresses[i].typeInString === addresses[j].typeInString) {
                if ((checkIPv6(addresses[i].ip)) &&
                    (isIPv6Equals(addresses[i].ip, addresses[j].ip))) {
                  repeatIndex.push(i, j)
                } else if (((checkIP(addresses[i].ip)) &&
                    (addresses[i].ip === addresses[j].ip))) {
                  repeatIndex.push(i, j)
                }
              }
            }
          }
        }
        if (repeatIndex.length) {
          this.showRepeatIndex = Array.from(new Set(repeatIndex))
          this.showRepeatIndex.forEach((item) => {
            this.form.addresses[item].showRepeat = true
            this.ipInfoValidate = false
          })
        }
      } else if (addresses.length === 1) {
        this.form.addresses[0].showRepeat = false
      }
    },
    getHostInfo() {
      const id = this.route.params.id || ''
      if (id) {
        const ids = []
        ids.push(id)
        queryHost(ids).then((res) => {
          if (res && res.data && res.data.body && res.data.body.length) {
            this.form = res.data.body.filter((item) => {
              return item.id === id
            })[0]
          }
        })
      }
    },
    addIpInfo(this: any) {
      const obj = {
        type: '',
        ip: '',
        showRepeat: false,
      }
      this.form.addresses.push(obj)
    },
    delIpInfo(obj) {
      const num = obj.$index
      this.form.addresses = this.form.addresses.filter((item, index) => {
        if (index === num) {
          item = null
        }
        return !!item
      })
      this.changeIp()
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
    save(this: any) {
      const data = this.form
      if (this.ipInfoValidate) {
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            ;(this.be === 'add' ? createNewHost : updateHost)(data).then(() => {
              this.$notify.success('操作成功')
              this.cancel()
            })
          }
        })
      }
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
    this.fetchOrganization()
    this.getHostInfo()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
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

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.tableWrap {
  display: flex;

  .button {
    height: 40px;
    margin-left: 10px;
  }
}

.tableWrap :global(.el-table__header) {
  tr,
  th {
    padding: 0;
    background: $colorTheme9;
  }
}

.saveButton {
  display: flex;
  justify-content: center;
  margin-bottom: $gapNormal;
}

.textarea {
  width: 100%;
}

.danger {
  color: $colorDanger !important;
}

</style>
