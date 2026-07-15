use enigo::{Direction, Enigo, Key, Keyboard, Settings};

#[tauri::command]
fn fire_key_sequence(key_sequence: &str) {
    if let Ok(mut enigo) = Enigo::new(&Settings::default()) {
        let _ = enigo.text(key_sequence);
        let _ = enigo.key(Key::Return, Direction::Click);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fire_key_sequence])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
