/**
 * Runtime Navigation — 从 world-catalog 自动生成
 *
 * 只包含 status === 'active' 的节点。
 * MVP 阶段手动覆写亚洲的 childType 为 'city'（跳过国家层），
 * V1.1+ 切换为 catalog 默认的 'country'。
 */

import { worldCatalog } from './world-catalog.js'

// MVP 覆写：亚洲直接指向城市，不经过国家层
const MVP_OVERRIDES = {
  asia: {
    childType: 'city',
    childIds: ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
  },
}

function buildRuntimeNav() {
  const activeNodes = worldCatalog.filter(n => n.status === 'active')
  return activeNodes.map(node => {
    const override = MVP_OVERRIDES[node.id]
    if (override) {
      return { ...node, ...override }
    }
    return { ...node }
  })
}

export const runtimeNavNodes = buildRuntimeNav()

export function getNavNode(id) {
  return runtimeNavNodes.find(n => n.id === id) || null
}

export function getEnabledRoots() {
  return runtimeNavNodes.filter(n => n.parentId === null)
}

export function getChildren(parentId) {
  return runtimeNavNodes.filter(n => n.parentId === parentId)
}
