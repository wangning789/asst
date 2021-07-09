<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    <div :class="$style.safeTipBox">
      <div :class="[$style.wHalf,$style.left]">
        <span :class="$style.tit">
          <i class="i-gaojing" />
          最新安全事件
        </span>
        <p
          v-show="securityForm.grade"
          :class="$style.des"
        >
          <span :class="$style.highSp">
            {{ securityForm.grade || '' }}
          </span>
          {{ securityForm.name }}
        </p>
      </div>
      <div :class="[$style.wHalf,$style.right]">
        <i :class="$style.state"> {{ securityForm.status | alarmFilter }}</i>
        <span :class="$style.asse">
          {{ securityForm.assets }}
        </span>
        <span :class="$style.alarm">
          {{ securityForm.alarmTime }}
        </span>
        <i class="el-icon-right" />
      </div>
    </div>
    <ElRow :gutter="20">
      <ElCol :span="8">
        <div :class="[$style.blkBox,$style.userBox1]">
          <div :class="$style.headBox">
            <h3 :class="$style.tit">
              代办事项
            </h3>
          </div>
          <div :class="$style.flxBox">
            <div
              :class="$style.orderBox"
              @click="jumpGongDan"
            >
              <i class="i-daichuligongdan" />
              <p>
                待处理工单<br>
                <b>{{ commissionForm.pendingWorkOrder || 0 }}</b>
              </p>
            </div>
            <i :class="$style.line" />
            <div
              :class="$style.orderBox"
              @click="jumpZiChan('/appAsset')"
            >
              <i class="i-daizhifudingdan" />
              <p>
                待处理资产<br>
                <b>{{ commissionForm.delivering || 0 }}</b>
              </p>
            </div>
          </div>
        </div>
      </ElCol>
      <ElCol :span="16">
        <div :class="[$style.blkBox,$style.userBox3]">
          <div :class="$style.headBox">
            <h3 :class="$style.tit">
              我的资产
            </h3>
          </div>
          <ElRow :gutter="20">
            <ElCol :span="4">
              <!-- <div
                :class="$style.app"
                @click="jumpZiChan('/appAsset')"
              >
                <div :class="$style.icon">
                  <i class="i-xitongzichan2" />
                </div>
                <div>
                  <div :class="$style.title">
                    系统资产
                  </div>
                  <b>{{ assetsTotalForm.systemAssets || 0 }}</b>
                </div>
              </div> -->
              <div
                :class="[$style.orderBox, $style.app]"
                @click="jumpZiChan('/appAsset')"
              >
                <i class="i-daichuligongdan" />
                <p>
                  系统资产<br>
                  <b>{{ assetsTotalForm.systemAssets || 0 }}</b>
                </p>
              </div>
            </ElCol>
            <ElCol :span="20">
              <!-- 圆形图表（系统） -->
              <div :class="$style.flxBox">
                <div
                  ref="property"
                  :class="$style.echartBox"
                />

                <div :class="$style.assetContent">
                  <div
                    :class="$style.zcTop"
                    @click="jumpZiChan('/property')"
                  >
                    <!-- <i class="i-fuwuqizichan" /> -->
                    <span>服务器资产</span>
                    <b>{{ assetsTotalForm.serverAssets || 0 }}</b>
                  </div>

                  <div :class="$style.flxBox">
                    <div :class="$style.ebox">
                      <div
                        v-for="(item,index) in assetsTotalForm.chart"
                        :key="index"
                        :class="$style.tit2"
                      >
                        <i :class="$style[`bg${index}`]" />
                        <span>{{ item.name }}</span>
                        <b>{{ item.value }}</b>
                      </div>
                    </div>

                    <div :class="$style.assetItem">
                      <div
                        v-for="(item,index) in assetsTotalForm.cloudPlatform"
                        :key="index"
                        :class="$style.zcItem"
                      >
                        <i :class="[$style[`assetsIcon${index+1}`], $style.zcIcon]" />
                        <span>
                          {{ item.name }}
                        </span>
                        <b>{{ item.count }}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </ElCol>
    </ElRow>
    <ElRow
      :gutter="20"
      :class="$style.mtp"
    >
      <ElCol :span="16">
        <div :class="$style.blkBox">
          <div :class="$style.headBox">
            <h3 :class="$style.tit">
              我的订单
            </h3>
          </div>
          <ElRow>
            <ElCol :span="10">
              <div :class="[$style.blkBox,$style.userBox1]">
                <div :class="$style.cterBox">
                  <div
                    :class="$style.orderBox"
                    @click="jumpMyOrder"
                  >
                    <i class="i-yicaigoudedingdan" />
                    <p>
                      已采购订单<br>
                      <b>{{ orderForm.orderCount }}</b>
                    </p>
                  </div>
                  <i :class="$style.line" />
                  <div
                    :class="$style.orderBox"
                    @click="jumpMyOrder"
                  >
                    <i class="i-dingdanjine" />
                    <p>
                      待交付订单<br>
                      <b>{{ orderForm.deliveryOrder }}</b>
                    </p>
                  </div>
                </div>
              </div>
            </ElCol>
            <ElCol :span="14">
              <div
                v-for="(item,index) in oderData"
                :key="index"
                :class="$style.oPrass"
              >
                <span :class="$style.tit">{{ item.name }}</span>
                <b :class="$style.num">{{ item.value }}</b>
                <div :class="$style.prassBox">
                  <ElProgress
                    :class="$style.progress"
                    :format="format"
                    :color="`${pColorArr[index]}`"
                    :text-inside="true"
                    :stroke-width="10"
                    :percentage="getPercent(parseInt(`${item.value || 0}`))"
                  />
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </ElCol>
      <ElCol :span="8">
        <div :class="$style.blkBox">
          <div :class="$style.notice">
            <div :class="$style.headBox">
              <h3 :class="$style.tit">
                公告
              </h3>
              <a
                :class="$style.ckMore"
                @click="jumpGg()"
              >
                查看更多
              </a>
            </div>
            <div :class="$style.conet">
              <div
                v-for="(item,index) in noticeData"
                :key="index"
                :class="$style.list"
                @click="jumpGgDetail(item)"
              >
                <i class="i-youxiang" />
                <span>{{ item.title }}</span>
                <em>{{ item.takeEffectTime }}</em>
              </div>
            </div>
          </div>
        </div>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.mtp">
      <ElCol :span="24">
        <div :class="[$style.blkBox,$style.userBox2]">
          <div :class="$style.headBox">
            <h3 :class="$style.tit">
              已购安全服务 {{ `${serviceDataList.length}` }}
            </h3>
          </div>
          <div :class="$style.swiperBox">
            <Swiper
              ref="mySwiper"
              :options="swiperOptions"
            >
              <SwiperSlide
                v-for="(item,index) in serviceDataList"
                :key="index"
              >
                <div
                  :class="$style.listBox"
                  @click="jumpService(item)"
                >
                  <div :class="$style.listHead">
                    <h2>{{ item.dictName }}</h2>
                  </div>
                  <!-- 主机防病毒服务 -->

                  <div v-if="item.dictCode === userOverviewCode.USRHOSTANTIVIRUS">
                    <div :class="$style.contBox">
                      <span>总防护资产数量</span>
                      <b>{{ item.protectAsset }}</b>
                    </div>
                    <div :class="$style.contBox">
                      <span>在线/离线终端数</span>
                      <b :class="$style.aqGj">
                        <em :class="$style.crl3">{{ item.terminalStatus.install }}</em>/
                        <em :class="$style.crl">{{ item.terminalStatus.uninstall }}</em>
                      </b>
                    </div>
                    <div :class="$style.contBox">
                      <span>临期服务数</span>
                      <b>{{ item.dueSoon }}</b>
                    </div>
                  </div>

                  <!-- 漏洞扫描 -->
                  <div v-if="item.dictCode===userOverviewCode.USRVULNERABILITYSCAN">
                    <div :class="$style.contBox">
                      <span>最新扫描时间</span>
                      <b :class="$style.time">{{ item.lastVulnerabilityScanTime || '—' }} </b>
                    </div>
                    <div :class="$style.contBox">
                      <span>漏洞扫描结果</span>
                      <b :class="$style.aqGj">
                        <em :class="$style.crl1">{{ item.notFixed.high || 0 }}</em>/
                        <em :class="$style.crl2">{{ item.notFixed.medium || 0 }}</em>/
                        <em :class="$style.crl3">{{ item.notFixed.lowRisk || 0 }}</em>
                      </b>
                    </div>
                    <div :class="$style.contBox">
                      <span>临期服务数</span>
                      <b>{{ item.dueSoon }}</b>
                    </div>
                  </div>
                  <!-- web网页防篡改 -->
                  <div v-if="item.dictCode===userOverviewCode.USRTAMPERPROOFING">
                    <div :class="$style.contBox">
                      <span>总防护资产数量</span>
                      <b>{{ item.protectAsset }}</b>
                    </div>
                    <div :class="$style.contBox">
                      <span>总安全告警</span>
                      <b :class="$style.aqGj">
                        <em :class="$style.crl1">{{ item.securityAlarm.high || 0 }}</em>/
                        <em :class="$style.crl2">{{ item.securityAlarm.medium || 0 }}</em>/
                        <em :class="$style.crl3">{{ item.securityAlarm.lowRisk || 0 }}</em>
                      </b>
                    </div>
                    <div :class="$style.contBox">
                      <span>临期服务数</span>
                      <b>{{ item.dueSoon }}</b>
                    </div>
                  </div>
                  <!-- 二代防火墙 -->
                  <div v-if="item.dictCode==='USR_FIREWALL'">
                    <div :class="$style.contBox">
                      <span>总生效策略数</span>
                      <em :class="$style.sxSty">
                        <i class="i-tongyi" />
                        <b>
                          {{ item.takeEffectStrategyCount.accept }}
                        </b>
                      </em>
                      <em :class="$style.notSxSty">
                        <i class="i-jianshao" />
                        <b>
                          {{ item.takeEffectStrategyCount.invalid }}
                        </b>
                      </em>
                    </div>
                    <div :class="$style.contBox">
                      <span>总安全告警</span>
                      <b :class="$style.aqGj">
                        <em :class="$style.crl1">{{ item.securityAlarm.high || 0 }}</em>/
                        <em :class="$style.crl2">{{ item.securityAlarm.medium || 0 }}</em>/
                        <em :class="$style.crl3">{{ item.securityAlarm.lowRisk || 0 }}</em>
                      </b>
                    </div>
                    <div :class="$style.contBox">
                      <span>临期服务数</span>
                      <b>{{ item.dueSoon }}</b>
                    </div>
                  </div>
                  <!-- 应用防护 -->
                  <div v-if="item.dictCode===userOverviewCode.USRAPPPROTECTIVE">
                    <div :class="$style.contBox">
                      <span>拦截攻击总数</span>
                      <b>{{ item.alarmLog }}</b>
                    </div>
                    <div :class="$style.contBox">
                      <span>今日拦截攻击数</span>
                      <b :class="$style.ljCount">
                        {{ item.todayAlarmLog }}
                        <!-- <i class="i-shangsheng" /> -->
                      </b>
                    </div>
                    <div :class="$style.contBox">
                      <span>临期服务数</span>
                      <b>{{ item.dueSoon }}</b>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <!-- 左右箭头 -->
          <div
            v-if="`${serviceDataList.length}`>4"
            :class="$style.btnSty"
          >
            <span
              class="i-last"
              @click="prev"
            />
            <span
              class="i-next"
              @click="next"
            />
          </div>
        </div>
      </ElCol>
    </ElRow>

    <!-- <ElRow
      :gutter="20"
      :class="$style.mtp"
    >
      <ElCol :span="16">
        <div :class="[$style.blkBox,$style.userBox3]">
          <div :class="$style.headBox">
            <h3 :class="$style.tit">
              最新安全事件
            </h3>
            <a :class="$style.ckMore">
              查看更多
            </a>
          </div>
          <div :class="$style.userContent">
            <div
              v-for="(item,index) in securityData"
              :key="index"
              :class="$style.item"
            >
              <span :class="$style.spn1">{{ item.grade || '' }}</span>
              <p :class="$style.des1">
                {{ item.name }}
              </p>
              <p :class="$style.des2">
                {{ item.status }}
              </p>
              <span :class="$style.spn2">{{ item.assets }}</span>
              <em :class="$style.tim">{{ item.alarmTime }}</em>
            </div>
          </div>
        </div>
      </ElCol>
    </ElRow> -->
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import echarts from '@/libs/echarts'
// 饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import { userOverviewCode } from '@home/enum/userOverviewCode'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import ElProgress from 'element-ui/lib/progress'

