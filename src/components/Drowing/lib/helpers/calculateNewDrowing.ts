import { multiplyNumbers } from '@/utils/functions/multiplyNumbers'
import { CalculateOperationsCountResult, DrowingOperationDataV2, DrowingFormParams } from '../types/drowing'
import { decimalPlacesCount } from '@/utils/consts/calculate'
import { kvalitet6 } from '@/utils/functions/kvalitet'
import { findOptimalPairReplacement } from './findOptionalPairReplacement'
import { newtonToKilonewton } from '@/utils/functions/maths/toKilonewton'

const calculateOperationsCount = (params: DrowingFormParams) => {
	const { 
		fin_diameter, 
		init_diameter, 
		wall_thickness_down, 
		wall_thickness_us,
		coefficient_of_stock,
		max_pull_first_op,
		max_thin_first_op,
		max_pull_subsequent_op,
		max_thin_subsequent_op
	} = params

	const result: CalculateOperationsCountResult = {
		sumDrowingCoeff: 0,
		sumThinCoeff: 0,
		drowingCoeff: [],
		thinCoeff: [],
		operationsCount: 0
	}
		
	// Суммарный коэфф. вытяжки (mdz)
	const sumDrowingCoeff = Number((fin_diameter / init_diameter).toFixed(decimalPlacesCount))
	// Суммарный коэфф. утонения (msz)
	const sumThinCoeff = Number((wall_thickness_us / wall_thickness_down).toFixed(decimalPlacesCount))
		
	result.sumDrowingCoeff = sumDrowingCoeff
	result.sumThinCoeff = sumThinCoeff
		
	console.log('-----------------------------------------------')
	console.log('Сумм. коэф. вытяжки: ', sumDrowingCoeff, '\nСумм. коэф. утонения: ', sumThinCoeff)
	console.log('-----------------------------------------------')
		
	// Подсчет K*mdпред и К*msпред (K - коэф запаса) для первой проверки на коэфы
	const limitedDrowingCoeff_first_op = Number((coefficient_of_stock * max_pull_first_op).toFixed(decimalPlacesCount))
	const limitedThinCoeff_first_op = Number((coefficient_of_stock * max_thin_first_op).toFixed(decimalPlacesCount))
	console.log('Подсчет для первой операции')
	console.log('K*mdпред = ', limitedDrowingCoeff_first_op)
	console.log('К*msпред = ', limitedThinCoeff_first_op)
	console.log('-----------------------------------------------')

	// Если выполняется условие на первой итерации - значит нужна одна операция
	if (sumDrowingCoeff >= limitedDrowingCoeff_first_op && sumThinCoeff >= limitedThinCoeff_first_op) {
		result.drowingCoeff.push(limitedDrowingCoeff_first_op)
		result.thinCoeff.push(limitedThinCoeff_first_op)
		result.operationsCount += 1
		return result
	}

	result.operationsCount += 1 // Увеличиваем число вытяжек

	// Подсчет значений коэфов вытяжки и утонения для свертки (т.к. не одна операция)
	// Они равны limitedDrowingCoeff (mdсв) и limitedThinCoeff (msсв)
	// Следовательно используем их (в условии >= операциям свертки)
	// Свертка - делитель в знаменателе
	var drowing_for_equal = Number((coefficient_of_stock * max_pull_subsequent_op).toFixed(decimalPlacesCount))
	var thin_for_equal = Number((coefficient_of_stock * max_thin_subsequent_op).toFixed(decimalPlacesCount))
		
	result.drowingCoeff.push(limitedDrowingCoeff_first_op)
	result.thinCoeff.push(limitedThinCoeff_first_op)

	console.log('Подсчет операции свертки')
	console.log('Коэф. вытяжки для оп. свертки mdсв = ', limitedDrowingCoeff_first_op)
	console.log('Коэф. утон. для оп. свертки msсв = ', limitedThinCoeff_first_op)
	console.log('-----------------------------------------------')

	// Считаем коэфы вытяжки для 1-й вытяжки mdi и msi
	// Из них затем брать корни
	const drowingCoeffFirst = Number((sumDrowingCoeff / limitedDrowingCoeff_first_op).toFixed(decimalPlacesCount))
	const thinCoeffFirst = Number((sumThinCoeff / limitedThinCoeff_first_op).toFixed(decimalPlacesCount))

	console.log('Подсчет коэф. для 1-ой вытяжки mdi: ', drowingCoeffFirst)
	console.log('Подсчет коэф. для 1-ой вытяжки msi: ', thinCoeffFirst)
	console.log('-----------------------------------------------')

	// Двигаемся дальше. Сравниваем новый коэф с nextLimitedDrowingCoeff и nextLimitedThinCoeff
	var newDrowingCoeffFirst
	var newThinCoeffFirst

	for (var i = 0; i < 100; i++) {
		newDrowingCoeffFirst = Number(Math.pow(drowingCoeffFirst, 1 / (i+1)).toFixed(decimalPlacesCount))
		newThinCoeffFirst = Number(Math.pow(thinCoeffFirst, 1 / (i+1)).toFixed(decimalPlacesCount))

		if (newDrowingCoeffFirst >= drowing_for_equal && newThinCoeffFirst >= thin_for_equal) {
			result.drowingCoeff.push(newDrowingCoeffFirst)
			result.thinCoeff.push(newThinCoeffFirst)
			result.operationsCount += 1 // +1 учитываем свертку
			return result
		} else {
			result.drowingCoeff.push(newDrowingCoeffFirst)
			result.thinCoeff.push(newThinCoeffFirst)
			result.operationsCount += 1
		}
	}

	return result
}

