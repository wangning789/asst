<template>
  <div class="el-card">
    <div :class="$style.name">
      {{ be === 'add'?'添加巡检任务':'' }}
      {{ be === 'edit'?'编辑巡检任务':'' }}
      {{ be==='details'?'巡检任务详情':'' }}
    </div>
    <div :class="$style.table">
      <ElForm
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <div :class="$style.ruleFrom">
          <ElFormItem
            label="巡检任务类型："
            prop="resource"
          >
            <ElRadioGroup
              v-model="ruleForm.resource"
              :class="$style.radioGroup"
              @change="change"
            >
              <ElRadio
                :disabled="disabled"
                label="安全产品巡检"
              />
              <ElRadio
                :disabled="disabled"
                label="服务器巡检"
              />
            </ElRadioGroup>
          </ElFormItem>
        </div>
        <div :class="$style.from">
          <ElFormItem>
            <ElButton
              v-show="ruleForm.resource === '安全产品巡检'"
              :disabled="disabledShree"
              type="primary"
              @click="clickAddSecurity"
            >
              选择安全产品
            </ElButton>
            <ElButton
              v-show="ruleForm.resource === '服务器巡检'"
              :disabled="disabledShree"
              type="primary"
              @click="clickAddService"
            >
              选择服务器
            </ElButton>
          </ElFormItem>
        </div>
        <div v-show="be===&quot;edit&quot;">
          <ElFormItem>
            <span :class="$style.fromName">*如果修改了巡检任务范围，将在下次刷新巡检记录时生效</span>
          </ElFormItem>
        </div>
        <div :class="$style.from">
          <ElFormItem prop="tableData">
            <ElTable
              :header-cell-style="{ backgroundColor: '#FBECEA' }"
              :data="ruleForm.tableData"
              highlight-current-row
              tooltip-effect="dark"
              style="width: 100%;"
              :class="$style.table"
              :row-key="rowKeys"
            >
              <template v-for="(ltem, index) in tabularData">
                <ElTableColumn
                  :key="index"
                  :label="ltem.label"
                  :prop="ltem.prop"
                />
              </template>
              <ElTableColumn
                v-if="be!=='details'"
                label="操作"
                width="80"
              >
                <template slot-scope="scope">
                  <ElButton
                    type="text"
                    size="small"
                    @click="handleClick(scope)"
                  >
                    移除
                  </ElButton>
                </template>
              </ElTableColumn>
            </ElTable>
          </ElFormItem>
        </div>
        <div :class="$style.from">
          <ElFormItem
            label="巡检频率"
            prop="days"
          >
            <ElRadioGroup
              v-model="ruleForm.days"
              :class="$style.radioGroup"
              @change="changeDays"
            >
              <ElRadio
                :disabled="disabledTwo"
                label="每天"
              />
              <ElRadio
                :disabled="disabledTwo"
                label="每月"
              />
            </ElRadioGroup>
          </ElFormItem>
        </div>
        <div :class="$style.from">
          <ElFormItem
            label="选择日期"
            prop="value"
          >
            <ElDatePicker
              v-model="ruleForm.value"
              :disabled="disabledTwo"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="ruleForm.days==='每天'?expireTimeOptionTwo:expireTimeOption"
              value-format="yyyy-MM-dd"
            />
          </ElFormItem>
        </div>
      </ElForm>
    </div>

    <div>
      <ElDialog
        :visible="visible"
        width="1100px"
        :title="'安全产品巡检'"
        @close="close"
      >
        <div>
          <ElForm
            :model="dlgForm"
            label-position="right"
            :label-width="CONFIG.labelWidth"
          >
            <div :class="$style.dlgForm">
              <div>
                <ElFormItem label="名称：">
                  <ElInput
                    v-model="dlgForm.ciName"
                    placeholder="请输入服务器巡检名称"
                    style="width: 220px;"
                    @input="searchName"
                  />
                </ElFormItem>
              </div>
              <div>
                <ElFormItem
                  :class="$style.citype"
                  label="部署网络环境："
                  prop="networkId"
                  style="width: 220px;"
                >
                  <ElSelect
                    v-model="dlgForm.networkId"
                    placeholder="请选择网络部署环境"
                    style="width: 220px;"
                    clearable
                    filterable
                    @change="changeNetwork"
                  >
                    <ElOption
                      v-for="(val, key) in ZONE"
                      :key="key"
                      :label="val"
                      :value="key"
                    />
                  </ElSelect>
                </ElFormItem>
              </div>
              <div>
                <ElFormItem
                  label="所属单位："
                  prop="company"
                >
                  <ElSelect
                    v-model="dlgForm.belongCompanyId"
                    placeholder="请选择单位"
                    style="width: 220px;"
                    clearable
                    filterable
                    @change="changeCompany"
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
              <div>
                <ElFormItem
                  :class="$style.citype"
                  label="类型："
                  prop="networkId"
                  style="width: 220px;"
                >
                  <ElSelect
                    v-model="dlgForm.ciType"
                    placeholder="请选择类型"
                    style="width: 220px;"
                    clearable
                    filterable
                    @change="changeciType"
                  >
                    <ElOption
                      v-for="(val, key) in PING"
                      :key="key"
                      :label="val"
                      :value="key"
                    />
                  </ElSelect>
                </ElFormItem>
              </div>
            </div>
          </ElForm>
        </div>
        <ElTable
          ref="multipleTable"
          v-loading="loading"
          :header-cell-style="{ backgroundColor: '#FBECEA' }"
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%;"
          :data="dlgData"
          :class="$style.table"
          :row-key="rowKeys"
          @selection-change="handleSelectionChange"
        >
          <ElTableColumn
            type="selection"
            reserve-selection
            width="55"
          />
          <template v-for="(item, index) in TITLE">
            <ElTableColumn
              :key="index"
              :label="item.label"
              :prop="item.prop"
              reserve-selection
            />
          </template>
        </ElTable>

        <template>
          <ElPagination
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
        <div :class="$style.sure">
          <ElButton
            type="primary"
            :class="$style.button"
            @click="sure"
          >
            确定
          </ElButton>

          <ElButton
            :class="$style.button"
            @click="dlogCancel"
          >
            取消
          </ElButton>
        </div>
      </ElDialog>

      <ElDialog
        :visible="visibleTwo"
        width="1100px"
        :title="'服务器巡检'"
        @close="close"
      >
        <div>
          <ElForm
            :model="dlgFormTwo"
            label-position="right"
            :label-width="CONFIG.labelWidth"
          >
            <div :class="$style.dlgForm">
              <div>
                <ElFormItem label="名称：">
                  <ElInput
                    v-model="dlgFormTwo.ciName"
                    placeholder="请输入服务器巡检名称"
                    style="width: 220px;"
                    @input="searchName"
                  />
                </ElFormItem>
              </div>
              <div>
                <ElFormItem
                  :class="$style.citype"
                  label="部署网络环境："
                  prop="networkId"
                  style="width: 220px;"
                >
                  <ElSelect
                    v-model="dlgFormTwo.networkId"
                    placeholder="请选择网络部署环境"
                    style="width: 220px;"
                    clearable
                    filterable
                    @change="changeNetwork"
                  >
                    <ElOption
                      v-for="(val, key) in TYPE"
                      :key="key"
                      :label="val"
                      :value="key"
                    />
                  </ElSelect>
                </ElFormItem>
              </div>
              <div>
                <ElFormItem
                  label="所属单位："
                  prop="company"
                >
                  <ElSelect
                    v-model="dlgFormTwo.belongCompanyId"
                    placeholder="请选择单位"
                    style="width: 220px;"
                    clearable
                    filterable
                    @change="changeCompany"
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
            </div>
          </ElForm>
        </div>
        <ElTable
          ref="multipleTable"
          v-loading="loading"
          :header-cell-style="{ backgroundColor: '#FBECEA' }"
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%;"
          :data="ServerBigData"
          :class="$style.table"
          :row-key="rowKeys"
          @selection-change="handleSelectionChange"
        >
          <ElTableColumn
            type="selection"
            reserve-selection
            width="55"
          />
          <template v-for="(item, index) in TITLETwo">
            <ElTableColumn
              :key="index"
              :label="item.label"
              :prop="item.prop"
              reserve-selection
            />
          </template>
        </ElTable>

        <template>
          <ElPagination
            :current-page="currentPageTwo"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSizeTwo"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalTwo"
            @size-change="handleSizeChangeTwo"
            @current-change="handleCurrentChangeTwo"
          />
        </template>

        <div :class="$style.sure">
          <ElButton
            type="primary"
            :class="$style.button"
            @click="sure"
          >
            确定
          </ElButton>

          <ElButton @click="dlogCancel">
            取消
          </ElButton>
        </div>
      </ElDialog>
    </div>

    <div :class="$style.elbutton">
      <ElButton
        v-show="be!=='details'"
        type="primary"
        @click="addSure"
      >
        {{ be==='add'?'添加':'保存' }}
      </ElButton>
      <ElButton @click="clickOpen">
        {{ be==='details'?'返回':'取消' }}
      </ElButton>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { TITLE, TITLETwo } from './indexTable'
