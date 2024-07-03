// Cena, câmera e renderizador
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc); // Define a cor de fundo

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Verifica se OrbitControls está disponível
if (typeof THREE.OrbitControls === 'undefined') {
    console.error('OrbitControls não está disponível.');
} else {
    // Controles de órbita
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
}

// Adicione luz à cena
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Criação de um cubo
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Adicione as arestas do cubo
var edges = new THREE.EdgesGeometry(geometry);
var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
var line = new THREE.LineSegments(edges, lineMaterial);
scene.add(line);

// Posição da câmera
camera.position.z = 5;

// Raycaster e vetor do mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Objeto atualmente intersectado
var INTERSECTED;

// Event listener para capturar o movimento do mouse
window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
    // Converta as coordenadas do mouse para o sistema de coordenadas normalizado
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// Função para detectar a intersecção
function checkIntersections() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.color.set(0x00ff00); // Restaura a cor original
            INTERSECTED = intersects[0].object;
            INTERSECTED.material.color.set(0xff0000); // Define a nova cor
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.color.set(0x00ff00); // Restaura a cor original
        INTERSECTED = null;
    }
}

// Atualiza as dimensões do cubo
function updateCubeDimensions() {
    var width = parseFloat(document.getElementById('widthSlider').value);
    var height = parseFloat(document.getElementById('heightSlider').value);
    var depth = parseFloat(document.getElementById('depthSlider').value);

    // Atualiza os valores exibidos
    document.getElementById('widthValue').innerText = width;
    document.getElementById('heightValue').innerText = height;
    document.getElementById('depthValue').innerText = depth;

    // Atualiza a geometria do cubo
    cube.geometry.dispose();
    cube.geometry = new THREE.BoxGeometry(width, height, depth);

    // Atualiza as arestas
    scene.remove(line);
    edges = new THREE.EdgesGeometry(cube.geometry);
    line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);
}

// Adiciona event listeners aos sliders
document.getElementById('widthSlider').addEventListener('input', updateCubeDimensions);
document.getElementById('heightSlider').addEventListener('input', updateCubeDimensions);
document.getElementById('depthSlider').addEventListener('input', updateCubeDimensions);

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update(); // Atualiza os controles se estiverem disponíveis
    checkIntersections();
    renderer.render(scene, camera);
}
animate();
