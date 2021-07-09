<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>安全产品资产详情</h3>
    </div>
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        label-width="140px"
        inline
        :model="form"
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
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.ciType }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="有无管理端："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.haveManageDepartment }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="安全产品名称："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.ciName }}
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="安全产品形态："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.form }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="序列号："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.serial }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="厂商:"
                label-width="140px"
              >
                <div
                  :class="$style.content"
                >
                  {{ form.factory }}
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="硬件版本："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.hardwareVersion }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="软件版本："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.softwareVersion }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="重要性："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.importance }}
                </div>
              </ElFormItem>
            </ElCol>

            <ElCol :span="24">
              <ElFormItem
                label="备注："
                label-width="140px"
              >
                <div :class="$style.contentFull">
                  {{ form.description }}
                </div>
              </ElFormItem>
            </ElCol>

            <ElCol :span="24">
              <div :class="$style.subTitle">
                <i :class="$style.subTitleFlag" />
                <span>网络及部署位置信息</span>
              </div>
              <ElFormItem
                label="部署模式："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.deployMode }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="管理地址："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.manageAddr }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="系统部署环境："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.deployEnvir }}
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="所属网络区域："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.networkRegionId }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="托管位置："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.locationZoneId }}
                </div>
              </ElFormItem>
              <ElFormItem
                v-if="form.locationZoneId==='公有云'||form.locationZoneId==='服务商托管'"
                label-width="140px"
                label="托管位置描述："
              >
                <div :class="$style.contentFull">
                  {{ form.extra }}
                </div>
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <div :class="$style.region">
                <ElFormItem label="网口：">
                  <div :class="$style.tableWrap">
                    <ElTable
                      :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                      style="width: 600px;"
                      :data="arr"
                      :class="$style.tableId"
                    >
                      <ElTableColumn
                        prop="typeInString"
                        label="内网/互联网"
                      />
                      <ElTableColumn
                        prop="ip"
                        label="IP"
                      />
                    </ElTable>
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
                label-width="140px"
              >
                <div :class="$style.contentFull">
                  {{ form.belongCompanyId }}
                </div>
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
                      :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                      style="width: 1000px;"
                      :data="dutyPersons"
                      :class="$style.elTable"
                    >
                      <ElTableColumn
                        prop="name"
                        label="姓名"
                      />
                      <ElTableColumn
                        prop="tel"
                        label="联系电话"
                      />
                      <ElTableColumn
                        prop="mail"
                        label="邮箱"
                      />
                      <ElTableColumn
                        prop="description"
                        label="备注"
                      />
                    </ElTable>
                  </div>
                </ElFormItem>
              </div>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem
                label="填报单位："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.fillCompanyId }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="填报人："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.fillUser }}
                </div>
              </ElFormItem>
              <ElFormItem
                label="填报人联系方式："
                label-width="140px"
              >
                <div :class="$style.content">
                  {{ form.fillUserTel }}
                </div>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { securityDeviceId } from '@/api/assetsManage/security'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'
import LAYOUT from '@/scss/export/layout.scss'
import getCode from '@/enums/code'
// 厂商
const FACTORY = getCode('1', 'VENDOR')
// 部署模式
const info = local.get(STORAGE.me, decode) as User
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  data() {
    return {
      dutyPersons: [],
      arr: [],
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
    FACTORY: () => FACTORY.value,
  },
  methods: {
    // 获取安全产品详情
    getSecurityInfo() {
      const id = this.route.params.id || ''
      if (id) {
        securityDeviceId(id).then((res) => {
          this.form = res.data.body
          this.dutyPersons = this.form.dutyPersonList
          const arry = this.form.ipMacList
          arry.forEach((item) => {
            const data = { 1: '内网', 2: '互联网' }
            if (item.typeInString === '1') {
              item.typeInString = data[1]
              this.arr = arry
            } else if (item.typeInString === '2') {
              item.typeInString = data[2]
              this.arr = arry
            }
          })
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
    background-color: #d5402b;
  }
}

.content {
  width: 220px;
  word-break: break-all;
}

.contentFull {
  width: 1000px;
}

.elTable {
  width: 1000px;
}

.tableId {
  width: 600px;
}
</style>
