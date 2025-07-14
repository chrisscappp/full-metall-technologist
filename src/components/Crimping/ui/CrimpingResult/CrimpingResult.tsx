import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { classNames } from '@/utils/functions/classNames'
import { memo } from 'react'
import { CrimpingCalculateResult } from '../../lib/types/crimping'
import { OpeningCard } from '@/UI/OpeningCard/OpeningCard'
import cls from './CrimpingResult.module.scss'
import { crimpingTabsConfig } from '../../lib/consts/crimpingTabs'

interface CrimpingResultProps {
	className?: string,
	crimpingData: CrimpingCalculateResult
}

export const CrimpingResult = memo((props: CrimpingResultProps) => {
	
	const { 
		crimpingData,
		className
	} = props
	
	return (
		<VStack className={classNames('', {}, [className])} gap="32">
			<Text title="Результат" weight="weight_bold"/>
			<VStack gap="12">
				<Text title="Результат расчёта количества операций" weight="weight_bold" size="size_s"/>
				<Text textPre text={`Количество операций: ${crimpingData.operationsCount}
Коэф. деформации: ${crimpingData.degree_of_deformation}`}/>
			</VStack>
			<VStack gap="12" max>
				<Text title="Данные по операциям" weight="weight_bold" size="size_s"/>
					{crimpingData.operationsData.map((operation, index) => (
						<OpeningCard
							className={cls.operation}
							key={`operation-${index}`}
							mainContent={<Text className={cls.operationTitle} text={`Операция №${index + 1}`} weight="weight_bold"/>}
							additionalContent={
								<Text
									  textPre
									  text={`1. Параметры заготовки:
Коэф. обжима: ${operation.coeff_of_crimping}
Предельный коэф. обжима: ${operation.limit_coeff_of_crimping}
Толщина кромки заготовки: ${operation.thin_of_cromk} мм
Диаметр дульца: ${operation.diameter_dulca} мм
Диаметр обжимного стержня: ${operation.diameter_of_crimping_rod} мм
Угол альфа: ${operation.angle_a}
Высота ската: ${operation.skat_height} мм
Радиус скругления: ${operation.circle_radius} мм

2. Исполнительные размеры инструмента:
Исполнительные размеры матрицы: ${operation.executive_diameter_of_matrix} мм
Припуск на износ матрицы: ${operation.allowance_for_wear_of_matrix} мм
Упргуая разгрузка: ${operation.elastic_unloading}
Допуск на неточность: ${operation.inaccuracy_tolerance} мм
Тех. сила: ${operation.tech_strength} Н
									`}
								/>
							  }
						/>
					))}
			</VStack>
			<div id={crimpingTabsConfig.results.id} />
		</VStack>
	)
})
