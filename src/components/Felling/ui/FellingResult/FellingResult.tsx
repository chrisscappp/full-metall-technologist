import { VStack } from '@/UI/Stack'
import { memo } from 'react'
import { FellingCalculateResult } from '../../lib/types/felling'
import { Text } from '@/UI/Text/Text'
import { classNames } from '@/utils/functions/classNames'

interface FellingResultProps {
	className?: string,
	result?: FellingCalculateResult
}

export const FellingResult = memo((props: FellingResultProps) => {
	
	const {
		className, 
		result
	} = props
	
	return (
		<VStack className={classNames('', {}, [className])} gap="12">
			<Text title="Результат" weight="weight_bold" />
			<Text text={
`1. Геометрич. параметры
Шаг раскроя: ${result?.step} мм
Рекомендуемая ширина ленты: ${result?.width} мм
Ширина листа: ${result?.listWidth} мм
Размер боковой перемычки: ${result?.bridge} мм
Размер внутренней перемычки: ${result?.bridge_ins} мм
Периметр вырубаемой детали: ${result?.perimeter} 
Коэфициент использования материала: ${result?.using_koef} %

2. Тех. силы
Тех. сила вырубки (Pmax): ${result?.fellingPower} кН
Усилие снятия с полосы: ${result?.effortDropInStripe} кН
Усилие проталкивания: ${result?.pushingInEffort} кН
Усилие выталкивания: ${result?.pushingOutEffort} кН
Суммарное усилие: ${result?.sumEffort} кН
Сопротивление срезу: ${result?.shearResistanceMedian} МПа
Критич. значение нагрузки: ${result?.criticalLoad} МПа
Упругая деформация: ${result?.elasticDeformation} мм

3. Исполнительные размеры инструмента
Припуск на износ рабочего инструмента: ${result?.workingToolAllowance} мм
Исполнительные размеры матрицы: ${result?.workingToolValue_Matrix[0]} мм, допуск ${result?.workingToolValue_Matrix[1]}
Исполнительные размеры пуансона: ${result?.workingToolValue_Puanson[0]} мм, допуск ${result?.workingToolValue_Puanson[1]}
Площадь наименьшего сечения: ${result?.areaOfSmallestSelection} мм2
Площадь опасного сечения матрицы: ${result?.matrixDangerousArea} мм2
Напряжение сжатия в опасном сечении: ${result?.compressionInDangerousSection} МПа
Напряжение от изгиба в месте крепления: ${result?.compressionInBendingPoint} МПа
Напряжение изгиба матрицы: ${result?.matrixBendingStress} МПа
Растягивающее напряжение матрицы: ${result?.matrixGapStress} МПа`} textPre/>
		</VStack>
	)
})
