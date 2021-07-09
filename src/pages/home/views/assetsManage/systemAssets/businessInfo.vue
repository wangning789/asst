<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>应用系统资产详情</h3>
    </div>
    <ElRow>
      <ElTabs v-model="activeName">
        <ElTabPane
          v-for="(item, index) in TITLE"
          :key="index"
          :label="item"
        />
      </ElTabs>
    </ElRow>
    <Associatedservices
      v-if="activeName === '1'"
      :server-i-d="serverID"
    />
    <Securityincidents
      v-if="activeName === '2'"
      :business="business"
    />
    <div
      v-if="activeName === '0'"
      :class="$style.contentBox"
    >
      <ElForm
        ref="form"
        label-position="right"
        label-width="140px"
        inline
        :model="form"
      >
        <ElRow :gutter="GAP">
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>基础信息</span>
            </div>
            <ElFormItem
              label="应用系统名称："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.ciName }}
              </div>
            </ElFormItem>
            <ElFormItem
              label="资产编号："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.ciCode }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="系统类型："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.ciTypeStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label-width="140px"
              label="资产重要性："
            >
              <div :class="$style.content">
                {{ form.importanceStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="系统定级："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.sysLevelStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="涉密/非密："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.classifyStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="内网访问地址："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.intranetAddress }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="系统/产品厂商："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.factory }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="系统版本号："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.sysVersion }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="是否自研："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.selfDevelopedStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label-width="140px"
              label="互联网访问地址："
            >
              <div :class="$style.contentFull">
                {{ form.internetAddress }}
              </div>
            </ElFormItem>

            <ElFormItem
              label-width="140px"
              label="主要功能模块："
            >
              <div :class="$style.contentFull">
                {{ form.mainFunDesc }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="备注："
              label-width="140px"
            >
              <div :class="$style.contentFull">
                {{ form.description }}
              </div>
            </ElFormItem>
          </div>
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>网络及部署位置信息</span>
            </div>
            <ElFormItem
              label="域名是否备案:"
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.record }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="状态："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.ciStatusStr }}
              </div>
            </ElFormItem>
            <ElFormItem
              label="是否接入云防："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.cloudDefenseConnection }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="系统开发语言："
              label-width="140px"
            >
              <div :class="$style.contentFull">
                {{ form.sysDevLang }}
              </div>
            </ElFormItem>
            <ElFormItem label="中间件及版本：">
              <div :class="$style.tableWrap">
                <ElTable
                  :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                  style="width: 600px;"
                  :data="form.middlewares"
                  :class="$style.tableId"
                >
                  <ElTableColumn
                    prop="middlewareName"
                    label="中间件"
                  />

                  <ElTableColumn
                    prop="middlewareVersion"
                    label="版本号"
                  />
                </ElTable>
              </div>
            </ElFormItem>

            <ElFormItem label="数据库类型和版本：">
              <div :class="$style.tableWrap">
                <ElTable
                  :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                  style="width: 600px;"
                  :data="form.dbTypes"
                  :class="$style.tableId"
                >
                  <ElTableColumn
                    prop="dbTypeName"
                    label="数据库类型"
                  />

                  <ElTableColumn
                    prop="dbTypeVersion"
                    label="版本号"
                  />
                </ElTable>
              </div>
            </ElFormItem>

            <ElFormItem label="IP地址：">
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
            <ElFormItem
              label-width="140px"
              label="系统部署环境："
            >
              <div :class="$style.content">
                {{ form.networkStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="所属网络区域："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.networkRegionStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              label-width="140px"
              label="托管位置："
            >
              <div :class="$style.content">
                {{ form.locationZoneStr }}
              </div>
            </ElFormItem>

            <ElFormItem
              v-if="form.locationZoneStr==='公有云'||form.locationZoneStr==='服务商托管'"
              label-width="140px"
              label="托管位置描述："
            >
              <div :class="$style.contentFull">
                {{ form.extra }}
              </div>
            </ElFormItem>
          </div>

          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>自主可控评估信息</span>
            </div>
            <ElFormItem
              label="是否可替代："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.replaceable }}
              </div>
            </ElFormItem>

            <ElFormItem
              label="替代策略："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.replacePlyStr }}
              </div>
            </ElFormItem>
            <ElFormItem
              label="简述不能替代原因："
              label-width="140px"
            >
              <div class="contentFull">
                {{ form.notReplaceReason }}
              </div>
            </ElFormItem>
          </div>
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" /><span>归属责任信息</span>
            </div>
            <ElFormItem
              label-width="140px"
              label="资产归属单位："
            >
              <div class="contentFull">
                {{ form.belongCompanyStr }}
              </div>
            </ElFormItem>

            <ElFormItem label="责任人信息：">
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
            <ElFormItem
              label-width="140px"
              label="填报单位："
            >
              <div :class="$style.content">
                {{ form.fillCompany }}
              </div>
            </ElFormItem>

            <ElFormItem
              label-width="140px"
              label="填报人："
            >
              <div :class="$style.content">
                {{ form.fillUser }}
              </div>
            </ElFormItem>

            <ElFormItem
              label-width="140px"
              label="填报人联系方式："
            >
              <div :class="$style.content">
                {{ form.fillUserTel }}
              </div>
            </ElFormItem>
          </div>

          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" /><span>关联服务器情况</span>
            </div>

            <ElFormItem label="服务器信息：">
              <div :class="$style.tableWrap">
                <ElTable
                  :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                  style="width: 1000px;"
                  :data="serverList"
                  :class="$style.elTable"
                >
                  <ElTableColumn
                    prop="ciName"
                    label="服务器名称"
                  />
                  <ElTableColumn
                    show-overflow-tooltip
                    prop="Intranet"
                    label="IP（内网）"
                  />
                  <ElTableColumn
                    show-overflow-tooltip
                    prop="Extranet"
                    label="IP（外网）"
                  />
                  <ElTableColumn
                    prop="depositLocationName"
                    label="托管位置"
                  />
                  <ElTableColumn
                    prop="networkTypeName"
                    label="所属网络"
                  />
                </ElTable>
              </div>
            </ElFormItem>
          </div>
        </ElRow>
      </ElForm>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck

