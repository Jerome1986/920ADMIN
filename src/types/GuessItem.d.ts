// 猜你想搜数据类型
export interface GuessItem {
  /** 唯一标识 */
  _id?: string
  /** 名称 */
  name: string
}

// 分页类型
export type GuessPageResult = {
  list: GuessItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
