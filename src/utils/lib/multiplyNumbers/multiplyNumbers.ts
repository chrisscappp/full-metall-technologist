import { decimalPlacesCount } from '../../consts/calculate'

export const multiplyNumbers = (numbers: number[], placesCount: number = decimalPlacesCount) => {
	if (numbers.length === 0) {
		return 1
	}

	let result = 1

	for (let i = 0; i < numbers.length; i++) {
		result *= numbers[i]
	}

	return Number(result.toFixed(placesCount))
}
