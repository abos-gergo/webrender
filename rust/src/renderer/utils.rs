use wgpu::Buffer;

use crate::engine::helpers::AsByteSlice;

use super::Renderer;

impl Renderer {
    pub fn update<T: AsByteSlice>(&self, buf: &Buffer, data: T) {
        self.queue.write_buffer(buf, 0, data.as_byte_slice());
    }
}
