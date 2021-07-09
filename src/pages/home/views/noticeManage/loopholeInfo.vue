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
      <!-- 通报反馈情况 -->
      <ElRow>
        <ElCol :span="24">
          <ElRow :class="$style.feedbackTitle">
            <ElCol :span="12">
              <h3>通报反馈情况</h3>
            </ElCol>
            <ElCol :span="12">
              <ElRow style="text-align: right;">
                <ElCol :span="8">
                  <span>未反馈：</span>
                  <span style="color: #f56c6c;">{{ infoList.feedbackNo }}</span>
                </ElCol>
                <ElCol :span="8">
                  <span>已反馈：</span>
                  <span style="color: #e6a23c;">{{ infoList.feedbackNum }}</span>
                </ElCol>
                <ElCol :span="8">
                  <span>反馈完成：</span>
                  <span style="color: #67c23a;">{{
                    infoList.feedbackComplete
                  }}</span>
                </ElCol>
              </ElRow>
            </ElCol>
          </ElRow>
        </ElCol>
        <ElCol :span="24">
          <ElTable
            ref="multipleTable"
            :key="keyNum"
            :header-cell-style="{ background: '#f2f4f8', color: '#606266' }"
            :data="feedbackList"
            :row-class-name="getRowClass"
            stripe
          >
            <ElTableColumn type="expand">
              <template slot-scope="props">
                <div style="margin-left: 490px;">
                  <div
                    v-for="(item, index) in props.row.workTaskDTOList"
                    :key="index"
                  >
                    <span style="margin: 0 20px;">{{ item.taskTitle }}</span>
                    <span
                      :style="{
                        color:
                          item.taskStatus === 'finished'
                            ? '#67C23A'
                            : item.taskStatus === 'terminate'
                              ? 'red'
                              : '#E6A23C',
                      }"
                    >{{
                      item.taskStatus === 'finished'
                        ? '已完成'
                        : item.taskStatus === 'terminate'
                          ? '已终止'
                          : item.taskStatus === 'pending'
                            ? '待处理'
                            : '处理中'
                    }}</span>
                  </div>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn>
              <template slot-scope="scope">
                <ElButton
                  size="mini"
                  :type="
                    scope.row.feedbackStatus === '待反馈'
                      ? 'warning'
                      : scope.row.feedbackStatus === '未反馈'
                        ? 'danger'
                        : 'success'
                  "
                  plain
                >
                  {{ scope.row.feedbackStatus }}
                </ElButton>
              </template>
            </ElTableColumn>

            <ElTableColumn
              label="单位名称"
              width="220"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.organizationName }}</div>
                <div :class="$style.greyColor">
                  完成时间：{{ scope.row.feedbackCompleteDate }}
                  <span
                    v-show="scope.row.feedbackCompleteDate === null"
                  >——————</span>
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn
              v-if="!(infoList.circularType === 'SYS_THREAT_IP_CIRCULAR')"
              label="资产影响情况"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.feedbackInfluence }}</div>
                <div
                  :class="$style.feedbackNum"
                  @click="showUserAsset(scope.row)"
                >
                  {{ scope.row.feedbackAssetNum }}
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn
              label="详情"
              width="500"
            >
              <template slot-scope="scope">
                <div :class="$style.greyColor">
                  {{ scope.row.feedbackContent }}
                  <span v-show="scope.row.feedbackContent === null">
                    ——————
                  </span>
                  <span
                    v-for="(item, index) in scope.row.feedbackFileName"
                    v-show="!(scope.row.feedbackFileName === null)"
                    :key="index"
                    :class="$style.feedbackFileName"
                    @click="dowloadFile(scope.row, index)"
                  >{{ item }}
                  </span>
                </div>
                <div
                  v-if="!(infoList.circularType === 'SYS_THREAT_IP_CIRCULAR')"
                >
                  <span
                    :class="$style.greyColor"
                  >相关任务:
                    <span v-show="scope.row.workTaskDTOList === null">无</span>
                  </span>
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="操作">
              <template slot-scope="scope">
                <ElButton
                  v-show="
                    scope.row.feedbackStatus === '已反馈' &&
                      scope.row.showFinish === true
                  "
                  size="mini"
                  :disabled="
                    authFit(ROLES.groupLeaders) || authFit(ROLES.projectManager)
                  "
                  @click="deleteInfo(scope.row, scope.$index)"
                >
                  确认完成
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCol>
      </ElRow>
    </div>
    <ElDialog
      :visible.sync="userDialogVisible"
      title="影响资产列表"
    >
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
              max-height="550"
            >
              <ElTableColumn
                v-for="(item, index) in businessHead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
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
                  (currentPage1 - 1) * pageSize1,
                  currentPage1 * pageSize1
                )
              "
              border
              :class="$style.elTable"
              max-height="550"
            >
              <ElTableColumn
                v-for="(item, index) in hostHead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
                show-overflow-tooltip
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
                  (currentPage1 - 1) * pageSize1,
                  currentPage1 * pageSize1
                )
              "
              border
              :class="$style.elTable"
              max-height="550"
            >
              <ElTableColumn
                v-for="(item, index) in securityHead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
                show-overflow-tooltip
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
    </ElDialog>
  </div>
