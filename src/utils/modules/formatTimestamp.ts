export function padZero(num: number) {
  return num < 10 ? '0' + num : num
}

// 格式化时间
export function formatTimestamp(timestamp: Date, type = 1) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1) // 月份是从0开始的，所以需要+1
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())
  if (type === 1) return `${year}-${month}-${day}`
  if (type === 2) return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 格式化金额--数据库存分，将分转换为元来显示
export const formatAmount = (amount: number) => {
  return (amount / 100).toFixed(2)
}
