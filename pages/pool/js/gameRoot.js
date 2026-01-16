import * as THREE from '../../lib/three.module.min.js';

import loadModels from './loadModels.js';
import * as math from './math.js';
import { inputMap } from './controls.js';

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

loadModels(scene);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const WorldOrigin = new THREE.Object3D();

// try model

// LOAD MODELS *******************************************************************************************


// Add a cube
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// cube.position.x = 1;
// cube.position.z = -1;
// scene.add(cube);

// CAMERA SETTINGS *******************************************************************************************
const cameraSpeed = .05;
const cameraRotateSpeed = 1.5;//degrees
// camera.position.z = -2;
// camera.rotateY(-Math.PI / 2);

// LIGHT*******************************************************************************************
// const ambient = new THREE.AmbientLight(0xffffff, 3);
// ambient.position.y = 2;
// scene.add(ambient);

const lights = Array.from(new Array(3), () => new THREE.DirectionalLight(0xffffff, 2));
for(const light of lights){ light.position.y = 3; }
lights[0].z = 1;
lights[2].z = -1;
for(const light of lights){ scene.add(light); }
// light.position.y = 3;
// light.target = WorldOrigin;
// 

function animate() {
    if(inputMap.w){
        const moveDirection = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(cameraSpeed);
        camera.position.add(moveDirection);
    }
    else if(inputMap.s){
        const moveDirection = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-cameraSpeed);
        camera.position.add(moveDirection);
    }

    if(inputMap.a){
        const lookDirection = camera.getWorldDirection(new THREE.Vector3());
        const axisToMoveOn = lookDirection.cross(math.normalVector3YAxis).multiplyScalar(-cameraSpeed);
        camera.position.add(axisToMoveOn);
    }
    else if(inputMap.d){
        const lookDirection = camera.getWorldDirection(new THREE.Vector3());
        const axisToMoveOn = lookDirection.cross(math.normalVector3YAxis).multiplyScalar(cameraSpeed);
        camera.position.add(axisToMoveOn);
    }

    if(inputMap.f){ camera.position.y += cameraSpeed; }
    if(inputMap.v){ camera.position.y += -cameraSpeed; }

    if(inputMap.arrowup){
        const lookDirection = camera.getWorldDirection(new THREE.Vector3());
        const axisToRotateOn = lookDirection.cross(math.normalVector3YAxis);
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle( axisToRotateOn, math.degreesToRad(cameraRotateSpeed) ));
    }
    else if(inputMap.arrowdown){
        const lookDirection = camera.getWorldDirection(new THREE.Vector3());
        const axisToRotateOn = lookDirection.cross(math.normalVector3YAxis);
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle( axisToRotateOn, math.degreesToRad(-cameraRotateSpeed) ));
    }

    if(inputMap.arrowleft){ camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle( math.normalVector3YAxis, math.degreesToRad(cameraRotateSpeed) )); }
    else if(inputMap.arrowright){ camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle( math.normalVector3YAxis, math.degreesToRad(-cameraRotateSpeed) )); }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();