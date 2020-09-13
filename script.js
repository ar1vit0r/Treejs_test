// Inspiração : http://earth.plus360degrees.com/
let scene, camera, renderer;
let earthMesh, cloudMesh;
let listener, sound;

function onResizeScreen(){
	width = window.innerWidth;
	height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

window.addEventListener( 'resize', onResizeScreen, false );
window.onload = function () { onResizeScreen() }

function main() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    listener = new THREE.AudioListener();
    sound = new THREE.Audio( listener );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    createBackground();
    createASphere();
    createAmbientLight();
    createDirectionalLight();
    createAudio();

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 40;
    camera.lookAt(scene.position);   
    camera.add( listener );

    //A canvas where the renderer draws its output.
    //This is automatically created by the renderer in the constructor 
    // (if not provided already); you just need to add it to your page like so:
    document.body.appendChild( renderer.domElement );
    
    animate();
};

function animate() {
    earthMesh.rotation.y += 0.001;
    cloudMesh.rotation.y += 0.001*1.1;
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

function createDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(100,0,0);
        directionalLight.name='directional';
        scene.add(directionalLight);
};

function createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x111111, 1.0);
        ambientLight.name='ambient';
        scene.add(ambientLight);
};

function createEarthMaterial() {
    const earthTexture = new THREE.TextureLoader().load("assets/images/earthmap4k.jpg");
    const normalMap = new THREE.TextureLoader().load("assets/images/earth_normalmap_flat4k.jpg");
    const specularMap = new THREE.TextureLoader().load("assets/images/earthspec4k.jpg");

    const earthMaterial = new THREE.MeshPhongMaterial();

        earthMaterial.map = earthTexture;

        earthMaterial.normalMap = normalMap;
        earthMaterial.normalScale.set(0.5, 0.7);

        earthMaterial.specularMap = specularMap;
        earthMaterial.specular = new THREE.Color(0x262626);

    return earthMaterial;
};

function createCloudMaterial() {
    const cloudTexture = new THREE.TextureLoader().load("assets/images/fair_clouds_4k.png");
    const cloudMaterial = new THREE.MeshPhongMaterial();
        cloudMaterial.map = cloudTexture;
        cloudMaterial.transparent = true;
    return cloudMaterial;
};

function createASphere() {
    const sphereGeometry = new THREE.SphereGeometry(15, 60, 60);
    const sphereMaterial = createEarthMaterial();

        earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        earthMesh.name = 'earth';
        scene.add(earthMesh);

    const cloudGeometry = new THREE.SphereGeometry(15.2, 60, 60);
    const cloudMaterial = createCloudMaterial();

        cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.name = 'clouds';
        scene.add(cloudMesh);
};

function createBackground() {
    const loader = new THREE.TextureLoader();
        loader.load('assets/images/galaxy_starfield.jpg' , function(texture){ scene.background = texture; });
};

function createAudio() {
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'assets/sounds/ambient.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });
};

window.onloadstart = main();