import { decimalPlacesCount } from '@/utils/consts/calculate'
import { FellingCalculateResult, FellingCalculateParams } from '../types/felling'
import { Felling } from '../consts/felling'
import { workingToolAllowanceCoeffs } from '@/utils/consts/workingToolAllowance'
import { kvalitet6 } from '@/utils/functions/kvalitet'
import { kgsToMegapascal } from '@/utils/functions/maths/toMegapascal'
import { kilonewtonToKilogramms, tonneToKilonewton } from '@/utils/functions/maths/toKilonewton'

interface CalculateBridgesResult {
	bridge: number,
	bridge_ins: number
}

const calculateBridges = (diameter: number, thin: number): CalculateBridgesResult => {
	if (thin >= 0 && thin <= 1.0) {
		if (diameter > 50.0) {
			return { bridge: 2.0, bridge_ins: 1.5 }
		} else {
			return { bridge: 1.5, bridge_ins: 1.0 }
		}
	}
	if (thin > 1.0 && thin <= 1.2) return { bridge: 1.8, bridge_ins: 1.2 }
	if (thin > 1.2 && thin <= 2.0) return { bridge: 2.0, bridge_ins: 1.5 }
	if (thin > 2.0 && thin <= 2.5) return { bridge: 2.3, bridge_ins: 1.8 }
	if (thin > 2.5 && thin <= 3.0) return { bridge: 2.5, bridge_ins: 2.0 }
	if (thin > 3.0 && thin <= 4.0) return { bridge: 3.0, bridge_ins: 2.5 }
	if (thin > 4.0 && thin <= 5.0) return { bridge: 4.0, bridge_ins: 3.0 }
	if (thin > 5.0 && thin <= 6.0) return { bridge: 4.5, bridge_ins: 3.5 }
	if (thin > 6.0 && thin <= 7.0) return { bridge: 5.0, bridge_ins: 4.0 }
	if (thin > 7.0 && thin <= 8.0) return { bridge: 5.5, bridge_ins: 4.5 }
	if (thin > 8.0 && thin <= 9.0) return { bridge: 6.0, bridge_ins: 5.0 }
	if (thin > 9.0) return { bridge: 7.0, bridge_ins: 6.0 }
	return { bridge: 7.0, bridge_ins: 6.0 }
}

const calculateUsingKoefOneline = (diameter: number, thin: number) => {
    return (100.0 * 0.785) / ((1.0 + thin / diameter) * (1.0 + 2.0 * (thin / diameter)))
}

const calculateUsingKoefCheckmate = (diameter: number, thin: number, row_number: number) => {
    const sqrt_3: number = Math.pow(3, 1 / 2)
    return (100.0 * 0.785) / (
        (1.0 + thin / diameter) * (
            (sqrt_3 / 2.0) 
            + (1.0 - (sqrt_3 / 2.0)) * (1.0 / row_number) 
            + (thin / diameter) * (
                (sqrt_3 / 2.0) 
                + (1.0 / row_number) * (2.0 - (sqrt_3 / 2.0))
            )
        )
    )
}

