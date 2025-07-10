import { CrimpingCalculateResult, CrimpingFormParams } from '../types/crimping'
import { decimalPlacesCount } from '@/utils/consts/calculate'

type CalculateRelativeThinCoeffParams = Pick<CrimpingFormParams, 'coeff_of_stock' | 'angle_a' | 'angle_b'> & {
	difference_walls: number
}

const calculateRelativeThinCoeff = (params: CalculateRelativeThinCoeffParams) => {
	const { coeff_of_stock, angle_a, angle_b, difference_walls } = params
	
	const angle_difference = angle_a - angle_b
	
	const first = ((coeff_of_stock * 1.25) / (1 - 0.5 * difference_walls))
	const second_1 = 0.125 * Math.tan(angle_difference * (3.14 / 180))
	const second_2 = (Math.tan((angle_difference / 2) * (3.14 / 180))) / (6 * Math.cos(angle_difference * (3.14 / 180)))

	return Number((first * Math.pow((second_1 + second_2), 2)).toFixed(10))
}

const calculateCrimpingOperationsCount = (params: CrimpingFormParams) => {
	const {
		angle_a, angle_a_after_first, angle_b, coeff_of_stock, yield_strength,
		up_init_diameter, down_init_diameter, up_init_thin,
		ramp_height, relative_uniform_contraction, strength_limit, allow_thin
	} = params
	
	// Операции
	const result: CrimpingCalculateResult = {
		operationsCount: 0,
		operationsData: [],
		degree_of_deformation: Number((Math.log(1 / (up_init_diameter / down_init_diameter))).toFixed(decimalPlacesCount)),
		result_coeff_of_crimping: 0,
		limit_coeff_of_crimping: 0
	}
	// Относительная толщина
	const relative_thin = Number((up_init_thin / down_init_diameter).toFixed(decimalPlacesCount))
	// Показатель разностенности
	const difference_walls = Number((up_init_thin - (up_init_thin - allow_thin) / ((up_init_thin - (up_init_thin - allow_thin) / 2))).toFixed(decimalPlacesCount))

	// Первый коэф. + проверка с отн. толщиной
	const firstRelativeThinCoeff = calculateRelativeThinCoeff({
		angle_a,
		angle_b,
		coeff_of_stock,
		difference_walls
	})
	console.log('Коэф. на первой проверке', relative_thin, firstRelativeThinCoeff)
	
	result.operationsCount += 1
	// Коэф. первого обжима
	const coeffOfFirstCrimp = Number((1 - ((ramp_height * Math.tan(angle_a_after_first * (3.14 / 180))) / down_init_diameter)).toFixed(decimalPlacesCount))
	// Толщина кромки заготовки
	const thinOfCromk = Number((up_init_thin / Math.pow(coeffOfFirstCrimp, 1 / 2)).toFixed(decimalPlacesCount))
	// Диаметр дульца
	const diameter_dulca = Number((coeffOfFirstCrimp * down_init_diameter).toFixed(decimalPlacesCount))

	result.operationsData.push({
		coeff_of_crimping: coeffOfFirstCrimp,
		thin_of_cromk:  thinOfCromk,
		diameter_dulca,
		angle_a: Number(angle_a),
		executive_diameter_of_matrix: 0,
		allowance_for_wear_of_matrix: 0,
		elastic_unloading: 0,
		inaccuracy_tolerance: 0.02,
		skat_height: 0,
		median_diameter: 0,
		circle_radius: 0,
		diameter_of_crimping_rod: 0,
		tech_strength: 0
	})
	
	// Итоговый коэф. обжима
	result.result_coeff_of_crimping = Number((up_init_diameter / down_init_diameter).toFixed(decimalPlacesCount))
	// Некий коэфициент для расчета пред. коэф. обжима
	const coeff = Number((1.5 * (strength_limit / Math.pow(1 - relative_uniform_contraction, 2)) * (1.35 - 2 * relative_uniform_contraction) * Math.pow(up_init_thin / down_init_diameter, 1 / 2) * Math.sin(angle_a)).toFixed(decimalPlacesCount))
	// Критич. предел прочности
	const critical_strength_limit = Number(((yield_strength + strength_limit) / 2).toFixed(decimalPlacesCount))
	// Предельный коэф. обжима
	result.limit_coeff_of_crimping = Number((2 * (1 - relative_uniform_contraction) - Math.pow((Math.pow(1 - 2 * relative_uniform_contraction, 2) + ( (1.6 * critical_strength_limit * Math.cos(angle_a * (3.14 / 180)) - coeff * Math.pow(1 - relative_uniform_contraction, 2)) / (strength_limit * (1 + 0.12 * ctg(angle_a)) * (3 - 2 * Math.cos(angle_a * (3.14 / 180)))) )), 1 / 2)).toFixed(decimalPlacesCount))

	if (relative_thin >= firstRelativeThinCoeff) {
		return result
	}

	result.operationsData[0].angle_a = angle_a_after_first

	var operationIndex = 0
	for (var newAngle = angle_a_after_first; newAngle > 0; newAngle--) {
		// Коэф. первого обжима
		const coeffOfFirstCrimp = Number((1 - ((ramp_height / result.operationsData[operationIndex].diameter_dulca) * Math.tan(newAngle * (3.14 / 180)))).toFixed(decimalPlacesCount))
		console.log('coeffOfFirstCrimp', coeffOfFirstCrimp)
		// Толщина кромки заготовки
		const thinOfCromk = Number((result.operationsData[operationIndex].thin_of_cromk / Math.pow(coeffOfFirstCrimp, 1 / 2)).toFixed(decimalPlacesCount))
		// Диаметр дульца
		const diameter_dulca = Number((coeffOfFirstCrimp * result.operationsData[operationIndex].diameter_dulca).toFixed(decimalPlacesCount))
		console.log('diameter_dulca', diameter_dulca)
		// Коэф для проверки S1 D1
		const coeffForEqual = thinOfCromk / diameter_dulca
		// Второй коэф. + проверка с отн. толщиной
		const secondRelativeThinCoeff = calculateRelativeThinCoeff({
			angle_a: newAngle,
			angle_b,
			coeff_of_stock,
			difference_walls
		})

		if (coeffForEqual < secondRelativeThinCoeff) {
			result.operationsCount += 1
			result.operationsData.push({
				coeff_of_crimping: coeffOfFirstCrimp,
				diameter_dulca: diameter_dulca,
				thin_of_cromk: thinOfCromk,
				angle_a: Number(newAngle),
				executive_diameter_of_matrix: 0,
				allowance_for_wear_of_matrix: 0,
				elastic_unloading: 0,
				inaccuracy_tolerance: 0.02,
				skat_height: 0,
				median_diameter: 0,
				circle_radius: 0,
				diameter_of_crimping_rod: 0,
				tech_strength: 0
			})
			operationIndex += 1
		} else {
			// Коэф. первого обжима
			const lastCoeffOfCrimping = params.up_init_diameter / result.operationsData[operationIndex].diameter_dulca
			// Толщина кромки заготовки
			const lastThinOfCromk = Number((result.operationsData[operationIndex].thin_of_cromk / Math.pow(lastCoeffOfCrimping, 1 / 2)).toFixed(decimalPlacesCount))
			// Диаметр дульца
			const lastDiameterDulca = Number((lastCoeffOfCrimping * result.operationsData[operationIndex].diameter_dulca).toFixed(decimalPlacesCount))
			result.operationsCount += 1
			result.operationsData.push({
				coeff_of_crimping: lastCoeffOfCrimping,
				diameter_dulca: lastDiameterDulca,
				thin_of_cromk: lastThinOfCromk,
				angle_a: Number(angle_a),
				executive_diameter_of_matrix: 0,
				allowance_for_wear_of_matrix: 0,
				elastic_unloading: 0,
				inaccuracy_tolerance: 0.02,
				skat_height: 0,
				median_diameter: 0,
				circle_radius: 0,
				diameter_of_crimping_rod: 0,
				tech_strength: 0
			})
			break
		}
	}

	// условие что Итоговый коэф. обжима >= Предельный коэф. обжима
	// если оно не выполняется, то операций больше чем 1

	return result
}

