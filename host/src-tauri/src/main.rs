// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enigo::*;

#[tauri::command]
fn fire_key_sequence(key_sequence: &str) {
    let mut enigo = Enigo::new();

    format!("Firing keys {}", key_sequence);

    for c in key_sequence.chars() {
        enigo.key_click(enigo::keycodes::Key::Layout(c));
    }

    enigo.key_down(enigo::keycodes::Key::Return)
}

fn main() {
    // let mut enigo = Enigo::new();

    // enigo.key_sequence("hello world");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fire_key_sequence])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
