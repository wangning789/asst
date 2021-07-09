<!-- 描述 -->
<template>
  <div>
    <div :class="$style.taskExecution">
      <div :class="$style.seleteLeft">
        <!--端口 -->
        <div :class="$style.portInfo">
          <div :class="$style.leftHead">
            端口
          </div>
          <div
            v-for="(item,index) in potarr"

            :key="index"
            :class="$style.portfoot"
          >
            <div
              v-if="index<=2"
              :class="$style.sia"
            >
              <span :class="$style.fontcolor">{{ item.port }}</span>
              <span :class="$style.fontsize">{{ item.number }}</span>
            </div>
          </div>
          <div
            v-for="(item,index) in potarr"

            :key="item.id+ Math.random()*index+1"
            :class="$style.portfoot"
          >
            <div
              v-if="index>=3 && pull === true"
              :class="$style.sia"
            >
              <span :class="$style.fontcolor">{{ item.port }}</span>
              <span :class="$style.fontsize">{{ item.number }}</span>
            </div>
          </div>
          <div :class="$style.ico">
            <div>
              <i
                v-if="!pull"
                class="el-icon-bottom"
                @click=" pull = true"
              />
              <i
                v-if="pull"
                class="el-icon-top"
                @click=" pull = false"
              />
            </div>
          </div>
        </div>
        <!--协议 -->
        <div :class="$style.portInfo">
          <div :class="$style.leftHead">
            协议
          </div>
          <div
            v-for="(item,index) in potarr"

            :key="index"
            :class="$style.portfoot"
          >
            <div
              v-if="index<=2"
              :class="$style.sia"
            >
              <span :class="$style.fontcolor">{{ item.port }}</span>
              <span :class="$style.fontsize">{{ item.number }}</span>
            </div>
          </div>
          <div
            v-for="(item,index) in potarr"

            :key="item.id+ Math.random()*index+1"
            :class="$style.portfoot"
          >
            <div
              v-if="index>=3 && protocol === true"
              :class="$style.sia"
            >
              <span :class="$style.fontcolor">{{ item.port }}</span>
              <span :class="$style.fontsize">{{ item.number }}</span>
            </div>
          </div>
          <div :class="$style.ico">
            <div>
              <i
                v-if="!protocol"
                class="el-icon-bottom"
                @click="protocol = true"
              />
              <i
                v-if="protocol"
                class="el-icon-top"
                @click="protocol = false"
              />
            </div>
          </div>
        </div>
        <!--组件 -->
        <div :class="$style.portInfo">
          <div :class="$style.leftHead">
            组件
          </div>
          <div
            v-for="(item,index) in potarr"

            :key="index"
            :class="$style.portfoot"
          >
            <div
              v-if="index<=2"
              :class="$style.sia"
            >
              <span :class="$style.fontcolor">{{ item.port }}</span>
              <span :class="$style.fontsize">{{ item.number }}</span>
            </div>
          </div>
          <div
            v-for="(item,index) in potarr"

            :key="item.id+ Math.random()*index+1"
            :class="$style.portfoot"
          >
            <div
              v-if="index>=3 && modu === true"
              :class="$style.sia"
            >
              <span :class="$style.fontcolor">{{ item.port }}</span>
              <span :class="$style.fontsize">{{ item.number }}</span>
            </div>
          </div>
          <div :class="$style.ico">
            <div>
              <i
                v-if="!modu"
                class="el-icon-bottom"
                @click="modu = true"
              />
              <i
                v-if="modu"
                class="el-icon-top"
                @click="modu = false"
              />
            </div>
          </div>
        </div>
      </div>
      <div :class="$style.rightTab">
        <!--查询 -->
        <div :class="$style.filterspool">
          <div :class="$style.flexipFile">
            <div :class="$style.ipFile">
              <ElSelect
                v-model.lazy.trim="value.serverType"
                clearable
                size="small"
                filterable
                placeholder="服务器类型"
              >
                <ElOption
                  v-for="(label, key) in ASSET_USE_SERVER"
                  :key="key"
                  :value="key"
                  :label="label"
                />
              </ElSelect>
            </div>
            <div :class="$style.ipFile">
              <ElInput
                v-model.lazy.trim="value.keyword"
                clearable
                size="medium"
                placeholder="请输入关键字"
                suffix-icon="i-sousuo"
                :class="$style.type"
              />
            </div>
          </div>
        </div>
        <!--spoolList  -->
        <div :class="$style.spoolTable">
          <ITable
            ref="table"
            :data="page"
            :query="filterForm"
          >
            <!--名称 -->
            <ElTableColumn
              prop="name"
              label="名称"
              align="center"
              width="180"
            >
              <template #default="{ row }">
                <div :class="$style.pollname">
                  <div :class="$style.intranetname">
                    {{ row.name }}
                  </div>
                  <div :class="$style.ipinfo">
                    <div :class="$style.ip">
                      <a href="#">  {{ row.ip }}</a>
                    </div>
                    <div :class="$style.basic">
                      <p>{{ row.msg }}</p>
                      <p>{{ row.co }}</p>
                      <p>{{ row.asn }}</p>
                      <p>{{ row.zz }}</p>
                      <p>{{ row.ali }}</p>
                      <p>{{ row.col }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </ElTableColumn>
            <!--端口 -->
            <ElTableColumn
              prop="port"
              label="端口"
              width="100"
              align="center"
            >
              <template #default="{ row }">
                <div :class="$style.port">
                  <div
                    v-for="(item,index) in row.list"
                    :key="index"
                    :class="$style.portList"
                  >
                    <div>
                      {{ item.port }}
                    </div>
                    <div :class="$style.documentcilor">
                      <i class="el-icon-document" />
                    </div>
                    <div :class="$style.documentcilor">
                      <i class="el-icon-link" />
                    </div>
                  </div>
                </div>
              </template>
            </ElTableColumn>
            <!--协议 -->
            <ElTableColumn
              prop="agreement"
              label="协议"
              width="50"
              align="center"
            >
              <template #default="{ row }">
                <div
                  v-for="(item,index) in row.agreement"
                  :key="index"
                  :class="$style.fontsize"
                >
                  {{ item }}
                </div>
              </template>
            </ElTableColumn>
            <!--组件 -->
            <ElTableColumn
              prop="module"
              label="组件"
              width="400"
              align="center"
            >
              <template #default="{ row }">
                <div :class="$style.portinfo">
                  <div>
                    <span
                      v-for="(item,index) in row.portCountMap.moduleList[1]"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                  <div>
                    <span
                      v-for="(item,index) in row.portCountMap.moduleList[2]"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                  <div>
                    <span
                      v-for="(item,index) in row.portCountMap.moduleList[3]"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                  <div>
                    <span
                      v-for="(item,index) in row.portCountMap.moduleList[4]"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                  <div>
                    <span
                      v-for="(item,index) in row.portCountMap.moduleList[5]"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                </div>
              </template>
            </ElTableColumn>
            <!--发现时间 -->
            <ElTableColumn
              prop="time"
              label="发现时间"
              align="center"
            >
              <template #default="{ row }">
                <div :class="$style.fontsize">
                  {{ row.dataTime }}
                </div>
              </template>
            </ElTableColumn>
            <!--操作 -->
            <ElTableColumn align="center">
              <template #default="{ row }">
                <div :class="$style.operate">
                  <div :class="$style.operateTite">
                    <div :class="$style.titeStatus">
                      {{ row.status }}
                    </div>
                    <div :class="$style.spoolbut">
                      <div>
                        纳管
                      </div>
                      <div>
                        忽略
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </ElTableColumn>
          </ITable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { ASSET_USE_SERVER } from '@/api/assets/assetsInfo/server'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import ITable, { ElTableColumn } from '@com/Table'
import { ignoreList } from '@/api/assets/discoveryResilt'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: {
    ITable,
    ElTableColumn,

  },
  data() {
    return {
      value: {},
      filterForm: {},
      pull: false,
      protocol: false,
      modu: false,
      potarr: [{ port: '8080', number: 12, id: '22' }, { port: '8080', number: 12, id: '33' }, { port: '8080', number: 12, id: '33' }, { id: '44', port: '8010', number: 12 }, { port: '8080', number: 12, id: '65' }, { id: '2', port: '8080', number: 12 }, { id: '43', port: '8080', number: 12 }],
    }
  },
  computed: {
    ASSET_USE_SERVER: () => ASSET_USE_SERVER,
    page: () => {
      return [
        {
          name: '内网',
          msg: '国家：中国',
          col: '城市：杭州',
          asn: 'ASN:37963',
          zz: '组织:Hangzho',
          ali: 'Aliba:baAdve',
          co: 'Co:Ltd',
          ip: '192.168.1.122',
          agreement: ['http', 'http', 'https', 'http', 'https'],
          list: [
            { port: '8080' }, { port: '8080' }, { port: '8080' }, { port: '8080' }, { port: '8080' },
          ],
          portCountMap: {
            moduleList: [['RabbitMQ'],
              ['jQuery', 'jQuery shuioi whui'],
              ['jQuery', 'jQuery', 'jQuerydhuio', 'jQuerydhuio', 'jQuerydhuio'], [], []],
          },
          dataTime: '2020-02-02 19:20',
          status: '未纳管',
        },
        {
          name: '内网',
          msg: '国家：中国',
          col: '城市：杭州',
          asn: 'ASN:37963',
          zz: '组织:Hangzho',
          ali: 'Aliba:baAdve',
          co: 'Co:Ltd',
          ip: '192.168.1.122',
          agreement: ['http', 'http', 'https', 'http', 'https'],
          list: [
            { port: '8080' }, { port: '8080' }, { port: '8080' }, { port: '8080' }, { port: '8080' },
          ],
          portCountMap: {
            moduleList: [['RabbitMQ'],
              ['jQuery', 'jQuery shuioi whui'],
              ['jQuery', 'jQuery', 'jQuerydhuio', 'jQuerydhuio', 'jQuerydhuio'], [], []],
          },
          dataTime: '2020-02-02 19:20',
          status: '未纳管',
        },
        {
          name: '内网',
          msg: '国家：中国',
          col: '城市：杭州',
          asn: 'ASN:37963',
          zz: '组织:Hangzho',
          ali: 'Aliba:baAdve',
          co: 'Co:Ltd',
          ip: '192.168.1.122',
          agreement: ['http', 'http', 'https', 'http', 'https'],
          list: [
            { port: '8080' }, { port: '8080' }, { port: '8080' }, { port: '8080' }, { port: '8080' },
          ],
          portCountMap: {
            moduleList: [['RabbitMQ'],
              ['jQuery', 'jQuery shuioi whui'],
              ['jQuery', 'jQuery', 'jQuerydhuio', 'jQuerydhuio', 'jQuerydhuio'], [], []],
          },
          dataTime: '2020-02-02 19:20',
          status: '未纳管',
        },
      ]
    },
  },
  methods: {
    ignoreList() {
      ignoreList({}).then(res => {
        this.res = res
      })
    },
  },
  created() {
    this.ignoreList()
  },
}
</script>

