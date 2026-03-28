/**
 * NavNode — 统一导航节点 schema
 *
 * 所有导航层级（洲/国家/地区/城市组）共用同一 shape。
 * 分页通过 shared/pagination.js 的 paginate() 动态计算，不手写 page 常量。
 *
 * @typedef {Object} NavNode
 * @property {'continent'|'country'|'region'|'city-group'} type
 * @property {string} id - 全局唯一标识
 * @property {string|null} parentId - 父节点 id，洲级为 null
 * @property {string} name - 中文名
 * @property {string} nameEn - 英文名
 * @property {number} sortOrder - 同级排序
 * @property {string} themeColor - 主题色 HEX
 * @property {'country'|'region'|'city'|null} childType - 子节点类型
 * @property {string[]} childIds - 当前可消费的子节点 id（仅已启用的）
 * @property {number} pageSize - 每页格子数，默认 9
 * @property {'active'|'planned'} status - 'active'（当前可运行）/ 'planned'（未来规划）
 * @property {boolean} isUnlockedByDefault - 是否默认解锁
 */

// schema 验证函数
export function validateNavNode(node) {
  const required = ['type', 'id', 'name', 'nameEn', 'sortOrder', 'themeColor', 'childType', 'childIds', 'pageSize', 'status', 'isUnlockedByDefault']
  const validTypes = ['continent', 'country', 'region', 'city-group']
  const validChildTypes = ['country', 'region', 'city', null]
  const validStatuses = ['active', 'planned']

  const errors = []
  for (const key of required) {
    if (!(key in node)) errors.push(`missing field: ${key}`)
  }
  if (!validTypes.includes(node.type)) errors.push(`invalid type: ${node.type}`)
  if (!validChildTypes.includes(node.childType)) errors.push(`invalid childType: ${node.childType}`)
  if (!Array.isArray(node.childIds)) errors.push('childIds must be array')
  if (node.parentId !== null && typeof node.parentId !== 'string') errors.push('parentId must be string or null')
  if (!validStatuses.includes(node.status)) errors.push(`invalid status: ${node.status}, must be 'active' or 'planned'`)
  return errors
}
