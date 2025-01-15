use std::{mem::size_of, num::NonZeroU64, sync::Arc};

use nalgebra::Vector2;
use render_obj::RenderObj;
use texture::{Texture, DEPTH_FORMAT};
use uniforms::{ModelData, SceneData};
use vertex::Vertex;
use wgpu::Limits;
use winit::{dpi::PhysicalSize, window::Window};

mod render;
pub mod render_obj;
pub mod texture;
pub mod uniforms;
pub mod utils;
pub mod vertex;

const MAX_MESH_COUNT: u64 = 100;

use crate::{
    engine::helpers::{aligned_array::AlignedArray, object_vector::ObjVec},
    load_model,
    models::Mesh,
};

pub struct Renderer {
    pub surface: wgpu::Surface<'static>,
    pub device: wgpu::Device,
    pub queue: wgpu::Queue,
    pub surface_config: wgpu::SurfaceConfiguration,
    pub pipeline: wgpu::RenderPipeline,

    pub depth_texture: wgpu::TextureView,

    pub texture_sampler: wgpu::Sampler,

    pub scene_unifrom_buffer: wgpu::Buffer,
    pub model_uniform_buffer: wgpu::Buffer,
    model_uniform_buffer_view: AlignedArray<ModelData>,
    pub(super) render_objects: ObjVec<RenderObj>,
    pub(super) staged_indices: Vec<u16>,
    pub meshes: Vec<Mesh>,

    pub scene_bind_group: wgpu::BindGroup,
    pub model_bind_group: wgpu::BindGroup,
    pub dynamic_offset: u32,

    pub window_size: Vector2<f32>,
    window: Arc<Window>,
    _webgpu_supported: bool,
}

impl Renderer {
    pub async fn new(window: Arc<Window>) -> Self {
        let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
            backends: wgpu::Backends::GL,
            flags: wgpu::InstanceFlags::from_build_config().with_env(),
            ..Default::default()
        });

        let surface = instance.create_surface(window.clone()).unwrap();

        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::default(),
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .unwrap();

        let webgpu_supported = adapter.get_info().backend == wgpu::Backend::BrowserWebGpu;

        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: Some("Device"),
                    required_limits: if !webgpu_supported {
                        wgpu::Limits::downlevel_webgl2_defaults()
                    } else {
                        Default::default()
                    },
                    ..Default::default()
                },
                None,
            )
            .await
            .unwrap();

        let surface_caps = surface.get_capabilities(&adapter);

        let surface_config = wgpu::SurfaceConfiguration {
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
            format: surface_caps
                .formats
                .iter()
                .find(|f| f.is_srgb())
                .copied()
                .unwrap_or(surface_caps.formats[0]),
            width: 1,
            height: 1,
            present_mode: surface_caps
                .present_modes
                .iter()
                .find(|p| **p == wgpu::PresentMode::Mailbox)
                .copied()
                .unwrap_or(wgpu::PresentMode::Fifo),
            desired_maximum_frame_latency: 3,
            alpha_mode: surface_caps.alpha_modes[0],
            view_formats: [].to_vec(),
        };

        let min_buf_aligment = Limits::default().min_uniform_buffer_offset_alignment;
        let dynamic_offset =
            ((size_of::<ModelData> as u32 - 1) / min_buf_aligment + 1) * min_buf_aligment;

        let model_uniform = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Model uniform"),
            size: dynamic_offset as u64 * MAX_MESH_COUNT,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let model_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("Model bind group layout"),
                entries: &[wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: true,
                        min_binding_size: None,
                    },
                    count: None,
                }],
            });

        let model_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("Model bind group"),
            layout: &model_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                    buffer: &model_uniform,
                    offset: 0,
                    size: Some(NonZeroU64::new(dynamic_offset.into()).unwrap()),
                }),
            }],
        });

        let depth_texture = Texture::create_depth_texture(&device, &surface_config);

        let sampler = device.create_sampler(&wgpu::SamplerDescriptor {
            label: Some("Shadow image sampler"),
            address_mode_u: wgpu::AddressMode::ClampToEdge,
            address_mode_v: wgpu::AddressMode::ClampToEdge,
            address_mode_w: wgpu::AddressMode::ClampToEdge,
            ..Default::default()
        });

        let uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Scene data"),
            size: size_of::<SceneData>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let scene_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("Bindgroup Layout 0"),
                entries: &[wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                }],
            });

        let scene_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("Bind group 0"),
            layout: &scene_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                    buffer: &uniform_buffer,
                    offset: 0,
                    size: None,
                }),
            }],
        });

        let pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Main render Pipeline Layout"),
            bind_group_layouts: &[&scene_bind_group_layout, &model_bind_group_layout],
            push_constant_ranges: &[],
        });

        surface.configure(&device, &surface_config);

        web_sys::window().and_then(|w| {
            window.clone().request_inner_size(PhysicalSize::new(
                w.inner_width().unwrap().as_f64().unwrap() as u32,
                w.inner_height().unwrap().as_f64().unwrap() as u32,
            ))
        });

        let shader_module =
            device.create_shader_module(wgpu::include_wgsl!("../shaders/shader.wgsl"));

        let pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("Main render Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: wgpu::VertexState {
                module: &shader_module,
                entry_point: "vs_main",
                compilation_options: Default::default(),
                buffers: &[Vertex::desc()],
            },
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                unclipped_depth: false,
                polygon_mode: wgpu::PolygonMode::Fill,
                conservative: false,
            },
            depth_stencil: Some(wgpu::DepthStencilState {
                format: DEPTH_FORMAT,
                depth_write_enabled: true,
                depth_compare: wgpu::CompareFunction::Less,
                stencil: wgpu::StencilState::default(),
                bias: wgpu::DepthBiasState::default(),
            }),
            multisample: wgpu::MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader_module,
                entry_point: "fs_main",
                compilation_options: wgpu::PipelineCompilationOptions::default(),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_config.format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::all(),
                })],
            }),
            multiview: None,
            cache: None,
        });

        let meshes = vec![
            load_model!("../models/monek/Object.obj", &device),
            load_model!("../models/cube/Object.obj", &device),
            Mesh::quad(&device),
        ];

        Self {
            surface,
            device,
            queue,
            surface_config,

            pipeline,

            depth_texture,
            texture_sampler: sampler,
            dynamic_offset,

            scene_unifrom_buffer: uniform_buffer,
            model_uniform_buffer: model_uniform,
            model_uniform_buffer_view: AlignedArray::<ModelData>::default(),
            meshes,
            render_objects: ObjVec::with_capacity(MAX_MESH_COUNT as _),
            staged_indices: Vec::with_capacity(MAX_MESH_COUNT as _),
            window_size: Default::default(),

            scene_bind_group,
            model_bind_group,

            window,
            _webgpu_supported: webgpu_supported,
        }
    }

    pub(crate) fn window(&self) -> Arc<Window> {
        self.window.clone()
    }
}
