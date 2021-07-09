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
          <ElButton
            plain
            size="small"
            @click="cancel()"
          >
            取消
          </ElButton>
          <ElButton
            type="primary"
            size="small"
            @click="save()"
          >
            保存
          </ElButton>
        </div>
      </div>
    </div>
    <div :class="$style.bod" />
    <div :class="$style.contenner">
      <!-- 头部信息 -->
      <HeaderInfo
        :title="ciTypeIdName"
        :number="form.ciSysCode"
        :status="useStatus"
      />

      <!-- 基本信息 -->
      <SubTitle title="基本信息" />
      <div style="margin-bottom: 30px;">
        <IFormConfig
          ref="form"
          label-width="120px"
          :form-config="columnDTOList"
          :form="form"
        >
          <ComonFixForm
            :form="form"
          />
        </IFormConfig>
      </div>

      <!-- 自定义信息 -->
      <SubTitle title="自定义信息" />
      <IFormConfig
        ref="customizeForm"
        label-width="120px"
        :form-config="customizeColumnDTOList"
        :form="customizeForm"
      />

      <!-- 关联资产 -->
      <SubTitle title="关联资产" />
      <RelationTable
        :number="form.ciSysCode"
        :ss="useStatus"
        :ci-relation-d-t-o-list="ciRelationDTOList"
        :type="type"
        @removal="removal"
      />
    </div>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
import { addBaseCi, modifyBaseCi, getBaseCiColumn, getBaseCi } from '@/api/assets/assetsInfo/customize'
import { ciTypeDetail } from '@/api/assets/assetsType'
import { trim } from '@/pipe'
import IChooser from '@com/ChooserAsyncFunctional'
import IFormConfig from '@homeCom/assets/formConfig'

import RelationTable from '../../components/relationTable'
import ComonFixForm from '../../components/comonFixForm'
import SubTitle from '../../components/subTitle'
import HeaderInfo from '../../components/headerInfo'

export default {
  props: {
    type: { type: String, required: true },
  },
  components: {
    IChooser,
    IFormConfig,
    RelationTable,
    ComonFixForm,
    SubTitle,
    HeaderInfo,
  },
  data() {
    return {
      drawer: false,
      form: {},
      ciTypeIdName: '',
      customizeForm: {},
      columnDTOList: [], // 固定字段
      customizeColumnDTOList: [], // 自定义字段
      dutyList: [], // 责任人
      usrList: [], // 使用人
      ownerList: [], // 所属人
      ciRelationDTOList: [], // 关联资产
      useStatus: true, // 0是启用 true  1是禁用 false
      ciTypeId: '',
      id: '',
    }
  },
  watch: {
  },
  methods: {
    removal(val) {
      this.ciRelationDTOList = val
    }, // 去重重新赋值关联资产的值
    cancel() {
      this.$router.go(-1)
    },
    async fetch() {
      if (this.type === 'edit') {
        this.id = this.$route.params.id.replace(/(^\s*)|(\s*$)/g, '')
      }
      this.ciTypeId = this.$route.params.ciTypeId
      const param = {
        ciTypeId: this.ciTypeId,
        id: this.id,
      }
      const params = {
        ciTypeId: this.ciTypeId,
      }
      ciTypeDetail(this.ciTypeId).then(res => {
        this.ciTypeIdName = res.data.body.chName
      })
      const data = this.type === 'add' ? (await getBaseCiColumn(params || '')).data.body : (await getBaseCi(param || '')).data.body
      // 固定字段
      this.columnDTOList = data.columnDTOList.filter(child =>
        child.display === '1' &&
        child.allowModify === '2' &&
        child.enName !== 'belongCompanyId' && // 所属单位
        child.enName !== 'description' && // 备注
        child.enName !== 'useStatus' && // 状态
        child.enName !== 'addTime' &&// 纳管时间
        child.enName !== 'ciSysCode'
      )
      // 自定义字段
      this.customizeColumnDTOList = data.columnDTOList.filter(child => child.allowModify === '1')
      if (this.id) {
        this.form = data.data || {}
        this.customizeForm = this.form.data || {}
        delete this.form.data
        this.ciRelationDTOList = this.form.ciRelationDTOList || []
        this.form.dutyList = this.form.dutyList.map(o => o.perId)
        this.form.usrList = this.form.usrList.map(o => o.perId)
        this.form.ownerList = this.form.ownerList.map(o => o.perId)
      } else {
        this.form = {
          data: {},
          ciRelationDTOList: [],
          dutyList: [],
          usrList: [],
          ownerList: [],
        }
      }
      // 0是启用 1是禁用
      this.useStatus = this.id ? this.form.useStatus === '0' : true
      return (data)
    },
    save() {
      // 检验必填项
      if (!this.$refs.form.validate() ||
      !this.$refs.customizeForm.validate()) {
        return
      }
      const whiteList = this.id
        ? ['id', 'addTime', 'belongCompanyId', 'description']
        : ['belongCompanyId', 'description']
      this.columnDTOList.forEach(item => {
        whiteList.push(item.enName)
      })
      const customWhiteList = []
      this.customizeColumnDTOList.forEach(item => {
        customWhiteList.push(item.enName)
      })
      const dutyList = this.form.dutyList.map(o => {
        return { perId: o, relType: '0' }
      })
      const usrList = this.form.usrList.map(o => {
        return { perId: o, relType: '1' }
      })
      const ownerList = this.form.ownerList.map(o => {
        return { perId: o, relType: '2' }
      })
      const params = {
        ...this.form,
        data: trim(this.customizeForm, customWhiteList),
        dutyList: dutyList, // 责任人
        usrList: usrList, // 使用人
        ownerList: ownerList, // 所属人
        ciRelationDTOList: this.ciRelationDTOList,
        ciTypeId: this.$route.params.ciTypeId,
      }
      if (this.type === 'add') {
        addBaseCi(params).then(res => {
          if (res.data.status) {
            this.$notify.success('新增成功')
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.body || '请求失败')
          }
        })
      } else {
        modifyBaseCi(params).then(res => {
          if (res.data.status) {
            this.$notify.success('修改成功')
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.body || '请求失败')
          }
        })
      }
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
    width: 1000px;
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

    .rr {
      margin-right: 10px;
    }
  }
}

.rr :global(.el-switch) {
  margin-top: 6px;
}

.row {
  .label {
    width: 120px;
    min-width: 80px;
    padding: 0 40px;
    color: #071124;
    font-weight: 400;
    text-align: left;
  }

  .text {

    @extend %ellipsis;
    // min-width: 50px;
    padding-left: 20px;
  }
}

.row :global(.el-input__inner) {
  // width: 290px;
  margin-top: 4px;
}

.row :global(.el-form-item) {
  width: 100%;
}

.row :global(.el-input__suffix) {
  top: 2px;
}
</style>
