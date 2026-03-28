/**
 * Future Catalog — 未来版本导航规划
 *
 * 这些节点不进入当前 runtime 消费链路。
 * 当新版本上线新城市时，将对应节点移入 runtime-nav.js 并设 isEnabled: true。
 * 引用的 cityId 可能尚不存在对应 CityManifest。
 */

// V1.1: 中国一线城市扩展
export const v11_china_cities = ['shanghai', 'guangzhou', 'chengdu', 'shenzhen', 'hangzhou', 'chongqing']

// V1.2: 中国二线 A
export const v12_china_cities = ['wuhan', 'xian', 'changsha', 'nanjing', 'harbin', 'xiamen']

// V1.3: 欧洲热门
export const v13_europe_cities = ['paris', 'london', 'rome', 'barcelona', 'prague', 'amsterdam']

// 中国地区划分（V1.1+ 启用国家→地区→城市导航时使用）
export const chinaRegionPlan = [
  { id: 'north_china', name: '华北', cityIds: ['beijing', 'tianjin', 'shijiazhuang', 'taiyuan', 'hohhot'] },
  { id: 'northeast', name: '东北', cityIds: ['shenyang', 'changchun', 'harbin', 'dalian'] },
  { id: 'east_china', name: '华东', cityIds: ['shanghai', 'nanjing', 'hangzhou', 'hefei', 'fuzhou', 'nanchang', 'jinan', 'suzhou', 'xiamen', 'qingdao', 'ningbo'] },
  { id: 'central_china', name: '华中', cityIds: ['zhengzhou', 'wuhan', 'changsha'] },
  { id: 'south_china', name: '华南', cityIds: ['guangzhou', 'shenzhen', 'nanning', 'haikou', 'sanya'] },
  { id: 'southwest', name: '西南', cityIds: ['chengdu', 'chongqing', 'guiyang', 'kunming', 'lhasa'] },
  { id: 'northwest', name: '西北', cityIds: ['xian', 'lanzhou', 'xining', 'yinchuan', 'urumqi'] },
  { id: 'hk_macao_tw', name: '港澳台', cityIds: ['hongkong', 'macao', 'taipei'] },
]

// 全部亚洲国家（V1.1+ 启用）
export const asiaCountryPlan = [
  { id: 'china', name: '中国', hasRegions: true, totalCities: 41 },
  { id: 'japan', name: '日本', cityIds: ['tokyo', 'osaka', 'kyoto', 'sapporo'] },
  { id: 'korea', name: '韩国', cityIds: ['seoul', 'busan', 'jeju'] },
  { id: 'thailand', name: '泰国', cityIds: ['bangkok', 'chiangmai', 'phuket'] },
  { id: 'singapore_country', name: '新加坡', cityIds: ['singapore'] },
  { id: 'vietnam', name: '越南', cityIds: ['hanoi', 'hochiminh'] },
  { id: 'malaysia', name: '马来西亚', cityIds: ['kualalumpur', 'malacca'] },
  { id: 'indonesia', name: '印度尼西亚', cityIds: ['jakarta', 'bali'] },
  { id: 'philippines', name: '菲律宾', cityIds: ['manila'] },
  { id: 'india', name: '印度', cityIds: ['delhi', 'mumbai'] },
  { id: 'uae', name: '阿联酋', cityIds: ['dubai'] },
  { id: 'turkey', name: '土耳其', cityIds: ['istanbul'] },
  { id: 'israel', name: '以色列', cityIds: ['jerusalem'] },
  { id: 'nepal', name: '尼泊尔', cityIds: ['kathmandu'] },
  { id: 'cambodia', name: '柬埔寨', cityIds: ['siemreap'] },
  { id: 'sri_lanka', name: '斯里兰卡', cityIds: ['colombo'] },
  { id: 'myanmar', name: '缅甸', cityIds: ['yangon'] },
  { id: 'mongolia', name: '蒙古', cityIds: ['ulaanbaatar'] },
]
