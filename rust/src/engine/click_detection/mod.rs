use crate::renderer::{render_obj::RenderObjIndex, vertex::Vertex};

use super::{event_handler::Input, helpers::collisions::circle_point_collision, Engine};

#[derive(Debug, Clone)]
pub struct ClickResult(Vec<Vertex>);

pub enum SelectionType {
    Vertex,
    Face,
    Edge,
}

impl ClickResult {
    pub fn selection_type(&self) -> Option<SelectionType> {
        match self.0.len() {
            0 => None,
            1 => Some(SelectionType::Vertex),
            2 => Some(SelectionType::Edge),
            _ => Some(SelectionType::Face),
        }
    }
}

impl Engine {
    pub fn get_detected_objs(&self) {
        let objs = self.renderer.staged_indices.iter().filter_map(|&i| {
            let o = RenderObjIndex(i as usize).get(&self.renderer);

            let bc = o.mesh.bounding_circle(&self.renderer);

            match circle_point_collision(
                bc.middle.xy(),
                bc.radius * self.globals.camera().scale(),
                Input::relative_mouse_pos(),
            ) {
                true => Some(o),
                false => None,
            }
        });
    }
}
