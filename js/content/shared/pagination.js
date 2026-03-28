// 通用分页工具 — 将数组按 pageSize 分页
// 默认 pageSize = 9（3x3 棋盘）

export function paginate(items, pageSize = 9) {
  const pages = []
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize))
  }
  return pages
}

export function getPageCount(totalItems, pageSize = 9) {
  return Math.ceil(totalItems / pageSize)
}
