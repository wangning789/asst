<!-- 详情 -->
<template>
  <IChooser
    :fetch="fetch"
    class="el-card"
  >
    <!-- 头部 -->
    <div :class="$style.title">
      <div :class="$style.left">
        {{ $route.name }}
      </div>
      <div
        :class="$style.right"
      >
        <div :class="$style.rr">
          <ElTooltip
            v-if="useStatus"
            :content="'启用中'"
            placement="bottom"
          >
            <ElSwitch
              v-model="useStatus"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="changeStatus()"
            />
          </ElTooltip>
          <ElTooltip
            v-else
            :content="'已停用'"
            placement="bottom"
          >
            <ElSwitch
              v-model="useStatus"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="changeStatus()"
            />
          </ElTooltip>
          <ElButton
            plain
            size="mini"
            @click="$router.push(`/assetsInfo/server/${$route.params.id}/edit`)"
          >
            编辑
          </ElButton>
          <ElButton
            plain
            :class="STYLE.danger"
            size="mini"
            @click="handleDelete()"
          >
            删除
          </ElButton>
        </div>
      </div>
    </div>
    <div :class="$style.bod" />
    <div :class="$style.contenner">
      <!-- 头部信息 -->
      <HeaderInfo
        title="服务器"
        :number="form.ciSysCode"
        :status="useStatus"
      />

      <!-- 基本信息 -->
      <SubTitle title="基本信息" />
      <div :class="$style.aLines">
        <div
          v-for="(item, index) in columnDTOList"
          :key="index"
        >
          <div :class="$style.column">
            <div :class="$style.name">
              {{ item.chName }}
            </div>
            <div
              :class="$style.customData"
              :title="form[item.type === '7' ? item.enName + 'Name' : item.enName]"
            >
              {{ form[item.type === '7' ? item.enName + 'Name' : item.enName] }}
            </div>
          </div>
        </div>
        <!-- <div>
          <div :class="$style.column">
            <div :class="$style.name">
              ASN
            </div>
            <div
              :class="$style.customData"
            >
              {{ form.asn }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              位置区域(国家/城市)
            </div>
            <div
              :class="$style.customData"
            >
              {{ form.city || '' }}/{{ form.country }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              ISP
            </div>
            <div
              :class="$style.customData"
            >
              {{ form.isp }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              添加时间
            </div>
            <div
              :class="$style.customData"
            >
              {{ form.createDate }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              最近更新时间
            </div>
            <div
              :class="$style.customData"
            >
              {{ form.modifyDate }}
            </div>
          </div>
        </div>
        <div>
          <div :class="$style.column">
            <div :class="$style.name">
              组织信息
            </div>
            <div
              :class="$style.customData"
            >
              {{ form.organization }}
            </div>
          </div>
        </div> -->
        <ComonFixDetail
          :class="$style.aLines"
          :form="form"
        />
      </div>
      <SubTitle title="IP信息" />
      <div :class="$style.ipcs">
        <ITable
          ref="table"
          :data="ipList"
          width="400"
        >
          <ElTableColumn
            prop="typeName"
            label="内网/互联网"
            width="200"
          />
          <ElTableColumn
            prop="ip"
            label="IP"
            width="200"
          />
        </ITable>
      </div>
      <!-- 自定义信息  -->
      <SubTitle title="自定义信息" />
      <div :class="$style.aLines">
        <div
          v-for="(item, index) in customizeColumnDTOList"
          :key="index"
        >
          <div :class="$style.column">
            <div :class="$style.name">
              {{ item.chName }}
            </div>
            <div
              :class="$style.customData"
              :title="customizeForm[item.type === '7' ? item.enName + 'Name' : item.enName]"
            >
              {{ customizeForm[item.type === '7' ? item.enName + 'Name' : item.enName] }}
            </div>
          </div>
        </div>
      </div>
      <!-- 组件信息 -->
      <!-- <SubTitle title="组件信息" />
      <ITable
        ref="table"
        :data="portList"
        style="width: 600px;"
      >
        <ElTableColumn
          prop="name"
          label="端口"
        />
        <ElTableColumn
          prop="port"
          label="协议"
        />
        <ElTableColumn
          label="组件"
        >
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.moduleList"
              :key="index"
            >
              {{ item.name }}
            </div>
          </template>
        </ElTableColumn>
      </ITable> -->
      <!-- banner信息 -->
      <!-- <SubTitle
        title="banner信息"
      />
      <Banner :port-list="portList" /> -->
      <!-- 关联资产 -->
      <SubTitle title="关联资产" />
      <RelationTable
        :ss="useStatus"
        :ci-relation-d-t-o-list="ciRelationDTOList"
        :type="type"
      />

      <!-- 修改记录 -->
      <SubTitle title="修改记录" />
      <ModifyTable :ci-change-record-list="ciChangeRecordList" />
      <!-- 端口信息 -->
      <!-- <PortModule :port="port" /> -->
    </div>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
import ITable from '@/components/Table'
import {
  serverInfo,
  delServer,
  changeServerStatus,
} from '@/api/assets/assetsInfo/server'
import STYLE from '@/scss/status.module.scss'
import IChooser from '@com/ChooserAsyncFunctional'
import RelationTable from '../../components/relationTable'
import ModifyTable from '../../components/modifyTable'
import SubTitle from '../../components/subTitle'
import HeaderInfo from '../../components/headerInfo'
import ComonFixDetail from '../../components/comonFixDetail'
// import Banner from './Banner'
// import PortModule from './portModule'
export default {
  props: {
    type: { type: String, required: true },
  },
  components: {
    RelationTable,
    IChooser,
    ModifyTable,
    SubTitle,
    HeaderInfo,
    ComonFixDetail,
    ITable,
    // Banner,
    // PortModule,
  },
  data() {
    return {
      id: '',
      useStatus: true, // 0是启用 1是禁用
      form: {},
      ipList: [], // ip字段
      customizeForm: {},
      columnDTOList: [], // 固定字段
      customizeColumnDTOList: [], // 自定义字段
      ciRelationDTOList: [],
      ciChangeRecordList: [],
      portList: [],
      port: {},

    }
  },
  computed: {
    STYLE: () => STYLE,
  },
  methods: {
    changeStatus() {
      if (this.ciRelationDTOList.length > 0 && this.useStatus === false) {
        this.useStatus = true
        this.$message.error('请先移除与其他资产的关联再停用')
      } else {
        changeServerStatus({ id: this.id, useStatus: this.useStatus ? '0' : '1' }).then(res => {
          if (res.data.status) {
            this.$notify.success(this.useStatus ? '启用成功' : '停用成功')
          } else {
            this.$message.error(res.msg || '请求失败')
            this.useStatus = !this.useStatus
          }
        })
      }
    },
    // 删除
    handleDelete() {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        if (this.useStatus === true) {
          this.$message.error('删除失败，请先停用在删除')
        } else {
          delServer(this.id).then(res => {
            if (res.data.status) {
              this.$router.go(-1)
              this.$notify.success('删除成功')
            } else {
              this.$message.error(res.msg || '请求失败')
            }
          })
        }
      })
    },
    async fetch() {
      this.id = this.$route.params.id
      const data = (await serverInfo(this.$route.params.id)).data.body
      // 固定字段
      this.columnDTOList = data.columnDTOList.filter(child => child.display === '1' &&
       child.allowModify === '2' &&
        child.enName !== 'belongCompanyId' && // 所属单位
        child.enName !== 'description' && // 备注
        child.enName !== 'addTime' &&// 纳管时间
        child.enName !== 'ciSysCode' && child.enName !== 'country')
      this.ipList = data.data.ipList || []
      // 自定义字段
      this.customizeColumnDTOList = data.columnDTOList.filter(child => child.allowModify === '1')
      this.form = data.data
      this.portList = data.data.portList
      this.port = data.data
      this.customizeForm = this.form.data || {}
      this.form.dutyList = this.form.dutyList.map(o => o.perName)
      this.form.usrList = this.form.usrList.map(o => o.perName)
      this.form.ownerList = this.form.ownerList.map(o => o.perName)
      // 0是启用 1是禁用
      this.useStatus = this.form.useStatus === '0'
      this.ciRelationDTOList = this.form.ciRelationDTOList || []
      this.ciChangeRecordList = this.form.ciChangeRecordList || []
      return (data)
    },
  },
}
</script>
<style lang="scss" module>

.contenner {
  position: relative;
  width: 1200px;
  margin: auto;
}

@media screen and (max-width: 1464px) {
  .contenner {
    width: 800px;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 10px;
  border-bottom: 1px solid #e9e9e9;

  .left {
    color: #333;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
  }

  .right {
    display: flex;
    justify-content: space-around;
  }
}

.rr :global(.el-switch) {
  margin-top: 6px;
  margin-right: $gapNormal;
}

.aLines {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.ipcs {
  width: 400px;
}

.aLine {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.column {
  display: flex;

  .name {
    display: flex;
    align-items: center;
    width: 130px;
    height: 38px;
    margin-bottom: -1px;
    padding-left: 10px;
    background-color: rgb(244, 246, 251);
    border: 1px solid #e9e9e9;
  }

  .customData {
    display: flex;
    align-items: center;
    width: 260px;
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding-left: 10px;
    border: 1px solid #f0f0f0;
  }
}

.portInformation {
  position: absolute;
  top: 100px;
  right: 0;
  width: 300px;
}
</style>
