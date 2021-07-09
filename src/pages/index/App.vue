<!--
 * @Description: 布局
 * @Author: 毛瑞
 * @Date: 2020-05-18 15:50:46
 -->
<template>
  <Transition
    appear
    name="fade"
    mode="out-in"
  >
    <KeepAlive
      :max="CONFIG.page > 1 ? CONFIG.page : 1"
      :exclude="$router.$.e"
    >
      <RouterView :key="$route.meta && $route.meta.id" />
    </KeepAlive>
  </Transition>
</template>
