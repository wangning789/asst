<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>
        {{
          be === 'Info'
            ? '应用系统资产详情'
            : be === 'edit'
              ? '编辑应用系统资产'
              : '添加应用系统资产'
        }}
      </h3>
    </div>
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        label-width="140px"
        inline
        :model="form"
        :disabled="be === 'Info'"
      >
        <ElRow :gutter="GAP">
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>基础信息</span>
            </div>
            <ElFormItem
              label="应用系统名称："
              prop="ciName"
              :rules="{ required: true, message: '请输入应用系统名称' }"
            >
              <ElInput
                v-model="form.ciName"
                placeholder="请输入应用系统名称"
              />
            </ElFormItem>
            <ElFormItem
              label="资产编号："
              prop="ciCode"
              :rules="checkLength"
            >
              <ElInput
                v-model="form.ciCode"
                placeholder="请输入资产编号"
              />
            </ElFormItem>

            <ElFormItem
              label="系统类型："
              prop="ciType"
              :rules="{ required: true, message: '请选择系统类型' }"
            >
              <ElSelect
                v-model="form.ciType"
                placeholder="请选择系统类型"
                clearable
              >
                <ElOption
                  v-for="(val, key) in CATEGORY"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="资产重要性："
              prop="importanceId"
              :rules="{ required: true, message: '请选择资产重要性' }"
            >
              <ElSelect
                v-model="form.importanceId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in SYSIMPORTANCE"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="系统定级："
              prop="sysLevelId"
            >
              <ElSelect
                v-model="form.sysLevelId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in GRADING"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="涉密/非密："
              prop="classifyId"
            >
              <ElSelect
                v-model="form.classifyId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in SECRETLEVEL"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="内网访问地址："
              prop="intranetAddress"
              :rules="checkLength"
            >
              <ElInput
                v-model="form.intranetAddress"
                placeholder="请输入内网地址"
              />
            </ElFormItem>
            <ElFormItem
              label="系统/产品厂商："
              prop="factory"
            >
              <ElInput
                v-model="form.factory"
                placeholder="请输入系统/产品厂商"
              />
            </ElFormItem>
            <ElFormItem
              label="系统版本号："
              prop="sysVersion"
            >
              <ElInput
                v-model="form.sysVersion"
                placeholder="请输入系统版本号"
              />
            </ElFormItem>
            <ElCol :span="24">
              <ElFormItem
                label="是否自研："
                prop="selfDevelopedId"
              >
                <ElSelect
                  v-model="form.selfDevelopedId"
                  placeholder="请选择"
                  clearable
                >
                  <ElOption
                    v-for="(val, key) in SELFSTUDY"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElFormItem
              label="互联网访问地址："
              prop="internetAddress"
              :rules="checkLength"
            >
              <ElInput
                v-model="form.internetAddress"
                placeholder="请输入互联网地址"
                style="width: 615px;"
              />
            </ElFormItem>

            <ElFormItem
              label="主要功能模块："
              prop="mainFunDesc"
            >
              <ElInput
                v-model="form.mainFunDesc"
                placeholder="请输入主要功能模块"
                type="textarea"
                maxlength="180"
                show-word-limit
                style="width: 615px;"
                size="medium"
                :autosize="{ minRows: 3 }"
                :class="$style.textarea"
              />
            </ElFormItem>
            <ElFormItem
              label="备注："
              prop="description"
            >
              <ElInput
                v-model="form.description"
                placeholder="请输入备注"
                type="textarea"
                maxlength="60"
                show-word-limit
                style="width: 615px;"
                size="medium"
                :autosize="{ minRows: 2 }"
                :class="$style.textarea"
              />
            </ElFormItem>
          </div>
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>网络及部署位置信息</span>
            </div>
            <ElFormItem
              label="域名是否备案："
              prop="record"
            >
              <ElSelect
                v-model="form.record"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  label="是"
                  value="1"
                />

                <ElOption
                  label="否"
                  value="0"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="状态："
              prop="ciStatus"
            >
              <ElSelect
                v-model="form.ciStatus"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in STATUS"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>

            <ElFormItem
              label="是否接入云防："
              prop="cloudDefenseConnection"
            >
              <ElSelect
                v-model="form.cloudDefenseConnection"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  label="是"
                  value="1"
                />

                <ElOption
                  label="否"
                  value="0"
                />
              </ElSelect>
            </ElFormItem>

            <ElFormItem
              label="系统开发语言："
              prop="sysDevLang"
            >
              <ElInput
                v-model="form.sysDevLang"
                placeholder="请输入系统开发语言"
                type="textarea"
                maxlength="60"
                show-word-limit
                style="width: 615px;"
                size="medium"
                :autosize="{ minRows: 2 }"
                :class="$style.textarea"
              />
            </ElFormItem>

            <ElFormItem label="中间件及版本：">
              <div :class="$style.tableWrap">
                <ElTable
                  :data="form.middlewares"
                  border
                  :class="$style.table"
                >
                  <ElTableColumn
                    prop="middlewareName"
                    width="260"
                  >
                    <template #header>
                      <span>中间件</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="
                          'middlewares[' + scope.$index + '].middlewareName'
                        "
                        :rules="checkLength"
                      >
                        <ElInput
                          v-model="scope.row.middlewareName"
                          placeholder="请输入中间件"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="middlewareVersion"
                    width="260"
                  >
                    <template #header>
                      <span>版本号</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="
                          'middlewares[' + scope.$index + '].middlewareVersion'
                        "
                        :rules="checkLength"
                      >
                        <ElInput
                          v-model="scope.row.middlewareVersion"
                          placeholder="请输入版本号"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    label="操作"
                    width="100"
                  >
                    <template #default="scope">
                      <ElButton
                        class="el-icon-delete"
                        :class="$style.mgl"
                        title="删除"
                        @click="delmiddleware(scope)"
                      />
                    </template>
                  </ElTableColumn>
                </ElTable>
                <ElButton
                  :class="$style.button"
                  :disabled="display"
                  @click="addmiddleware"
                >
                  添加
                </ElButton>
              </div>
            </ElFormItem>
            <ElFormItem label="数据库类型和版本：">
              <div :class="$style.tableWrap">
                <ElTable
                  :data="form.dbTypes"
                  border
                  :class="$style.table"
                >
                  <ElTableColumn
                    prop="dbTypeName"
                    width="260"
                  >
                    <template #header>
                      <span>数据库类型</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="'dbTypes[' + scope.$index + '].dbTypeName'"
                        :rules="checkLength"
                      >
                        <ElInput
                          v-model="scope.row.dbTypeName"
                          placeholder="请输入数据库类型"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="dbTypeVersion"
                    width="260"
                  >
                    <template #header>
                      <span>版本号</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="'dbTypes[' + scope.$index + '].dbTypeVersion'"
                        :rules="checkLength"
                      >
                        <ElInput
                          v-model="scope.row.dbTypeVersion"
                          placeholder="请输入版本号"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    label="操作"
                    width="100"
                  >
                    <template #default="scope">
                      <ElButton
                        class="el-icon-delete"
                        :class="$style.mgl"
                        title="删除"
                        @click="deldbType(scope)"
                      />
                    </template>
                  </ElTableColumn>
                </ElTable>
                <ElButton
                  :class="$style.button"
                  :disabled="display"
                  @click="adddbType"
                >
                  添加
                </ElButton>
              </div>
            </ElFormItem>
            <ElRow>
              <ElFormItem label="IP地址：">
                <div :class="$style.tableWrap">
                  <ElTable
                    :data="form.addresses"
                    border
                    :class="$style.table"
                  >
                    <ElTableColumn
                      prop="typeInString"
                      width="260"
                    >
                      <template #header>
                        <span :class="$style.danger">* </span>
                        <span>内网/互联网</span>
                      </template>
                      <template #default="scope">
                        <ElFormItem
                          :prop="'addresses[' + scope.$index + '].typeInString'"
                          :class="$style.formItem"
                          :rules="{
                            required: true,
                            message: '请选择互联网类型',
                            trigger: 'change',
                          }"
                        >
                          <ElSelect
                            v-model="scope.row.typeInString"
                            placeholder="请选择"
                            @change="changeIpType()"
                          >
                            <ElOption
                              v-for="(val, key) in NETTYPE"
                              :key="key"
                              :label="val"
                              :value="key"
                            />
                          </ElSelect>
                        </ElFormItem>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="ip"
                      width="260"
                    >
                      <template #header>
                        <span :class="$style.danger">* </span>
                        <span>IP</span>
                      </template>
                      <template #default="scope">
                        <ElFormItem
                          :prop="'addresses[' + scope.$index + '].ip'"
                          :rules="checkIPRules"
                        >
                          <ElInput
                            v-model="scope.row.ip"
                            placeholder="请输入IP地址"
                            @input="
                              (val) => {
                                changeIp(scope)
                              }
                            "
                          />
                          <div
                            v-show="form.addresses[scope.$index].showRepeat"
                            ref="repeatError"
                          >
                            <span
                              class="el-form-item__error"
                            >同一网络类型下的ip地址不能重复</span>
                          </div>
                        </ElFormItem>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      v-if="form.addresses.length > 1"
                      label="操作"
                      width="100"
                    >
                      <template #default="scope">
                        <ElButton
                          class="el-icon-delete"
                          :class="$style.mgl"
                          title="删除"
                          @click="delIpInfo(scope)"
                        />
                      </template>
                    </ElTableColumn>
                  </ElTable>
                  <ElButton
                    :class="$style.button"
                    :disabled="display"
                    @click="addIpInfo"
                  >
                    添加
                  </ElButton>
                </div>
              </ElFormItem>
            </ElRow>
            <ElFormItem
              label="系统部署环境："
              prop="networkId"
              :rules="{
                required: true,
                message: '请选择系统部署环境',
                trigger: 'change',
              }"
            >
              <ElSelect
                v-model="form.networkId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in SCIENCE"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="所属网络区域："
              prop="networkRegionId"
            >
              <ElSelect
                v-model="form.networkRegionId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in NETWORKAREA"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>

            <ElFormItem
              label="托管位置："
              prop="locationZoneId"
              :rules="{ required: true, message: '请选择托管位置' }"
            >
              <ElSelect
                v-model="form.locationZoneId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in HOSTING"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              v-if="
                form.locationZoneId ===
                  'SYS_asset_location_zone_public_cloud' ||
                  form.locationZoneId ===
                  'SYS_asset_location_zone_service_provider_tg'
              "
              label="托管位置描述："
              prop="extra"
              :rules="{ required: true, message: '请填写位置描述' }"
            >
              <ElInput
                v-model="form.extra"
                placeholder="请输入公有云名称或者服务商名称"
                type="textarea"
                maxlength="60"
                show-word-limit
                style="width: 615px;"
                size="medium"
                :autosize="{ minRows: 2 }"
                :class="$style.textarea"
              />
            </ElFormItem>
          </div>

          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>自主可控评估信息</span>
            </div>
            <ElFormItem
              label="是否可替代："
              prop="replaceable"
            >
              <ElSelect
                v-model="form.replaceable"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  label="是"
                  value="是"
                />

                <ElOption
                  label="否"
                  value="否"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="替代策略："
              prop="replacePlyId"
            >
              <ElSelect
                v-model="form.replacePlyId"
                placeholder="请选择"
                clearable
              >
                <ElOption
                  v-for="(val, key) in REPLACE"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="简述不能替代原因："
              prop="notReplaceReason"
            >
              <ElInput
                v-model="form.notReplaceReason"
                placeholder="请输入不能替代的原因"
                type="textarea"
                maxlength="60"
                show-word-limit
                style="width: 615px;"
                size="medium"
                :autosize="{ minRows: 2 }"
                :class="$style.textarea"
              />
            </ElFormItem>
          </div>

          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" /><span>责任及归属信息</span>
            </div>
            <ElFormItem
              label="资产归属单位："
              prop="belongCompanyId"
              :rules="{
                required: true,
                message: '请选择资产归属单位',
                trigger: 'change',
              }"
            >
              <ElSelect
                v-model="form.belongCompanyId"
                placeholder="请选择"
                filterable
                clearable
                @change="organizationId($event)"
              >
                <ElOption
                  v-for="item in organizations"
                  :key="item.id"
                  :label="item.organizationName"
                  :value="item.id"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="责任人信息：">
              <div :class="$style.tableWrap">
                <ElTable
                  :data="form.dutyPersons"
                  border
                  :class="$style.table"
                >
                  <ElTableColumn
                    prop="name"
                    width="120px"
                  >
                    <template #header>
                      <span>姓名</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="'dutyPersons[' + scope.$index + '].name'"
                        :rules="{ required: true, message: '请填写姓名' }"
                      >
                        <ElInput
                          v-model="scope.row.name"
                          placeholder="请填写姓名"
                          style="width: 100px;"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="tel"
                    width="200px"
                  >
                    <template #header>
                      <span>联系电话</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="'dutyPersons[' + scope.$index + '].tel'"
                        :rules="checkPhone"
                      >
                        <ElInput
                          v-model="scope.row.tel"
                          placeholder="请填写联系电话"
                          style="width: 180px;"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>

                  <ElTableColumn
                    prop="mail"
                    width="240"
                  >
                    <template #header>
                      <span>邮箱</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="'dutyPersons[' + scope.$index + '].mail'"
                        :rules="checkMail"
                      >
                        <ElInput
                          v-model="scope.row.mail"
                          placeholder="请填写邮箱"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="description"
                    width="240"
                  >
                    <template #header>
                      <span>备注</span>
                    </template>
                    <template #default="scope">
                      <ElFormItem
                        :prop="'dutyPersons[' + scope.$index + '].description'"
                      >
                        <ElInput
                          v-model="scope.row.description"
                          placeholder="请填写备注"
                        />
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    label="操作"
                    width="100"
                  >
                    <template #default="scope">
                      <ElButton
                        class="el-icon-delete"
                        :class="$style.mgl"
                        title="删除"
                        @click="delDutyPerson(scope)"
                      />
                    </template>
                  </ElTableColumn>
                </ElTable>
                <ElButton
                  :class="$style.button"
                  :disabled="display"
                  @click="addDutyPersons"
                >
                  添加
                </ElButton>
              </div>
            </ElFormItem>
            <ElFormItem
              label="填报单位："
              prop="fillCompanyId"
            >
              <ElSelect
                v-model="form.fillCompanyId"
                placeholder="请输入填报单位"
                filterable
                clearable
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
              label="填报人："
              prop="fillUser"
            >
              <ElInput
                v-model="form.fillUser"
                placeholder="请输入填报人"
              />
            </ElFormItem>
            <ElFormItem
              label="填报人联系方式："
              prop="fillUserTel"
              :rules="checkPhone"
            >
              <ElInput
                v-model="form.fillUserTel"
                placeholder="请输入联系方式"
              />
            </ElFormItem>
          </div>
          <div :class="$style.region">
            <div :class="$style.subTitle">
              <i :class="$style.subTitleFlag" />
              <span>关联服务器情况</span>
            </div>
            <ElFormItem label="服务器信息：">
              <span
                style="color: #169bd5; cursor: pointer;"
                @click="modalBox"
              >选择服务器</span>
              <div :class="$style.tableWrap">
                <ElTable
                  :data="itemVal"
                  border
                  :class="$style.table"
                  style="width: 80%;"
                >
                  <ElTableColumn
                    label="服务器名称"
                    width="120px"
                    prop="ciName"
                  />
                  <ElTableColumn
                    show-overflow-tooltip
                    prop="Intranet"
                    width="160px"
                    label="IP（内网）"
                  />

                  <ElTableColumn
                    show-overflow-tooltip
                    prop="Extranet"
                    width="220"
                    label="IP（外网）"
                  />
                  <ElTableColumn
                    prop="depositLocationName"
                    width="220"
                    label="托管位置"
                  />
                  <ElTableColumn
                    prop="networkTypeName"
                    width="220"
                    label="所属网络"
                  />
                  <ElTableColumn
                    label="操作"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <ElButton
                        class="el-icon-delete"
                        title="删除"
                        @click="delServe(scope.$index, scope.row)"
                      />
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </ElFormItem>
          </div>
        </ElRow>
        <div
          v-if="!(be === 'Info')"
          :class="$style.button"
        >
          <ElButton
            type="primary"
            @click="save"
          >
            保存
          </ElButton>
          <ElButton @click="cancel">
            取消
          </ElButton>
        </div>
        <ElDialog
          :visible="visible"
          width="1100px"
          :title="'请选择服务器'"
          @close="close"
        >
          <ElForm :model="dlgForm">
            <div :class="$style.dlgForm">
              <div>
                <ElFormItem
                  :class="$style.citype"
                  prop="ciType"
                  style="width: 200px;"
                  :rules="{ required: true, message: '请选择主机类型' }"
                >
                  <ElSelect
                    v-model="dlgForm.ciType"
                    placeholder="请选择主机类型"
                    clearable
                    filterable
                  >
                    <ElOption
                      v-for="(val, key) in PHYSICAL"
                      :key="key"
                      :label="val"
                      :value="key"
                    />
                  </ElSelect>
                </ElFormItem>

                <ElFormItem
                  :class="$style.citype"
                  style="width: 200px;"
                  prop="depositLocationCode"
                >
                  <ElSelect
                    v-model="dlgForm.depositLocationCode"
                    placeholder="请选择托管位置"
                    clearable
                    filterable
                  >
                    <ElOption
                      v-for="(val, key) in ZONE"
                      :key="key"
                      :label="val"
                      :value="key"
                    />
                  </ElSelect>
                </ElFormItem>
                <ElFormItem
                  style="width: 200px;"
                  :class="$style.citype"
                >
                  <ElInput
                    v-model="dlgForm.keyword"
                    placeholder="请输入服务器名称或IP"
                    style="width: 220px;"
                  />
                </ElFormItem>

                <ElFormItem
                  :class="$style.citype"
                  style="width: 200px;"
                  prop="belongCompanyId"
                >
                  <ElSelect
                    v-model="dlgForm.belongCompanyId"
                    placeholder="请选择所属单位"
                    filterable
                    clearable
                    @change="belongCompanyId($event)"
                  >
                    <ElOption
                      v-for="item in organizations"
                      :key="item.id"
                      :label="item.organizationName"
                      :value="item.id"
                    />
                  </ElSelect>
                </ElFormItem>
              </div>
              <div :class="$style.search">
                <ElButton
                  type="primary"
                  @click="search"
                >
                  搜索
                </ElButton>
              </div>
            </div>
          </ElForm>
          <ElTable
            ref="multipleTable"
            v-loading="loading"
            :header-cell-style="{ backgroundColor: '#FBECEA' }"
            highlight-current-row
            tooltip-effect="dark"
            style="width: 100%;"
            :data="dlgData"
            :class="$style.table"
            :row-key="rowKeys"
            @selection-change="handleSelectionChange"
          >
            <ElTableColumn
              type="selection"
              width="55"
              :reserve-selection="true"
            />
            <ElTableColumn
              label="资产编号"
              prop="ciCode"
            >
              <template />
            </ElTableColumn>
            <ElTableColumn
              prop="ciTypeName"
              label="服务器形态"
              width="120"
            />
            <ElTableColumn
              prop="ciName"
              label="服务器名称"
            />
            <ElTableColumn
              label="IP（内网）"
              prop="Intranet"
              show-overflow-tooltip
            />
            <ElTableColumn
              label="IP（外网）"
              prop="Extranet"
              show-overflow-tooltip
            />
            <ElTableColumn
              prop="depositLocationName"
              label="托管位置"
            />
            <ElTableColumn
              prop="belongCompanyName"
              label="所属单位"
              show-overflow-tooltip
            />
          </ElTable>
          <template>
            <ElPagination
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </template>

          <div :class="$style.sure">
            <ElButton
              type="primary"
              :class="$style.button"
              @click="sure"
            >
              确定
            </ElButton>

            <ElButton
              :class="$style.button"
              @click="dlogCancel"
            >
              取消
            </ElButton>
          </div>
        </ElDialog>
      </ElForm>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import {
  querydetailBiz,
  addBiz,
  updateBiz,
} from '@/api/assetsBusiness/assetsBusiness'
import { queryBelongCompanyHost, queryHost } from '@/api/assetsManage/host'
import { getOrganizationInfo } from '@/api/systemManage/organization'
import { User } from '@/api/authServer/user'
import {
  phone,
  email,
  isIpv4OrIPv6,
  isIPv6Equals,
  checkIP,
  checkIPv6,
  length,
} from '@/functions/validators'
import { local } from '@/utils/storage'
import { STORAGE } from '@/enums'
import { decode } from '@/functions/cipher'
import getCode from '@/enums/code'
import LAYOUT from '@/scss/export/layout.scss'
import { NETTYPE } from '../enums'

