import * as THREE from '../../lib/three.module.min.js';
import { GLTFLoader } from '../../lib/GLTFLoader.js';
const loader = new GLTFLoader();

class PoolTable{
    constructor(scene){
        loader.load('./models/poolTable.glb',
            (gltf) => {
                const model = gltf.scene;
                scene.add(model);
            },
            undefined,
            (error) => console.error('Error loading model:', error)
        );

        this.center = new THREE.Vector3();

        this.cueBallPosition = new THREE.Vector3(0, .03175, .762);
    };
};

export default function loadModels(scene){
    const poolTable = new PoolTable(scene);
    
    console.log(poolTable.cueBallPosition)
    loader.load('./models/cueball.glb',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(.5, .5, .5);
            model.position.set(poolTable.cueBallPosition.x, poolTable.cueBallPosition.y, poolTable.cueBallPosition.z);

            scene.add(model);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );
    
    loader.load('./models/oneball.glb',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);
    
            model.position.set(.0635, 0, 0);
            model.scale.set(.5, .5, .5);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );
};