// const normalizeOpertions = (opertionsResult: CalculateOperationsCountResult, maxDrowingCoeff: number, maxThinCoeff: number) => {
// 	const { 
// 		sumDrowingCoeff, 
// 		sumThinCoeff, 
// 		drowingCoeff: drowingCoeffArr, 
// 		thinCoeff: thinCoeffArr, 
// 		operationsCount
// 	} = opertionsResult

// 	console.log('Коэф. вытяжки до балансировки: ', drowingCoeffArr)
// 	console.log('Коэф. утонения до балансировки: ', thinCoeffArr)
// 	console.log('-----------------------------------------------')
// 	console.log('Суммарный коэф. вытяжки = ', sumDrowingCoeff)
// 	console.log('Суммарный коэф. утонения = ', sumThinCoeff)
// 	console.log('Предельный для вытяжки: ', maxDrowingCoeff)
// 	console.log('Предельный для утонения: ', maxThinCoeff)

// 	// 1 условие - коэфы должны быть больше предельных коэфов (maxDrowingCoeff and maxThinCoeff)
// 	// 2 условие - каждый последующий коэф должен быть больше предыдущего
// 	// 3 условие - произведение коэфов должно равняться sumDrowingCoeff и sumThinCoeff соответственно
	
// 	const initialMultiplyDrowingCoeff = multiplyNumbers(drowingCoeffArr)
// 	const initialMultiplyThinCoeff = multiplyNumbers(thinCoeffArr)
		
// 	if (initialMultiplyDrowingCoeff === maxDrowingCoeff && initialMultiplyThinCoeff === maxThinCoeff) {
// 		return opertionsResult
// 	}

// 	if (drowingCoeffArr.length === 1 || thinCoeffArr.length === 1) {
// 		return opertionsResult
// 	}

// 	if (!(drowingCoeffArr[0] > maxDrowingCoeff)) {
// 		drowingCoeffArr[0] = maxDrowingCoeff + 0.01
// 	}

// 	if (!(thinCoeffArr[0] > maxThinCoeff)) {
// 		drowingCoeffArr[0] = maxThinCoeff + 0.01
// 	} else if (thinCoeffArr[0] > 0.5) {
// 		thinCoeffArr[0] = 0.56
// 	}

// 	// назначаем второй коэф. как предельный
// 	drowingCoeffArr[1] = maxDrowingCoeff + 0.01
// 	thinCoeffArr[1] = maxThinCoeff + 0.01