import 'swiper/swiper-bundle.css'
import {
  getToDoList,
  getMyOrderCount,
  getAssetsTotal,
  securityAlarm,
  customerNoticeList,
  securityServiceIndex,
} from '@/api/servicePlatform/SecurityService'

/** emit: (事件名: [参数列表, ...]) */
export default {
  components: {
    Swiper,
    SwiperSlide,
    ElProgress,
  },
  directives: { swiper: directive },
  filters: {
    alarmFilter(val) {
      if (val === '1') {
        return '待处置'
      } else if (val === '2') {
        return '已升级'
      } else if (val === '3') {
        return '已处置'
      }
    },
  },
  data() {
    return {
      max: 1,
      oderData: '',
      orderForm: '', // 订单数据
      commissionForm: '', // 代办数据
      noticeData: '', // 公告数据
      assetsTotalForm: '', // 我的资产数据
      swiper1: '',
      securityForm: '', // 最新安全事件
      serviceDataList: [], // 安全服务列表数据
      serviceTotal: '', // 安全服务数量
      pColorArr: ['#5DB4FD', '#40D7BC', '#FFBC8A', '#9184F7'],
      swiperOptions: {
        slidesPerView: 4.3,
        slidesPerGroup: 1,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },

    }
  },
  computed: {
    userOverviewCode: () => {
      return userOverviewCode
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
  },
  watch: {
    oderData: {
      immediate: true,
      handler(oderData?: any) {
        let valList
        oderData && oderData.length && (valList = oderData.map((item) => item.value))
        this.max = valList ? (Math.max(...valList) || 1) : 1
      },
    },
  },
  methods: {
    getPercent(val: number) {
      return Math.floor(val / this.max * 100)
    },
    format(percent: number) {
      return `${Math.ceil(percent / 100 * this.max)}`
    },
    // 跳转安全服务
    jumpService(item) {
      this.$router.push({
        name: 'securityServe',
        query: {
          code: item.dictCode,
        },
      })
    },
    // 我的订单跳转
    jumpMyOrder() {
      this.jump({
        path: '/order',
        append: true,
      })
    },
    // 工单跳转
    jumpGongDan() {
      this.jump({
        path: '/workorder',
        append: true,
      })
    },
    // 待处理资产
    jumpZiChan(url: string) {
      this.jump({
        path: url,
        append: true,
      })
    },
    // 公告跳转
    jumpGg() {
      this.jump({
        path: '/notice',
        append: true,
      })
    },
    // 公告详情跳转
    jumpGgDetail(obj: any) {
      this.jump({
        path: `/notice/${obj.id}/detail`,
        append: true,
      })
    },
    prev() {
      this.swiper.slidePrev()
    },
    next() {
      this.swiper.slideNext()
    },

    // 获取我的订单数据
    getMyOrderCount() {
      getMyOrderCount({}).then(res => {
        if (res.data.body) {
          this.orderForm = res.data.body || {}
          this.oderData = res.data.body.serviceOrders || {}
        }
      })
    },
    // 获取代办事项数据
    getToDoList() {
      getToDoList({}).then(res => {
        if (res.data.body) {
          this.commissionForm = res.data.body
        }
      })
    },
    // 获取首页公告数据
    getCustomerNoticeList() {
      customerNoticeList({
        pageType: '0',
        pageSize: 5,
        noticeStatus: 1,
        noticeType: '1',
      }).then(res => {
        if (res.data.body.data) { this.noticeData = res.data.body.data }
      })
    },
    // 获取我的资产数据
    getAssetsTotal() {
      getAssetsTotal({}).then(res => {
        if (res.data.body) {
          this.assetsTotalForm = res.data.body
          this.initEachartSystem(res.data.body.chart)
        }
      })
    },
    // 获取最新安全告警数据
    getSecurityAlarm() {
      securityAlarm({}).then(res => {
        if (res.data.body.length > 0) {
          this.securityForm = res.data.body[0]
        }
      })
    },
    // 获取安全服务列表数据
    getSecurityServiceIndex() {
      securityServiceIndex({}).then(res => {
        if (res.data.body.length > 0) {
          this.serviceDataList = res.data.body
          this.serviceTotal = res.data.body.length
        }
      })
    },
    // 初始化图表
    initEachartSystem(odata) {
      const property = this.$refs.property
      const myChart = echarts.init(property)
      const option = {
        title: {
          show: odata.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b} : {c} ({d}%)',
        // },
        series: [
          {
            name: '告警资产',
            type: 'pie',
            radius: '85%',
            center: ['50%', '50%'],
            data: odata,
            color: ['#ffbc8a', '#3CA4FC'],
            itemStyle: {
              emphasis: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              normal: {
                show: false, // show设置线是否显示，默认为true，可选值：true ¦ false
              },
            },

          },
        ],
        itemStyle: {
          normal: {
            color: function(params) {
              // 自定义颜色
              const colorList = [
                '#ffbc8a', '#3CA4FC',
              ]
              return colorList[params.dataIndex]
            },
          },
        },
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
  },

  mounted() {
    // 获取最新安全告警数据
    this.getSecurityAlarm()
    // 获取订单数
    this.getMyOrderCount()
    // 获取代办事项数据
    this.getToDoList()
    // 获取我的资产数据
    this.getAssetsTotal()

    // 获取首页公告数据
    this.getCustomerNoticeList()
    // 获取安全服务列表数据
    this.getSecurityServiceIndex()
  },

}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/carousel';
@import '~element-ui/packages/theme-chalk/src/carousel-item';
@import '~element-ui/packages/theme-chalk/src/progress';

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  max-width: 25% !important;
}

.el-progress-bar__innerText {
  margin-top: -5px;
}
</style>
<style lang="scss" module>
$bFontSize: 28px;

.wrapper {
  padding: 0;
}

.assetContent {
  flex: 1;
}

.zcTop {
  margin-bottom: $gapNormal / 2;
  padding-bottom: $gapNormal / 2;
  border-bottom: 1px solid $colorBorderLv3;
  cursor: pointer;

  i {
    display: inline-block;
    margin-right: 10px;
    color: $colorTheme;
    font-size: $larger;
    vertical-align: middle;
  }

  span {
    display: inline-block;
    margin-right: 10px;
    color: $colorTextStress;
    font-weight: 400;
    font-size: $larger;
  }

  b {
    color: $colorTextStress;
    font-weight: bold;
    font-size: 18px;
  }
}

.app {
  width: 100% !important;
  // display: flex;
  // padding-top: $gapNormal;
  // color: $colorTextStress;
  // cursor: pointer;

  // .title {
  //   margin-bottom: $gapNormal / 2;
  //   font-size: $larger;
  // }

  // b {
  //   font-size: $bFontSize;
  // }
}

.mtp {
  margin-top: 20px;
}

.blkBox {
  padding: $gapNormal;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.swiperBox {
  display: flex;
  align-self: center;
  justify-content: space-between;
  margin-top: 14px;
  margin-left: -20px;
}

.cterBox {
  display: flex;
  align-self: center;
  justify-content: space-around;
  padding: 1px 0;
}

.oPrass {
  display: flex;
  align-self: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding-left: 15px;

  .tit {
    display: inline-block;
    width: 170px;
    // margin-right: 20px;
    color: $colorTextStress;
    font-weight: 400;
    font-size: 12px;
    text-align: left;
  }

  b {
    display: inline-block;
    width: 70px;
    color: $colorTextStress;
    font-weight: bold;
    font-size: 14px;
    text-align: left;
  }

  .prassBox {
    width: 100%;
    height: 15px;
    // margin-left: 20px;
  }
}

.zcItem {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  width: 50%;
  color: $colorTextStress;
  font-size: $medium;
  line-height: 2.5em;

  .zcIcon {
    display: inline-block;
    width: $bFontSize;
    height: $large;
    margin-right: $gapNormal / 2;
    text-align: center;
  }

  b {
    margin-left: $gapNormal / 2;
    font-size: $large;
  }
}

.orderBox {
  display: flex;
  align-self: center;
  justify-content: center;
  width: 50%;
  min-height: 140px;
  cursor: pointer;

  > i {
    display: inline-block;
    width: 31px;
    height: 30px;
    margin-top: $gapNormal;
    color: $colorTheme;
    font-size: 30px;
    vertical-align: top;
  }

  > p {
    margin-top: $gapNormal / 2;
    margin-left: 24px;
    color: $colorTextStress;
    font-weight: 400;
    font-size: $larger;
    line-height: 32px;
    text-align: left;

    > b {
      display: inline-block;
      margin-top: $gapNormal / 4;
      color: $colorTextStress;
      font-weight: bold;
      font-size: $bFontSize;
    }
  }
}

.btnSty {
  position: absolute;
  top: 20px;
  right: 20px;

  span {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    color: #a0a8b3;
    font-size: $bFontSize;
    line-height: 24px;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: $colorTheme;
    }
  }
}

.listBox {
  width: calc(100% - 20px);
  margin-left: 20px;
  padding-bottom: $gapNormal;
  background: rgba(249, 251, 255, 1);
  border-radius: 6px;
  cursor: pointer;

  .contBox {
    padding: $gapNormal / 2 $gapNormal;
    text-align: left;

    .time {
      font-size: $medium;
    }

    @media screen and (max-width: 1440px) {
      .time {
        font-size: $smaller;
      }
    }

    > span {
      display: inline-block;
      width: 50%;
      color: $colorTextStress;
      font-weight: 400;
      font-size: $medium;
    }

    > b {
      display: inline-block;
      width: 50%;
      color: $colorTextStress;
      font-size: $larger;
    }
  }
}

.listHead {
  overflow: hidden;
  text-align: left;
  background-image: url('~@/assets/userHeadbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  h2 {
    margin-left: 26px;
    color: $colorTextStress;
    font-weight: bold;
    font-size: 18px;
  }
}

.aqGj {
  color: #999 !important;
  font-style: normal;

  em {
    display: inline-block;
    margin-right: 4px;
    font-weight: bold;
    font-style: normal;
  }
}

.ljCount {
  i {
    color: #f56c6c;
  }
}

.crl1 {
  color: #f00;
}

.crl2 {
  color: #f90;
}

.crl3 {
  color: #67c23a;
}

.userBox1 {
  .line {
    width: 1px;
    height: 110px;
    background: $colorBorderLv3;
  }
}

.headBox {
  display: flex;
  align-self: center;
  justify-content: space-between;
  padding-bottom: 14px;

  .tit {
    margin: 0;
    color: $colorTextStress;
    font-weight: bold;
    font-size: $larger;
  }

  .ckMore {
    color: rgba(80, 132, 203, 1);
    font-weight: 400;
    font-size: 12px;
    cursor: pointer;
  }
}

.sxSty {
  i {
    color: #72c64b;
  }
}

.notSxSty {
  i {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 15px;
    color: #fff;
    line-height: 16px;
    text-align: center;
    background: #f56c6c;
    border-radius: 100%;
  }
}

.flxBox {
  display: flex;
  // justify-content: space-between;
}

.userBox3 {
  // padding-bottom: 30px !important;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    box-shadow: 0 1px 0 0 rgba(240, 240, 240, 1);

    .spn1 {
      display: inline-block;
      height: 17px;
      padding: 2px 7px;
      color: rgba(245, 108, 108, 1);
      font-weight: 400;
      font-size: 12px;
      background: rgba(245, 108, 108, 0.1);
      border: 1px solid rgba(252, 197, 197, 1);
      border-radius: 2px;
    }
  }

  .userContent {
    height: 264px;
    overflow: auto;
  }

  .des1 {
    display: inline-block;
    margin-left: 12px;
    color: $colorTextStress;
    font-weight: 400;
    font-size: 14px;
  }

  .des2 {
    display: inline-block;
    margin-left: 20px;
    color: $colorTextStress;
    font-weight: 400;
    font-size: 14px;
  }

  .spn2 {
    color: rgba(245, 108, 108, 1);
    font-weight: 400;
    font-size: 14px;
  }

  .tim {
    color: rgba(102, 102, 102, 1);
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
  }
}

.ebox {
  width: 34%;
  padding-right: $gapNormal / 2;
  border-right: 1px solid $colorBorderLv3;

  p {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .tit1 {
    width: 100%;
    margin-bottom: 30px;

    span {
      display: inline-block;
      width: 120px;
      color: $colorTextStress;
      font-weight: 400;
      font-size: $larger;
    }

    b {
      color: $colorTextStress;
      font-weight: bold;
      font-size: 24px;
    }
  }

  .tit2 {
    display: flex;
    align-items: center;
    line-height: 2.5em;

    i {
      display: inline-block;
      width: 5px;
      height: 14px;
      margin-right: $gapNormal / 2;
    }

    .bg1 {
      background: rgba(60, 164, 252, 1);
    }

    .bg0 {
      background: #ffbc8a;
    }

    > span {
      display: inline-block;
      width: 110px;
      color: $colorTextStress;
      font-weight: 400;
      font-size: 14px;
    }

    > b {
      color: $colorTextStress;
      font-weight: bold;
      font-size: 18px;
    }
  }
}

.deBox {
  width: 60%;

  .tit1 {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    > span {
      display: block;
      color: $colorTextStress;
      font-weight: 400;
      font-size: $larger;
    }

    > b {
      align-self: flex-end;
      color: $colorTextStress;
      font-weight: bold;
      font-size: 24px;
    }
  }
}

.notice {
  // padding-bottom: 10px !important;

  .conet {
    height: 190px;
    overflow: auto;
  }

  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 0;
    box-shadow: 0 1px 0 0 #f0f0f0;
    cursor: pointer;

    &:hover {
      background: #dedede;
    }

    > i {
      color: #3273c4;
    }

    > span {
      display: inline-block;
      width: calc(100% - 150px);
      margin-left: 10px;
      color: $colorTextStress;
      color: #3273c4;
      font-weight: 400;
      font-size: 12px;
      text-align: left;
    }

    > em {
      // display: inline-block;
      float: right;
      color: rgba(102, 102, 102, 1);
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
    }
  }
}

.assetsIcon1 {
  background-image: url('~@/assets/bjy.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.assetsIcon2 {
  background-image: url('~@/assets/pgy.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.assetsIcon3 {
  background-image: url('~@/assets/txy.png');
  background-repeat: no-repeat;
  background-size: 90% 90%;
}

.userBox2 {
  position: relative;
}

.safeTipBox {
  display: flex;
  align-self: center;
  justify-content: space-around;
  margin-bottom: 24px;
  padding: 23px 104px;
  background: rgba(255, 237, 224, 1);
  border-radius: 6px;

  .left {
    display: flex;
    align-self: center;
    justify-content: flex-start;

    .tit {
      color: rgba(52, 52, 52, 1);
      font-weight: 400;
      font-size: $larger;
    }

    i {
      display: inline-block;
      margin-top: 2px;
      margin-right: 7px;
      color: #ec5e5e;
      font-size: 14px;
      vertical-align: top;
    }

    .des {
      margin: 0;
      margin-left: 60px;
      color: rgba(52, 52, 52, 1);
      font-weight: 400;
      font-size: $larger;
    }

    .highSp {
      display: inline-block;
      margin-right: 22px;
      padding: 2px 7px;
      color: rgba(245, 108, 108, 1);
      font-weight: 400;
      font-size: 12px;
      background: rgba(245, 108, 108, 0.1);
      border: 1px solid rgba(252, 197, 197, 1);
      border-radius: 2px;
    }
  }

  .wHalf {
    display: flex;
    align-self: center;
    width: 50%;
  }

  .right {
    display: flex;
    align-self: center;
    justify-content: space-around;

    .state {
      color: rgba(245, 108, 108, 1);
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
    }

    .asse,
    .alarm {
      color: rgba(102, 102, 102, 1);
      font-weight: 400;
      font-size: 14px;
    }

    i {
      color: #999;
      font-style: normal;
      opacity: 0.8;
    }
  }
}

.icon {
  display: inline-block;
  margin-right: $gapNormal;
  color: $colorTheme;
  font-size: $xxxLarge;
  vertical-align: middle;
}

.pbg0 {
  background: #5db4fd;
}

.echartBox {
  width: 140px;
  height: 140px;
  padding: 0 $gapNormal / 2;
  border-left: 1px solid $colorBorderLv3;
}

.assetItem {
  flex: 1;
  padding-left: $gapNormal;
}
</style>
