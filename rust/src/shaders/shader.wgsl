struct SceneData {
    sun_pos: vec3<f32>,
    width_height_ratio: f32,
    camera: mat4x4<f32>,
    light_source: vec3<f32>,
};

struct ModelData {
    transform: mat4x4<f32>,
    obj_index: f32,
};

@group(0) @binding(0)
var<uniform> scene_data: SceneData;

@group(1) @binding(0)
var<uniform> model_data: ModelData;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>,
    @location(2) normal: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) color: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) tex_coords: vec2<f32>,
    @location(3) light_source: vec3<f32>,
};

@vertex
fn vs_main(
    in: VertexInput,
) -> VertexOutput {
    var out: VertexOutput;
    var out_pos = scene_data.camera * model_data.transform * vec4(in.position, 1.);
    out.clip_position = vec4(out_pos.x, out_pos.y * scene_data.width_height_ratio, (out_pos.z + 10) / 20, out_pos.w);
    out.color = in.color;
    out.normal = (scene_data.camera * vec4(in.normal, 1.)).xyz;
    out.light_source = vec3(0., 0., -1.);
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    var light = dot(normalize(in.normal), in.light_source);
    return vec4(in.color * light / 5 * 3 + in.color / 5 * 2, 1.);
}