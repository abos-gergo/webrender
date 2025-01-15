use nalgebra::Vector3;
use sun::Sun;
pub mod sun;

use crate::{
    engine::{control_flow::EngineOp, globals::Globals},
    renderer::{render_obj::RenderObjIndex, uniforms::SceneData, Renderer},
};

#[derive(Default)]
pub struct Scene {
    sun: Sun,
    rotation: f32,
    moneks: Vec<RenderObjIndex>,
}

impl Scene {
    pub fn render_loop(&mut self, r: &mut Renderer, g: &Globals) -> Option<EngineOp> {
        r.update(
            &r.scene_unifrom_buffer,
            &SceneData {
                camera_transfrom: *g.camera().get_transform(),
                width_height_ratio: r.window_size.x / r.window_size.y,
                sun_transform: self.sun.transform,
                sun_pos: self.sun.position,
            },
        );

        r.present(Renderer::render);
        None
    }

    pub fn main_loop(&mut self, r: &mut Renderer, g: &Globals) -> Option<EngineOp> {
        self.rotation += g.delta_time();

        self.moneks.iter().for_each(|m| {
            m.get_mut(r).transform_mut();
        });

        None
    }

    pub fn init(&mut self, r: &mut Renderer, g: &Globals) {
        self.sun = Sun::init();

        self.sun.position = Vector3::new(-1., 1.5, 0.);

        self.moneks = (0..1).map(|_| r.create_render_obj(0, true)).collect();
    }

    pub fn drop(&mut self, r: &mut Renderer, g: &Globals) {}
}
