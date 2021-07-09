<template>
  <div :class="$style.blkBox">
    <!-- 工具条 -->
    <!-- <h4 :class="$style.titleSty">
      漏洞详情
    </h4> -->
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>漏洞名称：{{ ldFrom.name }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>CVE_ID：{{ ldFrom.cveId }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>CNNVD_ID：{{ ldFrom.cnnvdId }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>影响版本：{{ ldFrom.impactVersion }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>漏洞级别：{{ ldFrom.grade }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>漏洞描述：{{ ldFrom.description }}</span>
      </ElCol>
    </ElRow>
    <ElRow :class="$style.rowSty">
      <ElCol :span="24">
        <span>解决方案：{{ ldFrom.solution }}</span>
      </ElCol>
    </ElRow>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import {
  vulnerabilityDetails,
} from '@/api/servicePlatform/SecurityService'
export default {
  props: { route: { type: Object, required: true } },
  data() {
    return {
      vulnerabilityId: '',
      userId: '88',
      treminalId: '',
      isSaving: false,
      form: {},
      ldFrom: '',
      activeName: 'first',
      query: {
        pageType: '0',
        pageSize: 5,
        noticeStatus: 1,
      },
    }
  },

  methods: {
    getVulnerability() {
      vulnerabilityDetails(this.route.params.id).then(res => {
        this.ldFrom = res.data.body
      })
    },
  },
  mounted() {
    this.getVulnerability()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>

<style lang="scss" module>
.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;

  > h4 {
    display: inline-block;
    margin: 0 0 $gapNormal / 2 0;
    font-size: $larger;
  }

  :global(.el-button--text) {
    padding-top: 0;
    color: $colorTextCommon;

    &:hover {
      color: $colorTheme;
    }
  }
}

.blkBox {
  height: 100vh;
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.rowSty {
  padding: 10px 0;
  overflow: hidden;
}

.titleSty {
  font-weight: 700;
  font-size: 18px;
  text-align: left;
}

.releUser {
  display: inline-block;
  margin-left: 12px;
  color: #379efe;
  text-decoration: underline;
  cursor: pointer;
}
</style>
