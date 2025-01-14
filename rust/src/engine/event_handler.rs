use nalgebra::Vector2;
use winit::{
    event::{ElementState, MouseButton},
    keyboard::{KeyCode, ModifiersState},
};

static mut INPUT: Input = Input::init();

pub struct Input {
    pub keys: [EventState; 193],
    pub modifier: ModifiersState,
    pub mouse: Mouse,
    last_modified_keys: Vec<u8>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum EventState {
    Pressed,
    Released,
    Up,
    Down,
}

impl Input {
    pub const fn init() -> Self {
        let keys = [EventState::Released; 193];
        Self {
            keys,
            modifier: ModifiersState::empty(),
            last_modified_keys: Vec::new(),
            mouse: Mouse {
                buttons: [EventState::Released; 3],
                pos: Vector2::new(0., 0.),
                delta_move: Vector2::new(0., 0.),
                wheel: 0.,
            },
        }
    }

    #[inline]
    pub(super) fn set_modif(modif: ModifiersState) {
        unsafe { INPUT.modifier = modif }
    }

    #[inline]
    pub(super) fn handle_key_press(key: Option<KeyCode>, state: ElementState) {
        if let Some(key) = key {
            match state {
                ElementState::Pressed => unsafe {
                    INPUT.keys[key as usize] = EventState::Pressed;
                },
                ElementState::Released => unsafe {
                    INPUT.keys[key as usize] = EventState::Released;
                },
            }
            unsafe { INPUT.last_modified_keys.push(key as u8) }
        }
    }

    #[inline]
    pub(super) fn handle_mouse_move(x: f64, y: f64) {
        unsafe { INPUT.mouse.delta_move.x = x as f32 - INPUT.mouse.pos.x };
        unsafe { INPUT.mouse.delta_move.y = y as f32 - INPUT.mouse.pos.y };
        unsafe { INPUT.mouse.pos.x = x as f32 };
        unsafe { INPUT.mouse.pos.y = y as f32 };
    }

    #[inline]
    pub(super) fn handle_mouse_press(button: MouseButton, state: ElementState) {
        match state {
            ElementState::Pressed => unsafe {
                INPUT.mouse.buttons[Self::get_mouse_button_index(button)] = EventState::Pressed;
            },
            ElementState::Released => unsafe {
                INPUT.mouse.buttons[Self::get_mouse_button_index(button)] = EventState::Released;
            },
        }
    }

    #[inline]
    pub(super) fn handle_mouse_wheel(scroll_y: f32) {
        unsafe { INPUT.mouse.wheel += scroll_y };
    }

    #[inline]
    pub(super) fn refresh() {
        unsafe { INPUT.mouse.delta_move.x = 0. };
        unsafe { INPUT.mouse.delta_move.y = 0. };
        unsafe { INPUT.mouse.wheel = 0. };

        unsafe {
            INPUT
                .last_modified_keys
                .iter()
                .for_each(|k| match INPUT.keys[*k as usize] {
                    EventState::Pressed => INPUT.keys[*k as usize] = EventState::Down,
                    EventState::Released => INPUT.keys[*k as usize] = EventState::Up,
                    _ => (),
                })
        };

        unsafe { INPUT.last_modified_keys.clear() };

        unsafe {
            INPUT.mouse.buttons.iter_mut().for_each(|b| match b {
                EventState::Pressed => *b = EventState::Down,
                EventState::Released => *b = EventState::Up,
                _ => (),
            })
        };
    }

    #[inline]
    pub fn modif_state() -> ModifiersState {
        unsafe { INPUT.modifier }
    }

    #[inline]
    pub fn key_state(key: KeyCode, state: EventState) -> bool {
        match state {
            EventState::Pressed | EventState::Released => unsafe {
                INPUT.keys[key as usize] == state
            },
            EventState::Up => unsafe {
                INPUT.keys[key as usize] == EventState::Up
                    || INPUT.keys[key as usize] == EventState::Released
            },
            EventState::Down => unsafe {
                INPUT.keys[key as usize] == EventState::Down
                    || INPUT.keys[key as usize] == EventState::Pressed
            },
        }
    }

    #[inline]
    pub fn mouse_button_state(button: MouseButton, state: EventState) -> bool {
        match state {
            EventState::Pressed | EventState::Released => {
                Input::get_mouse_button_state(button) == state
            }
            EventState::Up => {
                Self::get_mouse_button_state(button) == EventState::Up
                    || Self::get_mouse_button_state(button) == EventState::Released
            }
            EventState::Down => {
                Self::get_mouse_button_state(button) == EventState::Down
                    || Self::get_mouse_button_state(button) == EventState::Pressed
            }
        }
    }

    #[inline]
    pub fn mouse_wheel() -> f32 {
        unsafe { INPUT.mouse.wheel }
    }

    #[inline]
    pub fn mouse_delta_move() -> Vector2<f32> {
        unsafe { INPUT.mouse.delta_move }
    }

    // TODO store window pos in event handler
    // #[inline]
    // pub fn get_relative_mouse_position(base: &Base) -> Vector2<f32> {
    //     Vector2::new(
    //         (unsafe { INPUT.mouse.pos.x } / base.window.inner_size().width as f32) * 2. - 1.,
    //         (unsafe { INPUT.mouse.pos.y } / base.window.inner_size().height as f32) * 2. - 1.,
    //     )
    // }

    fn get_mouse_button_state(button: MouseButton) -> EventState {
        unsafe { INPUT.mouse.buttons[*(&button as *const _ as *const u8) as usize] }
    }

    pub fn get_mouse_button_index(button: MouseButton) -> usize {
        unsafe { *(&button as *const _ as *const u8) as usize }
    }
}

pub struct Mouse {
    pub buttons: [EventState; 3],
    pub pos: Vector2<f32>,
    pub delta_move: Vector2<f32>,
    pub wheel: f32,
}
