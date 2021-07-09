import STYLE from '@/scss/status.module.scss'

export const enum STATUS {
  /** 待提交 */
  submit = 'PENDING_SUBMIT',
  /** 待确认 */
  confirm = 'PENDING_CONFIRM',
  /** 待处理 */
  handle = 'PENDING_HANDLE',
  /** 交付中  */
  delivering = 'DELIVERING',
  /** 待评价 */
  evaluation = 'PENDING_EVALUATION',
  /** 交付完成 */
  finish = 'FINISH',
}

export default (status: STATUS) => {
  switch (status) {
    case STATUS.submit:
      return { class: STYLE.info }
    default:
      break
  }
}
