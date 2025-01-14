/*
 * Public API Surface of rust
 */

export * from './lib/rust.service';
export * from './lib/rust.component';
import init from './lib/render_engine/pkg'
export {init as initRenderer};