<style lang="scss" module>
.taskExecution {
  display: flex;

  .seleteLeft {
    width: 140px;
    margin-right: 20px;
  }
}

.portfoot {
  .sia {
    display: flex;
    justify-content: space-between;
    margin: 14px;

    .fontcolor {
      color: #09f;
      font-size: 12px;
      font-style: normal;
    }
  }
}

.fontsize {
  font-size: 12px;
}

.portList {
  display: flex;
  justify-content: space-around;
  font-size: 12px;

  .documentcilor {
    color: #2c73ef;
  }
}

.leftHead {
  width: 140px;
  color: rgba(0, 0, 0, 0.847058823529412);
  font-weight: 700;
  font-size: 14px;
  font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le';
  font-style: normal;
  line-height: 50px;
  text-align: left;
  border-bottom: 1px solid rgba(232, 232, 232, 1);
}

.rightTab {
  width: 100%;

  .filterspool {
    margin-bottom: 10px;

    .flexipFile {
      display: flex;
      justify-content: flex-end;
    }

    .ipFile {
      margin-left: 20px;
    }
  }
}

.ipinfo {
  .ip {
    margin: 10px 10px 10px 0;
    font-size: 12px;
  }
}

.basic {
  font-size: 12px;

  > p {
    margin: 0;
    padding: 0;
    line-height: normal;
  }
}

