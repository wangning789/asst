<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>{{ be==='info'? '资产详情':be==='edit'? '编辑安全产品资产':'添加安全产品资产' }}</h3>
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
          <ElRow :gutter="GAP">
            <ElCol :span="24">
              <div :class="$style.subTitle">
                <i :class="$style.subTitleFlag" />
                <span>基础信息</span>
              </div>
              <ElFormItem
                label="安全产品类型："
                prop="ciType"
                :rules="{
                  required: true,
                  message: '请输入安全产品类型',
                }"
              >
                <ElSelect
                  v-model="form.ciType"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in CITYPE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                label="有无管理端："
                prop="haveManageDepartment"
                :rules="{ required: true, message: '请选择有无管理端' }"
              >
                <ElSelect
                  v-model="form.haveManageDepartment"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in ISMANAGE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                label="安全产品名称："
                prop="ciName"
                :rules="{
                  required: true,
                  message: '请输入安全产品名称',
                }"
              >
                <ElInput
                  v-model="form.ciName"
                  placeholder="请输入安全产品名称"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="安全产品形态："
                prop="form"
              >
                <ElSelect
                  v-model="form.form"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in CIFORM"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                label="序列号："
                prop="serial"
              >
                <ElInput
                  v-model="form.serial"
                  placeholder="请输入序列号"
                />
              </ElFormItem>
              <ElFormItem
                label="厂商："
                prop="factory"
              >
                <ElSelect
                  v-model="form.factory"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in FACTORY"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="硬件版本："
                prop="hardwareVersion"
              >
                <ElInput
                  v-model="form.hardwareVersion"
                  placeholder="请输入硬件版本"
                />
              </ElFormItem>
              <ElFormItem
                label="软件版本："
                prop="softwareVersion"
              >
                <ElInput
                  v-model="form.softwareVersion"
                  placeholder="请输入软件版本"
                />
              </ElFormItem>
              <ElFormItem
                label="资产重要性："
                prop="importance"
              >
                <ElSelect
                  v-model="form.importance"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in IMPORTANT"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>

            <ElCol :span="24">
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
            </ElCol>

            <ElCol :span="24">
              <div :class="$style.subTitle">
                <i :class="$style.subTitleFlag" />
                <span>网络及部署位置信息</span>
              </div>
              <ElFormItem
                label="部署模式："
                prop="deployMode"
              >
                <ElSelect
                  v-model="form.deployMode"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in DEPLOYMODE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                label="管理地址："
                prop="manageAddr"
                :rules="checkLength"
              >
                <ElInput
                  v-model="form.manageAddr"
                  placeholder="请输入管理地址"
                />
              </ElFormItem>
              <ElFormItem
                label="部署网络环境："
                prop="deployEnvir"
                :rules="{
                  required: true,
                  message: '请选择部署网络环境',
                }"
              >
                <ElSelect
                  v-model="form.deployEnvir"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in DEPLOY"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="所属网络区域："
                prop="networkRegionId"
              >
                <ElSelect
                  v-model="form.networkRegionId"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in REGION"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                label="托管位置："
                prop="locationZoneId"
                :rules="{ required: true, message: '请选择托管位置' }"
              >
                <ElSelect
                  v-model="form.locationZoneId"
                  placeholder="请选择"
                  clearable
                  :rules="{
                    required: true,
                    message: '请选择托管位置',
                  }"
                >
                  <ElOption
                    v-for="(val, key) in ZONE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                v-if="form.locationZoneId === 'SYS_asset_location_zone_public_cloud' ||
                  form.locationZoneId === 'SYS_asset_location_zone_service_provider_tg' "
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
            </ElCol>
            <ElCol :span="24">
              <div :class="$style.region">
                <ElFormItem label="网口：">
                  <div :class="$style.tableWrap">
                    <ElTable
                      :data="form.ipMacList"
                      border
                      :class="$style.table"
                    >
                      <ElTableColumn
                        prop="typeInString"
                        width="260"
                      >
                        <template #header>
                          <span>内网/互联网</span>
                        </template>
                        <template #default="scope">
                          <ElFormItem
                            :prop="'ipMacList[' + scope.$index + '].typeInString'"
                            :rules="{
                              required: true,
                              message: '请选择网络类型',
                            }"
                          >
                            <ElSelect
                              v-model="scope.row.typeInString"
                              placeholder="请选择"
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
                          <span>IP</span>
                        </template>
                        <template #default="scope">
                          <ElFormItem
                            :prop="'ipMacList[' + scope.$index + '].ip'"
                            :rules="checkIP"
                          >
                            <ElInput
                              v-model="scope.row.ip"
                              placeholder="请输入IP地址"
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
                            :class="$style.mgl"
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
            </ElCol>

            <ElCol :span="24">
              <div :class="$style.subTitle">
                <i :class="$style.subTitleFlag" />
                <span>归属责任信息</span>
              </div>
              <ElFormItem
                label="归属单位："
                prop="belongCompanyId"
                :rules="{
                  required: true,
                  message: '请选择归属单位',
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
            </ElCol>
            <!-- ip地址 -->
            <ElCol
              :span="24"
              :class="$style.inputGroup"
            >
              <div :class="$style.region">
                <ElFormItem label="责任人信息">
                  <div :class="$style.tableWrap">
                    <ElTable
                      :data="form.dutyPersonList"
                      border
                      :class="$style.table"
                    >
                      <ElTableColumn
                        width="120px"
                        prop="name"
                      >
                        <template #header>
                          <span>姓名</span>
                        </template>
                        <template #default="scope">
                          <ElFormItem
                            :prop="'dutyPersonList[' + scope.$index + '].name'"
                            :rules="{
                              required: true,
                              message: '请输入填报人姓名',
                            }"
                          >
                            <ElInput
                              v-model="scope.row.name"
                              placeholder="请输入姓名"
                              style="width: 100px;"
                            />
                          </ElFormItem>
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        width="200px"
                        prop="tel"
                      >
                        <template #header>
                          <span>联系电话</span>
                        </template>
                        <template #default="scope">
                          <ElFormItem
                            :prop="'dutyPersonList[' + scope.$index + '].tel'"
                            :rules="checkPhone"
                          >
                            <ElInput
                              v-model="scope.row.tel"
                              placeholder="请输入联系电话"
                              style="width: 180px;"
                            />
                          </ElFormItem>
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        width="240"
                        prop="mail"
                      >
                        <template #header>
                          <span>邮箱</span>
                        </template>
                        <template #default="scope">
                          <ElFormItem
                            :prop="'dutyPersonList[' + scope.$index + '].mail'"
                            :rules="checkMail"
                          >
                            <ElInput
                              v-model="scope.row.mail"
                              placeholder="请输入邮箱"
                            />
                          </ElFormItem>
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        width="240"
                        prop="description"
                      >
                        <template #header>
                          <span>备注</span>
                        </template>
                        <template #default="scope">
                          <ElFormItem
                            :prop="'dutyPersonList[' + scope.$index + '].description'"
                          >
                            <ElInput
                              v-model="scope.row.description"
                              placeholder="请输入备注"
                              style="width: 100%;"
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
                            :class="$style.mgl"
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
              </div>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="填报单位："
                prop="fillCompanyId"
              >
                <ElSelect
                  v-model="form.fillCompanyId"
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
                prop="fillUser"
              >
                <ElInput
                  v-model="form.fillUser"
                  placeholder="请输入填报人"
                />
              </ElFormItem>
              <ElFormItem
                label="填报人联系方式："
                prop="fillUserTel"
                :rules="checkPhone"
              >
                <ElInput
                  v-model="form.fillUserTel"
                  placeholder="请输入填报人联系方式"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <div
            v-if="!(be === 'info')"
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
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import { getWhenUpdate, add, modify } from '@/api/assetsManage/security'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { phone, email, ip, length } from '@/functions/validators'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'
import { NETTYPE } from '../enums'
import LAYOUT from '@/scss/export/layout.scss'
import getCode from '@/enums/code'
// 部署网络环境
const DEPLOY = getCode('1', 'SYS_asset_secu_dev_de')
const CITYPE = getCode('1', 'SYS_asset_secu_dev_type')
// 安全设备形态
const CIFORM = getCode('1', 'SYS_asset_secu_dev_form')
const IMPORTANT = getCode('1', 'SYS_asset_importance')
// 托管位置
const ZONE = getCode('1', 'SYS_asset_location_zone')
// 所属网络区域
const REGION = getCode('1', 'SYS_asset_network_region')
// 网络类型
const NETWORKTYPE = getCode('1', 'SYS_asset_network_type')
// 有无管理端
const ISMANAGE = getCode('1', 'SYS_asset_have_mn_dm')
// 厂商
const FACTORY = getCode('1', 'VENDOR')
// 部署模式
const DEPLOYMODE = getCode('1', 'SYS_asset_deploy_mode')
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
        dutyPersonList: [],
        ipMacList: [],
        fillUser: info.aliasName || '',
        fillUserTel: info.cellPhone || '',
        type: '',
      },
      organizations: [],
      display: false,
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    DEPLOY: () => DEPLOY.value,
    CITYPE: () => CITYPE.value,
    CIFORM: () => CIFORM.value,
    IMPORTANT: () => IMPORTANT.value,
    REGION: () => REGION.value,
    ZONE: () => ZONE.value,
    NETWORKTYPE: () => NETWORKTYPE.value,
    ISMANAGE: () => ISMANAGE.value,
    FACTORY: () => FACTORY.value,
    NETTYPE: () => NETTYPE,
    DEPLOYMODE: () => DEPLOYMODE.value,
    // 检查电话号码
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
    checkIP() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入IP地址'))
          } else {
            try {
              ip(value)
              callback()
            } catch (error) {
              callback(error)
            }
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

    checkLength() {
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
              length(value)
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

    // 获取安全产品详情
    getSecurityInfo() {
      const id = this.route.params.id || ''
      if (id) {
        getWhenUpdate(id).then((res) => {
          this.form = res.data.body
        })
      }
    },
    save(this: any) {
      const data = this.form
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          ;(data.id ? modify : add)(data).then(() => {
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
    addIpInfo(this: any) {
      const obj = {
        type: '',
        ip: '',
      }
      this.form.ipMacList.push(obj)
    },
    delIpInfo(obj) {
      const index = obj.$index
      this.form.ipMacList.splice(index, 1)
    },
    addDutyPersons(this: any) {
      const obj = {
        name: '',
        tel: '',
        mail: '',
        description: '',
      }
      this.form.dutyPersonList.push(obj)
    },
    delDutyPerson(obj) {
      const index = obj.$index
      this.form.dutyPersonList.splice(index, 1)
    },
  },

  created() {
    this.getSecurityInfo()
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

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.button {
  display: flex;
  justify-content: center;
  margin-bottom: $gapNormal;
}

.textarea {
  width: 100%;
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
</style>
