<!--fengexian-->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div :class="$style.wrapper">
    <IChooser
      v-loading="isSaving"
      :fetch="fetch"
      :args="[route.params.id]"
    >
      <ElRow type="flex">
        <ElCol
          :span="form.noticeType === '3' ? 18 : 24"
          :class="'el-card ' + $style.section"
        >
          <!-- 工具条 -->
          <div :class="$style.bar">
            <h4>公告详情</h4>
            <div :class="$style.fr">
              <ElButton
                v-show="form.markStatus === 0"
                type="text"
                icon="el-icon-star-on"
                @click="add"
              >
                收藏
              </ElButton>

              <ElButton
                v-show="form.markStatus === 1"
                type="text"
                icon="el-icon-delete"
                @click="delServe"
              >
                移除
              </ElButton>
            </div>
          </div>

          <div :class="$style.title">
            <h2>{{ form.title }}</h2>
            <span>公告级别：{{ noticeLevel }}</span>
            <span>公告类型：{{ noticeType }}</span>
            <span>发布时间：{{ form.takeEffectTime }}</span>
            <span>浏览次数: {{ form.readCount }}</span>
          </div>

          <div
            :class="$style.content"
            v-html="form.content"
          />
        </ElCol>

        <ElCol
          v-if="form.noticeType === '3'"
          :span="6"
          :class="'el-card ' + $style.section1"
        >
          <div :class="$style.assetTitle">
            <h4>当前漏洞影响的资产</h4>
            <div>
              <ElButton
                type="primary"
                @click="startsOrder"
              >
                发起处置工单
              </ElButton>
            </div>
          </div>

          <template v-if="assetListArr && assetListArr.length">
            <div
              v-for="item in assetListArr"
              :key="item.id"
              :class="$style.assetItem"
            >
              <div :class="$style.assetName">
                <i class="i-cunzailoudongdezichan" />
                <span>{{ item.assetsName }}</span>
              </div>
              <div :class="$style.assetIp">
                IP：<b :class="$style.ip">{{ item.assetsIp }}</b>
              </div>
            </div>
          </template>

          <Info
            v-else
            icon="el-icon-info"
            type="info"
            msg="empty"
            retry
          />
        </ElCol>
      </ElRow>
    </IChooser>

    <WorkOrder
      v-if="form.noticeType === '3'"
      :id="route.params.id"
      ref="workorder"
      :class="'el-card ' + $style.section2"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import WorkOrder from './WorkOrder'
import Info from '@com/Info'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import {
  toDetail,
} from '@/api/workflow/workflow'
import {
  startWorkOrder,
  // userAssetList,
  // assetList,
  startWorkOrderByOpertion,
} from '@/api/knowledge/knowledge'
import { CustomerNoticeById, Mark, cancelMark, noticeDetail } from '@/api/servicePlatform/notice'
import formatDate, { getDate } from '@/utils/formatDate'
import { DateTime } from '@/enums/format'
import { ROLES } from '@/enums'

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { IChooser: IChooser as any, WorkOrder, Info },
  data() {
    return { isSaving: false, form: {}, assetListArr: [] }
  },
  computed: {
    noticeLevels: () => [
      {
        label: '全部',
        value: '',
      },
      {
        label: '紧急',
        value: '0',
      },
      {
        label: '普通',
        value: '1',
      },
    ],
    noticeTypes: () => [
      {
        label: '全部',
        value: '',
      },
      {
        label: '其他公告',
        value: '0',
      },
      {
        label: '平台公告',
        value: '1',
      },
      {
        label: '安全资讯',
        value: '2',
      },
      {
        label: '风险预警',
        value: '3',
      },
    ],
    noticeLevel() {
      let name = ''
      const noticeLevel = this.form.noticeLevel
      this.noticeLevels.forEach(res => {
        if (res.value === noticeLevel) {
          name = res.label
        }
      })
      return name
    },
    noticeType() {
      let name = ''
      const noticeType = this.form.noticeType
      this.noticeTypes.forEach(res => {
        if (res.value === noticeType) {
          name = res.label
        }
      })
      return name
    },
  },
  methods: {
    startsOrder() {
      if (this.authFit(ROLES.custom)) {
        startWorkOrder(this.$route.params.id).then(res => {
          toDetail(res.data.body, '创建工单', () => {
            this.$refs.workorder.refresh()
          })
        })
      } else {
        startWorkOrderByOpertion(this.$route.params.id).then((res) => {
          toDetail(res.data.body, '创建工单', () => {
            this.$refs.workorder.refresh()
          })
        })
      }
    },
    async fetch(this: any, id?: string) {
      if (!id) {
        return 1
      }
      // 原来广州的代码
      // const assetFn = this.authFit(ROLES.custom) ? userAssetList : assetList
      const assetFn = noticeDetail

      const assetData = await assetFn({ id })
      this.assetListArr = assetData.data.body
      let fn
      switch (true) {
        case this.authFit(ROLES.custom):
          fn = CustomerNoticeById
          break
        default:
          fn = noticeDetail
          break
      }
      const data = (await fn({ id: id })).data.body
      return (this.form = data)
    },
    // 收藏或者删除服务
    async delServe(this: any) {
      const data = this.form
      await this.$confirm(
        '确认取消收藏？',
        '取消收藏确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      this.isSaving = true
      try {
        await cancelMark({ id: data.id })
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.up(true)
      this.$notify.success(`已取消收藏【${data.title}】`)
    },

    async add(this: any) {
      const data = this.form
      await this.$confirm(
        `确定要收藏【${data.title}】？`,
        '收藏确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      this.isSaving = true
      try {
        await Mark({ id: data.id })
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.up(true)
      this.$notify.success(`已收藏【${data.title}】`)
    },

    format(dataString: string) {
      return dataString && formatDate(
        getDate(dataString, DateTime.serverDateTime),
        DateTime.date
      )
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  padding: 0;
}

.section,
.section1,
.section2 {
  padding: $gapNormal;
}

.section1 {
  margin-left: $gapNormal;
}

.section2 {
  margin-top: $gapNormal;
}

.assetTitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;
}

.assetItem {
  padding: $gapNormal 0;
  border-bottom: $borderBase;
}

.assetName {
  display: flex;

  > i {
    margin-right: $gapNormal / 2;
    color: $colorTheme;
    font-size: $xxxLarge;
  }

  > span {
    font-size: $xLarge;
    line-height: $xLarge;
  }
}

.assetIp {
  padding-left: $xxxLarge + $gapNormal / 2;
  line-height: 2em;
}

.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;

  // > h4 {
  //   display: inline-block;
  //   margin: 0 0 $gapNormal / 2 0;
  //   font-size: $larger;
  // }

  :global(.el-button--text) {
    padding-top: 0;
    color: $colorTextCommon;

    &:hover {
      color: $colorTheme;
    }
  }
}

.fr {
  float: right;
}

.title {
  margin-bottom: $gapNormal;
  text-align: center;

  > span {
    margin: $gapNormal $gapNormal / 2;
  }
}

.content {
  width: 100%;
  max-width: $lg;
  min-height: $sm;
  margin: 0 auto;
}
</style>