// 	// проверяем, больше ли второй коэф. чем первый. иначе перезаписываем
// 	if (!(drowingCoeffArr[1] > drowingCoeffArr[0])) {
// 		const newCoeff = Number(((drowingCoeffArr[0] - drowingCoeffArr[1]) + drowingCoeffArr[1] + 0.01).toFixed(decimalPlacesCount))
// 		drowingCoeffArr[1] = newCoeff
// 	}

// 	// проверяем, больше ли второй коэф. чем первый. иначе перезаписываем
// 	if (!(thinCoeffArr[1] > thinCoeffArr[0])) {
// 		const newCoeff = Number(((thinCoeffArr[0] - thinCoeffArr[1]) + thinCoeffArr[1] + 0.01).toFixed(decimalPlacesCount))
// 		thinCoeffArr[1] = newCoeff
// 	}

// 	if (operationsCount === 2) {
// 		const firstDrowingCoeff = maxDrowingCoeff + 0.1
// 		const firstThinCoeff = maxThinCoeff + 0.1
// 		drowingCoeffArr[0] = firstDrowingCoeff
// 		drowingCoeffArr[1] = Number((sumDrowingCoeff / firstDrowingCoeff).toFixed(decimalPlacesCount))

// 		thinCoeffArr[0] = firstThinCoeff
// 		thinCoeffArr[1] = Number((sumThinCoeff / firstThinCoeff).toFixed(decimalPlacesCount))
		
// 		return {
// 			sumDrowingCoeff,
// 			sumThinCoeff,
// 			drowingCoeffArr,
// 			thinCoeffArr,
// 			operationsCount
// 		}
// 	}

// 	const indexFromLimited = Math.ceil(operationsCount / 2)

// 	drowingCoeffArr[indexFromLimited - 1] = Number((drowingCoeffArr[indexFromLimited - 2] + 0.01).toFixed(decimalPlacesCount))
// 	thinCoeffArr[indexFromLimited - 1] = Number((thinCoeffArr[indexFromLimited - 2] + 0.01).toFixed(decimalPlacesCount))

// 	drowingCoeffArr[operationsCount - 1] = 0.99
// 	thinCoeffArr[operationsCount - 1] = 0.8
// 	for (var i = operationsCount - 1; i > indexFromLimited; i--) {
// 		drowingCoeffArr[i - 1] = drowingCoeffArr[i] - 0.01
// 		thinCoeffArr[i - 1] = thinCoeffArr[i] - 0.01
// 	}

// 	var newMultiplyDrowing
// 	var newMultiplyThin

// 	console.log('-----------------------------------------------')
// 	console.log('Коэф. вытяжки после предварительной балансировки: ', drowingCoeffArr)
// 	console.log('Коэф. утонения после предварительной балансировки: ', thinCoeffArr)

// 	let operataionsCountForBreak = 1
// 	while (true) {
// 		var isCorrectDrowing = false
// 		var isCorrectThin = false
// 		newMultiplyDrowing = multiplyNumbers(drowingCoeffArr)
// 		newMultiplyThin = multiplyNumbers(thinCoeffArr)

// 		if (newMultiplyDrowing === sumDrowingCoeff) {
// 			isCorrectDrowing = true
// 		}

// 		if (newMultiplyThin === sumThinCoeff) {
// 			isCorrectThin = true
// 		}

// 		if (isCorrectDrowing && isCorrectThin) {
// 			break
// 		}

// 		for (let i = 1; i < indexFromLimited; i++) {
// 			if (!isCorrectDrowing) drowingCoeffArr[i] += 0.01
// 			if (!isCorrectThin) thinCoeffArr[i] += 0.01
// 		}

// 		operataionsCountForBreak++
// 		if (operataionsCountForBreak === 100) break
// 	}

// 	console.log('-----------------------------------------------')
// 	console.log('Коэф. вытяжки после балансировки: ', drowingCoeffArr)
// 	console.log('Коэф. утонения после балансировки: ', thinCoeffArr)
// }

