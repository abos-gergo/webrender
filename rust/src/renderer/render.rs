use std::num::NonZeroU64;

use crate::engine::helpers::aligned_array::AlignedArray;

use super::{uniforms::ModelData, Renderer};

impl Renderer {
    pub fn render(&mut self, encoder: &mut wgpu::CommandEncoder) -> wgpu::SurfaceTexture {
        let output = self.surface.get_current_texture().unwrap();
        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        self.model_uniform_buffer_view = AlignedArray::<ModelData>::new(
            self.queue
                .write_buffer_with(
                    &self.model_uniform_buffer,
                    0,
                    NonZeroU64::new(self.model_uniform_buffer.size() as u64).unwrap(),
                )
                .unwrap()
                .as_mut_ptr(),
            self.dynamic_offset as _,
        );

        {
            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Shadow render pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color {
                            r: 1. / 255.,
                            g: 2. / 255.,
                            b: 3. / 255.,
                            a: 1.,
                        }),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: Some(wgpu::RenderPassDepthStencilAttachment {
                    view: &self.depth_texture,
                    depth_ops: Some(wgpu::Operations {
                        load: wgpu::LoadOp::Clear(1.),
                        store: wgpu::StoreOp::Store,
                    }),
                    stencil_ops: None,
                }),
                timestamp_writes: None,
                occlusion_query_set: None,
            });

            render_pass.set_pipeline(&self.pipeline);
            render_pass.set_bind_group(0, &self.scene_bind_group, &[]);
            self.staged_indices.iter().for_each(|i| {
                let mesh = &self.meshes[self.render_objects[*i as usize].mesh.index()];
                let obj = self.render_objects[*i as usize];
                self.model_uniform_buffer_view[obj.index] = obj.model_data;

                render_pass.set_bind_group(
                    1,
                    &self.model_bind_group,
                    &[self.dynamic_offset * obj.index as u32],
                );
                render_pass.set_vertex_buffer(0, mesh.vertex_buffer.slice(..));
                render_pass
                    .set_index_buffer(mesh.index_buffer.slice(..), wgpu::IndexFormat::Uint32);
                render_pass.draw_indexed(0..mesh.index_count, 0, 0..1);
            });

            if self.show_gizmos {
                self.gizmos.iter().for_each(|i| {
                    let mesh = &self.meshes[self.render_objects[*i as usize].mesh.index()];
                    let obj = self.render_objects[*i as usize];
                    self.model_uniform_buffer_view[obj.index] = obj.model_data;

                    render_pass.set_bind_group(
                        1,
                        &self.model_bind_group,
                        &[self.dynamic_offset * obj.index as u32],
                    );
                    render_pass.set_vertex_buffer(0, mesh.vertex_buffer.slice(..));
                    render_pass
                        .set_index_buffer(mesh.index_buffer.slice(..), wgpu::IndexFormat::Uint32);
                    render_pass.draw_indexed(0..mesh.index_count, 0, 0..1);
                });
            }
        }

        output
    }

    pub fn present(
        &mut self,
        render_command: fn(
            s: &mut Self,
            encoder: &mut wgpu::CommandEncoder,
        ) -> wgpu::SurfaceTexture,
    ) {
        let mut command_encoder =
            self.device
                .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                    label: Some("Command Encoder"),
                });

        let output = render_command(self, &mut command_encoder);
        self.queue.submit(std::iter::once(command_encoder.finish()));
        output.present();
    }
}
