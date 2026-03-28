import { createLevelPresets } from '../shared/level-presets.js'

export const tokyo = {
  id: 'tokyo',
  contentVersion: 1,
  continentId: 'asia',
  countryId: 'japan',
  regionId: null,
  sortOrder: 2,
  unlockAfterCityId: 'bangkok',
  bundle: {
    packId: 'asia-rest',
    preload: 'on-city-page',
  },
  display: {
    name: '东京',
    nameEn: 'Tokyo',
    bgColor: '#FF6F91',
    tagline: '樱花街头看猫猫',
    funFact: '东京拥有世界级的铁路网络',
  },
  cover: {
    catImage: 'images/cats/cat_tokyo.png',
    catThumb: 'images/cats/cat_tokyo_thumb.png',
    shareAccent: '#FF9671',
  },
  cat: {
    id: 'cat_tokyo',
    name: '樱丸',
    baseColor: '#F7F7F7',
    pattern: 'solid',
    accessory: '铃铛',
  },
  passport: {
    stampId: 'stamp_tokyo',
    stampLabel: '东京',
  },
  elements: [
    { id: 'tokyo_01', name: '东京塔', category: 'landmark', rarity: 'core', image: 'images/elements/tokyo/tokyo_01.png', tags: ['tower'] },
    { id: 'tokyo_02', name: '鸟居', category: 'landmark', rarity: 'core', image: 'images/elements/tokyo/tokyo_02.png', tags: ['gate'] },
    { id: 'tokyo_03', name: '寿司', category: 'food', rarity: 'core', image: 'images/elements/tokyo/tokyo_03.png', tags: ['rice'] },
    { id: 'tokyo_04', name: '拉面', category: 'food', rarity: 'core', image: 'images/elements/tokyo/tokyo_04.png', tags: ['noodle'] },
    { id: 'tokyo_05', name: '章鱼烧', category: 'food', rarity: 'core', image: 'images/elements/tokyo/tokyo_05.png', tags: ['snack'] },
    { id: 'tokyo_06', name: '招财猫', category: 'culture', rarity: 'core', image: 'images/elements/tokyo/tokyo_06.png', tags: ['lucky'] },
    { id: 'tokyo_07', name: '浮世绘', category: 'culture', rarity: 'core', image: 'images/elements/tokyo/tokyo_07.png', tags: ['art'] },
    { id: 'tokyo_08', name: '和服扇', category: 'item', rarity: 'core', image: 'images/elements/tokyo/tokyo_08.png', tags: ['fan'] },
    { id: 'tokyo_09', name: '新干线票', category: 'item', rarity: 'core', image: 'images/elements/tokyo/tokyo_09.png', tags: ['ticket'] },
    { id: 'tokyo_10', name: '樱花', category: 'nature', rarity: 'core', image: 'images/elements/tokyo/tokyo_10.png', tags: ['flower'] },
    { id: 'tokyo_11', name: '富士山', category: 'nature', rarity: 'core', image: 'images/elements/tokyo/tokyo_11.png', tags: ['mountain'] },
    { id: 'tokyo_12', name: '锦鲤', category: 'nature', rarity: 'core', image: 'images/elements/tokyo/tokyo_12.png', tags: ['fish'] },
  ],
  levelPresets: createLevelPresets(12000),
  shareCard: {
    titleUnlocked: '我解锁了东京猫！',
    titlePassport: '东京护照盖章完成',
  },
}

export default tokyo
