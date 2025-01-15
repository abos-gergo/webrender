use nalgebra::Matrix4;

use crate::{
    engine::helpers::NoneValue,
    models::{Mesh, MeshIndex},
};

use super::{uniforms::ModelData, Renderer, MAX_MESH_COUNT};

#[derive(Debug, Clone, Copy, Default)]
pub struct RenderObjIndex(pub usize);

#[derive(Clone, Copy, Default, Debug)]
pub struct RenderObj {
    pub mesh: MeshIndex,
    pub model_data: ModelData,
    pub index: usize,
}

impl NoneValue for RenderObj {
    fn is_none(&self) -> bool {
        self.index == usize::MAX
    }

    fn set_to_none(&mut self) {
        self.index = usize::MAX;
    }
}

impl RenderObjIndex {
    #[inline]
    pub fn get<'a>(&self, r: &'a Renderer) -> &'a RenderObj {
        &r.render_objects[self.0]
    }

    #[inline]
    pub fn get_mut<'a>(&self, r: &'a mut Renderer) -> &'a mut RenderObj {
        &mut r.render_objects[self.0]
    }

    #[inline]
    pub fn destroy(&self, r: &mut Renderer) {
        self.unstage(r);
        r.render_objects.remove(self.0);
    }

    #[inline]
    pub fn stage(&self, r: &mut Renderer) {
        r.staged_indices.push(self.0 as u16);
    }

    #[inline]
    pub fn unstage(&self, r: &mut Renderer) {
        if let Some((i, _)) = r
            .staged_indices
            .iter()
            .enumerate()
            .find(|(i, ri)| **ri == self.0 as u16)
        {
            r.staged_indices.remove(i);
        }
    }
}

impl RenderObj {
    pub fn new(mesh: usize) -> Self {
        Self {
            mesh: MeshIndex::new(mesh),
            model_data: ModelData::default(),
            index: 0,
        }
    }

    #[inline]
    pub fn transform_mut(&mut self) -> &mut Matrix4<f32> {
        &mut self.model_data.transform
    }

    #[inline]
    pub fn transform(&self) -> &Matrix4<f32> {
        &self.model_data.transform
    }

    pub fn set_mesh(&mut self, mesh: usize) {
        self.mesh = MeshIndex::new(mesh);
    }
}

impl Renderer {
    pub fn create_render_obj(&mut self, mesh: usize, staged: bool) -> RenderObjIndex {
        let renderobj = RenderObj::new(mesh);
        let index = self.render_objects.push(renderobj);
        self.render_objects[index].index = index;

        // self.render_objects[index].model_data.obj_index =
        //     (index + 1) as f32 / MAX_MESH_COUNT as f32;

        if staged {
            self.stage_render_obj(index);
        }

        RenderObjIndex(index)
    }

    pub fn destroy_render_obj(&mut self, obj_index: usize) {
        self.unstage_render_obj(obj_index);
        self.render_objects.remove(obj_index);
    }

    pub fn stage_render_obj(&mut self, obj_index: usize) {
        self.staged_indices.push(obj_index as u16);
    }

    pub fn unstage_render_obj(&mut self, obj_index: usize) {
        if let Some((i, _)) = self
            .staged_indices
            .iter()
            .enumerate()
            .find(|(i, ri)| **ri == obj_index as u16)
        {
            self.staged_indices.remove(i);
        }
    }

    #[inline]
    pub fn get_render_obj(&mut self, index: usize) -> &mut RenderObj {
        &mut self.render_objects[index]
    }
}