.spoolTable {
  width: 100%;

  .pollname {
    display: flex;

    .intranetname {
      height: 16px;
      margin: 14px 10px 0 0;
      padding: 4px 10px;
      color: #2c73ef;
      font-weight: 400;
      font-size: 12px;
      line-height: 10px;
      text-align: center;
      background-color: rgba(44, 115, 239, 0.1);
      border-radius: 8px;
    }
  }
}

.ico {
  width: 100%;
  font-size: 12px;

  > div {
    margin-left: 20px;
  }
}

.portinfo {
  width: 300px;
  margin: auto;
  padding: 10px 0;
  text-align: center;

  span {
    margin-right: 4px;
    padding: 2px 8px;
    color: #03c;
    font-size: 12px;
    background-color: #fff;
    border-radius: 4px;
  }

  > div {
    height: 27px;
    overflow: hidden;
    line-height: 27px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  > div:nth-of-type(1) {
    background-color: #e9f7fe;
  }

  > div:nth-of-type(2) {
    background-color: #d2eefa;
  }

  > div:nth-of-type(3) {
    background-color: #abdff5;
  }

  > div:nth-of-type(4) {
    background-color: #7bcbee;
  }

  > div:nth-of-type(5) {
    background-color: #3fb0e0;
  }
}

.operate {
  width: 66px;

  .operateTite {
    .titeStatus {
      width: 66px;
      height: 24px;
      margin: auto;
      color: #dd4927;
      font-weight: 400;
      font-size: 12px;
      font-family: Microsoft YaHei;
      line-height: 24px;
      text-align: center;
      background: rgba(245, 108, 108, 0.1);
      border-radius: 8px;
    }
  }
}

.spoolbut {
  display: flex;
  justify-content: space-around;
  color: #2c73ef;
  font-weight: 400;
  font-size: 14px;
  font-family: Microsoft YaHei;
}
</style>
