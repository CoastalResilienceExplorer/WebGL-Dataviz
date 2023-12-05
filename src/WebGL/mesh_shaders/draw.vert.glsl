precision mediump float;

uniform sampler2D u_mesh;
uniform mat4 u_matrix;
uniform float u_left;
uniform float u_right;
uniform float u_top;
uniform float u_bottom;
uniform float u_width;
uniform float u_height;
uniform float u_minz;
uniform float u_maxz;
uniform float u_scale;

attribute vec2 a_pos;

varying vec2 v_index;

const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

void main() {
    v_index = a_pos;
    float height = texture2D(
        u_mesh, 
        vec2(v_index.x / u_width, v_index.y / u_height)).r / 255.0 * u_maxz;
    // float height = texture2D(u_mesh, v_index).r;
    // float height = rand(v_index);
    // float geo_width = u_right - u_left
    // float geo_height = u_top - u_bottom

    // vec4 height = texture2D(u_particles, vec2(
    //     fract(a_index / u_particles_res),
    //     floor(a_index / u_particles_res) / u_particles_res));

    // // decode current particle position from the pixel's RGBA value
    // v_particle_pos = vec2(
    //     color.r / 255.0 + color.b,
    //     color.g / 255.0 + color.a);

    // gl_PointSize = 3.0;
    // gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);
    gl_PointSize = 10.0;
    // gl_Position = vec4(
    //     0.2,0.2,0,1);
    gl_Position = u_matrix * vec4(
        u_left + (u_right - u_left) * (v_index.x / u_width),
        u_bottom + (u_top - u_bottom) * (v_index.y / u_height),
        height * u_scale, 1);
}