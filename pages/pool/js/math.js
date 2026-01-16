import * as THREE from '../../lib/three.module.min.js';

export const normalVector3XAxis = new THREE.Vector3(1, 0, 0);
export const normalVector3YAxis = new THREE.Vector3(0, 1, 0);
export const normalVector3ZAxis = new THREE.Vector3(0, 0, 1);

export function degreesToRad(angle){
    return angle * (Math.PI / 180);
};

export function radToDegrees(angle){
    return angle * (180 / Math.PI);
};