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
            @click="$router.push(`/assetsInfo/businessSystem/${$route.params.id}/edit`)"
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
        title="应用系统"
        :number="form.ciSysCode"
        :status="useStatus"
      />

      <SubTitle title="基本信息" />

      <!-- 基本信息 -->
      <div :class="$style.aLine">
        <div
          v-for="(item, index) in columnDTOList"
          :key="index"
        >
          <div :class="$style.column">
            <div :class="$style.name">
              {{ item.chName }}
            </div>
            <div
              v-if="item.enName==='regisNo'"
              :class="$style.customData"
              @click="clickRegisNo"
            >
              <span :class="$style.primaryColor">{{ form.regisNo }}</span>
            </div>
            <div
              v-else
              :class="$style.customData"
              :title="form[item.type === '7' ? item.enName + 'Name' : item.enName]"
            >
              {{ form[item.type === '7' ? item.enName + 'Name' : item.enName] }}
            </div>
          </div>
        </div>
        <ComonFixDetail
          :class="$style.aLine"
          :form="form"
        />
      </div>

      <!-- 自定义信息 -->
      <SubTitle title="自定义信息" />
      <div :class="$style.aLine">
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

      <ElDialog
        title="备案信息"
        :visible.sync="dialogVisible"
        width="850px"
        :before-close="handleClose"
      >
        <div
          :class="$style.aLine"
        >
          <div
            v-for="(item, index) in ecord"
            :key="index"
          >
            <div :class="$style.column">
              <div :class="$style.name">
                {{ item.title }}
              </div>
              <div :class="$style.customData">
                {{ item.data }}
              </div>
            </div>
          </div>
        </div>
      </ElDialog>
    </div>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
// import ITable from '@/components/Table'
// import {
//   getSecurityDevice,
//   deleteSecurityDevice,
//   changeSecurityDeviceStatus,
// } from '@/api/assets/assetsInfo/securityFacility'

import { details as getSecurityDevice, state as changeSecurityDeviceStatus, deleteData as deleteSecurityDevice, caseKeep } from '@/api/assets/assetsInfo/businessSystem'
import STYLE from '@/scss/status.module.scss'
import IChooser from '@com/ChooserAsyncFunctional'

import RelationTable from '../../components/relationTable'
import ModifyTable from '../../components/modifyTable'
import SubTitle from '../../components/subTitle'
import HeaderInfo from '../../components/headerInfo'
import ComonFixDetail from '../../components/comonFixDetail'

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
  },
  data() {
    return {
      id: '',
      useStatus: true, // 0是启用 1是禁用
      form: {},
      customizeForm: {},
      columnDTOList: [], // 固定字段
      customizeColumnDTOList: [], // 自定义字段
      ciRelationDTOList: [],
      ciChangeRecordList: [],

      ecord: [
        { title: '公司名', josn: 'companyName', data: '' },
        { title: '公司类型', josn: 'companyType', data: '' },
        { title: '备案许可证号', josn: 'regisNo', data: '' },
        { title: '网站名', josn: 'websiteName', data: '' },
        { title: '主页', josn: 'homepage', data: '' },
        { title: '审核时间', josn: 'auditTime', data: '' },
      ], // 弹窗备案信息
      dialogVisible: false, // 是否显示弹窗
    }
  },
  computed: {
    STYLE: () => STYLE,
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    // 备案许可证
    clickRegisNo() {
      this.dialogVisible = true
      const id = this.$route.params.id
      caseKeep(id).then(res => {
        if (res.data.body.data) {
          const from = res.data.body.data
          this.ecord.map(item => {
            for (const k in from) {
              if (item.josn === k) {
                item.data = from[k]
              }
            }
          })
        }
      })
    },
    changeStatus() {
      if (this.ciRelationDTOList.length > 0 && this.useStatus === false) {
        this.useStatus = true
        this.$message.error('请先移除与其他资产的关联再停用')
      } else {
        changeSecurityDeviceStatus({ id: this.id, useStatus: this.useStatus ? '0' : '1' }).then(res => {
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
          this.$message.error('删除失败，请先停用再删除')
        } else {
          deleteSecurityDevice(this.id).then(res => {
            if (res.data.status) {
              this.$router.go(-1)
              this.$notify.success('删除成功')
            } else {
              this.$message.error(res.data.body || '请求失败')
            }
          })
        }
      })
    },
    async fetch() {
      this.id = this.$route.params.id
      const data = (await getSecurityDevice(this.$route.params.id)).data.body
      // 固定字段
      this.columnDTOList = data.columnDTOList.filter(child => child.display === '1' &&
       child.allowModify === '2' &&
        child.enName !== 'belongCompanyId' && // 所属单位
        child.enName !== 'description' && // 备注
        child.enName !== 'useStatus' && // 状态
        child.enName !== 'addTime' &&// 纳管时间
        child.enName !== 'ciSysCode')
      // 自定义字段
      this.customizeColumnDTOList = data.columnDTOList.filter(child => child.allowModify === '1')
      this.form = data.data
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
    // display: flex;
    // align-items: center;
    width: 260px;
    // width: 120px;
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding-left: 10px;
    overflow: hidden; //隐藏
    line-height: 38px;
    white-space: nowrap; //文本不进行换行
    text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
    word-wrap: normal;    //保持默认处理
    word-break: keep-all;  //中英文不断词
    border: 1px solid #f0f0f0;
  }

  .primaryColor {
    color: $colorTheme;
  }
}
</style>
