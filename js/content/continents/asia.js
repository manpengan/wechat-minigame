/**
 * @deprecated 亚洲国家列表已移入 navigation/world-catalog.js
 * MVP 阶段亚洲直接列出城市，不经过国家层。
 */
import { getCatalogChildren } from '../navigation/world-catalog.js'
export const asiaCountries = getCatalogChildren('asia')
