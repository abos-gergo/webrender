use crate::scene::Scene;

use super::Engine;

pub enum EngineOp {
    NewScene,
    ChangeScene(usize),
}

impl Engine {
    pub fn manage_engine_ops(&mut self, engine_ops: &[EngineOp]) {
        engine_ops.iter().for_each(|op| match *op {
            EngineOp::NewScene => self.scenes.push(Scene::default()),
            EngineOp::ChangeScene(i) => self.current_scene = i,
        });
    }
}