</template>

<script>
import { ElTableColumn } from '@com/Table'
import {
  queryList,
  updateCircularFeedbackStatus,
} from '@/api/noticeManage/loopholeInfo'
import { download } from '@/api/tools/file'
import { ROLES } from '@/enums'

import { decode } from '@/functions/cipher'
import getCode from '@/enums/code'
// 码表
// 通报类型
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')
// 通报状态
const CIRCULARSTATUS = getCode('1', 'SYS_CIRCULAR_STATUS')
export default {
  components: { ElTableColumn },
  data() {
    return {
      infoList: {},
      id: this.$route.params.id,
      feedbackList: [{ feedbackFileName: [], feedbackFile: [] }],
      userDialogVisible: false,
      completeId: '',
      buttonColor: '',
      feedbackId: '',
      userAsset: [],
      keyNum: 0,
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
    ROLES: () => ROLES,
    CIRCULARTYPE() {
      let newVal = ''
      for (const val in CIRCULARTYPE.value) {
        if (val === this.infoList.circularType) {
          newVal = CIRCULARTYPE.value[val]
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
    deleteInfo(row, index) {
      this.$confirm('确认反馈已完成？', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      })
        .then(() => {
          updateCircularFeedbackStatus({ feedbackId: row.id }).then((res) => {
            if (res.data.status === true) {
              this.$notify.success('确认完成成功!')
              this.feedbackList[index].showFinish = false
              this.feedbackList[index].feedbackStatus = '反馈完成'
              this.getList().then((res) => {
                this.infoList.feedbackNo = res.data.body.feedbackNo
                this.infoList.feedbackComplete = res.data.body.feedbackComplete
                this.infoList.feedbackNum = res.data.body.feedbackNum
              })
            }
            this.keyNum += 1
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认',
          })
        })
    },
    getRowClass: function(row) {
      if (row.row.workTaskDTOList === null) {
        // 判断当前行是否有子数据
        return 'rowExpandCover'
      }
    },
    dowloadFile(res, index) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = download(res.feedbackFile[index])
      link.click()
      link = null
    },
    showUserAsset(data) {
      this.userDialogVisible = true
      this.businessList = data.circularUserAssetList.business || []
      this.hostList = data.circularUserAssetList.associateHost || []
      this.security = data.circularUserAssetList.securityDevice || []
      this.businessTotal = data.circularUserAssetList.business.length
      this.hostTotal = data.circularUserAssetList.associateHost.length
      this.securityTotal = data.circularUserAssetList.securityDevice.length
    },

    getList() {
      queryList({ circularId: this.id }).then((res) => {
        this.infoList = res.data.body
        this.infoList.content = decode(this.infoList.content)
        this.feedbackList = res.data.body.circularUserRelList

        this.feedbackList.forEach((item) => (item.showFinish = true))
        for (let i = 0; i < this.feedbackList.length; i++) {
          if (this.feedbackList[i].feedbackFileName) {
            const a = this.feedbackList[i].feedbackFileName
              .slice(0, this.feedbackList[i].feedbackFileName.length)
              .split(',')
            const b = this.feedbackList[i].feedbackFile
              .slice(0, this.feedbackList[i].feedbackFile.length)
              .split(',')
            this.feedbackList[i].feedbackFileName = a
            this.feedbackList[i].feedbackFile = b
          }
        }
      })
    },
  },
  created() {
    this.getList()
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
  justify-content: space-between;

  .feedbackTitle_right {
    text-align: right;
  }
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.feedbackNum {
  cursor: pointer;
}

.feedbackNum:hover {
  color: #3374c4;
  text-decoration: underline;
}

.feedbackFileName {
  padding-left: 20px;
  color: #3374c4;
  cursor: pointer;
}

:global(.rowExpandCover .el-table__expand-icon) {
  display: none !important;
}

.greyColor {
  color: #999;
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
</style>
