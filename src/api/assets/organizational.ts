import { get, post } from '@/utils/ajax'

export const enum API {
  eimt='auth-server/staff/updateStaff',
  // 获取组织机构树
  framework = 'auth-server/organization/getOrganizationTree',
  deleteDate='auth-server/organization/delete',
  addOrganization='auth-server/organization/addOrganization',
  next='auth-server/organization/move',
  addQuery='auth-server/organization/getOrganizationUpdateInfo',

  // 所有All
  gitAllOrganizationTree = 'auth-server/organization/getOrganizationTree',
  personnel='auth-server/staff/listStaffPageForOrganization', // 查询所属机构人员
  deletePeople ='auth-server/staff/deleteStaff',
  addPeople= 'auth-server/staff/addStaff',
  changeDepartment='auth-server/staff/batchUpdateStaffOrganizationId'
}

function framework(id: any) {
  return get(API.framework.replace('{id}', id))
}

function query(id: any) {
  return get(`auth-server/organization/getOrganizationInfo?organizationName=${id}`)
}

function deleteDate(id: any) {
  return get(`auth-server/organization/delete?organizationId=${id}`)
}

function addOrganization(param: Record<string, any>) {
  return post(API.addOrganization, param)
}

function eimt(param: Record<string, any>) {
  return post(API.eimt, param)
}

function next(id: any, flag: any, number: any) {
  return get(`auth-server/organization/move?flag=${flag}&organizationId=${id}&number=${number}`)
}

function superior(id: any) {
  return get(`auth-server/organization/getOrganizationParentList?organizationId=${id}`)
}

function addQuery(id: any) {
  return get(API.addQuery.replace('{id}', id))
}

function getAllOrganizationTree() {
  return get(API.gitAllOrganizationTree)
}

function personnel(param: Record<string, any>) {
  return post(API.personnel, param)
}

function deletePeople(param: Record<string, any>) {
  return post(`auth-server/staff/deleteStaff?staffId=${param}`)
}

function addPeople(param: Record<string, any>) {
  return post(API.addPeople, param)
}

function changeDepartment(param: Record<string, any>) {
  return post(API.changeDepartment, param)
}
export {
  framework,
  query,
  deleteDate,
  addOrganization,
  next,
  superior,
  addQuery,
  getAllOrganizationTree,
  personnel,
  deletePeople,
  addPeople,
  changeDepartment,
  eimt,
}
