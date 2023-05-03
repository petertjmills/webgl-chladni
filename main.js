import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
	-window.innerWidth / 2,
	window.innerWidth / 2,
	window.innerHeight / 2,
	-window.innerHeight / 2,
	1,
	1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerHeight, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(window.innerHeight, window.innerHeight);
const material = new THREE.ShaderMaterial({
	uniforms: {
		u_time: { value: 0.0 },
		u_resolution: {
			value: new THREE.Vector2(window.innerHeight, window.innerHeight),
		},
		u_mouse: { value: new THREE.Vector2(0.0, 0.0) },
		u_pi: { value: Math.PI },
		u_n: { value: 3 },
		u_m: { value: 4 },
		u_a: { value: -5 },
		u_b: { value: 20 },
    colorOne: { value: new THREE.Color(0xff0000) },
    colorTwo: { value: new THREE.Color(0xffffff) },
    opacityOne: { value: 1.0 },
    opacityTwo: { value: 1.0 },
	},
	vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
      }
      `,
	fragmentShader: `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_pi;
  uniform float u_n;
  uniform float u_m;
  uniform float u_a;
  uniform float u_b;
  uniform vec3 colorOne;
  uniform vec3 colorTwo;
  uniform float opacityOne;
  uniform float opacityTwo;

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    //a*sin(pi*x*n)*sin(pi*y*m) + b*sin(pi*x*m)*sin(pi*y*n)
    float a = u_a*sin(u_time);
    float b = u_b*cos(u_time);

    float n = u_n;
    float m = u_m;

    float x = st.x;
    float y = st.y;

    float r = a*sin(u_pi*x*n)*sin(u_pi*y*m) + b*sin(u_pi*x*m)*sin(u_pi*y*n);
    
    r = 1.0 - r;
    float color = r;

    if (color > 0.0) {
      gl_FragColor = (color-1.0)*vec4(colorOne,opacityOne);
    } else {
      gl_FragColor = (-color-1.0)*vec4(colorTwo,opacityTwo);
    }
  }
    `,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.set(0, 0, 1);

//window sliders for uniforms
const aSlider = document.body.appendChild(document.createElement("input"));
aSlider.type = "range";
aSlider.min = -50;
aSlider.max = 50;
aSlider.value = -5;
aSlider.step = 0.1;
const aLabel = document.body.appendChild(document.createElement("label"));
aSlider.addEventListener("input", () => {
  plane.material.uniforms.u_a.value = aSlider.value;
  aLabel.innerHTML = `a: ${aSlider.value}`;
});


const bSlider = document.body.appendChild(document.createElement("input"));
bSlider.type = "range";
bSlider.min = -50;
bSlider.max = 50;
bSlider.value = 20;
bSlider.step = 0.1;
const bLabel = document.body.appendChild(document.createElement("label"));
bSlider.addEventListener("input", () => {
  plane.material.uniforms.u_b.value = bSlider.value;
  bLabel.innerHTML = `b: ${bSlider.value}`;
});

const nSlider = document.body.appendChild(document.createElement("input"));
nSlider.type = "range";
nSlider.min = 0;
nSlider.max = 10;
nSlider.value = 3;
nSlider.step = 0.1;
const nLabel = document.body.appendChild(document.createElement("label"));
nSlider.addEventListener("input", () => {
  plane.material.uniforms.u_n.value = nSlider.value;
  nLabel.innerHTML = `n: ${nSlider.value}`;
});

const mSlider = document.body.appendChild(document.createElement("input"));
mSlider.type = "range";
mSlider.min = 0;
mSlider.max = 10;
mSlider.value = 4;
mSlider.step = 0.1;
const mLabel = document.body.appendChild(document.createElement("label"));
mSlider.addEventListener("input", () => {
  plane.material.uniforms.u_m.value = mSlider.value;
  mLabel.innerHTML = `m: ${mSlider.value}`;
});

//color picker
const colorOnePicker = document.body.appendChild(document.createElement("input"));
colorOnePicker.type = "color";
colorOnePicker.value = "#ff0000";
const colorOneLabel = document.body.appendChild(document.createElement("label"));
colorOnePicker.addEventListener("input", () => {
  plane.material.uniforms.colorOne.value = new THREE.Color(colorOnePicker.value);
  colorOneLabel.innerHTML = `colorOne: ${colorOnePicker.value}`;
});

const colorTwoPicker = document.body.appendChild(document.createElement("input"));
colorTwoPicker.type = "color";
colorTwoPicker.value = "#ffffff";
const colorTwoLabel = document.body.appendChild(document.createElement("label"));
colorTwoPicker.addEventListener("input", () => {
  plane.material.uniforms.colorTwo.value = new THREE.Color(colorTwoPicker.value);
  colorTwoLabel.innerHTML = `colorTwo: ${colorTwoPicker.value}`;
});

//opacity sliders
const opacityOneSlider = document.body.appendChild(document.createElement("input"));
opacityOneSlider.type = "range";
opacityOneSlider.min = 0;
opacityOneSlider.max = 1;
opacityOneSlider.value = 1;
opacityOneSlider.step = 0.01;
const opacityOneLabel = document.body.appendChild(document.createElement("label"));
opacityOneSlider.addEventListener("input", () => {
  plane.material.uniforms.opacityOne.value = opacityOneSlider.value;
  opacityOneLabel.innerHTML = `opacityOne: ${opacityOneSlider.value}`;
});

const opacityTwoSlider = document.body.appendChild(document.createElement("input"));
opacityTwoSlider.type = "range";
opacityTwoSlider.min = 0;
opacityTwoSlider.max = 1;
opacityTwoSlider.value = 1;
opacityTwoSlider.step = 0.01;
const opacityTwoLabel = document.body.appendChild(document.createElement("label"));
opacityTwoSlider.addEventListener("input", () => {
  plane.material.uniforms.opacityTwo.value = opacityTwoSlider.value;
  opacityTwoLabel.innerHTML = `opacityTwo: ${opacityTwoSlider.value}`;
});

let time = 0;
function animate() {
	requestAnimationFrame(animate);
  plane.material.uniforms.u_time.value = time;
  time += 0.01;
	renderer.render(scene, camera);
}
animate();
