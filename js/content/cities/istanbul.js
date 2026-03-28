import { createLevelPresets } from '../shared/level-presets.js'

export const istanbul = {
  id: 'istanbul',
  contentVersion: 1,
  continentId: 'asia',
  countryId: 'turkey',
  regionId: null,
  sortOrder: 6,
  unlockAfterCityId: null,
  bundle: {
    packId: 'asia-rest',
    preload: 'on-city-page',
  },
  display: {
    name: '伊斯坦布尔',
    nameEn: 'Istanbul',
    bgColor: '#7B2CBF',
    tagline: '海峡两岸看猫猫',
    funFact: '伊斯坦布尔横跨欧亚两洲',
  },
  cover: {
    catImage: 'images/cats/cat_istanbul.png',
    catThumb: 'images/cats/cat_istanbul_thumb.png',
    shareAccent: '#9D4EDD',
  },
  cat: {
    id: 'cat_istanbul',
    name: '蓝眸',
    baseColor: '#F5E6CC',
    pattern: 'angora',
    accessory: '恶魔之眼项圈',
  },
  passport: {
    stampId: 'stamp_istanbul',
    stampLabel: '伊斯坦布尔',
  },
  elements: [
    { id: 'istanbul_01', name: '蓝色清真寺', category: 'landmark', rarity: 'core', image: 'images/elements/istanbul/istanbul_01.png', tags: ['mosque'] },
    { id: 'istanbul_02', name: '加拉塔塔', category: 'landmark', rarity: 'core', image: 'images/elements/istanbul/istanbul_02.png', tags: ['tower'] },
    { id: 'istanbul_03', name: '土耳其红茶', category: 'food', rarity: 'core', image: 'images/elements/istanbul/istanbul_03.png', tags: ['tea'] },
    { id: 'istanbul_04', name: '烤肉串', category: 'food', rarity: 'core', image: 'images/elements/istanbul/istanbul_04.png', tags: ['meat'] },
    { id: 'istanbul_05', name: '土耳其冰淇淋', category: 'food', rarity: 'core', image: 'images/elements/istanbul/istanbul_05.png', tags: ['dessert'] },
    { id: 'istanbul_06', name: '旋转舞裙', category: 'culture', rarity: 'core', image: 'images/elements/istanbul/istanbul_06.png', tags: ['dance'] },
    { id: 'istanbul_07', name: '地毯纹样', category: 'culture', rarity: 'core', image: 'images/elements/istanbul/istanbul_07.png', tags: ['pattern'] },
    { id: 'istanbul_08', name: '恶魔之眼', category: 'item', rarity: 'core', image: 'images/elements/istanbul/istanbul_08.png', tags: ['amulet'] },
    { id: 'istanbul_09', name: '铜咖啡壶', category: 'item', rarity: 'core', image: 'images/elements/istanbul/istanbul_09.png', tags: ['pot'] },
    { id: 'istanbul_10', name: '郁金香', category: 'nature', rarity: 'core', image: 'images/elements/istanbul/istanbul_10.png', tags: ['flower'] },
    { id: 'istanbul_11', name: '石榴', category: 'nature', rarity: 'core', image: 'images/elements/istanbul/istanbul_11.png', tags: ['fruit'] },
    { id: 'istanbul_12', name: '海鸥', category: 'nature', rarity: 'core', image: 'images/elements/istanbul/istanbul_12.png', tags: ['bird'] },
  ],
  levelPresets: createLevelPresets(16000),
  shareCard: {
    titleUnlocked: '我解锁了伊斯坦布尔猫！',
    titlePassport: '伊斯坦布尔护照盖章完成',
  },
}

export default istanbul
