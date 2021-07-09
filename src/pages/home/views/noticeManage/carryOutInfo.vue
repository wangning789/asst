<template>
  <div class="el-card">
    <!-- 通知 -->
    <div :class="$style.contentBox">
      <ElRow>
        <ElCol :span="24">
          <!-- 标题 -->
          <h3>通报详情</h3>
        </ElCol>
        <ElCol :span="24">
          <ElRow
            type="flex"
            justify="space-between"
          >
            <ElCol :span="8">
              <span>通报类型：</span>
              <span>{{ CIRCULARTYPE }}</span>
            </ElCol>
            <ElCol
              :span="8"
              style="text-align: center;"
            >
              <span>创建时间：</span>
              <span>{{ infoList.createDate }}</span>
            </ElCol>
            <ElCol
              :span="8"
              style="text-align: right;"
            >
              <span>通报状态：</span>
              <span style="color: #e6a23c;">{{ CIRCULARSTATUS }}</span>
            </ElCol>
          </ElRow>
        </ElCol>
        <!-- 通知内容详情 -->
        <ElCol
          :class="$style.noticeInfoBox"
          :span="24"
        >
          <ElScrollbar style="height: 100%;">
            <div :class="$style.noticeInfo">
              <h3>{{ infoList.title }}</h3>
              <div v-html="infoList.content" />
            </div>
          </ElScrollbar>
        </ElCol>
      </ElRow>
      <!-- 通报反馈 -->
      <ElRow v-if="infoList.circularType === 'SYS_THREAT_VUL_CIRCULAR'">
        <ElCol :span="24">
          <ElRow :class="$style.feedbackTitle">
            <ElCol :span="12">
              <h3>通报反馈</h3>
            </ElCol>
          </ElRow>
        </ElCol>
        <ElCol :span="24">
          <ElForm
            ref="form"
            label-position="right"
            label-width="220px"
            :model="feedbackList"
          >
            <ElRow>
              <ElCol :span="24">
                <ElFormItem label="漏洞是否对本单位资产有影响：">
                  <div>{{ FEEDBACKINFLUENCE }}</div>
                </ElFormItem>
              </ElCol>
              <div v-show="checkDisplay">
                <ElCol :span="24">
                  <ElFormItem
                    label="影响资产数量："
                    prop="feedbackAssetNum"
                  >
                    <div>{{ feedbackList.feedbackAssetNum }}</div>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="24">
                  <ElFormItem label="影响资产详情：">
                    <ElTabs v-model="activeTab">
                      <ElTabPane
                        label="应用系统"
                        name="business"
                      >
                        <div :class="$style.tableWrap">
                          <ElTable
                            ref="table"
                            :data="
                              businessList.slice(
                                (currentPage1 - 1) * pageSize1,
                                currentPage1 * pageSize1
                              )
                            "
                            border
                            :class="$style.elTable"
                            max-height="400"
                          >
                            <ElTableColumn
                              v-for="(item, index) in businessHead"
                              :key="index"
                              :prop="item.prop"
                              :label="item.label"
                            />
                          </ElTable>
                          <template>
                            <ElPagination
                              :current-page="currentPage1"
                              :page-sizes="[5, 10, 20, 50]"
                              :page-size="pageSize1"
                              layout="total, sizes, prev, pager, next, jumper"
                              :total="businessTotal"
                              @size-change="handleSizeChange1"
                              @current-change="handleCurrentChange1"
                            />
                          </template>
                        </div>
                      </ElTabPane>
                      <ElTabPane
                        label="服务器"
                        name="host"
                      >
                        <div :class="$style.tableWrap">
                          <ElTable
                            ref="table"
                            :data="
                              hostList.slice(
                                (currentPage2 - 1) * pageSize2,
                                currentPage2 * pageSize2
                              )
                            "
                            border
                            :class="$style.elTable"
                            max-height="400"
                          >
                            <ElTableColumn
                              v-for="(item, index) in hostHead"
                              :key="index"
                              :prop="item.prop"
                              :label="item.label"
                              :formatter="item.formatter"
                            />
                          </ElTable>
                          <template>
                            <ElPagination
                              :current-page="currentPage2"
                              :page-sizes="[5, 10, 20, 50]"
                              :page-size="pageSize2"
                              layout="total, sizes, prev, pager, next, jumper"
                              :total="hostTotal"
                              @size-change="handleSizeChange2"
                              @current-change="handleCurrentChange2"
                            />
                          </template>
                        </div>
                      </ElTabPane>
                      <ElTabPane
                        label="安全产品"
                        name="securityProducts"
                      >
                        <div :class="$style.tableWrap">
                          <ElTable
                            ref="table"
                            :data="
                              security.slice(
                                (currentPage3 - 1) * pageSize3,
                                currentPage3 * pageSize3
                              )
                            "
                            border
                            :class="$style.elTable"
                            max-height="400"
                          >
                            <ElTableColumn
                              v-for="(item, index) in securityHead"
                              :key="index"
                              :prop="item.prop"
                              :label="item.label"
                              :formatter="item.formatter"
                            />
                          </ElTable>
                          <template>
                            <ElPagination
                              :current-page="currentPage3"
                              :page-sizes="[5, 10, 20, 50]"
                              :page-size="pageSize3"
                              layout="total, sizes, prev, pager, next, jumper"
                              :total="securityTotal"
                              @size-change="handleSizeChange3"
                              @current-change="handleCurrentChange3"
                            />
                          </template>
                        </div>
                      </ElTabPane>
                    </ElTabs>
                  </ElFormItem>
                </ElCol>

                <ElCol :span="24">
                  <ElFormItem
                    label="文本记录:"
                    prop="feedbackContent"
                  >
                    <div>{{ feedbackList.feedbackContent }}</div>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="20">
                  <ElFormItem label="附件:">
                    <div
                      v-for="(item, i) in feedbackListArr"
                      :key="i"
                      :class="$style.download"
                      @click="download(item, i)"
                    >
                      {{ item }}
                    </div>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="24">
                  <ElFormItem label="任务列表:">
                    <div :class="$style.tableWrap">
                      <ElTable
                        :class="$style.elTable"
                        :data="relatedTasks"
                        style="text-align: center;"
                      >
                        <ElTableColumn
                          prop="taskNo"
                          label="任务编号"
                        />
                        <ElTableColumn
                          prop="taskTypeCode"
                          label="任务类型"
                        />
                        <ElTableColumn
                          prop="taskLevel"
                          label="任务级别"
                        />
                        <ElTableColumn
                          prop="createDate"
                          label="创建时间"
                        />
                        <ElTableColumn
                          prop="modifyDate"
                          label="办结时间"
                        />
                      </ElTable>
                    </div>
                  </ElFormItem>
                </ElCol>
              </div>
            </ElRow>
          </ElForm>
        </ElCol>
      </ElRow>
      <!-- IP通报反馈 -->
      <ElRow v-if="infoList.circularType === 'SYS_THREAT_IP_CIRCULAR'">
        <ElCol :span="24">
          <h3>通报反馈</h3>
        </ElCol>
        <ElCol :span="24">
          <ElForm
            ref="form"
            label-position="left"
            label-width="80px"
            :model="feedbackList"
          >
            <ElCol :span="24">
              <ElFormItem
                label="反馈详情:"
                prop="feedbackContent"
              >
                <div>{{ feedbackList.feedbackContent }}</div>
              </ElFormItem>
            </ElCol>
            <ElCol :span="10">
              <ElFormItem label="附件:">
                <div
                  v-for="(item, i) in feedbackListArr"
                  :key="i"
                  :class="$style.download"
                  @click="download(item, i)"
                >
                  {{ item }}
                </div>
              </ElFormItem>
            </ElCol>
          </ElForm>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script>
