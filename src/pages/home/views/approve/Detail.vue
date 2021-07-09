<!-- eslint-disable vue/no-v-html -->
<!-- 描述 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="[{ id }]"
    :class="'el-card ' + $style.wrapper"
  >
    <div :class="$style.header">
      <div :class="$style.title">
        审批详情
      </div>

      <div :class="$style.iconlist">
        <div
          v-if="commercialManager && form.examinationStatus === 0"
          @click="open(1)"
        >
          <i :class="[COLOR[1], 'i-tongguo']" />
          通过
        </div>
        <div
          v-if="commercialManager && form.examinationStatus === 0"
          @click="open(2)"
        >
          <i :class="[COLOR[2], 'i-shibai']" />
          拒绝
        </div>
      </div>
    </div>

    <div :class="$style.container">
      <div :class="$style.conterbox">
        <div :class="$style.conterson">
          <div :class="$style.sonitem">
            审批编号：
          </div>
          <div :class="$style.sontext">
            {{ form.examinationNo }}
          </div>
          <ElTag type="warning">
            {{ STATUS[form.examinationStatus] }}
          </ElTag>
        </div>
        <div :class="$style.conterson">
          <div :class="$style.sonitem">
            审批主题：
          </div>
          <div :class="$style.sontext">
            {{ THEME[form.examinationTheme] }}
          </div>
        </div>
        <div :class="$style.conterson">
          <div :class="$style.sonitem">
            申请人：
          </div>
          <div :class="$style.sontext">
            {{ form.applicantName }}
          </div>
        </div>
        <div :class="$style.conterson">
          <div :class="$style.sonitem">
            审批详情：
          </div>
          <div :class="$style.sontext">
            <ElLink
              type="primary"
              :underline="false"
              @click="examinationEdit(form.examinationTheme)"
            >
              {{ form.examinationNo }}
            </ElLink>
          </div>
        </div>
        <div
          v-if="form.examinationTheme !== 'ADDSTORAGE_PRODUCT'"
          :class="$style.conterson"
        >
          <div :class="$style.sonitem">
            期望生效时间：
          </div>
          <div :class="$style.sontext">
            {{ form.takeEffectTime || '-' }}
          </div>
        </div>
        <div
          v-if="form.examinationTheme !=='MODIFY_NOTICE'&& form.examinationTheme!=='ADD_NOTICE'"
          :class="$style.conterson"
        >
          <div :class="$style.sonitem">
            备注：
          </div>
          <div :class="$style.sontext">
            {{ form.remark || '-' }}
          </div>
        </div>
      </div>

      <ElTimeline>
        <ElTimelineItem
          v-for="(item,index) in activities"
          :key="index"
          type="success"
          :hide-timestamp="true"
        >
          <div :class="$style.center">
            <div :class="$style.text">
              <div :class="$style.img">
                <ElAvatar
                  :src="getAvatar(item.profilePicture)"
                  :size="50"
                >
                  <IIcon
                    icon="i-morentouxianglanse"
                    size="50px"
                  />
                </ElAvatar>
              </div>
              <div :class="$style.userName">
                {{ item.createUser }}
              </div>
              <div>{{ item.createDate }}</div>
              <div :class="$style.remake">
                <p> {{ item.remake }}</p>
              </div>
            </div>
            <div :class="[$style.operationType, COLOR[item.operationType]]">
              {{ STATUS[item.operationType] }}
            </div>
          </div>
        </ElTimelineItem>
      </ElTimeline>
    </div>

    <!-- 弹框 -->
    <ElDialog
      title="审批备注"
      :visible.sync="remarkVisible"
      width="30%"
    >
      <ElForm :model="remarkForm">
        <ElFormItem
          prop="remark"
          :rules="{ required: true, message: '请输入审批备注' }"
        >
          <ElInput
            v-model="remarkForm.remark"
            type="textarea"
            autocomplete="off"
            :maxlength="50"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton
          type="primary"
          @click="save(addForm)"
        >
          确定
        </ElButton>

        <ElButton @click="cancelSave(remarkForm)">
          取消
        </ElButton>
      </template>
    </ElDialog>

    <!-- 公告详情简介弹框 -->
    <ElDialog
      title="公告基本信息"
      :visible.sync="noticeVisible"
      width="60%"
    >
      <ElRow :gutter="GAP.gap">
        <ElCol :span="12">
          <!--封面 + 编号-->
          <ElRow :gutter="GAP.gap">
            <ElCol :span="20">
              <ElRow :gutter="GAP.half">
                <ElCol
                  :span="9"
                  :class="$style.tr"
                >
                  公告编号：
                </ElCol>
                <ElCol
                  :span="15"
                  :class="$style.marginTop"
                >
                  {{ noticeDTO.noticeNo }}
                </ElCol>
              </ElRow>
              <ElRow :gutter="GAP.half">
                <ElCol
                  :span="9"
                  :class="$style.tr"
                >
                  公告级别：
                </ElCol>
                <ElCol :span="15">
                  <!-- <ElRow :gutter="GAP.half"> -->
                  <ElCol
                    :span="8"
                    :class="$style.marginTop"
                  >
                    {{ noticeDTO.noticeLevel| noticeLevelType }}
                  </ElCol>
                  <!-- </ElRow> -->
                </ElCol>
              </ElRow>
              <ElRow :gutter="GAP.half">
                <ElCol
                  :span="9"
                  :class="$style.tr"
                >
                  生效时间：
                </ElCol>
                <ElCol
                  :span="15"
                  :class="$style.marginTop"
                >
                  {{ noticeDTO.takeEffectTime }}
                </ElCol>
              </ElRow>
            </ElCol>
          </ElRow>
        </ElCol>
        <!-- 服务名 -->
        <ElCol :span="12">
          <ElRow :gutter="GAP.half">
            <ElCol
              :span="9"
              :class="$style.tr"
            >
              公告类型：
            </ElCol>
            <ElCol
              :span="15"
              :class="$style.marginTop"
            >
              {{ noticeDTO.noticeType| anoticeType }}
            </ElCol>
          </ElRow>
          <ElRow :gutter="GAP.half">
            <ElCol
              :span="9"
              :class="$style.tr"
            >
              最近修改时间：
            </ElCol>
            <ElCol
              :span="15"
              :class="$style.marginTop"
            >
              {{ noticeDTO.modifyDate }}
            </ElCol>
          </ElRow>
        </ElCol>
      </ElRow>
      <h4>公告详情</h4>
      <h5 :class="$style.noticeTitle">
        {{ noticeDTO.title }}
      </h5>
      <div
        :class="$style.content"
        v-html="noticeDTO.content"
      />
    </ElDialog>
    <!-- 服务上下架弹框 -->
    <ElDialog
      title="服务基本信息"
      width="80vw"
      :visible.sync="serviceVisible"
    >
      <ServiceDetial
        :service-dto="serviceDTO"
      />
    </ElDialog>
    <!-- 服务新旧弹框 -->
    <ElDialog
      title="服务基本信息"
      width="80vw"
      :visible.sync="serviceOldandnewVisible"
    >
      <ElRow :gutter="GAP.double">
        <ElCol :span="12">
          <ServiceDetial
            :service-dto="serviceDTO"
            title="修改前"
          />
        </ElCol>
        <ElCol :span="12">
          <!-- 0新 -->
          <ServiceDetial
            :service-dto="serviceDTOWorn"
            title="修改后"
          />
        </ElCol>
      </ElRow>
    </ElDialog>
    <!-- 产品弹框-->
    <ElDialog
      title="产品信息"
      width="80vw"
      :visible.sync="productVisible"
    >
      <ElForm
        label-position="right"
        inline
      >
        <h3>基本信息</h3>
        <ElFormItem label="产品名称：">
          {{ productDTOList.productsName }}
        </ElFormItem>

        <ElFormItem label="产品类型：">
          {{ optionType[productDTOList.productsTypeCode] }}
        </ElFormItem>

        <ElFormItem label="状态：">
          {{ optionState[productDTOList.productsStatus] }}
        </ElFormItem>

        <ElFormItem label="交付类型：">
          {{ optionDelivery[productDTOList.deliveryType] }}
        </ElFormItem>

        <h3>产品详情</h3>
        <ElFormItem label="产品型号：">
          <div :class="[$style.describe, 'common_rich_text_des']">
            {{ productDTOList.productsModel }}
          </div>
        </ElFormItem>

        <div>
          <ElFormItem label="产品描述：">
            <div
              :class="[$style.describe, 'common_rich_text_des']"
              v-html="productDTOList.productsRemarkContent"
            />
          </ElFormItem>
        </div>
        <!-- 产品现在，修改后的价格 -->
        <div v-show="form.examinationTheme === 'MODIFY_PRODUCT'">
          <h3>产品当前定价</h3>
          <template>
            <ElTable
              :data="productDTOList.priceList"
              border
            >
              <ElTableColumn label="云服务商">
                <template #default="scope">
                  {{ scope.row.providerName }}
                </template>
              </ElTableColumn>

              <ElTableColumn label="服务方式">
                <template #default="scope">
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_TIME'">
                    按次数
                  </p>
                  <!-- <p v-if="scope.row.productsModeCode==='USR_PRODUCT_VALUATION_YEAR'">
                        按年
                      </p> -->
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_POINT'">
                    按个数
                  </p>
                </template>
              </ElTableColumn>

              <!--0- 当前价格 -->
              <ElTableColumn label="产品定价">
                <template #default="scope">
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_TIME'">
                    {{ scope.row.recommenPrice }}元/次
                  </p>
                  <!-- <p v-if="scope.row.productsModeCode==='USR_PRODUCT_VALUATION_YEAR'">
                        {{ scope.row.recommenPrice }}元/年
                      </p> -->
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_POINT'">
                    {{ scope.row.recommenPrice }}元/个
                  </p>
                </template>
              </ElTableColumn>
            </ElTable>
          </template>
        </div>
        <!-- 修改后的价格 -->
        <div v-show="form.examinationTheme === 'MODIFY_PRODUCT'">
          <h3>产品修改后定价</h3>
          <template>
            <ElTable
              :data="ProductDTOAlter.priceAfterList"
              border
            >
              <ElTableColumn label="云服务商">
                <template #default="scope">
                  {{ scope.row.providerName }}
                </template>
              </ElTableColumn>

              <ElTableColumn label="服务方式">
                <template #default="scope">
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_TIME'">
                    按次数
                  </p>
                  <!-- <p v-if="scope.row.productsModeCode==='USR_PRODUCT_VALUATION_YEAR'">
                        按年
                      </p> -->
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_POINT'">
                    按个数
                  </p>
                </template>
              </ElTableColumn>

              <!-- 1-修改后价格 -->
              <ElTableColumn label="产品定价">
                <template #default="scope">
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_TIME'">
                    {{ scope.row.recommenPrice }}元/次
                  </p>
                  <!-- <p v-if="scope.row.productsModeCode==='USR_PRODUCT_VALUATION_YEAR'">
                        {{ scope.row.recommenPrice }}元/年
                      </p> -->
                  <p v-if="scope.row.productsModeCode==='PRODUCT_VALUATION_POINT'">
                    {{ scope.row.recommenPrice }}元/个
                  </p>
                </template>
              </ElTableColumn>
            </ElTable>
          </template>
        </div>
        <!-- 库存 -->
        <div v-if="form.examinationTheme === 'ADDSTORAGE_PRODUCT'">
          <ElFormItem label="产品入库数量：">
            <div
              :class="[$style.describe, 'common_rich_text_des']"
              v-html="productDTOList.storageAmounts"
            />
          </ElFormItem>
        </div>
      </ElForm>
    </ElDialog>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase
