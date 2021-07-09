<template>
  <div>
    <ITable
      ref="table"
      :data="ciRelationDTOList"
    >
      <ElTableColumn
        prop="desCiIdName"
        label="资产名称"
      />
      <ElTableColumn
        prop="desCiSysCode"
        label="资产编号"
      />
      <ElTableColumn
        prop="desCiTypeIdName"
        label="资产类型"
      />
      <ElTableColumn
        prop="ciRelTypeIdName"
        label="关系"
      />
      <ElTableColumn
        v-if="!readOnly"
        label="操作"
      >
        <template slot-scope="scope">
          <ElButton
            size="small"
            type="text"
            @click="handleEdit(scope.row, scope.$index)"
          >
            编辑
          </ElButton>
          <ElButton
            size="small"
            type="text"
            :class="STYLE.danger"
            @click="handleDelete(scope.$index)"
          >
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ITable>
    <div
      v-if="!readOnly"
      :class="$style.add"
      @click="handleAdd()"
    >
      + 添加资产
    </div>
    <IDrawer
      :drawer="drawer"
      :title="'关联资产'"
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
          @click="handleRelationAdd"
        >
          确认
        </ElButton>
      </div>
      <div slot="content">
        <ElForm
          ref="relationForm"
          :model="relationForm"
          size="small"
          label-width="100px"
        >
          <ElFormItem
            label="资产类型："
            prop="desCiTypeId"
            :rules="[
              { required: true, message: '请选择资产类型', trigger: 'change' },
            ]"
          >
            <ElSelect
              v-model="relationForm.desCiTypeId"
              placeholder="请选择资产类型"
              @change="getAssets(relationForm.desCiTypeId,true)"
            >
              <ElOption
                v-for="item in assetsTypes"
                :key="item.id"
                :value="item.id"
                :label="item.chName"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="资产名称："
            prop="desCiId"
            :rules="[
              { required: true, message: '请选择资产名称', trigger: 'change' },
            ]"
          >
            <ElSelect
              v-model="relationForm.desCiId"
              v-loadmore="loadMore"
              remote
              :remote-method="remoteMethod"
              placeholder="请选择资产名称"
              filterable
              @change="getAssetName"
            >
              <ElOption
                v-for="item in assetsNames"
                :key="item.id"
                :value="item.id"
                :label="item.ciName"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="资产关系："
            prop="ciRelTypeId"
            :rules="[
              { required: true, message: '请选择资产关系', trigger: 'change' },
            ]"
          >
            <ElSelect
              v-model="relationForm.ciRelTypeId"
              placeholder="请选择资产关系"
              @change="getAssetRelName"
            >
              <ElOption
                v-for="item in assetsRelations"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </div>
    </IDrawer>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import ITable from '@/components/Table'
