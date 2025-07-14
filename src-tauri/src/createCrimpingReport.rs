use serde_json::Value;
use umya_spreadsheet::*;

// Данные по операции
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CrimpingOperationData {
	pub coeff_of_crimping: f64,                // Коэф. обжима
	pub limit_coeff_of_crimping: f64,          // Предельный коэф. обжима
    pub thin_of_cromk: f64,                    // Толщина кромки заготовки
    pub diameter_dulca: f64,                   // Диаметр дульца
    pub angle_a: f64,                          // Угол альфа
	pub angle_b: f64,                          // Угол бета
    pub executive_diameter_of_matrix: f64,     // Исполнительные размеры матрицы
    pub allowance_for_wear_of_matrix: f64,     // Припуск за износ матрицы
    pub elastic_unloading: f64,                // Упругая разгрузка
    pub inaccuracy_tolerance: f64,             // Допуск на неточность
    pub skat_height: f64,                      // Высота ската
    pub median_diameter: f64,                  // Диаметр в срединном сечении
    pub circle_radius: f64,                    // Радиус скругления
    pub diameter_of_crimping_rod: f64,         // Диаметр обжимного стержня
    pub tech_strength: f64                     // Тех. сила
}

// Итоговый результат
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CrimpingCalculationResult {
	pub operationsCount: i32,                      // Кол-во операций
    pub degree_of_deformation: f64,                // Коэф. деформации
	pub operationsData: Vec<CrimpingOperationData>, // Операции
	pub operatorName: String,
	pub organizationName: String,
	pub date: String,
	pub material: String,
	pub detailName: String,
	pub init_diameter: f64,
	pub fin_diameter: f64,
	pub init_thin: f64
}

#[tauri::command]
pub fn crimping_excel_report(
    output_path: String,
    data: CrimpingCalculationResult,
) -> Result<(), String> {
    let mut book = reader::xlsx::read("assets/crimping_report_template_".to_string() + &data.operationsCount.to_string() + &".xlsx".to_string()).map_err(|e| e.to_string())?;

    let sheet = book.get_sheet_by_name_mut("Лист1").ok_or("Лист1 не найден")?;

    sheet.get_cell_mut("C4").set_value(data.organizationName);
    sheet.get_cell_mut("C5").set_value(data.operatorName);
    sheet.get_cell_mut("C6").set_value(data.date);

    sheet.get_cell_mut("C10").set_value(data.detailName);
    sheet.get_cell_mut("C11").set_value(data.material);

    sheet.get_cell_mut("F15").set_value(data.init_diameter.to_string());
	sheet.get_cell_mut("F16").set_value(data.fin_diameter.to_string());
	sheet.get_cell_mut("F17").set_value(data.init_thin.to_string());
	sheet.get_cell_mut("F19").set_value(data.degree_of_deformation.to_string());
	sheet.get_cell_mut("F20").set_value(data.operationsCount.to_string());

	let mut startIndexCrimpingCoeff = 21;
	let mut startIndexTechPower = 22;

	for operation in data.operationsData.iter() {  
		sheet.get_cell_mut("F".to_string() + &startIndexCrimpingCoeff.to_string()).set_value(operation.coeff_of_crimping.to_string());
		startIndexCrimpingCoeff += 2;
	}

	for operation in data.operationsData.iter() {  
		sheet.get_cell_mut("F".to_string() + &startIndexTechPower.to_string()).set_value(operation.tech_strength.to_string());
		startIndexTechPower += 2;
	}

	let mut initedStartOperationDataIndex = if data.operationsCount <= 10 { 49 } else { 95 };
	let mut startOperationDataIndex = initedStartOperationDataIndex;
	let mut operationsInPage = 0;

	for operation in data.operationsData.iter() {
		if operationsInPage == 3 {
			startOperationDataIndex = initedStartOperationDataIndex + 46;
			operationsInPage = 0;
		}
		sheet.get_cell_mut("F".to_string() + &startOperationDataIndex.to_string()).set_value(operation.thin_of_cromk.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 1).to_string()).set_value(operation.diameter_dulca.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 2).to_string()).set_value(operation.limit_coeff_of_crimping.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 3).to_string()).set_value(operation.angle_a.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 4).to_string()).set_value(operation.angle_b.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 5).to_string()).set_value(operation.executive_diameter_of_matrix.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 6).to_string()).set_value(operation.allowance_for_wear_of_matrix.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 7).to_string()).set_value(operation.elastic_unloading.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 8).to_string()).set_value(operation.inaccuracy_tolerance.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 9).to_string()).set_value(operation.skat_height.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 10).to_string()).set_value(operation.circle_radius.to_string());
		sheet.get_cell_mut("F".to_string() + &(startOperationDataIndex + 11).to_string()).set_value(operation.diameter_of_crimping_rod.to_string());
		startOperationDataIndex += 15;
		operationsInPage += 1;
	}

    writer::xlsx::write(&book, &output_path).map_err(|e| e.to_string())?;

    Ok(())
}