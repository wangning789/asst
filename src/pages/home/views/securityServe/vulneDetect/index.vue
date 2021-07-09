<!-- 描述 -->
<template>
  <div>
    <div :class="$style.blkBox">
      <div :class="$style.titBox">
        <h3 :class="[$style.title,$style.fl]">
          主机漏洞检测服务
        </h3>
        <p :class="$style.codeDes">
          <span>待交付:<em :class="$style.crl1">{{ codeFrom.toBeDelivered }}</em></span>
          <span>交付完成:<em :class="$style.crl2">{{ codeFrom.deliveryComplete }}</em></span>
        </p>
        <ElButton
          :class="[$style.sqBtn,$style.fr]"
          @click="applyServ"
        >
          申请服务
        </ElButton>
      </div>

      <ElRow>
        <ElCol :span="14">
          <P :class="$style.newTim">
            最新漏洞扫描时间：{{ jcFrom.lastVulnerabilityScanTime || '--' }}
          </P>
          <ElRow>
            <ElCol :span="8">
              <div :class="$style.smLdBox">
                <div :class="[$style.echartitem,$style.fl]">
                  <i class="i-cunzailoudongdezichan" />
                  <p :class="$style.des">
                    <span :class="$style.titleSty">存在漏洞的资产总数</span><br>
                    <b :class="$style.fontSty1">{{ jcFrom.thereAre }}</b>
                  </p>
                </div>
              </div>
            </ElCol>
            <ElCol :span="16">
              <div :class="$style.smLdBox">
                <div :class="[$style.echartitem,$style.fl]">
                  <i class="i-weixiufuloudong" />
                  <p :class="$style.des">
                    <span :class="$style.titleSty">未修复漏洞数</span><br>
                    <b :class="$style.fontSty1">{{ notFixedTotalCount }}</b>
                  </p>

                  <div :class="$style.eventFilter">
                    <GressBar
                      :high-data="notFixedhighCount || 0"
                      :mld-data="notFixedMediumCount || 0"
                      :low-data="notFixedLowRiskCount || 0"
                    />
                  </div>
                </div>
              </div>
            </ElCol>
          </ElRow>
        </ElCol>
        <ElCol :span="10">
          <div :class="$style.echartBox">
            <h3 :class="[$style.title]">
              漏洞风险最高的资产TOP5
            </h3>

            <div
              v-for="(item,index) of riskXAxisArr"
              :key="index"
              :class="$style.zcPrassList"
            >
              <span>资产名称</span>
              <b>{{ item.name }}</b>
              <ElProgress
                v-if="`${item.value}`"
                :class="$style.gressWidth"
                color="#7BB1F4"
                :text-inside="true"
                :stroke-width="10"
                :percentage="parseInt(`${item.value}`)"
              />
            </div>
            <div
              v-if="!riskXAxisArr || !riskXAxisArr.length"
              :class="$style.kbBox"
            >
              <i class="i-zanwushuju2" /><br>
              <span>暂无数据</span>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>
    <!-- table -->
    <div :class="[$style.blkBox,$style.mtp2]">
      <ElTabs
        v-model="activeName"
        type="card"
      >
        <ElTabPane
          label="已扫描资产清单"
          name="0"
        >
          <ElForm
            :inline="true"
          >
            <ElFormItem>
              <ElInput
                v-model="params.keyword"
                clearable
                placeholder="请输入IP、资产名称"
              />
            </ElFormItem>
          </ElForm>
          <ITable
            v-if="activeName==='0'"
            ref="table"
            :get="alreadyAssetList"
            :query="query1"
            :head="head1"
          >
            <ElTableColumn
              label="操作"
              width="100px"
            >
              <template #default="{ row }">
                <ElTooltip content="查看详情">
                  <ElButton
                    type="text"
                    :icon="'i-chakan ' + STYLE.primary"
                    @click="dDetail(row)"
                  />
                </ElTooltip>
              </template>
            </ElTableColumn>
          </ITable>
        </ElTabPane>

        <ElTabPane
          label="运维服务记录"
          name="1"
        >
          <ITable
            v-if="activeName==='1'"
            ref="operat"
            :query="query2"
            :get="maintenanceRecords"
            :head="head2"
          >
            <ElTableColumn
              label="操作"
              width="100px"
            >
              <template #default="{ row }">
                <ElTooltip content="查看详情">
                  <ElButton
                    type="text"
                    :icon="'i-chakan ' + STYLE.primary"
                    @click="toDetailClick(row)"
                  />
                </ElTooltip>
              </template>
            </ElTableColumn>
          </ITable>
        </ElTabPane>
        <!-- <ElTabPane
          label="历史漏洞扫描任务"
          name="2"
        >
          <span>
            已执行漏扫任务数<br>2
          </span>
          <ITable
            ref="table"
            :query="query"
            :get="alreadyAssetDetailsPage"
            :head="head2"
          />
        </ElTabPane> -->
      </ElTabs>
    </div>

    <!-- <ElDialog
      title="资产漏洞情况"
      :visible.sync="dialogVisible"
      width="100%"
      height="100%"
      :before-close="handleClose"
    >
      <Vulnedetail
        :params-json="paramsData"
        :dialog-visible="dialogVisible"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <ElButton @click="dialogVisible = false">取 消</ElButton>
        <ElButton
          type="primary"
          @click="dialogVisible = false"
        >确 定</ElButton>
      </span>
    </ElDialog> -->
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ElTableColumn from 'element-ui/lib/table-column'
import ITable from '@com/Table'
import ElProgress from 'element-ui/lib/progress'
import GressBar from '../common/progressBar'
import STYLE from '@/scss/status.module.scss'
// import Vulnedetail from './property'
import {
  alreadyAssetList,
  maintenanceRecords,
  serviceOperateFlow,
  riskAssetsTop,
  securityServiceInfo,
  getUserOrderAssetByCode,
} from '@/api/servicePlatform/SecurityService'

