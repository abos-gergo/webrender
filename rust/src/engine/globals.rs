use nalgebra::Vector3;

use super::camera::Camera;

pub struct Globals {
    pub(super) delta_time: f32,
    pub(super) cameras: Vec<Camera>,
    pub(super) cam_index: usize,
}

impl Globals {
    #[inline]
    pub fn delta_time(&self) -> f32 {
        self.delta_time
    }

    #[inline]
    pub fn camera(&self) -> &Camera {
        &self.cameras[self.cam_index]
    }

    #[inline]
    pub(super) fn cam_mut(&mut self) -> &mut Camera {
        &mut self.cameras[self.cam_index]
    }
}

impl Default for Globals {
    fn default() -> Self {
        Self {
            delta_time: Default::default(),
            cam_index: 0,
            cameras: vec![Camera::init(Vector3::zeros(), 1.)],
        }
    }
}
