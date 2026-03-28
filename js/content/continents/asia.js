// 亚洲国家列表 — 16 国，分 2 页

export const asiaCountries = [
  // Page 1
  { id: 'china',      name: '中国',     nameEn: 'China',      sortOrder: 1,  themeColor: '#CC2936', hasRegions: true, totalCities: 40 },
  { id: 'japan',      name: '日本',     nameEn: 'Japan',      sortOrder: 2,  themeColor: '#E84057', hasRegions: false, totalCities: 4 },
  { id: 'korea',      name: '韩国',     nameEn: 'South Korea', sortOrder: 3, themeColor: '#4A90D9', hasRegions: false, totalCities: 3 },
  { id: 'thailand',   name: '泰国',     nameEn: 'Thailand',   sortOrder: 4,  themeColor: '#FFB347', hasRegions: false, totalCities: 3 },
  { id: 'singapore',  name: '新加坡',   nameEn: 'Singapore',  sortOrder: 5,  themeColor: '#00A896', hasRegions: false, totalCities: 1 },
  { id: 'vietnam',    name: '越南',     nameEn: 'Vietnam',    sortOrder: 6,  themeColor: '#E74C3C', hasRegions: false, totalCities: 2 },
  { id: 'malaysia',   name: '马来西亚', nameEn: 'Malaysia',   sortOrder: 7,  themeColor: '#3498DB', hasRegions: false, totalCities: 2 },
  { id: 'indonesia',  name: '印度尼西亚', nameEn: 'Indonesia', sortOrder: 8, themeColor: '#E67E22', hasRegions: false, totalCities: 2 },
  { id: 'philippines', name: '菲律宾',  nameEn: 'Philippines', sortOrder: 9, themeColor: '#2ECC71', hasRegions: false, totalCities: 1 },
  // Page 2
  { id: 'india',      name: '印度',     nameEn: 'India',      sortOrder: 10, themeColor: '#FF9933', hasRegions: false, totalCities: 2 },
  { id: 'uae',        name: '阿联酋',   nameEn: 'UAE',        sortOrder: 11, themeColor: '#C0A062', hasRegions: false, totalCities: 1 },
  { id: 'turkey',     name: '土耳其',   nameEn: 'Turkey',     sortOrder: 12, themeColor: '#1A5276', hasRegions: false, totalCities: 1 },
  { id: 'israel',     name: '以色列',   nameEn: 'Israel',     sortOrder: 13, themeColor: '#5DADE2', hasRegions: false, totalCities: 1 },
  { id: 'nepal',      name: '尼泊尔',   nameEn: 'Nepal',      sortOrder: 14, themeColor: '#DC143C', hasRegions: false, totalCities: 1 },
  { id: 'cambodia',   name: '柬埔寨',   nameEn: 'Cambodia',   sortOrder: 15, themeColor: '#1E8449', hasRegions: false, totalCities: 1 },
  { id: 'sri_lanka',  name: '斯里兰卡', nameEn: 'Sri Lanka',  sortOrder: 16, themeColor: '#8E44AD', hasRegions: false, totalCities: 1 },
  { id: 'myanmar',    name: '缅甸',     nameEn: 'Myanmar',    sortOrder: 17, themeColor: '#F4D03F', hasRegions: false, totalCities: 1 },
  { id: 'mongolia',   name: '蒙古',     nameEn: 'Mongolia',   sortOrder: 18, themeColor: '#2980B9', hasRegions: false, totalCities: 1 },
]

// 分页：2 页
export const asiaCountryPages = [
  asiaCountries.slice(0, 9),
  asiaCountries.slice(9),
]

export default asiaCountries
