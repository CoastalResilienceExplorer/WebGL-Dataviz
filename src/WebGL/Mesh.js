
import * as util from './util';

import drawVert from './mesh_shaders/draw.vert.glsl?raw';
import drawFrag from './mesh_shaders/draw.frag.glsl?raw';

import meshData from '../data/metadata_t0_zs.json';
import maplibregl from 'maplibre-gl'
// import img from '../data/img_t0.png';

let animationID;

const defaultRampColors = {
    0.0: '#3288bd00', // Hide 0 flow pixels
    // 0.05: '#3288bd', // Hide 0 flow pixels
    0.1: '#d53e4f',
    0.2: '#d53e4f',
    0.3: '#d53e4f',
    0.4: '#d53e4f',
    // 0.5: '#fdae61',
    // 0.6: '#d53e4f',
    1.0: '#d53e4f00' // Transparency HACK
};

function updateTexture(gl, texture, video, level) {
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        video
    );
}


function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        // image.addEventListener("load", () => {
        //     resolve(image);
        // });
        if (image.complete) {
            console.log(image)
            resolve(image)
        }
        else {
            image.onload = () => resolve(image)
        }
        image.src = url;
    });
}

export class MeshGL {
    constructor() {
        console.log('init mesh')
    }

    setColorRamp(colors) {
        // lookup texture for colorizing the particles according to their speed
        this.colorRampTexture = util.createTexture(this.gl, this.gl.LINEAR, getColorRamp(colors), 16, 16);
    }

    onAddVideo(map, gl) {
        console.log('added')
        this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
        // const url = '/img_t0_zs.png' // In public folder
        // const image = loadImage(url)

        // const url = '/animation.mp4' // In public folder
        // const image = loadImage(url)
        const r = document.getElementById('video')
        // r.playsInline = true;
        // r.muted = true;
        // r.loop = true;
        // r.play()
        console.log(meshData)
        this.meshData = meshData
        this.meshData.image = r;
        this.nVerts = (r.width - 1) * (r.height - 1)
        this.indices = [];
        const step = 2
        for (let i = 0; i < r.width - 1; i += step) {
            for (let j = 0; j < r.height - 1; j += step) {
                this.indices.push(i * 1.0)
                this.indices.push(j * 1.0)
            }
        }
        this.meshTexture = util.createTexture(gl, gl.LINEAR, this.meshData.image);
        console.log(this.indices.length)
        this.indexBuffer = util.createBuffer(gl, new Float32Array(this.indices));
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        const program = this.drawProgram;
        console.log(program)
        gl.useProgram(program.program);
        const ll = maplibregl.MercatorCoordinate.fromLngLat({
            lng: -64.74840398683924,
            lat: 17.77621879686222,
        });
        const ur = maplibregl.MercatorCoordinate.fromLngLat({
            lng: -64.73374196267778,
            lat: 17.783984953353503
        });
        console.log(ll)
        // gl.viewport(ll.x, ll.y, ur.x, ur.y);
        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        console.log(this.meshData)
        const scale = 0.000005

        util.bindTexture(gl, this.meshTexture, 1);
        gl.uniform1i(program.u_mesh, 1);
        gl.uniform1f(program.u_left, ll.x);
        gl.uniform1f(program.u_right, ur.x);
        gl.uniform1f(program.u_bottom, ll.y);
        gl.uniform1f(program.u_top, ur.y);
        gl.uniform1f(program.u_width, this.meshData.image.width);
        gl.uniform1f(program.u_height, this.meshData.image.height);
        gl.uniform1f(program.u_minz, this.meshData.zMin);
        gl.uniform1f(program.u_maxz, this.meshData.zMax);
        gl.uniform1f(program.u_scale, scale);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuffer);
        var coord = gl.getAttribLocation(program.program, "a_pos");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 8, 0);
        gl.enableVertexAttribArray(coord);
    }

    onAdd(map, gl) {
        console.log('added')
        this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
        const url = '/img_t0_zs.png' // In public folder
        const image = loadImage(url)

        console.log(image)
        console.log(meshData)
        this.meshData = meshData
        image.then(r => {
            console.log(r)
            this.meshData.image = r;
            this.nVerts = (r.width - 1) * (r.height - 1)
            this.indices = [];
            const step = 1
            for (let i = 0; i < r.width - 1; i += step) {
                for (let j = 0; j < r.height - 1; j += step) {
                    this.indices.push(i * 1.0)
                    this.indices.push(j * 1.0)
                }
            }
            this.meshTexture = util.createTexture(gl, gl.LINEAR, this.meshData.image);
            console.log(this.indices.length)
            this.indexBuffer = util.createBuffer(gl, new Float32Array(this.indices));
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.STENCIL_TEST);
            const program = this.drawProgram;
            console.log(program)
            gl.useProgram(program.program);
            const ll = maplibregl.MercatorCoordinate.fromLngLat({
                lng: -64.74840398683924,
                lat: 17.77621879686222,
            });
            const ur = maplibregl.MercatorCoordinate.fromLngLat({
                lng: -64.73374196267778,
                lat: 17.783984953353503
            });
            console.log(ll)
            // gl.viewport(ll.x, ll.y, ur.x, ur.y);
            // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            console.log(this.meshData)
            const scale = 0.000005

            util.bindTexture(gl, this.meshTexture, 1);
            gl.uniform1i(program.u_mesh, 1);
            gl.uniform1f(program.u_left, ll.x);
            gl.uniform1f(program.u_right, ur.x);
            gl.uniform1f(program.u_bottom, ll.y);
            gl.uniform1f(program.u_top, ur.y);
            gl.uniform1f(program.u_width, this.meshData.image.width);
            gl.uniform1f(program.u_height, this.meshData.image.height);
            gl.uniform1f(program.u_minz, this.meshData.zMin);
            gl.uniform1f(program.u_maxz, this.meshData.zMax);
            gl.uniform1f(program.u_scale, scale);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuffer);
            var coord = gl.getAttribLocation(program.program, "a_pos");
            gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 8, 0);
            gl.enableVertexAttribArray(coord);
        })

    }

    render(gl, matrix) {
        console.log(this)
        const program = this.drawProgram.program
        const indices = this.indices
        const texture = this.meshTexture
        const video = this.meshData.image
        if (animationID) cancelAnimationFrame(animationID);
        function draw() {
            gl.useProgram(program);
            gl.uniformMatrix4fv(
                gl.getUniformLocation(program, 'u_matrix'),
                false,
                matrix
            );
            updateTexture(gl, texture, video, 0)
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.drawArrays(gl.POINTS, 0, indices.length / 2);
            animationID = requestAnimationFrame(draw)
        }
        draw()
    }

    get_layer() {
        return {
            id: 'mesh',
            type: 'custom',
            onAdd: this.onAddVideo,
            // onAdd: this.onAdd,
            render: this.render
        }
    }



}

function getColorRamp(colors) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 256;
    canvas.height = 1;

    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    for (const stop in colors) {
        gradient.addColorStop(+stop, colors[stop]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);

    return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}