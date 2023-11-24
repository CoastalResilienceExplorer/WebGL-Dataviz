import maplibregl from "maplibre-gl";
import { data as t0 } from "../data/output_triangles_0";
import { data as t1 } from "../data/output_triangles_1";
import { data as t2 } from "../data/output_triangles_2";
import { data as t3 } from "../data/output_triangles_3";

console.log('xxx')
// create a custom style layer to implement the WebGL content
export const highlightLayer = {
    id: 'highlight',
    type: 'custom',

    // method called when the layer is added to the map
    // Search for StyleImageInterface in https://maplibre.org/maplibre-gl-js/docs/API/
    onAdd(map, gl) {
        // create GLSL source for vertex shader
        const vertexSource = `#version 300 es

        uniform mat4 u_matrix;
        in vec3 a_pos;
        void main() {
            gl_Position = u_matrix * vec4(a_pos, 1.0);
        }`;

        // create GLSL source for fragment shader
        const fragmentSource = `#version 300 es

        out highp vec4 fragColor;
        void main() {
            fragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;

        // create a vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        // create a fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        // link the two shaders into a WebGL program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        this.aPos = gl.getAttribLocation(this.program, 'a_pos');

        // define vertices of the triangle to be rendered in the custom style layer
        const helsinki = maplibregl.MercatorCoordinate.fromLngLat({
            lng: 25.004,
            lat: 60.239
        });
        const berlin = maplibregl.MercatorCoordinate.fromLngLat({
            lng: 13.403,
            lat: 52.562
        });
        const kyiv = maplibregl.MercatorCoordinate.fromLngLat({
            lng: 30.498,
            lat: 50.541
        });
        const usvi = maplibregl.MercatorCoordinate.fromLngLat({
            lng: -64.743903,
            lat: 17.778743
        });

        // create and initialize a WebGLBuffer to store vertex and color data

    },

    // method fired on each animation frame
    render(gl, matrix, t = 0) {
        let data;
        console.log(t)
        switch (t) {
            case 0:
                data = t0
            case 1:
                data = t1
            case 2:
                data = t2
            case 3:
                data = t3
        }
        console.log('render')
        gl.useProgram(this.program);
        if (!this.buffer) {
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        }
        else {
            gl.deleteBuffer(this.buffer)
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        }
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
                data
            ),
            gl.STATIC_DRAW
        );
        gl.uniformMatrix4fv(
            gl.getUniformLocation(this.program, 'u_matrix'),
            false,
            matrix
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(this.aPos);
        gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.drawArrays(gl.TRIANGLES, 0, data.length/6);
        gl.drawArrays(gl.LINES, 0, data.length / 6);
        // setTimeout(() => this.render(gl, matrix, ++t % 4), 5000)
    }
};