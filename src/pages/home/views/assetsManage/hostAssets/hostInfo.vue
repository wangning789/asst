<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>服务器资产详情</h3>
    </div>
    <ElRow v-if="be==='info'">
      <ElTabs v-model="activeName">
        <ElTabPane
          v-for="(item, index) in TITLE"
          :key="index"
          :label="item"
        />
      </ElTabs>
    </ElRow>
    <Securityincidents
      v-if="activeName==='1'"
      :host-id="hostId"
    />
    <div
      v-if="activeName==='0'"
      :class="$style.contentBox"
    >
      <ElForm
        ref="form"
        label-position="right"
        label-width="140px"
        inline
        :model="form"
      >
        <div :class="$style.region">
          <div :class="$style.subTitle">
            <i :class="$style.subTitleFlag" />
            <span>基础信息</span>
          </div>
          <ElFormItem
            label="服务器名称："
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
            label="服务器形态："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.ciTypeName }}
            </div>
          </ElFormItem>
          <ElRow>
            <ElFormItem
              v-show="form.ciType === 'SYS_asset_type_physical_server'"
              label="厂商："
              label-width="140px"
            >
              <div :class="$style.content">
                {{ form.vendor }}
              </div>
            </ElFormItem>
          </ElRow>
          <ElFormItem
            label="用途类型："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.useTypeName }}
            </div>
          </ElFormItem>

          <ElFormItem
            label="资产重要性："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.importanceInString }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="涉密/非密："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.secretLevelName }}
            </div>
          </ElFormItem>
          <ElFormItem
            label-width="140px"
            label="操作系统："
          >
            <div :class="$style.content">
              {{ form.osName }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="操作系统版本号："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.osVersion }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="内核版本："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.kernelVersion }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="状态："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.ciStatusName }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="是否接入磐石："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.psConnection ? (form.psConnection === '0' ? '否' : '是') : '' }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="备注："
            label-width="140px"
          >
            <div style="width: 615px;">
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
            label="部署网络环境："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.networkTypeName }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="所属网络区域："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.networkRegionName }}
            </div>
          </ElFormItem>
          <ElFormItem
            label-width="140px"
            label="托管位置："
          >
            <div :class="$style.content">
              {{ form.depositLocationName }}
            </div>
          </ElFormItem>

          <ElFormItem
            v-if="form.depositLocationName==='公有云'||form.depositLocationName==='服务商托管'"
            label-width="140px"
            label="托管位置描述："
          >
            <div :class="$style.contentFull">
              {{ form.extra }}
            </div>
          </ElFormItem>
          <ElFormItem label="IP地址信息：">
            <div :class="$style.tableWrap">
              <ElTable
                :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                style="width: 600px;"
                :data="arr"
              >
                <ElTableColumn
                  prop="typeInString"
                  label="内网/互联网"
                />
                <ElTableColumn
                  prop="ip"
                  label="IP"
                />
                <ElTableColumn
                  prop="mac"
                  label="MAC"
                />
              </ElTable>
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
            label-width="140px"
          >
            <div :class="$style.contentFull">
              {{ form.belongCompanyName }}
            </div>
          </ElFormItem>
          <ElFormItem label="责任人信息：">
            <div :class="$style.tableWrap">
              <ElTable
                :header-cell-style="{ backgroundColor: '#F1F3F6' }"
                style="width: 1000px;"
                :data="dutyPersons"
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
            label="填报单位："
            label-width="140px"
          >
            <div contentFull>
              {{ form.recordCompanyName }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="填报人："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.recordPerson }}
            </div>
          </ElFormItem>
          <ElFormItem
            label="联系方式："
            label-width="140px"
          >
            <div :class="$style.content">
              {{ form.telephone }}
            </div>
          </ElFormItem>
        </div>
      </ElForm>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import Securityincidents from './securityIncidents'
import { TITLE } from './code'
import { queryHost } from '@/api/assetsManage/host'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { User } from '@/api/authServer/user'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'
const info = local.get(STORAGE.me, decode) as User
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: {
    Securityincidents,
  },

  data() {
    return {
      hostId: '',
      activeName: '0',
      dutyPersons: [],
      arr: [],
      form: {
        recordPerson: info.aliasName || '',
        telephone: info.cellPhone || '',
        addresses: [],
        dutyPersons: [],
      },
      display: false,
      organizations: [],
    }
  },
  computed: {
    TITLE: () => TITLE,
  },
  methods: {
    getHostInfo() {
      const id = this.route.params.id || ''
      if (id) {
        const ids = []
        ids.push(id)
        queryHost(ids).then((res) => {
          if (res && res.data && res.data.body) {
            this.form =
              (res.data.body.length &&
                res.data.body.filter((item) => {
                  return item.id === id
                })[0]) ||
              {}
            this.dutyPersons = this.form.dutyPersons
            const arry = this.form.addresses
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
    this.hostId = this.route.params.id
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

.content {
  width: 220px;
}

.contentFull {
  width: 1000px;
}

</style>
