pub struct StagingBuffer {
    staging: wgpu::Buffer,
}

impl StagingBuffer {
    pub fn new(device: &wgpu::Device, size: u64) -> Self {
        let buf = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("staging buffer"),
            size,
            usage: wgpu::BufferUsages::MAP_WRITE | wgpu::BufferUsages::COPY_SRC,
            mapped_at_creation: true,
        });

        Self { staging: buf }
    }

    /// retrieve writeonly data
    #[inline]
    pub fn raw_data(&self) -> *mut u8 {
        self.staging.slice(..).get_mapped_range_mut().as_mut_ptr()
    }

    #[inline]
    pub fn buf(&self) -> &wgpu::Buffer {
        &self.staging
    }
}
