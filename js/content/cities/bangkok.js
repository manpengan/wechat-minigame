import { createLevelPresets } from '../shared/level-presets.js'

export const bangkok = {
  id: 'bangkok',
  contentVersion: 1,
  continentId: 'asia',
  countryId: 'thailand',
  regionId: null,
  sortOrder: 3,
  unlockAfterCityId: 'seoul',
  bundle: {
    packId: 'asia-rest',
    preload: 'on-city-page',
  },
  display: {
    name: '曼谷',
    nameEn: 'Bangkok',
    bgColor: '#F9A826',
    tagline: '热带夜市看猫猫',
    funFact: '曼谷是东南亚热门旅行城市',
  },
  cover: {
    catImage: 'images/cats/cat_bangkok.png',
    catThumb: 'images/cats/cat_bangkok_thumb.png',
    shareAccent: '#FFD166',
  },
  cat: {
    id: 'cat_bangkok',
    name: '泰泰',
    baseColor: '#D9C2A7',
    pattern: 'siamese',
    accessory: '花环',
  },
  passport: {
    stampId: 'stamp_bangkok',
    stampLabel: '曼谷',
  },
  elements: [
    { id: 'bangkok_01', name: '玉佛寺', category: 'landmark', rarity: 'core', image: 'images/elements/bangkok/bangkok_01.png', tags: ['temple'] },
    { id: 'bangkok_02', name: '佛塔', category: 'landmark', rarity: 'core', image: 'images/elements/bangkok/bangkok_02.png', tags: ['tower'] },
    { id: 'bangkok_03', name: '冬阴功', category: 'food', rarity: 'core', image: 'images/elements/bangkok/bangkok_03.png', tags: ['soup'] },
    { id: 'bangkok_04', name: '芒果糯米饭', category: 'food', rarity: 'core', image: 'images/elements/bangkok/bangkok_04.png', tags: ['dessert'] },
    { id: 'bangkok_05', name: '船面', category: 'food', rarity: 'core', image: 'images/elements/bangkok/bangkok_05.png', tags: ['noodle'] },
    { id: 'bangkok_06', name: '泰丝', category: 'culture', rarity: 'core', image: 'images/elements/bangkok/bangkok_06.png', tags: ['fabric'] },
    { id: 'bangkok_07', name: '泰拳手套', category: 'culture', rarity: 'core', image: 'images/elements/bangkok/bangkok_07.png', tags: ['sport'] },
    { id: 'bangkok_08', name: '嘟嘟车', category: 'item', rarity: 'core', image: 'images/elements/bangkok/bangkok_08.png', tags: ['vehicle'] },
    { id: 'bangkok_09', name: '椰子杯', category: 'item', rarity: 'core', image: 'images/elements/bangkok/bangkok_09.png', tags: ['drink'] },
    { id: 'bangkok_10', name: '莲花', category: 'nature', rarity: 'core', image: 'images/elements/bangkok/bangkok_10.png', tags: ['flower'] },
    { id: 'bangkok_11', name: '大象', category: 'nature', rarity: 'core', image: 'images/elements/bangkok/bangkok_11.png', tags: ['animal'] },
    { id: 'bangkok_12', name: '榴莲', category: 'nature', rarity: 'core', image: 'images/elements/bangkok/bangkok_12.png', tags: ['fruit'] },
  ],
  levelPresets: createLevelPresets(13000),
  shareCard: {
    titleUnlocked: '我解锁了曼谷猫！',
    titlePassport: '曼谷护照盖章完成',
  },
}

export default bangkok
