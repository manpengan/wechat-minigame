function getLevelEntries(levelProgress = {}) {
  return Object.values(levelProgress)
}

export function projectCityProgress(city, playerState) {
  const levelProgress = playerState.levelProgress[city.id] ?? {}
  const levels = getLevelEntries(levelProgress)
  const completedLevels = levels.filter((level) => level.completed).length
  const totalStars = levels.reduce((sum, level) => sum + (level.stars ?? 0), 0)
  const totalLevels = city.levelPresets.length
  const isUnlocked = playerState.unlockedCities.includes(city.id)
  const isCompleted = totalLevels > 0 && completedLevels >= totalLevels

  return {
    cityId: city.id,
    completedLevels,
    totalLevels,
    totalStars,
    isUnlocked,
    isCompleted,
    isCollected: playerState.collectedCats.includes(city.id),
    hasPassportStamp: playerState.passportStamps.includes(city.id),
  }
}

export function projectCityCardView(city, playerState) {
  const progress = projectCityProgress(city, playerState)

  return {
    cityId: city.id,
    name: city.display.name,
    nameEn: city.display.nameEn,
    bgColor: city.display.bgColor,
    catImage: city.cover.catImage,
    catThumb: city.cover.catThumb,
    isUnlocked: progress.isUnlocked,
    isCompleted: progress.isCompleted,
    isCollected: progress.isCollected,
    completedLevels: progress.completedLevels,
    totalLevels: progress.totalLevels,
    totalStars: progress.totalStars,
  }
}

export default projectCityCardView
