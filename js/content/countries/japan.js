/**
 * @deprecated 国家城市列表已移入 navigation/future-catalog.js
 */
import { asiaCountryPlan } from '../navigation/future-catalog.js'
export const japanCities = asiaCountryPlan.find(c => c.id === 'japan')
export default japanCities
