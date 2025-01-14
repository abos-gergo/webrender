use std::{
    collections::HashMap,
    fs::File,
    io::{BufRead, BufReader},
};

use nalgebra::Vector3;
use wgpu::{
    util::{BufferInitDescriptor, DeviceExt},
    RenderPass,
};

use crate::{engine::helpers::AsByteSlice, renderer::vertex::Vertex};

pub struct Mesh {
    pub vertex_buffer: wgpu::Buffer,
    pub vertex_data: Vec<Vertex>,
    pub index_data: Vec<u32>,
    pub index_buffer: wgpu::Buffer,
    pub index_count: u32,
}

impl Mesh {
    pub fn render(&self, render_pass: &mut RenderPass) {
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint32);
        render_pass.draw_indexed(0..self.index_count, 0, 0..1);
    }

    pub fn new(device: &wgpu::Device, vertices: &[Vertex], indices: &[u32]) -> Self {
        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: None,
            contents: vertices.as_byte_slice(),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&BufferInitDescriptor {
            label: None,
            contents: indices.as_byte_slice(),
            usage: wgpu::BufferUsages::INDEX,
        });

        Self {
            vertex_buffer,
            vertex_data: vertices.to_vec(),
            index_data: indices.to_vec(),
            index_buffer,
            index_count: indices.len() as u32,
        }
    }

    pub fn get_bounding_circle(&self) {
        let Vertex {
            position: mut min, ..
        } = self.vertex_data[0];
        let mut max = min;

        for v in self.vertex_data.iter() {
            if v.position.x < min.x {
                min.x = v.position.x;
            } else if v.position.x > max.x {
                max.x = v.position.x;
            }

            if v.position.y < min.y {
                min.y = v.position.y;
            } else if v.position.y > max.y {
                max.y = v.position.y;
            }

            if v.position.z < min.z {
                min.z = v.position.z;
            } else if v.position.z > max.z {
                max.z = v.position.z;
            }
        }

        let lens = max - min;
        let max_len = lens.iter().max_by(|x, y| x.total_cmp(y)).unwrap();

        let middle = Vector3::new(max_len / 2., max_len / 2., max_len / 2.);
        let radius_squared = (middle - min).magnitude_squared();
    }

    pub fn quad(device: &wgpu::Device) -> Self {
        let vertices = vec![
            Vertex::new(Vector3::new(-1., -1., 0.), Vector3::z()),
            Vertex::new(Vector3::new(-1., 1., 0.), Vector3::z()),
            Vertex::new(Vector3::new(1., -1., 0.), Vector3::z()),
            Vertex::new(Vector3::new(1., 1., 0.), Vector3::z()),
        ];

        let indices = vec![
            0, 1, 2, // 1st
            2, 1, 3, // 2nd
        ];

        Mesh {
            vertex_buffer: device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some("Texture v-buf"),
                contents: vertices.as_byte_slice(),
                usage: wgpu::BufferUsages::VERTEX,
            }),
            index_buffer: device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some("Texture i-buf"),
                contents: indices.as_byte_slice(),
                usage: wgpu::BufferUsages::INDEX,
            }),
            index_count: indices.len() as u32,
            vertex_data: vertices,
            index_data: indices,
        }
    }

    pub fn from_file(device: &wgpu::Device, path: &str) -> Self {
        let obj_file = BufReader::new(File::open(path.to_owned() + "/Object.obj").unwrap());
        let mtl_file = BufReader::new(File::open(path.to_owned() + "/Object.mtl").unwrap());

        //Loading materials
        let mut materials: HashMap<String, [f32; 3]> = HashMap::new();
        let mut current_material_name = String::from("");
        for line in mtl_file.lines() {
            let line = line.unwrap();
            //Getting material name
            if line.contains("newmtl") {
                current_material_name = line[7..].to_owned();
            }
            //Getting material color (Color value is written after the Kd keyword in mtl files)
            if line.contains("Kd") {
                materials.insert(
                    current_material_name.to_owned(),
                    [
                        line[3..11].parse::<f32>().unwrap(),
                        line[12..20].parse::<f32>().unwrap(),
                        line[21..29].parse::<f32>().unwrap(),
                    ],
                );
            }
        }
        //A default material, if no materials are present.
        if materials.len() == 0 {
            materials.insert("default".to_owned(), [1.0, 0.0, 1.0]);
        }
        //Finished loading materials

        //The buffers get filled up when reading face data
        let mut vertex_buffer = vec![];
        let mut index_buffer = vec![];

        //These vectors get filled up with v, vn, and vt values.
        let mut positions = vec![];
        let mut normals = vec![];
        let mut textures = vec![];

        //Keeping track of what material the face uses.
        let mut current_material = String::from("default");

        for line in obj_file.lines() {
            let line = line.unwrap();
            let splitted_line = line.split(' ').collect::<Vec<_>>();
            match splitted_line[0] {
                //Vertex xample: v 0.0000000 1.0000000 0.5000000
                "v" => positions.push([
                    splitted_line[1].parse::<f32>().unwrap(),
                    -splitted_line[2].parse::<f32>().unwrap(),
                    splitted_line[3].parse::<f32>().unwrap(),
                ]),
                //Normal example: vn 0.0000000 1.0000000 0.0000000
                "vn" => normals.push([
                    splitted_line[1].parse::<f32>().unwrap(),
                    -splitted_line[2].parse::<f32>().unwrap(),
                    splitted_line[3].parse::<f32>().unwrap(),
                ]),
                //Texture example: vt 0.5000000 1.0000000 (texture is always 2D)
                "vt" => textures.push([
                    splitted_line[1].parse::<f32>().unwrap(),
                    splitted_line[2].parse::<f32>().unwrap(),
                ]),
                //Face example 1/1/1 2/1/1 3/4/1
                //Format is following: positionindex1/colorindex1/normalindex1 positionindex2/...
                "f" => {
                    for segment in &splitted_line[1..] {
                        let splitted_segment = segment.split('/').collect::<Vec<_>>();
                        vertex_buffer.push(Vertex::new(
                            positions[splitted_segment[0].parse::<usize>().unwrap() - 1].into(),
                            normals[splitted_segment[2].parse::<usize>().unwrap() - 1].into(),
                        ));

                        //We are currently loading all vertices in order,
                        //so the index buffer is just a vector of incrementing numbers.
                        index_buffer.push(index_buffer.len() as u32);
                    }
                }

                //Material example: usemtl Brick
                "usemtl" => {
                    current_material = splitted_line[1].to_owned();
                }
                _ => {}
            }
        }

        Self::new(device, &vertex_buffer, &index_buffer)
    }
}

