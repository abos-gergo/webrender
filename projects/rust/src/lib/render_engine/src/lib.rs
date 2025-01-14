use engine::Engine;
use winit::{event_loop::EventLoop, window::WindowBuilder};

use wasm_bindgen::prelude::*;
pub mod engine;
pub mod gameobj;
pub mod models;
pub mod renderer;
pub mod scene;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen(start))]
#[cfg(target_arch = "wasm32")]
async fn main() {
    use std::sync::Arc;

    use winit::{dpi::PhysicalSize, platform::web::WindowBuilderExtWebSys};

    fern::Dispatch::new()
        .level(log::LevelFilter::Debug)
        .level_for("wgpu_core", log::LevelFilter::Error)
        .level_for("wgpu_hal", log::LevelFilter::Error)
        .level_for("naga", log::LevelFilter::Error)
        .chain(fern::Output::call(console_log::log))
        .apply()
        .unwrap();
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));

    let event_loop = EventLoop::new().unwrap();
    let mut window_builder = WindowBuilder::new();
    let doc = web_sys::window().unwrap().document().unwrap();
    let canvas = doc
        .get_element_by_id("main_canvas")
        .unwrap()
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .unwrap();

    window_builder = window_builder.with_canvas(Some(canvas));

    let window = Arc::new(window_builder.build(&event_loop).unwrap());
    let _ = window.request_inner_size(PhysicalSize::new(400, 500));

    let engine = Engine::new(window.clone()).await;
    engine.run(event_loop).await.unwrap();
}
