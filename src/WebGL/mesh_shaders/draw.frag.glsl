precision mediump float;

uniform sampler2D u_mesh;
// attribute vec2 a_pos;
uniform float u_width;
uniform float u_height;
varying vec2 v_index;

void main() {
   gl_FragColor = vec4(texture2D(
        u_mesh, 
        vec2(v_index.x / u_width, v_index.y / u_height)).r/2.0, 
        texture2D(
        u_mesh, 
        vec2(v_index.x / u_width, v_index.y / u_height)).r/2.0, 
        texture2D(
        u_mesh, 
        vec2(v_index.x / u_width, v_index.y / u_height)).r, 
        0.5);
//    gl_FragColor = texture2D(
//         u_mesh, 
//         vec2(v_index.x / u_width, v_index.y / u_height));
}