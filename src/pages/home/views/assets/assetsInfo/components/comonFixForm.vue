<template>
  <IChooser
    :fetch="fetch"
  >
    <!-- <ElForm
      ref="form"
      :model="form"
      size="small"
      label-width="120px"
    > -->
    <!-- <ElRow :class="$style.row"> -->
    <ElCol :span="8">
      <ElRow type="flex">
        <ElFormItem
          label="责任人："
          prop="dutyList"
        >
          <ElSelect
            v-model="form.dutyList"
            multiple
            filterable
            :placeholder="'请选择责任人'"
            collapse-tags
          >
            <ElOption
              v-for="item in persons"
              :key="item.id"
              :label="item.staffName"
              :value="item.id"
              :disabled="item.disable"
            />
          </ElSelect>
        </ElFormItem>
      </ElRow>
    </ElCol>
    <ElCol :span="8">
      <ElRow type="flex">
        <ElFormItem
          label="使用人："
          prop="usrList"
        >
          <ElSelect
            v-model="form.usrList"
            multiple
            filterable
            :placeholder="'请选择使用人'"
            collapse-tags
          >
            <ElOption
              v-for="item in persons"
              :key="item.id"
              :label="item.staffName"
              :value="item.id"
              :disabled="item.disable"
            />
          </ElSelect>
        </ElFormItem>
      </ElRow>
    </ElCol>
    <ElCol :span="8">
      <ElRow type="flex">
        <ElFormItem
          label="所属人："
          prop="ownerList"
        >
          <ElSelect
            v-model="form.ownerList"
            multiple
            filterable
            :placeholder="'请选择所属人'"
            collapse-tags
          >
            <ElOption
              v-for="item in persons"
              :key="item.id"
              :label="item.staffName"
              :value="item.id"
              :disabled="item.disable"
            />
          </ElSelect>
        </ElFormItem>
      </ElRow>
    </ElCol>
    <ElCol :span="8">
      <ElRow type="flex">
        <ElFormItem
          label="所属单位："
          prop="belongCompanyId"
          :rules="[
            { required: true, message: `请选择`, trigger: 'change' },
          ]"
        >
          <ElSelect
            v-model="form.belongCompanyId"
            filterable
            placeholder="请选择所属单位"
          >
            <ElOption
              v-for="item in organizations"
              :key="item.id"
              :label="item.organizationName"
              :value="item.id"
              :disabled="item.disable"
            />
          </ElSelect>
        </ElFormItem>
      </ElRow>
    </ElCol>
    <ElCol
      :span="8"
    >
      <ElRow type="flex">
        <ElFormItem
          label="备注："
          prop="description"
        >
          <ElInput
            v-model="form.description"
            maxlength="200"
            show-word-limit
            :placeholder="'请输入备注'"
          />
        </ElFormItem>
      </ElRow>
    </ElCol>
    <!-- </ElRow> -->
    <!-- </ElForm> -->
    <ElDialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div
        v-for="(item,index) in tipsList"
        :key="index"
      >
        {{ item }}
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          size="small"
          type="primary"
          @click="dialogVisible = false"
        >确 定</ElButton>
      </span>
    </ElDialog>
  </IChooser>
</template>
<script lang="ts">
// @ts-nocheck
import { getOrganizationInfo, getOrgByUserInfo } from '@/api/systemManage/organization'
import { adminGetStaffList, commonUserGetStaffList } from '@/api/assets/assetsInfo/index'
import IChooser from '@com/ChooserAsyncFunctional'
import { ROLES } from '@/enums'
export default {
  props: {
    // dutyList: { type: Array, required: true },//责任人
    // usrList: { type: Array, required: true },//使用人
    // ownerList: { type: Array, required: true },//所属人
    form: { type: Object, required: true },
  },
  components: {
    IChooser,
  },
  data() {
    return {
      organizations: [],
      persons: [], // 人员下拉
      dialogVisible: false,
      tipsList: [],
      deletePersons: [],

    }
  },

  methods: {
    async fetch() {
      const orgFn = this.authFit(ROLES.systemAdmin) ? getOrganizationInfo : getOrgByUserInfo
      this.organizations = (await orgFn()).data.body || []
      const perFn = this.authFit(ROLES.systemAdmin) ? adminGetStaffList : commonUserGetStaffList
      this.persons = (await perFn()).data.body || []
      if (this.form.id) {
        const orgFlag = this.organizations.find(o => { return o.id === this.form.belongCompanyId })
        if (!orgFlag) {
          this.tipsList.push(`所属单位【${this.form.belongCompanyIdName}】`)
          this.organizations.push({
            id: this.form.belongCompanyId,
            organizationName: this.form.belongCompanyIdName,
            disable: true,
          })
          this.form.belongCompanyId = ''
        }
        this.deletePersons = []
        this.getDeletePerson('dutyList', '责任人')
        this.getDeletePerson('usrList', '使用人')
        this.getDeletePerson('ownerList', '所属人')
        if (this.tipsList && this.tipsList.length) {
          this.$confirm(this.tipsList.join(), '未找到如下信息,将置空,请确定并修改', {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
          }).then(() => {
            return 1
          })
        }
      }

      return ({})
    },
    getPersonName(id) {
      const arr = this.form.allPerList.filter(o => o.perId === id)
      return arr[0]
    },
    getDeletePerson(field, fieldName) {
      this.form[field].forEach((per, index) => {
        const flag = this.persons.find(o => { return o.id === per && !o.disable })
        if (!flag) {
          const person = this.getPersonName(per)
          this.tipsList.push(`${fieldName}【${person.perName}】`)
          if (!this.deletePersons.includes(per)) {
            this.deletePersons.push(per)
            this.persons.push({ staffName: person.perName, id: person.perId, disable: true })
          }
          this.form[field].splice(index, 1)
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
  },
}
</script>
<style lang="scss" module>
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
