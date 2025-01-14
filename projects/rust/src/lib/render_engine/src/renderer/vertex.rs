use std::mem::size_of;

use nalgebra::Vector3;
use wgpu::vertex_attr_array;

#[repr(C)]
pub struct Vertex {
    position: Vector3<f32>,
    color: Vector3<f32>,
    normal: Vector3<f32>,
}

impl Vertex {
    pub fn new(position: Vector3<f32>, normal: Vector3<f32>) -> Self {
        Self {
            position,
            color: position.abs().normalize(),
            normal,
        }
    }

    const VERTEX_ATTRIBS: [wgpu::VertexAttribute; 3] =
        vertex_attr_array![0 => Float32x3, 1 => Float32x3, 2 => Float32x3];

    pub fn desc() -> wgpu::VertexBufferLayout<'static> {
        wgpu::VertexBufferLayout {
            array_stride: size_of::<Self>() as _,
            step_mode: wgpu::VertexStepMode::Vertex,
            attributes: &Self::VERTEX_ATTRIBS,
        }
    }
}
