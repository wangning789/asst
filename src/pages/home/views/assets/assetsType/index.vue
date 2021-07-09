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
            v-model.lazy.trim="keyword"
            clearable
            size="medium"
            suffix-icon="i-sousuo"
            placeholder="请输入资产名称"
          />
          <div :class="$style.whole">
            <div
              :class="$style.addtitle"
              @click="addType"
            >
              <i
                class="i-tianjia"
              />
              <span>
                添加类型
              </span>
            </div>
            <div :class="$style.tree">
              <ElTree
                :expand-on-click-node="false"
                default-expand-all
                :data="tree"
                :props="defaultProps"
                :class="$style.tree"
                @node-click="handleNodeClick"
              >
                <span
                  slot-scope="{ node }"
                  :class="$style.custom"
                >
                  <div :class="$style.name">{{ node.label }}</div>
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
                        <div @click="modifyType(node.data)">编辑类型</div>
                        <div
                          v-show="node.parent.childNodes[0].id !== node.id"
                          @click.stop="moveType(node.data.id,1)"
                        >
                          上移
                        </div>
                        <div
                          v-show="
                            node.parent.childNodes[
                              node.parent.childNodes.length - 1
                            ].id !== node.id
                          "
                          @click.stop="moveType(node.data.id,0)"
                        >
                          下移
                        </div>
                        <div
                          style="color: #f65858;"
                          @click.stop="deleteType(node.data)"
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
        </div>
      </ElCol>
      <ElCol :span="19">
        <RouteField
          :type-id="typeId"
          :type-name="typeName"
        />
      </ElCol>
    </ElRow>
    <!-- 类型弹出框   -->
    <IDrawer
      :drawer="drawer"
      :title="optType === 'add' ? '添加类型':'修改类型'"
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
          @click="saveType()"
        >
          保存
        </ElButton>
      </div>
      <div slot="content">
        <ElForm
          ref="form"
          :model="form"
          size="small"
          label-width="110px"
        >
          <ElFormItem
            label="类型名称："
            prop="chName"
            :rules="[
              { required: true, message: '请输入类型名称', trigger: 'blur' },
            ]"
          >
            <ElInput
              v-model="form.chName"
              class="input"
              show-word-limit
              maxlength="10"
              placeholder="请输入类型名称"
            />
          </ElFormItem>
          <ElFormItem
            label="英文名称："
            prop="enName"
            :rules="[
              { required: true, message: '请输入英文名称', trigger: 'blur' },
              {pattern:/^[A-Za-z_]+$/, message: '只能有英文大小写和下划线', trigger: 'blur'}
            ]"
          >
            <ElInput
              v-model="form.enName"
              class="input"
              show-word-limit
              maxlength="50"
              placeholder="请输入英文名称"
            />
          </ElFormItem>
          <ElFormItem
            label="描述："
            prop="description"
          >
            <ElInput
              v-model="form.description"
              type="textarea"
              show-word-limit
              maxlength="60"
              placeholder="请输入"
            />
          </ElFormItem>
        </ElForm>
      </div>
    </IDrawer>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { assetsTypeAll } from '@/api/assets/assetsInfo/index'
import {
  ciTypeAdd, ciTypeModify, ciTypeDetail, ciTypeDelete, modifyDisplayOrder,
  AssetsType,
} from '@/api/assets/assetsType'
import IDrawer from '@homeCom/assets/Drawer'
import RouteField from './routeField'
export default {
  props: {},
  components: {
    RouteField,
    IDrawer,
  },
  data() {
    return {
      typeId: '', // 资产类型id
      typeName: '', // 资产类型名称
      id: '', // 编辑和添加单位id
      form: {} as AssetsType,
      optType: 'add',
      drawer: false,
      tree: [],
      key: -1,
      defaultProps: {
        children: 'children',
        label: 'chName',
      },
      keyword: '',
    }
  },

  watch: {
    keyword() {
      setTimeout(() => {
        this.getAssetsTypeAll()
      }, 200)
    },
  },
  methods: {
    stop() {
      this.key = -1
    },
    handleClose() {
      this.drawer = false
    },
    moveType(id: string, flag: string) {
      modifyDisplayOrder({ ciTypeId: id, flag: flag }).then(res => {
        if (res.data.status) {
          this.getAssetsTypeAll()
        } else {
          this.$message.error(res.data.msg || '移动失败')
        }
      })
    },
    modifyType(item) {
      ciTypeDetail(item.id).then(res => {
        if (res.data.status) {
          const obj = res.data.body
          this.form = {
            id: obj.id,
            chName: obj.chName,
            enName: obj.enName,
            description: obj.description,
          }
        }
      })
      this.optType = 'edit'
      this.drawer = true
    },
    addType() {
      this.optType = 'add'
      this.form = {} as AssetsType
      this.drawer = true
      this.$refs.form.resetFields()
    },
    // 点击节点获取组织架构id
    handleNodeClick(val) {
      this.typeId = val.id
      this.typeName = val.chName
      // listAllColumns(this.typeId).then(res => {
      //   if (res.data.status) {
      //     //自编辑自定义字段
      //     this.assetsFields = res.data.body
      //   }
      // })
    },
    goIn(val) {
      this.key = val.id
    },
    async getAssetsTypeAll(firstFlag) {
      await assetsTypeAll({ keyword: this.keyword }).then(res => {
        if (res.data.status) {
          this.tree = res.data.body
          if (firstFlag) {
            this.typeId = this.tree[0].id
            this.typeName = this.tree[0].chName
          }
        }
      })
    },
    deleteType(item) {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        ciTypeDelete(item.id).then(res => {
          if (res.data.status) {
            this.$notify.success('删除成功')
            this.getAssetsTypeAll(true)
          } else {
            this.$message.error(res.data.msg || '删除失败')
          }
        })
      })
    },
    // 保存资产类型
    saveType() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const fn = this.form.id ? ciTypeModify : ciTypeAdd
          fn(this.form as AssetsType).then(res => {
            if (res.data.status) {
              this.$notify.success(this.form.id ? '修改成功' : '新增成功')
              this.drawer = false
              this.getAssetsTypeAll()
            } else {
              this.$message.error(res.data.msg || '请求失败')
            }
          })
        }
      })
    },
  },
  created() {
    this.getAssetsTypeAll(true)
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
}

.tree::-webkit-scrollbar-thumb {
  //滑块部分
  background-color: #e5e5e5;
}

.custom {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 90%;
}

.icone {
  margin-right: 20px;
  color: #333;
  font-weight: bold;
  font-size: 20px;
}

.iconeTwo {
  margin-right: 20px;
  color: $colorTheme;
  font-weight: bold;
  font-size: 20px;
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

.whole {
  height: 750px;
  border: 1px solid #e5e5e5;

  .addtitle {
    margin: 8px 12px;
    color: #999;
    font-size: 12px;
  }
}

.whole:hover {
  cursor: pointer;
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
    color: #333;
    font-size: 12px;
    border-bottom: 1px solid #e5e5e5;
  }

  div:hover {
    color: $colorTheme;
    background-color: #f2f4f8;
  }
}

.input:global(.el-input--medium .el-input__inner) {
  width: 160px;
  height: 32px;
}
</style>
