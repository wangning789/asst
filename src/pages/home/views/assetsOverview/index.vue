<!-- 描述 -->
<template>
  <div>
    <div class="stageHead">
      <div><Stagehead :tobal-assets="tobalAssets" /></div>
    </div>
    <div class="haeder">
      <div class="box">
        <ElCard class="box-card">
          <div class="boxChartone">
            <div class="group">
              <div class="groupCenter">
                <span class="title"> 资产统计 </span>
                <div class="switch">
                  <ElButtonGroup>
                    <ElButton
                      type="info"
                      plain
                      @click="clickAll"
                    >
                      全部
                    </ElButton>
                    <ElButton
                      type="info"
                      plain
                      @click="clickThisLevel"
                    >
                      只看本级
                    </ElButton>
                    <ElButton
                      type="info"
                      plain
                      @click="clickSubordinate"
                    >
                      只看下级
                    </ElButton>
                  </ElButtonGroup>
                </div>
              </div>
            </div>
            <div class="chart">
              <div class="flex">
                <div style="display: flex; margin-left: 20px;">
                  <div
                    style="
                      width: 6px;
                      height: 14px;
                      margin-right: 10px;
                      background-color: #dd4927;
"
                  />
                  <div class="name">
                    服务器
                  </div>
                </div>
                <div class="piechart">
                  <Hostasset
                    :host-assets="hostAssets"
                    :network-host-assets="networkHostAssets"
                  />
                </div>
              </div>
              <div class="flex">
                <div style="display: flex; margin-left: 20px;">
                  <div
                    style="
                      width: 6px;
                      height: 14px;
                      margin-right: 10px;
                      background-color: #dd4927;
"
                  />
                  <div class="name">
                    应用系统
                  </div>
                </div>
                <div class="piechart">
                  <Systemassets
                    :business-assets="businessAssets"
                    :business-resources="businessResources"
                  />
                </div>
              </div>
              <div class="flex">
                <div style="display: flex; margin-left: 20px;">
                  <div
                    style="
                      width: 6px;
                      height: 14px;
                      margin-right: 10px;
                      background-color: #dd4927;
"
                  />
                  <div class="name">
                    安全产品
                  </div>
                </div>
                <div>
                  <Equipmentassets :statistics="statistics" />
                </div>
              </div>
            </div>
          </div>
        </ElCard>

        <ElCard class="box-card">
          <div class="boxCharttwo">
            <div
              class="group"
              style="margin-bottom: 40px;"
            >
              <div class="groupCenter">
                <div class="title">
                  成员单位资产统计
                </div>
                <div class="assetList">
                  <span class="text" />
                </div>
              </div>
            </div>
            <div class="chart">
              <div class="flex">
                <div style="display: flex; margin-left: 24px;">
                  <div class="block" />
                  <div class="name">
                    服务器
                  </div>
                </div>
                <div
                  class="piechart"
                  style="margin-top: 24px;"
                >
                  <Hostbarchart :tobal-assets="tobalAssets" />
                </div>
              </div>
              <div class="flex">
                <div style="display: flex; margin-left: 24px;">
                  <div class="block" />
                  <div class="name">
                    应用系统
                  </div>
                </div>
                <div style="margin-top: 24px;">
                  <Businessranking :tobal-assets="tobalAssets" />
                </div>
              </div>
            </div>
          </div>
        </ElCard>
        <ElCard class="box-card">
          <div class="assetFrom">
            <span>统计报表</span>
            <div class="asste">
              <div><Assetform /></div>
            </div>
          </div>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import {
  assetStatistics,
  numberAssets,
} from '@/api/assetsOverview/assetsOverview'
import Stagehead from './stageHead/stageHead'
import Hostasset from './hostAsset/hostAsset'
import Systemassets from './systemAssets/systemAassets'
import Equipmentassets from './equipmentAssets/equipmentAssets'
import Hostbarchart from './hostBarChart/hostBarChart'
import Assetform from '@/pages/home/views/assetsOverview/assetForm/assetForm'
import Businessranking from './businessRanking/businessRanking'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'

const info = local.get(STORAGE.me, decode) as User
export default {
  props: {},
  components: {
    Stagehead,
    Hostasset,
    Systemassets,
    Equipmentassets,
    Hostbarchart,
    Assetform,
    Businessranking,
  },
  data() {
    return {
      from: {
        info: info || '',
      },
      tobalAssets: {},
      ranking: [],
      type: 'all',
      value: false,
      hostAssets: [],
      networkHostAssets: [],
      businessAssets: [],
      businessResources: [],
      statistics: [],
    }
  },
  computed: {},
  methods: {
    clickAll() {
      this.type = 'all'
      this.assetStatistics()
    },
    clickThisLevel() {
      this.type = 'company'
      this.assetStatistics()
    },
    clickSubordinate() {
      this.type = 'below'
      this.assetStatistics()
    },
    numberEquipment() {
      numberAssets().then((res) => {
        if (res.status === 200) {
          this.tobalAssets = res.data.body
        }
      })
    },
    assetStatistics() {
      assetStatistics({ type: this.type }).then((res) => {
        if (res.data.body) {
          this.hostAssets =
            res.data.body.statisticsLists.hostAssetNetworkTypeStatistics
          this.networkHostAssets =
            res.data.body.statisticsLists.hostAssetDepositLocationStatistics
          this.businessAssets =
            res.data.body.statisticsLists.businessAssetCiTypeStatistics
          this.businessResources =
            res.data.body.statisticsLists.businessAssetNetworkTypeStatistics
          this.statistics = res.data.body.statisticsLists.securityAssetCiTypeStatistics
        }
      })
    },
  },
  mounted() {
    this.assetStatistics()
    this.numberEquipment()
  },
}
</script>
<style scoped lang="scss">
.title {
  color: #333;
  font-weight: bold;
  font-size: 18px;
}

.header {
  display: flex;
  justify-content: center;
}

.box {
  width: 99%;
}

.box-card {
  margin-bottom: 24px;
  border-radius: 6px;
}

.chart {
  display: flex;

  .flex {
    flex: 1;

    .name {
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
  }
}

.piechart {
  height: 250px;
  margin-bottom: 24px;
  border-right: 1px solid rgb(218, 218, 218);
}

.stageHead {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  div {
    width: 100%;
  }
}

.group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.groupCenter {
  display: flex;
  justify-content: space-between;
  width: 98%;
}

.asste {
  margin-top: 30px;

  div {
    margin: 0 30px;
  }
}

.assetFrom {
  margin-top: 20px;

  span {
    margin-left: 20px;
    font-weight: bold;
    font-size: 18px;
  }
}

.block {
  width: 6px;
  height: 14px;
  margin-right: 8px;
  background-color: #dd4927;
}
</style>
