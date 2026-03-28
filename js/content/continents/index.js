// 洲索引 — 3x3 棋盘第 1 级
// 每页 9 格，当前 6 个洲 + 3 空位

export const continents = [
  { id: 'asia',       name: '亚洲',   nameEn: 'Asia',          sortOrder: 1, themeColor: '#FF6B6B', icon: '🏯', totalCities: 70 },
  { id: 'europe',     name: '欧洲',   nameEn: 'Europe',        sortOrder: 2, themeColor: '#6B8CFF', icon: '🏰', totalCities: 28 },
  { id: 'north_america', name: '北美洲', nameEn: 'North America', sortOrder: 3, themeColor: '#FFB347', icon: '🗽', totalCities: 12 },
  { id: 'south_america', name: '南美洲', nameEn: 'South America', sortOrder: 4, themeColor: '#4ECDC4', icon: '🌴', totalCities: 7 },
  { id: 'africa',     name: '非洲',   nameEn: 'Africa',        sortOrder: 5, themeColor: '#F7DC6F', icon: '🦁', totalCities: 5 },
  { id: 'oceania',    name: '大洋洲', nameEn: 'Oceania',       sortOrder: 6, themeColor: '#82E0AA', icon: '🦘', totalCities: 4 },
]

// 分页：1 页（6 项 ≤ 9）
export const continentPages = [continents]

export default continents
