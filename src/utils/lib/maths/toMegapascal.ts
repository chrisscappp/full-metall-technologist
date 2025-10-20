import { decimalPlacesCount } from '@/utils/consts/calculate'

// кгс/мм2 в мегапаскали
export const kgsToMegapascal = (value: number) => {
	return Number((value * 9.80665).toFixed(decimalPlacesCount))
}
