import { decimalPlacesCount } from '@/utils/consts/calculate'
import { CrimpingCalculateOperationData, CrimpingCalculateResult, CrimpingFormParams } from '../types/crimping'
import { ctg } from '@/utils/lib/maths/ctg'

type CalculateRelativeThinCoeffParams = Pick<CrimpingFormParams, 'coeff_of_stock' | 'angle_a' | 'angle_b'> & {
	difference_walls: number
}

const calculateRelativeThinCoeff = (params: CalculateRelativeThinCoeffParams) => {
	const { coeff_of_stock, angle_a, angle_b, difference_walls } = params
	
	const angle_difference = angle_a - angle_b
	
	const first = ((coeff_of_stock * 1.25) / (1 - (0.5 * difference_walls)))
	const second_1 = 0.125 * Math.tan(angle_difference * (3.14 / 180))
	const second_2 = (Math.tan((angle_difference / 2) * (3.14 / 180))) / (6 * Math.cos(angle_difference * (3.14 / 180)))

	return Number((first * Math.pow((second_1 + second_2), 2)).toFixed(10))
}

interface CalculateCrimpingOperationsCountResult {
	operations: CrimpingCalculateOperationData[],
	operationsCount: number
}
const calculateCrimpingOperationsCount = (firstOperation: CrimpingCalculateOperationData, params: CrimpingFormParams, difference_walls: number, initAngle: number): CalculateCrimpingOperationsCountResult => {
	// Некий коэфициент для расчета пред. коэф. обжима
	const coeff = Number((1.5 * (params.strength_limit / Math.pow(1 - params.relative_uniform_contraction, 2)) * (1.35 - 2 * params.relative_uniform_contraction) * Math.pow(params.up_init_thin / params.down_init_diameter, 1 / 2) * Math.sin(initAngle * (3.14 / 180))).toFixed(decimalPlacesCount))
	// Критич. предел прочности
	const critical_strength_limit = Number(((params.yield_strength + params.strength_limit) / 2).toFixed(decimalPlacesCount))

	const operations = [firstOperation]
	let operationsCount = 1
	// Угол бета
	let new_angle_b = params.angle_b

	var operationIndex = 0
	for (var newAngle = initAngle; newAngle > 0; newAngle *= 0.6) {
		new_angle_b = new_angle_b * 0.5
		// Коэф.обжима
		const coeffOfFirstCrimp = Number((1 - ((params.ramp_height / operations[operationIndex].diameter_dulca) * Math.tan(newAngle * (3.14 / 180)))).toFixed(decimalPlacesCount))
		// Предельный коэф. обжима
		const limit_coeff_of_crimping = Number((2 * (1 - params.relative_uniform_contraction) - Math.pow((Math.pow(1 - 2 * params.relative_uniform_contraction, 2) + ( (1.6 * critical_strength_limit * Math.cos(initAngle * (3.14 / 180)) - coeff * Math.pow(1 - params.relative_uniform_contraction, 2)) / (params.strength_limit * (1 + 0.12 * ctg(initAngle)) * (3 - 2 * Math.cos(initAngle * (3.14 / 180)))) )), 1 / 2)).toFixed(decimalPlacesCount))
		//console.log('jopa', result_coeff_of_crimping, limit_coeff_of_crimping)
		if (!(coeffOfFirstCrimp >= limit_coeff_of_crimping)) {
			return { operations: [], operationsCount: 0 }
		}
		// Толщина кромки заготовки
		const thinOfCromk = Number((operations[operationIndex].thin_of_cromk / Math.pow(coeffOfFirstCrimp, 1 / 2)).toFixed(decimalPlacesCount))
		// Диаметр дульца
		const diameter_dulca = Number((coeffOfFirstCrimp * operations[operationIndex].diameter_dulca).toFixed(decimalPlacesCount))
		// Коэф для проверки S1 D1
		const coeffForEqual = thinOfCromk / diameter_dulca
		// Показатель разностенности
		const secondRelativeThinCoeff = calculateRelativeThinCoeff({
			angle_a: newAngle,
			angle_b: new_angle_b,
			coeff_of_stock: params.coeff_of_stock,
			difference_walls
		})

		if (coeffForEqual < secondRelativeThinCoeff) {
			operationsCount += 1
			operations.push({
				coeff_of_crimping: coeffOfFirstCrimp,
				diameter_dulca: diameter_dulca,
				limit_coeff_of_crimping,
				thin_of_cromk: thinOfCromk,
				angle_a: Number(newAngle),
				angle_b: new_angle_b,
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
			const lastCoeffOfCrimping = Number((params.up_init_diameter / operations[operationIndex].diameter_dulca).toFixed(decimalPlacesCount))
			// Толщина кромки заготовки
			const lastThinOfCromk = Number((operations[operationIndex].thin_of_cromk / Math.pow(lastCoeffOfCrimping, 1 / 2)).toFixed(decimalPlacesCount))
			operationsCount += 1
			operations.push({
				coeff_of_crimping: lastCoeffOfCrimping,
				diameter_dulca: params.up_init_diameter,
				limit_coeff_of_crimping,
				thin_of_cromk: lastThinOfCromk,
				angle_a: Number(params.angle_a),
				angle_b: params.angle_b,
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

	return { operations, operationsCount }
}

const calculateCrimpingOperationsData = (params: CrimpingFormParams) => {
	const {
		angle_a, angle_b, coeff_of_stock, yield_strength,
		up_init_diameter, down_init_diameter, up_init_thin,
		ramp_height, relative_uniform_contraction, strength_limit, allow_thin
	} = params
	
	// Операции
	const result: CrimpingCalculateResult = {
		operationsCount: 0,
		operationsData: [],
		degree_of_deformation: Number((Math.log(1 / (up_init_diameter / down_init_diameter))).toFixed(decimalPlacesCount))
	}
	// Относительная толщина
	const relative_thin = Number((up_init_thin / down_init_diameter).toFixed(decimalPlacesCount))
	// Показатель разностенности
	const difference_walls = (up_init_thin - (up_init_thin - allow_thin)) / ((up_init_thin + (up_init_thin - allow_thin)) / 2)

	// Первый коэф. + проверка с отн. толщиной
	const firstRelativeThinCoeff = calculateRelativeThinCoeff({
		angle_a,
		angle_b,
		coeff_of_stock,
		difference_walls
	})
	
	result.operationsCount += 1
	// Коэф. первого обжима
	const coeffOfFirstCrimp = Number((1 - ((ramp_height * Math.tan(angle_a * 0.6 * (3.14 / 180))) / down_init_diameter)).toFixed(decimalPlacesCount))
	// Толщина кромки заготовки
	const thinOfCromk = Number((up_init_thin / Math.pow(coeffOfFirstCrimp, 1 / 2)).toFixed(decimalPlacesCount))
	// Диаметр дульца
	const diameter_dulca = Number((coeffOfFirstCrimp * down_init_diameter).toFixed(decimalPlacesCount))
	// Некий коэфициент для расчета пред. коэф. обжима
	const coeff = Number((1.5 * (strength_limit / Math.pow(1 - relative_uniform_contraction, 2)) * (1.35 - 2 * relative_uniform_contraction) * Math.pow(up_init_thin / down_init_diameter, 1 / 2) * Math.sin(angle_a)).toFixed(decimalPlacesCount))
	// Критич. предел прочности
	const critical_strength_limit = Number(((yield_strength + strength_limit) / 2).toFixed(decimalPlacesCount))
	// Предельный коэф. обжима
	const limit_coeff_of_crimping = Number((2 * (1 - relative_uniform_contraction) - Math.pow((Math.pow(1 - 2 * relative_uniform_contraction, 2) + ( (1.6 * critical_strength_limit * Math.cos(angle_a * (3.14 / 180)) - coeff * Math.pow(1 - relative_uniform_contraction, 2)) / (strength_limit * (1 + 0.12 * ctg(angle_a)) * (3 - 2 * Math.cos(angle_a * (3.14 / 180)))) )), 1 / 2)).toFixed(decimalPlacesCount))
	// Итоговый коэф. обжима
	const result_coeff_of_crimping = Number((up_init_diameter / down_init_diameter).toFixed(decimalPlacesCount))

	result.operationsData.push({
		coeff_of_crimping: coeffOfFirstCrimp,
		thin_of_cromk:  thinOfCromk,
		limit_coeff_of_crimping,
		diameter_dulca,
		angle_a: Number(angle_a),
		angle_b,
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
	
	if (relative_thin >= firstRelativeThinCoeff && result_coeff_of_crimping >= limit_coeff_of_crimping) {
		return result
	}

	let operationsCountData: CalculateCrimpingOperationsCountResult = {
		operations: [],
		operationsCount: result.operationsCount
	}

	while (operationsCountData.operations.length === 0) {
		result.operationsData[0].angle_a *= 0.6
		result.operationsData[0].angle_b *= 0.5
		operationsCountData = calculateCrimpingOperationsCount(result.operationsData[0], params, difference_walls, result.operationsData[0].angle_a)
	}

	result.operationsData = operationsCountData.operations
	result.operationsCount = operationsCountData.operationsCount

	return result
}

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

export const newCalculateCrimping = (params: CrimpingFormParams) => {
	const operationsCountResult = calculateCrimpingOperationsData(params)
	const executiveDemensionsResult = calculateExecutiveDemesions(operationsCountResult, params)
	return executiveDemensionsResult
}
