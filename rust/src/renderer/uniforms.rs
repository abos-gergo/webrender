use nalgebra::{Matrix, Matrix4, Vector3};

#[repr(C)]
pub struct SceneData {
    pub sun_pos: Vector3<f32>,
    pub width_height_ratio: f32,
    pub camera_transfrom: Matrix4<f32>,
    pub sun_transform: Matrix4<f32>,
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct ModelData {
    pub transform: Matrix4<f32>,
    pub obj_index: f32,
}

impl Default for ModelData {
    fn default() -> Self {
        Self {
            transform: Matrix4::identity(),
            obj_index: 0.,
        }
    }
}