const calculateOnelineFelling = (params: FellingCalculateParams, bridge: number, bridge_ins: number): FellingCalculateResult | string => {
	const { 
		diameter, thin, stripeCount, strength, 
		lengthLoosePart, coeffOfStock, permissibleCompressionStress,
		diameterOfCircle, diameterOfCylindricalBelt, insideMatrixDiameter,
		permissibleBendingStress, permissibleGapStress, thinOfMatrix
	} = params
	const width = Number((diameter + 2.0 * bridge).toFixed(decimalPlacesCount))
	// Прочность сигма в
	const shearResistance = Number((0.08825 * strength).toFixed(decimalPlacesCount))
	// Сигма ср
	const shearResistanceMedian = Number((0.8 * shearResistance).toFixed(decimalPlacesCount))
	// Максимальное усилие вырубки
	const fellingPower = tonneToKilonewton(Number(((1.3 * 3.14 * diameter * shearResistanceMedian * thin) / 1000).toFixed(decimalPlacesCount)))
	// Усилие снятия с полосы
	const effortDropInStripe = 1 * fellingPower
	// Усилие проталкивания (0.05 const - изменить потом оператором)
	const pushingInEffort = Number((0.05 * 5 * fellingPower).toFixed(decimalPlacesCount))
	// Усилие выталкивания (0.07 const - изменить потом оператором)
	const pushingOutEffort = Number((0.07 * 5 * fellingPower).toFixed(decimalPlacesCount))
	// Суммарное усилие
	const sumEffort = fellingPower + pushingInEffort
	// Припуск на износ рабочего инструмента
	const workingToolAllowanceCoeffs_Z = workingToolAllowanceCoeffs(thin)
	const workingToolAllowanceCoeffs_T = kvalitet6(diameter)
	const workingToolAllowance = Number((workingToolAllowanceCoeffs_Z[1] - workingToolAllowanceCoeffs_Z[0] - (+workingToolAllowanceCoeffs_T) - workingToolAllowanceCoeffs_T).toFixed(decimalPlacesCount))
	// Величина упругой деформации (1.6 - задавать потом от материала)
	const elasticDeformation = Number(((0.01 * 1.6 * thin) + ((1.6 * Math.pow((workingToolAllowanceCoeffs_Z[0] + workingToolAllowanceCoeffs_Z[1]) / 4, 2)) / thin)).toFixed(decimalPlacesCount))
	// Исполнительные размеры рабоч. инструмента
	const workingToolValue_Matrix = [Number((diameter - workingToolAllowance - elasticDeformation).toFixed(decimalPlacesCount)), -workingToolAllowanceCoeffs_T]
	const workingToolValue_Puanson = [Number((workingToolValue_Matrix[0] - workingToolAllowanceCoeffs_Z[0]).toFixed(decimalPlacesCount)), workingToolAllowanceCoeffs_T]
	// Проверка пуансона на прочность
	// Площадь наименьшего сечения рабочей части пуансона
	const areaOfSmallestSelection = Number(((3.14 * diameter * diameter) / 4).toFixed(decimalPlacesCount))
	// Критическое значение нагрузки (2.467 и 2.1 потом меняется)
	const criticalLoad = kgsToMegapascal(Number(((2.467 * 2.1 * Math.pow(10, 4) * 0.05 * Math.pow(diameter, 4)) / Math.pow(lengthLoosePart, 2)).toFixed(decimalPlacesCount)))
	// Напряжение сжатия в опасном сечении
	const compressionInDangerousSection = kgsToMegapascal(Number((kilonewtonToKilogramms(fellingPower) / areaOfSmallestSelection).toFixed(decimalPlacesCount)))
	// Напряжение от изгиба в месте крепления
	const compressionInBendingPoint = Number((compressionInDangerousSection + kgsToMegapascal((kilonewtonToKilogramms(fellingPower) / (0.1 * Math.pow(diameter, 3))))).toFixed(decimalPlacesCount))
	// Для сравнения с Pmax
	const forEqual_Pmax = (1 / coeffOfStock) * criticalLoad

	if (!((diameter / thin) >= (5.2 * (shearResistanceMedian / permissibleCompressionStress)))) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	if (!(compressionInDangerousSection <= permissibleCompressionStress && compressionInBendingPoint <= permissibleCompressionStress && fellingPower <= forEqual_Pmax)) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	if (!(1 <= Math.pow(((2.467 * 2.2 * Math.pow(10, 4) * 0.05 * Math.pow(diameter, 4)) / (4 * coeffOfStock * fellingPower)), 1/2))) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	if (!((lengthLoosePart / diameter) <= (0.11 * Math.pow((diameter / thin), 1/2) * Math.pow(((2.2 * Math.pow(10, 4)) / shearResistanceMedian), 1/2)))) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	// Проверка матрицы на прочность
	// Напряжение изгиба
	const matrixBendingStress = kgsToMegapascal(Number((((2.5 * kilonewtonToKilogramms(fellingPower)) / Math.pow(thinOfMatrix, 2)) * (1 - ((2/3) * (diameterOfCylindricalBelt / diameterOfCircle)))).toFixed(decimalPlacesCount)))
	// Площадь опасного сечения матрицы
	const matrixDangerousArea = Number((thinOfMatrix * (insideMatrixDiameter - diameterOfCylindricalBelt)).toFixed(decimalPlacesCount))
	// Растягивающее напряжение
	const matrixGapStress = kgsToMegapascal((0.4 * kilonewtonToKilogramms(fellingPower)) / matrixDangerousArea)
	if (!(matrixBendingStress <= permissibleBendingStress && matrixGapStress <= permissibleGapStress)) {
		return 'Условие проверки матрицы на прочность не выполняется'
	}

	if (!(thinOfMatrix >= Math.pow((((2.5 * kilonewtonToKilogramms(fellingPower)) / permissibleBendingStress) * (1 - ((2/3) * (diameterOfCylindricalBelt / diameterOfCircle)))), 1 / 2))) {
		return 'Условие проверки матрицы на прочность не выполняется'
	}

	return {
		bridge,
		bridge_ins,
		step: diameter + bridge_ins,
		using_koef: Number((calculateUsingKoefOneline(diameter, thin)).toFixed(decimalPlacesCount)),
		width,
		listWidth: width * stripeCount,
		fellingPower: fellingPower,
		perimeter: Number(((3.14 * diameter * diameter) / 4).toFixed(decimalPlacesCount)),
		shearResistanceMedian: Number((kgsToMegapascal(shearResistanceMedian)).toFixed(decimalPlacesCount)),
		effortDropInStripe,
		pushingInEffort,
		pushingOutEffort,
		sumEffort,
		criticalLoad,
		workingToolAllowance,
		elasticDeformation,
		workingToolValue_Matrix,
		workingToolValue_Puanson,
		areaOfSmallestSelection,
		compressionInBendingPoint,
		compressionInDangerousSection,
		matrixBendingStress,
		matrixDangerousArea,
		matrixGapStress
	}
}

