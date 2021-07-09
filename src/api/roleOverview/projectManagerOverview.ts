import { get } from '@/utils/ajax'

export const enum API {

    // 用户概览页-任务统计数据-项目经理
  getProManager='service-platform/taskProcess/statistical/survey/proManager',

// 用户概览页-任务统计-条形图-项目经理
  getBarProManager='service-platform/taskProcess/statistical/bar/proManager',

// 用户概览页-项目经理-已办用户top5
topUserDone='service-platform/taskProcess/statistical/topUser/Done',

// 用户概览页-项目经理-待办用户top5
  topUserTodo='service-platform/taskProcess/statistical/topUser/todo'
}
function getProManager(param: Record<string, any>) {
  return get(API.getProManager, param)
}

function getBarProManager(param: Record<string, any>) {
  return get(API.getBarProManager, param)
}

function topUserDone(data: number) {
  return get(API.topUserDone, { data })
}

function topUserTodo(data: number) {
  return get(API.topUserTodo, { data })
}
export {
  getProManager,
  getBarProManager,
  topUserDone,
  topUserTodo,
}
