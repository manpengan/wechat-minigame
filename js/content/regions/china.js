// 中国地区列表 — 8 个地区，1 页

export const chinaRegions = [
  {
    id: 'north_china',
    name: '华北',
    nameEn: 'North China',
    sortOrder: 1,
    themeColor: '#CC2936',
    cityIds: ['beijing', 'tianjin', 'shijiazhuang', 'taiyuan', 'hohhot'],
  },
  {
    id: 'northeast',
    name: '东北',
    nameEn: 'Northeast',
    sortOrder: 2,
    themeColor: '#5DADE2',
    cityIds: ['shenyang', 'changchun', 'harbin', 'dalian'],
  },
  {
    id: 'east_china',
    name: '华东',
    nameEn: 'East China',
    sortOrder: 3,
    themeColor: '#2ECC71',
    cityIds: ['shanghai', 'nanjing', 'hangzhou', 'hefei', 'fuzhou', 'nanchang', 'jinan', 'suzhou', 'xiamen', 'qingdao', 'ningbo'],
  },
  {
    id: 'central_china',
    name: '华中',
    nameEn: 'Central China',
    sortOrder: 4,
    themeColor: '#E67E22',
    cityIds: ['zhengzhou', 'wuhan', 'changsha'],
  },
  {
    id: 'south_china',
    name: '华南',
    nameEn: 'South China',
    sortOrder: 5,
    themeColor: '#FF6B6B',
    cityIds: ['guangzhou', 'shenzhen', 'nanning', 'haikou', 'sanya'],
  },
  {
    id: 'southwest',
    name: '西南',
    nameEn: 'Southwest',
    sortOrder: 6,
    themeColor: '#9B59B6',
    cityIds: ['chengdu', 'chongqing', 'guiyang', 'kunming', 'lhasa'],
  },
  {
    id: 'northwest',
    name: '西北',
    nameEn: 'Northwest',
    sortOrder: 7,
    themeColor: '#F4D03F',
    cityIds: ['xian', 'lanzhou', 'xining', 'yinchuan', 'urumqi'],
  },
  {
    id: 'hk_macao',
    name: '港澳',
    nameEn: 'HK & Macao',
    sortOrder: 8,
    themeColor: '#E74C3C',
    cityIds: ['hongkong', 'macao'],
  },
]

// 分页：1 页（8 项 ≤ 9）
export const chinaRegionPages = [chinaRegions]

export default chinaRegions