import getCode from '@/enums/code'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import {
  theServer,
  cycleInformation,
  safetyProducts,
  modify,
  details,
} from '@/api/inspectionTask/inspectionTask'

const PING = getCode('1', 'SYS_asset_secu_dev_type')
const PHYSICAL = getCode('1', 'SYS_asset_type')
const ZONE = getCode('1', 'SYS_asset_secu_dev_de')
const CATEGORY = getCode('1', 'SYS_ASSET_BIZ_TYPE')
const TYPE = getCode('1', 'SYS_asset_network_type')
const DAYS = getCode('1', 'SYS_INSPECTION_CYCLE')
export default {
  props: {
    route: { type: Object, required: true },
    be: {
      type: String,
      default: String,
    },
  },
  components: {
    // ITable, ElTableColumn
  },
  data() {
    return {
      timeer: -1,
      loading: true,
      disabledTwo: false,
      disabledShree: this.be === 'details',
      disabled: this.be === 'edit' || this.be === 'details',
      ids: '',
      id: '',
      ServerBigData: [],
      visibleTwo: false,
      ServerData: [],
      totalTwo: 0,
      pageSizeTwo: 10,
      currentPageTwo: 1,
      formName: [],
      organizations: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dlgData: [],
      dlgDatatwo: [],
      dlgFormTwo: {
        ciName: '',
        ciTypeStr: '',
        networkId: '',
        belongCompanyId: '',
      },
      dlgForm: {
        ciName: '',
        ciTypeStr: '',
        networkId: '',
        belongCompanyId: '',
      },
      visible: false,
      pickerMinDate: '', // 获取开始选择时间
      pickerMaxDate: '', // 获取结束选择时间
      expireTimeOption: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate) {
            this.pickerMinDate = minDate.getTime()
          }
          if (maxDate) {
            this.pickerMinDate = ''
            this.pickerMaxDate = maxDate.getTime()
          }
        },
        disabledDate: (time) => {
          const day30 = 30 * 24 * 3600 * 1000
          if (this.pickerMinDate !== '') {
            const mintime = this.pickerMinDate
            const maxtime = mintime + day30
            return maxtime > time.getTime()
          } else {
            return time.getTime() < Date.now()
          }
        },
      },
      expireTimeOptionTwo: {
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        },
      },
      tabularData: [],
      filterForm: {},
      ruleForm: {
        resource: '安全产品巡检',
        tableData: [],
        days: '每天',
        value: [],
      },
      rules: {
        tableData: [
          {
            required: true,
            message: '请添加安全产品巡检或者服务器巡检',
            trigger: 'blur',
          },
        ],
        days: [{ required: true, message: '请选择巡检周期', trigger: 'blur' }],
        value: [{ required: true, message: '请输入日期', trigger: 'blur' }],
        resource: [
          { required: true, message: '请选择产品类型', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    PING: () => PING.value || [],
    DAYS: () => DAYS.value || [],
    TYPE: () => TYPE.value,
    ZONE: () => ZONE.value || [],
    PHYSICAL: () => PHYSICAL.value || [],
    TITLE: () => TITLE,
    TITLETwo: () => TITLETwo,
    CATEGORY: () => CATEGORY.value || [],
  },
  methods: {
    changeDays() {
      this.ruleForm.value = []
    },
    clickOpen() {
      this.$router.back()
    },
    details() {
      this.id = this.route.params.id
      details(this.id).then((res) => {
        if (res.data.body) {
          this.ruleForm.value.push(res.data.body.inspectionStartTimeStr)
          this.ruleForm.value.push(res.data.body.inspectionEndTimeStr)
          this.ruleForm.days = res.data.body.inspectionCycleName
          this.disabledTwo = res.data.body.inspectionStartTime < (new Date()).valueOf()
          this.ruleForm.resource =
            res.data.body.safetyInspectionType === 'SYS_SECURITY_INSPECTION'
              ? '安全产品巡检'
              : '服务器巡检'
          this.tabularData =
            res.data.body.safetyInspectionType === 'SYS_SECURITY_INSPECTION'
              ? this.TITLE
              : this.TITLETwo
          this.ids = res.data.body.id
          const from = {
            safetyInspectionCycleId: res.data.body.id,
            safetyInspectionType: res.data.body.safetyInspectionType,
          }
          modify(from).then((res) => {
            if (res.data.body) {
              this.ruleForm.tableData = res.data.body
              this.ruleForm.tableData.forEach((item) => {
                item.id = item.assetId
                this.$set(item, 'Intranet', '')
                this.$set(item, 'Extranet', '')
                if (this.ruleForm.resource === '服务器巡检') {
                  item.addresses.forEach((val) => {
                    if (val.type === 1) {
                      item.Intranet += `${val.ip}` + ','
                    } else {
                      item.Extranet += `${val.ip}` + ','
                    }
                  })
                }
                item.Intranet = item.Intranet.substr(
                  0,
                  item.Intranet.length - 1
                )
                item.Extranet = item.Extranet.substr(
                  0,
                  item.Extranet.length - 1
                )
              })
            }
          })
        }
      })
    },
    addSure() {
      ;(this.$refs.ruleForm as any).validate((valid: boolean) => {
        if (valid) {
          const day =
            this.ruleForm.days === '每天'
              ? 'SYS_EVERY_DAY'
              : 'SYS_EVERY_MONTHLY'
          const host =
            this.ruleForm.resource === '安全产品巡检'
              ? 'SYS_SECURITY_INSPECTION'
              : 'SYS_SERVER_INSPECTION'
          const tableDate = []
          this.ruleForm.tableData.map((item, index) => {
            if (item.id) {
              tableDate.push({ assetId: '' })
              tableDate[index].assetId = item.id
            }
          })
          const from = {
            id: this.ids,
            safetyInspections: tableDate,
            inspectionCycle: day,
            inspectionStartTimeStr: this.ruleForm.value[0] || '',
            inspectionEndTimeStr: this.ruleForm.value[1] || '',
            safetyInspectionType: host,
          }
          cycleInformation(from).then((res) => {
            if (res.data.body) {
              this.$router.back()
              this.$notify.success(this.be === 'add' ? '添加成功' : '保存成功')
            } else {
              this.$message.error(res.data.msg || '保存失败,请稍后再试')
            }
          })
        }
      })
    },
    handleClick(val) {
      const index = val.$index
      this.ruleForm.tableData.splice(index, 1)
    }, // 移除
    changeciType() {
      this.loading = true
      this.currentPage = 1
      this.querypageBizForOP()
    },
    changeCompany() {
      this.loading = true
      this.ruleForm.resource === '安全产品巡检'
        ? this.currentPage = 1
        : this.currentPageTwo = 1
      this.ruleForm.resource === '安全产品巡检'
        ? this.querypageBizForOP()
        : this.theServer()
    },
    changeNetwork() {
      this.loading = true
      this.ruleForm.resource === '安全产品巡检'
        ? this.currentPage = 1
        : this.currentPageTwo = 1
      this.ruleForm.resource === '安全产品巡检'
        ? this.querypageBizForOP()
        : this.theServer()
    },
    searchName() {
      clearTimeout(this.timeer)
      this.timeer = setTimeout(() => {
        this.loading = true
        this.ruleForm.resource === '安全产品巡检'
          ? this.currentPage = 1
          : this.currentPageTwo = 1
        this.ruleForm.resource === '安全产品巡检'
          ? this.querypageBizForOP()
          : this.theServer()
      }, 200)
    },
    clickAddSecurity() {
      this.visible = true
      this.loading = true
      this.querypageBizForOP()
    },
    clickAddService() {
      this.loading = true
      this.theServer()
      this.visibleTwo = true
    },
    theServer() {
      this.ServerBigData = []
      const from = {
        pageSize: this.pageSizeTwo,
        page: this.currentPageTwo,
        keyword: this.dlgFormTwo.ciName,
        ciType: this.dlgFormTwo.ciType,
        networkTypeCode: this.dlgFormTwo.networkId,
        belongCompanyId: this.dlgFormTwo.belongCompanyId,
      }
      theServer(from).then((res) => {
        if (res.data.body) {
          this.totalTwo = res.data.body.total
          this.ServerBigData = res.data.body.data
          this.ServerBigData.forEach((item) => {
            this.$set(item, 'Intranet', '')
            this.$set(item, 'Extranet', '')
            item.addresses.forEach((val) => {
              if (val.type === 1) {
                item.Intranet += `${val.ip}` + ','
              } else {
                item.Extranet += `${val.ip}` + ','
              }
            })
            item.Intranet = item.Intranet.substr(0, item.Intranet.length - 1)
            item.Extranet = item.Extranet.substr(0, item.Extranet.length - 1)
          })
          this.$refs.multipleTable.clearSelection()
          this.loading = false
        }
      })
    },
    querypageBizForOP() {
      this.dlgData = []
      const from = {
        pageSize: this.pageSize,
        page: this.currentPage,
        keyword: this.dlgForm.ciName,
        ciType: this.dlgForm.ciType,
        deployEnvir: this.dlgForm.networkId,
        belongCompanyId: this.dlgForm.belongCompanyId,
      }
      safetyProducts(from).then((res) => {
        if (res.data.body) {
          this.$refs.multipleTable.clearSelection()
          this.total = res.data.body.total
          this.dlgData = res.data.body.list
          this.loading = false
        }
      })
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
    dlogCancel() {
      this.visible = false
      this.visibleTwo = false
    },
    sure() {
      this.visible = false
      this.visibleTwo = false
      if (this.ruleForm.resource === '安全产品巡检' && this.be === 'add') {
        const arr = this.ruleForm.tableData.concat(
          this.dlgDatatwo
        )
        const res = new Map()
        this.ruleForm.tableData = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
        this.dlgDatatwo = this.ruleForm.tableData
      } else if (
        this.ruleForm.resource === '服务器巡检' &&
        this.be === 'add'
      ) {
        const arr = this.ruleForm.tableData.concat(
          this.ServerData
        )
        const res = new Map()
        this.ruleForm.tableData = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
        this.ServerData = this.ruleForm.tableData
      }
      if (this.ruleForm.resource === '安全产品巡检' && this.be === 'edit') {
        const arr = this.ruleForm.tableData.concat(
          this.dlgDatatwo
        )
        const res = new Map()
        this.ruleForm.tableData = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
        this.dlgDatatwo = this.ruleForm.tableData
      } else if (
        this.ruleForm.resource === '服务器巡检' &&
        this.be === 'edit'
      ) {
        const arr = this.ruleForm.tableData.concat(
          this.ServerData
        )
        const res = new Map()
        this.ruleForm.tableData = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
        this.ServerData = this.ruleForm.tableData
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.currentPage = val
      this.querypageBizForOP()
    },
    handleCurrentChangeTwo(val) {
      this.loading = true
      this.currentPageTwo = val
      this.theServer()
    },
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.querypageBizForOP()
    },
    handleSizeChangeTwo(val) {
      this.loading = true
      this.pageSizeTwo = val
      this.theServer()
    },
    close() {
      this.visible = false
      this.visibleTwo = false
    },

    change(val) {
      this.tabularData = val === '安全产品巡检' ? this.TITLE : this.TITLETwo
      this.ruleForm.tableData =
        val === '安全产品巡检' ? this.dlgDatatwo : this.ServerData
    },

    rowKeys(row) {
      return row.id
    },
    handleSelectionChange(val) {
      if (this.ruleForm.resource === '安全产品巡检') {
        this.dlgDatatwo = val
      } else {
        this.ServerData = val
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
  },
  created() {
    if (this.be === 'edit' || this.be === 'details') {
      this.details()
    } else {
      this.tabularData = this.TITLE
    }
    this.fetchOrganization()
  },
}
</script>
<style lang="scss" module>
.ruleFrom {
  margin: 24px 0;
}

.from {
  margin-bottom: 24px;
}

.table {
  width: 70%;
  margin: auto;
}

.elbutton {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.name {
  width: 99%;
  min-height: 28px;
  margin: auto;
  margin: 24px 0;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid#dcdcdc;
}

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.dlgForm {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.sure {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;

  .button {
    width: 80px;
  }
}

.radioGroup {
  :global(.el-radio__input.is-checked + .el-radio__label) {
    color: #d5402b !important;
  }

  :global(.el-radio__input.is-checked .el-radio__inner) {
    background: #d5402b !important;
    border-color: #d5402b !important;
  }
}

.fromName {
  // margin-bottom: 4px;
  color: #d5402b;
  font-size: 10px;
}
</style>
