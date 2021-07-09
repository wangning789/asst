<template>
  <div :class="$style.progBox">
    <ElRow>
      <ElCol
        :span="8"
        :class="$style.colAlign"
      >
        <label>严重</label>
        <span :class="$style.red">{{ format(highData) }}</span>
      </ElCol>
      <!-- 处置 -->
      <ElCol
        :span="8"
        :class="$style.colAlign"
      >
        <label>一般 </label>
        <span :class="$style.yellow">{{ format(mldData) }}</span>
      </ElCol>
      <!-- 已处理 -->
      <ElCol
        :span="8"
        :class="$style.colAlign"
      >
        <label>轻微</label>
        <span :class="$style.green">{{ format(lowData) }}</span>
      </ElCol>
    </ElRow>

    <!-- 处置进度条 -->
    <ElRow
      type="flex"
      :class="$style.progress"
    >
      <ElCol
        :span="pUpdate"
        :class="$style.c5"
      />
      <ElCol
        :span="opengding"
        :class="$style.c2"
      />
      <ElCol
        :span="Phandled"
        :class="$style.c3"
      />
    </ElRow>
  </div>
</template>
<script>
// @ts-nocheck
import formatNumber from '@/utils/formatNumber'
export default {
  props: {
    highData: {
      type: Number,
      required: true,
    },
    mldData: {
      type: Number,
      required: true,
    },
    lowData: {
      type: Number,
      required: true,
    },

  },
  data() {
    return {
      // 处置统计

    }
  },
  computed: {
    // 处置
    pUpdate() {
      return parseInt(this.highData / (this.highData + this.mldData + this.lowData) * 24)
    },
    opengding() {
      return parseInt(this.mldData / (this.highData + this.mldData + this.lowData) * 24)
    },
    Phandled() {
      return parseInt(this.lowData / (this.highData + this.mldData + this.lowData) * 24)
    },
  },
  methods: {
    format: formatNumber,
  },

}
</script>

<style lang="scss" module>

.progress {
  height: 10px;
  margin-top: $gapNormal / 2;
  overflow: hidden;
  background: $colorBackGround;
  border-radius: $gapNormal / 4;
}

.totalSpan {
  margin-left: 20px;
  font-weight: bold;
  font-size: 32px;
}

.l5,
.red {
  color: $colorDanger;
}

.l4,
.yellow {
  color: #f8902a;
}

.l3,
.yellow2 {
  color: $colorWarn;
}

.l2,
.green {
  color: $colorSuccess;
}

.l1,
.gary {
  color: $colorInfo;
}

.red,
.green,
.yellow,
.yellow2,
.gary {
  font-weight: bold;
  font-size: 24px;
}

.c5 {
  background-color: $colorDanger;
}

.c4 {
  background-color: $colorTheme;
}

.c3 {
  background-color: $colorWarn;
}

.c2 {
  background-color: #f8902a;
}

.c1 {
  background-color: $colorInfo;
}

.colAlign {
  display: flex;
  align-items: center;

  > label {
    display: inline-block;
    margin-right: 8px;
    color: #333;
    font-weight: 400;
    font-size: 12px;
    font-family: Microsoft YaHei;
  }

  > span {
    display: inline-block;
    margin-right: 20px;
    font-weight: bold;
    font-size: 14px;
    font-family: Microsoft YaHei;
  }
}

.sum,
.status {
  width: calc(50% - #{$gapNormal / 2});
}

.sum {
  margin-right: $gapNormal / 2;

  .colAlign > label {
    width: 35px;
  }
}

.status {
  margin-left: $gapNormal / 2;

  .colAlign > label {
    width: 60px;
  }
}

</style>
