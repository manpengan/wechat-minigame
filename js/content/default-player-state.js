export function createDefaultPlayerState() {
  return {
    saveVersion: 2,
    unlockedCities: ['beijing'],
    levelProgress: {},
    collectedCats: [],
    collectedMagnets: [],
    collectedStamps: [],
    cityTeam: {
      teamCityId: null,
      joinedDate: null,
      lastSwitchDate: null,
    },
    passportStamps: [],
    inventory: {
      undo: 3,
      remove: 1,
      shuffle: 1,
    },
    dailyChallenge: {
      date: '',
      completed: false,
      cityId: 'beijing',
      seed: 0,
    },
    adCooldowns: {
      interstitialCount: 0,
      lastInterstitialTime: 0,
      lastRewardDate: '',
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
    },
    stats: {
      totalGamesPlayed: 0,
      totalGamesWon: 0,
      totalShareCount: 0,
      firstPlayDate: '',
    },
  }
}

export default createDefaultPlayerState
