use std::{
    marker::PhantomData,
    ops::{Index, IndexMut},
    usize,
};

pub struct AlignedArray<T> {
    base_ptr: *mut u8,
    alignment: usize,
    _marker: PhantomData<T>,
}

impl<T> Default for AlignedArray<T> {
    fn default() -> Self {
        Self {
            base_ptr: std::ptr::null_mut(),
            alignment: Default::default(),
            _marker: Default::default(),
        }
    }
}

impl<T> Index<usize> for AlignedArray<T> {
    type Output = T;

    fn index(&self, index: usize) -> &Self::Output {
        unsafe {
            ((self.base_ptr as usize + index * self.alignment) as *const T)
                .as_ref()
                .unwrap()
        }
    }
}

impl<T> IndexMut<usize> for AlignedArray<T> {
    fn index_mut(&mut self, index: usize) -> &mut Self::Output {
        unsafe {
            ((self.base_ptr as usize + index * self.alignment) as *mut T)
                .as_mut()
                .unwrap()
        }
    }
}

impl<T> AlignedArray<T> {
    pub fn new(base_ptr: *mut u8, alignment: usize) -> Self {
        Self {
            base_ptr,
            alignment,
            ..Default::default()
        }
    }
}
