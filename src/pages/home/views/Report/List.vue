<!-- 描述 -->
<template>
  <div>
    <div :class="$style.echartBox">
      <div :class="$style.headBox">
        <b>主机杀毒</b>
      </div>
      <div :class="[$style.echartitem,$style.fl]">
        <ElRow>
          <ElCol
            :span="8"
            :class="$style.leftBox"
          >
            <p :class="$style.countSty1">
              <i class="i-zaiguanzhongduan" />
              <span>
                在管终端总数<br>
                <b>{{ countFrom.allCount || 0 }}</b>
              </span>
            </p>
            <p :class="$style.countSty2">
              <i class="i-zaixian-lixianzhongduan" />
              <span>
                在线/离线终端数<br>
                <b>
                  <em :class="$style.sty1">{{ countFrom.onlineCount || 0 }}</em>
                  <em :class="$style.sty2">/{{ countFrom.offlineCount || 0 }}</em>
                </b>
              </span>
            </p>
          </ElCol>
          <ElCol :span="16">
            <!-- 圆形图表（终端总数） -->
            <div
              id="containerTerminal"
              style="height: 200px;"
            />
          </ElCol>
        </ElRow>
      </div>
      <div :class="[$style.echartitem,$style.fr]">
        <ElRow>
          <ElCol :span="8">
            <p :class="$style.countSty3">
              <i class="i-Windowszhongduan" />
              <span>
                Windows<br>
                <b>{{ countFrom.windowCount || 0 }}</b>
              </span>
            </p>
            <p :class="$style.countSty4">
              <i class="i-linuxzhongduan" />
              <span>
                Linux<br>
                <b>{{ countFrom.linuxCount || 0 }}</b>
              </span>
            </p>
          </ElCol>
          <ElCol
            :span="16"
            :class="$style.rightBox"
          >
            <!-- 圆形图表（系统） -->
            <div
              id="containerSystem"
              style="height: 200px;"
            />
          </ElCol>
        </ElRow>
      </div>
    </div>

    <div :class="[$style.blkBox,$style.mtp1]">
      <div :class="$style.headBox">
        <b>防护终端列表</b>
      </div>
      <!-- 筛选表单 -->
      <div :class="$style.mtb1">
        <ElForm
          :inline="true"
        >
          <ElFormItem>
            <ElInput
              v-model="params.name"
              clearable
              placeholder="请输入IP、MAC、终端名称"
            />
          </ElFormItem>

          <ElFormItem>
            <ElSelect
              v-model="params.onlineStatus"
              clearable
              placeholder="在线状态"
              value-key="item.label"
            >
              <ElOption
                v-for="item in statusObjects"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem>
            <ElSelect
              v-model="params.system"
              placeholder="操作系统"
              value-key="item.lable"
              clearable
            >
              <ElOption
                v-for="item in systemObjects"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </div>
      <!-- table -->
      <ElRow>
        <ITable
          ref="table"
          :class="$style.padSty"
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
      :treminal-id="treminalId"
      :visible.sync="visible"
      @success="refresh"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import echarts from '@/libs/echarts'
// 饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import {
  terminalList,
  terminalCount,
} from '@/api/servicePlatform/operat'

import RelationUser from './relationUser'

