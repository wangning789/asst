<!-- 描述 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="[params]"
  >
    <template #success="{ data: { data: { body = {} } } }">
      <h3>用户评价({{ body.total }})</h3>

      <ElRow
        v-for="item in body.data"
        :key="item.id"
        type="flex"
        justify="space-between"
        align="bottom"
        :class="$style.coment"
      >
        <!-- 左边名字和内容 -->
        <ElCol :span="24">
          <ElRow
            type="flex"
            justify="space-between"
            align="middle"
          >
            <!-- 头像用户名 -->
            <ElCol :span="6">
              <ElRow
                type="flex"
                align="middle"
              >
                <ElCol :span="4" />
                <!-- 头像 -->
                <ElCol :span="6">
                  <div :class="$style.touxiang">
                    <i class="i-wode" />
                  </div>
                </ElCol>
                <!-- 用户名 -->
                <ElCol :span="10">
                  <div>{{ userName(item.evaluationUsername) }}</div>
                </ElCol>
              </ElRow>
            </ElCol>
            <!-- 评论 -->
            <ElCol :span="18">
              <!-- 评分 -->
              <ElRow type="flex">
                <span>评分</span>
                <ElRate :value="item.evaluationScore / 2" />
              </ElRow>
              <!-- 评价 -->
              <ElTooltip
                :content="item.evaluationContent"
                placement="top-start"
              >
                <p :class="$style.ellip">
                  {{ item.evaluationContent }}
                </p>
              </ElTooltip>
              <!-- 时间 -->
              <div :class="$style.time">
                {{ item.createDate }}
              </div>
            </ElCol>
          </ElRow>
        </ElCol>
      <!-- 右边举报点赞 -->
      <!-- <ElCol :span="6">
        <span :class="$style.rightIcon">举报</span>
        <span :class="$style.rightIcon">
          <i
            class="i-zan"
            @click="dianzan"
          />
          {{ zanNum }}
        </span>
        <span :class="$style.rightIcon">
          <i class="i-pinglun" />
          0
        </span>
      </ElCol> -->
      </ElRow>

      <!-- 翻页 -->
      <ElPagination
        v-show="body.total"
        background
        :layout="PAGE.layout"
        :page-sizes="PAGE.sizes"
        :total="body.total"
        :page-size="params.pageSize"
        :current-page="params.page"
        :class="$style.pagin"
        @size-change="setPageSize"
        @current-change="setPage"
      />
    </template>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElPagination from 'element-ui/lib/pagination'
import IChooser from '@com/ChooserAsyncFunctional'
import ElRate from '@mallCom/Rate'
import PAGE from '@com/config/table'

import { selectShopComment } from '@/api/servicePlatform/shop'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { id: { type: String, required: true } },
  components: { ElRate, ElPagination, IChooser },
  data() {
    return { params: { id: this.id, page: 1, pageSize: 5 } }
  },
  computed: { PAGE: () => PAGE },
  methods: {
    fetch: selectShopComment,
    setPageSize(val) {
      this.params.pageSize = val
      this.params.page = 1
    },
    setPage(val) {
      this.params.page = val
    },
    userName(str) {
      if (str.length > 1) {
        return str.replace(/^(.).*(.)$/, '$1***$2')
      } else {
        return str + '***'
      }
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/rate';
@import '~element-ui/packages/theme-chalk/src/pagination';
</style>

<style lang="scss" module>
.coment {
  margin: 0 $gapNormal;
  padding: $gapNormal 0;
  border-bottom: 1px solid $colorBorderLv1;
}

.touxiang {
  width: 32px;
  height: 32px;
  overflow: hidden;
  line-height: 32px;
  border-radius: 50%;

  .headPhoto {
    width: 100%;
    height: 100%;
  }
}

.rightIcon {
  margin: 0 $gapNormal;
  color: $colorTextMinor;
  font-size: $smaller;

  &:hover {
    cursor: pointer;
  }
}

.pagin {
  margin-top: $gapNormal;
}

.time {
  color: $colorTextMinor;
}

.ellip {

  @include ellipsis(3);

  color: $colorTextCommon;
  word-wrap: break-word;
}
</style>
