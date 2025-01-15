use nalgebra::{Matrix4, Vector3, Vector4};

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
    pub color: [f32; 4],
}

impl Default for ModelData {
    fn default() -> Self {
        Self {
            transform: Matrix4::identity(),
            color: [4. / 255., 8. / 255., 12. / 255., 1.],
        }
    }
}
