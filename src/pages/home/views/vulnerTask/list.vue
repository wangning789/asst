<!-- 描述 -->
<template>
  <div>
    <!-- 统计 -->
    <ElRow :gutter="20">
      <ElCol
        :span="12"
        :class="[$style.total, $style.sum]"
      >
        <div :class="$style.sumBox">
          <ElCol
            :span="9"
            :class="$style.bgcolor"
          >
            <ISVG
              icon="i-aqgj"
              size="40px"
            />
            <div :class="$style.count">
              <p :class="$style.myP">
                存在漏洞的资产总数
              </p>
              <span :class="$style.totalSpan">{{ vulnTaskCt || 0 }}</span>
            </div>
          </ElCol>
        </div>
      </ElCol>

      <ElCol
        :span="12"
        :class="[$style.total, $style.status]"
      >
        <div
          :class="$style.sumBox"
        >
          <ElCol
            :span="9"
            :class="$style.bgcolor"
          >
            <ISVG
              icon="i-czzt"
              size="40px"
            />
            <div :class="$style.count">
              <p :class="$style.myP">
                未修复漏洞数
              </p>
              <span :class="$style.totalSpan">{{ format(dispose.totalCount) }}</span>
            </div>
          </ElCol>
          <!-- 右边进度条 -->
          <ElCol
            :span="14"
            :offset="1"
            :class="$style.mtp2"
          >
            <ElRow>
              <ElCol
                :span="8"
                :class="$style.colAlign"
              >
                <label>高危</label>
                <span :class="$style.red">{{ format(dispose.warnUpdate) }}</span>
              </ElCol>
              <!-- 处置 -->
              <ElCol
                :span="8"
                :class="$style.colAlign"
              >
                <label>中危</label>
                <span :class="$style.yellow">{{ format(dispose.pengding) }}</span>
              </ElCol>
              <!-- 已处理 -->
              <ElCol
                :span="8"
                :class="$style.colAlign"
              >
                <label>低危</label>
                <span :class="$style.green">{{ format(dispose.handled) }}</span>
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
                :class="$style.c3"
              />
              <ElCol
                :span="Phandled"
                :class="$style.c2"
              />
            </ElRow>
          </ElCol>
        </div>
      </ElCol>
    </ElRow>
    <div :class="[$style.blkBox,$style.mtp3]">
      <!-- 筛选表单 -->
      <div :class="$style.mtp1">
        <Transition
          name="fold"
          mode="out-in"
        >
          <ElForm
            :inline="true"
          >
            <ElFormItem>
              <ElInput
                v-model="params.name"
                clearable
                placeholder="请输入任务编号、任务名称"
              />
            </ElFormItem>

            <ElFormItem>
              <ElSelect
                v-model="params.userId"
                clearable
                placeholder="用户"
              >
                <ElOption
                  v-for="(item,index) in userObjects"
                  :key="index"
                  :label="item.department"
                  :value="item.userId"
                />
              </ElSelect>
            </ElFormItem>

            <ElFormItem>
              <ElSelect
                v-model="params.status"
                clearable
                placeholder="扫描状态"
              >
                <ElOption
                  v-for="(item,index) in statusObjects"
                  :key="index"
                  :label="item.lable"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElForm>
        </Transition>
      </div>
      <!-- table -->
      <ElRow>
        <ITable
          ref="table"
          :get="page"
          :query="query"
          :head="head"
        >
          <ElTableColumn
            label="操作"
            width="100px"
          >
            <template #default="{ row }">
              <ElTooltip content="关联用户">
                <ElButton
                  type="text"
                  :icon="'i-guanlianyonghu1 ' + STYLE.primary"
                  @click="relevance(row)"
                />
              </ElTooltip>
              <ElTooltip content="查看详情">
                <ElButton
                  type="text"
                  :icon="'i-chakan ' + STYLE.primary"
                  @click="details(row)"
                />
              </ElTooltip>
            </template>
          </ElTableColumn>
        </ITable>
      </ElRow>
    </div>
    <!-- 引用关联用户组件 -->
    <RelationUser
      :user-id="userId"
      :vuln-id="vulnId"
      :visible.sync="visible"
      @success="refresh"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import {
  vulnTaskCount,
  vulnTaskList,
  terminalCount,
  terminalUesr,
} from '@/api/servicePlatform/operat'
import RelationUser from './relationUser'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import STYLE from '@/scss/status.module.scss'
import formatNumber from '@/utils/formatNumber'
// import { stalist, detaList } from '@/api/servicePlatform/safety'
import ISVG from '@com/Icon'
/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, RelationUser, ISVG },
  data() {
    return {
      vulnTaskCt: '', // 存在漏洞的资产总数
      notVulnTaskCount: '', // 未修复漏洞数
      riskTaskCount: '', // 危险漏洞数
      warnTaskCount: '', // 警告漏洞数
      lowRiskCount: '', // 低危漏洞数
      disTotalCount: '',
      userId: '',
      vulnId: '',
      allCount: '', // 终端总数
      onlineCount: '', // 在线总数
      offlineCount: '', // 离线总数
      allCountEachart: [], // 饼图数据
      WindowsCount: '', // Windows终端
      LinxCount: '', // Linux终端
      systemCount: [], // 操作系统占比统计饼图数据
      visible: false,
      // 数
      statisLis: {},
      // 处置统计
      dispose: {
        totalCount: '',
        warnUpdate: '',
        pengding: '',
        handled: '',
      },
      statusObjects: [{
        value: '0',
        lable: '等待扫描',
      }, {
        value: '2',
        lable: '正在扫描',
      },
      {
        value: '5',
        lable: '扫描暂停',
      },
      {
        value: '4',
        lable: '扫描完成',
      },
      {
        value: '8',
        lable: '异常停止',
      }],
      userObjects: [], // 用户数据
      params: {
        name: '',
        userId: '',
        status: '',
      },
      objects: [],
    }
  },
  computed: {
    STYLE: () => STYLE,
    page() {
      return vulnTaskList
    },
    query(this: any) {
      return this.params
    },
    head() {
      return [
        {
          prop: 'taskNo',
          label: '任务编号',

        },
        {
          prop: 'deviceName',
          label: '设备名称',
        },
        {
          prop: 'regionName',
          label: '云平台',

        },
        {
          prop: 'networkArea',
          label: '网络区域',
        },
        { prop: 'name', label: '任务名称' },
        {
          prop: 'lastScantime',
          label: '最近扫描时间',
        },
        {
          prop: 'status',
          label: '扫描状态',
          formatter: (row: any) => {
            let oStatus = row.status
            let oclass = `${STYLE.warn}`
            switch (oStatus) {
              case '0':
                oclass = `${STYLE.warn}`
                oStatus = '等待扫描'
                break
              case '2':
                oclass = `${STYLE.success}`
                oStatus = '正在扫描'
                break
              case '5':
                oclass = `${STYLE.danger}`
                oStatus = '扫描暂停'
                break
              case '4':
                oclass = `${STYLE.success}`
                oStatus = '扫描完成'
                break
              case '8':
                oclass = `${STYLE.danger}`
                oStatus = '异常停止'
                break
            }
            return this.$createElement(
              'span',
              {
                class: oclass,
              },
              oStatus
            )
          },
        },
        {
          prop: 'userName',
          label: '用户',
        },
      ]
    },
    // 处置
    pUpdate() {
      return parseInt(this.dispose.warnUpdate / this.dispose.totalCount * 24)
    },
    opengding() {
      return parseInt(this.dispose.pengding / this.dispose.totalCount * 24)
    },
    Phandled() {
      return parseInt(this.dispose.handled / this.dispose.totalCount * 24)
    },
  },
  methods: {
    format: formatNumber,
    // 跳转详情
    details(obj: any) {
      this.jump({ path: `${obj.id}/detail`, append: true })
    },
    // 关联用户
    relevance(row) {
      this.vulnId = row.id
      this.visible = true
    },

    // 接受关联对象列表
    getObject(this: any) {
      terminalUesr({}).then(res => {
        this.userObjects = res.data.body
      })
    },
    // 获取终端总数
    getTerminalCount(this: any) {
      terminalCount({}).then(res => {
        this.allCount = res.data.body.allCount
        this.onlineCount = res.data.body.onlineCount
        this.offlineCount = res.data.body.offlineCount
        this.allCountEachart.push(this.onlineCount, this.offlineCount)
      })
    },
    // 关闭弹窗
    close() {
      this.visible = false
    },
    refresh() {
      (this.$refs.table as any).fetch()
    },
  },
  created(this: any) {
    this.getObject()
    vulnTaskCount().then(res => {
      this.vulnTaskCt = res.data.body[0]
      this.dispose.totalCount = res.data.body[1]
      this.dispose.warnUpdate = res.data.body[2]
      this.dispose.pengding = res.data.body[3]
      this.dispose.handled = res.data.body[4]
    })
  },
}
</script>

