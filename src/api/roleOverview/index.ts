import { get, post } from '@/utils/ajax'

export const enum API {
  // 单位最新/最热公告列表-本级及下级及公开数据
  cloudServicesList = 'service-platform/notice/cloudServicesList',
  needToBeDealtWith = 'service-platform/taskProcess/statistical/survey/todo', // 待办任务
}

function cloudServicesList(param: Record<string, any>) {
  return post(API.cloudServicesList, param)
}

function needToBeDealtWith() {
  return get(API.needToBeDealtWith)
}

export {
  cloudServicesList,
  needToBeDealtWith,
}