const normalizeOpertionsV2 = (opertionsResult: CalculateOperationsCountResult, maxDrowingCoeff: number, maxThinCoeff: number) => {
	const { 
		sumDrowingCoeff, 
		sumThinCoeff, 
		drowingCoeff: drowingCoeffArr, 
		thinCoeff: thinCoeffArr, 
		operationsCount
	} = opertionsResult

	console.log('Коэф. вытяжки до балансировки: ', drowingCoeffArr)
	console.log('Коэф. утонения до балансировки: ', thinCoeffArr)
	console.log('-----------------------------------------------')
	console.log('Суммарный коэф. вытяжки = ', sumDrowingCoeff)
	console.log('Суммарный коэф. утонения = ', sumThinCoeff)
	console.log('Предельный для вытяжки: ', maxDrowingCoeff)
	console.log('Предельный для утонения: ', maxThinCoeff)

	// 1 условие - коэфы должны быть больше предельных коэфов (maxDrowingCoeff and maxThinCoeff)
	// 2 условие - каждый последующий коэф должен быть больше предыдущего
	// 3 условие - произведение коэфов должно равняться sumDrowingCoeff и sumThinCoeff соответственно
	
	const oldDrowingCoeffArr = [...drowingCoeffArr]
	const oldThinCoeffArr = [...thinCoeffArr]
	const initialMultiplyDrowingCoeff = multiplyNumbers(drowingCoeffArr)
	const initialMultiplyThinCoeff = multiplyNumbers(thinCoeffArr)
		
	if (initialMultiplyDrowingCoeff === maxDrowingCoeff && initialMultiplyThinCoeff === maxThinCoeff) {
		return opertionsResult
	}

	if (drowingCoeffArr.length === 1 || thinCoeffArr.length === 1) {
		return opertionsResult
	}

	if (!(drowingCoeffArr[0] > maxDrowingCoeff)) {
		drowingCoeffArr[0] = maxDrowingCoeff + 0.01
	}

	if (!(thinCoeffArr[0] > maxThinCoeff)) {
		drowingCoeffArr[0] = maxThinCoeff + 0.01
	} else if (thinCoeffArr[0] > 0.5) {
		thinCoeffArr[0] = 0.56
	}

	// назначаем второй коэф. как предельный
	drowingCoeffArr[1] = maxDrowingCoeff + 0.01
	thinCoeffArr[1] = maxThinCoeff + 0.01

	// проверяем, больше ли второй коэф. чем первый. иначе перезаписываем
	if (!(drowingCoeffArr[1] > drowingCoeffArr[0])) {
		const newCoeff = Number(((drowingCoeffArr[0] - drowingCoeffArr[1]) + drowingCoeffArr[1] + 0.01).toFixed(decimalPlacesCount))
		drowingCoeffArr[1] = newCoeff
	}

	// проверяем, больше ли второй коэф. чем первый. иначе перезаписываем
	if (!(thinCoeffArr[1] > thinCoeffArr[0])) {
		const newCoeff = Number(((thinCoeffArr[0] - thinCoeffArr[1]) + thinCoeffArr[1] + 0.01).toFixed(decimalPlacesCount))
		thinCoeffArr[1] = newCoeff
	}

	if (operationsCount === 2) {
		const firstDrowingCoeff = maxDrowingCoeff + 0.1
		const firstThinCoeff = maxThinCoeff + 0.1
		drowingCoeffArr[0] = firstDrowingCoeff
		drowingCoeffArr[1] = Number((sumDrowingCoeff / firstDrowingCoeff).toFixed(decimalPlacesCount))

		thinCoeffArr[0] = firstThinCoeff
		thinCoeffArr[1] = Number((sumThinCoeff / firstThinCoeff).toFixed(decimalPlacesCount))
		
		return {
			sumDrowingCoeff,
			sumThinCoeff,
			drowingCoeffArr,
			thinCoeffArr,
			operationsCount
		}
	}

	for (var i = 2; i < operationsCount; i++) {
		drowingCoeffArr[i] = Number((drowingCoeffArr[i - 1] + 0.01).toFixed(decimalPlacesCount))
	}

	const newDrowingArr = findOptimalPairReplacement(drowingCoeffArr, opertionsResult.sumDrowingCoeff)
	const newThinArr = findOptimalPairReplacement(thinCoeffArr, opertionsResult.sumThinCoeff)

	// old - до балансировки
	if (newDrowingArr) {
		opertionsResult.drowingCoeff = newDrowingArr
	} else {
		opertionsResult.drowingCoeff = oldDrowingCoeffArr
	}

	// old - до балансировки
	if (newThinArr) {
		opertionsResult.thinCoeff = newThinArr
	} else {
		opertionsResult.thinCoeff = oldThinCoeffArr
	}

	// const indexFromLimited = Math.ceil(operationsCount / 2)

	// thinCoeffArr[indexFromLimited - 1] = Number((thinCoeffArr[indexFromLimited - 2] + 0.01).toFixed(decimalPlacesCount))

	// thinCoeffArr[operationsCount - 1] = 0.8
	// for (var i = operationsCount - 1; i > indexFromLimited; i--) {
	// 	thinCoeffArr[i - 1] = thinCoeffArr[i] - 0.01
	// }

	// var newMultiplyThin

	// let operataionsCountForBreak = 1
	// while (true) {
	// 	var isCorrectThin = false
	// 	newMultiplyThin = multiplyNumbers(thinCoeffArr)

	// 	if (newMultiplyThin === sumThinCoeff) {
	// 		isCorrectThin = true
	// 	}

	// 	if (isCorrectThin) {
	// 		break
	// 	}

	// 	for (let i = 1; i < indexFromLimited; i++) {
	// 		if (!isCorrectThin) thinCoeffArr[i] += 0.01
	// 	}

	// 	operataionsCountForBreak++
	// 	if (operataionsCountForBreak === 100) break
	// }

	console.log('-----------------------------------------------')
	console.log('Коэф. вытяжки после балансировки: ', newDrowingArr)
	console.log('Коэф. утонения после балансировки: ', thinCoeffArr)
}

