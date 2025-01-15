pub mod camera;
pub mod click_detection;
pub mod control_flow;
pub mod event_handler;
pub mod helpers;
pub mod run;
pub mod transformations;

use std::{
    fmt::{Debug, Display},
    sync::Arc,
};

use globals::Globals;
use wasm_bindgen::prelude::*;
use web_sys::Element;
use web_time::web;
use winit::window::Window;

use crate::{renderer::Renderer, scene::Scene};

pub mod globals;

pub struct Engine {
    pub renderer: Renderer,
    scenes: Vec<Scene>,
    current_scene: usize,
    globals: Globals,
}

impl Engine {
    pub async fn new(window: Arc<Window>) -> Self {
        Self {
            renderer: Renderer::new(window).await,
            scenes: vec![Scene::default()],
            current_scene: 0,
            globals: Default::default(),
        }
    }

    pub fn scene(&mut self) -> &mut Scene {
        &mut self.scenes[self.current_scene]
    }

    pub fn delta_time(&self) -> f32 {
        self.globals.delta_time
    }
}