import ElTag from 'element-ui/lib/tag'
import ElAvatar from 'element-ui/lib/avatar'
import ElTimeline from 'element-ui/lib/timeline'
import ElTimelineItem from 'element-ui/lib/timeline-item'
// import ITable, { ElTableColumn } from '@com/Table'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'

import ServiceDetial from './ServiceDetial'
import IIcon from '@com/Icon'

import { ROLES } from '@/enums'

import { API, download } from '@/api/tools/file'
import { getUri } from '@/utils/ajax'

// 下载
// import CONFIGIN from '@home/config/index'
import {
  detail,
  record,
  passAndRefuseSave,
  getExaminationEdit,
} from '@/api/servicePlatform/examination'

import IChooser from '@com/ChooserAsyncFunctional'
import { selectProductType } from '@/api/servicePlatform/shop'

import { THEME, STATUS } from '@/enums/approve'
import STYLE from '@/scss/status.module.scss'
import LAYOUT from '@/scss/export/layout.scss'

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: {
    ElTimeline,
    ElTimelineItem,
    ElTag,
    IChooser: IChooser as any,
    ElAvatar,
    IIcon,
    ElTable,
    ElTableColumn,
    ServiceDetial,
  },
  filters: {
    noticeLevelType: function(val) {
      const typeArr = ['紧急', '普通']
      return typeArr[val]
    },
    anoticeType: function(val) {
      const typeArr = ['其他公告', '安全公告', '安全资讯', '风险预警']
      return typeArr[val]
    },
  },

  data() {
    return {
      // 权限控制
      commercialManager: this.authFit(ROLES.commercialManager),
      remarkVisible: false,
      noticeVisible: false,
      serviceVisible: false,
      serviceOldandnewVisible: false,
      productVisible: false,
      // 新增数据
      remarkForm: {
        remark: '',
      },
      form: {
        id: '',
        examinationNo: '',
        examinationTheme: '',
        applicantName: '',
        examinationStatus: '',
        remark: '',
        takeEffectTime: '',
      },
      activities: [
        {
          id: '',
          createUser: '',
          createDate: '',
          remake: '',
          operationType: '',
        },
      ],
      examinationType: '',
      examinationTheme: '',
      noticeDTO: {},
      serviceDTO: {},
      // 旧
      serviceDTOWorn: {},
      // 当前-修改后 产品定价
      ProductDTOAlter: {},
      packageList: [],
      productDTOList: [],
      serviceDTOList: [],
      optionType: {},
    }
  },

  computed: {
    GAP: () => ({
      gap: +LAYOUT.gap,
      half: +LAYOUT.gap / 2,
      double: +LAYOUT.gap * 2,
    }),
    optionState: () => ({ 0: '停用', 1: '启用' }),
    optionDelivery: () => ({ 0: '本地交付', 1: '线上交付' }),
    THEME: () => THEME,
    STATUS: () => STATUS,
    COLOR: () => [
      STYLE.primary,
      STYLE.success,
      STYLE.danger,
      STYLE.info,
    ],
    id() {
      return this.route.query.id
    },
  },
  methods: {
    fetch() {
      return detail.apply(null, arguments).then(res => {
        return (this.form = res.data.body)
      })
    },
    open(examinationType: obj) {
      this.remarkVisible = true
      this.examinationType = examinationType
    },
    // 取消新增
    cancelSave() {
      this.remarkVisible = false
      this.remarkForm.remark = ''// 清空备注信息
    },
    // 查看详情
    examinationEdit(examinationTheme: any) {
      this.examinationTheme = examinationTheme
      const data = {
        id: this.id,
        examinationTheme: examinationTheme,
      }
      getExaminationEdit(data)
        .then((res) => {
          this.packageList = res?.data?.body?.body?.packageList
          if (this.examinationTheme === 'ADD_NOTICE' || this.examinationTheme === 'MODIFY_NOTICE') {
            this.noticeVisible = true
            this.noticeDTO = res.data.body
          }
          if (this.examinationTheme === 'UPPER_SERVICE' || this.examinationTheme === 'LOWER_SERVICE' ||
          this.examinationTheme === 'UPDOWNSHELVES_SERVICE') {
            this.serviceVisible = true
            this.serviceDTO = res.data.body.body

            // 定价
            // this.packageList = res.data.body.body.packageList
          }
          if (
            this.examinationTheme === 'MODIFY_SERVICE') {
            this.serviceOldandnewVisible = true
            this.serviceDTOList = res.data.body.body
            for (let i = 0; i < this.serviceDTOList.length; i++) {
              // 新
              this.serviceDTO = this.serviceDTOList[1]
              // 旧
              this.serviceDTOWorn = this.serviceDTOList[0]
              break
            }
          }
          if (this.examinationTheme === 'UPPER_PRODUCT' || this.examinationTheme === 'LOWER_PRODUCT' ||
              this.examinationTheme === 'MODIFY_PRODUCT') {
            this.productVisible = true
            // 当前
            this.productDTOList = res.data.body.body
            // 修改
            this.ProductDTOAlter = res.data.body.body
          }

          if (this.examinationTheme === 'ADDSTORAGE_PRODUCT') {
            this.productVisible = true
            this.productDTOList = res.data.body.body
          }
        })
    },
    // 通过and拒绝
    save() {
      const remark = this.remarkForm.remark
      if (remark.length <= 0) {
        this.$notify.error('备注不能为空')
        return true
      }
      this.remarkVisible = false
      const data = {
        id: this.id,
        examinationType: this.examinationType,
        remark: this.remarkForm.remark,
        examinationTheme: this.form.examinationTheme,
      }
      passAndRefuseSave(data)
        .then((res) => {
          if (!res.data.status) {
            this.$notify.error(res.data.msg)
          } else {
            this.$notify.success('操作成功')
          }
        })
        .finally(() => {
          this.remarkForm.remark = ''// 清空备注信息
        })
      // 自动刷新
      this.$router.go(0)
    },
    // 凭证下载
    getUrl(fileId: string) {
      return getUri(API.download, { fileId })
    },
    getAvatar(src: string) {
      return src && src.indexOf('blob:') ? download(src) : src
    },
  },
  created() {
    if (this.id) {
      // 详情
      // detail({ id: id }).then(res => {
      //   this.form = res.data.body
      // })
      // 审批记录
      record({ examinationId: this.id }).then(res => {
        this.activities = res.data.body
      })
      selectProductType().then(res => {
        (res?.data?.body || []).forEach((item: any) => {
          this.optionType[item.productsTypeCode] = item.productsTypeName
        })
      })
    } else {
      this.activities = []
    }
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/timeline';
@import '~element-ui/packages/theme-chalk/src/timeline-item';
@import '~element-ui/packages/theme-chalk/src/tag';
@import '~element-ui/packages/theme-chalk/src/avatar';
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.wrapper :global {
  .el-timeline-item__timestamp {
    color: $colorTextMinor;
    font-size: $smaller;
  }
}

.container {
  width: $widthPage;
  margin: 0 auto;
}

.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: $gapNormal / 2;
  border-bottom: $borderBase;
}

