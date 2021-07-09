<!-- 描述 -->
<template>
  <div
    class="el-card"
    @click.stop="stop"
  >
    <ElRow :gutter="16">
      <ElCol :span="5">
        <div>
          <ElInput
            v-model.lazy.trim="keyWord"
            clearable
            size="medium"
            suffix-icon="i-sousuo"
            placeholder="请输入单位名称"
          />
          <div :class="$style.whole">
            <div :class="$style.option">
              <!-- <div
                :class="$style.plus"
                @click.stop="addParent"
              >
                <div>
                  <i
                    class="i-tianjia"
                    :class="$style.add"
                  />
                </div>
                <div :class="$style.addPersonnel">
                  添加
                </div>
              </div> -->
              <div :class="$style.level">
                <div>只看本级</div>
                <div><ElSwitch v-model="value" /></div>
              </div>
            </div>
            <ElTree
              ref="box"
              node-key="number"
              :expand-on-click-node="false"
              :default-expanded-keys="[1]"
              :default-checked-keys="[5]"
              :data="three"
              :props="defaultProps"
              :class="$style.tree"
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{ node, data }"
                :class="$style.custom"
              >
                <ElTooltip
                  class="item"
                  effect="dark"
                  :content="node.label"
                  placement="top-start"
                >
                  <div :class="$style.name">{{ node.label }}</div>
                </ElTooltip>
                <div>
                  <div :class="$style.iconeMax">
                    <i
                      :class="key === node.id ? $style.iconeTwo : $style.icone"
                      class="i-gengduo"
                      @click.stop="goIn(node)"
                    />
                    <div
                      v-show="key === node.id"
                      :class="$style.dropDown"
                    >
                      <div
                        v-show="node.parent.level!==0"
                        @click.stop="clicl(node)"
                      >编辑单位</div>
                      <div @click.stop="addDepartment(node)">添加子单位</div>
                      <div
                        v-show="node.parent.childNodes[0].id !== node.id"
                        @click.stop="moveUp(node)"
                      >
                        上移
                      </div>
                      <div
                        v-show="
                          node.parent.childNodes[
                            node.parent.childNodes.length - 1
                          ].id !== node.id
                        "
                        @click.stop="clickNext(node)"
                      >
                        下移
                      </div>
                      <div
                        style="color: #f65858;"
                        @click.stop="deleteMuen(node, data)"
                      >
                        删除
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </ElTree>
          </div>
        </div>
      </ElCol>
      <ElCol :span="19">
        <List
          ref="foot"
          :value="value"
          :organization-id="organizationId"
        />
      </ElCol>
    </ElRow>
    <IDrawer
      :drawer="drawer"
      :title="titleDate === 0 ? '编辑单位' : '添加单位'"
      @handleClose="handleClose"
    >
      <div slot="buttons">
        <ElButton
          plain
          size="small"
          @click="handleClose"
        >
          取消
        </ElButton>
        <ElButton
          type="primary"
          size="small"
          @click="preservation"
        >
          保存
        </ElButton>
      </div>
      <div slot="content">
        <ElForm
          ref="form"
          size="small"
          :model="form"
          label-width="100px"
        >
          <ElFormItem
            label="单位名称："
            prop="name"
            :rules="[
              { required: true, message: '请输入单位名称', trigger: 'blur' },
            ]"
          >
            <ElInput
              v-model="form.name"
              class="input"
              show-word-limit
              maxlength="20"
              placeholder="请输入单位名称"
            />
          </ElFormItem>
          <ElFormItem
            label="上级单位："
            prop="region"
            :rules="[
              { required: true, message: '请输入上级单位', trigger: 'blur' },
            ]"
          >
            <ElSelect
              v-model="form.region"
              class="input"
              :class="$style.wide"
              default-first-option
              placeholder="请选择上级单位"
              clearable
              filterable
            >
              <ElOption
                v-for="item in organizations"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="活动形式："
            prop="desc"
          >
            <ElInput
              v-model="form.desc"
              class="input"
              type="textarea"
              show-word-limit
              maxlength="200"
            />
          </ElFormItem>
        </ElForm>
      </div>
    </IDrawer>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import List from './personnelList'