import {
  querydetailBiz,
} from '@/api/assetsBusiness/assetsBusiness'
import { queryHost } from '@/api/assetsManage/host'
import { TITLE } from './code'
import Securityincidents from './securityIncidents'
import Associatedservices from './associatedServices'

import { getOrganizationInfo } from '@/api/systemManage/organization'
import { User } from '@/api/authServer/user'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'
import LAYOUT from '@/scss/export/layout.scss'
const info = local.get(STORAGE.me, decode) as User
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: {
    Associatedservices,
    Securityincidents,
  },
  data() {
    return {
      serverList: [],
      serverID: [],
      business: '',
      activeName: '0',
      arr: [],
      dbTypes: [],
      middlewares: [],
      dutyPersons: [],
      form: {
        addresses: [],
        dutyPersons: [],
        fillUserTel: info.cellPhone || '',
        fillUser: info.aliasName || '',
        cloudDefenseConnection: '',
        record: '',
      },
      display: false,
      organizations: [],
      id: [],
    }
  },
  computed: {
    TITLE: () => TITLE,
    GAP: () => +LAYOUT.gap,
  },
  methods: {
    getTerminalInfo() {
      const id = this.route.params.id || ''
      if (id) {
        const ids = []
        ids.push(id)
        querydetailBiz(ids).then((res) => {
          if (res && res.data && res.data.body) {
            res.data.body.cloudDefenseConnection = res.data.body.cloudDefenseConnection === '1' ? '是' : '否'
            res.data.body.record = res.data.body.record === '1' ? '是' : '否'
            res.data.body.bizHostRels.map((item) => {
              this.serverID.push(item.serverId)
            })
            this.form = res.data.body
            this.id = []
            res.data.body.businessHostRels.map(item => {
              this.id.push(item.serverId)
            })
            queryHost(this.id).then((res) => {
              this.serverList = res.data.body
              this.serverList.map((item) => {
                if (item.addresses.length !== 0) {
                  item.Intranet = []
                  item.Extranet = []
                  item.addresses.map(obj => {
                    if (obj.type === 1) {
                      item.Intranet.push(obj.ip)
                    } else if (obj.type === 2) {
                      item.Extranet.push(obj.ip)
                    }
                  })
                  item.Intranet = item.Intranet.join(',')
                  item.Extranet = item.Extranet.join(',')
                }
              })
            })
          }
          const arr = res.data.body.addresses
          arr.forEach((item) => {
            const data = { 1: '内网', 2: '互联网' }
            if (item.typeInString === '1') {
              item.typeInString = data[1]
              this.arr = arr
            } else if (item.typeInString === '2') {
              item.typeInString = data[2]
              this.arr = arr
            }
          })
          this.dutyPersons = res.data.body.dutyPersons
          this.middlewares = res.data.body.middlewares
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
    this.business = this.route.params.id
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
  width: 800px;

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

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.content {
  width: 230px !important;
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
