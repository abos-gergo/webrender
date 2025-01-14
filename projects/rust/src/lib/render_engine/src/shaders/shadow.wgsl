struct SceneData {
    light_source: mat4x4<f32>,
};

@group(0) @binding(0)
var<uniform> scene_data: SceneData;

struct ModelData {
    transform: mat4x4<f32>,
    obj_index: f32,
};

@group(1) @binding(0)
var<uniform> model_data: ModelData;

struct VertexInput {
    @location(0) pos: vec3<f32>,
    @location(1) color: vec3<f32>,
    @location(2) normal: vec3<f32>,
};

struct VertexOut {
    @builtin(position) pos: vec4<f32>,
    @location(0) obj_index: f32,
    @location(1) color: vec3<f32>,
};

@vertex
fn vs_main(in: VertexInput) -> VertexOut {
    var out: VertexOut;
    out.pos = scene_data.light_source * model_data.transform * vec4(in.pos, 1.);
    out.pos.z = (out.pos.z + 10) / 20;
    out.obj_index = model_data.obj_index;
    out.color = abs(in.normal);
    return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
    return vec4(in.color, in.obj_index);
}

