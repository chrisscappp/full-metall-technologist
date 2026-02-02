import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { classNames } from '@/utils/lib/classNames/classNames'
import { memo } from 'react'
import { CrimpingCalculateResult } from '../../lib/types/crimping'
import { OpeningCard } from '@/UI/OpeningCard/OpeningCard'
import cls from './CrimpingResult.module.scss'

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
		<VStack className={classNames(cls.CrimpingResult, {}, [className])} gap="32" max>
			<Text title="Результат" size="size_l"/>
			<VStack gap="12">
				<Text title="Результат расчёта количества операций" size="size_s"/>
				<Text textPre size="size_s" text={`Количество операций: ${crimpingData.operationsCount}
Коэф. деформации: ${crimpingData.degree_of_deformation}`}/>
			</VStack>
			<VStack className={cls.operations} gap="32" max>
				<VStack gap="8" max>
					<Text title="Данные по операциям" size="size_s"/>
					<Text
						text="Полный расчет, а также генерация Excel-отчета"
						theme="secondary"
						size="size_s"
					/>
				</VStack>
				<VStack max gap='16'>
					{crimpingData.operationsData.map((operation, index) => (
						<OpeningCard
							className={cls.operation}
							key={`operation-${index}`}
							mainContent={<Text title={`Операция №${index + 1}`} size="size_s"/>}
							additionalContent={
								<Text
									  textPre
									  size="size_s"
									  text={`1. Параметры заготовки:
Коэф. обжима: ${operation.coeff_of_crimping}
Предельный коэф. обжима: ${operation.limit_coeff_of_crimping}
Толщина кромки заготовки: ${operation.thin_of_cromk} мм
Диаметр дульца: ${operation.diameter_dulca} мм
Диаметр обжимного стержня: ${operation.diameter_of_crimping_rod} мм
Угол альфа: ${operation.angle_a} гр.
Угол бета: ${operation.angle_b} гр.
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
			</VStack>
		</VStack>
	)
})