<style lang="scss" module>
.fr {
  float: right;
}

.fl {
  float: left;
}

.mtp1 {
  margin-top: 30px;
}

.mtp2 {
  margin-top: 30px;
}

.mtp3 {
  margin-top: 20px;
}

.echartBox {
  overflow: hidden;
}

.echartitem {
  padding: 20px 40px;
  border: 1px solid #dedede;
}

.titleSty {
  font-size: 12px;
}

.linkSty {
  display: inline-block;
  margin-right: 12px;
  color: rgba(50, 115, 196, 1);
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
  cursor: pointer;
}

.fontSty1 {
  color: #333;
  font-size: 28px;
  font-style: normal;
}

.icoSty {
  display: inline-block;
  margin: 0 4px;
  padding: 4px 6px;
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
}

.clr1 {
  background-color: rgba(255, 51, 0, 1);
}

.clr2 {
  background-color: rgba(255, 153, 0, 1);
}

.clr3 {
  background-color: rgba(153, 153, 153, 1);
}

.sumBox {
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}

.countSty1 {
  position: absolute;
  top: 30px;
  left: 20px;
  color: #333;
  font-size: 12px;
}

.countSty1 b {
  font-size: 28px;
}

.countSty2 {
  position: absolute;
  bottom: 30px;
  left: 20px;
  color: #333;
  font-size: 12px;
}

