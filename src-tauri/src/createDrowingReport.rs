use serde_json::Value;
use umya_spreadsheet::*;

// Данные по операции
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct DrowingOperationData {
	pub median_diameter_us: f64,              // Средний диаметр заготовки в верх. расчетном сечении
    pub wall_thin_us: f64,                    // Толщина стенки в верх. расчетном сечении
    pub outside_diameter: f64,                // Наружный диаметр заготовки
    pub area_changes_us: f64,                 // Относительное изменение площади поперечного сечения заготовки в верх. сечении
    pub inside_diameter_us: f64,              // Внутренний диаметр заготовки в верхнем сечении
    pub radius: f64,                          // Радиус сопряжения внутренних поверхностей
    pub distance_ls_us: f64,                  // Расстояние нижнего расчетного сечения от внутр. поверхности дна
    pub distance_us_us: f64,                  // Расстояние верхнего расчетного сечения от внутр. поверхности дна
    pub inside_diameter_ls: f64,              // Внутренний диаметр заготовки в нижнем расчетном сечении
    pub wall_thin_ls: f64,                    // Толщина стенки в нижнем расчетном сечении
    pub bottom_thin: f64,                     // Толщина дна заготовки
    pub sphere_part_height: f64,              // Высота сферической части
    pub matrix_radius: f64,                   // Радиус вытяжной кромки матрицы
    pub height: f64,                          // Высота заготовки
    pub elastic_unloading: f64,               // Упругая разгрузка
    pub elastic_deformation_matrix: f64,      // Упругая деформация матрицы
    pub total_elastic_deform_unload: f64,     // Суммарная упругая деформация и разгрузка
    pub executive_dimensions_matrix: f64,     // Исполнительные размеры матрицы 
    pub executive_dimensions_hob_us: f64,     // Исполнительные размеры пуансона (верх)
    pub executive_dimensions_hob_ls: f64,     // Исполнительные размеры пуансона (низ)
    pub degree_deformation_us: f64,           // Степень деформации (верх)
    pub degree_deformation_ls: f64,           // Степень деформации (низ)
    pub specific_force: f64,                  // Удельное усилие
    pub lower_area_hub: f64,                  // Площадь нижнего расчетного сечения пуансона
    pub deformation_power: f64,               // Сила деформирования
    pub amount_of_effort_hub: f64,            // Величина усилия снятия заготовки с пуансона
}

// Итоговый результат
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct DrowingCalculationResult {
	pub sumDrowingCoeff: f64,
	pub sumThinCoeff: f64,
	pub drowingCoeff: Vec<f64>,
	pub thinCoeff: Vec<f64>,
	pub operationsCount: i32,
	pub drowingOperations: Vec<DrowingOperationData>,
	pub operatorName: String,
	pub organizationName: String,
	pub date: String,
	pub material: String,
	pub detailName: String,
	pub coefficientOfFriction: f64,
	pub coefficientOfStock: f64,
	pub finVolume: f64,
	pub initThin: f64,
	pub initDiameter: f64,
	pub max_pull_first_op: f64,
	pub max_thin_first_op: f64,
	pub max_pull_subsequent_op: f64,
	pub max_thin_subsequent_op: f64
}

#[tauri::command]
pub fn drowing_excel_report(
    output_path: String,
    data: DrowingCalculationResult,
) -> Result<(), String> {
    let mut book = reader::xlsx::read("assets/drowing_report_template_".to_string() + &data.operationsCount.to_string() + &".xlsx".to_string()).map_err(|e| e.to_string())?;

    let sheet = book.get_sheet_by_name_mut("Лист1").ok_or("Лист1 не найден")?;

    sheet.get_cell_mut("C4").set_value(data.organizationName);
    sheet.get_cell_mut("C5").set_value(data.operatorName);
    sheet.get_cell_mut("C6").set_value(data.date);

    sheet.get_cell_mut("C10").set_value(data.detailName);
    sheet.get_cell_mut("C11").set_value(data.material);
	sheet.get_cell_mut("C12").set_value(data.coefficientOfFriction.to_string());
	sheet.get_cell_mut("C13").set_value(data.coefficientOfStock.to_string());
	sheet.get_cell_mut("G15").set_value(data.finVolume.to_string());

	sheet.get_cell_mut("F20").set_value(data.initThin.to_string());
	sheet.get_cell_mut("F21").set_value(data.initDiameter.to_string());
    sheet.get_cell_mut("F23").set_value(data.sumDrowingCoeff.to_string());
	sheet.get_cell_mut("F24").set_value(data.sumThinCoeff.to_string());
	sheet.get_cell_mut("F25").set_value(data.coefficientOfStock.to_string());
	sheet.get_cell_mut("F26").set_value(data.max_pull_first_op.to_string());
	sheet.get_cell_mut("F27").set_value(data.max_thin_first_op.to_string());
	sheet.get_cell_mut("F28").set_value(data.max_pull_subsequent_op.to_string());
	sheet.get_cell_mut("F29").set_value(data.max_thin_subsequent_op.to_string());

	sheet.get_cell_mut("F30").set_value(data.operationsCount.to_string());

	let mut startIndexDrow = 31;
	let mut startIndexThin = 32;

	for value in data.drowingCoeff.iter() {  
		sheet.get_cell_mut("F".to_string() + &startIndexDrow.to_string()).set_value(value.to_string());
		startIndexDrow += 2;
	}

	for value in data.thinCoeff.iter() {  
		sheet.get_cell_mut("F".to_string() + &startIndexThin.to_string()).set_value(value.to_string());
		startIndexThin += 2;
	}

	let mut startTechPowerIndex = startIndexThin - 1;

	for value in data.drowingOperations.iter() {
		sheet.get_cell_mut("F".to_string() + &startTechPowerIndex.to_string()).set_value(value.specific_force.to_string());
		startTechPowerIndex += 1;
	}

	let mut initedStartOperationDataIndex = if data.operationsCount <= 5 { 50 } else { 96 };
	let mut startOperationDataIndex = initedStartOperationDataIndex;
	let mut operationsInPage = 0;

	for operation in data.drowingOperations.iter() {
		if operationsInPage == 3 {
			startOperationDataIndex = initedStartOperationDataIndex + 46;
			operationsInPage = 0;
		}
		sheet.get_cell_mut("F".to_string() + &startOperationDataIndex.to_string()).set_value(operation.median_diameter_us.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 1).to_string()).set_value(operation.wall_thin_us.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 2).to_string()).set_value(operation.outside_diameter.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 3).to_string()).set_value(operation.wall_thin_ls.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 4).to_string()).set_value(operation.height.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 5).to_string()).set_value(operation.inside_diameter_us.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 6).to_string()).set_value(operation.inside_diameter_ls.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 7).to_string()).set_value(operation.radius.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 8).to_string()).set_value(operation.distance_ls_us.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 9).to_string()).set_value(operation.distance_us_us.to_string());
		startOperationDataIndex += 13;
		operationsInPage += 1;
	}

    writer::xlsx::write(&book, &output_path).map_err(|e| e.to_string())?;

    Ok(())
}