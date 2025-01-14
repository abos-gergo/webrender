struct SceneData {
    sun_pos: vec3<f32>,
    width_height_ratio: f32,
    camera: mat4x4<f32>,
    light_source: mat4x4<f32>,
};

@group(0) @binding(0)
var<uniform> scene_data: SceneData;

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

    let out_pos = vec4(in.position, 1.);
    out.clip_position = vec4(out_pos.x, -out_pos.y * scene_data.width_height_ratio, (out_pos.z + 10) / 20, out_pos.w);
    out.color = in.color;
    out.normal = in.normal.xyz;

    // out.clip_position = out.pos_from_light;
    out.tex_coords = in.position.xy * 0.5 + 0.5;
    return out;
}

@group(0) @binding(1)
var s_texture: texture_2d<f32>;

@group(0) @binding(2)
var s_sampler: sampler;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    var obj_index = textureSample(s_texture, s_sampler, in.tex_coords);
    let line_widht = 5.;
    for (var x = -line_widht / 2; x < line_widht / 2.; x += 1.) {
        for (var y = -line_widht / 2; y < line_widht / 2.; y += 1.) {
            let new_obj_index = textureSample(s_texture, s_sampler, in.tex_coords + vec2(x / 1024, y / 1024)).a;
            if obj_index.a != new_obj_index {
                return vec4(0., 1., 0., 1.);
            }
        }
    }

    return vec4(obj_index.rgb, 1.);
}