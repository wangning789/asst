<!-- 描述 -->
<template>
  <div>
    <div :class="$style.blkBox">
      <ElRow :class="$style.rowSty">
        <ElCol :span="18">
          <div :class="$style.titHead">
            <h3 :class="$style.tit">
              虚拟防火墙服务
            </h3>
            <p :class="$style.codeDes">
              <span>待交付:<em :class="$style.crl1">{{ codeFrom.toBeDelivered }}</em></span>
              <span>交付完成:<em :class="$style.crl2">{{ codeFrom.deliveryComplete }}</em></span>
            </p>
          </div>

          <p :class="$style.intr">
            当前共有防火墙数：{{ FIREWALLListAct }}
          </p>
        </ElCol>
        <ElCol :span="6">
          <ElButton
            :class="[$style.sqBtn,$style.fr]"
            @click="applyServ"
          >
            申请服务
          </ElButton>
        </ElCol>
      </ElRow>
      <ElRow
        v-for="(i) in FIREWALLElRow"
        :key="i"
        :class="$style.rowSty"
      >
        <ElCol
          v-for="(item,index) in FIREWALLListArr"
          :key="index"
          :span="rowList"
        >
          <div :class="$style.ffqBox">
            <div :class="$style.ffqflx1">
              <i class="i-fanghuoqiang2" />
              <div :class="$style.ffqDes">
                <h3 :class="$style.tit">
                  {{ item.name }}
                </h3>
                <p>
                  <em :class="$style.sp1">{{ item.cloudPlatformName }}</em>
                  <em :class="$style.sp1">{{ item.networkArea }}</em>
                  <em :class="$style.sp1">{{ item.ip }}</em>
                  <span
                    v-if="item.status==='alive'"
                    :class="$style.state"
                  >正常</span>
                  <span
                    v-if="item.status==='dead'"
                    :class="$style.dead"
                  >失效</span>
                  <a
                    :class="$style.lkDetail"
                    @click="vDetail(item)"
                  >查看详情</a>
                </p>
              </div>
            </div>
            <div :class="[$style.ffqflx2]">
              <div :class="$style.pItem">
                <span>CPU</span>
                <ElProgress
                  :class="$style.progLine"
                  :text-inside="true"
                  color="#A4D988"
                  :stroke-width="10"
                  :percentage="parseInt(`${item.cpu}`)"
                  status="success"
                />
                <!-- <b>{{ item.cpu }}</b> -->
              </div>
              <div :class="$style.pItem">
                <span>内存</span>
                <ElProgress
                  :class="$style.progLine"
                  :text-inside="true"
                  color="#A4D988"
                  :stroke-width="10"
                  :percentage="parseInt(`${item.memory}`) "
                  status="success"
                />
                <!-- <b>{{ item.memory }}</b> -->
              </div>
              <div :class="$style.pItem">
                <span>磁盘</span>
                <ElProgress
                  :class="$style.progLine"
                  :text-inside="true"
                  color="#A4D988"
                  :stroke-width="10"
                  :percentage="parseInt(`${item.disk}`)"
                  status="success"
                />
                <!-- <b>{{ item.disk }}</b> -->
              </div>
            </div>
            <div :class="[$style.ffqflx1,$style.ffqflx3]">
              <div :class="$style.eventItem">
                <div :class="$style.eventFilter">
                  <b :class="$style.tit">入侵事件</b>

                  <GressBar
                    :high-data="item.intrusionEventsHigh"
                    :mld-data="item.intrusionEventsMid"
                    :low-data="item.intrusionEventsLow"
                  />
                </div>
                <div :class="$style.eventFilter">
                  <b :class="$style.tit">URL过滤</b>
                  <GressBar
                    :high-data="item.urlFilterHigh"
                    :mld-data="item.urlFilterMid"
                    :low-data="item.urlFilterLow"
                  />
                </div>
              </div>
              <div :class="$style.eventItem">
                <div :class="$style.eventFilter">
                  <b :class="$style.tit">病毒事件</b>
                  <GressBar
                    :high-data="item.virusEventsHigh"
                    :mld-data="item.virusEventsMid"
                    :low-data="item.virusEventsLow"
                  />
                </div>
                <div :class="$style.eventFilter">
                  <b :class="$style.tit">内容过滤</b>

                  <GressBar
                    :high-data="item.contentFilterHigh"
                    :mld-data="item.contentFilterMid"
                    :low-data="item.contentFilterLow"
                  />
                </div>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>

    <div :class="[$style.blkBox,$style.mtp]">
      <h3>运维服务记录</h3>
      <ITable
        ref="table"
        :query="query"
        :get="maintenanceRecords"
        :head="head"
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
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ElProgress from 'element-ui/lib/progress'
import ITable, { ElTableColumn } from '@com/Table'
import GressBar from '../common/progressBar'
import { securityServiceInfo, maintenanceRecords, serviceOperateFlow, getUserOrderAssetByCode } from '@/api/servicePlatform/SecurityService'
import { toDetail } from '@/api/workflow/workflow'
import STYLE from '@/scss/status.module.scss'
export default {
  props: { },
  components: { ITable, ElTableColumn, ElProgress, GressBar },
  data() {
    return {
      codeFrom: '',
      rowList: 0,
      FIREWALLElRow: 1,
      seriousData: 10,
      ordinData: 15,
      slightData: 25,
      totalData: 66,
      percentage: 20,
      activeName: '0',
      customColor: '#67c23a',
      FIREWALLListArr: [],
      FIREWALLListAct: 0,
      sType: 'USR_FIREWALL',
    }
  },
  computed: {
    STYLE: () => STYLE,
    query() {
      return { serviceType: this.sType }
    },
    maintenanceRecords() {
      return maintenanceRecords
    },
    head() {
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
  },
  methods: {
    applyServ() {
      serviceOperateFlow(this.sType).then(res => {
        const code = res.data.body
        toDetail(code, '工单详情', msg => {
          msg.data === 'close' && this.$refs.operat.fetch()
        })
      })
    },
    // 获取交付订单数
    getUserOrderAssetByCode() {
      getUserOrderAssetByCode(this.sType).then(res => {
        if (res.data.body) {
          this.codeFrom = res.data.body
        }
      })
    },
    getSecurityServiceInfo() {
      securityServiceInfo({ serviceType: this.sType }).then((res) => {
        if (res.data.body.length > 0) {
          this.FIREWALLListArr = res.data.body
          this.FIREWALLListAct = res.data.body.length
          if (this.FIREWALLListAct <= 3) {
            this.rowList = 24 / this.FIREWALLListAct
          } else {
            this.rowList = 3
            this.FIREWALLElRow = Math.ceil(this.FIREWALLListAct / 3)
          }
        }
      })
    },
    // 跳转详情
    vDetail(obj) {
      this.jump({ path: `${obj.devId}/vDetail`, append: true })
    },
    toDetailClick(row) {
      toDetail(row.processId, '工单详情', msg => {
        msg.data === 'close' && this.$refs.operat.fetch()
      })
    },
  },
  mounted() {
    (this as any).getSecurityServiceInfo()
    this.getUserOrderAssetByCode()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/Table';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/progress';
</style>

<style lang="scss" module>
.mainSty {
  padding: 20px;
}

.fr {
  float: right;
}

.tit {
  display: inline-block;
  color: rgba(51, 51, 51, 1);
  font-weight: bold;
  font-size: 16px;
}

.intr {
  color: rgba(102, 102, 102, 1);
  font-weight: 400;
  font-size: 12px;
}

.mtp {
  margin-top: 20px;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.ffqBox {
  position: relative;
  max-width: 600px;
  padding: 20px 40px 20px 20px;
  overflow: hidden;

  i {
    display: inline-block;
    color: $colorTheme;
    font-size: 30px;
    vertical-align: top;
  }

  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0;
  }

  .tit {
    display: inline-block;
    margin-top: 0;
    margin-bottom: 5px;
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
    font-size: 14px;
  }

  .sp1 {
    display: inline-block;
    margin-right: 20px;
    color: rgba(102, 102, 102, 1);
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
  }

  .state {
    display: inline-block;
    padding: 4px 6px;
    color: rgba(103, 194, 58, 1);
    font-weight: 400;
    font-size: 14px;
    background: rgba(240, 249, 235, 1);
    border: 1px solid rgba(157, 225, 123, 1);
    border-radius: 4px;
  }

  .dead {
    display: inline-block;
    padding: 4px 6px;
    color: #f56c6c;
    font-weight: 400;
    font-size: 14px;
    background: rgba(240, 249, 235, 1);
    border: 1px solid #f56c6c;
    border-radius: 4px;
  }

  .lkDetail {
    display: inline-block;
    align-self: flex-end;
    margin-left: 20px;
    color: rgba(47, 99, 164, 1);
    font-weight: 400;
    font-size: 12px;
    cursor: pointer;
  }
}

.ffqflx1 {
  // display: flex;
  // align-content: space-between;
  // align-self: center;
  h3 {
    color: #333;
    font-weight: bold;
    font-size: 16px;
  }
}

.linkSty {
  color: rgba(50, 115, 196, 1);
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
}

.pItem {
  margin-bottom: 18px;

  span {
    display: inline-block;
    width: 50px;
  }

  b {
    display: inline-block;
    margin-left: 10px;
  }
}

.ffqflx2 {
  margin-top: 25px;

  > span {
    display: inline-block;
    margin-right: 16px;
    color: rgba(51, 51, 51, 1);
    font-weight: 400;
    font-size: 14px;
  }

  .progLine {
    display: inline-block;
    width: calc(100% - 100px);
    line-height: 10px;
  }

  > b {
    display: inline-block;
    margin-left: 16px;
    margin-left: 10px;
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
    font-size: 14px;
  }
}

.ffqflx3 {
  margin-top: 40px;
}

.crl3 {
  color: #f00;
}

.crl2 {
  color: #f90;
}

.crl1 {
  color: #3c0;
}

.tableBox {
  margin-top: 20px;
}

.eventItem {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.codeDes {
  display: inline-block;
  margin-top: 12px;
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

.eventFilter {
  width: 100%;
  height: 66px;
  margin-right: 20px;
  margin-bottom: 10px;
  padding: 14px 10px;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(47, 99, 164, 0.09) 0%, rgba(102, 102, 102, 0) 100%);

  .tit {
    display: inline-block;
    margin-bottom: 12px;
    color: rgba(51, 51, 51, 1);
    font-weight: 400;
    font-size: 16px;
  }

  em {
    display: inline-block;
    font-weight: bold;
    font-size: 14px;
    font-style: normal;
  }

  > p {
    margin-top: 5px;

    > span {
      margin-right: 20px;
      color: rgba(51, 51, 51, 1);
      font-weight: 400;
      font-size: 12px;
    }
  }
}

.ffqDes {
  display: inline-block;
  width: calc(100% - 100px);
  margin-left: 20px;
}

.progBox {
  margin-top: -5px;
  overflow: hidden;

  .serious {
    display: inline-block;
    float: left;
    width: 57px;
    height: 8px;
    background: rgba(245, 108, 108, 1);
    border-radius: 4px 0 0 4px;
  }

  .ordin {
    display: inline-block;
    float: left;
    width: 51px;
    height: 8px;
    background: rgba(248, 144, 42, 1);
    opacity: 0.8;
  }

  .slight {
    display: inline-block;
    float: left;
    width: 96px;
    height: 8px;
    background: rgba(103, 194, 58, 1);
    border-radius: 0 4px 4px 0;
    opacity: 0.5;
  }
}

.sqBtn {
  width: 90px;
  height: 40px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  line-height: 8px;
  text-align: center;
  background: #3273c4;
  border-radius: 2px;
}

</style>
