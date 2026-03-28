/**
 * World Catalog — 全量世界导航规划
 *
 * 所有节点使用统一 NavNode schema。
 * status: 'active' = 当前版本可运行（有对应真实内容）
 * status: 'planned' = 未来版本规划（无对应内容，不进入 runtime）
 *
 * 扩展新城市时：
 * 1. 创建城市 CityManifest 文件
 * 2. 将对应节点 status 改为 'active'
 * 3. runtime-nav.js 会自动过滤出 active 节点
 */

export const worldCatalog = [
  // ═══════════════════════════════════════
  // 洲级
  // ═══════════════════════════════════════
  {
    type: 'continent', id: 'asia', parentId: null,
    name: '亚洲', nameEn: 'Asia', sortOrder: 1, themeColor: '#FF6B6B',
    childType: 'country',
    childIds: ['china', 'japan', 'korea', 'thailand', 'singapore_country', 'vietnam', 'malaysia', 'indonesia', 'philippines', 'india', 'uae', 'turkey', 'israel', 'nepal', 'cambodia', 'sri_lanka', 'myanmar', 'mongolia'],
    pageSize: 9, status: 'active', isUnlockedByDefault: true,
  },
  {
    type: 'continent', id: 'europe', parentId: null,
    name: '欧洲', nameEn: 'Europe', sortOrder: 2, themeColor: '#6B8CFF',
    childType: 'country',
    childIds: ['france', 'uk', 'italy', 'spain', 'germany', 'netherlands', 'switzerland', 'austria', 'czech', 'greece', 'russia', 'portugal', 'norway', 'sweden', 'denmark', 'finland', 'iceland', 'hungary'],
    pageSize: 9, status: 'planned', isUnlockedByDefault: false,
  },
  {
    type: 'continent', id: 'north_america', parentId: null,
    name: '北美洲', nameEn: 'North America', sortOrder: 3, themeColor: '#FFB347',
    childType: 'country',
    childIds: ['usa', 'canada', 'mexico'],
    pageSize: 9, status: 'planned', isUnlockedByDefault: false,
  },
  {
    type: 'continent', id: 'south_america', parentId: null,
    name: '南美洲', nameEn: 'South America', sortOrder: 4, themeColor: '#4ECDC4',
    childType: 'country',
    childIds: ['brazil', 'argentina', 'peru', 'chile', 'colombia'],
    pageSize: 9, status: 'planned', isUnlockedByDefault: false,
  },
  {
    type: 'continent', id: 'africa', parentId: null,
    name: '非洲', nameEn: 'Africa', sortOrder: 5, themeColor: '#F7DC6F',
    childType: 'country',
    childIds: ['egypt', 'south_africa', 'morocco', 'kenya'],
    pageSize: 9, status: 'planned', isUnlockedByDefault: false,
  },
  {
    type: 'continent', id: 'oceania', parentId: null,
    name: '大洋洲', nameEn: 'Oceania', sortOrder: 6, themeColor: '#82E0AA',
    childType: 'country',
    childIds: ['australia', 'new_zealand'],
    pageSize: 9, status: 'planned', isUnlockedByDefault: false,
  },
  {
    type: 'continent', id: 'antarctica', parentId: null,
    name: '南极洲', nameEn: 'Antarctica', sortOrder: 7, themeColor: '#AED6F1',
    childType: 'country',
    childIds: [],
    pageSize: 9, status: 'planned', isUnlockedByDefault: false,
  },
  // ── 特殊入口（非洲级，但在主页 3x3 中占位） ──
  {
    type: 'continent', id: 'mashup', parentId: null,
    name: '主题大混战', nameEn: 'World Mashup', sortOrder: 8, themeColor: '#E74C3C',
    childType: null,
    childIds: [],
    pageSize: 9, status: 'active', isUnlockedByDefault: false,
  },
  {
    type: 'continent', id: 'coming_soon', parentId: null,
    name: '敬请期待', nameEn: 'Coming Soon', sortOrder: 9, themeColor: '#BDC3C7',
    childType: null,
    childIds: [],
    pageSize: 9, status: 'active', isUnlockedByDefault: false,
  },

  // ═══════════════════════════════════════
  // 亚洲国家（18 国）
  // ═══════════════════════════════════════
  // MVP active: 中国/日本/韩国/泰国/新加坡/土耳其各有 1 个 active 城市
  { type: 'country', id: 'china', parentId: 'asia', name: '中国', nameEn: 'China', sortOrder: 1, themeColor: '#CC2936', childType: 'region', childIds: ['north_china', 'northeast', 'east_china', 'central_china', 'south_china', 'southwest', 'northwest', 'hk_macao_tw'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'japan', parentId: 'asia', name: '日本', nameEn: 'Japan', sortOrder: 2, themeColor: '#E84057', childType: 'city', childIds: ['tokyo', 'osaka', 'kyoto', 'sapporo'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'korea', parentId: 'asia', name: '韩国', nameEn: 'South Korea', sortOrder: 3, themeColor: '#4A90D9', childType: 'city', childIds: ['seoul', 'busan', 'jeju'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'thailand', parentId: 'asia', name: '泰国', nameEn: 'Thailand', sortOrder: 4, themeColor: '#FFB347', childType: 'city', childIds: ['bangkok', 'chiangmai', 'phuket'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'singapore_country', parentId: 'asia', name: '新加坡', nameEn: 'Singapore', sortOrder: 5, themeColor: '#00A896', childType: 'city', childIds: ['singapore'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'vietnam', parentId: 'asia', name: '越南', nameEn: 'Vietnam', sortOrder: 6, themeColor: '#E74C3C', childType: 'city', childIds: ['hanoi', 'hochiminh'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'malaysia', parentId: 'asia', name: '马来西亚', nameEn: 'Malaysia', sortOrder: 7, themeColor: '#3498DB', childType: 'city', childIds: ['kualalumpur', 'malacca'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'indonesia', parentId: 'asia', name: '印度尼西亚', nameEn: 'Indonesia', sortOrder: 8, themeColor: '#E67E22', childType: 'city', childIds: ['jakarta', 'bali'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'philippines', parentId: 'asia', name: '菲律宾', nameEn: 'Philippines', sortOrder: 9, themeColor: '#2ECC71', childType: 'city', childIds: ['manila'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'india', parentId: 'asia', name: '印度', nameEn: 'India', sortOrder: 10, themeColor: '#FF9933', childType: 'city', childIds: ['delhi', 'mumbai'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'uae', parentId: 'asia', name: '阿联酋', nameEn: 'UAE', sortOrder: 11, themeColor: '#C0A062', childType: 'city', childIds: ['dubai'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'turkey', parentId: 'asia', name: '土耳其', nameEn: 'Turkey', sortOrder: 12, themeColor: '#1A5276', childType: 'city', childIds: ['istanbul'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'israel', parentId: 'asia', name: '以色列', nameEn: 'Israel', sortOrder: 13, themeColor: '#5DADE2', childType: 'city', childIds: ['jerusalem'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'nepal', parentId: 'asia', name: '尼泊尔', nameEn: 'Nepal', sortOrder: 14, themeColor: '#DC143C', childType: 'city', childIds: ['kathmandu'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'cambodia', parentId: 'asia', name: '柬埔寨', nameEn: 'Cambodia', sortOrder: 15, themeColor: '#1E8449', childType: 'city', childIds: ['siemreap'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'sri_lanka', parentId: 'asia', name: '斯里兰卡', nameEn: 'Sri Lanka', sortOrder: 16, themeColor: '#8E44AD', childType: 'city', childIds: ['colombo'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'myanmar', parentId: 'asia', name: '缅甸', nameEn: 'Myanmar', sortOrder: 17, themeColor: '#F4D03F', childType: 'city', childIds: ['yangon'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'mongolia', parentId: 'asia', name: '蒙古', nameEn: 'Mongolia', sortOrder: 18, themeColor: '#2980B9', childType: 'city', childIds: ['ulaanbaatar'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },

  // ═══════════════════════════════════════
  // 中国地区（8 区）
  // ═══════════════════════════════════════
  { type: 'region', id: 'north_china', parentId: 'china', name: '华北', nameEn: 'North China', sortOrder: 1, themeColor: '#CC2936', childType: 'city', childIds: ['beijing', 'tianjin', 'shijiazhuang', 'taiyuan', 'hohhot'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'northeast', parentId: 'china', name: '东北', nameEn: 'Northeast', sortOrder: 2, themeColor: '#5DADE2', childType: 'city', childIds: ['shenyang', 'changchun', 'harbin', 'dalian'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'east_china', parentId: 'china', name: '华东', nameEn: 'East China', sortOrder: 3, themeColor: '#2ECC71', childType: 'city', childIds: ['shanghai', 'nanjing', 'hangzhou', 'hefei', 'fuzhou', 'nanchang', 'jinan', 'suzhou', 'xiamen', 'qingdao', 'ningbo'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'central_china', parentId: 'china', name: '华中', nameEn: 'Central China', sortOrder: 4, themeColor: '#E67E22', childType: 'city', childIds: ['zhengzhou', 'wuhan', 'changsha'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'south_china', parentId: 'china', name: '华南', nameEn: 'South China', sortOrder: 5, themeColor: '#FF6B6B', childType: 'city', childIds: ['guangzhou', 'shenzhen', 'nanning', 'haikou', 'sanya'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'southwest', parentId: 'china', name: '西南', nameEn: 'Southwest', sortOrder: 6, themeColor: '#9B59B6', childType: 'city', childIds: ['chengdu', 'chongqing', 'guiyang', 'kunming', 'lhasa'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'northwest', parentId: 'china', name: '西北', nameEn: 'Northwest', sortOrder: 7, themeColor: '#F4D03F', childType: 'city', childIds: ['xian', 'lanzhou', 'xining', 'yinchuan', 'urumqi'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'region', id: 'hk_macao_tw', parentId: 'china', name: '港澳台', nameEn: 'HK, Macao & Taiwan', sortOrder: 8, themeColor: '#E74C3C', childType: 'city', childIds: ['hongkong', 'macao', 'taipei'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },

  // ═══════════════════════════════════════
  // 欧洲国家（18 国）
  // ═══════════════════════════════════════
  { type: 'country', id: 'france', parentId: 'europe', name: '法国', nameEn: 'France', sortOrder: 1, themeColor: '#3B5998', childType: 'city', childIds: ['paris', 'nice'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'uk', parentId: 'europe', name: '英国', nameEn: 'United Kingdom', sortOrder: 2, themeColor: '#C0392B', childType: 'city', childIds: ['london', 'edinburgh'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'italy', parentId: 'europe', name: '意大利', nameEn: 'Italy', sortOrder: 3, themeColor: '#27AE60', childType: 'city', childIds: ['rome', 'milan', 'venice', 'florence'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'spain', parentId: 'europe', name: '西班牙', nameEn: 'Spain', sortOrder: 4, themeColor: '#E74C3C', childType: 'city', childIds: ['madrid', 'barcelona'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'germany', parentId: 'europe', name: '德国', nameEn: 'Germany', sortOrder: 5, themeColor: '#2C3E50', childType: 'city', childIds: ['berlin', 'munich'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'netherlands', parentId: 'europe', name: '荷兰', nameEn: 'Netherlands', sortOrder: 6, themeColor: '#FF6600', childType: 'city', childIds: ['amsterdam'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'switzerland', parentId: 'europe', name: '瑞士', nameEn: 'Switzerland', sortOrder: 7, themeColor: '#E74C3C', childType: 'city', childIds: ['zurich'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'austria', parentId: 'europe', name: '奥地利', nameEn: 'Austria', sortOrder: 8, themeColor: '#C0392B', childType: 'city', childIds: ['vienna'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'czech', parentId: 'europe', name: '捷克', nameEn: 'Czech Republic', sortOrder: 9, themeColor: '#2980B9', childType: 'city', childIds: ['prague'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'greece', parentId: 'europe', name: '希腊', nameEn: 'Greece', sortOrder: 10, themeColor: '#0D5EAF', childType: 'city', childIds: ['athens'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'russia', parentId: 'europe', name: '俄罗斯', nameEn: 'Russia', sortOrder: 11, themeColor: '#C0392B', childType: 'city', childIds: ['moscow', 'stpetersburg'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'portugal', parentId: 'europe', name: '葡萄牙', nameEn: 'Portugal', sortOrder: 12, themeColor: '#27AE60', childType: 'city', childIds: ['lisbon'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'norway', parentId: 'europe', name: '挪威', nameEn: 'Norway', sortOrder: 13, themeColor: '#2980B9', childType: 'city', childIds: ['oslo'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'sweden', parentId: 'europe', name: '瑞典', nameEn: 'Sweden', sortOrder: 14, themeColor: '#F1C40F', childType: 'city', childIds: ['stockholm'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'denmark', parentId: 'europe', name: '丹麦', nameEn: 'Denmark', sortOrder: 15, themeColor: '#C0392B', childType: 'city', childIds: ['copenhagen'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'finland', parentId: 'europe', name: '芬兰', nameEn: 'Finland', sortOrder: 16, themeColor: '#2980B9', childType: 'city', childIds: ['helsinki'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'iceland', parentId: 'europe', name: '冰岛', nameEn: 'Iceland', sortOrder: 17, themeColor: '#2C3E50', childType: 'city', childIds: ['reykjavik'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'hungary', parentId: 'europe', name: '匈牙利', nameEn: 'Hungary', sortOrder: 18, themeColor: '#27AE60', childType: 'city', childIds: ['budapest'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },

  // ═══════════════════════════════════════
  // 北美国家（3 国）
  // ═══════════════════════════════════════
  { type: 'country', id: 'usa', parentId: 'north_america', name: '美国', nameEn: 'United States', sortOrder: 1, themeColor: '#3B5998', childType: 'city', childIds: ['newyork', 'losangeles', 'sanfrancisco', 'lasvegas', 'washington', 'chicago', 'miami'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'canada', parentId: 'north_america', name: '加拿大', nameEn: 'Canada', sortOrder: 2, themeColor: '#E74C3C', childType: 'city', childIds: ['vancouver', 'toronto', 'montreal'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'mexico', parentId: 'north_america', name: '墨西哥', nameEn: 'Mexico', sortOrder: 3, themeColor: '#27AE60', childType: 'city', childIds: ['mexicocity', 'cancun'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },

  // ═══════════════════════════════════════
  // 南美国家（5 国）
  // ═══════════════════════════════════════
  { type: 'country', id: 'brazil', parentId: 'south_america', name: '巴西', nameEn: 'Brazil', sortOrder: 1, themeColor: '#F1C40F', childType: 'city', childIds: ['rio', 'saopaulo'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'argentina', parentId: 'south_america', name: '阿根廷', nameEn: 'Argentina', sortOrder: 2, themeColor: '#5DADE2', childType: 'city', childIds: ['buenosaires'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'peru', parentId: 'south_america', name: '秘鲁', nameEn: 'Peru', sortOrder: 3, themeColor: '#E74C3C', childType: 'city', childIds: ['lima', 'cusco'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'chile', parentId: 'south_america', name: '智利', nameEn: 'Chile', sortOrder: 4, themeColor: '#2980B9', childType: 'city', childIds: ['santiago'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'colombia', parentId: 'south_america', name: '哥伦比亚', nameEn: 'Colombia', sortOrder: 5, themeColor: '#F39C12', childType: 'city', childIds: ['bogota'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },

  // ═══════════════════════════════════════
  // 非洲国家（4 国）
  // ═══════════════════════════════════════
  { type: 'country', id: 'egypt', parentId: 'africa', name: '埃及', nameEn: 'Egypt', sortOrder: 1, themeColor: '#F39C12', childType: 'city', childIds: ['cairo'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'south_africa', parentId: 'africa', name: '南非', nameEn: 'South Africa', sortOrder: 2, themeColor: '#27AE60', childType: 'city', childIds: ['capetown'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'morocco', parentId: 'africa', name: '摩洛哥', nameEn: 'Morocco', sortOrder: 3, themeColor: '#E74C3C', childType: 'city', childIds: ['marrakech'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'kenya', parentId: 'africa', name: '肯尼亚', nameEn: 'Kenya', sortOrder: 4, themeColor: '#2C3E50', childType: 'city', childIds: ['nairobi', 'mombasa'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },

  // ═══════════════════════════════════════
  // 大洋洲国家（2 国）
  // ═══════════════════════════════════════
  { type: 'country', id: 'australia', parentId: 'oceania', name: '澳大利亚', nameEn: 'Australia', sortOrder: 1, themeColor: '#F39C12', childType: 'city', childIds: ['sydney', 'melbourne'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
  { type: 'country', id: 'new_zealand', parentId: 'oceania', name: '新西兰', nameEn: 'New Zealand', sortOrder: 2, themeColor: '#2C3E50', childType: 'city', childIds: ['auckland', 'queenstown'], pageSize: 9, status: 'planned', isUnlockedByDefault: false },
]

// ── 查询工具 ──
export function getCatalogNode(id) {
  return worldCatalog.find(n => n.id === id) || null
}

export function getCatalogChildren(parentId) {
  return worldCatalog.filter(n => n.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getActiveNodes() {
  return worldCatalog.filter(n => n.status === 'active')
}

export function getPlannedNodes() {
  return worldCatalog.filter(n => n.status === 'planned')
}
