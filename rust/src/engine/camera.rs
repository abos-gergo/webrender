use std::f32::consts::PI;

use nalgebra::{Matrix4, Vector3};
use winit::event::MouseButton;

use crate::engine::{
    event_handler::{EventState, Input},
    transformations::Transformations,
};

#[derive(Debug, Default, Clone, Copy)]
pub struct Camera {
    transform: Matrix4<f32>,
    position: Vector3<f32>,
    scale: f32,
    orbit_origin: Vector3<f32>,
}

impl Camera {
    #[inline]
    pub fn init(position: Vector3<f32>, scale: f32) -> Self {
        Self {
            transform: *Matrix4::identity()
                .rotate_local(PI, 0., 0.)
                .scale_object(scale)
                .translate(position.x, position.y, position.z),
            position,
            scale,
            orbit_origin: Vector3::new(0., 0., 0.),
        }
    }

    #[inline]
    pub fn get_transform(&self) -> &Matrix4<f32> {
        &self.transform
    }

    #[inline]
    pub fn get_position(&self) -> &Vector3<f32> {
        &self.position
    }

    #[inline]
    pub fn scale(&self) -> f32 {
        self.scale
    }

    #[inline]
    pub fn translate_camera(&mut self, translation: Vector3<f32>) -> &mut Self {
        self.transform.translate(translation.x, 0., translation.y);
        self.position += translation;
        self
    }

    #[inline]
    pub fn scale_camera(&mut self, scale: f32) -> &mut Self {
        self.scale *= scale;
        self.transform.scale_object(scale);
        self.transform[12] *= scale;
        self.transform[13] *= scale;
        self.transform[14] *= scale;

        self
    }

    #[inline]
    pub fn cam_move(&mut self) {
        //CAMERA ROTATION
        if Input::mouse_button_state(MouseButton::Middle, EventState::Down) {
            match Input::modif_state().shift_key() {
                true => {
                    self.transform.translate_local(
                        Input::mouse_delta_move().x * 0.005,
                        -Input::mouse_delta_move().y * 0.005,
                        0.,
                    );
                }
                false => {
                    self.transform
                        .orbit_local(
                            -Input::mouse_delta_move().y * 0.015,
                            // -Input::mouse_delta_move().x * 0.015,
                            0.,
                            0.,
                            self.orbit_origin,
                        )
                        .orbit(
                            0.,
                            Input::mouse_delta_move().x * 0.015,
                            0.,
                            self.orbit_origin,
                        );
                }
            }
        }

        // //CAMERA SCALING
        let scale_factor = 1.001_f32.powi(Input::mouse_wheel() as i32);
        // //Scaling constaints
        // //Applying scaling
        self.scale_camera(scale_factor);
    }
}
