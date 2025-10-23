import { DetailMaterialValue } from '@/components/SelectMaterial'
import { DrowingFormParams } from '../types/drowing'

export const initialParams: DrowingFormParams = {
	init_diameter: 160,                          // Начальный диаметр
	fin_diameter: 91.8,                          // Конечный диаметр
	coefficient_of_stock: 1.2,                   // Коэффициент запаса
	fin_volume: 21000,                           // Конечный объём
	max_pull_first_op: 0.48,   	                 // Предельный коэффициент вытяжки (ПКВ)
	max_pull_subsequent_op: 0.79,                // ПКВ для последующих операций (если больше 1 вытяжки)
	max_thin_first_op: 0.7,   	                 // Предельный коэффициент утонения (ПКУ)
	max_thin_subsequent_op: 0.5,                 // ПКУ для последующих операций (если больше 1 вытяжки)
	wall_thickness_ls: 1,   	                 // Толщина стенки в нижнем сечении
	wall_thickness_us: 0.5,   	                 // Толщина стенки в верхнем сечении
	wall_thickness_down: 1,
	rounding_radius: 2,                          // Радиус закругления
	fin_height: 100,                             // Высота на последней операции 
	coefficient_of_friction: 1,                  // Коэф. трения
	material: DetailMaterialValue.STEEL_10,      // Материал 
	operator_name: 'Вася',                       // Имя оператора
	organization_name: '"ЗАО" БЕЩЕКИ',           // Организация
	detail_name: 'Гильза мощная'                 // Наименование детали
}