import {
  framework,
  query,
  deleteDate,
  addOrganization,
  next,
  superior,
  addQuery,
} from '@/api/assets/organizational'
import IDrawer from '@homeCom/assets/Drawer'
export default {
  props: {},
  components: {
    List,
    IDrawer,
  },
  data() {
    return {
      organizationId: '', // 根节点id
      id: '', // 编辑和添加单位id
      titleDate: 0,
      organizations: [],
      form: {
        circularUserIds: '',
        name: '',
        region: '',
        resource: '',
        desc: '',
      },
      drawer: false,
      thier: -1,
      three: [],
      value: false,
      key: -1,
      defaultProps: {
        children: 'children',
        label: 'organizationName',
      },
      keyWord: '',
    }
  },
  computed: {},
  watch: {
    keyWord(val) {
      clearTimeout(this.thier)
      this.thier = setTimeout(() => {
        if (val) {
          this.query(val)
        } else {
          this.framework()
        }
      }, 200)
    },
  },
  methods: {
    query(val) {
      query(val).then((res) => {
        if (res.data.body) {
          this.three = res.data.body
        }
      })
    },
    framework() {
      framework().then((res) => {
        if (res.data.body) {
          this.organizationId = res.data.body[0].id
          this.three = res.data.body
          this.$set(this.three[0], 'number', 1)
        }
      })
    },
    stop() {
      this.key = -1
    },
    // 点击节点获取组织架构id
    handleNodeClick(val) {
      this.organizationId = val.id
    },
    // 单位上移
    moveUp(val) {
      const flag = 1
      const number = Math.random()
      next(val.data.id, flag, number).then((res) => {
        if (res.data.body) {
          let moveDataDown = {}
          let number = 0
          val.parent.childNodes.map((item, index) => {
            if (val.data.id === item.data.id) {
              number = index
              moveDataDown = val.parent.childNodes[index]
              val.parent.childNodes.splice(index, 1)
            }
          })
          val.parent.childNodes.splice(number - 1, 0, moveDataDown)
          this.key = -1
        }
      })
    },
    // 单位下移
    clickNext(val) {
      const flag = 0
      const number = Math.random()
      next(val.data.id, flag, number).then((res) => {
        if (res.data.body) {
          //  this.framework()
          let moveDataDown = {}
          let number = 0
          val.parent.childNodes.map((item, index) => {
            if (val.data.id === item.data.id) {
              number = index
              moveDataDown = val.parent.childNodes[index]
              val.parent.childNodes.splice(index, 1)
            }
          })
          val.parent.childNodes.splice(number + 1, 0, moveDataDown)
          this.key = -1
        }
      })
    },
    // 关闭抽屉和取消抽屉
    handleClose() {
      this.form = {
        circularUserIds: '',
        name: '',
        region: '',
        resource: '',
        desc: '',
      }
      this.$refs.form.clearValidate()
      this.drawer = false
    },
    // 编辑单位
    clicl(val) {
      this.id = val.data.id
      superior(val.data.id).then((res) => {
        if (res.data && res.data.body.length > 0) {
          this.organizations = res.data.body
        }
      })
      this.form.name = val.data.organizationName
      this.form.region = val.data.parentId
      this.titleDate = 0
      this.drawer = true
      this.key = -1
    },

    // 添加子级单位
    addDepartment(val) {
      this.id = val.data.id
      addQuery().then((res) => {
        if (res.data && res.data.body.length > 0) {
          this.organizations = res.data.body
        }
      })
      this.form.region = val.data.id
      this.titleDate = -1
      this.drawer = true
      this.key = -1
    },
    // 删除单位
    deleteMuen(node, data) {
      deleteDate(node.data.id).then((res) => {
        if (res.data.body) {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除单位成功',
            type: 'success',
          })
        }
      })
      this.key = -1
    },
    // 添加或者编辑组织机构保存
    preservation() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          const from = {
            id: this.titleDate === 0 ? this.id : '',
            organizationName: this.form.name,
            parentId: this.form.region,
            organizationDesc: this.form.desc,
          }
          addOrganization(from).then((res) => {
            if (res.data.body) {
              this.form.name = ''
              this.drawer = false
              this.framework()
              this.$notify({
                message:
                  this.titleDate === -1 ? '添加单位成功' : '编辑单位成功',
                type: 'success',
              })
              this.$refs.foot.$emit('bridge')
            }
          })
        }
      })
    },
    goIn(val) {
      this.key = val.id
    },
    remove() {
      this.key = -1
    },
  },
  created() {
    this.framework()
  },
}
</script>

<style lang="scss" module>
.tree :global(.el-tree-node__content) {
  height: 32px;
}

.tree {
  position: relative;
  height: 700px;
  overflow-x: hidden;
  // background-color: #f2f4f8;
  scrollbar-darkshadow-color: red;
}

* {
  scrollbar-arrow-color: #e5e5e5;
  scrollbar-face-color: #e5e5e5;
  scrollbar-shadow-color: #e5e5e5;
  scrollbar-track-color: white;
}

.tree::-webkit-scrollbar-thumb {
  //滑块部分
  background-color: #e5e5e5;
  scrollbar-darkshadow-color: red;
}

.custom {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 90%;
}

.tree :global(.el-tree-node.is-current > .el-tree-node__content) {
  color: $colorTheme;
}

.name {
  width: 85%;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
}

.icone {
  margin-right: 20px;
  color: $colorTextMain;
  font-weight: bold;
  font-size: 20px;
}

.iconeTwo {
  margin-right: 20px;
  color: $colorTheme;
  font-weight: bold;
  font-size: 20px;
}

.dropDown {
  position: absolute;
  right: 8%;
  background-color: white;
  border-top: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  border-left: 1px solid #e5e5e5;
  transition: height 0.3s;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 82px;
    height: 28px;
    color: $colorTextMain;
    font-size: 12px;
    border-bottom: 1px solid #e5e5e5;
  }

  div:hover {
    color: $colorTheme;
    background-color: #f2f4f8;
  }
}

.plus {
  display: flex;
  align-items: center;
}

.add {
  margin-right: 2px;
  margin-left: 10px;
  font-size: 20px;
}

.addPersonnel {
  color: $colorTextMain;
  font-size: 12px;
}

.level {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 12px;

  div:nth-child(1) {
    margin-right: 12px;
  }
}

.option {
  display: flex;
  // justify-content: space-between;
  flex-direction: row-reverse;
  margin: 12px 0;
}

.whole {
  height: 750px;
  border: 1px solid #e5e5e5;
}

.whole:hover {
  cursor: pointer;
}

</style>
