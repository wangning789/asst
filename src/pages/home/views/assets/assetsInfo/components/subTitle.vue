<template>
  <div :class="$style.titles">
    <span :class="$style.diamond" />
    <span :class="$style.xinxi">
      {{ title }}
    </span>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
export default {
  props: {
    title: { type: String, required: true },
  },
}
</script>
<style lang="scss" module>
.titles {
  width: 100%;
  margin: 10px 0;

  .diamond {
    display: inline-block;
    width: 4px;
    height: 16px;
    margin-right: 10px;
    background-color: $colorTheme;
  }

  .xinxi {
    color: #333;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
  }
}
</style>
