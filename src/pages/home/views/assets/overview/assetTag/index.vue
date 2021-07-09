<!-- 描述 -->
<template>
  <div>
    <div :class="$style.title">
      <div
        class="el-card"
        :class="$style.right"
      >
        <div :class="$style.background">
          <div :class="$style.totalAssets">
            资产总数
          </div>
          <div :class="$style.total">
            12
          </div>
        </div>
        <div :class="$style.asste">
          <div :class="$style.maxAsste">
            <div :class="$style.icon">
              <i class="i-fuwuqizichanzongshu" />
            </div>
            <div>
              <div :class="$style.name">
                服务器资产
              </div>
              <div :class="$style.number">
                20
              </div>
            </div>
          </div>
        </div>
        <div :class="$style.asste">
          <div :class="$style.maxAsste">
            <div :class="$style.icon">
              <i class="i-yewuxitong" />
            </div>
            <div>
              <div :class="$style.name">
                业务系统
              </div>
              <div :class="$style.number">
                20
              </div>
            </div>
          </div>
        </div>
        <div :class="$style.asste">
          <div :class="$style.maxAssteTwo">
            <div :class="$style.icon">
              <i class="i-qitazichan" />
            </div>
            <div>
              <div :class="$style.name">
                其它资产
              </div>
              <div :class="$style.number">
                20
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="el-card"
        :class="$style.left"
      >
        <div :class="$style.organizational ">
          <div :class="$style.assetFrom">
            <div :class="$style.icon">
              <i class="i-zuzhijigouguanli" />
            </div>
            <div>
              <div :class="$style.name">
                组织机构总数
              </div>
              <div :class="$style.number">
                20
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <AssetStatistics />
    <Survey /> -->
  </div>
</template>

<script lang="ts">
// @ts-nocheck
// import AssetStatistics from './assetStatistics'
// import Survey from './survey'
export default {
  props: {
  },
  components: {
    // AssetStatistics,
    // Survey,
  },
  data() {
    return {

    }
  },
  computed: {
  },
  watch: {

  },
  methods: {

  },

}
</script>

<style lang="scss" module>
.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;

  .left {
    display: flex;
    align-items: center;
    width: 287px;
    background-image: url(~@/assets/organizational.png);
  }
}

.total {
  font-size: 32px;
}

.totalAssets {
  margin-right: 58px;
  margin-left: 20px;
}

.right {
  display: flex;
  flex: 1;
  margin-right: 16px;
}

.background {
  display: flex;
  flex: 1;
  align-items: center;
  height: 100%;
  color: #fff;
  font-size: 20px;
  background-image: url(~@/assets/asstTotle.png);
  background-repeat: no-repeat;
}

.asste {
  display: flex;
  flex: 1;
  align-items: center;

  .icon {
    margin-right: 20px;
    color: #2c73ef;
    font-size: 28px;
  }

  .name {
    margin-bottom: 12px;
    font-size: 14px;
  }

  .number {
    font-weight: bold;
    font-size: 26px;
  }
}

.maxAsste {
  display: flex;
  width: 100%;
  margin-left: 58px;
  border-right: 1px solid #e9e9e9;
}

.maxAssteTwo {
  display: flex;
  width: 100%;
  margin-left: 58px;
}

.organizational {
  color: #e9e9e9;

  .icon {
    margin-right: 20px;
    font-size: 28px;
  }

  .name {
    margin-bottom: 12px;
    font-size: 14px;
  }

  .number {
    font-weight: bold;
    font-size: 26px;
  }
}

.assetFrom {
  display: flex;
  width: 100%;
  margin-left: 36px;
}
</style>
