<template>
  <div class="head">
    <div class="title">
      <div class="icon">
        <i class="i-fuwuqi" />
      </div>
      <div class="right">
        <div class="total">
          服务器总数
        </div>
        <div class="number">
          {{ tobalAssets.hostAssetCount }}
        </div>
      </div>
    </div>
    <div class="chart">
      <div style=" display: flex;">
        <div class="block" />
        <div class="name">
          服务器资产数TOP5单位
        </div>
      </div>

      <div
        v-for="item in ranking"
        :key="item.num"
      >
        <div class="ranking">
          <div class="stageHead">
            <ElTooltip
              class="item"
              effect="dark"
              :content="item.belongCompanyName"
              placement="top-start"
            >
              <div> {{ item.belongCompanyName }}</div>
            </ElTooltip>
          </div>
          <div class="Count">
            {{ item.hostAssetCount }}
          </div>
          <div
            class="column"
            :style="{ width: `${item.leng}` + 'px' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { memberAssets } from '@/api/assetsOverview/assetsOverview'
export default {
  props: {
    tobalAssets: {
      type: Object,
      default: Object,
    },
  },
  components: {},
  data() {
    return {
      ranking: [],
      total: 0,
    }
  },
  methods: {
    memberAssets() {
      memberAssets().then((res) => {
        if (res.data.body) {
          this.ranking = res.data.body.membersHostAssetTop5List
          this.ranking.map(item => {
            this.total += item.hostAssetCount
          })
          let number = 0
          this.ranking.map(item => {
            if (item.hostAssetCount) {
              number = Number((item.hostAssetCount / this.total).toFixed(2))
              if (number < 0.04) {
                number = 0.04
              } else if (number === 1.00) {
                number = 0.7
              }
              item.leng = number * 300
            }
          })
        }
      })
    },
  },

  mounted() {
    this.memberAssets()
  },
}
</script>

<style scoped lang='scss'>
.head {
  display: flex;
  justify-content: space-between;
}

.chartPied {
  position: relative;
  width: 100%;
  height: 240px;
}

.chart {
  width: 70%;
}

.title {
  display: flex;
  margin-left: 45px;
}

.icon {
  color: #d5402b;
  font-size: 30px;
}

.total {
  color: #333;
  font-size: 16px;
}

.number {
  margin-top: 15px;
  color: #333;
  font-weight: bold;
  font-size: 28px;
}

.right {
  margin-left: 20px;
}

.column {
  height: 7px;
  background-color: #f56c6c;
}

.name {
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
  font-size: 14px;
}

.block {
  width: 6px;
  height: 14px;
  margin-right: 8px;
  background-color: #dd4927;
}

.ranking {
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  .stageHead {
    width: 35%;

    div {
      width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .Count {
    width: 10%;
  }
}

</style>
