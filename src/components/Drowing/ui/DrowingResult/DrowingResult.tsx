import { VStack } from '@/UI/Stack'
import { memo } from 'react'
import cls from './DrowingResult.module.scss'
import { Text } from '@/UI/Text/Text'
import { DrowingOperationDataV2 } from '../../lib/types/drowing'
import { classNames } from '@/utils/lib/classNames/classNames'
import { OpeningCard } from '@/UI/OpeningCard/OpeningCard'
import { drowingTabsConfig } from '../../lib/consts/drowing'

interface DrowingResultProps {
	className?: string,
	result: DrowingOperationDataV2[]
}

export const DrowingResult = memo((props: DrowingResultProps) => {
	
	const {
		className,
		result
	} = props
	
	return (
    	<VStack className={classNames('', {}, [className])} gap="12">
			<Text title="Данные по операциям" weight="weight_bold" size="size_s"/>
			<VStack max gap='16'>
          		{result.map((operation, index) => (
            		<OpeningCard
              			className={cls.operation}
              			key={`operation-${index}`}
              			mainContent={<Text className={cls.operationTitle} text={`Операция №${index + 1} ${index === 0 ? '(свертка)' : ''}`} weight="weight_bold"/>}
              			additionalContent={
                			<Text
                  				textPre
                  				text={`1. Размеры полуфабриката:
Средний диаметр заготовки в верх. расчетном сечении: ${operation.median_diameter_us} мм
Наружный диаметр: ${operation.outside_diameter} мм
Внутренний диаметр заготовки в верх. сечении: ${operation.inside_diameter_us} мм
Внутренний диаметр заготовки в нижн. сечении: ${operation.inside_diameter_ls} мм
Толщина стенки в верх. сечении: ${operation.wall_thin_us} мм
Толщина стенки в нижн. сечении: ${operation.wall_thin_ls} мм
Высота полуфабриката: ${operation.height} мм
Высота сферической части: ${operation.sphere_part_height} мм
Радиус вытяжной кромки матрицы: ${operation.matrix_radius} мм
Радиус сопряжения внутрн. поверхностей: ${operation.radius} мм
Толщина дна заготовки: ${operation.bottom_thin} мм
Расстояние верх. сечения от внутр. поверхности дна: ${operation.distance_us_us} мм
Расстояние нижн. сечения от внутр. поверхности дна: ${operation.distance_ls_us} мм
Отн. изменение площади поперечного сечения в верх. сечении: ${operation.area_changes_us}

2. Исполнительные размеры инструмента:
Исполнительные размеры матрицы: ${operation.executive_dimensions_matrix} мм
Исполнительные размеры пуансона (верх): ${operation.executive_dimensions_hob_us} мм
Исполнительные размеры пуансона (низ): ${operation.executive_dimensions_hob_ls} мм

3. Показатели степени деформации: 
Упругая разгрузка ${operation.elastic_unloading}
Упругая деформация матрицы: ${operation.elastic_deformation_matrix}
Суммарная упругая деформация и разгрузка: ${operation.total_elastic_deform_unload}
Степень деформации (верх): ${operation.degree_deformation_us}
Степень деформации (низ): ${operation.degree_deformation_ls}

4. Технологические усилия:
Удельное усилие: ${operation.specific_force} МПа
Площадь нижнего расчетного сечения пуансона: ${operation.lower_area_hub} мм2
Сила деформирования: ${operation.deformation_power} кН
Величина усилия снятия заготовки с пуансона: ${operation.amount_of_effort_hub} кгс/мм2
								`}
                			/>
              			}
            		/>
          		))}
        	</VStack>
			<div id={drowingTabsConfig.results.id} />
    	</VStack>
  	)
})
