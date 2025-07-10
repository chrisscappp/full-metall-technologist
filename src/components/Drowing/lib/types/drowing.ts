import { MechanicalDetailInfo } from '@/components/MechanicalDetail'

export interface DrowingFormParams extends MechanicalDetailInfo {
	init_diameter: number,                // Начальный диаметр
	fin_diameter: number,                 // Конечный диаметр
	coefficient_of_stock: number,         // Коэффициент запаса
	coefficient_of_friction: number,      // Коэф. трения
    fin_volume: number,                   // Конечный объём
	max_pull_first_op: number,            // Предельный коэффициент вытяжки
	max_pull_subsequent_op: number,       // Для последующих операций
	max_thin_first_op: number,            // Предельный коэффициент утонения
	max_thin_subsequent_op: number,       // Для последующих операций
	wall_thickness_down: number,          // Толщина стенки дна заготовки (начальная толщина)
    wall_thickness_ls: number,            // Толщина стенки в нижнем сечении
	wall_thickness_us: number,            // Толщина стенки в верхнем сечении (конечная толщина)
    rounding_radius: number,              // Радиус скругления
    fin_height: number                    // Высота заготовки на последней операции
}

export interface DrowingCalculateResult {
	total_pull_coeff: number,             // Суммарный коэффициент вытяжки
    total_thin_coeff: number,             // Суммарный коэффициент утонения
    operations_required: number,          // Количество операций
    operations: DrowingOperationData[],   // Данные по каждой операции 
}

export interface DrowingOperationData {
	median_diameter: number,                // Срединный диаметр полуфабриката
    wall_thickness_us: number,              // Толщина стенки в верхнем сечении
    wall_thickness_ls: number,              // Толщина стенки в нижнем сечении
    outside_diameter: number,               // Наружный диаметр
    height: number,                         // Высота полуфабриката
    inside_diameter_us: number,             // Внутренний диаметр (верх)
    inside_diameter_ls: number,             // Внутренний диаметр (низ)
    pairing_radius: number,                 // Радиус сопряжения
    distance_bottomUs: number,              // Расстояние от дна
    elastic_deformation_matrix: number,     // Упругая деформация матрицы
    elastic_unloading: number,              // Упругая разгрузка
    total_elastic_deform_unload: number,    // Суммарная упругая деформация и разгрузка
    executive_dimensions_matrix: number,    // Исполнительные размеры матрицы
    executive_dimensions_hob_us: number,    // Исполнительные размеры пуансона (верх)
    executive_dimensions_hob_ls: number,    // Исполнительные размеры пуансона (низ)
    coefficient_thinning_ls: number,        // Коэффициент утонения (низ)
    degree_deformation_us: number,          // Степень деформации (верх)
    degree_deformation_ls: number,          // Степень деформации (низ)
}

export interface DrowingOperationDataV2 {
    median_diameter_us: number,              // Средний диаметр заготовки в верх. расчетном сечении
    wall_thin_us: number,                    // Толщина стенки в верх. расчетном сечении
    outside_diameter: number,                // Наружный диаметр заготовки
    area_changes_us: number,                 // Относительное изменение площади поперечного сечения заготовки в верх. сечении
    inside_diameter_us: number,              // Внутренний диаметр заготовки в верхнем сечении
    radius: number,                          // Радиус сопряжения внутренних поверхностей
    distance_ls_us: number,                  // Расстояние нижнего расчетного сечения от внутр. поверхности дна
    distance_us_us: number,                  // Расстояние верхнего расчетного сечения от внутр. поверхности дна
    inside_diameter_ls: number,              // Внутренний диаметр заготовки в нижнем расчетном сечении
    wall_thin_ls: number,                    // Толщина стенки в нижнем расчетном сечении
    bottom_thin: number,                     // Толщина дна заготовки
    sphere_part_height: number,              // Высота сферической части
    matrix_radius: number,                   // Радиус вытяжной кромки матрицы
    height: number,                          // Высота заготовки
    elastic_unloading: number,               // Упругая разгрузка
    elastic_deformation_matrix: number,      // Упругая деформация матрицы
    total_elastic_deform_unload: number,     // Суммарная упругая деформация и разгрузка
    executive_dimensions_matrix: number,     // Исполнительные размеры матрицы 
    executive_dimensions_hob_us: number,     // Исполнительные размеры пуансона (верх)
    executive_dimensions_hob_ls: number,     // Исполнительные размеры пуансона (низ)
    degree_deformation_us: number,           // Степень деформации (верх)
    degree_deformation_ls: number,           // Степень деформации (низ)
    specific_force: number,                  // Удельное усилие
    lower_area_hub: number,                  // Площадь нижнего расчетного сечения пуансона
    deformation_power: number,               // Сила деформирования
    amount_of_effort_hub: number,            // Величина усилия снятия заготовки с пуансона
}

export interface CalculateOperationsCountResult {
	sumDrowingCoeff: number,
	sumThinCoeff: number,
	drowingCoeff: number[],
	thinCoeff: number[],
	operationsCount: number
}