export const calculateDrawingOperationsCountV2 = (params: DrowingFormParams) => {
	const operationsResult = calculateOperationsCount(params)
	//normalizeOpertions(operationsResult, Number(params.max_pull_subsequent_op), Number(params.max_thin_subsequent_op))

	normalizeOpertionsV2(operationsResult, Number(params.max_pull_subsequent_op), Number(params.max_thin_subsequent_op))
	console.log('normalizeOpertionsV2', operationsResult)
	return operationsResult
}

const calculateExecutiveDimensionsHob = (value: number) => {
	const tdn = kvalitet6(value)
    const pp = -tdn * 0.5
    return Number((value + pp - (value * 0.01) + tdn).toFixed(decimalPlacesCount))
} 

export const calculateDrawingOperationsDataV2 = (params: DrowingFormParams, operationsCountResult: CalculateOperationsCountResult) => {
	const operations: DrowingOperationDataV2[] = [] 

	// Инициализация первой операции (свертки)
	// Средний диаметр заготовки в верх. расчетном сечении
	const roll_median_diameter_us = Number((params.init_diameter * operationsCountResult.drowingCoeff[0]).toFixed(decimalPlacesCount))
	// Толщина стенки в верх. расчетном сечении
	const roll_wall_thin_us = Number((params.wall_thickness_us * operationsCountResult.thinCoeff[0]).toFixed(decimalPlacesCount))
	// Наружный диаметр заготовки
	const roll_outside_diameter = Number((roll_median_diameter_us + roll_wall_thin_us).toFixed(decimalPlacesCount))
	// Относительное изменение площади поперечного сечения заготовки в верх. сечении
	const roll_area_changes_us = Number((1 - (operationsCountResult.drowingCoeff[0] * operationsCountResult.thinCoeff[0])).toFixed(decimalPlacesCount))
	// Внутренний диаметр заготовки в верхнем сечении
	const roll_inside_diameter_us = Number((roll_median_diameter_us - roll_wall_thin_us).toFixed(decimalPlacesCount))
	// Радиус сопряжения внутренних поверхностей
	const roll_radius = 1.0 * params.wall_thickness_us
	// Расстояние нижнего расчетного сечения от внутр. поверхности дна
	const roll_distance_ls_us = Number((roll_radius * (1 - 0.017)).toFixed(decimalPlacesCount))
	// Расстояние верхнего расчетного сечения от внутр. поверхности дна
	const roll_distance_us_us = Number((roll_distance_ls_us + (((params.init_diameter * params.init_diameter - roll_outside_diameter * roll_outside_diameter) * params.wall_thickness_us) / (4 * roll_median_diameter_us * roll_wall_thin_us))).toFixed(decimalPlacesCount))
	// Внутренний диаметр заготовки в нижнем расчетном сечении
	const roll_inside_diameter_ls = Number((roll_inside_diameter_us - 2 * 0.017 * (roll_distance_us_us - roll_distance_ls_us)).toFixed(decimalPlacesCount))
	// Толщина стенки в нижнем расчетном сечении
	const roll_wall_thin_ls = Number(((roll_outside_diameter - roll_inside_diameter_ls) / 2).toFixed(decimalPlacesCount))
	// Толщина дна заготовки
	const roll_bottom_thin = 1.0 * params.wall_thickness_us 
	// Высота сферической части
	const roll_sphere_part_height = Number(((roll_outside_diameter + roll_radius) / 6).toFixed(decimalPlacesCount))
	// Радиус вытяжной кромки матрицы
	const roll_matrix_radius = 2 * params.wall_thickness_us
	// Высота заготовки
	const roll_height = roll_bottom_thin + roll_distance_us_us

	operations.push({
		median_diameter_us: roll_median_diameter_us, // Средний диаметр заготовки в верх. расчетном сечении
		wall_thin_us: roll_wall_thin_us, // Толщина стенки в верх. расчетном сечении
		outside_diameter: roll_outside_diameter, // Наружный диаметр заготовки
		area_changes_us: roll_area_changes_us, // Относительное изменение площади поперечного сечения заготовки в верх. сечении
		inside_diameter_us: roll_inside_diameter_us, // Внутренний диаметр заготовки в верхнем сечении
		radius: roll_radius, // Радиус сопряжения внутренних поверхностей
		distance_ls_us: roll_distance_ls_us, // Расстояние нижнего расчетного сечения от внутр. поверхности дна
		distance_us_us: roll_distance_us_us, // Расстояние верхнего расчетного сечения от внутр. поверхности дна
		inside_diameter_ls: roll_inside_diameter_ls, // Внутренний диаметр заготовки в нижнем расчетном сечении
		wall_thin_ls: roll_wall_thin_ls, // Толщина стенки в нижнем расчетном сечении
		bottom_thin: roll_bottom_thin, // Толщина дна заготовки
		sphere_part_height: roll_sphere_part_height, // Высота сферической части
		matrix_radius: roll_matrix_radius, // Радиус вытяжной кромки матрицы
		height: roll_height, // Высота заготовки
		executive_dimensions_matrix: 0, // Исполнительные размеры матрицы
		elastic_unloading: 0, // Упругая разгрузка
		total_elastic_deform_unload: 0, // Суммарная упругая деформация и разгрузка
		elastic_deformation_matrix: 0, // Упругая деформация матрицы
		executive_dimensions_hob_us: 0, // Исполнительные размеры пуансона (верх)
		executive_dimensions_hob_ls: 0, // Исполнительные размеры пуансона (низ)
		degree_deformation_us: 0, // Степень деформации (верх)
		degree_deformation_ls: 0, // Степень деформации (низ),
		amount_of_effort_hub: 0, // Величина усилия снятия заготовки с пуансона
		deformation_power: 0, // Сила деформирования
		lower_area_hub: 0, // Площадь нижнего расчетного сечения пуансона
		specific_force: 0 // Удельное усилие
	})
	
	// Радиус может расти (см. толщину стенки в верхнем сечении)
	const delta_radius = Number(((operations[0].radius - params.rounding_radius) / (operationsCountResult.operationsCount - 1)).toFixed(decimalPlacesCount))
	// Нижнее сечение - считаем как в свертке
	for (let i = 1; i < operationsCountResult.operationsCount; i++) {
		// Срединный диаметр
		const median_diameter_us = Number((operationsCountResult.drowingCoeff[i] * operations[i - 1].median_diameter_us).toFixed(decimalPlacesCount))
		// Толщина стенки в верхнем сечении
		const wall_thin_us = Number((operationsCountResult.thinCoeff[i] * operations[i - 1].wall_thin_us).toFixed(decimalPlacesCount))
		// Наружный диаметр заготовки
		const outside_diameter = Number((median_diameter_us + wall_thin_us).toFixed(decimalPlacesCount))
		// Относительное изменение площади поперечного сечения заготовки в верх. сечении
		const area_changes_us = Number((1 - (operationsCountResult.drowingCoeff[i] * operationsCountResult.thinCoeff[i])).toFixed(decimalPlacesCount))
		// Внутренний диаметр заготовки в верхнем сечении
		const inside_diameter_us = Number((outside_diameter - (2 * wall_thin_us)).toFixed(decimalPlacesCount))
		// Радиус сопряжения внутренних поверхностей
		const radius = Number((operations[i - 1].radius - delta_radius).toFixed(decimalPlacesCount))
		// Расстояние нижнего расчетного сечения от внутр. поверхности дна
		const distance_ls_us = Number((radius * (1 - 0.017)).toFixed(decimalPlacesCount))
		// Расстояние верхнего расчетного сечения от внутр. поверхности дна (пересчет)
		const distance_us_us = Number((distance_ls_us + (((operations[i - 1].outside_diameter * operations[i - 1].outside_diameter - outside_diameter * outside_diameter) * wall_thin_us) / (4 * median_diameter_us * wall_thin_us))).toFixed(decimalPlacesCount))
		// Внутренний диаметр заготовки в нижнем расчетном сечении
		const inside_diameter_ls = Number((inside_diameter_us - 2 * 0.017 * (distance_us_us - distance_ls_us)).toFixed(decimalPlacesCount))
		// Толщина стенки в нижнем расчетном сечении
		const wall_thin_ls = Number(((outside_diameter - inside_diameter_ls) / 2).toFixed(decimalPlacesCount))
		// Толщина дна заготовки
		const bottom_thin = 1.0 * roll_bottom_thin
		// Высота сферической части (для вытяжки убрать)
		const sphere_part_height = Number(((outside_diameter + radius) / 6).toFixed(decimalPlacesCount))
		// Радиус вытяжной кромки матрицы
		const matrix_radius = 2 * wall_thin_us

		operations[i] = {
			median_diameter_us,
			wall_thin_us,
			outside_diameter,
			area_changes_us,
			inside_diameter_us,
			radius,
			distance_ls_us,
			distance_us_us,
			inside_diameter_ls,
			wall_thin_ls,
			bottom_thin,
			sphere_part_height,
			matrix_radius,
			height: 0,
			executive_dimensions_matrix: 0,
			elastic_unloading: 0,
			elastic_deformation_matrix: 0,
			total_elastic_deform_unload: 0,
			executive_dimensions_hob_us: 0,
			executive_dimensions_hob_ls: 0,
			degree_deformation_ls: 0,
			degree_deformation_us: 0,
			amount_of_effort_hub: 0,
			deformation_power: 0,
			lower_area_hub: 0,
			specific_force: 0
		}
	}

	for (var i = operationsCountResult.operationsCount - 1; i > 0; i--) {
		if (i !== operationsCountResult.operationsCount - 1) {
			// Коэф. уменьешния толщины стенки на i итерации
			//const coeff_of_decrease_first = Number((operations[i].wall_thin_us / operations[i].wall_thin_ls).toFixed(decimalPlacesCount))
			// Коэф. уменьешния толщины стенки на i + 1 итерации
			//const coeff_of_decrease_second = Number((operations[i + 1].wall_thin_us / operations[i + 1].wall_thin_ls).toFixed(decimalPlacesCount))
			// Коэф. изменения высоты
			//const coeff_of_height_change = Number((operationsCountResult.thinCoeff[i] * ((1 + coeff_of_decrease_second) / (1 + coeff_of_decrease_first))).toFixed(decimalPlacesCount))
			// Высота заготовки
			const height = Number((operations[i].bottom_thin + operations[i].distance_us_us + (operations[i + 1].height - operations[i + 1].distance_us_us - operations[i + 1].bottom_thin) * (operationsCountResult.drowingCoeff[i + 1] * operationsCountResult.thinCoeff[i + 1])).toFixed(decimalPlacesCount))
			
			operations[i] = {
				...operations[i],
				height: Number(height)
			}
		} else {
			operations[i] = {
				...operations[i],
				height: Number(params.fin_height)
			}
		}
	}

	for (var i = 0; i < operationsCountResult.operationsCount; i++) {
		// Упругая разгрузка
		const elastic_unloading = 0.006 * ((operations[i].wall_thin_us + operations[i].wall_thin_ls) / 2.0)
		// Упругая деформация матрицы
		const elastic_deformation_matrix = Number((0.02 * operations[i].outside_diameter).toFixed(decimalPlacesCount))
		// Исполнительные размеры матрицы
		const executive_dimensions_matrix = Number((operations[i].outside_diameter - (elastic_deformation_matrix + elastic_unloading) - kvalitet6(operations[i].outside_diameter)).toFixed(decimalPlacesCount))
		// Суммарная упругая деформация и разгрузка
		const total_elastic_deform_unload = Number((elastic_deformation_matrix + elastic_unloading).toFixed(decimalPlacesCount))
		// Исполнительные размеры пуансона (верх)
		const executive_dimensions_hob_us = calculateExecutiveDimensionsHob(Number((operations[i].outside_diameter - 2.0 * operations[i].wall_thin_us).toFixed(decimalPlacesCount)))
		// Исполнительные размеры пуансона (низ)
		const executive_dimensions_hob_ls = calculateExecutiveDimensionsHob(Number((operations[i].outside_diameter - 2.0 * operations[i].wall_thin_ls).toFixed(decimalPlacesCount)))
		// Степень деформации (верх)
		const degree_deformation_us = Number(((2 / Math.pow(3, 1/2)) * Math.log(1.0 / (operationsCountResult.drowingCoeff[i] * operationsCountResult.thinCoeff[i]))).toFixed(decimalPlacesCount))
		// Степень деформации (низ)
		const degree_deformation_ls = Number(((2 / Math.pow(3, 1/2)) * Math.log(1.0 / (operations[i].wall_thin_ls / params.wall_thickness_us) + operationsCountResult.drowingCoeff[i])).toFixed(decimalPlacesCount))

		// Расчет технологических усилий при вытяжке с утонением
		// Удельное усилие (q) (620 - заменить на соот МПа материала)
		const specific_force = Number(((Math.pow(3, 1/2) / 2) * 620 * operations[0].degree_deformation_ls * (2.2 * Math.pow(0.99 - 1, 2) + (0.12 / 0.02))).toFixed(decimalPlacesCount))
		// Площадь нижнего расчетного сечения пуансона (Fпв)
		const lower_area_hub = Number(((3.14 * Math.pow(operations[i].outside_diameter - operations[i].inside_diameter_ls, 2)) / 4).toFixed(decimalPlacesCount))
		// Сила деформирования (Р)
		const deformation_power = newtonToKilonewton(specific_force * lower_area_hub)
		// Величина усилия снятия заготовки с пуансона (Pc)
		const amount_of_effort_hub = Number((3.14 * 0.65 * 0.85 * ((650 + 620) / 2) * operations[0].wall_thin_us * (operations[0].height - operations[0].wall_thin_us) * 0.12 ).toFixed(decimalPlacesCount))

		operations[i] = {
			...operations[i],
			elastic_unloading,
			elastic_deformation_matrix,
			executive_dimensions_matrix,
			total_elastic_deform_unload,
			executive_dimensions_hob_us,
			executive_dimensions_hob_ls,
			degree_deformation_us,
			degree_deformation_ls,
			specific_force,
			lower_area_hub,
			deformation_power,
			amount_of_effort_hub
		}
	}

	return operations
}
