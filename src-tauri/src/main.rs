// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod parseModelVariables;
mod createFellingReport;
mod createDrowingReport;
mod createCrimpingReport;

use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
fn exit_app() {
  std::process::exit(0);
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        exit_app,
        parseModelVariables::run_parse_model_variables_script,
        parseModelVariables::open_parse_model_variables_guide,
        createFellingReport::felling_excel_report,
        createDrowingReport::drowing_excel_report,
        createCrimpingReport::crimping_excel_report
    ])
    .plugin(tauri_plugin_dialog::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
