<!-- 描述 -->
<template>
  <div class="card">
    <AssetTag />
    <MemberAssets />
    <Statistical />
    <!-- <AssetStatistics /> -->
    <!-- <Survey /> -->
  </div>
</template>

<script lang="ts">
// @ts-nocheck
// import AssetStatistics from './assetStatistics'
// import Survey from './survey'
import AssetTag from './assetTag/index'
import MemberAssets from './memberAssets/index'
import Statistical from './statistical/index'
export default {
  props: {
  },
  components: {
    AssetTag,
    MemberAssets,
    Statistical,
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
.box {
  display: flex;
}
</style>
<style scoped>

.card {
  padding: 0;
}
</style>