.countSty2 b {
  color: #999;
  font-size: 28px;
}

.countSty2 b em {
  color: #008000;
}

.countSty3 {
  position: absolute;
  top: 30px;
  left: 20px;
  color: #333;
  font-size: 12px;
}

.countSty3 b {
  color: #3385d9;
  font-size: 28px;
}

.countSty4 {
  position: absolute;
  bottom: 30px;
  left: 20px;
  color: #333;
  font-size: 12px;
}

.countSty4 b {
  color: #f90;
  font-size: 28px;
}

.bgcolor {
  display: flex;
  align-items: center;
  height: 116px;
  padding-left: $gapNormal !important;
  background: linear-gradient(90deg, $colorTheme5, $colorWhite);
}

.count {
  display: inline-block;
  margin-top: 10px;
  margin-left: $gapNormal;
}

.myP {
  margin: 0;
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
  color: #e6a23c;
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
  background-color: #67c23a;
}

.c1 {
  background-color: $colorInfo;
}

.colAlign {
  display: flex;
  align-items: center;

  > label {
    display: inline-block;
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
    width: 40px;
  }
}

.progress {
  height: $gapNormal / 2;
  margin-top: $gapNormal / 2;
  overflow: hidden;
  background: $colorBackGround;
  border-radius: $gapNormal / 4;
}

.blkBox {
  padding: 20px 20px 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
}

.osvg {
  margin-top: -5px;
}
</style>
