import { createLevelPresets } from '../shared/level-presets.js'

export const singapore = {
  id: 'singapore',
  contentVersion: 1,
  continentId: 'asia',
  countryId: 'singapore_country',
  regionId: null,
  sortOrder: 5,
  unlockAfterCityId: 'istanbul',
  bundle: {
    packId: 'asia-rest',
    preload: 'on-city-page',
  },
  display: {
    name: '新加坡',
    nameEn: 'Singapore',
    bgColor: '#00A896',
    tagline: '海湾花园看猫猫',
    funFact: '新加坡是花园城市国家',
  },
  cover: {
    catImage: 'images/cats/cat_singapore.png',
    catThumb: 'images/cats/cat_singapore_thumb.png',
    shareAccent: '#02C39A',
  },
  cat: {
    id: 'cat_singapore',
    name: '狮喵',
    baseColor: '#F2C078',
    pattern: 'calico',
    accessory: '小狮鬃',
  },
  passport: {
    stampId: 'stamp_singapore',
    stampLabel: '新加坡',
  },
  elements: [
    { id: 'singapore_01', name: '鱼尾狮', category: 'landmark', rarity: 'core', image: 'images/elements/singapore/singapore_01.png', tags: ['statue'] },
    { id: 'singapore_02', name: '金沙酒店', category: 'landmark', rarity: 'core', image: 'images/elements/singapore/singapore_02.png', tags: ['hotel'] },
    { id: 'singapore_03', name: '叻沙', category: 'food', rarity: 'core', image: 'images/elements/singapore/singapore_03.png', tags: ['noodle'] },
    { id: 'singapore_04', name: '辣椒螃蟹', category: 'food', rarity: 'core', image: 'images/elements/singapore/singapore_04.png', tags: ['crab'] },
    { id: 'singapore_05', name: '咖椰吐司', category: 'food', rarity: 'core', image: 'images/elements/singapore/singapore_05.png', tags: ['toast'] },
    { id: 'singapore_06', name: '娘惹花砖', category: 'culture', rarity: 'core', image: 'images/elements/singapore/singapore_06.png', tags: ['tile'] },
    { id: 'singapore_07', name: '小红点贴纸', category: 'culture', rarity: 'core', image: 'images/elements/singapore/singapore_07.png', tags: ['badge'] },
    { id: 'singapore_08', name: '冰淇淋三明治车', category: 'item', rarity: 'core', image: 'images/elements/singapore/singapore_08.png', tags: ['cart'] },
    { id: 'singapore_09', name: '组屋钥匙', category: 'item', rarity: 'core', image: 'images/elements/singapore/singapore_09.png', tags: ['key'] },
    { id: 'singapore_10', name: '兰花', category: 'nature', rarity: 'core', image: 'images/elements/singapore/singapore_10.png', tags: ['flower'] },
    { id: 'singapore_11', name: '榴莲', category: 'nature', rarity: 'core', image: 'images/elements/singapore/singapore_11.png', tags: ['fruit'] },
    { id: 'singapore_12', name: '雨树', category: 'nature', rarity: 'core', image: 'images/elements/singapore/singapore_12.png', tags: ['tree'] },
  ],
  levelPresets: createLevelPresets(15000),
  shareCard: {
    titleUnlocked: '我解锁了新加坡猫！',
    titlePassport: '新加坡护照盖章完成',
  },
}

export default singapore
