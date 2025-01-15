use nalgebra::Vector3;
use sun::Sun;
use winit::{event::MouseButton, keyboard::KeyCode};
pub mod sun;

use crate::{
    engine::{
        control_flow::EngineOp,
        event_handler::{EventState, Input},
        globals::Globals,
    },
    renderer::{gizmo::GizmoInfo, render_obj::RenderObjIndex, uniforms::SceneData, Renderer},
};

#[derive(Default)]
pub struct Scene {
    sun: Sun,
    rotation: f32,
    monek: RenderObjIndex,
    monek_gizmo: RenderObjIndex,
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
        if Input::key_state(KeyCode::KeyG, EventState::Pressed) {
            r.toggle_gizmos();
        }
        if Input::mouse_button_state(MouseButton::Right, EventState::Pressed) {
            let mesh = self.monek.get(r).mesh.index().abs_diff(1);
            self.monek.get_mut(r).set_mesh(mesh);
            r.recreate_gizmo(
                self.monek_gizmo,
                &GizmoInfo::default()
                    .pos(self.monek.get(&r).mesh.bounding_circle(&r).middle)
                    .radius(self.monek.get(&r).mesh.bounding_circle(&r).radius),
            );
        }
        self.rotation += g.delta_time();

        None
    }

    pub fn init(&mut self, r: &mut Renderer, g: &Globals) {
        self.sun = Sun::init();

        self.sun.position = Vector3::new(-1., 1.5, 0.);

        self.monek = r.create_render_obj(0, true);
        self.monek_gizmo = r.spawn_gizmo(
            &GizmoInfo::default()
                .pos(self.monek.get(&r).mesh.bounding_circle(&r).middle)
                .radius(self.monek.get(&r).mesh.bounding_circle(&r).radius)
                .color([1., 0., 0., 0.3]),
        );
    }

    pub fn drop(&mut self, r: &mut Renderer, g: &Globals) {}
}
