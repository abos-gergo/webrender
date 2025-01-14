#[derive(Default)]
pub struct Globals {
    pub(super) delta_time: f32,
}

impl Globals {
    pub fn delta_time(&self) -> f32 {
        self.delta_time
    }
}