import { getCircularDetail } from '@/api/noticeManage/loopholeInfo'

import { HEAD, upload, download } from '@/api/tools/file'
import { decode } from '@/functions/cipher'
import getCode from '@/enums/code'
// 码表
// 通报类型
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')
// 是否有影响
const FEEDBACKINFLUENCE = getCode('1', 'SYS_FEEDBACK_INFLUENCE')
// 通报状态
const CIRCULARSTATUS = getCode('1', 'SYS_CIRCULAR_STATUS')

export default {
  data() {
    return {
      feedbackListArr: [],
      relatedTasks: [],
      infoList: {},
      affectAssetsInfo: [],
      id: this.$route.params.id,
      feedbackList: {
        feedbackFile: '',
        feedbackFileName: '',
        circularUserAssetList: [],
      },
      dialogVisible: false,
      problemVisible: false,
      completeId: '',
      display: false,
      activeTab: 'business',
      hostList: [],
      businessList: [],
      security: [],
      currentPage1: 1,
      pageSize1: 10,
      businessTotal: 0,
      currentPage2: 1,
      pageSize2: 10,
      hostTotal: 0,
      currentPage3: 1,
      pageSize3: 10,
      securityTotal: 0,
    }
  },
  computed: {
    CIRCULARTYPE() {
      let newVal = ''
      for (const val in CIRCULARTYPE.value) {
        if (val === this.infoList.circularType) {
          newVal = CIRCULARTYPE.value[val]
        }
      }
      return newVal
    },
    FEEDBACKINFLUENCE() {
      let newVal = ''
      for (const val in FEEDBACKINFLUENCE.value) {
        if (val === this.feedbackList.feedbackInfluence) {
          newVal = FEEDBACKINFLUENCE.value[val]
        }
      }
      return newVal
    },
    CIRCULARSTATUS() {
      let newVal = ''
      for (const val in CIRCULARSTATUS.value) {
        if (val === this.infoList.circularStatus) {
          newVal = CIRCULARSTATUS.value[val]
        }
      }
      return newVal
    },
    checkDisplay() {
      return this.feedbackList.feedbackInfluence !== 'SYS_NO_INFLUENCE'
    },
    HEAD: () => HEAD,
    upload,
    businessHead: () => [
      { prop: 'ciName', label: '系统名称' },
      { prop: 'networkStr', label: '系统部署环境' },
      { prop: 'internetAddress', label: '互联网访问地址' },
      { prop: 'intranetAddress', label: '内网访问地址' },
      { prop: 'belongCompanyStr', label: '所属单位' },
    ],
    hostHead: () => [
      { prop: 'ciName', label: '服务器名称' },

      {
        label: 'IP(内网)',
        formatter: (row) => {
          const addresses = row.addresses || []
          let res = ''
          const ip = []
          addresses.length &&
            addresses.forEach((item) => {
              if (item.type === 1) {
                item.ip && ip.push(item.ip)
              }
            })
          res = ip.length > 1 ? ip.join(', ') : ip[0]
          return res
        },
      },
      {
        label: 'IP(互联网)',
        formatter: (row) => {
          const addresses = row.addresses || []
          let res = ''
          const ip = []
          addresses.length &&
            addresses.forEach((item) => {
              if (item.type === 2) {
                item.ip && ip.push(item.ip)
              }
            })
          res = ip.length > 1 ? ip.join(', ') : ip[0]
          return res
        },
      },
      { prop: 'belongCompanyName', label: '所属单位' },
      { prop: 'networkTypeName', label: '部署网络环境' },
    ],
    securityHead: () => [
      { prop: 'ciName', label: '安全产品名称' },
      { prop: 'ciType', label: '安全产品类型' },
      { prop: 'deployEnvir', label: '部署网络环境' },
      { prop: 'internetIp', label: 'IP（互联网）' },
      { prop: 'intranetIp', label: 'IP（内网）' },
      { prop: 'belongCompanyId', label: '所属单位' },
    ],
  },
  methods: {
    download(item, index) {
      const id = this.feedbackList.feedbackFile
      const ids = id.split(',')
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = download(ids[index])
      link.click()
      link = null
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
    },
    handleSizeChange2(val) {
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    handleSizeChange3(val) {
      this.pageSize3 = val
    },
    handleCurrentChange3(val) {
      this.currentPage3 = val
    },
  },
  created() {
    getCircularDetail({ circularId: this.id }).then((res) => {
      this.infoList = res.data.body
      this.infoList.content = decode(this.infoList.content)
      this.feedbackList = res.data.body.circularUserRelList[0]
      if (this.feedbackList.feedbackFileName) {
        this.feedbackListArr = this.feedbackList.feedbackFileName.split(',')
      }
      this.affectAssetsInfo = this.feedbackList.circularUserAssetList
      this.relatedTasks = this.feedbackList.workTaskDTOList
      this.businessList = res.data.body.business || []
      this.hostList = res.data.body.associateHost || []
      this.security = res.data.body.securityDevice || []
      if (res.data.body.business === null) {
        return
      } else if (res.data.body.business.length) {
        this.businessTotal = res.data.body.business.length
      } else {
        return
      }
      if (res.data.body.associateHost === null) {
        return
      } else if (res.data.body.associateHost.length) {
        this.hostTotal = res.data.body.associateHost.length
      } else {
        return
      }
      if (res.data.body.securityDevice === null) {

      } else if (res.data.body.securityDevice.length) {
        this.securityTotal = res.data.body.securityDevice.length
      } else {

      }
    })
  },
}
</script>

<style lang="scss" module>
.el-card {
  padding: 0 30px;
}

.noticeInfoBox {
  height: 400px;
  margin: 30px 0;
  background-color: #f2f4f8;
}

.noticeInfo {
  padding: 30px;
  line-height: 30px;

  div {
    padding: 20px 0;
  }

  h3 {
    text-align: center;
  }
}

.feedbackTitle {
  display: flex;
  align-items: center;

  .feedbackTitle_right {
    text-align: right;
  }
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.tableWrap {
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

.radioGroup {
  :global(.el-radio__input.is-checked + .el-radio__label) {
    color: #d5402b !important;
  }

  :global(.el-radio__input.is-checked .el-radio__inner) {
    background: #d5402b !important;
    border-color: #d5402b !important;
  }
}

.ipStyle {
  margin: 0 0 20px !important;
}

.download {
  width: fit-content;
  color: #76b4f2;
  cursor: pointer;
}
</style>