import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: { route: { type: Object, required: true } },
  components: { ITable, ElTableColumn, RelationUser },
  data() {
    return {
      userId: '',
      treminalId: '',
      allCount: 0, // 终端总数
      onlineCount: 0, // 在线总数
      offlineCount: 0, // 离线总数
      countFrom: {}, // 终端数据
      allCountEachart: [], // 饼图数据
      WindowsCount: 0, // Windows终端
      LinxCount: 0, // Linux终端
      systemCount: [], // 操作系统占比统计饼图数据
      visible: false,
      reUserObjects: [],
      params: {
        name: '',
        onlineStatus: '',
        system: '',
      },
      objects: [],
    }
  },
  computed: {
    STYLE: () => STYLE,
    page() {
      return terminalList
    },
    query(this: any) {
      return this.params
    },
    head() {
      return [
        {
          label: '在线状态',
          formatter: (row: code) => {
            const oStatus = row.onlineStatus
            return this.$createElement(
              'span',
              oStatus === '1'
                ? {
                  class: `${STYLE.success}`,
                } : {
                  class: `${STYLE.danger}`,
                },
              row.onlineStatus === '1' ? '在线' : '离线'
            )
          },
        },
        {
          prop: 'name',
          label: '终端名称',
        },
        {
          prop: 'userName',
          label: '用户',
        },
        {
          prop: 'ip',
          label: 'IP地址',
        },
        { prop: 'mac', label: 'MAC地址' },
        {
          prop: 'system',
          label: '操作系统',
        },
        { prop: 'clientType', label: '客户端类型' },
        {
          prop: 'clientVersion',
          label: '客户端版本',
          width: '120x',
        },
        { prop: 'virusVersion', label: '病毒库版本', width: '120x' },
        { prop: 'activeTime', label: '最新活跃时间', width: '220x' },

      ]
    },
    statusObjects: () => [{
      value: '1',
      lable: '在线',
    }, {
      value: '0',
      lable: '离线',
    }],
    systemObjects: () => [{
      value: 'windows',
      lable: 'windows',
    }, {
      value: 'linux',
      lable: 'linux',
    }],
  },
  methods: {
    refresh() {
      (this.$refs.table as any).fetch()
    },
    // 跳转详情
    details(obj: any) {
      this.jump({ path: `${obj.id}/detail`, append: true })
    },
    // 关联用户
    relevance(row) {
      this.treminalId = row.id
      this.visible = true
    },
    // 获取终端总数
    getTerminalCount(this: any) {
      terminalCount({}).then(res => {
        this.countFrom = res.data.body
        this.allCountEachart = res.data.body.lineCountTypeList
        this.systemCount = res.data.body.requestValueDTOList
        this.initEachartTerminal()
        this.initEachartSystem()
      })
    },
    // 初始化图表
    initEachartTerminal() {
      const dom = document.getElementById('containerTerminal')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.allCountEachart.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '终端',
            type: 'pie',
            radius: '55%',
            center: ['50%', '40%'],
            data: this.allCountEachart,
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorList = ['#81D381', '#D1D0DA']
                  return colorList[params.dataIndex]
                },
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },

          },
        ],
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    // 初始化图表
    initEachartSystem() {
      const dom = document.getElementById('containerSystem')
      const myChart = echarts.init(dom)
      const option = {
        title: {
          show: this.systemCount.length === 0,
          text: '暂无数据',
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '操作系统',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['50%', '40%'],
            data: this.systemCount,
            emphasis: {
              show: false,
              itemStyle: {
                normal: {
                  color: function(params) {
                    const colorList = ['#FEBB69', '#6BA2FD', '#CFC9C9', '#988AFC', '#FE6A93', '#82D184']
                    return colorList[params.dataIndex]
                  },
                },
              },
            },
          },
        ],
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
  },
  mounted() {
    // 初始化表
    this.getTerminalCount()
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

.mtb1 {
  margin-bottom: -14px;
  padding: 0 10px;
}

.padSty {
  padding: 0 10px;
}

.blkBox {
  padding: 24px;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
}

.echartBox {
  min-height: 120px;
  padding: 24px;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
}

.echartitem {
  position: relative;
  width: 50%;
}

.headBox {
  padding: 0 0 30px;
  overflow: hidden;

  b {
    color: #333;
    font-weight: bold;
    font-size: 16px;
  }
}

.fontsty {
  display: inline-block;
  margin-right: 12px;
  color: rgba(51, 116, 196, 1);
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
}

.countSty1,
.countSty2,
.countSty3,
.countSty4 {
  i {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-top: 10px;
    margin-right: 24px;
    color: $colorTheme;
    font-size: 26px;
    vertical-align: top;
  }

  span {
    display: inline-block;
    color: #333;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    text-align: left;
  }

  b {
    color: #333;
    font-weight: bold;
    font-size: 20px;

    em {
      font-style: normal;
    }

    .sty1 {
      color: #81d381;
    }

    .sty2 {
      color: #d1d0da;
    }
  }
}

.countSty1 {
  align-self: start;
}

.countSty2 {
  align-self: end;
}

.countSty3 {
  align-self: start;
}

.countSty4 {
  align-self: end;
}

.leftBox {
  padding-left: 20px;
}

.rightBox {
  padding-right: 40px;
}
</style>
