use nalgebra::Vector2;
use wasm_bindgen_futures::spawn_local;
use web_time::Instant;
use winit::{
    dpi::PhysicalSize, error::EventLoopError, event::MouseButton, event_loop::EventLoop,
    keyboard::KeyCode,
};

use crate::{renderer::texture::DEPTH_FORMAT, scene::Scene};

use super::{
    event_handler::{EventState, Input},
    Engine,
};

impl Engine {
    #[inline]
    pub async fn run(mut self, event_loop: EventLoop<()>) -> Result<(), EventLoopError> {
        let mut engine_operations = vec![];
        let mut now = Instant::now();

        self.scenes[self.current_scene].init(&mut self.renderer, &self.globals);
        event_loop.run(move |event, elwt| {
            elwt.set_control_flow(winit::event_loop::ControlFlow::Poll);
            match event {
                winit::event::Event::WindowEvent { event, .. } => match event {
                    winit::event::WindowEvent::CloseRequested => {
                        elwt.exit();
                    }

                    winit::event::WindowEvent::KeyboardInput {
                        event: key_event, ..
                    } => match key_event.physical_key {
                        winit::keyboard::PhysicalKey::Code(code) => {
                            Input::handle_key_press(Some(code), key_event.state)
                        }

                        _ => (),
                    },

                    winit::event::WindowEvent::ModifiersChanged(modif) => {
                        Input::set_modif(modif.state());
                    }

                    winit::event::WindowEvent::Resized(size) => {
                        web_sys::window().and_then(|w| {
                            self.renderer.window().request_inner_size(PhysicalSize::new(
                                w.inner_width().unwrap().as_f64().unwrap() as u32,
                                w.inner_height().unwrap().as_f64().unwrap() as u32,
                            ))
                        });

                        Input::set_win_size(Vector2::new(size.width as f32, size.height as f32));

                        self.renderer.surface_config.width = size.width;
                        self.renderer.surface_config.height = size.height;
                        self.renderer
                            .surface
                            .configure(&self.renderer.device, &self.renderer.surface_config);

                        let texture =
                            self.renderer
                                .device
                                .create_texture(&wgpu::TextureDescriptor {
                                    label: Some("depth texture"),
                                    size: wgpu::Extent3d {
                                        width: self.renderer.surface_config.width,
                                        height: self.renderer.surface_config.height,
                                        depth_or_array_layers: 1,
                                    },
                                    mip_level_count: 1,
                                    sample_count: 1,
                                    dimension: wgpu::TextureDimension::D2,
                                    format: DEPTH_FORMAT,
                                    usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
                                    view_formats: &[],
                                });

                        self.renderer.depth_texture =
                            texture.create_view(&wgpu::TextureViewDescriptor::default());

                        self.renderer.window_size.x = size.width as f32;
                        self.renderer.window_size.y = size.height as f32;
                    }

                    winit::event::WindowEvent::MouseInput { state, button, .. } => {
                        Input::handle_mouse_press(button, state);
                    }

                    winit::event::WindowEvent::MouseWheel { delta, .. } => match delta {
                        winit::event::MouseScrollDelta::LineDelta(_, y) => {
                            Input::handle_mouse_wheel(y)
                        }
                        winit::event::MouseScrollDelta::PixelDelta(p) => {
                            Input::handle_mouse_wheel(p.y as f32)
                        }
                    },

                    winit::event::WindowEvent::CursorMoved { position, .. } => {
                        Input::handle_mouse_move(position.x, position.y);
                    }

                    winit::event::WindowEvent::RedrawRequested => {
                        if let Some(op) = self.scenes[self.current_scene]
                            .render_loop(&mut self.renderer, &self.globals)
                        {
                            engine_operations.push(op)
                        }
                    }
                    _ => (),
                },
                winit::event::Event::AboutToWait => {
                    self.globals.cam_mut().cam_move();

                    self.get_detected_objs();

                    if let Some(op) =
                        self.scenes[self.current_scene].main_loop(&mut self.renderer, &self.globals)
                    {
                        engine_operations.push(op)
                    }
                    Input::refresh();
                    self.renderer.window().request_redraw();
                    self.manage_engine_ops(&engine_operations);
                    engine_operations.clear();
                }
                _ => (),
            };
            self.globals.delta_time = now.elapsed().as_secs_f32();
            now = Instant::now();
        })
    }
}
