/**
 * Runtime Navigation — MVP
 *
 * 只包含当前版本已启用、childIds 均指向已存在实体的节点。
 * MVP 导航：直入亚洲城市页，6 城市平铺。
 * V1.1+ 启用完整洲→国家→地区→城市多级导航时，在此文件追加节点。
 */

export const runtimeNavNodes = [
  // ── MVP: 只有 1 个洲，直接列出 6 城市 ──
  {
    type: 'continent',
    id: 'asia',
    parentId: null,
    name: '亚洲',
    nameEn: 'Asia',
    sortOrder: 1,
    themeColor: '#FF6B6B',
    childType: 'city',          // MVP: 直接指向城市，跳过国家层
    childIds: ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
    pageSize: 9,
    isEnabled: true,
    isUnlockedByDefault: true,
  },

  // ── 未启用的洲（占位，UI 显示锁定态） ──
  {
    type: 'continent',
    id: 'europe',
    parentId: null,
    name: '欧洲',
    nameEn: 'Europe',
    sortOrder: 2,
    themeColor: '#6B8CFF',
    childType: 'country',
    childIds: [],               // 无可消费子节点
    pageSize: 9,
    isEnabled: false,
    isUnlockedByDefault: false,
  },
  {
    type: 'continent',
    id: 'north_america',
    parentId: null,
    name: '北美洲',
    nameEn: 'North America',
    sortOrder: 3,
    themeColor: '#FFB347',
    childType: 'country',
    childIds: [],
    pageSize: 9,
    isEnabled: false,
    isUnlockedByDefault: false,
  },
  {
    type: 'continent',
    id: 'south_america',
    parentId: null,
    name: '南美洲',
    nameEn: 'South America',
    sortOrder: 4,
    themeColor: '#4ECDC4',
    childType: 'country',
    childIds: [],
    pageSize: 9,
    isEnabled: false,
    isUnlockedByDefault: false,
  },
  {
    type: 'continent',
    id: 'africa',
    parentId: null,
    name: '非洲',
    nameEn: 'Africa',
    sortOrder: 5,
    themeColor: '#F7DC6F',
    childType: 'country',
    childIds: [],
    pageSize: 9,
    isEnabled: false,
    isUnlockedByDefault: false,
  },
  {
    type: 'continent',
    id: 'oceania',
    parentId: null,
    name: '大洋洲',
    nameEn: 'Oceania',
    sortOrder: 6,
    themeColor: '#82E0AA',
    childType: 'country',
    childIds: [],
    pageSize: 9,
    isEnabled: false,
    isUnlockedByDefault: false,
  },
]

// ── 便捷查询 ──
export function getNavNode(id) {
  return runtimeNavNodes.find(n => n.id === id) || null
}

export function getEnabledRoots() {
  return runtimeNavNodes.filter(n => n.parentId === null && n.isEnabled)
}

export function getChildren(parentId) {
  return runtimeNavNodes.filter(n => n.parentId === parentId && n.isEnabled)
}