.title {
  font-weight: bold;
  font-size: $larger;
}

.iconlist {
  display: flex;

  div {
    margin-left: $gapNormal;
    cursor: pointer;
  }
}

.center {
  display: flex;
}

.text {
  position: relative;
  margin-right: 96px;
}

.img {
  position: absolute;
  top: -6px;
  left: -58px;
  width: 50px;
  height: 50px;

  :global(.el-avatar) {
    background-color: $colorTransparent !important;
  }
}

.conterbox {
  display: flex;
  flex-wrap: wrap;
  margin: $gapNormal 0;
  border-bottom: $borderBase;

  .conterson {
    display: flex;
    flex: 45%;
    height: 51px;
    line-height: 35px;
  }
}

.sonitem {
  width: 100px;
  padding: 0 $gapNormal / 2;
  text-align: right;
}

.sontext {
  margin-right: 23px;
}

.tr {
  line-height: $xxLarge;
  text-align: right;
}

.noticeTitle {
  padding-bottom: $gapNormal / 2;
  font-size: $larger;
  text-align: center;
  border-bottom: $borderBase;
}

.content {
  max-height: 45vh;
  overflow-y: auto;
}

.marginTop {
  margin-top: 4px;
}
// 产品描述
.describe {
  min-width: 500px;
  max-height: 300px;
  overflow: auto;
}

.userName {
  margin: $gapNormal / 4 0;
  font-weight: bold;
}

.operationType {
  margin-top: $gapNormal / 4;
}
</style>
