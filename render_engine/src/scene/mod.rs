use camera::Camera;
use nalgebra::Vector3;
use sun::Sun;

pub mod camera;
pub mod sun;
use crate::{
    engine::{control_flow::EngineOp, globals::Globals, transformations::Transformations},
    renderer::{render_obj::RenderObjIndex, uniforms::SceneData, Renderer},
};

#[derive(Default)]
pub struct Scene {
    camera: Camera,
    sun: Sun,
    rotation: f32,
    moneks: Vec<RenderObjIndex>,
}

impl Scene {
    pub fn render_loop(&mut self, r: &mut Renderer, g: &Globals) -> Option<EngineOp> {
        r.update(
            &r.scene_unifrom_buffer,
            &SceneData {
                camera_transfrom: *self.camera.get_transform(),
                width_height_ratio: r.window_size.x / r.window_size.y,
                sun_transform: self.sun.transform,
                sun_pos: self.sun.position,
            },
        );

        r.update(
            &r.shadow_renderer.uniform_buffer,
            self.camera.get_transform(),
        );

        r.present(Renderer::render);
        None
    }

    pub fn main_loop(&mut self, r: &mut Renderer, g: &Globals) -> Option<EngineOp> {
        self.camera.cam_move();
        self.rotation += g.delta_time();

        self.moneks.iter().for_each(|m| {
            m.get_mut(r).transform_mut();
        });

        None
    }

    pub fn init(&mut self, r: &mut Renderer, g: &Globals) {
        self.camera = Camera::init(Vector3::zeros(), 1.);
        self.sun = Sun::init();

        self.sun.position = Vector3::new(-1., 1.5, 0.);

        self.moneks = (0..1).map(|_| r.create_render_obj(0, true)).collect();

        self.sun
            .transform
            .translate_vec3(self.sun.position)
            .look_at(Vector3::zeros())
            .scale_object(0.08);
    }

    pub fn drop(&mut self, r: &mut Renderer, g: &Globals) {}
}
