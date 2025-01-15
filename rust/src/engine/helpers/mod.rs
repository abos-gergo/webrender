use std::mem::size_of;

pub mod aligned_array;
pub mod collisions;
pub mod object_vector;
pub mod staging;

pub trait NoneValue {
    fn is_none(&self) -> bool;
    fn set_to_none(&mut self);
}

pub trait AsByteSlice {
    fn as_byte_slice(&self) -> &[u8];
}

impl<T> AsByteSlice for &[T] {
    fn as_byte_slice(&self) -> &[u8] {
        unsafe {
            std::slice::from_raw_parts(self.as_ptr() as *const u8, self.len() * size_of::<T>())
        }
    }
}

impl<T> AsByteSlice for &T {
    fn as_byte_slice(&self) -> &[u8] {
        unsafe { std::slice::from_raw_parts(*self as *const _ as *const u8, size_of::<T>()) }
    }
}

impl<T> AsByteSlice for [T] {
    fn as_byte_slice(&self) -> &[u8] {
        unsafe {
            std::slice::from_raw_parts(self.as_ptr() as *const u8, self.len() * size_of::<T>())
        }
    }
}
