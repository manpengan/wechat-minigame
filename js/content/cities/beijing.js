import { createLevelPresets } from '../shared/level-presets.js'

export const beijing = {
  id: 'beijing',
  contentVersion: 1,
  continentId: 'asia',
  countryId: 'china',
  regionId: 'north_china',
  sortOrder: 1,
  unlockAfterCityId: 'tokyo',
  bundle: {
    packId: 'main',
    preload: 'startup',
  },
  display: {
    name: '北京',
    nameEn: 'Beijing',
    bgColor: '#CC2936',
    tagline: '天安门前看猫猫',
    funFact: '北京是中国的历史文化名城',
  },
  cover: {
    catImage: 'images/cats/cat_beijing.png',
    catThumb: 'images/cats/cat_beijing_thumb.png',
    shareAccent: '#F6D365',
  },
  cat: {
    id: 'cat_beijing',
    name: '京京',
    baseColor: '#F28C28',
    pattern: 'tabby',
    accessory: '虎头帽',
  },
  passport: {
    stampId: 'stamp_beijing',
    stampLabel: '北京',
  },
  elements: [
    { id: 'beijing_01', name: '天安门', category: 'landmark', rarity: 'core', image: 'images/elements/beijing/beijing_01.png', tags: ['gate', 'red'] },
    { id: 'beijing_02', name: '鸟巢', category: 'landmark', rarity: 'core', image: 'images/elements/beijing/beijing_02.png', tags: ['stadium'] },
    { id: 'beijing_03', name: '糖葫芦', category: 'food', rarity: 'core', image: 'images/elements/beijing/beijing_03.png', tags: ['sweet'] },
    { id: 'beijing_04', name: '烤鸭', category: 'food', rarity: 'core', image: 'images/elements/beijing/beijing_04.png', tags: ['duck'] },
    { id: 'beijing_05', name: '豆汁', category: 'food', rarity: 'core', image: 'images/elements/beijing/beijing_05.png', tags: ['drink'] },
    { id: 'beijing_06', name: '京剧脸谱', category: 'culture', rarity: 'core', image: 'images/elements/beijing/beijing_06.png', tags: ['opera'] },
    { id: 'beijing_07', name: '兔儿爷', category: 'culture', rarity: 'core', image: 'images/elements/beijing/beijing_07.png', tags: ['folk'] },
    { id: 'beijing_08', name: '毛笔', category: 'item', rarity: 'core', image: 'images/elements/beijing/beijing_08.png', tags: ['brush'] },
    { id: 'beijing_09', name: '铜锣', category: 'item', rarity: 'core', image: 'images/elements/beijing/beijing_09.png', tags: ['instrument'] },
    { id: 'beijing_10', name: '银杏叶', category: 'nature', rarity: 'core', image: 'images/elements/beijing/beijing_10.png', tags: ['leaf'] },
    { id: 'beijing_11', name: '玉兰花', category: 'nature', rarity: 'core', image: 'images/elements/beijing/beijing_11.png', tags: ['flower'] },
    { id: 'beijing_12', name: '白鸽', category: 'nature', rarity: 'core', image: 'images/elements/beijing/beijing_12.png', tags: ['bird'] },
  ],
  levelPresets: createLevelPresets(11000),
  shareCard: {
    titleUnlocked: '我解锁了北京猫！',
    titlePassport: '北京护照盖章完成',
  },
}

export default beijing
