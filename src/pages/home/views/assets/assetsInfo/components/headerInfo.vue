<template>
  <div :class="$style.details">
    <span :class="$style.ico"><i class="el-icon-s-management" /></span>
    <span :class="$style.detailsfont">{{ title }}</span>
    <span
      v-show="number"
      :class="$style.detailsnumber"
    >No.{{ number }}</span>
    <span
      v-if="status"
      :class="$style.enable"
    >启用中</span>
    <span
      v-else
      :class="$style.disable"
    >已停用</span>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
export default {
  props: {
    title: { type: String, default: '资产类型' },
    number: { type: String, default: '' },
    status: { type: Boolean, required: true, default: true },
  },
}
</script>
<style lang="scss" module>
.details {
  padding: 10px 0;

  span {
    display: inline-block;
    margin-right: 10px;
  }

  .detailsfont {
    height: 26px;
    color: #333;
    font-weight: bold;
    font-size: 20px;
    line-height: 26px;
  }

  .detailsnumber {
    padding: 4px 10px;
    color: #333;
    font-weight: 400;
    font-size: 12px;
    background-color: #f4f6fb;
  }

  .enable {
    padding: 4px 10px;
    color: #68c23a;
    font-weight: 400;
    font-size: 12px;
    background: rgba(104, 194, 58, 0.1);
    border-radius: 20px;
  }

  .disable {
    padding: 4px 10px;
    color: $colorTextMinor;
    font-weight: 400;
    font-size: 12px;
    background: rgba(153, 153, 153, 0.1);
    border-radius: 20px;
  }
}
</style>