import { toDetail } from '@/api/workflow/workflow'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  components: { ITable, ElTableColumn, ElTabs, ElTabPane, GressBar, ElProgress },
  data() {
    return {
      codeFrom: '',
      activeName: '0',
      riskXAxisArr: [],
      // seriousData: 10,
      // ordinData: 15,
      // slightData: 25,
      // totalData: 66,

      // zxMaxNum: 200,
      dialogVisible: false,
      paramsData: {},
      total: '',
      jcFrom: {},
      notFixedFrom: {},
      notFixedTotalCount: '',
      thereAreCount: '',
      notFixedhighCount: '',
      notFixedLowRiskCount: '',
      notFixedMediumCount: '',
      newSmTime: '',
      sType: 'USR_VULNERABILITY_SCAN',
      params: {
        keyword: '',
        serviceType: this.sType,
      },
    }
  },
  computed: {
    STYLE: () => STYLE,
    zcWidth(val) {
      return val / val * 100 + '%'
    },
    alreadyAssetList() {
      return alreadyAssetList
    },
    maintenanceRecords() {
      return maintenanceRecords
    },
    // alreadyAssetDetailsPage() {
    //   return alreadyAssetDetailsPage
    // },
    query1() {
      return this.params
    },
    query2() {
      return { serviceType: this.sType }
    },
    head1() {
      return [
        {
          prop: 'name',
          label: '资产名称',
        },
        {
          prop: 'ip',
          label: 'IP',

        },

        {
          prop: 'cloudPlatformName',
          label: '云平台',

        },
        {
          prop: 'networkArea',
          label: '网络区域',
        },

        {
          prop: 'lastScanTime',
          label: '最近扫描时间',
        },
        {
          label: '未修复漏洞(高危/中危/低危)',
          width: '280px',
          formatter: (row: any) => {
            return this.$createElement(
              'GressBar',
              {
                props: {
                  highData: row.high,
                  mldData: row.medium,
                  lowData: row.lowRisk,
                },
              }

            )
          },
        },
      ]
    },
    head2() {
      return [
        {
          prop: 'workOrderNo',
          label: '工单编号',

        },
        {
          prop: 'createDate',
          label: '时间',
        },
        {
          prop: 'workOrderContent',
          label: '问题描述',
        },
        {
          prop: 'workOrderName',
          label: '服务内容',

        },
        {
          prop: 'handler',
          label: '运维人员',
        },

      ]
    },
    // head3() {
    //   return [
    //     {
    //       prop: 'name',
    //       label: '任务名称',

    //     },
    //     {
    //       prop: 'latestScanTime',
    //       label: '扫描时间',
    //     },
    //     {
    //       prop: 'workOrderName',
    //       label: '存在漏洞的资产数/扫描资产数',

    //     },
    //     {
    //       prop: 'handler',
    //       label: '漏洞扫描结果',
    //     },

    //   ]
    // },

  },
  methods: {
    // 获取交付订单数
    getUserOrderAssetByCode() {
      getUserOrderAssetByCode(this.sType).then(res => {
        if (res.data.body) {
          this.codeFrom = res.data.body
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    applyServ() {
      serviceOperateFlow(this.sType).then(res => {
        const code = res.data.body
        toDetail(code, '工单详情', msg => {
          msg.data === 'close' && this.$refs.operat.fetch()
        })
      })
    },
    // 跳转资产详情
    dDetail(obj: any) {
      this.paramsData = {
        name: obj.name,
        ip: obj.ip,
        cloudPlatformName: obj.cloudPlatformName,
        networkArea: obj.networkArea,
        assetId: obj.assetId,
      }
      this.$router.push({
        name: 'vulnePropertyDetail',
        params: this.paramsData,
      })
      // this.dialogVisible = true
    },
    //  主机漏洞检测服务
    getSecurityServiceInfo() {
      securityServiceInfo({ serviceType: this.sType }).then((res) => {
        this.jcFrom = res.data.body

        this.thereAreCount = res.data.body.thereAre
        this.notFixedhighCount = res.data.body.notFixed.high
        this.notFixedLowRiskCount = res.data.body.notFixed.lowRisk
        this.notFixedMediumCount = res.data.body.notFixed.medium
        this.notFixedTotalCount = parseInt(this.notFixedhighCount) +
         parseInt(this.notFixedLowRiskCount) +
         parseInt(this.notFixedMediumCount)
      })
    },

    // 获取漏洞风险最高的资产TOP5的数据
    getRiskAssetsTop(this: any) {
      riskAssetsTop({ serviceType: this.sType }).then(res => {
        this.riskXAxisArr = res.data.body
        res.data.body.map((item) => {
          this.total += parseInt(item.value)
        })
      })
    },
    // 关闭弹窗
    close() {
      this.visible = false
    },
    toDetailClick(row) {
      toDetail(row.processId, '工单详情', msg => {
        msg.data === 'close' && this.$refs.operat.fetch()
      })
    },

  },
  mounted() {
    this.getRiskAssetsTop()
    this.getSecurityServiceInfo()
    this.getUserOrderAssetByCode()
  },
  created(this: any) {
    // this.getVulnTaskCount()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/progress';
</style>
<style lang="scss" module>
.fr {
  float: right;
}

.fl {
  float: left;
}

.mtp1 {
  margin-top: 30px;
}

.mtp2 {
  margin-top: 20px;
}

.gressWidth {
  width: 60%;
}

.titBox {
  overflow: hidden;

  .title {
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
    font-size: 16px;
    font-family: Microsoft YaHei;
  }
}

.fontsty {
  color: rgba(50, 115, 196, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
  cursor: pointer;
}

.newTim {
  color: rgba(153, 153, 153, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.zcPrassList {
  display: flex;
  flex: 1 0 0;
  margin-bottom: 24px;
  overflow: hidden;

  > span {
    color: rgba(51, 51, 51, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: Microsoft YaHei;
  }

  b {
    display: inline-block;
    margin-right: 20px;
    margin-left: 20px;
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
    font-size: 14px;
    font-family: Microsoft YaHei;
  }
}

.codeDes {
  display: inline-block;
  float: left;
  margin-top: 18px;
  margin-left: 24px;

  span {
    display: inline-block;
    margin-right: 12px;
  }

  em {
    font-style: normal;
  }

  .crl2 {
    color: $colorSuccess;
  }

  .crl1 {
    color: $colorDanger;
  }
}

.kbBox {
  padding: 25px;
  line-height: 40px;
  text-align: center;

  i {
    display: inline-block;
    color: #3273c4;
    font-size: 40px;
    opacity: 0.3;
  }

  span {
    display: inline-block;
    color: #999;
    font-weight: 400;
    font-size: 12px;
  }
}

.eventFilter {
  display: inline-block;
  margin-bottom: 10px;
  margin-left: 20px;

  > em {
    display: inline-block;
    font-weight: bold;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-style: normal;
  }

  > p {
    margin-top: 5px;

    > span {
      margin-right: 20px;
      color: rgba(51, 51, 51, 1);
      font-weight: 400;
      font-size: 12px;
      font-family: Microsoft YaHei;
    }
  }
}

.smLdBox {
  display: flex;
  align-self: center;
  justify-content: space-around;
}

.echartBox {
  height: 200px;
  overflow: hidden;
}

.contetBox {
  position: relative;
  display: flex;
  align-self: center;
  justify-content: space-between;
  padding-right: 400px;
}

.echartitem {
  padding: 20px;

  i {
    display: inline-block;
    margin-top: 7px;
    margin-right: 20px;
    color: #3273c4;
    font-size: 26px;
    vertical-align: top;
  }

  .des {
    display: inline-block;
    margin: 0;
    color: #333;
    font-weight: 400;
    font-size: 16px;
    font-family: Microsoft YaHei;
    line-height: 28px;

    b {
      color: #333;
      font-weight: bold;
      font-size: 18px;
      font-family: Microsoft YaHei;
    }
  }
}

.titleSty {
  display: inline-block;
  color: rgba(51, 51, 51, 1);
  font-weight: 400;
  font-size: 16px;
  font-family: Microsoft YaHei;
}

.zcPrass {
  display: inline-block;
  max-width: calc(100% - 150px);
  height: 11px;
  margin-left: 10px;
  background: rgba(124, 178, 244, 1);
  border-radius: 6px;
}

.fontSty1 {
  color: rgba(51, 51, 51, 1);
  font-weight: bold;
  font-size: 18px;
  font-family: Microsoft YaHei;
}

.icoSty {
  display: inline-block;
  margin: 0 4px;
  padding: 4px 6px;
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
}

.clr1 {
  background-color: rgba(255, 51, 0, 1);
}

.clr2 {
  background-color: rgba(255, 153, 0, 1);
}

.clr3 {
  background-color: rgba(153, 153, 153, 1);
}

.sqBtn {
  width: 90px;
  height: 40px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  font-family: Microsoft YaHei;
  line-height: 8px;
  text-align: center;
  background: #3273c4;
  border-radius: 2px;
}

</style>
