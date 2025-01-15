use nalgebra::Vector3;

use crate::engine::transformations::{getters::Getters, Transformations};

use super::{
    render_obj::{RenderObj, RenderObjIndex},
    Renderer, MAX_MESH_COUNT,
};

#[derive(Debug, Default, Clone, Copy)]
pub struct GizmoInfo {
    pub pos: Option<Vector3<f32>>,
    pub radius: Option<f32>,
    pub color: Option<[f32; 4]>,
}

#[derive(Debug, Default, Clone, Copy)]
struct Gizmo {
    pub pos: Vector3<f32>,
    pub radius: f32,
    pub color: [f32; 4],
}

impl GizmoInfo {
    pub fn pos(self, p: Vector3<f32>) -> Self {
        Self {
            pos: Some(p),
            ..self
        }
    }

    pub fn radius(self, r: f32) -> Self {
        Self {
            radius: Some(r),
            ..self
        }
    }

    pub fn color(self, c: [f32; 4]) -> Self {
        Self {
            color: Some(c),
            ..self
        }
    }
}

impl Renderer {
    pub fn spawn_gizmo(&mut self, info: &GizmoInfo) -> RenderObjIndex {
        let renderobj = RenderObj::new(2);
        let index = self.render_objects.push(renderobj);
        self.render_objects[index].index = index;

        // self.render_objects[index].model_data.obj_index =
        //     (index + 1) as f32 / MAX_MESH_COUNT as f32;

        self.render_objects[index]
            .transform_mut()
            .set_position(info.pos.unwrap_or(Gizmo::default().pos))
            .scale_object(info.radius.unwrap_or(Gizmo::default().radius));

        self.render_objects[index].model_data.color = info.color.unwrap_or(Gizmo::default().color);

        if self.show_gizmos {
            self.gizmos.push(index);
        }

        RenderObjIndex(index)
    }

    pub fn recreate_gizmo(&mut self, gizmo: RenderObjIndex, info: &GizmoInfo) {
        let transform = gizmo.get_mut(self).transform_mut();

        if let Some(pos) = info.pos {
            transform.set_position(pos);
        }
        if let Some(radius) = info.radius {
            transform.scale_object(1. / transform.get_scale() * radius);
        }
        if let Some(color) = info.color {
            gizmo.get_mut(self).model_data.color = color;
        }
    }

    pub fn toggle_gizmos(&mut self) {
        self.show_gizmos = !self.show_gizmos;
    }
}
