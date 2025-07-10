import { MechanicalDetailInfo } from '@/components/MechanicalDetail'

export interface FellingFormParams extends MechanicalDetailInfo {
    mass: number,                                // Масса полуфабриката
    diameter: number,                            // Диаметр кружка
  	thin: number,                                // Толщина кружка
  	row_number: number,                          // Число рядов
    strength: number,                            // Прочность
    stripeCount: number,                         // Число полос
    coeffOfStock: number,                        // Коэф. запаса устойчивости
    lengthLoosePart: number,                     // Длина незакреп. части пуансона
    permissibleCompressionStress: number,        // Допускаемое напряжение на сжатие
    permissibleBendingStress: number,            // Допускаемое напряжение на изгиб
    permissibleGapStress: number,                // Допускаемое напряжение на разрыв
    diameterOfCylindricalBelt: number,           // Диаметр цилиндрического пояска
    diameterOfCircle: number,                    // Диаметр опорного кольца
    insideMatrixDiameter: number,                // Наружный диаметр матрицы
    thinOfMatrix: number                         // Толщина матрицы
}

export interface FellingCalculateParams extends FellingFormParams {
	  felling_type: string
}

export interface FellingCalculateResult {
    width: number,                               // Рекомендуемая ширина ленты
    listWidth: number,                           // Ширина листа
    bridge: number,                              // Размер боковой перемычки
    step: number,                                // Шаг раскроя
    bridge_ins: number,                          // Размер внутренней перемычки
    using_koef: number,                          // Коэфициент использования материала
    perimeter: number,                           // Периметр вырубаемой детали
    fellingPower: number,                        // Технологическая сила вырубки (Максимальное усилие вырубки)
    shearResistanceMedian: number,               // Сопротивление срезу
    effortDropInStripe: number,                  // Усилие снятия с полосы
    pushingInEffort: number,                     // Усилие проталкивания
    pushingOutEffort: number                     // Усилие выталкивания
    sumEffort: number,                           // Суммарное усилие 
    criticalLoad: number,                        // Критич. значение нагрузки 
    workingToolAllowance: number,                // Припуск на износ рабочего инструмента
    elasticDeformation: number                   // Упругая деформация
    workingToolValue_Matrix: number[],           // Исполнительные размеры матрицы
    workingToolValue_Puanson: number[]           // Исполнительные размеры пуансона
    areaOfSmallestSelection: number,             // Площадь наименьшего сечения
    compressionInDangerousSection: number,       // Напряжение сжатия в опасном сечении
    compressionInBendingPoint: number,           // Напряжение от изгиба в месте крепления
    matrixBendingStress: number,                 // Напряжение изгиба матрицы
    matrixGapStress: number,                     // Растягивающее напряжение матрицы 
    matrixDangerousArea: number                  // Площадь опасного сечения матрицы
}
