<template>
  <div :class="$style.content">
    <div :class="$style.search">
      <div>
        <ElForm
          :inline="true"
          :label-width="CONFIG.labelWidth"
          :model="from"
          :class="$style.searchForm"
        >
          <i :class="$style.ipSearchText" />
          <ElFormItem>
            <ElInput
              v-model="from.ip"
              suffix-icon="el-icon-search"
              style="width: 700px;"
              clearable
              placeholder="请输入IP进行查询"
            />
          </ElFormItem>
        </ElForm>
      </div>
    </div>
    <div v-if="from.ip === ''">
      <ElCard
        :class="$style.card"
        shadow="never"
      >
        <div :class="$style.title">
          <div :class="$style.name">
            最近添加记录
          </div>
          <div v-if="authFit(ROLES.monitorAnlysis)">
            <ElDropdown @command="handleCommand">
              <ElButton type="primary">
                添加威胁情报<i class="el-icon-arrow-down el-icon--right" />
              </ElButton>
              <ElDropdownMenu slot="dropdown">
                <ElDropdownItem command="1">
                  添加威胁情报IP
                </ElDropdownItem>
              </ElDropdownMenu>
            </ElDropdown>
          </div>
        </div>
        <ITable
          ref="table"
          :head="head"
          :get="queryTerminal"
          :query="filterForm"
        />
      </ElCard>
    </div>

    <div v-if="from.ip !== ''">
      <div
        v-for="(item, index) in ipSearch"
        :key="index"
        :class="$style.details"
      >
        <ElCard
          :class="$style.cardTwo"
          shadow="never"
        >
          <div style="margin-left: 50px;">
            <div
              :class="$style.ip"
              v-html="item.ip"
            />
            <div :class="$style.timeAndName">
              <div>添加时间：{{ item.createDate }}</div>
              <span>添加人：{{ item.createUserName }}</span>
            </div>
            <div :class="$style.bigtag">
              <ElTag
                v-for="(tag, index1) in item.labelList"
                :key="index1"
                :class="$style.eltag"
                :closable="clearable"
                :disable-transitions="false"
                @close="handleClose(item, tag, index1)"
              >
                {{ tag }}
              </ElTag>
              <ElInput
                v-show="item.inputVisible"
                ref="saveTagInput"
                v-model.trim="item.inputValue"
                style="width: 200px;"
                show-word-limit
                maxlength="10"
                :class="$style.inputNewTag"
                size="small"
                @keyup.enter.native="handleInputConfirm(item)"
                @blur="handleInputConfirm(item)"
              />
              <ElButton
                v-show="item.inputVisible===false&&authFit(ROLES.monitorAnlysis)"
                :class="$style.buttonNewTag"
                size="small"
                @click="showInput(item)"
              >
                + 添加标签
              </ElButton>
            </div>
          </div>
        </ElCard>
      </div>
    </div>
    <Popup
      ref="popup"
      @refresh="refresh"
    />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { ROLES } from '@/enums'
import ITable from '@com/Table'
import {
  record,
  searchDetails,
  addTags,
} from '@/api/threatNotification/threatNotification'
import Popup from './popup'
/** emit: 事件说明 */
export default {
  props: {},
  components: { ITable, Popup },
  data() {
    return {
      clearable: this.authFit(ROLES.monitorAnlysis),
      value: '',
      inputValue: '',
      ipSearch: [],
      isLoadingForm: false,
      filterForm: {},
      from: {
        ip: '',
      },
      timeID: -1,
    }
  },
  computed: {
    ROLES: () => ROLES,
    head: () => [
      { label: '时间', prop: 'createDate' },
      { label: '类型', prop: 'type' },
      {
        label: '内容',
        prop: 'content',
      },
      {
        label: '添加人',
        prop: 'createUserName',
      },
    ],

    queryTerminal() {
      return record
    },
  },
  watch: {
    from: {
      deep: true,
      handler: function(newVal) {
        clearTimeout(this.timeID)
        this.timeID = setTimeout(() => {
          this.searchDetails(newVal)
        }, 200)
      },
    },
  },
  methods: {
    refresh() {
      this.$refs.table.fetch()
    },
    async record() {
      const res = await record.apply(null, arguments).finally(() => {
        this.isLoadingForm = false
      })
      return res
    },
    addTags(tags) {
      addTags(tags).then((res) => {
        this.value = res.data.body
      })
    },
    handleCommand() {
      this.$refs.popup.$data.dialogVisible = true
    },
    handleClose(item, tag, index) {
      item.labelList.splice(index, 1)
      const tags = {
        id: item.id,
        labelList: item.labelList,
      }
      this.addTags(tags)
    },
    showInput(item) {
      item.inputVisible = true
    },
    handleInputConfirm(item) {
      const inputValue = item.inputValue
      if (inputValue) {
        item.labelList.map(val => {
          if (inputValue === val) {
            this.$message.error('请不要重复添加相同标签')
          }
        })
        item.labelList.push(inputValue)
        const arr = item.labelList
        item.labelList = arr.filter((val, index, self) => {
          return self.indexOf(val) === index
        })
        const tags = {
          id: item.id,
          labelList: item.labelList,
        }
        this.addTags(tags)
      }
      item.inputVisible = false
      item.inputValue = ''
    },
    searchDetails(from) {
      searchDetails(from).then((res) => {
        this.ipSearch = res.data.body
        this.ipSearch.map((item) => {
          if (item.labelList === null) {
            item.labelList = []
          }
          this.$set(item, 'inputValue', '')
          this.$set(item, 'inputVisible', false)
        })
      })
    },
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.content {
  margin-top: -$gapNormal;
  padding: 0;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 126px;
  margin-bottom: 10px;
  background: url(~@/assets/ip-search.png)  center no-repeat;
  background-size: cover;
}

.searchForm {
  height: 40px;
  line-height: 40px;
}

.ipSearchText {
  display: inline-block;
  width: 120px;
  height: 18px;
  margin-top: 11px;
  background: url(~@/assets/ip-search-text.png) $gapNormal center no-repeat;
}

.input {
  width: 704px;
  height: 60px;
}

.name {
  font-weight: bold;
  font-size: 16px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.card {
  min-height: 720px;
}

.ip {
  font-weight: bold;
  font-size: 24px;
}

.cardTwo {
  display: flex;
  align-items: center;
  width: 1200px;
  margin-top: 24px;
}

.details {
  display: flex;
  justify-content: center;
}

.timeAndName {
  display: flex;
  margin-top: 14px;
  color: #666;
  font-size: 14px;

  div {
    margin-right: 65px;
  }
}

.bigtag {
  display: flex;
  flex-wrap: wrap;
  width: 1000px;
  margin-top: 14px;
}

.eltag {
  margin-right: 10px;
  margin-bottom: 5px;
}

.buttonNewTag {
  height: 32px;
  margin-left: 10px;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 30px;
}

.inputNewTag {
  width: 200px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
