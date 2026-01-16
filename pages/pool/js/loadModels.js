import { GLTFLoader } from '../../lib/GLTFLoader.js';
const loader = new GLTFLoader();

export default function loadModels(scene){
    loader.load('./models/poolTable.glb',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);
    
            // model.position.set(0, 0, 0);
            // model.scale.set(1, 1, 1);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );
    
    loader.load('./models/cueball.glb',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);
    
            model.scale.set(.5, .5, .5);
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