const REPLACE = getCode('1', 'SYS_asset_secu_dev_rs')
const SCIENCE = getCode('1', 'SYS_asset_secu_dev_de')
const GRADING = getCode('1', 'SYS_asset_sys_level')
const CATEGORY = getCode('1', 'SYS_ASSET_BIZ_TYPE')
const SECRETLEVEL = getCode('1', 'SYS_ASSET_BIZ_CLASSIFY_LEVEL')
const HOSTING = getCode('1', 'SYS_asset_location_zone')
const NETWORKAREA = getCode('1', 'SYS_asset_network_region')
const SELFSTUDY = getCode('1', 'SYS_ASSET_BIZ_SELF_DEVELOPED')
const SYSIMPORTANCE = getCode('1', 'SYS_asset_importance')
const PHYSICAL = getCode('1', 'SYS_asset_type')
const ZONE = getCode('1', 'SYS_asset_location_zone')
const STATUS = getCode('1', 'SYS_ASSET_STATUS')
const info = local.get(STORAGE.me, decode) as User
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: {
    ElTable,
    ElTableColumn,
  },
  data() {
    return {
      loading: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      id: [], // 选中的关联信息的id数组
      val: [],
      itemVal: [],
      dlgData: [],
      list: [],
      transitionData: [],
      dlgForm: {},
      uuid: '',
      form: {
        addresses: [
          {
            type: '',
            ip: '',
            showRepeat: false,
          },
        ],
        dutyPersons: [],
        fillUserTel: info.cellPhone || '',
        fillUser: info.aliasName || '',
        businessHostRels: [],
        middlewares: [],
        dbTypes: [],
        cloudDefenseConnection: '',
      },
      display: false,
      ipInfoValidate: true,
      organizations: [],
      showRepeatIndex: [],
      visible: false,
      rowKeys(row) {
        return row.id
      },
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    NETTYPE: () => NETTYPE,
    REPLACE: () => REPLACE.value || [],
    SCIENCE: () => SCIENCE.value || [],
    GRADING: () => GRADING.value || [],
    CATEGORY: () => CATEGORY.value || [],
    SECRETLEVEL: () => SECRETLEVEL.value || [],
    NETWORKAREA: () => NETWORKAREA.value || [],
    HOSTING: () => HOSTING.value || [],
    SELFSTUDY: () => SELFSTUDY.value || [],
    SYSIMPORTANCE: () => SYSIMPORTANCE.value || [],
    PHYSICAL: () => PHYSICAL.value || [],
    ZONE: () => ZONE.value || [],
    STATUS: () => STATUS.value || [],
    checkPhone() {
      return {
        required: false,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              phone(value)
              callback()
            } catch (error) {
              callback(error)
            }
          } else {
            callback()
          }
        },
      }
    },
    checkMail() {
      return {
        required: false,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              email(value)
              callback()
            } catch (error) {
              return callback(error)
            }
          } else {
            callback()
          }
        },
      }
    },
    checkIPRules() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入IP地址'))
          } else {
            try {
              isIpv4OrIPv6(value)
              callback()
            } catch (error) {
              callback(error)
            }
          }
        },
      }
    },
    checkLength() {
      return {
        required: false,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              length(value)
              callback()
            } catch (error) {
              return callback(error)
            }
          } else {
            callback()
          }
        },
      }
    },
  },
  methods: {
    changeIpType() {
      this.changeIp()
    },
    changeIp() {
      const addresses = this.form.addresses
      const repeatIndex = []
      this.ipInfoValidate = true
      if (addresses.length > 1) {
        for (let i = 0; i < addresses.length; i++) {
          this.form.addresses[i].showRepeat = false
          for (let j = i + 1; j < addresses.length; j++) {
            if (addresses[i].typeInString && addresses[i].ip) {
              if (addresses[i].typeInString === addresses[j].typeInString) {
                if (
                  checkIPv6(addresses[i].ip) &&
                  isIPv6Equals(addresses[i].ip, addresses[j].ip)
                ) {
                  repeatIndex.push(i, j)
                } else if (
                  checkIP(addresses[i].ip) &&
                  addresses[i].ip === addresses[j].ip
                ) {
                  repeatIndex.push(i, j)
                }
              }
            }
          }
        }
        if (repeatIndex.length) {
          this.showRepeatIndex = Array.from(new Set(repeatIndex))
          this.showRepeatIndex.forEach((item) => {
            this.form.addresses[item].showRepeat = true
            this.ipInfoValidate = false
          })
        }
      } else if (addresses.length === 1) {
        this.form.addresses[0].showRepeat = false
      }
    },
    getTerminalInfo() {
      const id = this.route.params.id || ''
      if (id) {
        const ids = []
        ids.push(id)
        querydetailBiz(ids).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
            this.uuid = res.data.body.belongCompanyId
            // this.id=[]
            res.data.body.businessHostRels.map((item) => {
              this.id.push(item.serverId)
            })

            queryHost(this.id).then((res) => {
              this.itemVal = res.data.body
              this.itemVal.map((item) => {
                if (item.addresses.length !== 0) {
                  if (item.addresses[0].type === 1) {
                    item.Intranet = item.addresses[0].ip
                  } else if (item.addresses[0].type === 2) {
                    item.Extranet = item.addresses[0].ip
                  }
                }
              })
            })
          }
          // this.getTableList()
        })
      }
    },
    save(this: any) {
      const data = this.form
      if (this.ipInfoValidate) {
        ;(this.$refs.form as any).validate((valid: boolean) => {
          if (valid) {
            data.businessHostRels = []
            delete data.bizHostRels
            this.id.map((item) => {
              data.businessHostRels.push({
                serverId: item,
              })
            })
            ;(data.id ? updateBiz : addBiz)(data).then(() => {
              this.$notify.success('操作成功')
              this.cancel()
            })
          }
        })
      }
    },
    cancel() {
      this.$router.push({ path: '/assetsManage' })
    },
    addIpInfo(this: any) {
      const obj = {
        type: '',
        ip: '',
      }
      this.form.addresses.push(obj)
    },
    addmiddleware(this: any) {
      const obj = {
        middlewareName: '',
        middlewareVersion: '',
      }
      this.form.middlewares.push(obj)
    },
    adddbType(this: any) {
      const obj = {
        dbTypeName: '',
        dbTypeVersion: '',
      }
      this.form.dbTypes.push(obj)
    },
    delmiddleware(obj) {
      const index = obj.$index
      this.form.middlewares.splice(index, 1)
    },
    deldbType(obj) {
      const index = obj.$index
      this.form.dbTypes.splice(index, 1)
    },
    delIpInfo(obj) {
      const index = obj.$index
      this.form.addresses.splice(index, 1)
      this.changeIp()
    },
    addDutyPersons(this: any) {
      const obj = {
        name: '',
        tel: '',
        mail: '',
        description: '',
      }
      this.form.dutyPersons.push(obj)
    },
    delDutyPerson(obj) {
      const index = obj.$index
      this.form.dutyPersons.splice(index, 1)
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
    organizationId(event) {
      this.uuid = event
    },
    belongCompanyId(id) {
      if (id) {
        this.uuid = event
      }
    },
    // 模态框
    modalBox() {
      this.visible = true
      this.loading = true
      this.getTableList()
    },
    getTableList() {
      this.dlgData = []
      queryBelongCompanyHost({
        belongCompanyId: this.uuid,
        page: this.currentPage,
        pageSize: this.pageSize,
        ...this.dlgForm,
      }).then((res) => {
        if (res.data.status) {
          this.total = res.data.body.total
          this.dlgData = res.data.body.data
          this.dlgData.map((item) => {
            if (item.addresses.length !== 0) {
              item.Intranet = []
              item.Extranet = []
              item.addresses.map((obj) => {
                if (obj.type === 1) {
                  item.Intranet.push(obj.ip)
                } else if (obj.type === 2) {
                  item.Extranet.push(obj.ip)
                }
              })
              item.Intranet = item.Intranet.join(',')
              item.Extranet = item.Extranet.join(',')
            }
            this.loading = false
          })
        } else {
          this.$message({
            message: res.data.body,
            type: 'error',
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.list = JSON.parse(JSON.stringify(val))

      val.map((item) => {
        this.id.push(item.id)
        const newIds = new Set(this.id)
        this.id = [...newIds]
      })
    },
    close() {
      this.visible = false
    },
    // 确定
    sure() {
      this.visible = false
      this.itemVal = [...this.itemVal, ...this.list]
      const arr = this.itemVal
      const res = new Map()
      this.itemVal = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
      this.$refs.multipleTable.clearSelection()
    },
    dlogCancel() {
      this.visible = false
    },
    delServe(index) {
      this.itemVal.splice(index, 1)
      this.id.splice(index, 1)
    },
    search() {
      this.currentPage = 1
      this.getTableList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList()
    },
  },

  created() {
    this.getTerminalInfo()
    this.fetchOrganization()
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
@import '~element-ui/packages/theme-chalk/src/pagination';
</style>
<style lang="scss" module>
.container {
  padding: 0 30px;
}

.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;
}

.contentBox {
  width: $lg;
  margin: 0 auto;
}

.region {
  margin-bottom: 20px;
  margin-left: 0 auto;
  padding-top: $gapNormal;
}

.subTitle {
  height: $gapNormal;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: $medium;
  line-height: $gapNormal;

  .subTitleFlag {
    display: inline-block;
    width: 4px;
    height: 12px;
    margin-right: 10px;
    background-color: #f8902a;
  }
}

.button {
  display: flex;
  justify-content: center;
  margin-bottom: $gapNormal;
}

.textarea {
  width: 100%;
}

.tableWrap {
  display: flex;

  .button {
    height: 40px;
    margin-left: 10px;
  }
}

.tableWrap :global(.el-table__header) {
  tr,
  th {
    padding: 0;
    background: $colorTheme9;
  }
}

.table :global(.el-form-item) {
  margin: 0 0 5px;
}

.modul-top {
  display: flex;
  align-items: center;
}

.sure {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;

  .button {
    width: 80px;
  }
}

.dlgForm {
  display: flex;
  align-items: center;
  justify-content: space-around;

  .citype {
    margin-right: 40px;
  }

  .search {
    margin-bottom: 25px;
  }
}

.danger {
  color: $colorDanger !important;
}

.radioGroup {
  :global(.el-radio__input.is-checked + .el-radio__label) {
    color: #d5402b !important;
  }

  :global(.el-radio__input.is-checked .el-radio__inner) {
    background: #d5402b !important;
    border-color: #d5402b !important;
  }
}
</style>