#[macro_export]
macro_rules! load_model {
    ($path: literal, $device: expr) => {{
        let obj_cursor = std::io::Cursor::new(include_str!($path));
        let obj_file = std::io::BufReader::new(obj_cursor);
        // let mtl_file = std::io::BufReader::new(include_str!($path) + "/Object.mtl").unwrap();

        // let mut materials: std::collections::HashMap<String, [f32; 3]> =
        //     std::collections::HashMap::new();
        // let mut current_material_name = String::from("");
        // for line in mtl_file.lines() {
        //     let line = line.unwrap();
        //     //Getting material name
        //     if line.contains("newmtl") {
        //         current_material_name = line[7..].to_owned();
        //     }
        //     if line.contains("Kd") {
        //         materials.insert(
        //             current_material_name.to_owned(),
        //             [
        //                 line[3..11].parse::<f32>().unwrap(),
        //                 line[12..20].parse::<f32>().unwrap(),
        //                 line[21..29].parse::<f32>().unwrap(),
        //             ],
        //         );
        //     }
        // }
        // //A default material, if no materials are present.
        // if materials.len() == 0 {
        //     materials.insert("default".to_owned(), [1.0, 0.0, 1.0]);
        // }
        //Finished loading materials

        //The buffers get filled up when reading face data
        let mut vertex_buffer = vec![];
        let mut index_buffer = vec![];

        //These vectors get filled up with v, vn, and vt values.
        let mut positions = vec![];
        let mut normals = vec![];
        let mut textures = vec![];

        // //Keeping track of what material the face uses.
        // let mut current_material = String::from("default");

        for line in std::io::BufRead::lines(obj_file) {
            let line = line.unwrap();
            let splitted_line = line.split(' ').collect::<Vec<_>>();
            match splitted_line[0] {
                //Vertex xample: v 0.0000000 1.0000000 0.5000000
                "v" => positions.push([
                    splitted_line[1].parse::<f32>().unwrap(),
                    -splitted_line[2].parse::<f32>().unwrap(),
                    splitted_line[3].parse::<f32>().unwrap(),
                ]),
                //Normal example: vn 0.0000000 1.0000000 0.0000000
                "vn" => normals.push([
                    splitted_line[1].parse::<f32>().unwrap(),
                    -splitted_line[2].parse::<f32>().unwrap(),
                    splitted_line[3].parse::<f32>().unwrap(),
                ]),
                //Texture example: vt 0.5000000 1.0000000 (texture is always 2D)
                "vt" => textures.push([
                    splitted_line[1].parse::<f32>().unwrap(),
                    splitted_line[2].parse::<f32>().unwrap(),
                ]),
                //Face example 1/1/1 2/1/1 3/4/1
                //Format is following: positionindex1/colorindex1/normalindex1 positionindex2/...
                "f" => {
                    for segment in &splitted_line[1..] {
                        let splitted_segment = segment.split('/').collect::<Vec<_>>();
                        vertex_buffer.push(Vertex::new(
                            positions[splitted_segment[0].parse::<usize>().unwrap() - 1].into(),
                            normals[splitted_segment[2].parse::<usize>().unwrap() - 1].into(),
                        ));

                        //We are currently loading all vertices in order,
                        //so the index buffer is just a vector of incrementing numbers.
                        index_buffer.push(index_buffer.len() as u32);
                    }
                }

                // //Material example: usemtl Brick
                // "usemtl" => {
                //     current_material = splitted_line[1].to_owned();
                // }
                _ => {}
            }
        }

        Mesh::new($device, &vertex_buffer, &index_buffer)
    }};
}
