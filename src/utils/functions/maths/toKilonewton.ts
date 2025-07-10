import { decimalPlacesCount } from '@/utils/consts/calculate'

// тонны в килоньютоны
export const tonneToKilonewton = (value: number) => {
	return Number((value * 9.803922).toFixed(decimalPlacesCount))
}

// килоньютоны в тонны
export const kilonewtonToTonne = (value: number) => {
	return Number((value * 0.1019716).toFixed(0))
}

// килоньютоны в килограммы
export const kilonewtonToKilogramms = (value: number) => {
	return Number((value * 101.97).toFixed(0))
} 

// ньютоны в килоньютоны
export const newtonToKilonewton = (value: number) => {
	return Number((value / 1000).toFixed(decimalPlacesCount))
}
