use serde_json::Value;
use umya_spreadsheet::*;

// Итоговый результат
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct FellingCalculationResult {
    pub mass: f64, // Масса полуфабриката
	pub thin: f64, // Толщина 
    pub diameter: f64, // Диаметр
	pub insideMatrixDiameter: f64, // Диаметр наружный матрицы
    pub operatorName: String, // Исполнитель
    pub organizationName: String, // Предприятие
    pub date: String, // Дата и время
    pub material: String, // Материал
    pub detailName: String, // Название детали
    pub cutting: String, // Раскрой
    pub width: f64, // Рекомендуемая ширина ленты
    pub listWidth: f64,  // Ширина листа
    pub bridge: f64, // Размер боковой перемычки
    pub step: f64, // Шаг раскроя
    pub bridge_ins: f64, // Размер внутренней перемычки
    pub using_koef: f64, // Коэфициент использования материала
    pub perimeter: f64, // Периметр вырубаемой детали
    pub fellingPower: f64, // Технологическая сила вырубки (Максимальное усилие вырубки)
    pub shearResistanceMedian: f64, // Сопротивление срезу
    pub effortDropInStripe: f64, // Усилие снятия с полосы
    pub pushingInEffort: f64, // Усилие проталкивания
    pub pushingOutEffort: f64, // Усилие выталкивания
    pub sumEffort: f64, // Суммарное усилие 
    pub criticalLoad: f64, // Критич. значение нагрузки 
    pub workingToolAllowance: f64, // Припуск на износ рабочего инструмента
    pub elasticDeformation: f64, // Упругая деформация
    pub workingToolValue_Matrix: Vec<f64>, // Исполнительные размеры матрицы
    pub workingToolValue_Puanson: Vec<f64>, // Исполнительные размеры пуансона
    pub areaOfSmallestSelection: f64, // Площадь наименьшего сечения
    pub compressionInDangerousSection: f64, // Напряжение сжатия в опасном сечении
    pub compressionInBendingPoint: f64, // Напряжение от изгиба в месте крепления
    pub matrixBendingStress: f64, // Напряжение изгиба матрицы
    pub matrixGapStress: f64, // Растягивающее напряжение матрицы 
    pub matrixDangerousArea: f64, // Площадь опасного сечения матрицы
}

#[tauri::command]
pub fn felling_excel_report(
    output_path: String,
    data: FellingCalculationResult,
) -> Result<(), String> {
    let mut book = reader::xlsx::read("assets/felling_report_template.xlsx").map_err(|e| e.to_string())?;

    let sheet = book.get_sheet_by_name_mut("Лист1").ok_or("Лист1 не найден")?;

    sheet.get_cell_mut("C4").set_value(data.organizationName);
    sheet.get_cell_mut("C5").set_value(data.operatorName);
    sheet.get_cell_mut("C6").set_value(data.date);

    sheet.get_cell_mut("C10").set_value(data.detailName);
    sheet.get_cell_mut("C11").set_value(data.material);

    sheet.get_cell_mut("F14").set_value(data.mass.to_string());
    sheet.get_cell_mut("F15").set_value(data.thin.to_string());
    sheet.get_cell_mut("F16").set_value(data.diameter.to_string());
    sheet.get_cell_mut("F17").set_value(data.cutting);
    sheet.get_cell_mut("F18").set_value(data.using_koef.to_string());
    sheet.get_cell_mut("F19").set_value(data.bridge.to_string());
    sheet.get_cell_mut("F20").set_value(data.bridge_ins.to_string());
    sheet.get_cell_mut("F21").set_value(data.fellingPower.to_string());
    sheet.get_cell_mut("F22").set_value("Криптонит");
    sheet.get_cell_mut("F23").set_value(data.compressionInDangerousSection.to_string());
    sheet.get_cell_mut("F24").set_value(data.matrixBendingStress.to_string());
    sheet.get_cell_mut("F25").set_value(data.matrixBendingStress.to_string());
    sheet.get_cell_mut("F26").set_value(data.insideMatrixDiameter.to_string());
    sheet.get_cell_mut("F27").set_value(data.matrixGapStress.to_string());

    writer::xlsx::write(&book, &output_path).map_err(|e| e.to_string())?;

    Ok(())
}