function ctg(x: number) { return 1 / Math.tan(x * (3.14 / 180)) }

const calculateExecutiveDemesions = (operationsCountResult: CrimpingCalculateResult, params: CrimpingFormParams) => {
	let operationIndex = 0
	for (var i = 0; i < operationsCountResult.operationsCount; i++) {
		if (i !== operationsCountResult.operationsCount - 1) {
			// Диаметр дульца
			//const diameter_dulca = operationsCountResult.operationsData[operationIndex].coeff_of_crimping * operationsCountResult.operationsData[operationIndex].diameter_dulca
			// Упругая разгрузка (в скобках - номинальный диаметр)
			const elastic_unloading = Number((0.0011 * (params.mid_init_diameter - 2 * params.mid_init_thin)).toFixed(decimalPlacesCount))
			// Припуск на износ матрицы
			const allowance_for_wear_of_matrix = 0.24
			// Исполнительные размеры матрицы (+0.02)
			const executive_diameter_of_matrix = (operationsCountResult.operationsData[operationIndex].diameter_dulca - allowance_for_wear_of_matrix - elastic_unloading)
			// Высота ската
			const skat_height = Number((((params.down_init_diameter - executive_diameter_of_matrix) / 2) * ctg(operationsCountResult.operationsData[i].angle_a)).toFixed(decimalPlacesCount))
			// Диаметр в среднем сечении ??? compas
			
			// Радиус скругления

			// Диаметр обжимного стержня

			operationsCountResult.operationsData[i] = {
				...operationsCountResult.operationsData[i],
				elastic_unloading,
				allowance_for_wear_of_matrix,
				executive_diameter_of_matrix,
				skat_height,
				circle_radius: Number(((params.mid_init_diameter - 2 * params.mid_init_thin) / 2).toFixed(decimalPlacesCount)),
				diameter_of_crimping_rod: Number((operationsCountResult.operationsData[operationIndex].diameter_dulca - 2 * operationsCountResult.operationsData[i].thin_of_cromk + 0.05).toFixed(decimalPlacesCount))
			}
		} else {
			// Диаметр дульца
			//const diameter_dulca = operationsCountResult.operationsData[operationIndex].coeff_of_crimping * operationsCountResult.operationsData[operationIndex].diameter_dulca
			// Упругая разгрузка
			const elastic_unloading = Number((0.01 * operationsCountResult.operationsData[operationIndex].diameter_dulca).toFixed(decimalPlacesCount))
			// Припуск на износ матрицы
			const allowance_for_wear_of_matrix = 0.24
			// Исполнительные размеры матрицы (+0.02)
			const executive_diameter_of_matrix = Number((operationsCountResult.operationsData[operationIndex].diameter_dulca - allowance_for_wear_of_matrix - elastic_unloading).toFixed(decimalPlacesCount))
			// Высота ската
			const skat_height = params.ramp_height
			// Диаметр в среднем сечении
			
			// Радиус скругления

			// Диаметр обжимного стержня

			operationsCountResult.operationsData[i] = {
				...operationsCountResult.operationsData[i],
				elastic_unloading,
				allowance_for_wear_of_matrix,
				executive_diameter_of_matrix,
				skat_height,
				circle_radius: Number((params.down_init_diameter / 2).toFixed(decimalPlacesCount)),
				diameter_of_crimping_rod: Number((operationsCountResult.operationsData[operationIndex].diameter_dulca - 2 * operationsCountResult.operationsData[i].thin_of_cromk + 0.05).toFixed(decimalPlacesCount))
			}
		}
		operationIndex += 1
	}

	for (var i = 0; i < operationsCountResult.operationsCount; i++) {
		// Предел текучести
		const limit = (params.strength_limit * (1 - 2 * params.relative_uniform_contraction)) / Math.pow(1 - params.relative_uniform_contraction, 2) 
		if (i === 0) {
			// Тех сила
			const tech_strength = Number((((3.14 * params.down_init_diameter * params.up_init_thin) / 2) * (limit + (3.14 / 2) * (1 - operationsCountResult.operationsData[i].coeff_of_crimping)) * ((1 - operationsCountResult.operationsData[i].coeff_of_crimping) * (1 + 0.18 * ctg(operationsCountResult.operationsData[i].angle_a)) + (Math.pow(operationsCountResult.operationsData[i].diameter_dulca / operationsCountResult.operationsData[i].thin_of_cromk, 1 / 2) * Math.sin(operationsCountResult.operationsData[i].angle_a * (3.14 / 180))))).toFixed(0))
			operationsCountResult.operationsData[i] = {
				...operationsCountResult.operationsData[i],
				tech_strength: tech_strength
			}
		} else {
			// Тех сила
			const tech_strength = Number((((3.14 * operationsCountResult.operationsData[i].diameter_dulca * operationsCountResult.operationsData[i].thin_of_cromk) / 2) * (limit + (3.14 / 2) * (1 - operationsCountResult.operationsData[i].coeff_of_crimping)) * ((1 - operationsCountResult.operationsData[i].coeff_of_crimping) * (1 + 0.18 * ctg(operationsCountResult.operationsData[i].angle_a)) + (Math.pow(operationsCountResult.operationsData[i].diameter_dulca / operationsCountResult.operationsData[i].thin_of_cromk, 1 / 2) * Math.sin(operationsCountResult.operationsData[i].angle_a * (3.14 / 180))))).toFixed(0))
			operationsCountResult.operationsData[i] = {
				...operationsCountResult.operationsData[i],
				tech_strength: tech_strength
			}
		}
	}

	return operationsCountResult
}

export const calculateCrimping = (params: CrimpingFormParams) => {
	const operationsCountResult = calculateCrimpingOperationsCount(params)
	const executiveDemensionsResult = calculateExecutiveDemesions(operationsCountResult, params)
	return executiveDemensionsResult
}