const calculateCheckmateFelling = (params: FellingCalculateParams, bridge: number, bridge_ins: number): FellingCalculateResult | string => {
	const { 
		diameter, thin, stripeCount, strength, 
		lengthLoosePart, coeffOfStock, permissibleCompressionStress,
		diameterOfCircle, diameterOfCylindricalBelt, insideMatrixDiameter,
		permissibleBendingStress, permissibleGapStress, thinOfMatrix, row_number
	} = params
	const sqrt_3: number = Math.pow(3, 1 / 2)
	
	const width = Number(((row_number - 1) * ((diameter + bridge_ins) / 2.0) * sqrt_3 + diameter + 2.0 * bridge - 0.5).toFixed(decimalPlacesCount))
	// Прочность сигма в
	const shearResistance = Number((0.08825 * strength).toFixed(decimalPlacesCount))
	// Сигма ср
	const shearResistanceMedian = Number((0.8 * shearResistance).toFixed(decimalPlacesCount))
	// Максимальное усилие вырубки
	const fellingPower = tonneToKilonewton(Number(((1.3 * 3.14 * diameter * shearResistanceMedian * thin) / 1000).toFixed(decimalPlacesCount)))
	// Усилие снятия с полосы
	const effortDropInStripe = 1 * fellingPower
	// Усилие проталкивания (0.05 const - изменить потом оператором)
	const pushingInEffort = Number((0.05 * 5 * fellingPower).toFixed(decimalPlacesCount))
	// Усилие выталкивания (0.07 const - изменить потом оператором)
	const pushingOutEffort = Number((0.07 * 5 * fellingPower).toFixed(decimalPlacesCount))
	// Суммарное усилие
	const sumEffort = fellingPower + pushingInEffort
	// Припуск на износ рабочего инструмента
	const workingToolAllowanceCoeffs_Z = workingToolAllowanceCoeffs(thin)
	const workingToolAllowanceCoeffs_T = kvalitet6(diameter)
	const workingToolAllowance = Number((workingToolAllowanceCoeffs_Z[1] - workingToolAllowanceCoeffs_Z[0] - (+workingToolAllowanceCoeffs_T) - workingToolAllowanceCoeffs_T).toFixed(decimalPlacesCount))
	// Величина упругой деформации (1.6 - задавать потом от материала)
	const elasticDeformation = Number(((0.01 * 1.6 * thin) + ((1.6 * Math.pow((workingToolAllowanceCoeffs_Z[0] + workingToolAllowanceCoeffs_Z[1]) / 4, 2)) / thin)).toFixed(decimalPlacesCount))
	// Исполнительные размеры рабоч. инструмента
	const workingToolValue_Matrix = [Number((diameter - workingToolAllowance - elasticDeformation).toFixed(decimalPlacesCount)), -workingToolAllowanceCoeffs_T]
	const workingToolValue_Puanson = [Number((workingToolValue_Matrix[0] - workingToolAllowanceCoeffs_Z[0]).toFixed(decimalPlacesCount)), workingToolAllowanceCoeffs_T]
	// Проверка пуансона на прочность
	// Площадь наименьшего сечения рабочей части пуансона
	const areaOfSmallestSelection = Number(((3.14 * diameter * diameter) / 4).toFixed(decimalPlacesCount))
	// Критическое значение нагрузки (2.467 и 2.1 потом меняется)
	const criticalLoad = kgsToMegapascal(Number(((2.467 * 2.1 * Math.pow(10, 4) * 0.05 * Math.pow(diameter, 4)) / Math.pow(lengthLoosePart, 2)).toFixed(decimalPlacesCount)))
	// Напряжение сжатия в опасном сечении
	const compressionInDangerousSection = kgsToMegapascal(Number((kilonewtonToKilogramms(fellingPower) / areaOfSmallestSelection).toFixed(decimalPlacesCount)))
	// Напряжение от изгиба в месте крепления
	const compressionInBendingPoint = Number((compressionInDangerousSection + kgsToMegapascal((kilonewtonToKilogramms(fellingPower) / (0.1 * Math.pow(diameter, 3))))).toFixed(decimalPlacesCount))
	// Для сравнения с Pmax
	const forEqual_Pmax = (1 / coeffOfStock) * criticalLoad

	if (!((diameter / thin) >= (5.2 * (shearResistanceMedian / permissibleCompressionStress)))) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	if (!(compressionInDangerousSection <= permissibleCompressionStress && compressionInBendingPoint <= permissibleCompressionStress && fellingPower <= forEqual_Pmax)) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	if (!(1 <= Math.pow(((2.467 * 2.2 * Math.pow(10, 4) * 0.05 * Math.pow(diameter, 4)) / (4 * coeffOfStock * fellingPower)), 1/2))) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	if (!((lengthLoosePart / diameter) <= (0.11 * Math.pow((diameter / thin), 1/2) * Math.pow(((2.2 * Math.pow(10, 4)) / shearResistanceMedian), 1/2)))) {
		return 'Условие проверки пуансона на прочность не выполняется'
	}

	// Проверка матрицы на прочность
	// Напряжение изгиба
	const matrixBendingStress = kgsToMegapascal(Number((((2.5 * kilonewtonToKilogramms(fellingPower)) / Math.pow(thinOfMatrix, 2)) * (1 - ((2/3) * (diameterOfCylindricalBelt / diameterOfCircle)))).toFixed(decimalPlacesCount)))
	// Площадь опасного сечения матрицы
	const matrixDangerousArea = Number((thinOfMatrix * (insideMatrixDiameter - diameterOfCylindricalBelt)).toFixed(decimalPlacesCount))
	// Растягивающее напряжение
	const matrixGapStress = kgsToMegapascal((0.4 * kilonewtonToKilogramms(fellingPower)) / matrixDangerousArea)
	if (!(matrixBendingStress <= permissibleBendingStress && matrixGapStress <= permissibleGapStress)) {
		return 'Условие проверки матрицы на прочность не выполняется'
	}

	if (!(thinOfMatrix >= Math.pow((((2.5 * kilonewtonToKilogramms(fellingPower)) / permissibleBendingStress) * (1 - ((2/3) * (diameterOfCylindricalBelt / diameterOfCircle)))), 1 / 2))) {
		return 'Условие проверки матрицы на прочность не выполняется'
	}

    return {
        width,
		listWidth: width * stripeCount,
        bridge,
        step: diameter + bridge_ins,
        bridge_ins,
        using_koef: Number(calculateUsingKoefCheckmate(diameter, thin, row_number).toFixed(decimalPlacesCount)),
		fellingPower: fellingPower, 
		perimeter: Number(((3.14 * diameter * diameter) / 4).toFixed(decimalPlacesCount)),
		shearResistanceMedian,
		effortDropInStripe,
		pushingInEffort,
		pushingOutEffort,
		sumEffort,
		areaOfSmallestSelection,
		compressionInBendingPoint,
		compressionInDangerousSection,
		criticalLoad,
		elasticDeformation,
		matrixBendingStress,
		matrixDangerousArea,
		matrixGapStress,
		workingToolAllowance,
		workingToolValue_Matrix,
		workingToolValue_Puanson
    }
}

export const calculateFellingV2 = (params: FellingCalculateParams) => {
	const { diameter, thin, felling_type } = params
	const { bridge, bridge_ins } = calculateBridges(diameter, thin)

	if (felling_type === Felling.ONE_LINE) {
		return calculateOnelineFelling(params, bridge, bridge_ins)
	} else {
		return calculateCheckmateFelling(params, bridge, bridge_ins)
	}
}
