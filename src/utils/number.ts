// 数字四舍五入（保留n位小数）
const getFloat = function(number: any, n: any) {
  n = n ? parseInt(n) : 0
  if (n <= 0) return Math.round(number)
  number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
  return number
}
export {
  getFloat,
}
