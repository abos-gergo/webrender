use nalgebra::Vector2;

pub fn circle_point_collision(
    circle_middle: Vector2<f32>,
    radius: f32,
    point: Vector2<f32>,
) -> bool {
    let res = (circle_middle - point).magnitude_squared() < radius.powi(2);
    res
}
