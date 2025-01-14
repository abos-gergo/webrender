use nalgebra::{Matrix4, Vector3};

#[repr(C)]
#[derive(Debug, Default, Clone, Copy)]
pub struct Sun {
    pub transform: Matrix4<f32>,
    pub position: Vector3<f32>,
}

impl Sun {
    pub fn init() -> Self {
        Self {
            transform: Matrix4::identity(),
            position: Vector3::zeros(),
        }
    }
}
