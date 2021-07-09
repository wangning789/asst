<!--这是抽屉组件-->
<template>
  <ElDrawer
    :modal-append-to-bod="false"
    :wrapper-closable="false"
    :visible.sync="drawer_"
    direction="rtl"
    :title="drawerTitle"
    size="410px"
    :modal="false"
  >
    <div :class="$style.header">
      <span :class="$style.title">
        {{ title }}
      </span>
      <div :class="$style.buttons">
        <slot name="buttons">
          <!-- 这是按钮 -->
        </slot>
      </div>
    </div>
    <div :class="$style.content">
      <slot name="content">
        <!-- 这是内容 -->
      </slot>
    </div>
  </ElDrawer>
</template>
<script>
export default {
  name: 'IDrawer',
  props: {
    drawer: { type: Boolean, default: false },
    title: { type: String, default: '' },
    drawerTitle: { type: String, default: '' },
  },
  computed: {
    drawer_: {
      get() {
        return this.drawer
      },
      set(v) {
        this.$emit('handleClose', v)
      },
    },
  },
}
</script>

<style lang="scss" module>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 $gapMedium;

  .title {
    color: $colorTextMain;
    font-weight: bold;
    font-size: $larger;
  }

  .buttons {
    display: flex;
  }
}

.content {
  margin: $gapMedium $gapMedium + 2px;
}
</style>
