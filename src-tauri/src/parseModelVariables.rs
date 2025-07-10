use std::fs;
use serde_json::Value;
use std::path::Path;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ParseModelVariablesParams {
    pub file_path: String,        // Путь до файла с моделью
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ParseModelVariablesResult {
    pub message: String,          // Сообщение о статусе
    pub status: u16,              // HTTP-подобный статус
    pub data: Option<Value>,      // Данные из JSON файла (если есть)
}

#[tauri::command]
pub fn run_parse_model_variables_script(params: ParseModelVariablesParams) -> Result<ParseModelVariablesResult, String> {
    let python_script_exe = Path::new("scripts/parseModelVariablesScript.exe");
    println!("Обработка файла: {}", params.file_path);

    let args = [params.file_path];

    let output = match std::process::Command::new(python_script_exe)
        .args(&args)
        .output() {
            Ok(output) => output,
            Err(e) => {
                return Ok(ParseModelVariablesResult {
                    message: format!("Не удалось запустить Python-скрипт: {}", e),
                    status: 500,
                    data: None,
                })
            }
        };

    // Если скрипт завершился с ошибкой
    if !output.status.success() {
        let stderr = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "Неизвестная ошибка".to_string());
        
        return Ok(ParseModelVariablesResult {
            message: format!("Ошибка при обработке модели: {}", stderr),
            status: 400,
            data: None,
        });
    }

    // Пытаемся прочитать и распарсить JSON файл
    match fs::read_to_string(Path::new("drowing.json")) {
        Ok(json_content) => {
            match serde_json::from_str::<Value>(&json_content) {
                Ok(parsed_json) => {
                    Ok(ParseModelVariablesResult {
                        message: "Модель была успешно обработана".to_string(),
                        status: 200,
                        data: Some(parsed_json),
                    })
                },
                Err(e) => {
                    Ok(ParseModelVariablesResult {
                        message: format!("Ошибка при парсинге JSON: {}", e),
                        status: 422, // Unprocessable Entity
                        data: None,
                    })
                }
            }
        },
        Err(e) => {
            Ok(ParseModelVariablesResult {
                message: format!("Не удалось прочитать JSON файл: {}", e),
                status: 404,
                data: None,
            })
        }
    }
}

#[tauri::command]
pub fn open_parse_model_variables_guide() {
    let pdf_path = "assets/Краткая_документация_по_процессу_создания_переменных_в_Компас_3Д.pdf";
    
    if cfg!(target_os = "windows") {
        std::process::Command::new("cmd")
            .args(&["/C", "start", "", pdf_path])
            .spawn()
            .expect("Не удалось открыть PDF");
    } 
}