import STYLE from '@/scss/status.module.scss'
import IDrawer from '@homeCom/assets/Drawer'
import { assetsTypeAll, getRelationList, listByKeyword } from '@/api/assets/assetsInfo/index'
export default {
  props: {
    number: { type: String, default: '' },
    type: { type: String, required: true },
    ciRelationDTOList: { type: Array, required: true },
    ss: { type: Boolean, required: true, default: true },
  },
  components: {
    ITable,
    IDrawer,
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      },
    },
  },
  data() {
    return {
      mag: 0,
      relOpt: '',
      drawer: false,
      assetsTypes: [], // 资产类型下拉
      assetsNames: [], // 资产名称下拉
      assetsRelations: [], // 资产关系下拉
      relationForm: {
        ciRelTypeId: '',
        ciRelTypeIdName: '',
        desCiId: '',
        desCiIdName: '',
        desCiSysCode: '',
        desCiTypeId: '',
        desCiTypeIdName: '',
      }, // 关联资产form
      selectPageSize: 10,
      selectPage: 1,
      selectPages: 1,
      keyword: '',
    }
  },
  computed: {
    STYLE: () => STYLE,
    readOnly() {
      return this.type === 'info'
    },
  },
  methods: {
    remoteMethod(value) {
      listByKeyword({
        ciTypeId: this.relationForm.desCiTypeId,
        keyword: value,
        page: 1,
        pageSize: this.selectPageSize,
      }).then(res => {
        if (res.data.status) {
          this.assetsNames = res.data.body.list
        }
      })
    },
    loadMore() {
      listByKeyword({
        ciTypeId: this.relationForm.desCiTypeId,
        page: ++this.selectPage,
        pageSize: this.selectPageSize,
      }).then(res => {
        if (res.data.status) {
          this.assetsNames.push(...res.data.body.list)
        }
      })
    },
    getAssets(typeId, opt) {
      if (!typeId) {
        this.assetsNames = []
        this.relationForm.desCiTypeIdName = ''
        return
      }
      listByKeyword({ ciTypeId: typeId, page: 1, pageSize: this.selectPageSize }).then(res => {
        if (res.data.status) {
          this.assetsNames = res.data.body.list
        }
      })
      const obj = this.assetsTypes.find(item => {
        return item.id === typeId
      })
      this.relationForm.desCiTypeIdName = obj.chName
      if (opt) {
        this.relationForm.desCiId = ''
      } else {
        //  this.assetsNames.push()
      }
    },
    getAssetName(assetId) {
      const obj = this.assetsNames.find(item => {
        return item.id === assetId
      })
      this.relationForm.desCiIdName = obj.ciName
      this.relationForm.desCiSysCode = obj.ciSysCode
    },
    getAssetRelName(reltId) {
      const obj = this.assetsRelations.find(item => {
        return item.id === reltId
      })
      this.relationForm.ciRelTypeIdName = obj.name
    },
    handleClose() {
      this.$refs.relationForm.resetFields()
      this.drawer = false
    },
    handleRelationAdd() {
      this.$refs.relationForm.validate(valid => {
        if (valid) {
          if (this.relOpt === 'add') {
            if (this.number === this.relationForm.desCiSysCode) {
              this.$message.error('不能关联自己')
            } else {
              const arr = this.ciRelationDTOList
              arr.map(item => {
                if (item.desCiId === this.relationForm.desCiId) {
                  this.$message.error('不能重复关联')
                }
              })
              arr.push(JSON.parse(JSON.stringify(this.relationForm)))
              const res = new Map()
              const msg = arr.filter((arr) => !res.has(arr.desCiId) && res.set(arr.desCiId, 1))
              this.$emit('removal', msg)
            }
          } else {
            const arr = this.ciRelationDTOList
            const moxbox = JSON.parse(JSON.stringify(this.ciRelationDTOList))
            moxbox.splice(this.relIndex, 1)
            const correct = moxbox.some(item => {
              if (item.desCiId === this.relationForm.desCiId) {
                return true
              }
            })
            if (correct) {
              this.$message.error('不能重复关联')
            } else if (this.number === this.relationForm.desCiSysCode) {
              this.$message.error('不能关联自己')
            } else {
              arr.splice(this.relIndex, 1, JSON.parse(JSON.stringify(this.relationForm)))
            }
          }
          this.$refs.relationForm.resetFields()
          this.drawer = false
        }
      })
    },
    handleAdd() {
      if (this.ss === false) {
        this.$message.error('请先启用资产')
      } else {
        this.relOpt = 'add'
        this.relationForm = {
          ciRelTypeId: '',
          ciRelTypeIdName: '',
          desCiId: '',
          desCiIdName: '',
          desCiSysCode: '',
          desCiTypeId: '',
          desCiTypeIdName: '',
        }
        this.drawer = true
      }
    },
    handleEdit(row, index) {
      this.relOpt = 'edit'
      this.relIndex = index
      this.msg = JSON.parse(JSON.stringify(row))
      this.relationForm = JSON.parse(JSON.stringify(row))
      this.drawer = true
      this.getAssets(this.relationForm.desCiTypeId)
    },
    handleDelete(index) {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        this.ciRelationDTOList.splice(index, 1)
      })
    },
    async init() {
      const params = {}
      this.assetsTypes = (await assetsTypeAll(params)).data.body || []
      this.assetsRelations = (await getRelationList(params)).data.body || []
    },
  },
  created() {
    this.init()
  },
}
</script>
<style lang="scss" module>
.add {
  height: 34px;
  margin-top: -16px;
  color: $colorTextMinor;
  font-weight: 400;
  font-size: $smaller;
  line-height: 34px;
  text-align: center;
  border: 1px dashed #dcdee2;
  cursor: pointer;
}
</style>
