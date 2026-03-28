import { createLevelPresets } from '../shared/level-presets.js'

export const seoul = {
  id: 'seoul',
  contentVersion: 1,
  continentId: 'asia',
  countryId: 'korea',
  regionId: null,
  sortOrder: 4,
  unlockAfterCityId: 'singapore',
  bundle: {
    packId: 'asia-rest',
    preload: 'on-city-page',
  },
  display: {
    name: '首尔',
    nameEn: 'Seoul',
    bgColor: '#5C7AEA',
    tagline: '首尔夜景看猫猫',
    funFact: '首尔是东亚流行文化重镇',
  },
  cover: {
    catImage: 'images/cats/cat_seoul.png',
    catThumb: 'images/cats/cat_seoul_thumb.png',
    shareAccent: '#86A8E7',
  },
  cat: {
    id: 'cat_seoul',
    name: '韩韩',
    baseColor: '#B0B7C3',
    pattern: 'short-tail',
    accessory: '韩服小帽',
  },
  passport: {
    stampId: 'stamp_seoul',
    stampLabel: '首尔',
  },
  elements: [
    { id: 'seoul_01', name: '景福宫', category: 'landmark', rarity: 'core', image: 'images/elements/seoul/seoul_01.png', tags: ['palace'] },
    { id: 'seoul_02', name: '南山塔', category: 'landmark', rarity: 'core', image: 'images/elements/seoul/seoul_02.png', tags: ['tower'] },
    { id: 'seoul_03', name: '石锅拌饭', category: 'food', rarity: 'core', image: 'images/elements/seoul/seoul_03.png', tags: ['rice'] },
    { id: 'seoul_04', name: '韩式炸鸡', category: 'food', rarity: 'core', image: 'images/elements/seoul/seoul_04.png', tags: ['snack'] },
    { id: 'seoul_05', name: '海苔卷', category: 'food', rarity: 'core', image: 'images/elements/seoul/seoul_05.png', tags: ['roll'] },
    { id: 'seoul_06', name: '韩服', category: 'culture', rarity: 'core', image: 'images/elements/seoul/seoul_06.png', tags: ['dress'] },
    { id: 'seoul_07', name: 'K-pop话筒', category: 'culture', rarity: 'core', image: 'images/elements/seoul/seoul_07.png', tags: ['music'] },
    { id: 'seoul_08', name: '烧酒瓶', category: 'item', rarity: 'core', image: 'images/elements/seoul/seoul_08.png', tags: ['drink'] },
    { id: 'seoul_09', name: '太极旗扇', category: 'item', rarity: 'core', image: 'images/elements/seoul/seoul_09.png', tags: ['fan'] },
    { id: 'seoul_10', name: '银杏', category: 'nature', rarity: 'core', image: 'images/elements/seoul/seoul_10.png', tags: ['leaf'] },
    { id: 'seoul_11', name: '柿子', category: 'nature', rarity: 'core', image: 'images/elements/seoul/seoul_11.png', tags: ['fruit'] },
    { id: 'seoul_12', name: '松树', category: 'nature', rarity: 'core', image: 'images/elements/seoul/seoul_12.png', tags: ['tree'] },
  ],
  levelPresets: createLevelPresets(14000),
  shareCard: {
    titleUnlocked: '我解锁了首尔猫！',
    titlePassport: '首尔护照盖章完成',
  },
}

export default seoul
