import { MechanicalDetailInfo } from '@/components/MechanicalDetail'

export interface CrimpingFormParams extends MechanicalDetailInfo {
	up_init_diameter: number,                    // Диаметр в.р.с
    mid_init_diameter: number,                   // Диаметр с.р.с
    down_init_diameter: number,                  // Диаметр н.р.с 
    up_init_thin: number,                        // Толщина в.р.с
    mid_init_thin: number,                       // Толщина с.р.с
    down_init_thin: number,                      // Толщина н.р.с
    allow_thin: number,                          // Допуск на толщину
    strength_limit: number,                      // Предел прочности
    yield_strength: number,                      // Предел текучести
    relative_uniform_contraction: number,        // Относительное равномерное сужение
    ramp_height: number,                         // Высота ската
    angle_a: number,                             // Угол альфа
    angle_b: number,                             // Угол бэта
    angle_a_after_first: number,                 // Угол альфа после 1-ой операции  
    coeff_of_stock: number                       // Коэф. запаса устойчивости
}

export interface CrimpingCalculateOperationData {
    coeff_of_crimping: number,                // Коэф. обжима
    thin_of_cromk: number,                    // Толщина кромки заготовки
    diameter_dulca: number,                   // Диаметр дульца
    angle_a: number,                          // Угол альфа
    executive_diameter_of_matrix: number,     // Исполнительные размеры матрицы
    allowance_for_wear_of_matrix: number,     // Припуск за износ матрицы
    elastic_unloading: number,                // Упругая разгрузка
    inaccuracy_tolerance: number,             // Допуск на неточность
    skat_height: number,                      // Высота ската
    median_diameter: number,                  // Диаметр в срединном сечении
    circle_radius: number,                    // Радиус скругления
    diameter_of_crimping_rod: number          // Диаметр обжимного стержня
    tech_strength: number                     // Тех. сила
}

export interface CrimpingCalculateResult {
	operationsCount: number,                      // Кол-во операций
    degree_of_deformation: number,                // Коэф. деформации
    result_coeff_of_crimping: number,             // Итоговый коэф. обжима
	limit_coeff_of_crimping: number,              // Предельный коэф. обжима
    operationsData: CrimpingCalculateOperationData[]
}
